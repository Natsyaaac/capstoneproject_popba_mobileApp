/**
 * @fileOverview Offline Detection and Management Service
 * @description Detects network status and handles offline mode with 404 page
 * @version 1.0.0
 */
/*jshint esversion: 8 */
/* globals $ */

const OfflineService = (function() {
    'use strict';

    let isOnline = navigator.onLine;
    let offlineOverlayElement = null;
    let checkInterval = null;
    let listeners = [];
    let lastOnlineCheck = Date.now();
    const CHECK_INTERVAL = 5000;
    const PING_URL = 'https://www.google.com/favicon.ico';

    function init() {
        createOfflineOverlay();
        bindEvents();
        checkOnlineStatus();
        startPeriodicCheck();
        console.log('OfflineService initialized. Online:', isOnline);
    }

    function createOfflineOverlay() {
        if (document.getElementById('offline-overlay')) {
            offlineOverlayElement = document.getElementById('offline-overlay');
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'offline-overlay';
        overlay.innerHTML = `
            <div class="offline-content">
                <div class="offline-icon">
                    <i class="fas fa-wifi-slash" style="font-size: 4rem; color: #A2529A;"></i>
                </div>
                <h2 class="offline-title">Tidak Ada Koneksi Internet</h2>
                <p class="offline-message">
                    Oops... sepertinya kamu sedang tidak terhubung ke internet.
                    Periksa koneksi internetmu dan coba lagi!
                </p>
                <div class="offline-animation">
                    <img src="assets/images/balloon-purple-cropped.png" alt="Balloon" class="floating-balloon">
                </div>
                <button id="retry-connection" class="btn btn-xl btn-info btn-text">
                    <i class="fas fa-sync-alt"></i> Coba Lagi
                </button>
                <p class="offline-hint">
                    <i class="fas fa-map-signs"></i> 
                    Beberapa fitur mungkin masih tersedia secara offline
                </p>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            #offline-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #7CC0FF 0%, #6FD1F4 50%, #9EFBF5 100%);
                z-index: 99999;
                display: none;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            }
            #offline-overlay.visible {
                display: flex;
                opacity: 1;
            }
            .offline-content {
                text-align: center;
                padding: 40px;
                max-width: 500px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            }
            .offline-icon {
                margin-bottom: 20px;
            }
            .offline-title {
                font-family: 'Nunito', sans-serif;
                font-size: 1.8rem;
                color: #A2529A;
                margin-bottom: 15px;
            }
            .offline-message {
                font-family: 'Nunito', sans-serif;
                font-size: 1.1rem;
                color: #666;
                margin-bottom: 25px;
                line-height: 1.6;
            }
            .offline-animation {
                margin: 20px 0;
            }
            .floating-balloon {
                width: 80px;
                animation: floatBalloon 3s ease-in-out infinite;
            }
            @keyframes floatBalloon {
                0%, 100% { transform: translateY(0px) rotate(-5deg); }
                50% { transform: translateY(-20px) rotate(5deg); }
            }
            #retry-connection {
                margin: 20px 0;
                padding: 15px 40px;
                font-size: 1.2rem;
            }
            #retry-connection i {
                margin-right: 10px;
            }
            #retry-connection.loading i {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .offline-hint {
                font-size: 0.9rem;
                color: #888;
                margin-top: 15px;
            }
            .offline-hint i {
                margin-right: 5px;
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
        checkOnlineStatus().then(function(online) {
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
        button.classList.add('loading');
        button.disabled = true;
        
        checkOnlineStatus().then(function(online) {
            button.classList.remove('loading');
            button.disabled = false;
            
            if (online) {
                setOnlineStatus(true);
                showNotificationMessage('Koneksi berhasil dipulihkan!');
            } else {
                showNotificationMessage('Masih tidak ada koneksi. Coba lagi nanti.');
            }
        });
    }

    function checkOnlineStatus() {
        return new Promise(function(resolve) {
            if (!navigator.onLine) {
                resolve(false);
                return;
            }

            const img = new Image();
            const timeout = setTimeout(function() {
                img.onload = img.onerror = null;
                resolve(false);
            }, 5000);

            img.onload = function() {
                clearTimeout(timeout);
                lastOnlineCheck = Date.now();
                resolve(true);
            };

            img.onerror = function() {
                clearTimeout(timeout);
                resolve(false);
            };

            img.src = PING_URL + '?t=' + Date.now();
        });
    }

    function startPeriodicCheck() {
        if (checkInterval) {
            clearInterval(checkInterval);
        }
        
        checkInterval = setInterval(function() {
            if (!isOnline) {
                checkOnlineStatus().then(function(online) {
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
            setTimeout(function() {
                offlineOverlayElement.classList.add('visible');
            }, 10);
        }
    }

    function hideOfflineOverlay() {
        if (offlineOverlayElement) {
            offlineOverlayElement.classList.remove('visible');
            setTimeout(function() {
                offlineOverlayElement.style.display = 'none';
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
        listeners.forEach(function(callback) {
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
        return new Promise(function(resolve, reject) {
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
        isOnline: function() { return isOnline; },
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
    document.addEventListener('DOMContentLoaded', function() {
        OfflineService.init();
    });
} else {
    OfflineService.init();
}
