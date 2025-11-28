/**
 * @fileOverview Platform Detection and Adapter Service
 * @description Detects runtime environment (Web/Electron/Cordova) and provides platform-specific adapters
 * @version 1.0.0
 */
/*jshint esversion: 8 */

const PlatformService = (function() {
    'use strict';

    let currentPlatform = 'web';
    let isInitialized = false;
    let platformCapabilities = {
        hasFileSystem: false,
        hasNativeNotifications: false,
        hasNativeShare: false,
        hasLocalDatabase: false,
        supportsBackgroundAudio: false,
        hasNetworkDetection: true
    };

    function detectPlatform() {
        if (typeof window === 'undefined') {
            return 'unknown';
        }

        if (window.cordova || window.Cordova || document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
            if (window.cordova) {
                return 'cordova';
            }
        }

        if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
            return 'electron';
        }

        if (window.require) {
            try {
                const electron = window.require('electron');
                if (electron) {
                    return 'electron';
                }
            } catch (e) {
            }
        }

        return 'web';
    }

    function setCapabilities(platform) {
        switch (platform) {
            case 'electron':
                platformCapabilities = {
                    hasFileSystem: true,
                    hasNativeNotifications: true,
                    hasNativeShare: false,
                    hasLocalDatabase: true,
                    supportsBackgroundAudio: true,
                    hasNetworkDetection: true
                };
                break;
            case 'cordova':
                platformCapabilities = {
                    hasFileSystem: true,
                    hasNativeNotifications: true,
                    hasNativeShare: true,
                    hasLocalDatabase: true,
                    supportsBackgroundAudio: true,
                    hasNetworkDetection: true
                };
                break;
            default:
                platformCapabilities = {
                    hasFileSystem: false,
                    hasNativeNotifications: 'Notification' in window,
                    hasNativeShare: 'share' in navigator,
                    hasLocalDatabase: 'indexedDB' in window,
                    supportsBackgroundAudio: true,
                    hasNetworkDetection: 'onLine' in navigator
                };
        }
    }

    function init() {
        if (isInitialized) {
            return Promise.resolve(currentPlatform);
        }

        return new Promise((resolve) => {
            currentPlatform = detectPlatform();
            setCapabilities(currentPlatform);
            isInitialized = true;
            console.log('Platform detected:', currentPlatform);
            console.log('Capabilities:', platformCapabilities);
            resolve(currentPlatform);
        });
    }

    function getPlatform() {
        return currentPlatform;
    }

    function isWeb() {
        return currentPlatform === 'web';
    }

    function isElectron() {
        return currentPlatform === 'electron';
    }

    function isCordova() {
        return currentPlatform === 'cordova';
    }

    function isMobile() {
        return currentPlatform === 'cordova' || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function isDesktop() {
        return currentPlatform === 'electron' || 
               (!isMobile() && currentPlatform === 'web');
    }

    function getCapabilities() {
        return { ...platformCapabilities };
    }

    function hasCapability(capability) {
        return platformCapabilities[capability] || false;
    }

    function openExternalUrl(url) {
        if (isElectron()) {
            try {
                const { shell } = window.require('electron');
                shell.openExternal(url);
                return true;
            } catch (e) {
                console.error('Electron shell error:', e);
            }
        } else if (isCordova()) {
            if (window.cordova && window.cordova.InAppBrowser) {
                window.cordova.InAppBrowser.open(url, '_system');
                return true;
            }
        }
        window.open(url, '_blank');
        return true;
    }

    function showNativeNotification(title, options) {
        if (isElectron()) {
            try {
                const { Notification } = window.require('electron').remote || {};
                if (Notification) {
                    new Notification({ title, body: options.body || '' }).show();
                    return true;
                }
            } catch (e) {
                console.error('Electron notification error:', e);
            }
        } else if (isCordova()) {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.notification) {
                window.cordova.plugins.notification.local.schedule({
                    title: title,
                    text: options.body || '',
                    foreground: true
                });
                return true;
            }
        }
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, options);
            return true;
        }
        
        return false;
    }

    function getStoragePath() {
        if (isElectron()) {
            try {
                const { app } = window.require('electron').remote || {};
                if (app) {
                    return app.getPath('userData');
                }
            } catch (e) {
                console.error('Electron storage path error:', e);
            }
        } else if (isCordova()) {
            if (window.cordova && window.cordova.file) {
                return window.cordova.file.dataDirectory;
            }
        }
        return null;
    }

    function exitApp() {
        if (isElectron()) {
            try {
                const { app } = window.require('electron').remote || {};
                if (app) {
                    app.quit();
                    return true;
                }
            } catch (e) {
                console.error('Electron exit error:', e);
            }
        } else if (isCordova()) {
            if (navigator.app && navigator.app.exitApp) {
                navigator.app.exitApp();
                return true;
            }
        }
        return false;
    }

    function vibrate(duration) {
        if (isCordova() && navigator.vibrate) {
            navigator.vibrate(duration || 100);
            return true;
        } else if ('vibrate' in navigator) {
            navigator.vibrate(duration || 100);
            return true;
        }
        return false;
    }

    return {
        init: init,
        getPlatform: getPlatform,
        isWeb: isWeb,
        isElectron: isElectron,
        isCordova: isCordova,
        isMobile: isMobile,
        isDesktop: isDesktop,
        getCapabilities: getCapabilities,
        hasCapability: hasCapability,
        openExternalUrl: openExternalUrl,
        showNativeNotification: showNativeNotification,
        getStoragePath: getStoragePath,
        exitApp: exitApp,
        vibrate: vibrate
    };
})();

window.PlatformService = PlatformService;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        PlatformService.init();
    });
} else {
    PlatformService.init();
}
