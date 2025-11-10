/**
* @fileOverview Cordova Audio Wrapper - Compatible dengan Web dan Cordova Apps
* @author Modified for Cordova compatibility
* @version 2.1.0
*/
/*jshint esversion: 6 */

/**
 * Audio Wrapper Class untuk kompatibilitas Cordova
 * Otomatis menggunakan Cordova Media Plugin atau HTML5 Audio
 */
class CordovaAudioWrapper {
    constructor(src, volume = 1.0) {
        this.src = src;
        this.volume = volume;
        this.loop = false;
        this.muted = false;
        this.paused = true;
        this.mediaObject = null;
        this.isCordova = this.detectCordova();
        this.isReady = false;
        
        // Initialize audio berdasarkan environment
        if (this.isCordova) {
            // Tunggu deviceready untuk Cordova
            if (window.cordovaReady) {
                this.initCordovaMedia();
            } else {
                document.addEventListener('deviceready', () => {
                    this.initCordovaMedia();
                }, false);
            }
        } else {
            // Gunakan HTML5 Audio untuk web
            this.mediaObject = new Audio(src);
            this.mediaObject.volume = volume;
            this.isReady = true;
        }
    }
    
    /**
     * Deteksi apakah aplikasi berjalan di Cordova
     */
    detectCordova() {
        return !!(window.cordova || window.Cordova || window.phonegap || window.PhoneGap);
    }
    
    /**
     * Initialize Cordova Media Plugin
     */
    initCordovaMedia() {
        console.log('[Audio] Initializing Cordova Media for:', this.src);
        
        if (typeof Media === 'undefined') {
            console.warn('Cordova Media plugin tidak tersedia, fallback ke HTML5 Audio');
            this.mediaObject = new Audio(this.src);
            this.mediaObject.volume = this.volume;
            this.isCordova = false;
            this.isReady = true;
            return;
        }
        
        // Sesuaikan path untuk platform
        let mediaSrc = this.src;
        if (typeof device !== 'undefined' && device.platform) {
            const platform = device.platform.toLowerCase();
            console.log('[Audio] Platform detected:', platform);
            
            if (platform === 'android') {
                // Untuk Android, gunakan path /android_asset/www/
                mediaSrc = '/android_asset/www/' + this.src;
            } else if (platform === 'ios') {
                // Untuk iOS, gunakan path relatif
                mediaSrc = this.src;
            }
        }
        
        console.log('[Audio] Media path:', mediaSrc);
        
        // Create Media object dengan callbacks
        this.mediaObject = new Media(
            mediaSrc,
            // Success callback
            () => {
                console.log('[Audio] Playback finished:', this.src);
                this.paused = true;
                if (this.loop && !this.muted) {
                    // Replay jika loop enabled
                    setTimeout(() => {
                        this.play();
                    }, 100);
                }
            },
            // Error callback
            (err) => {
                console.error('[Audio] Media Error for', this.src, ':', JSON.stringify(err));
                // Fallback ke HTML5 jika Cordova Media gagal
                this.mediaObject = new Audio(this.src);
                this.mediaObject.volume = this.volume;
                this.isCordova = false;
                this.isReady = true;
            },
            // Status callback
            (status) => {
                console.log('[Audio] Status for', this.src, ':', status);
            }
        );
        
        // Set volume untuk Cordova
        if (this.mediaObject.setVolume) {
            this.mediaObject.setVolume(this.volume);
        }
        
        this.isReady = true;
        console.log('[Audio] Initialized successfully:', this.src);
    }
    
    /**
     * Play audio
     */
    play() {
        if (!this.isReady || !this.mediaObject) {
            console.warn('[Audio] Media object belum ready untuk', this.src);
            // Retry after delay if in Cordova and not ready
            if (this.isCordova) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (this.isReady && this.mediaObject) {
                            this.play().then(resolve);
                        } else {
                            console.error('[Audio] Timeout waiting for media ready');
                            resolve();
                        }
                    }, 500);
                });
            }
            return Promise.reject('Media not ready');
        }
        
        if (this.muted) {
            console.log('[Audio] Muted, skipping play:', this.src);
            return Promise.resolve();
        }
        
        this.paused = false;
        
        if (this.isCordova && this.mediaObject.play) {
            // Cordova Media
            try {
                console.log('[Audio] Playing Cordova media:', this.src);
                this.mediaObject.play();
                return Promise.resolve();
            } catch (e) {
                console.error('[Audio] Error playing Cordova media:', e);
                return Promise.reject(e);
            }
        } else if (this.mediaObject.play) {
            // HTML5 Audio
            const playPromise = this.mediaObject.play();
            if (playPromise !== undefined) {
                return playPromise.catch(err => {
                    console.warn('[Audio] Autoplay blocked:', err);
                });
            }
            return Promise.resolve();
        }
        
        return Promise.reject('No play method available');
    }
    
    /**
     * Pause audio
     */
    pause() {
        if (!this.mediaObject) return;
        
        this.paused = true;
        
        if (this.isCordova && this.mediaObject.pause) {
            this.mediaObject.pause();
        } else if (this.mediaObject.pause) {
            this.mediaObject.pause();
        }
    }
    
    /**
     * Stop audio
     */
    stop() {
        if (!this.mediaObject) return;
        
        this.paused = true;
        
        if (this.isCordova && this.mediaObject.stop) {
            this.mediaObject.stop();
        } else if (this.mediaObject.pause) {
            this.mediaObject.pause();
            this.mediaObject.currentTime = 0;
        }
    }
    
    /**
     * Set volume (0.0 - 1.0)
     */
    setVolume(vol) {
        this.volume = vol;
        
        if (!this.mediaObject) return;
        
        if (this.isCordova && this.mediaObject.setVolume) {
            this.mediaObject.setVolume(vol);
        } else if (this.mediaObject.volume !== undefined) {
            this.mediaObject.volume = vol;
        }
    }
    
    /**
     * Release resources (penting untuk Cordova)
     */
    release() {
        if (this.isCordova && this.mediaObject && this.mediaObject.release) {
            this.mediaObject.release();
        }
    }
}

/**
 * Helper function untuk create audio yang compatible dengan Cordova
 */
function createAudio(src, volume = 0.5) {
    return new CordovaAudioWrapper(src, volume);
}
