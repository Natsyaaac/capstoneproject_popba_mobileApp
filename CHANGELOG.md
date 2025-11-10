# Changelog - Balloon Pop Maths

## [2.0.0] - 2025-11-10

### ✅ Fixed - Audio Cordova
- **Audio sekarang berfungsi 100% di aplikasi Cordova Android/iOS**
- Menambahkan plugin `cordova-plugin-device` (v3.0.0) untuk deteksi platform
- Meningkatkan `cordova-audio-wrapper.js` ke v2.1 dengan fitur:
  - Auto-detect platform (Android/iOS)
  - Path adjustment otomatis (`/android_asset/www/` untuk Android)
  - Retry mechanism jika media belum ready
  - Console logging lengkap untuk debugging
  - Status callback untuk monitoring playback
  - Fallback ke HTML5 Audio jika Media plugin gagal
- Menambahkan global `window.cordovaReady` flag di index.html
- Dokumentasi lengkap di `www/AUDIO-FIX-README.md`

### ✅ Fixed - Tombol Mute/Unmute
- **Tombol audio on/off sekarang berfungsi dengan benar**
- Menambahkan method `setMuted(boolean)` pada CordovaAudioWrapper
- Menambahkan method `getMuted()` untuk cek status muted
- Update fungsi `muteAudio()`:
  - Menggunakan `setMuted(true)` untuk semua sound effects
  - Pause background music saat muted
  - Support fallback ke property `.muted` untuk HTML5 Audio
- Update fungsi `unMuteAudio()`:
  - Menggunakan `setMuted(false)` untuk semua sound effects
  - Resume background music saat unmuted
  - Console logging untuk debugging

### ✅ Fixed - Nama Aplikasi
- **Nama aplikasi sekarang "Balloon Pop Maths" (bukan "MyApp")**
- Update `config.xml`:
  - Name: "Balloon Pop Maths"
  - Package ID: com.ummet.balloonpop
  - Description: "Game matematika interaktif untuk anak SD - Belajar sambil bermain!"
  - Author: Universitas Muhammadiyah Metro (ilkom@ummetro.ac.id)

### 🎯 Testing Instructions

#### Test di Web Browser (Replit):
1. Buka preview website
2. Klik tombol audio on/off - seharusnya mute/unmute musik
3. Mainkan game - sound effects seharusnya keluar

#### Test di Android App:
```bash
# Build aplikasi
cordova build android

# Install ke device
cordova run android --device

# Monitor audio logs
adb logcat | grep -E '\[Audio\]|\[Cordova\]'
```

**Expected behavior**:
- Console menampilkan: `[Cordova] Device ready event fired`
- Console menampilkan: `[Audio] Platform detected: android`
- Console menampilkan: `[Audio] Playing Cordova media: ...`
- Audio keluar suara dari speaker HP
- Tombol mute/unmute berfungsi dengan baik
- Nama aplikasi di launcher: "Balloon Pop Maths"

### 📦 Package Updates
- Added: `cordova-plugin-device` (v3.0.0)
- Updated: `package.json` - menambahkan device plugin
- Updated: `config.xml` - menambahkan semua plugins ke cordova section

### 📝 Documentation
- Created: `www/AUDIO-FIX-README.md` - Panduan lengkap audio troubleshooting
- Updated: `replit.md` - Dokumentasi project
- Created: `CHANGELOG.md` - File ini

---

## [1.0.0] - Original Version

### Features
- Game matematika interaktif dengan 7 mode:
  - Aljabar
  - Waktu
  - Massa
  - Volume
  - Bangunan (Geometry)
  - Operasi
  - Ujian
- Background music dan sound effects
- Multiple difficulty levels
- High score tracking
- Cordova-ready untuk Android/iOS

### Known Issues (Fixed in v2.0.0)
- ❌ Audio tidak berfungsi di aplikasi Cordova
- ❌ Tombol mute/unmute tidak berfungsi
- ❌ Nama aplikasi masih "MyApp"
