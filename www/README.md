# 🎈 Balloon Pop Maths #

[Versi Langsung Balloon Pop Maths](https://richardhenyash.github.io/balloon-pop-maths/)  

<img src="./assets/testing/responsive/balloon-pop-maths-responsive.png" width="100%" style="margin: 15px;">

## 👥 Anggota Tim – Kelompok 14 ##
- 👨‍💻 **Programmer**: Faiz Ilyas Zulkarnaen  
- 🎨 **UI/UX Designer**: Pandu Winata  
- 📝 **Dokumentasi**: Salma & Yupia  
- 📂 **Project Manager**: Noval Kurniawan
- 🧠 **Brain**: Gilang Prayoga


## 📌 Informasi Tambahan
- **Universitas**: Universitas Muhammadiyah Metro  
- **Program Studi**: Ilmu Komputer – @prodi_ilkom_ummet   
- **Tahun Akademik**: 2025  

---

✨ Dengan **Pop Balon Ajaib**, belajar matematika jadi lebih **mudah, seru, dan menyenangkan**!

## Daftar Isi ##
- [Latar Belakang](#latar-belakang)
- [Tujuan Proyek](#tujuan-proyek)
- [Tujuan Pemilik Situs](#tujuan-pemilik-situs)
- [Tujuan Pengguna](#tujuan-pengguna)
- [UX (Pengalaman Pengguna)](#ux-pengalaman-pengguna)
    - [Strategi Proyek](#strategi-proyek)
        - [Matriks Peluang](#matriks-peluang)
        - [Tahap Awal Pengembangan](#tahap-awal-pengembangan)
    - [Ruang Lingkup Proyek](#ruang-lingkup-proyek)
        - [Demografi Pengguna](#demografi-pengguna)
        - [Kebutuhan Pengguna](#kebutuhan-pengguna)
        - [Cerita Pengguna (User Stories)](#cerita-pengguna-user-stories)
        - [Keterbatasan (Constraints)](#keterbatasan-constraints)
        - [Persyaratan Fungsional](#persyaratan-fungsional)
        - [Aturan Bisnis](#aturan-bisnis)
        - [Fitur Utama](#fitur-utama)
    - [Peta Situs](#peta-situs)
    - [Wireframe (Rancangan Awal)](#wireframe-rancangan-awal)
    - [Pilihan Desain](#pilihan-desain)
        - [Jenis Huruf (Font)](#jenis-huruf-font)
        - [Warna](#warna)
- [Teknologi](#teknologi)
    - [Bahasa Pemrograman](#bahasa-pemrograman)
    - [Framework, Library, dan Alat](#framework-library-dan-alat)
    - [Dukungan Peramban (Browser Support)](#dukungan-peramban-browser-support)
- [Struktur Proyek](#struktur-proyek)
    - [Arsitektur Informasi](#arsitektur-informasi)
    - [Fitur yang Telah Diterapkan](#fitur-yang-telah-diterapkan)
        - [Fitur yang Diterapkan di Tahap 1](#fitur-yang-diterapkan-di-tahap-1)
        - [Fitur yang Akan Diterapkan di Tahap Pengembangan Berikutnya](#fitur-yang-akan-diterapkan-di-tahap-pengembangan-berikutnya)
        - [Perubahan Desain Selama Tahap 1 Pengembangan](#perubahan-desain-selama-tahap-1-pengembangan)
    - [Gaya Responsif (Responsive Styling)](#gaya-responsif-responsive-styling)
- [Pustaka Kode JavaScript](#pustaka-kode-javascript)
- [Logika Permainan](#logika-permainan)
- [Pengujian](#pengujian)
- [Penerapan (Deployment)](#penerapan-deployment)
    - [Proses Penerapan ke GitHub Pages](#proses-penerapan-ke-github-pages)
    - [Forking Proyek (Menyalin Repositori)](#forking-proyek-menyalin-repositori)
    - [Cloning Proyek (Menggandakan Repositori)](#cloning-proyek-menggandakan-repositori)
- [Kredit (Credits)](#kredit-credits)
- [Ucapan Terima Kasih (Acknowledgements)](#ucapan-terima-kasih-acknowledgements)


## Latar Belakang (Background) ##
Selama pandemi Covid, banyak orang tua diharuskan untuk memfasilitasi pendidikan anak-anak mereka di rumah.  
Sering kali, para orang tua harus membagi waktu antara pekerjaan penuh waktu dan tanggung jawab pendidikan di rumah.  
Tugas sekolah, terutama untuk anak-anak usia dini, membutuhkan tingkat pendampingan dan bantuan yang tinggi dari orang tua yang sibuk.  
Permainan matematika berbasis web yang interaktif dapat memberikan cara yang menarik bagi anak-anak untuk belajar keterampilan matematika baru dan memperkuat pengetahuan matematika yang sudah mereka miliki secara mandiri.

---

## Tujuan Proyek (Project Goals) ##
Menyediakan permainan matematika yang sederhana namun menarik sehingga anak-anak dapat memainkannya secara mandiri untuk mempelajari keterampilan matematika baru serta memperkuat pengetahuan matematika yang telah mereka pelajari sebelumnya.

---

## Tujuan Pemilik Situs (Site Owner Goals) ##
Pengembangan situs ini berfungsi sebagai pengalaman belajar bagi pengembangnya.  
Situs web yang sudah selesai nantinya akan menjadi sarana untuk memamerkan keterampilan baru pengembang dan juga membantu meningkatkan profilnya.  
Selain itu, pengembang berharap bahwa putranya yang berusia 7 tahun akan menjadi pengguna setia situs ini!

---

## Tujuan Pengguna (User Goals) ##
Untuk memainkan permainan matematika dengan cara yang menyenangkan, mempelajari keterampilan matematika baru, serta memperkuat pengetahuan matematika yang telah dimiliki.

---

## UX (Pengalaman Pengguna) ##

### Strategi Proyek (Project Strategy) ###

Strategi utama dari proyek **Balloon Pop Maths** adalah mengembangkan permainan edukatif berbasis web yang **mudah diakses dan menarik untuk anak-anak sekolah dasar (SD)**.  
Game ini dirancang agar anak-anak dapat belajar dan berlatih konsep dasar matematika seperti **penjumlahan, pengurangan, perkalian, dan pembagian** dengan cara yang menyenangkan dan interaktif.  

Pendekatan ini diambil karena banyak anak SD cenderung lebih mudah memahami pelajaran melalui **visualisasi dan permainan interaktif**, dibandingkan metode konvensional seperti buku teks atau latihan tertulis.  
Dengan permainan ini, siswa tidak hanya belajar menghitung, tetapi juga **mengasah fokus, refleks, dan ketepatan berpikir** dalam waktu singkat.  

Selain itu, proyek ini juga bertujuan untuk menjadi contoh nyata penerapan **HTML, CSS, dan JavaScript** dalam membuat aplikasi edukatif sederhana yang dapat digunakan di berbagai perangkat, baik laptop maupun ponsel.

#### Matriks Peluang (Opportunities Matrix) ####
Peluang-peluang berikut telah diidentifikasi dan diberi peringkat menggunakan skor **1–5** berdasarkan **tingkat kepentingan** dan **kelayakan**:

| Peluang | Kepentingan | Kelayakan |
|----------|--------------|-----------|
| Permainan Balloon Pop Perkalian | 5 | 4 |
| Permainan Balloon Pop Pembagian | 3 | 4 |
| Permainan Balloon Pop Penjumlahan | 3 | 4 |
| Permainan Balloon Pop Pengurangan | 3 | 4 |
| Formulir Kontak untuk menghubungi pengembang | 3 | 5 |
| Tautan ke halaman [GitHub](https://github.com/richardhenyash) pengembang | 4 | 5 |
| Opsi Berlangganan (Subscribe Option) | 1 | 2 |

<img src="/assets/wireframes/initial-strategy.png" style="margin: 15px; width: 400px;">

---


#### Tahap Awal Pengembangan (Initial Development Phase) ####
Matriks peluang digunakan untuk membantu menentukan item mana yang akan dimasukkan dalam tahap awal pengembangan (fase 1).  
Fase ini difokuskan pada pembuatan fitur utama yang berhubungan langsung dengan inti permainan dan interaksi pengguna.

| Item | Fase Pengembangan |
|------|--------------------|
| Permainan Balloon Pop Perkalian | 1 |
| Formulir Kontak untuk menghubungi pengembang | 1 |
| Tautan ke halaman [GitHub](https://github.com/richardhenyash) pengembang | 1 |
| Permainan Balloon Pop Pembagian | 1 |
| Permainan Balloon Pop Penjumlahan | 1 |
| Permainan Balloon Pop Pengurangan | 1 |
| Opsi Berlangganan (Subscribe Option) | 2 |

Pada **Fase 1**, fokus utama adalah membangun seluruh mode permainan matematika (penjumlahan, pengurangan, perkalian, dan pembagian) agar anak-anak bisa langsung bermain dan belajar secara interaktif.  
Sementara itu, fitur tambahan seperti **opsi berlangganan** direncanakan untuk diterapkan pada fase pengembangan berikutnya agar situs tetap dapat berkembang tanpa mengganggu fungsi utama.

---

### Ruang Lingkup Proyek (Project Scope) ###

#### Demografi Pengguna (User Demographics) ####
- Pengguna utama situs ini adalah **siswa sekolah dasar (kelas 1–5)** berusia sekitar **5 hingga 10 tahun**.  
- Desain yang sederhana, cerah, penuh warna, dan menarik sangat sesuai untuk kelompok usia ini.  
- Game ini dibuat agar anak-anak bisa belajar mandiri sambil tetap merasa seperti sedang bermain, bukan belajar secara formal.

#### Kebutuhan Pengguna (User Requirements) ####
- Harus **menarik secara visual** dan menyenangkan untuk dilihat.  
- **Mudah dinavigasi**, bahkan oleh anak-anak kecil.  
- Pengguna dapat **dengan mudah mengubah pengaturan permainan**, seperti mode atau tingkat kesulitan.  
- Desain harus **responsif**, karena pengguna bisa memainkan permainan ini di berbagai perangkat seperti **ponsel, tablet, maupun komputer desktop**.  

---

#### User Stories ####
* ***Sebagai pengguna (anak SD), saya bermain game ini untuk bersenang-senang dan menikmati pengalaman belajar.***
* ***Sebagai pengguna, saya bermain game ini untuk mempelajari keterampilan matematika baru dengan cara yang menyenangkan.***
* ***Sebagai pengguna, saya bermain game ini untuk memperkuat pengetahuan matematika yang sudah saya miliki melalui latihan interaktif.***
* ***Sebagai pengguna atau orang tua, saya ingin memberikan masukan kepada pengembang tentang pengalaman bermain game ini agar dapat terus ditingkatkan.***

---

### Strategi Proyek ###
Proyek ini bertujuan untuk **menggabungkan pembelajaran matematika dengan hiburan interaktif** bagi anak-anak Sekolah Dasar (usia 5–10 tahun).  
Strategi yang digunakan meliputi:

* Membuat tampilan game yang **cerah, menarik, dan mudah dipahami** oleh anak-anak.
* Menghadirkan suasana belajar yang **menyenangkan melalui permainan** seperti *Balloon Pop*.
* Menyediakan berbagai tingkat kesulitan agar anak dapat **belajar secara bertahap sesuai kemampuan**.
* Memberikan kesempatan kepada **guru dan orang tua** untuk menggunakan game ini sebagai **alat bantu belajar tambahan** di rumah atau di sekolah.
* Menumbuhkan **motivasi belajar matematika sejak dini** melalui pengalaman bermain yang positif.

---

#### Constraints #####
* **Kemampuan pengembang** – pengembang saat ini masih dalam tahap belajar JavaScript.
* **Keterbatasan waktu pengembang** – pengembang bekerja penuh waktu sambil menempuh studi.
  Hal ini dapat memengaruhi jumlah permainan matematika yang bisa dimasukkan dalam fase awal pengembangan.

---

#### Functional Requirements ####
* Pengguna dapat memilih berbagai jenis permainan matematika untuk dimainkan.
* Pengguna dapat memilih opsi berbeda dalam setiap permainan — misalnya tabel perkalian 2x, 5x, dan 10x pada game perkalian, atau penjumlahan hingga 20 pada game penjumlahan.
* Pengguna dapat mengatur tingkat kesulitan permainan agar sesuai dengan usia dan kemampuan.
* Pengguna dapat memulai permainan dari menu utama, serta kembali ke menu kapan pun mereka ingin menghentikan permainan.
* Pengguna dapat melihat skor saat ini dan skor tertinggi sebelumnya — hal ini memotivasi mereka untuk terus bermain dan meningkatkan hasil belajar.
* Pengguna dapat menghubungi pengembang untuk memberikan saran, masukan, atau laporan bug.

---

#### Aturan Bisnis (Business Rules) ####
* Game ini **tidak direncanakan untuk dijual demi keuntungan**.  
  Namun, permainan harus dibuat **semenarik dan semenyenangkan mungkin** agar:
  - Dapat **memaksimalkan peluang belajar** bagi anak-anak yang memainkannya.  
  - **Menarik lebih banyak pengguna** untuk mencoba dan bermain.  
  - Meningkatkan **popularitas game serta profil pengembang** sebagai pembuat game edukatif yang positif dan bermanfaat.

---

#### Fitur Utama (Key Features) ####
Berikut fitur-fitur utama yang telah diidentifikasi dan dinilai dengan skala **1–5** untuk tingkat **kepentingan** dan **kesulitan**.  
Tahap pengembangan yang direncanakan juga disertakan:

Fitur | Kepentingan | Tingkat Kesulitan | Tahap Pengembangan
------|--------------|-------------------|-------------------
Balloon Pop Multiplication game (Perkalian) | 5 | 3 | 1
Contact Form untuk menghubungi pengembang | 4 | 2 | 1
Tautan ke halaman [GitHub](https://github.com/richardhenyash) pengembang | 3 | 1 | 1
Balloon Pop Division game (Pembagian) | 3 | 3 | 1
Balloon Pop Addition game (Penjumlahan) | 3 | 3 | 1
Balloon Pop Subtraction game (Pengurangan) | 3 | 3 | 1
Fitur Berlangganan (Subscribe Option) | 1 | 3 | 2

---

### Peta Situs (Site Map) ###
Sebuah **peta situs awal (Site Map)** telah dibuat untuk menunjukkan alur navigasi dari halaman utama hingga ke bagian permainan dan kontak pengembang.  
Peta ini membantu dalam memahami bagaimana pengguna (anak-anak SD) dapat berpindah antarhalaman dengan mudah dan intuitif.

<img src="./assets/wireframes/site-map.png" width="400px" style="margin: 15px;">

---

### Wireframes ###

[Sketsa Awal (Hand Sketches)](/assets/wireframes/rev0) dibuat untuk menggambarkan tampilan halaman utama dan tampilan permainan tabel perkalian (times table):  

<img src="./assets/wireframes/rev0/home-sketch.jpg" width="600px" style="margin: 15px;">
<img src="./assets/wireframes/rev0/game-sketch.jpg" width="600px" style="margin: 15px;">

Setelah itu, dibuat [Wireframe Awal (Initial Wireframes)](/assets/wireframes/rev1) yang menunjukkan tata letak halaman [Beranda (Home)](/assets/wireframes/rev1/home-multiplication.png) untuk setiap mode permainan:  
[Perkalian (Multiplication)](/assets/wireframes/rev1/home-multiplication.png),  
[Pembagian (Division)](/assets/wireframes/rev1/home-division.png),  
[Penjumlahan (Addition)](/assets/wireframes/rev1/home-addition.png),  
dan [Pengurangan (Subtraction)](/assets/wireframes/rev1/home-subtraction.png).  

Berikut adalah contoh tata letak halaman beranda untuk mode **Perkalian**:  
<img src="./assets/wireframes/rev1/home-multiplication.png" width="600px" style="margin: 15px;"> 

Wireframe awal juga dibuat untuk halaman [Permainan (Game)](/assets/wireframes/rev1/game-multiplication.png) untuk setiap mode, yaitu:  
[Perkalian](/assets/wireframes/rev1/game-multiplication.png),  
[Pembagian](/assets/wireframes/rev1/game-division.png),  
[Penjumlahan](/assets/wireframes/rev1/game-addition.png),  
dan [Pengurangan](/assets/wireframes/rev1/game-subtraction.png).  

Berikut adalah contoh tata letak halaman permainan untuk mode **Perkalian**:  
<img src="./assets/wireframes/rev1/game-multiplication.png" width="600px" style="margin: 15px;"> 

Selanjutnya, dibuat [Wireframe Desain Responsif (Responsive Design Wireframes)](/assets/wireframes/rev2) yang menunjukkan bagaimana tampilan halaman [Beranda](/assets/wireframes/rev1/home-multiplication.png) dan [Permainan](/assets/wireframes/rev1/game-multiplication.png) di berbagai perangkat, seperti [Tablet](/assets/wireframes/rev2/home-multiplication-tablet.png) dan [Ponsel](/assets/wireframes/rev2/home-multiplication-phone.png).  

Berikut tampilan wireframe responsifnya:  

<img src="./assets/wireframes/rev2/home-multiplication-tablet.png" width="300px" align="left" style="margin: 15px;">
<img src="./assets/wireframes/rev2/game-multiplication-tablet.png" width="300px" style="margin: 15px;">
<img src="./assets/wireframes/rev2/home-multiplication-phone.png" width="300px" align="left" style="margin: 15px;">
<img src="./assets/wireframes/rev2/game-multiplication-phone.png" width="300px" style="margin: 15px;">

---

### Pilihan Desain (Design Choices) ###

Dalam tahap perancangan tampilan, fokus utama adalah menciptakan **antarmuka yang ramah anak**, **berwarna cerah**, dan **mudah dipahami** oleh pengguna usia sekolah dasar.  
Desain ini bertujuan untuk menjaga perhatian anak-anak agar tetap fokus sekaligus merasa senang saat belajar matematika melalui permainan.

#### Jenis Huruf (Fonts) ####

Font [Whale I Tried](https://mistifonts.com/whale-i-tried/) dipilih sebagai **font judul utama**, dan digunakan pada bagian **judul utama Balloon Pop Maths** [heading](./assets/testing/features/title.png).  
[Whale I Tried](https://mistifonts.com/whale-i-tried/) adalah font kartun bergaris tepi (outlined) yang dibuat khusus oleh [Misti’s Fonts](https://mistifonts.com/).  
Font ini **gratis untuk penggunaan pribadi dan non-komersial**.  

Alasan pemilihan font ini adalah karena tampilannya yang menyerupai **balon** dengan nuansa **lembut dan ceria**, sangat cocok untuk tema permainan anak-anak.  

* font-family: `"Whale I Tried", sans-serif;`

---

Font [Nunito](https://fonts.google.com/specimen/Nunito?preview.text_type=custom) dipilih sebagai **font utama untuk isi teks (body text)**.  
[Nunito](https://fonts.google.com/specimen/Nunito?preview.text_type=custom) merupakan font sans-serif yang bersih, membulat, dan modern.  
Gaya font ini sesuai dengan tema permainan matematika serta **melengkapi** tampilan font judul [Whale I Tried](https://mistifonts.com/whale-i-tried/).  

Font [Nunito](https://fonts.google.com/specimen/Nunito?preview.text_type=custom) tersedia di [Google Fonts](https://fonts.google.com/)  
dan dilisensikan di bawah [Open Font License (OFL)](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).  

* font-family: `'Nunito', sans-serif;`

---

#### Warna (Colours) ####

Latar belakang bertema “langit” (sky background) menggunakan **gradasi tiga warna (3-colour gradient)** yang dibuat menggunakan [ColorSpace](https://mycolor.space/gradient3).  
Tiga warna yang digunakan adalah **#7CC0FF**, **#6FD1F4**, dan **#9EFBF5**, seperti ditunjukkan pada gambar di bawah:  

<img src="./assets/wireframes/colour-gradient.png" width="800px" style="margin: 15px;"> 

Palet warna ini dipilih agar selaras dengan warna pertama dari gradasi tiga warna tersebut (**#7CC0FF**).  
Inspirasi warna diperoleh menggunakan generator palet warna dari [ColorSpace](https://mycolor.space/).  

Palet warna akhir yang dipilih ditunjukkan pada gambar berikut:  
* #908CD9 - **"Blue Bell"** – digunakan untuk tombol, area pertanyaan, garis luar skor, dan skor tertinggi.  
* #9C70BD - **"Purple Mountain Majesty"** – digunakan untuk efek sorotan tombol, footer, tautan di area informasi, dan kontrol audio.  
* #A2529A - **"Purpureus"** – digunakan untuk teks dialog modal, teks skor tinggi, teks skor, teks informasi, dan elemen sorotan.  
* #3E8BC6 - **"Green Blue Crayola"** – digunakan untuk garis tepi tombol dan area pertanyaan.  
* #EEFBFF - **"Azure X11 Web Color"** – digunakan untuk teks judul, teks tombol, teks pertanyaan, teks jawaban pada balon, dan latar belakang dialog modal.  
* #DC7774 - **"Candy Pink"** – digunakan untuk batang “Kesehatan” (Health bar).  
* #A9A9A9 - **"Silver Chalice"** – digunakan untuk bayangan teks pada teks jawaban balon.  

---

## Teknologi (Technologies) ##

### Bahasa Pemrograman (Languages) ###
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) – digunakan untuk struktur utama halaman web.  
* [CSS](https://www.w3.org/Style/CSS/Overview.en.html) – digunakan untuk mendesain tampilan visual situs dan memberikan gaya warna serta tata letak.  
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) – digunakan untuk logika permainan dan interaktivitas antar elemen di situs.

---

### Framework, Library, dan Alat (Frameworks, Libraries, and Tools) ###
* [Bootstrap](https://getbootstrap.com/docs/4.5/getting-started/introduction/) – digunakan untuk desain responsif dan tata letak grid.  
* [jQuery](https://jquery.com/) – digunakan untuk mempermudah manipulasi elemen DOM dan event handling.  
* [Font Awesome](https://fontawesome.com/) – digunakan untuk ikon visual di dalam game dan antarmuka.  
* [Google Fonts](https://fonts.google.com/) – digunakan untuk mengimpor dan menerapkan font *Whale I Tried* dan *Nunito*.  
* [Email JS](https://www.emailjs.com/) – digunakan untuk mengirim email langsung melalui form kontak di situs.  
* [Jasmine](https://jasmine.github.io/) – digunakan untuk melakukan pengujian (testing) otomatis terhadap kode JavaScript.

---

### Dukungan Peramban (Browser Support) ###
Semua peramban (browser) berikut didukung oleh **Balloon Pop Maths**:
* [Google Chrome](https://www.google.com/intl/en_uk/chrome/)  
* [Microsoft Edge](https://www.microsoft.com/en-us/edge)  
* [Safari](https://www.apple.com/uk/safari/)  
* [Firefox](https://www.mozilla.org/en-GB/firefox/new/)  
* [Opera](https://www.opera.com/)

> ⚠️ **Catatan:**  
> Aplikasi **Balloon Pop Maths** **tidak berfungsi dengan benar** pada  
> [Microsoft Internet Explorer](https://support.microsoft.com/en-us/topic/internet-explorer-downloads-d49e1f0d-571c-9a7b-d97e-be248806ca70#ID0EBBD=Windows_10).  
> Untuk informasi lebih lanjut, silakan lihat bagian **Browser Compatibility** di [TESTING.md](TESTING.md).  
## Structure ##

### Information Architecture ###
Game **Balloon Pop Maths** dirancang sebagai permainan edukatif berbasis web yang membantu anak-anak SD memahami konsep dasar operasi matematika (penjumlahan, pengurangan, perkalian, dan pembagian) dengan cara yang menyenangkan.  
Game ini hanya terdiri dari satu halaman web, [index.html](./index.html), yang terbagi menjadi beberapa bagian utama:

* **Heading Section**  
  Menampilkan judul **[Balloon Pop Maths](./assets/testing/features/title.png)** yang berfungsi sebagai pengenal utama game dan dapat diklik untuk kembali ke halaman utama.

* **Options Section**  
  Berisi menu **[Game Options](./assets/testing/features/options.png)** untuk memilih mode permainan seperti perkalian, pembagian, pengurangan, atau penjumlahan.

* **Information Section**  
  Menyediakan petunjuk **[How To Play](./assets/testing/features/how-to-play.png)** agar anak-anak dapat memahami cara bermain dengan mudah dan mandiri.

* **Game Section**  
  Bagian utama yang menampilkan elemen permainan seperti balon jawaban, skor, dan efek suara. Saat game dimulai, bagian Heading, Options, dan Information akan disembunyikan untuk fokus penuh pada permainan.

* **Footer Section**  
  Menampilkan tautan **[Contact Developer](./assets/testing/features/contact-developer-link.png)** dan **[GitHub](https://github.com/richardhenyash)** yang selalu terlihat, sehingga mudah diakses oleh guru atau pengembang.

---

### Features Implemented ###

#### Phase 1 (Initial Development) ####
Game ini telah mengimplementasikan berbagai fitur utama untuk mendukung pengalaman belajar anak SD:

* **Judul Balloon Pop Maths** — Menarik dan mudah diingat oleh anak-anak.  
  <img src="./assets/testing/features/title.png" style="margin: 15px; width:300px;">

* **Game Mode Selector** — Anak dapat memilih jenis operasi matematika (perkalian, pembagian, penjumlahan, pengurangan).  
  <img src="./assets/testing/features/game-mode.png" style="margin: 15px; width:300px;">

* **High Score Panel** — Menampilkan skor tertinggi untuk memotivasi anak mencapai hasil lebih baik.  
  <img src="./assets/testing/features/high-score.png" style="margin: 15px; width:300px;">

* **Play Button** — Memulai permainan dengan cepat dan mudah.  
  <img src="./assets/testing/features/play.png" style="margin: 15px; width:300px;">

* **Audio Control Options** — Anak-anak dapat mengatur suara sesuai keinginan, membantu suasana belajar yang nyaman.  
  <img src="./assets/testing/features/options-audio.png" style="margin: 15px; width:300px;">

* **How To Play Section** — Menyediakan petunjuk visual agar anak-anak memahami langkah-langkah permainan tanpa perlu banyak membaca.  
  <img src="./assets/testing/features/how-to-play.png" style="margin: 15px; width:300px;">

* **Game Loader** — Menampilkan animasi saat permainan dimuat, menarik perhatian anak.  
  <img src="./assets/testing/features/game-loader.png" style="margin: 15px; width:100px;">

* **Answer Balloons** — Balon jawaban dengan animasi “pop” dan efek suara ketika anak memilih jawaban benar, serta suara “deflate” jika salah.  
  <img src="./assets/testing/features/game-balloons.png" style="margin: 15px; width:500px;">

* **Custom Cursor** — Pointer berubah menjadi jarum ketika diarahkan ke balon, memberikan pengalaman interaktif.  
  <img src="./assets/images/pin.svg" style="margin: 15px; width:30px;">

---

### Educational Strategy for Elementary Students ###
Game ini dirancang untuk diimplementasikan dalam pembelajaran matematika di Sekolah Dasar dengan strategi berikut:

1. **Pendekatan Belajar Sambil Bermain (Game-Based Learning)**  
   Anak-anak SD cenderung belajar lebih efektif ketika mereka merasa sedang bermain. Game ini menggabungkan kesenangan dengan pembelajaran numerik.

2. **Peningkatan Motivasi dan Fokus**  
   Sistem skor dan efek suara memberikan dorongan emosional yang positif. Anak akan merasa tertantang untuk mendapatkan nilai yang lebih tinggi sambil tetap belajar.

3. **Integrasi dalam Kegiatan Kelas**  
   Guru dapat menggunakan game ini sebagai *media interaktif* saat pembelajaran matematika, baik secara individu (di perangkat masing-masing) maupun berkelompok (menggunakan proyektor).

4. **Pembelajaran Mandiri di Rumah**  
   Karena berbasis web dan responsif, anak-anak dapat memainkan game ini di rumah dengan perangkat apa pun — laptop, tablet, atau ponsel.

5. **Penguatan Konsep Dasar Matematika**  
   Melalui pengulangan yang menyenangkan, anak dapat memperkuat pemahaman terhadap operasi dasar seperti penjumlahan, pengurangan, perkalian, dan pembagian tanpa tekanan.

---

Dengan struktur dan fitur seperti ini, *Balloon Pop Maths* bukan hanya menjadi game hiburan, tetapi juga alat pembelajaran interaktif yang efektif untuk meningkatkan kemampuan berhitung dasar anak-anak sekolah dasar.
## Additional Features Implemented ##

* **Health Bar (Bilahan Nyawa)**  
  Menampilkan jumlah nyawa pemain selama permainan. Game akan berakhir jika seluruh nyawa habis.  
  - Level **Easy**: 5 hati (memberikan lebih banyak kesempatan agar anak tidak cepat frustrasi).  
  - Level **Medium**: 3 hati.  
  - Level **Hard**: 1 hati (melatih konsentrasi dan ketelitian).  
  <img src="./assets/testing/features/game-health.png" style="margin: 15px; width:150px;">

  🎯 *Tujuan edukatif:* membantu anak belajar mengelola kesalahan dan meningkatkan ketahanan mental dalam menghadapi tantangan belajar.

---

* **Question Panel (Panel Pertanyaan)**  
  Menampilkan soal matematika yang sedang dimainkan, seperti `6 x 3` atau `9 + 5`.  
  <img src="./assets/testing/features/game-question.png" style="margin: 15px; width:200px;">

  🎯 *Tujuan edukatif:* melatih kecepatan berpikir dan kemampuan berhitung dasar anak secara interaktif.

---

* **Contact Modal (Kotak Hubungi Pengembang)**  
  Dibuat menggunakan [Email JS](https://www.emailjs.com/) dan [JavaScript Mail Library](./assets/js/mail.js).  
  Jika formulir dikirim dengan sukses, maka akan muncul tampilan **Success Modal**.  
  <img src="./assets/testing/features/contact-modal.png" style="margin: 15px; width:300px;">
  <img src="./assets/testing/features/contact-modal-success.png" style="margin: 15px; width:300px;">

  🎯 *Tujuan edukatif:* memungkinkan guru atau orang tua memberikan umpan balik langsung kepada pengembang tentang pengalaman anak menggunakan game ini.

---

* **Game Feedback Modal (Umpan Balik Permainan)**  
  Memberikan pesan motivasi kepada anak di akhir permainan, misalnya:
  - *“Unlucky!”* — jika anak belum berhasil.
  - *“Well Done!”* — jika performa anak baik.
  - *“New High Score!”* — jika anak mencetak rekor baru.  
  <img src="./assets/testing/features/modal-unlucky.png" style="margin: 15px; width:300px;">
  <img src="./assets/testing/features/modal-well-done.png" style="margin: 15px; width:300px;">
  <img src="./assets/testing/features/modal-high-score.png" style="margin: 15px; width:300px;">

  🎯 *Tujuan edukatif:* membangun semangat dan rasa percaya diri anak melalui apresiasi positif setiap kali mereka bermain.

---

## Features Planned for Future Phases ##
* **Subscribe Feature** — Akan ditambahkan pada *Contact Modal* di tahap pengembangan berikutnya.  
  Fitur ini memungkinkan anak atau guru berlangganan game edukatif baru dari pengembang.

---

## Design Changes During Phase 1 ##
Setelah dilakukan uji coba oleh pengguna awal (guru dan siswa SD), beberapa perubahan desain dilakukan untuk meningkatkan pengalaman belajar:

* **Posisi skor in-game** dipindahkan ke kanan atas agar lebih mudah terlihat.  
* **Kontrol audio di opsi** ditambahkan supaya anak dapat menyesuaikan volume sesuai kenyamanan.  
* **Kontrol audio di dalam game** juga ditambahkan untuk fleksibilitas.  
* **Bagian “How To Play”** ditambahkan agar anak-anak dapat belajar cara bermain secara mandiri.  
* **Game loader** ditambahkan agar anak tahu game sedang dimuat — menghindari kebingungan saat menunggu.  
* **Tombol “Options”** diganti menjadi **“Home”** agar lebih mudah dimengerti anak usia SD.

🎯 *Semua perubahan ini bertujuan untuk memastikan pengalaman bermain lebih ramah anak dan mendukung fokus belajar matematika dasar.*

---

## Responsive Styling ##
Agar game dapat dimainkan oleh anak-anak di berbagai perangkat (laptop, tablet, atau ponsel), diterapkan desain **responsif**, meliputi:

* **Judul Balloon Pop Maths** otomatis menyesuaikan ukuran dan posisi pada layar di bawah 768 piksel.  
* **Tombol Play** dan elemen lainnya disesuaikan ukurannya untuk layar kecil (seperti ponsel).  
* **Game Section** menampilkan 2 panel dengan 3 balon vertikal pada perangkat kecil, dan 6 balon horizontal pada perangkat besar (>992 piksel).  
* **Game Layout** menyesuaikan tinggi layar secara otomatis agar tetap terlihat penuh pada semua perangkat.

📱 *Dengan desain responsif ini, anak-anak dapat belajar kapan saja dan di mana saja — di rumah, di sekolah, atau saat perjalanan.*

Lihat juga bagian **Responsive Design** pada [TESTING.md](TESTING.md) untuk hasil pengujian tampilan di berbagai ukuran layar.

## JavaScript Code Library ##

Kode [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) dibagi menjadi beberapa pustaka fungsional yang dapat digunakan kembali, 
dengan tujuan agar struktur program lebih efisien, mudah dibaca, dan mudah dikembangkan di masa depan.  
Semua fungsi didokumentasikan menggunakan [JSDoc](https://jsdoc.app/about-getting-started.html).

File pustaka JavaScript yang digunakan:
* [JavaScript Animation Function Library](./assets/js/animation.js)
* [JavaScript Audio Function Library](./assets/js/audio.js)
* [JavaScript Display Interaction Function Library](./assets/js/display.js)
* [JavaScript Event Handler Library](./assets/js/events.js)
* [JavaScript Game Logic Function Library](./assets/js/game-logic.js)
* [JavaScript Initialisation Library](./assets/js/initialisation.js)
* [JavaScript Mail Library](./assets/js/mail.js)
* [JavaScript Maths Function Library](./assets/js/maths.js)

🎯 *Tujuan edukatif:* Struktur modular ini mempermudah siswa atau pengembang muda yang belajar pemrograman memahami cara kerja game secara bertahap.

---

## Game Logic ##

Logika permainan dikembangkan menggunakan [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).  

Saat pemain menekan tombol **[Play](./assets/testing/features/play.png)**, bagian **heading**, **options**, dan **information** pada halaman [index](index.html) akan disembunyikan, 
dan bagian **game** akan ditampilkan.

Opsi permainan yang dipilih (mode, tingkat kesulitan, dan pengaturan suara) diambil melalui fungsi di  
[JavaScript Display Interaction Functions Library](./assets/js/display.js), lalu disimpan ke dalam variabel global yang diawali dengan prefix `"bpm"`.  
Semua variabel global diinisialisasi dalam [JavaScript Initialisation Library](./assets/js/initialisation.js).

Pemain kemudian diberikan **pertanyaan matematika** berdasarkan mode permainan yang dipilih —  
*perkalian, pembagian, penjumlahan, atau pengurangan*.

Enam balon jawaban akan muncul di layar: 1 jawaban benar dan 5 jawaban salah.  
Pertanyaan dan pilihan jawaban dihasilkan secara acak oleh fungsi di [JavaScript Maths Function Library](./assets/js/maths.js).

Tingkat kesulitan memengaruhi jumlah hati (nyawa) pemain:
- **Easy:** 5 hati 💖  
- **Medium:** 3 hati 💗  
- **Hard:** 1 hati 💔  

Jika pemain memilih **jawaban benar**, animasi dan suara *“pop”* akan diputar melalui  
[JavaScript Animation Function Library](./assets/js/animation.js), dan skor bertambah 1.  
Jika **jawaban salah**, balon akan mengempis disertai efek suara *“deflate”*, lalu satu nyawa akan berkurang.

Permainan berlanjut hingga semua pertanyaan selesai atau nyawa habis.  
Setelah permainan berakhir, **Feedback Modal** muncul dengan pesan sesuai performa pemain:

- Skor < 4 → [Unlucky Modal](./assets/testing/features/modal-unlucky.png)  
- Skor ≥ 4 tanpa rekor baru → [Well Done Modal](./assets/testing/features/modal-well-done.png)  
- Rekor baru → [High Score Modal](./assets/testing/features/modal-high-score.png), dan panel skor tertinggi diperbarui.

🎯 *Tujuan edukatif:* Sistem ini melatih ketelitian dan kecepatan berhitung siswa SD sambil memberikan pengalaman belajar yang menyenangkan dan tidak menegangkan.

Lihat juga [Game Logic UML Diagram](./assets/wireframes/game-logic.png) untuk representasi visual alur permainan:  
<img src="./assets/wireframes/game-logic.png" width="100%" style="margin: 15px;">

---

## Testing ##

Informasi pengujian tambahan dan hasil tangkapan layar dapat dilihat di [TESTING.md](TESTING.md).  
Pengujian dilakukan untuk memastikan seluruh fungsi berjalan baik di berbagai perangkat yang umum digunakan siswa SD.

---

## Deployment ##

Proyek dikembangkan menggunakan [Gitpod](https://www.gitpod.io/) dan disimpan di [GitHub](https://github.com/).  
Selama pengembangan, setiap pembaruan dikomit secara berkala untuk menjaga versi kode tetap aman dan terdokumentasi.  
Website di-*deploy* menggunakan [GitHub Pages](https://pages.github.com/).

Langkah-langkah untuk melakukan *deployment* ke GitHub Pages:

1. Buka [Repositori Proyek Balloon Pop Maths](https://github.com/richardhenyash/balloon-pop-maths).  
2. Klik **Settings** di pojok kanan atas.  
3. Gulir ke bagian **GitHub Pages**.  
4. Pilih *source branch* yang diinginkan (untuk proyek ini menggunakan **master**).  
5. Klik tombol **Save**.  
6. Setelah berhasil, GitHub akan menampilkan tautan situs aktif seperti berikut:  
   👉 [https://richardhenyash.github.io/balloon-pop-maths/](https://richardhenyash.github.io/balloon-pop-maths/)

📘 Referensi tambahan:  
- [About GitHub Pages](https://docs.github.com/en/github/working-with-github-pages/about-github-pages#publishing-sources-for-github-pages-sites)  
- [Creating A GitHub Pages Site](https://docs.github.com/en/github/working-with-github-pages/creating-a-github-pages-site)

---

## Forking or Cloning the Project ##

Untuk membuat salinan proyek ini, diperlukan akun [GitHub](https://github.com/) dan disarankan menginstal  
[Gitpod Browser Extension](https://www.gitpod.io/docs/browser-extension/).

Langkah membuat *fork*:
1. Kunjungi [Repositori Proyek Balloon Pop Maths](https://github.com/richardhenyash/balloon-pop-maths).  
2. Klik tombol **Fork** di pojok kanan atas.  
3. Setelah itu, kamu bisa menjalankan proyek secara lokal melalui Gitpod atau Visual Studio Code.

🎯 *Tujuan edukatif:*  
Bagian ini mendorong siswa yang tertarik pada pemrograman untuk belajar cara berbagi dan mengelola proyek di platform kolaboratif seperti GitHub — sebuah keterampilan penting di dunia teknologi modern.
## Forking the Project ##

For further information on forking a [GitHub](https://github.com/) repository, 
see the [GitHub Documentation](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo).

The project may be forked by following these steps:
* Go to the [Project Code Repository Location](https://github.com/richardhenyash/balloon-pop-maths) on [GitHub](https://github.com/).
* In the top-right corner of the page, click "Fork".  

## Cloning the Project ##

The project may be cloned by following these steps:
* Go to the [Project Code Repository Location](https://github.com/richardhenyash/balloon-pop-maths) on [GitHub](https://github.com/).
* Select the "Code" dropdown and choose "GitHub CLI" under "Clone". This will give you a URL that may be copied into the clipboard. 
* Open the Git Bash command line interface in [Gitpod](https://www.Gitpod.io/).
* Change the current working directory to the location where you would like the cloned directory to reside.
* Type git clone, and then paste the URL copied earlier, e.g.:  
  ```bash
  $ git clone https://github.com/richardhenyash/balloon-pop-maths

