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
- **2025-11-10**: Initial Replit setup
  - Configured http-server to serve the `www` directory on port 5000
  - Added Replit-specific entries to .gitignore
  - Created documentation in replit.md

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
- **Cordova Plugins**:
  - cordova-plugin-media (audio)
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
The game uses a dual-mode audio system:
- **Web Mode**: HTML5 Audio API
- **Cordova Mode**: Cordova Media Plugin
The `cordova-audio-wrapper.js` automatically detects the environment and uses the appropriate method.

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
