/**
 * @fileOverview Story Mode Question Generator - Soal Cerita untuk SD Kelas 1-6
 * @description Bank soal cerita profesional untuk game Balloon Pop Maths
 * @version 3.0.0
 * 
 * Tingkat Kesulitan:
 * - Easy: Kelas 1-3 SD (bilangan kecil, operasi sederhana)
 * - Medium: Kelas 4-5 SD (bilangan lebih besar, operasi campuran)
 * - Hard: Kelas 6 SD (bilangan besar, operasi kompleks, persentase, pecahan)
 * 
 * Mode yang didukung:
 * - operator (Operasi Hitung) dengan sub-mode: Kurang, Tambah, Bagi, Kali
 * - aljabar (Aljabar) dengan sub-mode: Isi Kotak Kosong, Nilai Variabel, Persamaan Sederhana, Pola Bilangan
 * - time (Waktu) dengan sub-mode: Baca Jam, Tambah & Kurang Waktu, Konversi Waktu, Selisih Waktu
 * - heavy (Massa/Berat) dengan sub-mode: Konversi Berat, Tambah & Kurang Berat, Bandingkan Berat, Selisih Berat
 * - volume (Volume) dengan sub-mode: Volume, Tambah Volume, Selisih Volume, Perkiraan Volume
 * - up (Bangunan/Geometri) dengan sub-mode yang sesuai
 */
/*jshint esversion: 6 */

const StoryMode = {
    names: {
        boys: ["Budi", "Andi", "Riko", "Deni", "Fajar", "Hasan", "Gilang", "Rizki", "Tono", "Wahyu", 
               "Bagus", "Dimas", "Eko", "Faisal", "Galih", "Irfan", "Joko", "Kevin", "Lukman", "Mahmud",
               "Naufal", "Omar", "Putra", "Qori", "Raka", "Satria", "Taufik", "Umar", "Vino", "Wawan"],
        girls: ["Ani", "Siti", "Dewi", "Rani", "Putri", "Maya", "Lina", "Nisa", "Tika", "Wulan", 
                "Bunga", "Citra", "Dina", "Eka", "Fitri", "Gita", "Hana", "Indah", "Julia", "Kartika",
                "Laras", "Mila", "Nadya", "Ola", "Puspita", "Qisya", "Ratna", "Sarah", "Tiara", "Umi"],
        teachers: ["Bu Guru", "Pak Guru", "Bu Ani", "Pak Budi", "Bu Sari", "Pak Hendra", "Bu Ratna", "Pak Ahmad"],
        families: ["Ayah", "Ibu", "Kakak", "Adik", "Nenek", "Kakek", "Paman", "Bibi", "Sepupu"]
    },

    items: {
        fruits: ["apel", "jeruk", "mangga", "pisang", "anggur", "semangka", "melon", "strawberry", "pepaya", "rambutan", "durian", "salak", "jambu", "nanas", "kelapa"],
        snacks: ["kue", "roti", "permen", "coklat", "biskuit", "donat", "puding", "es krim", "keripik", "wafer", "martabak", "bakpao", "onde-onde", "lapis legit"],
        stationery: ["pensil", "pulpen", "buku tulis", "penghapus", "penggaris", "crayon", "spidol", "rautan", "gunting", "lem", "kertas", "map", "stabilo", "jangka"],
        toys: ["boneka", "mobil-mobilan", "robot", "bola", "puzzle", "lego", "kelereng", "yoyo", "layangan", "kartu", "pesawat-pesawatan", "teddy bear"],
        animals: ["kucing", "kelinci", "hamster", "ikan", "burung", "ayam", "bebek", "kambing", "sapi", "kuda", "domba", "anjing"],
        flowers: ["mawar", "melati", "anggrek", "tulip", "bunga matahari", "kamboja", "dahlia", "krisan", "lavender", "lily"],
        vegetables: ["wortel", "bayam", "kangkung", "tomat", "terong", "kentang", "buncis", "kacang panjang", "cabai"],
        school: ["meja", "kursi", "papan tulis", "tas", "sepatu", "seragam", "topi", "dasi"]
    },

    places: {
        school: ["kelas", "perpustakaan", "kantin", "lapangan", "taman sekolah", "ruang guru", "aula", "laboratorium", "UKS"],
        home: ["rumah", "dapur", "taman", "kamar", "ruang tamu", "garasi", "halaman", "gudang", "kamar mandi"],
        public: ["pasar", "toko", "supermarket", "taman kota", "kebun binatang", "museum", "kolam renang", "perpustakaan kota", "mall", "bioskop"],
        nature: ["sawah", "kebun", "hutan", "sungai", "pantai", "gunung", "danau", "taman bunga", "ladang"]
    },

    rand: function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    randInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randName: function() {
        const allNames = [...this.names.boys, ...this.names.girls];
        return this.rand(allNames);
    },

    randBoyName: function() {
        return this.rand(this.names.boys);
    },

    randGirlName: function() {
        return this.rand(this.names.girls);
    },

    randItem: function() {
        const allItems = [...this.items.fruits, ...this.items.snacks, ...this.items.stationery];
        return this.rand(allItems);
    },

    randFruit: function() {
        return this.rand(this.items.fruits);
    },

    randSnack: function() {
        return this.rand(this.items.snacks);
    },

    randToy: function() {
        return this.rand(this.items.toys);
    },

    randAnimal: function() {
        return this.rand(this.items.animals);
    },

    randPlace: function() {
        const allPlaces = [...this.places.school, ...this.places.public];
        return this.rand(allPlaces);
    }
};

function getGradeRange(difficulty) {
    const difficultyGrades = {
        "easy": [1, 2, 3],
        "medium": [4, 5],
        "hard": [6]
    };
    return difficultyGrades[difficulty] || difficultyGrades["medium"];
}

function getRandomGrade(difficulty) {
    const grades = getGradeRange(difficulty);
    return grades[Math.floor(Math.random() * grades.length)];
}

function generateOperatorQuestions(grade, subMode) {
    const S = StoryMode;
    let questions = [];

    if (subMode === "Kurang" || subMode === "pengurangan") {
        switch(grade) {
            case 1:
                questions = [
                    () => { const a = S.randInt(3, 9); const b = S.randInt(1, a-1); return [`${S.randName()} punya ${a} ${S.randFruit()}. Dimakan ${b}. Sisa berapa?`, a - b]; },
                    () => { const a = S.randInt(5, 10); const b = S.randInt(1, a-2); return [`Ada ${a} ${S.randSnack()} di meja. Diambil ${b}. Sisa berapa?`, a - b]; },
                    () => { const a = S.randInt(4, 8); const b = S.randInt(1, a-1); return [`${S.randName()} mempunyai ${a} ${S.randToy()}. Diberikan ke teman ${b}. Berapa yang tersisa?`, a - b]; },
                    () => { const a = S.randInt(6, 10); const b = S.randInt(2, a-1); return [`Di keranjang ada ${a} ${S.randFruit()}. ${S.rand(S.names.families)} mengambil ${b}. Sisa berapa?`, a - b]; },
                    () => { const a = S.randInt(5, 9); const b = S.randInt(1, a-2); return [`${S.randName()} punya ${a} ${S.rand(S.items.stationery)}. Hilang ${b}. Sekarang punya berapa?`, a - b]; },
                    () => { const a = S.randInt(7, 10); const b = S.randInt(2, 4); return [`Ada ${a} burung di pohon. ${b} burung terbang. Berapa burung yang masih di pohon?`, a - b]; },
                    () => { const a = S.randInt(5, 9); const b = S.randInt(1, 3); return [`${S.randName()} memiliki ${a} kelereng. Diberikan ${b} ke adik. Sisa kelereng berapa?`, a - b]; },
                    () => { const a = S.randInt(8, 10); const b = S.randInt(2, 5); return [`Di akuarium ada ${a} ikan. ${b} ikan dipindahkan. Berapa ikan yang tersisa?`, a - b]; },
                ];
                break;
            case 2:
                questions = [
                    () => { const a = S.randInt(10, 20); const b = S.randInt(3, a-3); return [`${S.randName()} membeli ${a} ${S.randSnack()}. Dimakan ${b}. Berapa sisanya?`, a - b]; },
                    () => { const a = S.randInt(15, 25); const b = S.randInt(5, a-5); return [`Di kelas ada ${a} siswa. ${b} siswa pulang. Berapa siswa yang masih di kelas?`, a - b]; },
                    () => { const a = S.randInt(12, 20); const b = S.randInt(4, a-3); return [`${S.randName()} punya ${a} ${S.rand(S.items.stationery)}. Dipinjamkan ${b}. Sisa berapa?`, a - b]; },
                    () => { const a = S.randInt(20, 30); const b = S.randInt(8, a-5); return [`Perpustakaan punya ${a} buku. Dipinjam ${b} buku. Sisa buku di perpustakaan berapa?`, a - b]; },
                    () => { const a = S.randInt(15, 25); const b = S.randInt(5, 10); return [`Di taman ada ${a} ${S.randAnimal()}. ${b} pergi. Berapa yang masih ada?`, a - b]; },
                    () => { const a = S.randInt(18, 28); const b = S.randInt(6, 12); return [`${S.randName()} mengumpulkan ${a} ${S.randFruit()}. Dijual ${b}. Berapa yang tersisa?`, a - b]; },
                    () => { const a = S.randInt(25, 35); const b = S.randInt(10, 15); return [`Sekolah memiliki ${a} komputer. ${b} komputer rusak. Berapa komputer yang bisa dipakai?`, a - b]; },
                ];
                break;
            case 3:
                questions = [
                    () => { const a = S.randInt(50, 100); const b = S.randInt(15, a-20); return [`${S.randName()} mempunyai Rp${a}.000. Dibelikan buku Rp${b}.000. Sisa uang berapa ribu rupiah?`, a - b]; },
                    () => { const a = S.randInt(100, 200); const b = S.randInt(30, a-30); return [`Toko punya ${a} ${S.randSnack()}. Terjual ${b}. Sisa berapa?`, a - b]; },
                    () => { const a = S.randInt(80, 150); const b = S.randInt(25, a-20); return [`Di peternakan ada ${a} ayam. Dijual ${b} ekor. Berapa ayam yang tersisa?`, a - b]; },
                    () => { const a = S.randInt(150, 250); const b = S.randInt(50, a-40); return [`Pabrik memproduksi ${a} roti. ${b} roti terjual. Berapa roti yang tersisa?`, a - b]; },
                    () => { const a = S.randInt(200, 300); const b = S.randInt(80, 120); return [`Sekolah mempunyai ${a} buku. Dipinjamkan ${b} buku ke siswa. Sisa buku berapa?`, a - b]; },
                    () => { const a = S.randInt(75, 125); const b = S.randInt(20, 40); return [`${S.randName()} mengumpulkan ${a} stiker. Diberikan ${b} ke teman. Berapa stiker yang dimiliki sekarang?`, a - b]; },
                ];
                break;
            case 4:
                questions = [
                    () => { const a = S.randInt(500, 1000); const b = S.randInt(150, a-200); return [`Toko buku memiliki ${a} buku. Terjual ${b} buku. Berapa buku yang tersisa?`, a - b]; },
                    () => { const a = S.randInt(1000, 2000); const b = S.randInt(300, a-400); return [`${S.randName()} menabung Rp${a.toLocaleString()}. Diambil Rp${b.toLocaleString()}. Sisa tabungan berapa rupiah?`, a - b]; },
                    () => { const a = S.randInt(800, 1500); const b = S.randInt(250, a-300); return [`Gudang menyimpan ${a} karung beras. Dijual ${b} karung. Berapa karung yang tersisa?`, a - b]; },
                    () => { const a = S.randInt(2500, 4000); const b = S.randInt(800, 1500); return [`Perpustakaan kota memiliki ${a} buku. Dipinjam ${b} buku. Berapa buku yang masih ada?`, a - b]; },
                    () => { const a = S.randInt(1500, 2500); const b = S.randInt(400, 800); return [`Supermarket mempunyai ${a} botol minuman. Terjual ${b} botol. Sisa berapa botol?`, a - b]; },
                ];
                break;
            case 5:
                questions = [
                    () => { const a = S.randInt(5000, 10000); const b = S.randInt(1500, a-2000); return [`Pabrik memproduksi ${a.toLocaleString()} unit barang. Terjual ${b.toLocaleString()} unit. Berapa unit yang tersisa?`, a - b]; },
                    () => { const a = S.randInt(10000, 25000); const b = S.randInt(3000, 8000); return [`${S.randName()} memiliki tabungan Rp${a.toLocaleString()}. Digunakan Rp${b.toLocaleString()}. Sisa tabungan berapa rupiah?`, a - b]; },
                    () => { const a = S.randInt(15000, 30000); const b = S.randInt(5000, 12000); return [`Stadion menampung ${a.toLocaleString()} penonton. ${b.toLocaleString()} penonton pulang. Berapa penonton yang tersisa?`, a - b]; },
                    () => { const a = S.randInt(8000, 15000); const b = S.randInt(2000, 5000); return [`Perkebunan menghasilkan ${a.toLocaleString()} kg buah. Dijual ${b.toLocaleString()} kg. Berapa kg yang tersisa?`, a - b]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const a = S.randInt(50000, 100000); const b = S.randInt(15000, a-20000); return [`Perusahaan memiliki aset Rp${a.toLocaleString()}. Pengeluaran Rp${b.toLocaleString()}. Sisa aset berapa rupiah?`, a - b]; },
                    () => { const a = S.randInt(100000, 250000); const b = S.randInt(30000, 80000); return [`Koperasi memiliki modal Rp${a.toLocaleString()}. Digunakan Rp${b.toLocaleString()}. Berapa sisa modalnya?`, a - b]; },
                    () => { const a = S.randInt(75000, 150000); const b = S.randInt(20000, 50000); return [`Populasi kota adalah ${a.toLocaleString()} jiwa. ${b.toLocaleString()} jiwa pindah. Berapa populasi sekarang?`, a - b]; },
                    () => { const persen = S.randInt(10, 30); const nilai = S.randInt(500, 2000); const potongan = Math.round((persen * nilai) / 100); return [`Harga barang Rp${nilai.toLocaleString()}. Diskon ${persen}%. Berapa potongan harganya?`, potongan]; },
                    () => { const a = S.randInt(1000000, 5000000); const b = S.randInt(250000, 1000000); return [`Dana BOS sekolah Rp${a.toLocaleString()}. Digunakan Rp${b.toLocaleString()}. Berapa sisa dananya?`, a - b]; },
                ];
                break;
        }
    }
    else if (subMode === "Tambah" || subMode === "penjumlahan") {
        switch(grade) {
            case 1:
                questions = [
                    () => { const a = S.randInt(1, 5); const b = S.randInt(1, 4); return [`${S.randName()} punya ${a} ${S.randFruit()}. Diberi ${b} lagi. Berapa semuanya?`, a + b]; },
                    () => { const a = S.randInt(2, 6); const b = S.randInt(1, 3); return [`Ada ${a} ${S.randSnack()} di piring. Ditambah ${b}. Jadi berapa?`, a + b]; },
                    () => { const a = S.randInt(1, 5); const b = S.randInt(2, 4); return [`${S.randName()} punya ${a} ${S.randToy()}. ${S.rand(S.names.families)} memberi ${b} lagi. Sekarang punya berapa?`, a + b]; },
                    () => { const a = S.randInt(2, 5); const b = S.randInt(1, 4); return [`Di meja ada ${a} buku. ${S.randName()} meletakkan ${b} buku lagi. Berapa buku di meja sekarang?`, a + b]; },
                    () => { const a = S.randInt(3, 6); const b = S.randInt(2, 4); return [`Di taman ada ${a} kupu-kupu. Datang ${b} kupu-kupu lagi. Berapa kupu-kupu sekarang?`, a + b]; },
                    () => { const a = S.randInt(2, 5); const b = S.randInt(1, 3); return [`${S.randName()} mengumpulkan ${a} daun. Lalu menemukan ${b} daun lagi. Berapa daun semuanya?`, a + b]; },
                    () => { const a = S.randInt(1, 4); const b = S.randInt(2, 5); return [`Ada ${a} anak bermain. ${b} anak lagi datang. Berapa anak yang bermain sekarang?`, a + b]; },
                    () => { const a = S.randInt(2, 6); const b = S.randInt(1, 4); return [`Di keranjang ada ${a} ${S.randFruit()}. Ibu menambahkan ${b} ${S.randFruit()}. Berapa buah sekarang?`, a + b]; },
                ];
                break;
            case 2:
                questions = [
                    () => { const a = S.randInt(8, 15); const b = S.randInt(5, 10); return [`${S.randName()} membeli ${a} ${S.randSnack()}. Dapat bonus ${b}. Berapa total ${S.randSnack()}nya?`, a + b]; },
                    () => { const a = S.randInt(12, 20); const b = S.randInt(6, 12); return [`Di kelas A ada ${a} siswa. Di kelas B ada ${b} siswa. Berapa total siswa?`, a + b]; },
                    () => { const a = S.randInt(10, 18); const b = S.randInt(7, 12); return [`${S.randName()} punya ${a} kelereng. Diberi ${b} kelereng oleh teman. Berapa kelereng sekarang?`, a + b]; },
                    () => { const a = S.randInt(15, 25); const b = S.randInt(8, 15); return [`Perpustakaan mendapat ${a} buku baru. Kemudian dapat donasi ${b} buku lagi. Berapa total buku baru?`, a + b]; },
                    () => { const a = S.randInt(10, 20); const b = S.randInt(5, 10); return [`Di kolam ada ${a} ikan. Ditambah ${b} ikan lagi. Berapa ikan sekarang?`, a + b]; },
                    () => { const a = S.randInt(18, 25); const b = S.randInt(10, 15); return [`${S.randName()} mengumpulkan ${a} stiker. Dapat ${b} stiker lagi dari kakak. Berapa stiker semuanya?`, a + b]; },
                ];
                break;
            case 3:
                questions = [
                    () => { const a = S.randInt(50, 100); const b = S.randInt(25, 50); return [`${S.randName()} menabung Rp${a}.000. Dapat uang saku Rp${b}.000. Berapa total tabungan dalam ribu rupiah?`, a + b]; },
                    () => { const a = S.randInt(100, 200); const b = S.randInt(50, 100); return [`Toko memiliki ${a} barang. Dapat kiriman ${b} barang lagi. Berapa total barang?`, a + b]; },
                    () => { const a = S.randInt(150, 250); const b = S.randInt(75, 125); return [`Peternak memiliki ${a} ayam. Membeli ${b} ayam lagi. Berapa total ayam?`, a + b]; },
                    () => { const a = S.randInt(80, 150); const b = S.randInt(40, 80); return [`Di kebun ada ${a} pohon mangga. Ditanam ${b} pohon lagi. Berapa total pohon mangga?`, a + b]; },
                    () => { const a = S.randInt(200, 350); const b = S.randInt(100, 200); return [`Sekolah memiliki ${a} kursi. Membeli ${b} kursi baru. Berapa kursi sekarang?`, a + b]; },
                ];
                break;
            case 4:
                questions = [
                    () => { const a = S.randInt(500, 1000); const b = S.randInt(250, 500); return [`Toko buku menjual ${a} buku bulan lalu. Bulan ini terjual ${b} buku. Berapa total buku terjual?`, a + b]; },
                    () => { const a = S.randInt(1500, 2500); const b = S.randInt(750, 1250); return [`Desa A berpenduduk ${a.toLocaleString()} jiwa. Desa B berpenduduk ${b.toLocaleString()} jiwa. Berapa total penduduk?`, a + b]; },
                    () => { const a = S.randInt(2000, 3500); const b = S.randInt(1000, 2000); return [`Pabrik A memproduksi ${a.toLocaleString()} unit. Pabrik B memproduksi ${b.toLocaleString()} unit. Total produksi berapa?`, a + b]; },
                    () => { const a = S.randInt(3000, 5000); const b = S.randInt(1500, 2500); return [`Stadion A menampung ${a.toLocaleString()} penonton. Stadion B menampung ${b.toLocaleString()} penonton. Berapa total kapasitas?`, a + b]; },
                ];
                break;
            case 5:
                questions = [
                    () => { const a = S.randInt(10000, 25000); const b = S.randInt(5000, 15000); return [`Perusahaan A menghasilkan ${a.toLocaleString()} unit. Perusahaan B menghasilkan ${b.toLocaleString()} unit. Total produksi berapa?`, a + b]; },
                    () => { const a = S.randInt(25000, 50000); const b = S.randInt(10000, 25000); return [`Kota A berpenduduk ${a.toLocaleString()} jiwa. Kota B berpenduduk ${b.toLocaleString()} jiwa. Berapa total penduduk?`, a + b]; },
                    () => { const a = S.randInt(15000, 30000); const b = S.randInt(8000, 15000); return [`Perpustakaan memiliki ${a.toLocaleString()} buku. Dapat donasi ${b.toLocaleString()} buku. Berapa total buku?`, a + b]; },
                    () => { const a = S.randInt(50000, 100000); const b = S.randInt(25000, 50000); return [`${S.randName()} menabung Rp${a.toLocaleString()}. Dapat hadiah Rp${b.toLocaleString()}. Berapa total uangnya?`, a + b]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const a = S.randInt(100000, 250000); const b = S.randInt(50000, 125000); return [`Modal usaha Rp${a.toLocaleString()}. Dapat pinjaman Rp${b.toLocaleString()}. Berapa total modal?`, a + b]; },
                    () => { const a = S.randInt(500000, 1000000); const b = S.randInt(250000, 500000); return [`Anggaran proyek A Rp${a.toLocaleString()}. Proyek B Rp${b.toLocaleString()}. Total anggaran berapa?`, a + b]; },
                    () => { const a = S.randInt(150000, 350000); const b = S.randInt(75000, 175000); return [`Populasi kota ${a.toLocaleString()} jiwa. Pendatang baru ${b.toLocaleString()} jiwa. Berapa populasi total?`, a + b]; },
                    () => { const pecahan = S.randInt(1, 4) / 10; const nilai = S.randInt(1000, 5000); const tambah = Math.round(nilai * pecahan); return [`Harga barang Rp${nilai.toLocaleString()}. Naik ${pecahan * 100}%. Kenaikan harganya berapa rupiah?`, tambah]; },
                ];
                break;
        }
    }
    else if (subMode === "Bagi" || subMode === "pembagian") {
        switch(grade) {
            case 1:
                questions = [
                    () => { const b = S.randInt(2, 3); const a = b * S.randInt(2, 4); return [`Ada ${a} ${S.randSnack()} dibagi ${b} anak. Masing-masing dapat berapa?`, a / b]; },
                    () => { const b = S.randInt(2, 4); const a = b * S.randInt(1, 3); return [`${a} ${S.randFruit()} dibagi sama rata ke ${b} piring. Tiap piring berisi berapa?`, a / b]; },
                    () => { const b = 2; const a = b * S.randInt(2, 5); return [`${S.randName()} punya ${a} ${S.randToy()}. Dibagi 2 sama banyak. Masing-masing berapa?`, a / b]; },
                    () => { const b = S.randInt(2, 3); const a = b * S.randInt(2, 4); return [`Ada ${a} kelereng dibagi ke ${b} kantong sama rata. Tiap kantong berisi berapa?`, a / b]; },
                    () => { const b = 2; const a = b * S.randInt(3, 5); return [`${a} pensil dibagi rata untuk ${b} anak. Berapa pensil untuk tiap anak?`, a / b]; },
                ];
                break;
            case 2:
                questions = [
                    () => { const b = S.randInt(2, 5); const a = b * S.randInt(3, 6); return [`${a} ${S.randSnack()} dibagi ${b} anak sama rata. Tiap anak dapat berapa?`, a / b]; },
                    () => { const b = S.randInt(3, 5); const a = b * S.randInt(4, 8); return [`Ada ${a} buku disusun di ${b} rak sama banyak. Tiap rak berisi berapa buku?`, a / b]; },
                    () => { const b = S.randInt(2, 4); const a = b * S.randInt(5, 10); return [`${S.randName()} punya ${a} stiker dibagi ke ${b} teman. Masing-masing dapat berapa?`, a / b]; },
                    () => { const b = S.randInt(4, 6); const a = b * S.randInt(3, 6); return [`${a} kursi disusun menjadi ${b} baris sama banyak. Tiap baris ada berapa kursi?`, a / b]; },
                    () => { const b = S.randInt(2, 5); const a = b * S.randInt(4, 8); return [`Di toko ada ${a} apel dimasukkan ke ${b} keranjang sama rata. Tiap keranjang berisi berapa?`, a / b]; },
                ];
                break;
            case 3:
                questions = [
                    () => { const b = S.randInt(5, 10); const a = b * S.randInt(8, 15); return [`${a} siswa dibagi ${b} kelompok sama rata. Tiap kelompok ada berapa siswa?`, a / b]; },
                    () => { const b = S.randInt(4, 8); const a = b * S.randInt(10, 20); return [`Ada ${a} ${S.randSnack()} dibungkus ke ${b} kotak sama banyak. Tiap kotak berisi berapa?`, a / b]; },
                    () => { const b = S.randInt(5, 10); const a = b * S.randInt(12, 25); return [`${a} halaman buku dibaca ${b} hari sama banyak. Berapa halaman tiap hari?`, a / b]; },
                    () => { const b = S.randInt(6, 12); const a = b * S.randInt(8, 15); return [`Perpustakaan punya ${a} buku dibagi ke ${b} rak sama rata. Tiap rak berisi berapa buku?`, a / b]; },
                ];
                break;
            case 4:
                questions = [
                    () => { const b = S.randInt(10, 25); const a = b * S.randInt(15, 30); return [`${a.toLocaleString()} butir telur dikemas ke ${b} kotak sama banyak. Tiap kotak berisi berapa?`, a / b]; },
                    () => { const b = S.randInt(8, 15); const a = b * S.randInt(20, 40); return [`Pabrik memproduksi ${a} barang dalam ${b} hari. Berapa barang per hari?`, a / b]; },
                    () => { const b = S.randInt(12, 20); const a = b * S.randInt(25, 50); return [`Dana Rp${a.toLocaleString()} dibagi ${b} orang sama rata. Masing-masing dapat berapa rupiah?`, a / b]; },
                    () => { const b = S.randInt(5, 12); const a = b * S.randInt(30, 60); return [`${a} km ditempuh ${b} jam. Berapa km per jam?`, a / b]; },
                ];
                break;
            case 5:
                questions = [
                    () => { const b = S.randInt(15, 30); const a = b * S.randInt(50, 100); return [`${a.toLocaleString()} produk dibagi ke ${b} toko sama rata. Tiap toko dapat berapa produk?`, a / b]; },
                    () => { const b = S.randInt(12, 24); const a = b * S.randInt(100, 200); return [`Penjualan Rp${a.toLocaleString()} dalam ${b} bulan. Rata-rata per bulan berapa rupiah?`, a / b]; },
                    () => { const b = S.randInt(20, 40); const a = b * S.randInt(75, 150); return [`${a.toLocaleString()} siswa dibagi ${b} kelas. Tiap kelas berisi berapa siswa?`, a / b]; },
                    () => { const b = S.randInt(8, 16); const a = b * S.randInt(125, 250); return [`Jarak ${a.toLocaleString()} km ditempuh ${b} jam. Kecepatan berapa km/jam?`, a / b]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const b = S.randInt(25, 50); const a = b * S.randInt(200, 400); return [`Keuntungan Rp${a.toLocaleString()} dibagi ${b} pemegang saham. Masing-masing dapat berapa?`, a / b]; },
                    () => { const b = S.randInt(12, 24); const a = b * S.randInt(500, 1000); return [`Total produksi ${a.toLocaleString()} unit selama ${b} bulan. Rata-rata produksi per bulan berapa?`, a / b]; },
                    () => { const persen = S.randInt(10, 50); const hasil = S.randInt(100, 500); const total = Math.round((hasil * 100) / persen); return [`${persen}% dari suatu bilangan adalah ${hasil}. Berapakah bilangan itu?`, total]; },
                    () => { const b = S.randInt(4, 8); const a = b * S.randInt(75, 150); return [`Luas tanah ${a} m² dibagi ${b} kavling sama besar. Luas tiap kavling berapa m²?`, a / b]; },
                ];
                break;
        }
    }
    else if (subMode === "Kali" || subMode === "perkalian") {
        switch(grade) {
            case 1:
                questions = [
                    () => { const a = S.randInt(2, 3); const b = S.randInt(2, 4); return [`Ada ${a} piring. Tiap piring ada ${b} ${S.randSnack()}. Berapa jumlah ${S.randSnack()}?`, a * b]; },
                    () => { const a = S.randInt(2, 4); const b = S.randInt(2, 3); return [`${S.randName()} punya ${a} kotak. Tiap kotak berisi ${b} ${S.randFruit()}. Berapa total buah?`, a * b]; },
                    () => { const a = S.randInt(2, 3); const b = S.randInt(3, 5); return [`Ada ${a} baris kursi. Tiap baris ada ${b} kursi. Berapa jumlah kursi?`, a * b]; },
                    () => { const a = S.randInt(2, 4); const b = S.randInt(2, 4); return [`Di taman ada ${a} pohon. Tiap pohon ada ${b} burung. Berapa total burung?`, a * b]; },
                    () => { const a = S.randInt(2, 3); const b = S.randInt(2, 5); return [`${a} anak masing-masing membawa ${b} pensil. Berapa pensil semuanya?`, a * b]; },
                ];
                break;
            case 2:
                questions = [
                    () => { const a = S.randInt(3, 6); const b = S.randInt(3, 5); return [`Ada ${a} keranjang. Tiap keranjang berisi ${b} ${S.randFruit()}. Berapa total buah?`, a * b]; },
                    () => { const a = S.randInt(4, 7); const b = S.randInt(3, 6); return [`${S.randName()} membeli ${a} pak roti. Tiap pak berisi ${b} roti. Berapa roti semuanya?`, a * b]; },
                    () => { const a = S.randInt(3, 5); const b = S.randInt(4, 7); return [`Di kelas ada ${a} baris meja. Tiap baris ada ${b} meja. Berapa total meja?`, a * b]; },
                    () => { const a = S.randInt(4, 6); const b = S.randInt(5, 8); return [`Ada ${a} kotak pensil. Tiap kotak berisi ${b} pensil. Berapa pensil semuanya?`, a * b]; },
                    () => { const a = S.randInt(5, 8); const b = S.randInt(4, 6); return [`Di lapangan ada ${a} kelompok. Tiap kelompok ada ${b} anak. Berapa anak semuanya?`, a * b]; },
                ];
                break;
            case 3:
                questions = [
                    () => { const a = S.randInt(6, 10); const b = S.randInt(5, 9); return [`Ada ${a} dus. Tiap dus berisi ${b} ${S.randSnack()}. Berapa total ${S.randSnack()}?`, a * b]; },
                    () => { const a = S.randInt(7, 12); const b = S.randInt(6, 10); return [`${S.randName()} membeli ${a} lusin pensil. 1 lusin = ${b} buah. Berapa pensil semuanya?`, a * b]; },
                    () => { const a = S.randInt(8, 12); const b = S.randInt(7, 11); return [`Peternak punya ${a} kandang. Tiap kandang ada ${b} ayam. Berapa total ayam?`, a * b]; },
                    () => { const a = S.randInt(5, 10); const b = S.randInt(8, 12); return [`Ada ${a} kelas. Tiap kelas ada ${b} bangku. Berapa bangku semuanya?`, a * b]; },
                    () => { const a = S.randInt(6, 9); const b = S.randInt(6, 10); return [`Di toko ada ${a} rak. Tiap rak ada ${b} botol. Berapa botol semuanya?`, a * b]; },
                ];
                break;
            case 4:
                questions = [
                    () => { const a = S.randInt(12, 20); const b = S.randInt(10, 15); return [`Pabrik memproduksi ${a} kotak per hari. Tiap kotak berisi ${b} barang. Berapa barang per hari?`, a * b]; },
                    () => { const a = S.randInt(15, 25); const b = S.randInt(12, 18); return [`Ada ${a} baris kursi. Tiap baris ada ${b} kursi. Berapa kursi di stadion?`, a * b]; },
                    () => { const a = S.randInt(10, 20); const b = S.randInt(15, 25); return [`${S.randName()} membeli ${a} pak buku. Tiap pak berisi ${b} buku. Berapa buku semuanya?`, a * b]; },
                    () => { const a = S.randInt(20, 30); const b = S.randInt(8, 15); return [`Di peternakan ada ${a} kandang. Tiap kandang ada ${b} hewan. Berapa hewan semuanya?`, a * b]; },
                ];
                break;
            case 5:
                questions = [
                    () => { const a = S.randInt(25, 50); const b = S.randInt(20, 40); return [`Pabrik memproduksi ${a} unit per jam. Dalam ${b} jam, berapa unit diproduksi?`, a * b]; },
                    () => { const a = S.randInt(50, 100); const b = S.randInt(25, 50); return [`Harga 1 barang Rp${a.toLocaleString()}. Jika beli ${b} barang, berapa totalnya?`, a * b]; },
                    () => { const a = S.randInt(30, 60); const b = S.randInt(15, 30); return [`Kecepatan mobil ${a} km/jam. Jarak yang ditempuh dalam ${b} jam adalah ... km`, a * b]; },
                    () => { const a = S.randInt(40, 80); const b = S.randInt(20, 35); return [`Sekolah punya ${a} kelas. Tiap kelas ada ${b} siswa. Berapa total siswa?`, a * b]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const a = S.randInt(100, 250); const b = S.randInt(50, 100); return [`Harga 1 unit Rp${a.toLocaleString()}. Total harga ${b} unit adalah berapa rupiah?`, a * b]; },
                    () => { const a = S.randInt(75, 150); const b = S.randInt(40, 80); return [`Pekerja ${a} orang bekerja ${b} jam. Berapa total jam kerja (orang-jam)?`, a * b]; },
                    () => { const persen = S.randInt(5, 25); const nilai = S.randInt(1000, 5000); const hasil = Math.round((persen * nilai) / 100); return [`Berapa ${persen}% dari Rp${nilai.toLocaleString()}?`, hasil]; },
                    () => { const a = S.randInt(50, 100); const b = S.randInt(30, 60); return [`Luas tanah ${a} m × ${b} m. Berapa luas totalnya dalam m²?`, a * b]; },
                    () => { const skala = S.randInt(100, 500); const peta = S.randInt(5, 20); return [`Pada peta skala 1:${skala}, jarak ${peta} cm di peta = berapa cm sebenarnya?`, skala * peta]; },
                ];
                break;
        }
    }

    return questions;
}

function generateAljabarQuestions(grade, subMode) {
    const S = StoryMode;
    let questions = [];

    if (subMode === "Isi Kotak Kosong") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const a = S.randInt(1, 5); const result = S.randInt(a + 1, a + 5); return [`${a} + □ = ${result}. Angka dalam kotak adalah ...`, result - a]; },
                    () => { const result = S.randInt(4, 10); const a = S.randInt(1, result - 1); return [`□ + ${a} = ${result}. Isi kotak kosong adalah ...`, result - a]; },
                    () => { const a = S.randInt(5, 12); const b = S.randInt(1, a - 2); return [`${a} - □ = ${b}. Berapa angka dalam kotak?`, a - b]; },
                    () => { const total = S.randInt(6, 15); const kiri = S.randInt(2, total - 2); return [`${kiri} + □ = ${total}. Nilai kotak adalah ...`, total - kiri]; },
                    () => { const a = S.randInt(8, 15); const b = S.randInt(2, 6); return [`□ - ${b} = ${a - b}. Angka dalam kotak adalah ...`, a]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const a = S.randInt(10, 30); const result = S.randInt(a + 5, a + 25); return [`${a} + □ = ${result}. Berapa angka dalam kotak?`, result - a]; },
                    () => { const b = S.randInt(3, 8); const result = S.randInt(20, 60); const a = result / b; return [`□ × ${b} = ${result}. Nilai kotak adalah ...`, a]; },
                    () => { const a = S.randInt(50, 100); const b = S.randInt(15, 40); return [`${a} - □ = ${a - b}. Angka dalam kotak adalah ...`, b]; },
                    () => { const divisor = S.randInt(3, 10); const quotient = S.randInt(5, 15); return [`□ ÷ ${divisor} = ${quotient}. Berapa angka dalam kotak?`, divisor * quotient]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const a = S.randInt(5, 15); const b = S.randInt(2, 8); const result = a * b + S.randInt(5, 20); return [`${a} × □ + ${result - a * b} = ${result}. Nilai kotak adalah ...`, b]; },
                    () => { const x = S.randInt(2, 10); const a = S.randInt(2, 5); const b = S.randInt(5, 20); return [`${a} × □ = ${a * x}. Berapa nilai kotak?`, x]; },
                    () => { const result = S.randInt(100, 300); const a = S.randInt(20, 50); return [`□ + ${a} = ${result}. Angka dalam kotak adalah ...`, result - a]; },
                ];
                break;
        }
    }
    else if (subMode === "Nilai Variabel") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const x = S.randInt(2, 8); const b = S.randInt(1, 5); return [`Jika n = ${x}, maka n + ${b} = ...`, x + b]; },
                    () => { const x = S.randInt(5, 12); const b = S.randInt(1, x - 2); return [`Jika x = ${x}, maka x - ${b} = ...`, x - b]; },
                    () => { const x = S.randInt(2, 6); const b = S.randInt(2, 4); return [`Jika y = ${x}, maka y × ${b} = ...`, x * b]; },
                    () => { const x = S.randInt(2, 5); const a = S.randInt(3, 6); const b = S.randInt(1, 4); return [`Jika m = ${x}, maka ${a} + m + ${b} = ...`, a + x + b]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const x = S.randInt(5, 15); const a = S.randInt(2, 5); const b = S.randInt(3, 10); return [`Jika x = ${x}, maka ${a}x + ${b} = ...`, a * x + b]; },
                    () => { const x = S.randInt(3, 10); const a = S.randInt(2, 6); const b = S.randInt(1, 5); return [`Jika n = ${x}, maka ${a}n - ${b} = ...`, a * x - b]; },
                    () => { const x = S.randInt(4, 12); const y = S.randInt(2, 8); return [`Jika x = ${x} dan y = ${y}, maka x + y = ...`, x + y]; },
                    () => { const x = S.randInt(2, 6); const a = S.randInt(3, 8); return [`Jika p = ${x}, maka ${a} × p = ...`, a * x]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const x = S.randInt(5, 15); const a = S.randInt(2, 6); const b = S.randInt(5, 15); const c = S.randInt(2, 8); return [`Jika x = ${x}, maka ${a}x + ${b} - ${c} = ...`, a * x + b - c]; },
                    () => { const x = S.randInt(3, 8); const y = S.randInt(2, 6); const a = S.randInt(2, 4); const b = S.randInt(2, 5); return [`Jika x = ${x} dan y = ${y}, maka ${a}x + ${b}y = ...`, a * x + b * y]; },
                    () => { const x = S.randInt(4, 10); const a = S.randInt(2, 5); return [`Jika m = ${x}, maka m² - ${a} = ...`, x * x - a]; },
                ];
                break;
        }
    }
    else if (subMode === "Persamaan Sederhana") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const a = S.randInt(2, 6); const b = S.randInt(a + 1, a + 8); return [`x + ${a} = ${b}. Nilai x = ...`, b - a]; },
                    () => { const x = S.randInt(3, 10); const a = S.randInt(1, x - 1); return [`x - ${a} = ${x - a}. Nilai x = ...`, x]; },
                    () => { const b = S.randInt(2, 5); const result = S.randInt(6, 15); return [`${result - b} + n = ${result}. Nilai n = ...`, b]; },
                    () => { const a = S.randInt(3, 8); const b = S.randInt(5, 15); return [`${a} + y = ${a + b}. Nilai y = ...`, b]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const x = S.randInt(3, 12); const a = S.randInt(2, 5); const result = a * x; return [`${a}x = ${result}. Nilai x = ...`, x]; },
                    () => { const x = S.randInt(4, 10); const a = S.randInt(2, 4); const b = S.randInt(5, 15); return [`${a}x + ${b} = ${a * x + b}. Nilai x = ...`, x]; },
                    () => { const x = S.randInt(5, 15); const a = S.randInt(2, 5); const b = S.randInt(3, 10); return [`${a}x - ${b} = ${a * x - b}. Nilai x = ...`, x]; },
                    () => { const x = S.randInt(6, 18); const divisor = S.randInt(2, 6); const quotient = x / divisor; if (Number.isInteger(quotient)) return [`x ÷ ${divisor} = ${quotient}. Nilai x = ...`, x]; return [`2x = ${2 * S.randInt(3, 10)}. Nilai x = ...`, S.randInt(3, 10)]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const x = S.randInt(2, 10); const a = S.randInt(2, 6); const b = S.randInt(3, 12); return [`${a}x + ${b} = ${a * x + b}. Nilai x = ...`, x]; },
                    () => { const x = S.randInt(3, 8); const a = S.randInt(3, 6); const b = S.randInt(2, 5); const c = S.randInt(5, 15); return [`${a}x - ${b} = ${a * x - b}. Nilai x = ...`, x]; },
                    () => { const x = S.randInt(4, 12); const a = S.randInt(2, 4); const b = S.randInt(10, 30); return [`${a}x = ${a * x}. Nilai x = ...`, x]; },
                    () => { const x = S.randInt(5, 15); const a = S.randInt(2, 5); return [`x/${a} = ${x / a}. Nilai x = ... (jika habis dibagi)`, x]; },
                ];
                break;
        }
    }
    else if (subMode === "Pola Bilangan") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const start = S.randInt(1, 5); const step = S.randInt(1, 3); return [`Pola: ${start}, ${start + step}, ${start + 2 * step}, ${start + 3 * step}, ... Bilangan selanjutnya adalah ...`, start + 4 * step]; },
                    () => { const start = S.randInt(2, 6); const step = S.randInt(2, 4); return [`Pola: ${start}, ${start + step}, ${start + 2 * step}, ... Bilangan ke-4 adalah ...`, start + 3 * step]; },
                    () => { const start = S.randInt(1, 3); const step = 2; return [`Pola bilangan ganjil: ${start}, ${start + step}, ${start + 2 * step}, ... Bilangan selanjutnya adalah ...`, start + 3 * step]; },
                    () => { const start = 2; const step = 2; return [`Pola bilangan genap: 2, 4, 6, 8, ... Bilangan selanjutnya adalah ...`, 10]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const start = S.randInt(1, 5); const step = S.randInt(3, 6); return [`Pola: ${start}, ${start + step}, ${start + 2 * step}, ... Suku ke-5 adalah ...`, start + 4 * step]; },
                    () => { const a = S.randInt(2, 5); return [`Pola: ${a}, ${a * 2}, ${a * 4}, ${a * 8}, ... Bilangan selanjutnya adalah ...`, a * 16]; },
                    () => { const start = S.randInt(5, 10); const step = S.randInt(4, 8); return [`Pola: ${start}, ${start + step}, ${start + 2 * step}, ... Suku ke-6 adalah ...`, start + 5 * step]; },
                    () => { const base = S.randInt(2, 4); return [`Pola: 1, ${base}, ${base * base}, ${base * base * base}, ... Bilangan selanjutnya adalah ...`, base * base * base * base]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const n = S.randInt(5, 10); const a = S.randInt(2, 5); const b = S.randInt(1, 8); return [`Rumus suku ke-n: Un = ${a}n + ${b}. Suku ke-${n} = ...`, a * n + b]; },
                    () => { const n = S.randInt(4, 8); const a = S.randInt(2, 4); const b = S.randInt(1, 5); return [`Rumus suku ke-n: Un = ${a}n - ${b}. Suku ke-${n} = ...`, a * n - b]; },
                    () => { const start = S.randInt(3, 8); const step = S.randInt(5, 10); return [`Barisan aritmetika: ${start}, ${start + step}, ${start + 2 * step}, ... Suku ke-7 = ...`, start + 6 * step]; },
                    () => { const a = 2; const n = S.randInt(4, 6); return [`Barisan geometri: 2, 4, 8, 16, ... Suku ke-${n} = ...`, Math.pow(a, n)]; },
                ];
                break;
        }
    }

    return questions;
}

function generateTimeQuestions(grade, subMode) {
    const S = StoryMode;
    let questions = [];

    if (subMode === "Baca Jam") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const jam = S.randInt(7, 12); return [`Jarum pendek di angka ${jam}, jarum panjang di angka 12. Jam berapa?`, jam]; },
                    () => { const jam = S.randInt(1, 12); return [`Jam menunjukkan pukul ${jam}.00. Dalam 1 jam akan menunjukkan pukul berapa?`, jam === 12 ? 1 : jam + 1]; },
                    () => { const jam = S.randInt(8, 11); return [`${S.randName()} bangun pukul ${jam}.00. Sekarang sudah 2 jam kemudian. Jam berapa sekarang?`, jam + 2]; },
                    () => { const jam24 = S.randInt(13, 18); return [`Pukul ${jam24}.00 sama dengan pukul berapa siang/sore?`, jam24 - 12]; },
                    () => { const jam = S.randInt(1, 6); return [`Jam berapa 12 jam setelah pukul ${jam}.00 pagi?`, jam]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const jam = S.randInt(7, 10); const menit = S.randInt(1, 4) * 15; return [`Jarum pendek di ${jam} dan jarum panjang di ${menit / 5}. Jam berapa menit?`, menit]; },
                    () => { const jam = S.randInt(14, 20); return [`Pukul ${jam}.30 dalam format 12 jam adalah pukul berapa?`, jam - 12]; },
                    () => { const jam = S.randInt(1, 11); return [`Berapa menit dari pukul ${jam}.00 sampai pukul ${jam + 1}.00?`, 60]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const jam = S.randInt(8, 15); const menit = S.randInt(10, 50); return [`Pukul ${jam}.${menit.toString().padStart(2, '0')} ditambah 45 menit. Menitnya jadi berapa? (hanya menit)`, (menit + 45) % 60]; },
                    () => { return [`Pukul 23.30 + 2 jam 45 menit = pukul berapa? (jawab jamnya saja)`, 2]; },
                ];
                break;
        }
    }
    else if (subMode === "Tambah & Kurang Waktu") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const jam = S.randInt(7, 10); const tambah = S.randInt(1, 3); return [`${S.randName()} mulai belajar jam ${jam}. Belajar ${tambah} jam. Selesai jam berapa?`, jam + tambah]; },
                    () => { const jam = S.randInt(10, 14); const kurang = S.randInt(1, 3); return [`Sekarang jam ${jam}. ${kurang} jam yang lalu jam berapa?`, jam - kurang]; },
                    () => { const jam = S.randInt(8, 11); const tambah = S.randInt(2, 4); return [`Film mulai jam ${jam}. Durasi ${tambah} jam. Film selesai jam berapa?`, jam + tambah]; },
                    () => { const jam = S.randInt(6, 9); const tambah = S.randInt(1, 3); return [`${S.randName()} bangun jam ${jam}. ${tambah} jam kemudian berangkat sekolah. Berangkat jam berapa?`, jam + tambah]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const jam = S.randInt(8, 12); const menit = 30; const tambahJam = S.randInt(1, 2); return [`Pukul ${jam}.${menit} + ${tambahJam} jam = pukul berapa?`, jam + tambahJam]; },
                    () => { const jam = S.randInt(10, 15); const kurangJam = S.randInt(2, 4); return [`Pukul ${jam}.00 - ${kurangJam} jam = pukul berapa?`, jam - kurangJam]; },
                    () => { const menit = S.randInt(20, 50); const tambah = S.randInt(15, 40); return [`${menit} menit + ${tambah} menit = ... menit`, menit + tambah]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const jam1 = S.randInt(1, 3); const menit1 = S.randInt(15, 45); const jam2 = S.randInt(1, 2); const menit2 = S.randInt(10, 30); return [`${jam1} jam ${menit1} menit + ${jam2} jam ${menit2} menit = ... menit total`, jam1 * 60 + menit1 + jam2 * 60 + menit2]; },
                    () => { const jam = S.randInt(2, 5); const menit = S.randInt(20, 50); const kurang = S.randInt(30, 90); return [`${jam} jam ${menit} menit - ${kurang} menit = berapa menit sisanya?`, jam * 60 + menit - kurang]; },
                ];
                break;
        }
    }
    else if (subMode === "Konversi Waktu") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const jam = S.randInt(1, 3); return [`${jam} jam = ... menit`, jam * 60]; },
                    () => { const menit = S.randInt(1, 2) * 60; return [`${menit} menit = ... jam`, menit / 60]; },
                    () => { return [`1 hari = ... jam`, 24]; },
                    () => { return [`1 minggu = ... hari`, 7]; },
                    () => { const jam = S.randInt(2, 4); return [`${jam} jam ada berapa menit?`, jam * 60]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const jam = S.randInt(2, 5); const menit = S.randInt(10, 50); return [`${jam} jam ${menit} menit = ... menit`, jam * 60 + menit]; },
                    () => { const menit = S.randInt(90, 180); const jam = Math.floor(menit / 60); return [`${menit} menit = berapa jam? (bulatkan ke bawah)`, jam]; },
                    () => { const hari = S.randInt(2, 7); return [`${hari} hari = ... jam`, hari * 24]; },
                    () => { const minggu = S.randInt(2, 4); return [`${minggu} minggu = ... hari`, minggu * 7]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const dasawarsa = S.randInt(1, 3); return [`${dasawarsa} dasawarsa = ... tahun`, dasawarsa * 10]; },
                    () => { const abad = S.randInt(1, 2); return [`${abad} abad = ... tahun`, abad * 100]; },
                    () => { const tahun = S.randInt(20, 50); return [`${tahun} tahun = ... windu (1 windu = 8 tahun)`, Math.floor(tahun / 8)]; },
                    () => { const jam = S.randInt(48, 120); return [`${jam} jam = ... hari`, Math.floor(jam / 24)]; },
                ];
                break;
        }
    }
    else if (subMode === "Selisih Waktu") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const jam1 = S.randInt(7, 10); const jam2 = jam1 + S.randInt(1, 3); return [`Dari jam ${jam1} sampai jam ${jam2} = ... jam`, jam2 - jam1]; },
                    () => { const nama = S.randName(); const mulai = S.randInt(8, 11); const selesai = mulai + S.randInt(1, 3); return [`${nama} bermain dari jam ${mulai} sampai jam ${selesai}. Berapa lama bermain?`, selesai - mulai]; },
                    () => { const mulai = S.randInt(7, 9); const selesai = S.randInt(11, 13); return [`Sekolah mulai jam ${mulai} dan pulang jam ${selesai}. Berapa jam di sekolah?`, selesai - mulai]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const jam1 = S.randInt(8, 12); const menit1 = 0; const jam2 = jam1 + S.randInt(2, 4); const menit2 = 30; return [`Dari pukul ${jam1}.00 sampai ${jam2}.30, berapa menit?`, (jam2 - jam1) * 60 + menit2]; },
                    () => { const durasi = S.randInt(90, 150); return [`Film berdurasi ${durasi} menit. Berapa jam lebihnya? (sisanya dalam menit)`, durasi % 60]; },
                    () => { const berangkat = S.randInt(6, 8); const sampai = S.randInt(9, 12); return [`Berangkat jam ${berangkat}.00, sampai jam ${sampai}.00. Lama perjalanan ... jam`, sampai - berangkat]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const jam1 = S.randInt(8, 12); const menit1 = S.randInt(0, 3) * 15; const jam2 = jam1 + S.randInt(2, 5); const menit2 = S.randInt(0, 3) * 15; const total = (jam2 * 60 + menit2) - (jam1 * 60 + menit1); return [`Dari ${jam1}.${menit1.toString().padStart(2, '0')} sampai ${jam2}.${menit2.toString().padStart(2, '0')} = ... menit`, total]; },
                    () => { const tahun1 = S.randInt(2010, 2015); const tahun2 = 2024; return [`Dari tahun ${tahun1} sampai ${tahun2} = ... tahun`, tahun2 - tahun1]; },
                ];
                break;
        }
    }

    return questions;
}

function generateHeavyQuestions(grade, subMode) {
    const S = StoryMode;
    let questions = [];

    if (subMode === "Konversi Berat") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const kg = S.randInt(1, 5); return [`${kg} kg = ... ons (1 kg = 10 ons)`, kg * 10]; },
                    () => { const ons = S.randInt(1, 5) * 10; return [`${ons} ons = ... kg`, ons / 10]; },
                    () => { const kg = S.randInt(1, 3); return [`${kg} kg = ... gram (1 kg = 1000 gram)`, kg * 1000]; },
                    () => { const gram = S.randInt(1, 5) * 1000; return [`${gram} gram = ... kg`, gram / 1000]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const kg = S.randInt(1, 10); const gram = S.randInt(100, 900); return [`${kg} kg ${gram} gram = ... gram`, kg * 1000 + gram]; },
                    () => { const kuintal = S.randInt(1, 5); return [`${kuintal} kuintal = ... kg (1 kuintal = 100 kg)`, kuintal * 100]; },
                    () => { const kg = S.randInt(100, 500); return [`${kg} kg = ... kuintal`, kg / 100]; },
                    () => { const ons = S.randInt(10, 50); return [`${ons} ons = ... gram`, ons * 100]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const ton = S.randInt(1, 5); const kg = S.randInt(100, 900); return [`${ton} ton ${kg} kg = ... kg`, ton * 1000 + kg]; },
                    () => { const kg = S.randInt(2000, 8000); return [`${kg.toLocaleString()} kg = ... ton`, kg / 1000]; },
                    () => { const ton = S.randInt(1, 3); const kuintal = S.randInt(1, 9); return [`${ton} ton ${kuintal} kuintal = ... kg`, ton * 1000 + kuintal * 100]; },
                ];
                break;
        }
    }
    else if (subMode === "Tambah & Kurang Berat") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const a = S.randInt(2, 8); const b = S.randInt(1, 5); return [`${S.randName()} membeli ${a} kg ${S.randFruit()}. Lalu membeli ${b} kg lagi. Total berapa kg?`, a + b]; },
                    () => { const total = S.randInt(5, 12); const diambil = S.randInt(2, total - 2); return [`Ada ${total} kg beras. Diambil ${diambil} kg. Sisa berapa kg?`, total - diambil]; },
                    () => { const a = S.randInt(3, 8); const b = S.randInt(2, 5); return [`Berat tas ${a} kg. Ditambah buku ${b} kg. Total berat tas berapa kg?`, a + b]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const a = S.randInt(10, 30); const b = S.randInt(5, 15); return [`Berat karung A ${a} kg, karung B ${b} kg. Total berat berapa kg?`, a + b]; },
                    () => { const total = S.randInt(50, 100); const dijual = S.randInt(20, 40); return [`Petani punya ${total} kg beras. Dijual ${dijual} kg. Sisa berapa kg?`, total - dijual]; },
                    () => { const a = S.randInt(25, 50); const b = S.randInt(15, 30); return [`Truk mengangkut ${a} kg sayur dan ${b} kg buah. Total muatan berapa kg?`, a + b]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const ton = S.randInt(2, 5); const tambah = S.randInt(500, 1500); return [`Muatan truk ${ton} ton. Ditambah ${tambah} kg. Total berat dalam kg = ...`, ton * 1000 + tambah]; },
                    () => { const awal = S.randInt(3000, 5000); const kurang = S.randInt(500, 1500); return [`Stok gudang ${awal.toLocaleString()} kg. Dijual ${kurang.toLocaleString()} kg. Sisa berapa kg?`, awal - kurang]; },
                ];
                break;
        }
    }
    else if (subMode === "Bandingkan Berat") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const a = S.randInt(3, 8); const b = S.randInt(2, 7); const max = Math.max(a, b); return [`Apel ${a} kg dan jeruk ${b} kg. Mana yang lebih berat? (jawab beratnya)`, max]; },
                    () => { const a = S.randInt(2, 6); const b = S.randInt(3, 8); const min = Math.min(a, b); return [`Tas A ${a} kg, tas B ${b} kg. Mana yang lebih ringan? (jawab beratnya)`, min]; },
                    () => { const kg = S.randInt(2, 5); const ons = kg * 10 + S.randInt(1, 5); return [`${kg} kg dan ${ons} ons. Mana lebih berat? Jawab dalam kg yang lebih berat.`, ons > kg * 10 ? Math.ceil(ons / 10) : kg]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const a = S.randInt(10, 30); const b = S.randInt(15, 35); const max = Math.max(a, b); return [`Karung A ${a} kg, karung B ${b} kg. Lebih berat mana? (jawab kg-nya)`, max]; },
                    () => { const kg = S.randInt(3, 8); const gram = S.randInt(2500, 4500); const kgGram = gram / 1000; return [`${kg} kg dan ${gram.toLocaleString()} gram. Mana lebih berat? (dalam kg)`, kg > kgGram ? kg : Math.round(kgGram)]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const ton = S.randInt(2, 5); const kuintal = S.randInt(15, 40); const tonKg = ton * 1000; const kuintalKg = kuintal * 100; return [`${ton} ton vs ${kuintal} kuintal. Lebih berat mana? (dalam kg)`, Math.max(tonKg, kuintalKg)]; },
                    () => { const a = S.randInt(1500, 3000); const b = S.randInt(1800, 3500); return [`${a.toLocaleString()} kg vs ${b.toLocaleString()} kg. Selisihnya berapa kg?`, Math.abs(a - b)]; },
                ];
                break;
        }
    }
    else if (subMode === "Selisih Berat") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const a = S.randInt(5, 10); const b = S.randInt(2, a - 1); return [`Berat benda A ${a} kg dan B ${b} kg. Selisihnya berapa kg?`, a - b]; },
                    () => { const a = S.randInt(4, 9); const b = S.randInt(2, 6); const diff = Math.abs(a - b); return [`Tas ${a} kg dan ransel ${b} kg. Selisih beratnya ... kg`, diff]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const a = S.randInt(25, 50); const b = S.randInt(15, 35); return [`Karung beras ${a} kg dan gula ${b} kg. Selisih beratnya ... kg`, Math.abs(a - b)]; },
                    () => { const a = S.randInt(100, 200); const b = S.randInt(80, 150); return [`Kambing ${a} kg dan domba ${b} kg. Selisih beratnya ... kg`, Math.abs(a - b)]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const a = S.randInt(2000, 4000); const b = S.randInt(1500, 3000); return [`Truk A ${a.toLocaleString()} kg, truk B ${b.toLocaleString()} kg. Selisihnya ... kg`, Math.abs(a - b)]; },
                    () => { const ton1 = S.randInt(2, 5); const ton2 = S.randInt(3, 6); return [`${ton1} ton vs ${ton2} ton. Selisih dalam kg = ...`, Math.abs(ton1 - ton2) * 1000]; },
                ];
                break;
        }
    }

    return questions;
}

function generateVolumeQuestions(grade, subMode) {
    const S = StoryMode;
    let questions = [];

    if (subMode === "Volume") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const liter = S.randInt(1, 5); return [`${liter} liter = ... mililiter (1 liter = 1000 ml)`, liter * 1000]; },
                    () => { const ml = S.randInt(1, 3) * 1000; return [`${ml.toLocaleString()} mililiter = ... liter`, ml / 1000]; },
                    () => { const botol = S.randInt(2, 6); return [`Ada ${botol} botol air, tiap botol 1 liter. Total berapa liter?`, botol]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const sisi = S.randInt(3, 7); return [`Kubus sisi ${sisi} cm. Volume = sisi³ = ... cm³`, sisi * sisi * sisi]; },
                    () => { const p = S.randInt(4, 8); const l = S.randInt(3, 6); const t = S.randInt(2, 5); return [`Balok ${p}×${l}×${t} cm. Volume = p×l×t = ... cm³`, p * l * t]; },
                    () => { const liter = S.randInt(2, 8); const ml = S.randInt(100, 500); return [`${liter} liter ${ml} ml = ... ml`, liter * 1000 + ml]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const sisi = S.randInt(5, 12); return [`Volume kubus sisi ${sisi} cm = ... cm³`, sisi * sisi * sisi]; },
                    () => { const r = S.randInt(3, 7); const t = S.randInt(5, 12); return [`Volume tabung r=${r} cm, t=${t} cm ≈ π×r²×t = ... cm³ (π=3.14, bulatkan)`, Math.round(3.14 * r * r * t)]; },
                    () => { const dm3 = S.randInt(1, 10); return [`${dm3} dm³ = ... liter (1 dm³ = 1 liter)`, dm3]; },
                ];
                break;
        }
    }
    else if (subMode === "Tambah Volume" || subMode === "Tambah & Kurang Volume") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const a = S.randInt(2, 6); const b = S.randInt(1, 4); return [`Di ember ada ${a} liter air. Ditambah ${b} liter. Jadi berapa liter?`, a + b]; },
                    () => { const total = S.randInt(5, 10); const diminum = S.randInt(1, total - 2); return [`Ada ${total} liter jus. Diminum ${diminum} liter. Sisa berapa liter?`, total - diminum]; },
                    () => { const gelas = S.randInt(3, 6); return [`Ada ${gelas} gelas air, tiap gelas 1 liter. Total berapa liter?`, gelas]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const a = S.randInt(10, 25); const b = S.randInt(5, 15); return [`Bak berisi ${a} liter air. Ditambah ${b} liter. Total ... liter`, a + b]; },
                    () => { const total = S.randInt(30, 60); const dipakai = S.randInt(10, 25); return [`Tangki berisi ${total} liter. Digunakan ${dipakai} liter. Sisa ... liter`, total - dipakai]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const a = S.randInt(50, 100); const b = S.randInt(25, 50); return [`Kolam berisi ${a} liter air. Ditambah ${b} liter. Total ... liter`, a + b]; },
                    () => { const total = S.randInt(200, 500); const dipakai = S.randInt(50, 150); return [`Tandon berisi ${total} liter. Dikurangi ${dipakai} liter. Sisa ... liter`, total - dipakai]; },
                ];
                break;
        }
    }
    else if (subMode === "Selisih Volume") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const a = S.randInt(5, 10); const b = S.randInt(2, a - 1); return [`Ember A berisi ${a} liter, ember B berisi ${b} liter. Selisihnya ... liter`, a - b]; },
                    () => { const a = S.randInt(4, 8); const b = S.randInt(2, 6); return [`Galon A ${a} liter, galon B ${b} liter. Selisih isinya ... liter`, Math.abs(a - b)]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const a = S.randInt(20, 40); const b = S.randInt(10, 30); return [`Bak A ${a} liter, bak B ${b} liter. Selisihnya ... liter`, Math.abs(a - b)]; },
                    () => { const a = S.randInt(50, 100); const b = S.randInt(30, 70); return [`Tangki A ${a} liter, tangki B ${b} liter. Selisih volume ... liter`, Math.abs(a - b)]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const a = S.randInt(100, 300); const b = S.randInt(80, 250); return [`Kolam A ${a} liter, kolam B ${b} liter. Selisih ... liter`, Math.abs(a - b)]; },
                    () => { const m3 = S.randInt(2, 8); const liter = S.randInt(500, 1500); return [`${m3} m³ vs ${liter.toLocaleString()} liter. 1 m³ = 1000 liter. Selisih dalam liter = ...`, Math.abs(m3 * 1000 - liter)]; },
                ];
                break;
        }
    }
    else if (subMode === "Perkiraan Volume" || subMode === "Bandingkan Volume") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { return [`Setengah dari 1 liter = ... mililiter`, 500]; },
                    () => { return [`Seperempat dari 1 liter = ... mililiter`, 250]; },
                    () => { const liter = S.randInt(2, 6); return [`Separuh dari ${liter} liter = ... liter`, liter / 2]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const liter = S.randInt(8, 20); return [`${liter} liter diisi setengahnya. Isinya ... liter`, liter / 2]; },
                    () => { const total = S.randInt(12, 24); return [`1/4 dari ${total} liter = ... liter`, total / 4]; },
                    () => { const liter = S.randInt(10, 30); return [`3/4 dari ${liter} liter = ... liter`, (3 * liter) / 4]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const persen = S.randInt(20, 50); const total = S.randInt(100, 500); return [`${persen}% dari ${total} liter = ... liter`, (persen * total) / 100]; },
                    () => { const total = S.randInt(200, 600); return [`2/5 dari ${total} liter = ... liter`, (2 * total) / 5]; },
                ];
                break;
        }
    }

    return questions;
}

function generateUpQuestions(grade, subMode) {
    const S = StoryMode;
    let questions = [];

    if (subMode === "Keliling Bangun Datar") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const sisi = S.randInt(2, 8); return [`Persegi sisi ${sisi} cm. Keliling = 4 × sisi = ... cm`, sisi * 4]; },
                    () => { const p = S.randInt(4, 10); const l = S.randInt(2, 6); return [`Persegi panjang p=${p} cm, l=${l} cm. Keliling = 2(p+l) = ... cm`, 2 * (p + l)]; },
                    () => { const sisi = S.randInt(3, 7); return [`Segitiga sama sisi dengan sisi ${sisi} cm. Keliling = 3 × sisi = ... cm`, sisi * 3]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const sisi = S.randInt(5, 15); return [`Persegi sisi ${sisi} cm. Keliling = ... cm`, sisi * 4]; },
                    () => { const p = S.randInt(8, 20); const l = S.randInt(5, 12); return [`Persegi panjang ${p} × ${l} cm. Keliling = ... cm`, 2 * (p + l)]; },
                    () => { const a = S.randInt(5, 12); const b = S.randInt(6, 15); const c = S.randInt(4, 10); return [`Segitiga sisi ${a}, ${b}, ${c} cm. Keliling = ... cm`, a + b + c]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const r = S.randInt(5, 14); return [`Lingkaran r=${r} cm. Keliling = 2πr = ... cm (π=3.14, bulatkan)`, Math.round(2 * 3.14 * r)]; },
                    () => { const d = S.randInt(10, 20); return [`Lingkaran diameter ${d} cm. Keliling = πd = ... cm (π=3.14, bulatkan)`, Math.round(3.14 * d)]; },
                    () => { const sisi = S.randInt(8, 18); return [`Segi enam beraturan sisi ${sisi} cm. Keliling = 6 × sisi = ... cm`, sisi * 6]; },
                ];
                break;
        }
    }
    else if (subMode === "Volume Bangun Ruang") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const sisi = S.randInt(2, 5); return [`Kubus sisi ${sisi} cm. Volume = sisi³ = ... cm³`, sisi * sisi * sisi]; },
                    () => { const p = S.randInt(3, 6); const l = S.randInt(2, 4); const t = S.randInt(2, 4); return [`Balok ${p}×${l}×${t} cm. Volume = ... cm³`, p * l * t]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const sisi = S.randInt(4, 10); return [`Kubus sisi ${sisi} cm. Volume = ... cm³`, sisi * sisi * sisi]; },
                    () => { const p = S.randInt(5, 12); const l = S.randInt(4, 8); const t = S.randInt(3, 7); return [`Balok ${p}×${l}×${t} cm. Volume = ... cm³`, p * l * t]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const r = S.randInt(3, 8); const t = S.randInt(5, 12); return [`Tabung r=${r} cm, t=${t} cm. Volume = πr²t = ... cm³ (π=3.14, bulatkan)`, Math.round(3.14 * r * r * t)]; },
                    () => { const sisi = S.randInt(4, 10); const t = S.randInt(6, 15); return [`Limas segi empat alas ${sisi}×${sisi} cm, t=${t} cm. Volume = 1/3 × alas × t = ... cm³`, Math.round((sisi * sisi * t) / 3)]; },
                ];
                break;
        }
    }
    else if (subMode === "Luas Permukaan Bangun Ruang") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const sisi = S.randInt(2, 5); return [`Kubus sisi ${sisi} cm. Luas permukaan = 6×sisi² = ... cm²`, 6 * sisi * sisi]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const sisi = S.randInt(4, 10); return [`Kubus sisi ${sisi} cm. LP = 6s² = ... cm²`, 6 * sisi * sisi]; },
                    () => { const p = S.randInt(5, 10); const l = S.randInt(3, 7); const t = S.randInt(2, 6); return [`Balok ${p}×${l}×${t} cm. LP = 2(pl+pt+lt) = ... cm²`, 2 * (p * l + p * t + l * t)]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const sisi = S.randInt(5, 12); return [`Kubus sisi ${sisi} cm. LP = 6s² = ... cm²`, 6 * sisi * sisi]; },
                    () => { const p = S.randInt(6, 15); const l = S.randInt(4, 10); const t = S.randInt(3, 8); return [`Balok ${p}×${l}×${t} cm. LP = 2(pl+pt+lt) = ... cm²`, 2 * (p * l + p * t + l * t)]; },
                    () => { const r = S.randInt(4, 10); const t = S.randInt(8, 15); return [`Tabung r=${r}, t=${t} cm. LP = 2πr(r+t) = ... cm² (π=3.14, bulatkan)`, Math.round(2 * 3.14 * r * (r + t))]; },
                ];
                break;
        }
    }
    else if (subMode === "Perbandingan Bangun") {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const luas1 = S.randInt(10, 30); const kali = S.randInt(2, 3); return [`Luas A = ${luas1} cm², luas B = ${luas1 * kali} cm². B berapa kali A?`, kali]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const luas1 = S.randInt(20, 60); const luas2 = luas1 * 2; return [`Luas A ${luas1} cm², B ${luas2} cm². B berapa kali lebih besar?`, 2]; },
                    () => { const keliling1 = S.randInt(16, 40); const keliling2 = keliling1 * 3; return [`Keliling A ${keliling1} cm, B ${keliling2} cm. B berapa kali A?`, 3]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const sisi1 = S.randInt(3, 6); const sisi2 = sisi1 * 2; return [`Kubus A sisi ${sisi1} cm, B sisi ${sisi2} cm. Volume B berapa kali A?`, 8]; },
                    () => { const r1 = S.randInt(2, 5); const r2 = r1 * 2; return [`Lingkaran A r=${r1} cm, B r=${r2} cm. Luas B berapa kali A?`, 4]; },
                ];
                break;
        }
    }
    else {
        switch(grade) {
            case 1: case 2: case 3:
                questions = [
                    () => { const sisi = S.randInt(2, 6); return [`Persegi sisi ${sisi} cm. Keliling = ... cm`, sisi * 4]; },
                    () => { const p = S.randInt(4, 8); const l = S.randInt(2, 5); return [`Persegi panjang ${p}×${l} cm. Luas = ... cm²`, p * l]; },
                ];
                break;
            case 4: case 5:
                questions = [
                    () => { const sisi = S.randInt(4, 10); return [`Luas persegi sisi ${sisi} cm = ... cm²`, sisi * sisi]; },
                    () => { const alas = S.randInt(5, 12); const tinggi = S.randInt(4, 10); return [`Luas segitiga alas ${alas} cm, tinggi ${tinggi} cm = ... cm²`, (alas * tinggi) / 2]; },
                ];
                break;
            case 6:
                questions = [
                    () => { const r = S.randInt(4, 12); return [`Luas lingkaran r=${r} cm = πr² = ... cm² (π=3.14, bulatkan)`, Math.round(3.14 * r * r)]; },
                    () => { const alas = S.randInt(6, 15); const tinggi = S.randInt(5, 12); return [`Luas jajargenjang alas ${alas} cm, tinggi ${tinggi} cm = ... cm²`, alas * tinggi]; },
                ];
                break;
        }
    }

    return questions;
}

function getStoryQuestionsByModeAndSubMode(gameMode, subMode, difficulty) {
    const grade = getRandomGrade(difficulty);
    let questions = [];

    switch(gameMode) {
        case "operator":
            questions = generateOperatorQuestions(grade, subMode);
            break;
        case "aljabar":
            questions = generateAljabarQuestions(grade, subMode);
            break;
        case "time":
            questions = generateTimeQuestions(grade, subMode);
            break;
        case "heavy":
            questions = generateHeavyQuestions(grade, subMode);
            break;
        case "volume":
            questions = generateVolumeQuestions(grade, subMode);
            break;
        case "up":
            questions = generateUpQuestions(grade, subMode);
            break;
        default:
            questions = generateOperatorQuestions(grade, "Tambah");
    }

    return questions;
}

function getStoryQuestion(gameMode, difficulty, questionType) {
    const questions = getStoryQuestionsByModeAndSubMode(gameMode, questionType, difficulty);
    
    if (questions && questions.length > 0) {
        const questionGenerator = questions[Math.floor(Math.random() * questions.length)];
        try {
            return questionGenerator();
        } catch (e) {
            console.warn("Error generating question:", e);
            return null;
        }
    }
    
    return null;
}

function getStoryQuestionArray(gameMode, difficulty, questionType, qno) {
    let questionArray = [];
    let attempts = 0;
    const maxAttempts = qno * 20;
    
    console.log(`📚 Generating ${qno} questions for mode: ${gameMode}, subMode: ${questionType}, difficulty: ${difficulty}`);
    
    while (questionArray.length < qno && attempts < maxAttempts) {
        attempts++;
        const questionData = getStoryQuestion(gameMode, difficulty, questionType);
        
        if (questionData && questionData[0] && questionData[1] !== undefined) {
            const isDuplicate = questionArray.some(q => q[0] === questionData[0]);
            
            if (!isDuplicate) {
                questionArray.push(questionData);
            }
        }
    }
    
    if (questionArray.length < qno) {
        console.warn(`⚠️ Only generated ${questionArray.length}/${qno} unique questions for ${gameMode} - ${questionType}`);
    } else {
        console.log(`✅ Successfully generated ${questionArray.length} questions`);
    }
    
    return questionArray;
}

function getRandomStoryByMode(gameMode) {
    const difficulty = typeof bpmDifficulty !== 'undefined' ? bpmDifficulty : "medium";
    const questionData = getStoryQuestion(gameMode, difficulty, null);
    
    if (questionData) {
        return questionData;
    }
    
    const S = StoryMode;
    const nama = S.randName();
    const benda = S.randItem();
    const a = S.randInt(2, 10);
    const b = S.randInt(1, 8);
    
    return [`${nama} punya ${a} ${benda}. Diberi ${b} lagi. Berapa totalnya?`, a + b];
}

if (typeof window !== 'undefined') {
    window.StoryMode = StoryMode;
    window.getStoryQuestion = getStoryQuestion;
    window.getStoryQuestionArray = getStoryQuestionArray;
    window.getStoryQuestionsByModeAndSubMode = getStoryQuestionsByModeAndSubMode;
    window.getRandomStoryByMode = getRandomStoryByMode;
}
