(function() {
    'use strict';
    
    const NIGHT_MODE_KEY = 'balloonPopMaths_nightMode';
    
    function isNightMode() {
        return localStorage.getItem(NIGHT_MODE_KEY) === 'true';
    }
    
    function setNightMode(enabled) {
        localStorage.setItem(NIGHT_MODE_KEY, enabled);
        if (enabled) {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }
        updateButtons(enabled);
    }
    
    function updateButtons(isNight) {
        const dayBtn = document.getElementById('day-mode');
        const nightBtn = document.getElementById('night-mode');
        const dayRadio = document.getElementById('theme-day');
        const nightRadio = document.getElementById('theme-night');
        
        if (dayBtn && nightBtn) {
            if (isNight) {
                dayBtn.classList.remove('active');
                nightBtn.classList.add('active');
                if (dayRadio) dayRadio.checked = false;
                if (nightRadio) nightRadio.checked = true;
            } else {
                dayBtn.classList.add('active');
                nightBtn.classList.remove('active');
                if (dayRadio) dayRadio.checked = true;
                if (nightRadio) nightRadio.checked = false;
            }
        }
    }
    
    function initNightMode() {
        if (isNightMode()) {
            setNightMode(true);
        }
        
        const dayBtn = document.getElementById('day-mode');
        const nightBtn = document.getElementById('night-mode');
        
        if (dayBtn) {
            dayBtn.addEventListener('click', function() {
                setNightMode(false);
            });
        }
        
        if (nightBtn) {
            nightBtn.addEventListener('click', function() {
                setNightMode(true);
            });
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNightMode);
    } else {
        initNightMode();
    }
    
    window.NightMode = {
        enable: function() { setNightMode(true); },
        disable: function() { setNightMode(false); },
        toggle: function() { setNightMode(!isNightMode()); },
        isEnabled: isNightMode
    };
})();
