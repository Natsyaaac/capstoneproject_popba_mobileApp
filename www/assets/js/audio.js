/**
* @fileOverview JavaScript Audio Function Library.
* @author <a href="https://github.com/richardhenyash">Richard Ash</a>
* @version 1.1.1
*/
/*jshint esversion: 6 */
/* globals $, soundPop, soundDeflate, soundHighScore, soundUnlucky, soundWellDone, bpmSoundEffectsMuted:true, bgMusic*/





// ===============================================
// 🔊 Background Music Setup - Cordova Compatible
// ===============================================
let bgMusic;

// Initialize background music dengan Cordova compatibility
function initBackgroundMusic() {
    // Coba ambil dari HTML element dulu
    const audioElement = document.getElementById("bg-music");
    
    if (audioElement && !window.cordova) {
        // Gunakan HTML5 audio element jika ada dan bukan Cordova
        bgMusic = audioElement;
    } else {
        // Gunakan wrapper untuk Cordova compatibility
        bgMusic = createAudio("assets/sounds/music_background.mp3", 0.5);
    }
    
    bgMusic.loop = true;
    if (bgMusic.setVolume) {
        bgMusic.setVolume(0.5);
    } else {
        bgMusic.volume = 0.5;
    }
    bgMusic.muted = false;
}

// Initialize saat document ready atau deviceready
if (window.cordova) {
    document.addEventListener('deviceready', initBackgroundMusic, false);
} else {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackgroundMusic);
    } else {
        initBackgroundMusic();
    }
}

// ✅ Mulai musik saat pengguna pertama kali berinteraksi (klik / sentuh)
document.addEventListener("click", () => {
    if (bgMusic && bgMusic.paused) {
        bgMusic.play().catch(() => {
            console.log("Autoplay blocked, waiting for user interaction...");
        });
    }
}, { once: true });

/**
* [Function to toggle audio mute]
* @return {[boolean]}     [bpmSoundEffectsMuted global variable]
*/
function muteAudioToggle(){
    // Check bpmSoundEffectsMuted global variable
    if (bpmSoundEffectsMuted == false) {
        // Mute sound effects
        muteAudio();
    } else {
        // Un-mute sound effects
        unMuteAudio();
    }
    return(bpmSoundEffectsMuted);
}

/**
* [Function to mute audio]
* @return {[boolean]}     [bpmSoundEffectsMuted global variable]
*/
function muteAudio(){
    console.log('[Audio] Muting all audio');
    
    // Mute sound effects - use setMuted method for CordovaAudioWrapper
    if (soundPop.setMuted) soundPop.setMuted(true);
    else soundPop.muted = true;
    
    if (soundDeflate.setMuted) soundDeflate.setMuted(true);
    else soundDeflate.muted = true;
    
    if (soundHighScore.setMuted) soundHighScore.setMuted(true);
    else soundHighScore.muted = true;
    
    if (soundUnlucky.setMuted) soundUnlucky.setMuted(true);
    else soundUnlucky.muted = true;
    
    if (soundWellDone.setMuted) soundWellDone.setMuted(true);
    else soundWellDone.muted = true;
    
    // Mute background music
    if (bgMusic) {
        if (bgMusic.setMuted) {
            bgMusic.setMuted(true);
        } else if (bgMusic.muted !== undefined) {
            bgMusic.muted = true;
        }
        // Pause background music when muted
        if (bgMusic.pause) bgMusic.pause();
    }
    
    $("#mute").removeClass("fa-volume-up").addClass("fas fa-volume-mute");
    $("#audio-on").removeClass("active").attr("aria-pressed", "false");
    $("#audio-off").addClass("active").attr("aria-pressed", "true");
    bpmSoundEffectsMuted = true; 
    return(bpmSoundEffectsMuted);
}

/**
* [Function to un-mute audio]
* @return {[boolean]}     [bpmSoundEffectsMuted global variable]
*/
function unMuteAudio() {
    console.log('[Audio] Unmuting all audio');
    
    // Unmute sound effects - use setMuted method for CordovaAudioWrapper
    if (soundPop.setMuted) soundPop.setMuted(false);
    else soundPop.muted = false;
    
    if (soundDeflate.setMuted) soundDeflate.setMuted(false);
    else soundDeflate.muted = false;
    
    if (soundHighScore.setMuted) soundHighScore.setMuted(false);
    else soundHighScore.muted = false;
    
    if (soundUnlucky.setMuted) soundUnlucky.setMuted(false);
    else soundUnlucky.muted = false;
    
    if (soundWellDone.setMuted) soundWellDone.setMuted(false);
    else soundWellDone.muted = false;
    
    // Unmute and resume background music
    if (bgMusic) {
        if (bgMusic.setMuted) {
            bgMusic.setMuted(false);
        } else if (bgMusic.muted !== undefined) {
            bgMusic.muted = false;
        }
        // Resume background music when unmuted
        if (bgMusic.play && bgMusic.paused) {
            bgMusic.play().catch(err => {
                console.log('[Audio] Play blocked:', err);
            });
        }
    }
    
    $("#mute").removeClass("fa-volume-mute").addClass("fas fa-volume-up");
    $("#audio-off").removeClass("active").attr("aria-pressed", "false");
    $("#audio-on").addClass("active").attr("aria-pressed", "true");
    bpmSoundEffectsMuted = false;
    return(bpmSoundEffectsMuted);
}

