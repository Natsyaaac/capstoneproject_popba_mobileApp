/**
 * @fileOverview Offline Detection and Management Service
 * @description Mendeteksi status internet dan menampilkan layar offline (tampilannya sama dengan 404.html)
 * @version 1.1.0
 */
/*jshint esversion: 8 */
/* globals $, PlatformService */

const OfflineService = (function () {
    'use strict';

    let isOnline = navigator.onLine;
    let offlineOverlayElement = null;
    let checkInterval = null;
    let listeners = [];
    let lastOnlineCheck = Date.now();
    const CHECK_INTERVAL = 5000;
    const PING_TIMEOUT = 5000;

    // Web: cek ke file kecil di server game sendiri, jadi tidak bergantung pada google.com
    // (di jaringan yang memfilter google.com, layar offline tidak akan mau hilang kalau cek ke google).
    // Nama parameter "cek-koneksi" dikenali sw.js: permintaan itu langsung ke jaringan dan tidak di-cache.
    const PING_URL_OWN = 'assets/images/balloon-favicon.ico';
    const PING_PARAM = 'cek-koneksi';
    // Cordova / Electron: tidak ada "server sendiri" (file:// atau https://localhost berisi file lokal
    // yang selalu ada walau offline), jadi tetap memakai situs luar.
    const PING_URL_EXTERNAL = 'https://www.google.com/favicon.ico';

    // true = aman mengecek ke server game sendiri (web biasa di http/https)
    function usesOwnServer() {
        const protocol = window.location.protocol;
        const host = window.location.hostname;

        if (protocol !== 'http:' && protocol !== 'https:') {
            return false; // file://, app:// (Electron / Cordova)
        }
        if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') {
            return false; // Cordova Android (https://localhost) atau server lokal
        }
        if (window.PlatformService &&
            (window.PlatformService.isCordova() || window.PlatformService.isElectron())) {
            return false;
        }
        return true;
    }

    function getPingUrl() {
        if (usesOwnServer()) {
            return PING_URL_OWN + '?' + PING_PARAM + '=' + Date.now();
        }
        return PING_URL_EXTERNAL + '?t=' + Date.now();
    }

    function init() {
        createOfflineOverlay();
        bindEvents();

        if (!isOnline) {
            // Game dibuka saat perangkat sudah offline (misalnya dari cache). Tidak akan ada event "offline"
            // karena koneksinya tidak berubah, jadi layar offline ditampilkan sekarang.
            showOfflineOverlay();
        } else if (usesOwnServer()) {
            // Wi-Fi tersambung tapi tidak ada internet: navigator.onLine tetap true. Cek ke server game sendiri.
            checkOnlineStatus().then(function (online) {
                if (!online) {
                    setOnlineStatus(false);
                }
            });
        }

        startPeriodicCheck();
        console.log('OfflineService initialized. Online:', isOnline);
    }

    function createOfflineOverlay() {
        if (document.getElementById('offline-overlay')) {
            offlineOverlayElement = document.getElementById('offline-overlay');
            return;
        }

        // Layar ini sengaja mandiri (tanpa Font Awesome / Bootstrap dari CDN) karena justru dipakai saat
        // internet mati, ketika file dari CDN tidak bisa dimuat. Ikon memakai gambar POPBA dan SVG.
        const overlay = document.createElement('div');
        overlay.id = 'offline-overlay';
        overlay.setAttribute('role', 'alertdialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'offline-title');
        overlay.setAttribute('aria-describedby', 'offline-message');
        overlay.innerHTML = `
            <div class="offline-content">
                <div class="offline-icon">
                    <img src="assets/images/icon.png" width="1024" height="1024"
                        alt="Ikon PopBA - Pop Balon Ajaib" decoding="async">
                </div>
                <div class="offline-chip"><span class="offline-dot"></span>Tidak ada internet</div>
                <h2 class="offline-title" id="offline-title">Yah, internetnya putus!</h2>
                <p class="offline-message" id="offline-message">
                    POPBA butuh internet supaya bisa dimainkan.
                    Nyalakan Wi-Fi atau data seluler, lalu tekan Coba Lagi.
                </p>
                <button type="button" id="retry-connection" class="offline-btn">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M21 12a9 9 0 1 1-2.64-6.36"></path>
                        <path d="M21 4v5h-5"></path>
                    </svg>
                    <span id="retry-connection-text">Coba Lagi</span>
                </button>
                <p class="offline-hint" id="offline-hint" role="status" aria-live="polite"></p>
            </div>
        `;

        // Catatan: di dalam game 1rem = 10px (style.css memakai html { font-size: 62.5% }),
        // karena itu semua ukuran di sini memakai px, bukan rem.
        const style = document.createElement('style');
        style.textContent = `
            #offline-overlay, #offline-overlay * {
                box-sizing: border-box;
            }
            #offline-overlay {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 99999;
                display: none;
                overflow-y: auto;
                padding: 20px 16px;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                font-family: 'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                color: #4b4570;
                background: linear-gradient(to bottom, #86cdff, #c6ebff 55%, #fbf0fc);
            }
            body.night-mode #offline-overlay {
                color: #e8e6f0;
                background: linear-gradient(to bottom, #0a0a15, #1a1a3e 55%, #4a5a70);
            }
            #offline-overlay.visible {
                display: flex;
                opacity: 1;
            }
            #offline-overlay .offline-content {
                width: 100%;
                max-width: 520px;
                margin: auto;
                padding: clamp(22px, 4.5vh, 40px) clamp(18px, 5vw, 40px) clamp(22px, 4vh, 34px);
                text-align: center;
                background: rgba(255, 255, 255, 0.93);
                border: 2px solid rgba(255, 255, 255, 0.9);
                border-radius: 28px;
                box-shadow: 0 18px 50px rgba(36, 80, 140, 0.28);
            }
            body.night-mode #offline-overlay .offline-content {
                background: linear-gradient(160deg, rgba(45, 45, 90, 0.94), rgba(26, 26, 62, 0.96));
                border-color: #4a4a7a;
                box-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
            }
            #offline-overlay .offline-icon {
                width: clamp(96px, 24vh, 160px);
                aspect-ratio: 1 / 1;
                margin: 0 auto clamp(10px, 2vh, 18px);
                border-radius: 26%;
                border: 4px solid #fff;
                background: #86cdff;
                overflow: hidden;
                box-shadow: 0 10px 24px rgba(30, 60, 120, 0.32);
                animation: offline-float 3.4s ease-in-out infinite;
            }
            body.night-mode #offline-overlay .offline-icon {
                border-color: #8b7bb5;
            }
            #offline-overlay .offline-icon img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
                -webkit-user-drag: none;
                user-select: none;
            }
            #offline-overlay .offline-chip {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 5px 14px;
                margin: 0 0 10px;
                border-radius: 999px;
                font-size: 14px;
                font-weight: 800;
                letter-spacing: 0.02em;
                color: #5a479a;
                background: rgba(144, 140, 217, 0.18);
            }
            body.night-mode #offline-overlay .offline-chip {
                color: #ffe066;
                background: rgba(255, 224, 102, 0.13);
            }
            #offline-overlay .offline-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #e5484d;
                animation: offline-pulse 1.8s ease-in-out infinite;
            }
            #offline-overlay .offline-title {
                margin: 0 0 10px;
                padding: 0;
                font-family: 'Whale I Tried', 'Nunito', system-ui, sans-serif;
                font-weight: 400;
                font-size: clamp(30px, 7vw, 43px);
                line-height: 1.12;
                color: #a2529a;
                text-shadow: none;
                text-wrap: balance;
            }
            body.night-mode #offline-overlay .offline-title {
                color: #ffe066;
                text-shadow: 2px 2px 0 #4a4a7a, 0 0 18px rgba(255, 224, 102, 0.3);
            }
            #offline-overlay .offline-message {
                max-width: 40ch;
                margin: 0 auto 18px;
                padding: 0;
                font-size: clamp(16px, 3.6vw, 18px);
                font-weight: 600;
                line-height: 1.55;
                color: inherit;
                text-wrap: balance;
            }
            #offline-overlay .offline-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 9px;
                min-width: 150px;
                min-height: 52px;
                padding: 12px 26px;
                border: 2px solid transparent;
                border-radius: 16px;
                font-family: inherit;
                font-size: 19px;
                font-weight: 800;
                line-height: 1.1;
                color: #fff;
                background: linear-gradient(145deg, #7f7ad1, #9c70bd);
                box-shadow: 0 6px 16px rgba(127, 122, 209, 0.45);
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
            }
            body.night-mode #offline-overlay .offline-btn {
                background: linear-gradient(145deg, #6b5b95, #5a4a84);
                box-shadow: 0 6px 16px rgba(107, 91, 149, 0.6);
            }
            #offline-overlay .offline-btn svg {
                width: 22px;
                height: 22px;
                flex: none;
                fill: none;
                stroke: currentColor;
                stroke-width: 2.4;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            #offline-overlay .offline-btn:hover {
                transform: translateY(-2px) scale(1.03);
            }
            #offline-overlay .offline-btn:active {
                transform: scale(0.97);
            }
            #offline-overlay .offline-btn:focus-visible {
                outline: 3px solid #a2529a;
                outline-offset: 3px;
            }
            body.night-mode #offline-overlay .offline-btn:focus-visible {
                outline-color: #ffe066;
            }
            #offline-overlay .offline-btn[disabled] {
                opacity: 0.75;
                cursor: progress;
                transform: none;
            }
            #offline-overlay .offline-btn.loading svg {
                animation: offline-spin 0.9s linear infinite;
            }
            #offline-overlay .offline-btn.shake {
                animation: offline-shake 0.4s ease;
            }
            #offline-overlay .offline-hint {
                min-height: 1.4em;
                margin: 14px 0 0;
                padding: 0;
                font-size: 15px;
                font-weight: 700;
                color: inherit;
                opacity: 0.9;
            }
            #offline-overlay .offline-hint:empty {
                display: none;
            }
            @keyframes offline-float {
                0%, 100% { transform: translateY(0) rotate(-3deg); }
                50% { transform: translateY(-12px) rotate(3deg); }
            }
            @keyframes offline-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.35; }
            }
            @keyframes offline-spin {
                to { transform: rotate(360deg); }
            }
            @keyframes offline-shake {
                20%, 60% { transform: translateX(-6px); }
                40%, 80% { transform: translateX(6px); }
            }
            @media (max-height: 460px) {
                #offline-overlay {
                    padding: 10px 12px;
                }
                #offline-overlay .offline-content {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    column-gap: 22px;
                    align-items: center;
                    max-width: 720px;
                    text-align: left;
                }
                #offline-overlay .offline-icon {
                    grid-row: 1 / span 6;
                    width: clamp(96px, 38vh, 150px);
                    margin: 0;
                }
                #offline-overlay .offline-chip {
                    justify-self: start;
                }
                #offline-overlay .offline-message {
                    margin: 0 0 12px;
                }
                #offline-overlay .offline-btn {
                    justify-self: start;
                    min-height: 46px;
                    font-size: 17px;
                }
                #offline-overlay .offline-hint {
                    margin-top: 8px;
                }
            }
            @media (max-width: 380px) {
                #offline-overlay .offline-btn {
                    width: 100%;
                }
            }
            @media (prefers-reduced-motion: reduce) {
                #offline-overlay,
                #offline-overlay .offline-icon,
                #offline-overlay .offline-dot,
                #offline-overlay .offline-btn,
                #offline-overlay .offline-btn.loading svg {
                    animation: none !important;
                    transition: none !important;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);
        offlineOverlayElement = overlay;

        document.getElementById('retry-connection').addEventListener('click', handleRetryClick);
    }

    function bindEvents() {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if (window.PlatformService && window.PlatformService.isCordova()) {
            document.addEventListener('online', handleOnline);
            document.addEventListener('offline', handleOffline);
        }
    }

    function handleOnline() {
        console.log('Network: Online event triggered');
        checkOnlineStatus().then(function (online) {
            if (online) {
                setOnlineStatus(true);
            }
        });
    }

    function handleOffline() {
        console.log('Network: Offline event triggered');
        setOnlineStatus(false);
    }

    function handleRetryClick() {
        const button = document.getElementById('retry-connection');
        const buttonText = document.getElementById('retry-connection-text');
        const hint = document.getElementById('offline-hint');

        button.classList.add('loading');
        button.disabled = true;
        buttonText.textContent = 'Memeriksa...';
        hint.textContent = '';

        checkOnlineStatus().then(function (online) {
            button.classList.remove('loading');
            button.disabled = false;
            buttonText.textContent = 'Coba Lagi';

            if (online) {
                setOnlineStatus(true);
                showNotificationMessage('Koneksi berhasil dipulihkan!');
            } else {
                hint.textContent = 'Masih belum terhubung. Coba lagi sebentar lagi, ya.';
                button.classList.remove('shake');
                void button.offsetWidth; // memulai ulang animasi
                button.classList.add('shake');
            }
        });
    }

    function checkOnlineStatus() {
        return new Promise(function (resolve) {
            if (!navigator.onLine) {
                resolve(false);
                return;
            }

            const img = new Image();
            const timeout = setTimeout(function () {
                img.onload = img.onerror = null;
                resolve(false);
            }, PING_TIMEOUT);

            img.onload = function () {
                clearTimeout(timeout);
                lastOnlineCheck = Date.now();
                resolve(true);
            };

            img.onerror = function () {
                clearTimeout(timeout);
                resolve(false);
            };

            img.src = getPingUrl();
        });
    }

    function startPeriodicCheck() {
        if (checkInterval) {
            clearInterval(checkInterval);
        }

        checkInterval = setInterval(function () {
            if (!isOnline) {
                checkOnlineStatus().then(function (online) {
                    if (online && !isOnline) {
                        setOnlineStatus(true);
                    }
                });
            }
        }, CHECK_INTERVAL);
    }

    function setOnlineStatus(online) {
        const wasOnline = isOnline;
        isOnline = online;

        if (online && !wasOnline) {
            hideOfflineOverlay();
            notifyListeners('online');
            console.log('Network: Now online');
        } else if (!online && wasOnline) {
            showOfflineOverlay();
            notifyListeners('offline');
            console.log('Network: Now offline');
        }
    }

    function showOfflineOverlay() {
        if (offlineOverlayElement) {
            offlineOverlayElement.style.display = 'flex';
            setTimeout(function () {
                offlineOverlayElement.classList.add('visible');
            }, 10);
        }
    }

    function hideOfflineOverlay() {
        if (offlineOverlayElement) {
            offlineOverlayElement.classList.remove('visible');
            setTimeout(function () {
                offlineOverlayElement.style.display = 'none';
                const hint = document.getElementById('offline-hint');
                if (hint) {
                    hint.textContent = '';
                }
            }, 300);
        }
    }

    function showNotificationMessage(message) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message);
        } else {
            alert(message);
        }
    }

    function addListener(callback) {
        if (typeof callback === 'function') {
            listeners.push(callback);
        }
    }

    function removeListener(callback) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    function notifyListeners(status) {
        listeners.forEach(function (callback) {
            try {
                callback(status, isOnline);
            } catch (e) {
                console.error('OfflineService listener error:', e);
            }
        });
    }

    function getStatus() {
        return isOnline;
    }

    function requireOnline(action) {
        return new Promise(function (resolve, reject) {
            if (isOnline) {
                if (typeof action === 'function') {
                    Promise.resolve(action()).then(resolve).catch(reject);
                } else {
                    resolve(true);
                }
            } else {
                showNotificationMessage('Fitur ini membutuhkan koneksi internet.');
                reject(new Error('No internet connection'));
            }
        });
    }

    return {
        init: init,
        isOnline: function () { return isOnline; },
        getStatus: getStatus,
        checkOnlineStatus: checkOnlineStatus,
        addListener: addListener,
        removeListener: removeListener,
        requireOnline: requireOnline,
        showOfflineOverlay: showOfflineOverlay,
        hideOfflineOverlay: hideOfflineOverlay
    };
})();

window.OfflineService = OfflineService;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        OfflineService.init();
    });
} else {
    OfflineService.init();
}