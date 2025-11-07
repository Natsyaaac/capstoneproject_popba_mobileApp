/**
* @fileOverview Cordova Audio Wrapper - Compatible dengan Web dan Cordova Apps
* @author Modified for Cordova compatibility
* @version 2.0.0
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
        
        // Initialize audio berdasarkan environment
        if (this.isCordova) {
            // Tunggu deviceready untuk Cordova
            if (typeof device !== 'undefined') {
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
        if (typeof Media === 'undefined') {
            console.warn('Cordova Media plugin tidak tersedia, fallback ke HTML5 Audio');
            this.mediaObject = new Audio(this.src);
            this.mediaObject.volume = this.volume;
            this.isCordova = false;
            return;
        }
        
        // Sesuaikan path untuk Android
        let mediaSrc = this.src;
        if (device && device.platform && device.platform.toLowerCase() === 'android') {
            // Untuk Android, gunakan path /android_asset/www/
            mediaSrc = '/android_asset/www/' + this.src;
        }
        
        // Create Media object dengan callbacks
        this.mediaObject = new Media(
            mediaSrc,
            // Success callback
            () => {
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
                console.error('Media Error:', JSON.stringify(err));
                // Fallback ke HTML5 jika Cordova Media gagal
                this.mediaObject = new Audio(this.src);
                this.mediaObject.volume = this.volume;
                this.isCordova = false;
            }
        );
        
        // Set volume untuk Cordova
        if (this.mediaObject.setVolume) {
            this.mediaObject.setVolume(this.volume);
        }
    }
    
    /**
     * Play audio
     */
    play() {
        if (!this.mediaObject) {
            console.warn('Media object belum ready');
            return Promise.reject('Media not ready');
        }
        
        if (this.muted) {
            return Promise.resolve();
        }
        
        this.paused = false;
        
        if (this.isCordova && this.mediaObject.play) {
            // Cordova Media
            try {
                this.mediaObject.play();
                return Promise.resolve();
            } catch (e) {
                console.error('Error playing Cordova media:', e);
                return Promise.reject(e);
            }
        } else if (this.mediaObject.play) {
            // HTML5 Audio
            const playPromise = this.mediaObject.play();
            if (playPromise !== undefined) {
                return playPromise.catch(err => {
                    console.warn('Autoplay blocked:', err);
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
