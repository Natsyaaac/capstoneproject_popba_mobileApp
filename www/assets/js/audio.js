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
    // Mute sound effects
    soundPop.muted = true;
    soundDeflate.muted = true;
    soundHighScore.muted = true;
    soundUnlucky.muted = true;
    bgMusic.muted = true;
    soundWellDone.muted = true;
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
    // Unmute sound effects
    soundPop.muted = false;
    soundDeflate.muted = false;
    soundHighScore.muted = false;
    soundUnlucky.muted = false;
    bgMusic.muted = false;
    soundWellDone.muted = false;
    $("#mute").removeClass("fa-volume-mute").addClass("fas fa-volume-up");
    $("#audio-off").removeClass("active").attr("aria-pressed", "false");
    $("#audio-on").addClass("active").attr("aria-pressed", "true");
    bpmSoundEffectsMuted = false;
    return(bpmSoundEffectsMuted);
}

