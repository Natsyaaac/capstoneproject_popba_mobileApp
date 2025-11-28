/**
* @fileOverview JavaScript Audio Function Library.
* @description Cross-platform audio management for Web, Electron, and Cordova
* @author <a href="https://github.com/richardhenyash">Richard Ash</a>
* @version 2.0.0
*/
/*jshint esversion: 6 */
/* globals $, soundPop, soundDeflate, soundHighScore, soundUnlucky, soundWellDone, bpmSoundEffectsMuted:true, bgMusic, PlatformService*/

const AudioManager = (function() {
    'use strict';
    
    let bgMusicElement = null;
    let isInitialized = false;
    let audioContext = null;
    
    function init() {
        if (isInitialized) return;
        
        bgMusicElement = document.getElementById("bg-music");
        if (!bgMusicElement) {
            bgMusicElement = createAudioElement("assets/sounds/music_background.mp3", true);
        }
        bgMusicElement.loop = true;
        bgMusicElement.volume = 0.5;
        bgMusicElement.muted = false;
        
        setupUserInteractionHandler();
        
        isInitialized = true;
        console.log('AudioManager initialized');
    }
    
    function createAudioElement(src, isBackground) {
        const audio = new Audio();
        
        if (window.PlatformService) {
            const platform = PlatformService.getPlatform();
            if (platform === 'cordova' || platform === 'electron') {
                audio.src = resolveAudioPath(src, platform);
            } else {
                audio.src = src;
            }
        } else {
            audio.src = src;
        }
        
        if (isBackground) {
            audio.preload = 'auto';
        }
        
        return audio;
    }
    
    function resolveAudioPath(src, platform) {
        if (platform === 'cordova') {
            if (window.cordova && window.cordova.file) {
                return window.cordova.file.applicationDirectory + 'www/' + src;
            }
        } else if (platform === 'electron') {
            if (src.startsWith('/') || src.startsWith('http')) {
                return src;
            }
            return './' + src;
        }
        return src;
    }
    
    function setupUserInteractionHandler() {
        const playOnInteraction = function() {
            if (bgMusicElement && bgMusicElement.paused && !bpmSoundEffectsMuted) {
                bgMusicElement.play().catch(function(error) {
                    console.log("Autoplay blocked, waiting for user interaction...", error);
                });
            }
        };
        
        document.addEventListener("click", playOnInteraction, { once: true });
        document.addEventListener("touchstart", playOnInteraction, { once: true });
        document.addEventListener("keydown", playOnInteraction, { once: true });
        
        if (window.PlatformService && PlatformService.isCordova()) {
            document.addEventListener('deviceready', function() {
                playOnInteraction();
            }, false);
        }
    }
    
    function getAudioContext() {
        if (!audioContext) {
            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    audioContext = new AudioContextClass();
                }
            } catch (e) {
                console.warn('Web Audio API not supported:', e);
            }
        }
        return audioContext;
    }
    
    function playSound(audioElement) {
        if (!audioElement || bpmSoundEffectsMuted) return;
        
        try {
            audioElement.currentTime = 0;
            const playPromise = audioElement.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(function(error) {
                    console.log('Audio play failed:', error);
                });
            }
        } catch (e) {
            console.warn('Error playing sound:', e);
        }
    }
    
    function stopSound(audioElement) {
        if (!audioElement) return;
        
        try {
            audioElement.pause();
            audioElement.currentTime = 0;
        } catch (e) {
            console.warn('Error stopping sound:', e);
        }
    }
    
    return {
        init: init,
        createAudioElement: createAudioElement,
        playSound: playSound,
        stopSound: stopSound,
        getAudioContext: getAudioContext,
        getBgMusic: function() { return bgMusicElement; }
    };
})();

const bgMusic = document.getElementById("bg-music") || new Audio("assets/sounds/music_background.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;
bgMusic.muted = false;

document.addEventListener("click", function startMusic() {
    if (bgMusic.paused && !bpmSoundEffectsMuted) {
        bgMusic.play().catch(function() {
            console.log("Autoplay blocked, waiting for user interaction...");
        });
    }
}, { once: true });

document.addEventListener("touchstart", function startMusicTouch() {
    if (bgMusic.paused && !bpmSoundEffectsMuted) {
        bgMusic.play().catch(function() {
            console.log("Autoplay blocked on touch...");
        });
    }
}, { once: true });

/**
* [Function to toggle audio mute]
* @return {[boolean]}     [bpmSoundEffectsMuted global variable]
*/
function muteAudioToggle(){
    if (bpmSoundEffectsMuted == false) {
        muteAudio();
    } else {
        unMuteAudio();
    }
    return(bpmSoundEffectsMuted);
}

/**
* [Function to mute audio]
* @return {[boolean]}     [bpmSoundEffectsMuted global variable]
*/
function muteAudio(){
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
    
    if (window.PlatformService && PlatformService.isCordova()) {
        try {
            bgMusic.pause();
        } catch (e) {
            console.warn('Error pausing music on Cordova:', e);
        }
    }
    
    return(bpmSoundEffectsMuted);
}

/**
* [Function to un-mute audio]
* @return {[boolean]}     [bpmSoundEffectsMuted global variable]
*/
function unMuteAudio() {
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
    
    if (bgMusic.paused) {
        bgMusic.play().catch(function(e) {
            console.log('Could not resume background music:', e);
        });
    }
    
    return(bpmSoundEffectsMuted);
}

window.AudioManager = AudioManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        AudioManager.init();
    });
} else {
    AudioManager.init();
}
