# Balloon Pop Maths

## Overview
Balloon Pop Maths is an interactive educational math game built with HTML5, CSS, JavaScript, and Cordova. The game helps students practice various mathematical concepts including:
- Algebra (Aljabar)
- Time calculations (Waktu)
- Mass/Weight (Massa)
- Volume
- Geometry (Bangunan)
- Operations (Operasi)
- Exams (Ujian)

**Current State**: Web application running on Replit with static file serving
**Language**: Indonesian (Bahasa Indonesia)
**Framework**: Cordova (mobile-ready), HTML5, CSS3, Bootstrap 4
**Audio**: Cordova Media Plugin with HTML5 Audio fallback

## Recent Changes
- **2025-11-10**: Initial Replit setup & Cordova Audio Fix
  - Configured http-server to serve the `www` directory on port 5000
  - Added Replit-specific entries to .gitignore
  - Created documentation in replit.md
  - **AUDIO FIX**: Memperbaiki masalah audio di Cordova mobile apps
    - Menambahkan plugin `cordova-plugin-device` untuk deteksi platform
    - Meningkatkan `cordova-audio-wrapper.js` dengan logging dan retry mechanism
    - Menambahkan global `cordovaReady` flag untuk sinkronisasi
    - Menambahkan dokumentasi lengkap di `www/AUDIO-FIX-README.md`
  - **MUTE/UNMUTE FIX**: Memperbaiki tombol audio on/off
    - Menambahkan method `setMuted()` dan `getMuted()` pada CordovaAudioWrapper
    - Update fungsi `muteAudio()` dan `unMuteAudio()` untuk support Cordova
    - Pause/resume background music saat mute/unmute
  - **APP NAME FIX**: Update config.xml
    - Nama aplikasi: "MyApp" → "Balloon Pop Maths"
    - Package ID: com.ummet.balloonpop
    - Author: Universitas Muhammadiyah Metro

## Project Architecture

### Frontend Structure
- **Entry Point**: `www/index.html`
- **Assets**: 
  - CSS: `www/assets/css/`
  - JavaScript: `www/assets/js/`
  - Images: `www/assets/images/`
  - Sounds: `www/assets/sounds/`
  - Fonts: `www/assets/fonts/`

### Key JavaScript Modules
- `initialisation.js` - Setup and global variables
- `game-logic.js` - Core game mechanics
- `maths.js` - Math problem generation
- `animation.js` - Balloon animations
- `audio.js` - Audio management
- `display.js` - UI updates
- `events.js` - Event handlers
- `cordova-audio-wrapper.js` - Cordova/HTML5 audio compatibility layer
- `input-soal.js` - Question input functionality
- `storyMode.js` - Story mode gameplay

### Dependencies
- **Bootstrap 4.4.1** - UI framework
- **Font Awesome** - Icons
- **Google Fonts** (Nunito, Rajdhani) - Typography
- **EmailJS** - Contact functionality
- **Cordova Plugins** (untuk mobile app):
  - cordova-plugin-device (platform detection) ⭐ PENTING untuk audio
  - cordova-plugin-media (audio playback)
  - cordova-plugin-file (file access)

## Workflow Configuration

### Frontend Server
- **Command**: `http-server www -p 5000 -a 0.0.0.0 --cors -c-1`
- **Port**: 5000 (web preview)
- **Host**: 0.0.0.0 (allows Replit proxy)
- **Cache**: Disabled (-c-1) for development
- **CORS**: Enabled for external resources

## Development Notes

### Running Locally
The application is served from the `www` directory as a static site. All HTML, CSS, JS, and assets are loaded from this folder.

### Audio System
The game uses a dual-mode audio system with **FULL CORDOVA SUPPORT**:
- **Web Mode**: HTML5 Audio API (untuk browser)
- **Cordova Mode**: Cordova Media Plugin (untuk Android/iOS apps)

**Fitur Audio Wrapper v2.1**:
- ✅ Auto-detect platform (Android/iOS)
- ✅ Path adjustment otomatis (`/android_asset/www/` untuk Android)
- ✅ Retry mechanism jika media belum ready
- ✅ Console logging untuk debugging
- ✅ Fallback ke HTML5 jika Media plugin gagal
- ✅ Global deviceready flag untuk sinkronisasi

File: `www/assets/js/cordova-audio-wrapper.js`

**Dokumentasi**: Lihat `www/AUDIO-FIX-README.md` untuk panduan lengkap debugging dan build Cordova.

### Cordova Setup
For building as a mobile app, see `www/CORDOVA-SETUP.md` for detailed instructions on:
- Installing Cordova CLI
- Adding platforms (Android/iOS)
- Installing required plugins
- Building and deploying

### Game Modes
1. **Aljabar** (Algebra) - Fill blanks, variable values, equations, patterns
2. **Waktu** (Time) - Read clock, add/subtract time, conversions, differences
3. **Massa** (Mass) - Weight conversions, add/subtract, comparisons
4. **Volume** - Volume calculations, additions, differences, estimations
5. **Bangunan** (Geometry) - Perimeter, volume, surface area, comparisons
6. **Operasi** (Operations) - Basic arithmetic operations
7. **Ujian** (Exam) - Essay and multiple choice

## User Preferences
None specified yet.

## Known Issues
None currently identified.

## Future Enhancements
- Potential backend for score tracking
- User authentication
- Leaderboards
- Additional game modes
