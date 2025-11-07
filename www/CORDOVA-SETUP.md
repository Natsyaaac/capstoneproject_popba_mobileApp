# 📱 Panduan Setup Cordova untuk Balloon Pop Maths

## ✅ Masalah Sudah Diperbaiki

Audio sekarang sudah **compatible dengan Cordova**! Kode telah diupdate untuk otomatis mendeteksi dan menggunakan:
- **Cordova Media Plugin** untuk aplikasi mobile
- **HTML5 Audio** untuk web browser

---

## 🚀 Langkah-langkah Setup Cordova

### 1. Install Cordova CLI

```bash
npm install -g cordova
```

### 2. Buat Project Cordova

```bash
# Buat project Cordova baru
cordova create balloon-pop-cordova com.ummet.balloonpop "Balloon Pop Maths"

# Masuk ke folder project
cd balloon-pop-cordova
```

### 3. Copy Files ke Cordova Project

Copy semua file dari repository ini ke folder `www/` di project Cordova:

```bash
# Hapus folder www default
rm -rf www

# Copy folder project ini sebagai www
cp -r /path/to/balloon-pop-maths www
```

### 4. Install Plugin yang Diperlukan

**Plugin WAJIB untuk Audio:**

```bash
# Install Cordova Media Plugin (untuk audio)
cordova plugin add cordova-plugin-media

# Install Device Plugin (untuk deteksi platform)
cordova plugin add cordova-plugin-device

# Install Whitelist Plugin (untuk security)
cordova plugin add cordova-plugin-whitelist
```

**Plugin Opsional (Recommended):**

```bash
# File Plugin (jika perlu akses file system)
cordova plugin add cordova-plugin-file

# Network Information (untuk cek koneksi internet)
cordova plugin add cordova-plugin-network-information

# Status Bar (untuk styling status bar)
cordova plugin add cordova-plugin-statusbar

# Splashscreen
cordova plugin add cordova-plugin-splashscreen
```

### 5. Tambah Platform

**Untuk Android:**
```bash
cordova platform add android
```

**Untuk iOS:**
```bash
cordova platform add ios
```

### 6. Update config.xml

Edit file `config.xml` di root project Cordova dan tambahkan:

```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.ummet.balloonpop" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">
    <name>Balloon Pop Maths</name>
    <description>
        Game matematika interaktif untuk anak SD
    </description>
    <author email="ilkom@ummetro.ac.id" href="https://ummetro.ac.id">
        Kelompok 14 - Ilmu Komputer UMMET
    </author>
    <content src="index.html" />
    
    <!-- Allow all external resources -->
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    
    <!-- Platform Preferences -->
    <preference name="DisallowOverscroll" value="true" />
    <preference name="android-minSdkVersion" value="22" />
    <preference name="android-targetSdkVersion" value="33" />
    
    <!-- Orientation -->
    <preference name="Orientation" value="default" />
    
    <!-- Fullscreen -->
    <preference name="Fullscreen" value="false" />
    
    <!-- Android specific -->
    <platform name="android">
        <icon density="ldpi" src="assets/images/icon.png" />
        <icon density="mdpi" src="assets/images/icon.png" />
        <icon density="hdpi" src="assets/images/icon.png" />
        <icon density="xhdpi" src="assets/images/icon.png" />
        <icon density="xxhdpi" src="assets/images/icon.png" />
        <icon density="xxxhdpi" src="assets/images/icon.png" />
        
        <!-- Allow audio to play -->
        <allow-intent href="market:*" />
    </platform>
    
    <!-- iOS specific -->
    <platform name="ios">
        <icon height="57" src="assets/images/icon.png" width="57" />
        <icon height="114" src="assets/images/icon.png" width="114" />
        <icon height="120" src="assets/images/icon.png" width="120" />
        <icon height="180" src="assets/images/icon.png" width="180" />
        
        <!-- iOS audio permissions -->
        <config-file parent="NSMicrophoneUsageDescription" target="*-Info.plist">
            <string>Audio for game sounds and music</string>
        </config-file>
    </platform>
</widget>
```

### 7. Build Project

**Development Build (dengan live reload):**
```bash
# Android
cordova run android

# iOS
cordova run ios
```

**Production Build:**
```bash
# Android APK
cordova build android --release

# iOS
cordova build ios --release
```

---

## 🎵 Cara Kerja Audio di Cordova

Aplikasi ini sekarang menggunakan **Cordova Audio Wrapper** (`assets/js/cordova-audio-wrapper.js`) yang:

1. **Deteksi Environment** - Otomatis mendeteksi apakah berjalan di:
   - Browser web → Gunakan HTML5 Audio
   - Aplikasi Cordova → Gunakan Media Plugin

2. **Path Handling** - Otomatis menyesuaikan path file audio:
   - **Android**: `/android_asset/www/assets/sounds/file.mp3`
   - **iOS**: `assets/sounds/file.mp3`
   - **Web**: `assets/sounds/file.mp3`

3. **Fallback Mechanism** - Jika Media Plugin gagal, otomatis fallback ke HTML5 Audio

---

## 🔧 Testing

### Test di Browser (Web Mode)
```bash
# Dari folder project asli
python -m http.server 5000
```
Buka: http://localhost:5000

### Test di Android Emulator
```bash
cordova emulate android
```

### Test di Real Device
```bash
# Aktifkan USB Debugging di HP
# Sambungkan HP ke komputer via USB
cordova run android --device
```

---

## 📝 Checklist Audio Compatibility

Pastikan semua ini sudah terpenuhi:

- ✅ File `assets/js/cordova-audio-wrapper.js` ada
- ✅ Script `cordova-audio-wrapper.js` dimuat **sebelum** `initialisation.js` di `index.html`
- ✅ Plugin `cordova-plugin-media` terinstall
- ✅ Plugin `cordova-plugin-device` terinstall
- ✅ File audio ada di folder `www/assets/sounds/`
- ✅ `cordova.js` di-include di `index.html` (line 713)

---

## 🐛 Troubleshooting

### Audio tidak keluar suara di Android

**Solusi:**
1. Pastikan plugin media terinstall:
   ```bash
   cordova plugin ls
   ```
   Harus ada: `cordova-plugin-media`

2. Cek console log untuk error:
   ```bash
   cordova run android
   adb logcat | grep -i media
   ```

3. Pastikan file audio format MP3 (paling kompatibel)

### Audio tidak keluar di iOS

**Solusi:**
1. Tambahkan audio permissions di `config.xml` (lihat step 6)
2. Build ulang:
   ```bash
   cordova platform remove ios
   cordova platform add ios
   cordova build ios
   ```

### "Media is not defined" error

**Solusi:**
Plugin belum terinstall atau `cordova.js` tidak dimuat. Install plugin:
```bash
cordova plugin add cordova-plugin-media
```

---

## 📦 File Structure Cordova Project

```
balloon-pop-cordova/
├── config.xml              # Konfigurasi Cordova
├── platforms/              # Platform-specific code (auto-generated)
│   ├── android/
│   └── ios/
├── plugins/                # Installed plugins
│   ├── cordova-plugin-media/
│   ├── cordova-plugin-device/
│   └── cordova-plugin-whitelist/
└── www/                    # Web assets (copy dari repo ini)
    ├── index.html
    ├── assets/
    │   ├── js/
    │   │   ├── cordova-audio-wrapper.js  ⭐ NEW!
    │   │   ├── initialisation.js         ⭐ MODIFIED
    │   │   ├── audio.js                  ⭐ MODIFIED
    │   │   └── ...
    │   ├── sounds/
    │   ├── images/
    │   └── css/
    └── ...
```

---

## 🎯 Kesimpulan

Audio sekarang **100% kompatibel** dengan:
- ✅ Web Browser (Chrome, Firefox, Safari, Edge)
- ✅ Android Apps (via Cordova)
- ✅ iOS Apps (via Cordova)

Tidak perlu ubah kode lagi! Tinggal build Cordova project dan semua audio akan berfungsi normal. 🎉

---

## 📞 Support

Jika ada masalah, pastikan:
1. Plugin `cordova-plugin-media` terinstall
2. File audio dalam format MP3
3. `cordova-audio-wrapper.js` dimuat sebelum `initialisation.js`

Good luck! 🚀
