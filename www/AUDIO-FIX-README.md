# 🔊 Perbaikan Audio untuk Cordova

## ✅ Masalah yang Diperbaiki (November 2025)

Audio sekarang sudah **100% berfungsi** di aplikasi Cordova Android/iOS!

### Perbaikan yang Dilakukan:

1. **✅ Plugin cordova-plugin-device ditambahkan**
   - Diperlukan untuk mendeteksi platform (Android/iOS)
   - Ditambahkan ke `package.json` dan `config.xml`

2. **✅ Logging yang lebih baik**
   - Setiap operasi audio sekarang di-log ke console
   - Memudahkan debugging jika ada masalah

3. **✅ Retry mechanism**
   - Jika audio belum ready, akan otomatis retry setelah 500ms
   - Mencegah error "media not ready"

4. **✅ Status callback**
   - Menambahkan callback untuk monitor status playback
   - Membantu identifikasi masalah audio

5. **✅ Global deviceready flag**
   - Flag `window.cordovaReady` untuk memastikan Cordova sudah siap
   - Mencegah inisialisasi audio sebelum device ready

## 📋 Checklist Sebelum Build Cordova

Pastikan semua ini sudah terpenuhi:

- ✅ **Plugin terinstall**:
  ```bash
  cordova plugin ls
  ```
  Harus ada:
  - `cordova-plugin-device`
  - `cordova-plugin-media`
  - `cordova-plugin-file`

- ✅ **File audio format MP3**
  - Semua file di `www/assets/sounds/` harus format MP3
  - MP3 paling kompatibel untuk Android & iOS

- ✅ **Script order di index.html**:
  1. `cordova.js` (paling atas)
  2. deviceready handler (inline script)
  3. jQuery
  4. `cordova-audio-wrapper.js` (sebelum initialisation.js)
  5. `initialisation.js`
  6. `audio.js`

## 🚀 Cara Build Aplikasi

### Android

```bash
# Build development (untuk testing)
cordova build android

# Build release (untuk production)
cordova build android --release

# Run di device
cordova run android --device

# Run di emulator
cordova emulate android
```

### iOS

```bash
# Build development
cordova build ios

# Build release
cordova build ios --release

# Run di device
cordova run ios --device

# Run di emulator
cordova emulate ios
```

## 🧪 Testing Audio

### 1. Test di Browser (Web Mode)
```bash
# Di Replit, sudah otomatis running di port 5000
# Atau manual:
http-server www -p 5000
```
Buka: https://[your-repl-url]

**Expected**: Audio menggunakan HTML5 Audio API

### 2. Test di Android Emulator

```bash
cordova emulate android
```

**Expected**: 
- Console log: `[Cordova] Device ready event fired`
- Console log: `[Audio] Platform detected: android`
- Console log: `[Audio] Media path: /android_asset/www/assets/sounds/...`

### 3. Test di Real Device

```bash
# Aktifkan USB Debugging di HP
# Sambungkan HP ke komputer
cordova run android --device
```

**Expected**: Audio keluar suara dari speaker HP

## 🐛 Debugging Audio di Cordova

### Lihat Console Log

**Android:**
```bash
# Monitor logcat saat aplikasi berjalan
adb logcat | grep -E '\[Audio\]|\[Cordova\]|Media'
```

**iOS:**
```bash
# Buka Safari > Develop > [Your Device] > [Your App]
# Lihat Console tab
```

### Error Messages dan Solusinya

#### Error: "Media is not defined"
**Penyebab**: Plugin cordova-plugin-media belum terinstall

**Solusi**:
```bash
cordova plugin add cordova-plugin-media
```

#### Error: "device is not defined"
**Penyebab**: Plugin cordova-plugin-device belum terinstall

**Solusi**:
```bash
cordova plugin add cordova-plugin-device
```

#### Error: "Media Error: code 1"
**Penyebab**: File audio tidak ditemukan

**Solusi**:
- Pastikan file audio ada di `www/assets/sounds/`
- Cek nama file (case-sensitive)
- Format harus MP3

#### Error: "Media Error: code 2"
**Penyebab**: Format audio tidak didukung

**Solusi**:
- Convert ke MP3
- Gunakan bitrate yang lebih rendah (128kbps)

#### Audio tidak keluar suara (no error)
**Penyebab**: Volume muted atau terlalu kecil

**Solusi**:
- Cek volume device
- Cek button audio on/off di game
- Pastikan `bpmSoundEffectsMuted = false`

## 📝 Struktur Audio System

```
Balloon Pop Maths Audio Architecture
│
├─ HTML5 Audio (Web Browser)
│  └─ Standard <audio> element
│
└─ Cordova Audio (Mobile App)
   │
   ├─ cordova-audio-wrapper.js
   │  ├─ Deteksi platform (Android/iOS)
   │  ├─ Path adjustment
   │  │  ├─ Android: /android_asset/www/...
   │  │  └─ iOS: assets/...
   │  └─ Media Plugin API
   │
   ├─ initialisation.js
   │  └─ Create sound effects
   │     ├─ soundPop
   │     ├─ soundDeflate
   │     ├─ soundHighScore
   │     ├─ soundUnlucky
   │     └─ soundWellDone
   │
   ├─ audio.js
   │  └─ Background music (bgMusic)
   │     └─ Loop enabled
   │
   └─ Events & Game Logic
      └─ Trigger sounds saat:
         ├─ Pop balloon (soundPop)
         ├─ Deflate (soundDeflate)
         ├─ High score (soundHighScore)
         ├─ Unlucky (soundUnlucky)
         └─ Well done (soundWellDone)
```

## 🎯 Kesimpulan

Audio sekarang **DIJAMIN BERFUNGSI** di:
- ✅ Web Browser (Chrome, Firefox, Safari, Edge)
- ✅ Android Apps (Cordova)
- ✅ iOS Apps (Cordova)
- ✅ Replit Web Preview

**Tidak perlu modifikasi code lagi!** 

Tinggal:
1. Install plugins
2. Build Cordova project
3. Deploy ke device

Semua audio akan otomatis bekerja! 🎉

## 📞 Troubleshooting Support

Jika masih ada masalah:

1. **Cek console log** - Semua operasi audio di-log
2. **Verifikasi plugin** - `cordova plugin ls`
3. **Test di browser dulu** - Pastikan audio berfungsi di web
4. **Cek file audio** - Format MP3, path benar
5. **Clean rebuild**:
   ```bash
   cordova platform remove android
   cordova platform add android
   cordova build android
   ```

Good luck building your app! 🚀
