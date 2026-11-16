/**
 * @fileOverview Generator soal cerita untuk Pop Balon Ajaib (versi ringkas).
 * @version 4.0.0
 *
 * Cara kerja (sama seperti versi lama):
 *   getStoryQuestionArray(gameMode, difficulty, subMode, qno) -> [[soal, jawaban], ...]
 *   Jawaban selalu bilangan bulat positif, supaya balon jawaban mudah dibaca anak.
 *
 * Perbedaan tingkat (inilah yang membuat Easy / Medium / Hard terasa beda):
 *   EASY   (kelas 1-3) : kalimat pendek, 1 langkah, angka kecil, ada emoji, konteks anak-anak.
 *   MEDIUM (kelas 4-5) : angka puluhan sampai ribuan, uang jajan, satuan dicampur, 2-3 langkah.
 *   HARD   (kelas 6)   : multi-langkah, persen, diskon, kecepatan, skala, pi = 22/7, soal kebalikan.
 *
 * Menambah soal baru cukup menambah satu baris fungsi ke tabel BANK di bawah.
 * Satu fungsi = satu pola soal; angka, nama, dan benda diacak sendiri.
 */
/*jshint esversion: 6 */

(function () {
    "use strict";

    // ============================================================
    // 1. Alat bantu kecil
    // ============================================================
    const THIS_YEAR = new Date().getFullYear();

    const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const step = (a, b, s) => a + rand(0, Math.floor((b - a) / s)) * s; // kelipatan s dari a sampai b
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (n) => n.toLocaleString("id-ID");
    const rp = (n) => "Rp" + fmt(n);
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const seq = (s, d, n) => Array.from({ length: n }, (_, i) => s + i * d).join(", ");
    const list = (arr) => (arr.length < 2 ? arr[0] : arr.slice(0, -1).join(", ") + " dan " + arr[arr.length - 1]);

    // dua bilangan berbeda
    const two = (lo, hi) => {
        const a = rand(lo, hi);
        let b = rand(lo, hi);
        while (b === a) b = rand(lo, hi);
        return [a, b];
    };

    // ambil n anggota berbeda dari arr
    const sample = (arr, n) => {
        const c = arr.slice();
        const out = [];
        while (out.length < n) out.push(c.splice(rand(0, c.length - 1), 1)[0]);
        return out;
    };

    const NAMES = ["Budi", "Ani", "Dimas", "Siti", "Raka", "Putri", "Fajar", "Dewi", "Rizki", "Nisa",
        "Bagus", "Citra", "Eko", "Maya", "Gilang", "Lina", "Tono", "Wulan", "Dina", "Andi"];
    const name = () => pick(NAMES);

    // benda = [nama, emoji]; .t dipakai di soal Easy (dengan emoji), .n di soal lain
    const THINGS = {
        buah: [["apel", "🍎"], ["jeruk", "🍊"], ["pisang", "🍌"], ["anggur", "🍇"], ["semangka", "🍉"], ["strawberry", "🍓"]],
        jajan: [["donat", "🍩"], ["kue", "🍰"], ["permen", "🍬"], ["roti", "🍞"], ["es krim", "🍦"], ["biskuit", "🍪"]],
        mainan: [["bola", "⚽"], ["balon", "🎈"], ["boneka", "🧸"], ["mobil-mobilan", "🚗"]],
        hewan: [["kucing", "🐱"], ["ayam", "🐔"], ["bebek", "🦆"], ["burung", "🐦"], ["kelinci", "🐰"]]
    };
    const thing = (cat) => {
        const [n, e] = pick(THINGS[cat]);
        return { n: n, e: e, t: n + " " + e };
    };

    // ---- bantuan untuk soal "Bandingkan Berat" (membandingkan satuan berbeda) ----
    const GRAM = { gram: 1, ons: 100, kg: 1000, kuintal: 100000, ton: 1000000 };
    const W_RANGE = { gram: [500, 5000, 100], ons: [5, 50, 1], kg: [1, 9, 1], kuintal: [5, 60, 5], ton: [1, 6, 1] };
    const OBJECTS = ["semangka", "melon", "nanas", "kelapa", "durian", "labu"];

    const compareWeights = (units, heaviest) => {
        const names = sample(OBJECTS, units.length);
        let items;
        do {
            items = units.map((u, i) => {
                const r = W_RANGE[u];
                return { n: names[i], u: u, v: step(r[0], r[1], r[2]) };
            });
        } while (new Set(items.map((i) => i.v * GRAM[i.u])).size < items.length);
        const g = (i) => i.v * GRAM[i.u];
        const best = items.reduce((m, i) => ((heaviest ? g(i) > g(m) : g(i) < g(m)) ? i : m));
        const dua = units.length === 2;
        const kata = heaviest ? (dua ? "lebih berat" : "paling berat") : (dua ? "lebih ringan" : "paling ringan");
        const teks = list(items.map((i) => i.n + " " + fmt(i.v) + " " + i.u));
        return ["Berat " + teks + ". Mana yang " + kata + "? (jawab angka beratnya)", best.v];
    };

    // ============================================================
    // 2. Bank soal: BANK[mode][subMode][level] = [fungsi soal, ...]
    //    Setiap fungsi mengembalikan [teks soal, jawaban]
    // ============================================================
    const BANK = {

        // ---------------------------------------------------- OPERASI
        operator: {
            Tambah: {
                easy: [
                    () => { const a = rand(1, 9), b = rand(1, 10), f = thing("buah"); return [`${name()} punya ${a} ${f.t}. Diberi ${b} lagi. Sekarang ada berapa?`, a + b]; },
                    () => { const a = rand(2, 9), b = rand(2, 9), j = thing("jajan"); return [`${name()} membawa ${a} ${j.t}, temannya membawa ${b}. Kalau digabung ada berapa?`, a + b]; },
                    () => { const a = rand(3, 10), b = rand(2, 9), h = thing("hewan"); return [`Ada ${a} ${h.t} sedang bermain. Datang ${b} lagi. Sekarang ada berapa?`, a + b]; }
                ],
                medium: [
                    () => { const a = rand(120, 480), b = rand(120, 480), j = thing("jajan"); return [`Sebuah toko menjual ${a} ${j.n} hari Sabtu dan ${b} hari Minggu. Berapa total yang terjual?`, a + b]; },
                    () => { const a = step(2000, 15000, 500), b = step(2000, 15000, 500); return [`${name()} menabung ${rp(a)} minggu lalu dan ${rp(b)} minggu ini. Berapa rupiah total tabungannya?`, a + b]; },
                    () => { const a = rand(100, 400), b = rand(100, 400), c = rand(100, 400); return [`Pengunjung perpustakaan: pagi ${a}, siang ${b}, sore ${c} orang. Berapa pengunjung seharian?`, a + b + c]; }
                ],
                hard: [
                    () => { const a = step(10000, 40000, 500), b = step(5000, 25000, 500), c = step(2000, 15000, 500); return [`${name()} membeli buku ${rp(a)}, tas ${rp(b)}, dan sepatu ${rp(c)}. Berapa rupiah total yang harus dibayar?`, a + b + c]; },
                    () => { const a = rand(12000, 45000), b = rand(500, 3000), c = rand(500, 3000); return [`Sebuah desa berpenduduk ${fmt(a)} jiwa. Tahun ini ${fmt(b)} bayi lahir dan ${fmt(c)} orang pindah masuk. Berapa jumlah penduduk sekarang?`, a + b + c]; },
                    () => { const p = step(10000, 50000, 1000), pct = pick([10, 20, 25, 50]); return [`Harga sepatu ${rp(p)}. Karena stok langka, harganya naik ${pct}%. Berapa rupiah harga sekarang?`, p + p * pct / 100]; }
                ]
            },

            Kurang: {
                easy: [
                    () => { const a = rand(5, 15), b = rand(1, a - 1), f = thing("buah"); return [`${name()} punya ${a} ${f.t}. Dimakan ${b}. Sisanya berapa?`, a - b]; },
                    () => { const a = rand(6, 15), b = rand(1, a - 1); return [`Ada ${a} balon 🎈. Pecah ${b} balon. Tinggal berapa balon?`, a - b]; },
                    () => { const a = rand(8, 20), b = rand(2, a - 2), h = thing("hewan"); return [`Di halaman ada ${a} ${h.t}. ${b} pergi. Yang tersisa berapa?`, a - b]; }
                ],
                medium: [
                    () => { const a = rand(300, 900), b = rand(100, a - 100); return [`Toko buku punya ${a} buku. Terjual ${b} buku. Sisa buku berapa?`, a - b]; },
                    () => { const a = step(10000, 50000, 1000), b = step(2000, a - 2000, 500); return [`${name()} membawa uang ${rp(a)} dan membeli mainan ${rp(b)}. Berapa rupiah sisa uangnya?`, a - b]; },
                    () => { const a = rand(400, 900), b = rand(50, 200), c = rand(50, 200); return [`Gudang menyimpan ${a} kardus. Hari Senin keluar ${b}, hari Selasa keluar ${c}. Sisa kardus berapa?`, a - b - c]; }
                ],
                hard: [
                    () => { const p = step(20000, 100000, 5000), pct = pick([10, 20, 25, 30, 40, 50]); return [`Sepatu seharga ${rp(p)} sedang diskon ${pct}%. Berapa rupiah yang harus dibayar?`, p - p * pct / 100]; },
                    () => { const a = rand(30000, 90000), b = rand(3000, 9000), c = rand(3000, 9000), d = rand(2000, 8000); return [`Seorang peternak punya ${fmt(a)} butir telur. Terjual ${fmt(b)} pagi, ${fmt(c)} siang, dan ${fmt(d)} butir pecah. Berapa butir yang masih bagus?`, a - b - c - d]; },
                    () => { const a = step(200000, 300000, 10000), b = step(10000, 80000, 5000), c = step(10000, 80000, 5000); return [`Saldo tabungan ${rp(a)}. ${name()} menarik ${rp(b)}, lalu menarik lagi ${rp(c)}. Berapa rupiah sisa saldonya?`, a - b - c]; }
                ]
            },

            Kali: {
                easy: [
                    () => { const a = rand(2, 5), b = rand(2, 9), j = thing("jajan"); return [`Ada ${a} piring. Tiap piring berisi ${b} ${j.t}. Semuanya ada berapa?`, a * b]; },
                    () => { const a = rand(2, 6), b = rand(2, 8); return [`${name()} punya ${a} kantong. Tiap kantong berisi ${b} kelereng 🔵. Jumlah kelereng semuanya?`, a * b]; },
                    () => { const a = rand(2, 5), b = rand(3, 8); return [`Satu kotak berisi ${b} pensil ✏️. Ada ${a} kotak. Berapa pensil seluruhnya?`, a * b]; }
                ],
                medium: [
                    () => { const p = step(1000, 5000, 500), q = rand(3, 12); return [`Satu ${thing("jajan").n} harganya ${rp(p)}. ${name()} membeli ${q}. Berapa rupiah yang harus dibayar?`, p * q]; },
                    () => { const a = rand(12, 30), b = rand(6, 15); return [`Sebuah aula punya ${a} baris kursi. Tiap baris ada ${b} kursi. Berapa kursi di aula?`, a * b]; },
                    () => { const a = rand(3, 15); return [`${name()} membeli ${a} lusin pensil. Berapa batang pensil semuanya? (1 lusin = 12)`, a * 12]; }
                ],
                hard: [
                    () => { const a = rand(3, 9), b = rand(4, 12), c = rand(5, 15); return [`Sebuah toko mengirim ${a} dus. Tiap dus berisi ${b} bungkus, tiap bungkus berisi ${c} permen. Berapa permen seluruhnya?`, a * b * c]; },
                    () => { const v = rand(40, 90), t = rand(3, 8); return [`Sebuah bus melaju ${v} km/jam selama ${t} jam. Berapa km jarak yang ditempuh?`, v * t]; },
                    () => { const s = pick([200, 300, 400, 500, 1000]), p = rand(2, 15); return [`Pada peta berskala 1 : ${fmt(s)}, jarak dua kota ${p} cm. Berapa meter jarak sebenarnya?`, p * s / 100]; }
                ]
            },

            Bagi: {
                easy: [
                    () => { const b = rand(2, 5), q = rand(2, 6), j = thing("jajan"); return [`${b * q} ${j.t} dibagi sama banyak untuk ${b} anak. Tiap anak dapat berapa?`, q]; },
                    () => { const b = rand(2, 5), q = rand(2, 6); return [`${name()} punya ${b * q} kelereng 🔵. Dimasukkan ke ${b} kantong sama banyak. Tiap kantong berisi berapa?`, q]; },
                    () => { const b = rand(2, 4), q = rand(3, 8); return [`Ada ${b * q} apel 🍎. Satu keranjang berisi ${q} apel. Ada berapa keranjang?`, b]; }
                ],
                medium: [
                    () => { const b = rand(3, 12), q = rand(8, 30); return [`Sekolah punya ${b * q} buku untuk dibagi rata ke ${b} kelas. Tiap kelas mendapat berapa buku?`, q]; },
                    () => { const b = rand(3, 10), q = step(1000, 10000, 500); return [`Uang ${rp(b * q)} dibagi sama rata untuk ${b} anak. Tiap anak mendapat berapa rupiah?`, q]; },
                    () => { const t = rand(2, 8), v = rand(30, 80); return [`Sebuah mobil menempuh ${v * t} km dalam ${t} jam dengan kecepatan tetap. Berapa km per jam kecepatannya?`, v]; }
                ],
                hard: [
                    () => {
                        const avg = rand(70, 95), d1 = rand(1, 8), d2 = rand(1, 8);
                        return [`Nilai ulangan ${name()} tiga kali: ${avg + d1}, ${avg - d2}, dan ${avg - d1 + d2}. Berapa nilai rata-ratanya?`, avg];
                    },
                    () => { const total = pick([200, 300, 400, 500, 600, 800]), pct = pick([10, 20, 25, 40, 50]); return [`${pct}% dari seluruh siswa sebuah sekolah adalah ${total * pct / 100} anak. Berapa jumlah seluruh siswa?`, total]; },
                    () => { const per = pick([10, 12, 15, 20]), k = rand(2, 6), q = rand(3, 15); return [`${fmt(per * k * q)} butir telur dimasukkan ke tray berisi ${per} butir. Setiap ${k} tray dimasukkan ke 1 dus. Berapa dus yang dibutuhkan?`, q]; }
                ]
            }
        },

        // ---------------------------------------------------- ALJABAR
        aljabar: {
            "Isi Kotak Kosong": {
                easy: [
                    () => { const a = rand(1, 9), c = rand(a + 1, 15); return [`${a} + □ = ${c}. Berapa isi kotak?`, c - a]; },
                    () => { const b = rand(1, 9), c = rand(b + 1, 15); return [`□ + ${b} = ${c}. Berapa isi kotak?`, c - b]; },
                    () => { const c = rand(5, 15), d = rand(1, c - 1); return [`${c} − □ = ${d}. Berapa isi kotak?`, c - d]; }
                ],
                medium: [
                    () => { const b = rand(2, 9), x = rand(3, 12); return [`□ × ${b} = ${b * x}. Berapa isi kotak?`, x]; },
                    () => { const b = rand(2, 9), x = rand(3, 12); return [`${b * x} ÷ □ = ${x}. Berapa isi kotak?`, b]; },
                    () => { const a = rand(20, 90), c = rand(a + 20, 150); return [`${a} + □ = ${c}. Berapa isi kotak?`, c - a]; }
                ],
                hard: [
                    () => { const a = rand(2, 9), x = rand(3, 12), b = rand(2, 15); return [`${a} × □ + ${b} = ${a * x + b}. Berapa isi kotak?`, x]; },
                    () => { const a = rand(2, 6), x = rand(3, 15), b = rand(2, 12); return [`(□ + ${b}) × ${a} = ${(x + b) * a}. Berapa isi kotak?`, x]; },
                    () => { const d = rand(2, 6), q = rand(3, 12), b = rand(5, 20); return [`□ ÷ ${d} + ${b} = ${q + b}. Berapa isi kotak?`, q * d]; }
                ]
            },

            "Nilai Variabel": {
                easy: [
                    () => { const x = rand(2, 9), b = rand(1, 9); return [`Jika n = ${x}, maka n + ${b} = ...`, x + b]; },
                    () => { const x = rand(6, 15), b = rand(1, 5); return [`Jika x = ${x}, maka x − ${b} = ...`, x - b]; },
                    () => { const a = rand(1, 9), b = rand(1, 9); return [`Jika a = ${a} dan b = ${b}, maka a + b = ...`, a + b]; }
                ],
                medium: [
                    () => { const x = rand(3, 12), a = rand(2, 5), b = rand(1, 9); return [`Jika x = ${x}, maka ${a}x + ${b} = ...`, a * x + b]; },
                    () => { const p = rand(10, 30), q = rand(2, 9); return [`Jika p = ${p} dan q = ${q}, maka p − q = ...`, p - q]; },
                    () => { const y = rand(4, 12), a = rand(2, 5), b = rand(1, 7); return [`Jika y = ${y}, maka ${a}y − ${b} = ...`, a * y - b]; }
                ],
                hard: [
                    () => { const x = rand(3, 9), y = rand(2, 6), a = rand(2, 4), b = rand(2, 4); return [`Jika x = ${x} dan y = ${y}, maka ${a}x + ${b}y = ...`, a * x + b * y]; },
                    () => { const x = rand(3, 8), a = rand(1, 5); return [`Jika x = ${x}, maka x² + ${a}x = ...`, x * x + a * x]; },
                    () => { const x = rand(5, 12), y = rand(2, 4), b = rand(2, 9); return [`Jika x = ${x} dan y = ${y}, maka (x + ${b}) × y − x = ...`, (x + b) * y - x]; }
                ]
            },

            "Persamaan Sederhana": {
                easy: [
                    () => { const a = rand(1, 9), b = rand(a + 1, 15); return [`x + ${a} = ${b}. Nilai x = ...`, b - a]; },
                    () => { const x = rand(5, 15), a = rand(1, 4); return [`x − ${a} = ${x - a}. Nilai x = ...`, x]; },
                    () => { const a = rand(1, 6), t = rand(a + 2, 15), f = thing("buah"); return [`${name()} punya beberapa ${f.t}. Setelah diberi ${a} lagi, jumlahnya jadi ${t}. Berapa jumlah awalnya?`, t - a]; }
                ],
                medium: [
                    () => { const a = rand(2, 9), x = rand(3, 12); return [`${a}x = ${a * x}. Nilai x = ...`, x]; },
                    () => { const d = rand(2, 6), q = rand(3, 12); return [`x ÷ ${d} = ${q}. Nilai x = ...`, d * q]; },
                    () => { const a = rand(2, 5), x = rand(3, 12), b = rand(1, 15); return [`${a}x + ${b} = ${a * x + b}. Nilai x = ...`, x]; }
                ],
                hard: [
                    () => { const a = rand(3, 9), x = rand(4, 15), b = rand(2, 11); return [`${a}x − ${b} = ${a * x - b}. Nilai x = ...`, x]; },
                    () => { const a = rand(2, 5), x = rand(3, 12), b = rand(1, 6); return [`${a}(x + ${b}) = ${a * (x + b)}. Nilai x = ...`, x]; },
                    () => { const c = rand(2, 4), a = rand(c + 1, c + 4), x = rand(3, 12), b = rand(1, 15); return [`${a}x + ${b} = ${c}x + ${(a - c) * x + b}. Nilai x = ...`, x]; }
                ]
            },

            "Pola Bilangan": {
                easy: [
                    () => { const s = rand(1, 5), d = pick([1, 2, 3, 5]); return [`Lanjutkan pola: ${seq(s, d, 4)}, ... Bilangan berikutnya adalah ...`, s + 4 * d]; },
                    () => { const s = rand(25, 40), d = pick([2, 3, 5]); return [`Pola turun: ${seq(s, -d, 4)}, ... Bilangan berikutnya adalah ...`, s - 4 * d]; },
                    () => { const d = pick([2, 3, 4, 5, 10]); return [`${name()} menghitung kelipatan ${d}: ${seq(d, d, 4)}, ... Bilangan berikutnya adalah ...`, 5 * d]; }
                ],
                medium: [
                    () => { const s = rand(2, 20), d = rand(4, 9); return [`Pola: ${seq(s, d, 4)}, ... Suku ke-6 adalah ...`, s + 5 * d]; },
                    () => { const s = rand(2, 5); return [`Pola: ${s}, ${s * 2}, ${s * 4}, ${s * 8}, ... Bilangan berikutnya adalah ...`, s * 16]; },
                    () => { const s = rand(60, 100), d = rand(4, 9); return [`Pola turun: ${seq(s, -d, 4)}, ... Bilangan berikutnya adalah ...`, s - 4 * d]; }
                ],
                hard: [
                    () => {
                        const s = rand(1, 5), d = rand(1, 3), t = [s];
                        for (let i = 0; i < 5; i++) t.push(t[i] + d + i); // selisihnya bertambah 1 tiap suku
                        return [`Pola: ${t.slice(0, 5).join(", ")}, ... Bilangan berikutnya adalah ...`, t[5]];
                    },
                    () => { const a = rand(2, 5), b = rand(1, 9), n = rand(8, 15); return [`Suku ke-n suatu barisan dirumuskan Un = ${a}n + ${b}. Berapa suku ke-${n}?`, a * n + b]; },
                    () => {
                        const a = rand(1, 4), b = rand(2, 6), f = [a, b];
                        for (let i = 2; i < 6; i++) f.push(f[i - 1] + f[i - 2]);
                        return [`Pola: ${f.slice(0, 5).join(", ")}, ... (tiap bilangan adalah jumlah dua bilangan sebelumnya). Bilangan berikutnya adalah ...`, f[5]];
                    },
                    () => { const s = rand(1, 4); return [`Pola: ${s}, ${s * 3}, ${s * 9}, ${s * 27}, ... Bilangan berikutnya adalah ...`, s * 81]; }
                ]
            }
        },

        // ---------------------------------------------------- WAKTU
        time: {
            "Baca Jam": {
                easy: [
                    () => { const h = rand(1, 12); return [`Jarum pendek menunjuk angka ${h}. Jarum panjang menunjuk angka 12. Sekarang pukul berapa?`, h]; },
                    () => { const h = rand(1, 11); return [`${name()} bangun pukul ${h}.00. Satu jam lagi pukul berapa?`, h + 1]; },
                    () => { const h = rand(1, 12), m = pick([[15, 3], [30, 6], [45, 9]]); return [`Jam menunjukkan pukul ${h}.${m[0]}. Jarum panjang menunjuk angka berapa?`, m[1]]; }
                ],
                medium: [
                    () => { const h = rand(13, 23); return [`Pukul ${h}.00 sama dengan pukul berapa jika memakai jam 12-an?`, h - 12]; },
                    () => { const h = rand(1, 11), m = pick([30, 35, 40, 45, 50, 55]); return [`Pukul ${h}.${m} sama dengan pukul ${h + 1} kurang berapa menit?`, 60 - m]; },
                    () => { const h = rand(1, 11), n = rand(1, 11); return [`Jarum pendek berada di antara angka ${h} dan ${h + 1}, jarum panjang menunjuk angka ${n}. Jam menunjukkan pukul ${h} lewat berapa menit?`, n * 5]; }
                ],
                hard: [
                    () => { const h = rand(1, 11); return [`Pada pukul ${h}.30, berapa derajat sudut antara jarum jam dan jarum menit? (ambil sudut yang lebih kecil)`, Math.abs(30 * h - 165)]; },
                    () => { const h = rand(14, 22), m = pick([10, 15, 20, 25, 35, 40, 45, 50]); return [`Jam digital menunjukkan ${h}.${m}. Berapa menit lagi menuju pukul ${h + 1}.00?`, 60 - m]; },
                    () => { const h = rand(2, 9), m = pick([15, 30, 45]); return [`Berapa menit telah berlalu sejak tengah malam (pukul 00.00) sampai pukul ${pad(h)}.${m}?`, h * 60 + m]; }
                ]
            },

            "Tambah & Kurang Waktu": {
                easy: [
                    () => { const h = rand(1, 7), d = rand(1, 4); return [`${name()} mulai belajar pukul ${h}. Belajar ${d} jam. Selesai pukul berapa?`, h + d]; },
                    () => { const h = rand(6, 12), d = rand(1, 5); return [`Sekarang pukul ${h}. ${d} jam yang lalu pukul berapa?`, h - d]; },
                    () => { const h = rand(1, 8), d = rand(1, 3); return [`Film 🎬 mulai pukul ${h} dan lamanya ${d} jam. Film selesai pukul berapa?`, h + d]; }
                ],
                medium: [
                    () => { const a = step(15, 50, 5), b = step(15, 50, 5); return [`${name()} belajar ${a} menit, istirahat, lalu belajar lagi ${b} menit. Total waktu belajar berapa menit?`, a + b]; },
                    () => { const h = rand(7, 10), d = rand(2, 6); return [`Kereta berangkat pukul ${h}.00 pagi dan perjalanan ${d} jam. Tiba pukul berapa? (jam 12-an)`, ((h + d - 1) % 12) + 1]; },
                    () => { const a = step(90, 150, 5), b = step(20, 80, 5); return [`Ujian berlangsung ${a} menit. Sudah berjalan ${b} menit. Berapa menit lagi sisa waktu ujian?`, a - b]; }
                ],
                hard: [
                    () => { const h1 = rand(1, 3), m1 = step(10, 50, 5), h2 = rand(1, 3), m2 = step(10, 50, 5); return [`${name()} berlatih ${h1} jam ${m1} menit di pagi hari dan ${h2} jam ${m2} menit di sore hari. Berapa menit total waktu berlatihnya?`, (h1 + h2) * 60 + m1 + m2]; },
                    () => { const h = rand(2, 3), m = step(10, 50, 5), k = step(10, 40, 5); return [`Sebuah film berdurasi ${h} jam ${m} menit, tetapi ${name()} berhenti menonton ${k} menit sebelum film selesai. Berapa menit film yang ia tonton?`, h * 60 + m - k]; },
                    () => { const k = rand(3, 6), m = pick([35, 40, 45]), r = step(15, 30, 5); return [`Hari ini ada ${k} jam pelajaran, tiap jam pelajaran ${m} menit, dan istirahat ${r} menit. Berapa menit total waktu di sekolah?`, k * m + r]; }
                ]
            },

            "Konversi Waktu": {
                easy: [
                    () => { const h = rand(1, 4); return [`${name()} bermain ${h} jam. Itu sama dengan berapa menit?`, h * 60]; },
                    () => { const m = rand(1, 4); return [`Liburan ${name()} berlangsung ${m} minggu. Berapa hari lamanya liburan?`, m * 7]; },
                    () => { const k = rand(1, 4); return [`${name()} menonton film selama ${k * 60} menit. Itu sama dengan berapa jam?`, k]; },
                    () => { const d = rand(1, 3); return [`${name()} menginap di rumah nenek ${d} hari. Berapa jam lamanya?`, d * 24]; }
                ],
                medium: [
                    () => { const m = rand(2, 9); return [`Sebuah lagu berdurasi ${m} menit. Berapa detik lamanya lagu itu?`, m * 60]; },
                    () => { const h = rand(1, 5), m = step(10, 50, 5); return [`Perjalanan ${name()} memakan waktu ${h} jam ${m} menit. Berapa menit lamanya?`, h * 60 + m]; },
                    () => { const d = rand(2, 7); return [`Kemah berlangsung ${d} hari. Berapa jam lamanya?`, d * 24]; },
                    () => { const w = rand(2, 9); return [`${w} windu = ... tahun (1 windu = 8 tahun)`, w * 8]; }
                ],
                hard: [
                    () => { const h = rand(1, 3), m = step(10, 50, 5); return [`${h} jam ${m} menit = ... detik`, h * 3600 + m * 60]; },
                    () => { const d = rand(1, 3), h = rand(2, 20); return [`Pesta budaya berlangsung ${d} hari ${h} jam. Berapa jam seluruhnya?`, d * 24 + h]; },
                    () => { const a = rand(1, 3), d = rand(1, 9); return [`${a} abad ${d} dasawarsa = ... tahun (1 abad = 100 tahun, 1 dasawarsa = 10 tahun)`, a * 100 + d * 10]; },
                    () => { const m = rand(2, 9), s = step(10, 50, 5); return [`Lomba lari ${name()} tercatat ${m} menit ${s} detik. Berapa detik waktunya?`, m * 60 + s]; }
                ]
            },

            "Selisih Waktu": {
                easy: [
                    () => { const a = rand(6, 9), d = rand(1, 4); return [`Pelajaran mulai pukul ${a} dan selesai pukul ${a + d}. Berapa jam lamanya pelajaran?`, d]; },
                    () => { const a = rand(1, 7), d = rand(2, 5); return [`${name()} bermain dari pukul ${a} sampai pukul ${a + d}. Berapa jam ia bermain?`, d]; },
                    () => { const age = rand(6, 12); return [`${name()} lahir tahun ${THIS_YEAR - age}. Berapa umurnya tahun ini?`, age]; }
                ],
                medium: [
                    () => { const h = rand(7, 10), m = pick([0, 15, 30, 45]), d = rand(1, 3), e = pick([0, 15, 30, 45]); return [`Film dimulai pukul ${h}.${pad(m)} dan selesai pukul ${h + d}.${pad(e)}. Berapa menit lamanya film?`, d * 60 + e - m]; },
                    () => { const y = THIS_YEAR - rand(10, 40); return [`Sekolah ini dibangun tahun ${y}. Sekarang tahun ${THIS_YEAR}. Sudah berapa tahun sekolah itu berdiri?`, THIS_YEAR - y]; },
                    () => { const [a, b] = two(60, 120); return [`${name()} berlari ${a} menit, temannya berlari ${b} menit. Berapa menit selisih waktunya?`, Math.abs(a - b)]; }
                ],
                hard: [
                    () => { const h1 = rand(6, 9), m1 = step(5, 55, 5), h2 = rand(13, 17), m2 = step(5, 55, 5); return [`Kereta berangkat pukul ${pad(h1)}.${pad(m1)} dan tiba pukul ${h2}.${pad(m2)}. Berapa menit lama perjalanan?`, (h2 * 60 + m2) - (h1 * 60 + m1)]; },
                    () => { const h1 = rand(20, 23), w = rand(4, 6); return [`${name()} tidur pukul ${h1}.30 dan bangun pukul ${pad(w)}.30 keesokan harinya. Berapa jam ia tidur?`, 24 - h1 + w]; },
                    () => { const a = rand(1, 2), b = step(10, 50, 5), t = a * 60 + b, c = t + pick([-1, 1]) * step(10, 40, 5); return [`${name()} menempuh perjalanan ${a} jam ${b} menit, sedangkan temannya ${c} menit. Berapa menit selisihnya?`, Math.abs(t - c)]; }
                ]
            }
        },

        // ---------------------------------------------------- MASSA
        heavy: {
            "Konversi Berat": {
                easy: [
                    () => { const k = rand(1, 5); return [`Ibu membeli ${k} kg gula. Itu sama dengan berapa ons? (1 kg = 10 ons)`, k * 10]; },
                    () => { const k = rand(1, 4); return [`${name()} membeli ${k} kg tepung. Itu sama dengan berapa gram? (1 kg = 1.000 gram)`, k * 1000]; },
                    () => { const k = rand(1, 6); return [`Sekantong beras beratnya ${fmt(k * 1000)} gram. Itu sama dengan berapa kg?`, k]; }
                ],
                medium: [
                    () => { const o = rand(3, 20); return [`${name()} membeli ${o} ons daging. Berapa gram beratnya? (1 ons = 100 gram)`, o * 100]; },
                    () => { const k = rand(2, 9); return [`Gudang menyimpan ${k} kuintal beras. Berapa kg beratnya? (1 kuintal = 100 kg)`, k * 100]; },
                    () => { const k = rand(1, 9), g = step(100, 900, 100); return [`Berat sebuah paket ${k} kg ${g} gram. Berapa gram beratnya?`, k * 1000 + g]; },
                    () => { const o = rand(2, 15); return [`${fmt(o * 100)} gram = ... ons`, o]; }
                ],
                hard: [
                    () => { const t = rand(1, 5), k = rand(1, 9); return [`Sebuah truk membawa ${t} ton ${k} kuintal pasir. Berapa kg muatannya? (1 ton = 10 kuintal)`, t * 1000 + k * 100]; },
                    () => { const k = rand(1, 5), o = rand(1, 9); return [`${k} kg ${o} ons = ... gram`, k * 1000 + o * 100]; },
                    () => { const t = rand(2, 9); return [`Pelabuhan menurunkan ${t} ton jagung. Berapa kuintal jagung itu? (1 ton = 10 kuintal)`, t * 10]; },
                    () => { const q = rand(2, 9); return [`Sebuah truk membawa ${q * 2} karung beras. Tiap karung beratnya 50 kg. Berapa kuintal berat seluruh beras?`, q]; }
                ]
            },

            "Tambah & Kurang Berat": {
                easy: [
                    () => { const a = rand(1, 6), b = rand(1, 5), f = thing("buah"); return [`${name()} membeli ${a} kg ${f.t} dan ${b} kg lagi. Total berapa kg?`, a + b]; },
                    () => { const a = rand(6, 12), b = rand(1, a - 2); return [`Di dapur ada ${a} kg beras 🍚. Dipakai ${b} kg. Sisa berapa kg?`, a - b]; },
                    () => { const a = rand(2, 8), b = rand(1, 6); return [`Tas ${name()} beratnya ${a} kg. Ditambah buku ${b} kg. Berat tas sekarang berapa kg?`, a + b]; }
                ],
                medium: [
                    () => { const a = rand(10, 40), b = rand(10, 40), c = rand(5, 30); return [`Seorang petani memanen ${a} kg jagung, ${b} kg singkong, dan ${c} kg kacang. Berapa kg total hasil panennya?`, a + b + c]; },
                    () => { const a = rand(60, 100), b = rand(10, 30), c = rand(5, 20); return [`Toko punya ${a} kg beras. Terjual ${b} kg pagi dan ${c} kg siang. Sisa berapa kg?`, a - b - c]; },
                    () => { const a = step(200, 900, 100), b = step(200, 900, 100); return [`Ibu membeli ${a} gram tepung dan ${b} gram gula. Berapa gram berat belanjaan Ibu?`, a + b]; }
                ],
                hard: [
                    () => { const t = rand(2, 6), k = step(100, 1500, 100); return [`Sebuah truk membawa ${t} ton pasir lalu menurunkan ${fmt(k)} kg. Berapa kg pasir yang masih di truk?`, t * 1000 - k]; },
                    () => { const a = rand(2, 9), g = step(100, 900, 100); return [`${name()} membeli ${a} kg tepung dan ${g} gram mentega. Berapa gram berat seluruh belanjaannya?`, a * 1000 + g]; },
                    () => { const a = rand(800, 1500), b = rand(100, 400), c = rand(100, 500), d = rand(100, 400); return [`Gudang berisi ${fmt(a)} kg beras. Pagi terjual ${b} kg, sore datang kiriman ${c} kg, lalu terjual ${d} kg. Berapa kg beras sekarang?`, a - b + c - d]; }
                ]
            },

            "Bandingkan Berat": {
                easy: [
                    () => { const [a, b] = two(1, 9); return [`Kucing 🐱 beratnya ${a} kg dan kelinci 🐰 beratnya ${b} kg. Mana yang lebih berat? (jawab angka beratnya)`, Math.max(a, b)]; },
                    () => { const [a, b] = two(1, 9); return [`${name()} membawa tas ${a} kg, adiknya membawa tas ${b} kg. Tas mana yang lebih ringan? (jawab angka beratnya)`, Math.min(a, b)]; },
                    () => compareWeights(["kg", "kg"], pick([true, false]))
                ],
                medium: [
                    () => compareWeights(["kg", "gram"], pick([true, false])),
                    () => compareWeights(["kg", "ons"], pick([true, false])),
                    () => compareWeights(["ons", "gram"], pick([true, false]))
                ],
                hard: [
                    () => compareWeights(["kg", "ons", "gram"], pick([true, false])),
                    () => compareWeights(["kg", "gram", "ons"], pick([true, false])),
                    () => compareWeights(["ton", "kuintal"], pick([true, false]))
                ]
            },

            "Selisih Berat": {
                easy: [
                    () => { const [a, b] = two(2, 12); return [`Kakak membawa tas ${a} kg dan adik membawa tas ${b} kg. Berapa kg selisih berat kedua tas?`, Math.abs(a - b)]; },
                    () => { const [a, b] = two(2, 15); return [`Semangka 🍉 beratnya ${a} kg dan melon 🍈 beratnya ${b} kg. Berapa kg selisih beratnya?`, Math.abs(a - b)]; },
                    () => { const a = rand(25, 40), b = rand(a - 12, a - 3); return [`${name()} beratnya ${a} kg dan adiknya ${b} kg. Berapa kg selisih berat mereka?`, a - b]; }
                ],
                medium: [
                    () => { const [a, b] = two(20, 90); return [`Karung A beratnya ${a} kg dan karung B ${b} kg. Berapa kg selisih beratnya?`, Math.abs(a - b)]; },
                    () => { const [a, b] = two(4, 18); return [`Paket A beratnya ${a * 50} gram dan paket B ${b * 50} gram. Berapa gram selisih beratnya?`, Math.abs(a - b) * 50]; },
                    () => { const k = rand(2, 6); let g; do { g = step(500, 5500, 100); } while (g === k * 1000); return [`Benda A beratnya ${k} kg dan benda B ${fmt(g)} gram. Berapa gram selisih berat keduanya?`, Math.abs(k * 1000 - g)]; }
                ],
                hard: [
                    () => { const t = rand(1, 6); let q; do { q = rand(5, 60); } while (q * 100 === t * 1000); return [`Truk A membawa ${t} ton barang dan truk B membawa ${q} kuintal. Berapa kg selisih muatannya?`, Math.abs(t * 1000 - q * 100)]; },
                    () => { const k = rand(1, 9); let o; do { o = rand(5, 95); } while (o * 100 === k * 1000); return [`Benda A beratnya ${k} kg dan benda B ${o} ons. Berapa gram selisih beratnya?`, Math.abs(k * 1000 - o * 100)]; },
                    () => {
                        let v;
                        do { v = [rand(20, 90), rand(20, 90), rand(20, 90)]; } while (new Set(v).size < 3);
                        return [`Tiga karung beratnya ${v[0]} kg, ${v[1]} kg, dan ${v[2]} kg. Berapa kg selisih karung terberat dan terringan?`, Math.max(...v) - Math.min(...v)];
                    }
                ]
            }
        },

        // ---------------------------------------------------- VOLUME
        volume: {
            "Volume": {
                easy: [
                    () => { const l = rand(1, 5); return [`Ibu membeli ${l} liter sirup. Itu sama dengan berapa mililiter? (1 liter = 1.000 ml)`, l * 1000]; },
                    () => { const l = rand(1, 5); return [`${name()} minum air ${fmt(l * 1000)} mililiter. Itu sama dengan berapa liter?`, l]; },
                    () => { const b = rand(2, 9); return [`Ada ${b} botol air 💧. Tiap botol berisi 1 liter. Berapa liter air semuanya?`, b]; }
                ],
                medium: [
                    () => { const l = rand(2, 9), m = step(100, 900, 100); return [`Sebuah ember berisi ${l} liter ${m} ml air. Berapa ml airnya?`, l * 1000 + m]; },
                    () => { const l = rand(2, 9); return [`${l} liter = ... cm³ (1 liter = 1.000 cm³)`, l * 1000]; },
                    () => { const k = rand(2, 12); return [`Sebuah botol memuat ${fmt(k * 1000)} cm³ air. Berapa liter air yang muat?`, k]; }
                ],
                hard: [
                    () => { const m = rand(2, 9); return [`Bak penampungan berisi ${m} m³ air. Berapa liter airnya? (1 m³ = 1.000 liter)`, m * 1000]; },
                    () => { const p = pick([30, 40, 50, 60]), l = pick([20, 30, 40]), t = pick([20, 30, 40]); return [`Akuarium berbentuk balok berukuran ${p} cm × ${l} cm × ${t} cm. Berapa liter air yang muat? (1 liter = 1.000 cm³)`, p * l * t / 1000]; },
                    () => { const s = rand(3, 8); return [`Bak mandi berbentuk kubus dengan rusuk ${s} dm. Berapa liter air yang dapat ditampung? (1 dm³ = 1 liter)`, s * s * s]; }
                ]
            },

            "Tambah Volume": {
                easy: [
                    () => { const a = rand(2, 8), b = rand(1, 8); return [`Ember berisi ${a} liter air 💧. Ditambah ${b} liter lagi. Sekarang berapa liter?`, a + b]; },
                    () => { const a = rand(6, 15), b = rand(1, a - 2); return [`Di galon ada ${a} liter air. Dipakai ${b} liter untuk memasak. Sisa berapa liter?`, a - b]; },
                    () => { const a = rand(1, 6), b = rand(1, 6); return [`${name()} menuang ${a} liter susu ke panci, lalu ${b} liter lagi. Berapa liter susu di panci?`, a + b]; }
                ],
                medium: [
                    () => { const a = step(250, 1500, 250), b = step(250, 1500, 250); return [`Sebuah teko berisi ${fmt(a)} ml teh. ${name()} menuang ${fmt(b)} ml teh lagi. Berapa ml teh di teko sekarang?`, a + b]; },
                    () => { const a = rand(50, 100), b = rand(10, 29), c = rand(5, 15); return [`Bak air berisi ${a} liter. Terpakai ${b} liter untuk mandi dan ${c} liter untuk mencuci. Sisa berapa liter?`, a - b - c]; },
                    () => { const a = rand(2, 6), b = step(250, 750, 250); return [`Ibu membeli ${a} liter minyak dan ${b} ml saus. Berapa ml cairan yang dibeli Ibu?`, a * 1000 + b]; }
                ],
                hard: [
                    () => { const a = rand(200, 500), b = rand(30, 90), c = rand(30, 90), d = rand(40, 120); return [`Tandon berisi ${a} liter air. Pagi terpakai ${b} liter, siang terpakai ${c} liter, lalu diisi ${d} liter. Berapa liter air sekarang?`, a - b - c + d]; },
                    () => { const m = rand(2, 9), l = step(200, 1500, 100); return [`Kolam berisi ${m} m³ air. Dikuras ${fmt(l)} liter. Sisa berapa liter?`, m * 1000 - l]; },
                    () => { const g = rand(5, 19), m = pick([200, 250, 500]); return [`Sebuah galon berisi ${g} liter air dituang ke gelas-gelas ${m} ml sampai habis. Berapa gelas yang terisi penuh?`, g * 1000 / m]; }
                ]
            },

            "Selisih Volume": {
                easy: [
                    () => { const [a, b] = two(2, 15); return [`Ember A berisi ${a} liter, ember B berisi ${b} liter. Berapa liter selisih isinya?`, Math.abs(a - b)]; },
                    () => { const [a, b] = two(2, 12); return [`${name()} punya botol 🥛 berisi ${a} liter dan botol lain berisi ${b} liter. Berapa liter selisihnya?`, Math.abs(a - b)]; },
                    () => { const [a, b] = two(3, 20); return [`Galon biru memuat ${a} liter dan galon hijau memuat ${b} liter. Berapa liter selisih muatannya?`, Math.abs(a - b)]; }
                ],
                medium: [
                    () => { const [a, b] = two(2, 18); return [`Gelas A berisi ${a * 50} ml dan gelas B berisi ${b * 50} ml. Berapa ml selisih isinya?`, Math.abs(a - b) * 50]; },
                    () => { const l = rand(2, 6); let m; do { m = step(250, 5500, 250); } while (m === l * 1000); return [`Botol A berisi ${l} liter dan botol B berisi ${fmt(m)} ml. Berapa ml selisih isinya?`, Math.abs(l * 1000 - m)]; },
                    () => { const [a, b] = two(35, 90); return [`Dua tangki berisi ${a} liter dan ${b} liter air. Berapa liter selisihnya?`, Math.abs(a - b)]; }
                ],
                hard: [
                    () => { const m = rand(2, 8); let l; do { l = step(500, 6500, 100); } while (l === m * 1000); return [`Bak A berisi ${m} m³ air dan bak B berisi ${fmt(l)} liter air. Berapa liter selisih isi kedua bak?`, Math.abs(m * 1000 - l)]; },
                    () => { const l = rand(2, 9); let m; do { m = step(500, 9500, 250); } while (m === l * 1000); return [`Tangki A berisi ${l} liter dan tangki B berisi ${fmt(m)} ml. Berapa ml selisih isinya?`, Math.abs(l * 1000 - m)]; },
                    () => {
                        let a, b, c;
                        do { a = rand(80, 150); b = rand(30, 70); c = rand(5, 20); } while (a - b - 2 * c === 0);
                        return [`Bak A berisi ${a} liter dan bak B berisi ${b} liter. Lalu ${c} liter dipindahkan dari bak A ke bak B. Berapa liter selisih isi kedua bak sekarang?`, Math.abs(a - b - 2 * c)];
                    }
                ]
            },

            "Perkiraan Volume": {
                easy: [
                    () => { const l = 2 * rand(1, 6); return [`Ember berisi ${l} liter air. Setengahnya dipakai. Berapa liter air yang dipakai?`, l / 2]; },
                    () => { const n = rand(2, 5); return [`Satu gelas 🥛 berisi 200 ml. ${n} gelas berisi berapa ml?`, 200 * n]; },
                    () => { const a = pick([["setengah", 500], ["seperempat", 250]]); return [`${name()} menuang ${a[0]} liter susu ke gelas. Berapa ml susu di gelas itu?`, a[1]]; }
                ],
                medium: [
                    () => { const f = pick([["1/2", 500], ["1/4", 250], ["3/4", 750], ["1/5", 200], ["1/8", 125]]); return [`Resep kue memerlukan ${f[0]} liter susu. Berapa ml susu yang diperlukan?`, f[1]]; },
                    () => { const l = 4 * rand(2, 10); return [`Tangki berkapasitas ${l} liter terisi 3/4 bagian. Berapa liter air di dalamnya?`, l * 3 / 4]; },
                    () => { const n = rand(3, 9); return [`Satu botol minum memuat 600 ml. ${n} botol memuat berapa ml?`, 600 * n]; }
                ],
                hard: [
                    () => { const v = pick([40, 60, 80, 100, 120, 200]), pct = pick([25, 40, 50, 60, 75, 80]); return [`Sebuah tangki berkapasitas ${v} liter terisi ${pct}%. Berapa liter air di dalam tangki?`, v * pct / 100]; },
                    () => { const v = pick([40, 60, 80, 100, 120, 200]), pct = pick([25, 40, 50, 60, 75, 80]); return [`Bak berkapasitas ${v} liter sudah terisi ${pct}%. Berapa liter lagi agar bak penuh?`, v - v * pct / 100]; },
                    () => { const n = pick([200, 400, 500, 600, 800, 1000]), pct = pick([20, 25, 40, 50, 75]); return [`Sebuah botol berisi ${n} ml air. ${name()} meminum ${pct}% isinya. Berapa ml air yang tersisa?`, n - n * pct / 100]; }
                ]
            }
        },

        // ---------------------------------------------------- BANGUN (GEOMETRI)
        up: {
            "Keliling Bangun Datar": {
                easy: [
                    () => { const s = rand(2, 9); return [`Persegi punya 4 sisi sama panjang. Jika satu sisinya ${s} cm, berapa cm kelilingnya?`, 4 * s]; },
                    () => { const p = rand(4, 10), l = rand(2, 6); return [`Sebuah buku 📒 panjangnya ${p} cm dan lebarnya ${l} cm. Berapa cm keliling sampulnya?`, 2 * (p + l)]; },
                    () => { const a = rand(5, 9), b = rand(5, 9), c = rand(5, 9); return [`Segitiga sisinya ${a} cm, ${b} cm, dan ${c} cm. Berapa cm kelilingnya?`, a + b + c]; }
                ],
                medium: [
                    () => { const p = rand(8, 25), l = rand(5, 15); return [`Kebun berbentuk persegi panjang ${p} m × ${l} m dipagari satu putaran. Berapa m panjang pagarnya?`, 2 * (p + l)]; },
                    () => { const p = rand(8, 20), l = rand(4, 15); return [`Keliling persegi panjang ${2 * (p + l)} cm dan panjangnya ${p} cm. Berapa cm lebarnya?`, l]; },
                    () => { const s = rand(5, 20); return [`Sebuah belah ketupat bersisi ${s} cm. Berapa cm kelilingnya?`, 4 * s]; }
                ],
                hard: [
                    () => { const k = rand(1, 6); return [`Sebuah lingkaran berjari-jari ${7 * k} cm. Berapa cm kelilingnya? (π = 22/7)`, 44 * k]; },
                    () => { const p = rand(15, 30), l = rand(10, 20), x = rand(2, 5); return [`Taman persegi panjang ${p} m × ${l} m akan dipagari, kecuali pintu masuk selebar ${x} m. Berapa m panjang pagar yang dibutuhkan?`, 2 * (p + l) - x]; },
                    () => { const k = rand(2, 6), n = rand(5, 20); return [`Roda berdiameter ${7 * k} cm berputar ${n} kali. Berapa cm jarak yang ditempuh? (π = 22/7)`, 22 * k * n]; }
                ]
            },

            "Volume Bangun Ruang": {
                easy: [
                    () => { const s = rand(2, 4); return [`Kubus 🎲 punya rusuk ${s} cm. Berapa cm³ volumenya? (volume = s × s × s)`, s ** 3]; },
                    () => { const p = rand(2, 5), l = rand(2, 4), t = rand(2, 3); return [`Balok panjangnya ${p} cm, lebarnya ${l} cm, tingginya ${t} cm. Berapa cm³ volumenya? (p × l × t)`, p * l * t]; },
                    () => { const a = rand(2, 4), b = rand(3, 8); return [`${name()} menyusun balok mainan 🧱 dalam ${a} lapis. Tiap lapis ada ${b} balok. Berapa balok seluruhnya?`, a * b]; }
                ],
                medium: [
                    () => { const s = rand(5, 10); return [`Bak penampungan berbentuk kubus dengan rusuk ${s} dm. Berapa dm³ volumenya?`, s ** 3]; },
                    () => { const p = rand(6, 15), l = rand(4, 10), t = rand(3, 9); return [`Sebuah akuarium berukuran ${p} cm × ${l} cm × ${t} cm. Berapa cm³ volumenya?`, p * l * t]; },
                    () => { const p = rand(4, 10), l = rand(3, 8), t = rand(3, 9); return [`Volume sebuah balok ${p * l * t} cm³. Panjangnya ${p} cm dan lebarnya ${l} cm. Berapa cm tingginya?`, t]; }
                ],
                hard: [
                    () => { const k = pick([1, 2]), t = rand(5, 20); return [`Sebuah tabung berjari-jari ${7 * k} cm dan tinggi ${t} cm. Berapa cm³ volumenya? (π = 22/7)`, 154 * k * k * t]; },
                    () => { const s = rand(3, 12), t = 3 * rand(2, 8); return [`Limas beralas persegi dengan sisi ${s} cm dan tinggi ${t} cm. Berapa cm³ volumenya?`, s * s * t / 3]; },
                    () => { const a = 2 * rand(2, 6), t = rand(3, 9), h = rand(5, 15); return [`Prisma segitiga: alas segitiga ${a} cm, tinggi segitiga ${t} cm, tinggi prisma ${h} cm. Berapa cm³ volumenya?`, (a * t / 2) * h]; }
                ]
            },

            "Luas Permukaan Bangun Ruang": {
                easy: [
                    () => { const s = rand(1, 4); return [`${name()} membuat kotak kado 🎁 berbentuk kubus. Luas satu sisinya ${s * s} cm². Kubus punya 6 sisi. Berapa cm² luas seluruh permukaannya?`, 6 * s * s]; },
                    () => { const s = rand(2, 4); return [`Dadu 🎲 punya rusuk ${s} cm. Luas satu sisinya ${s * s} cm². Berapa cm² luas seluruh permukaan dadu?`, 6 * s * s]; },
                    () => { const s = rand(1, 5); return [`Satu sisi kubus luasnya ${s * s} cm². Berapa cm² luas permukaan kubus itu? (kubus punya 6 sisi)`, 6 * s * s]; }
                ],
                medium: [
                    () => { const s = rand(3, 10); return [`Kotak hadiah berbentuk kubus dengan rusuk ${s} cm akan dibungkus kertas kado. Berapa cm² kertas kado yang dibutuhkan?`, 6 * s * s]; },
                    () => { const p = rand(4, 10), l = rand(3, 8), t = rand(2, 6); return [`Balok berukuran ${p} cm × ${l} cm × ${t} cm. Berapa cm² luas permukaannya?`, 2 * (p * l + p * t + l * t)]; },
                    () => { const s = rand(3, 12); return [`Luas permukaan sebuah kubus ${6 * s * s} cm². Berapa cm panjang rusuknya?`, s]; }
                ],
                hard: [
                    () => { const k = pick([1, 2]), t = rand(3, 15); return [`Sebuah tabung tertutup berjari-jari ${7 * k} cm dan tinggi ${t} cm. Berapa cm² luas permukaannya? (π = 22/7)`, 44 * k * (7 * k + t)]; },
                    () => { const p = rand(30, 60), l = rand(20, 40), t = rand(20, 40); return [`Akuarium kaca tanpa tutup berukuran ${p} cm × ${l} cm × ${t} cm. Berapa cm² luas kaca yang dibutuhkan?`, p * l + 2 * p * t + 2 * l * t]; },
                    () => { const p = rand(5, 12), l = rand(4, 9), t = rand(3, 8); return [`Luas permukaan sebuah balok ${2 * (p * l + p * t + l * t)} cm². Panjangnya ${p} cm dan lebarnya ${l} cm. Berapa cm tingginya?`, t]; }
                ]
            },

            "Perbandingan Bangun": {
                easy: [
                    () => { const a = rand(5, 30), k = rand(2, 4); return [`Pita merah panjangnya ${a} cm. Pita biru ${a * k} cm. Pita biru berapa kali panjang pita merah?`, k]; },
                    () => { const a = rand(10, 40), k = rand(2, 4); return [`Kebun ${name()} seluas ${a} m². Kebun temannya seluas ${a * k} m². Kebun teman berapa kali lebih luas?`, k]; },
                    () => { const s = rand(2, 5), k = rand(2, 3); return [`Persegi A bersisi ${s} cm dan persegi B bersisi ${s * k} cm. Keliling B berapa kali keliling A?`, k]; }
                ],
                medium: [
                    () => { const s = rand(2, 6), k = rand(2, 4); return [`Persegi A bersisi ${s} cm dan persegi B bersisi ${s * k} cm. Luas B berapa kali luas A?`, k * k]; },
                    () => {
                        let p1, l1, p2, l2;
                        do { p1 = rand(5, 12); l1 = rand(3, 9); p2 = rand(5, 12); l2 = rand(3, 9); } while (p1 * l1 === p2 * l2);
                        return [`Persegi panjang A berukuran ${p1} × ${l1} cm dan B berukuran ${p2} × ${l2} cm. Berapa cm² selisih luasnya?`, Math.abs(p1 * l1 - p2 * l2)];
                    },
                    () => { const a = rand(1, 4), b = rand(a + 1, 6), k = rand(2, 9); return [`Perbandingan banyak apel dan jeruk adalah ${a} : ${b}. Jika apel ada ${a * k} buah, berapa buah jeruknya?`, b * k]; }
                ],
                hard: [
                    () => { const s = rand(2, 5), k = rand(2, 3); return [`Kubus A berusuk ${s} cm dan kubus B berusuk ${s * k} cm. Volume B berapa kali volume A?`, k ** 3]; },
                    () => { const a = rand(2, 5), b = rand(a + 1, 7), k = rand(2, 5); return [`Panjang dan lebar sebuah persegi panjang berbanding ${b} : ${a}. Jika panjangnya ${b * k} cm, berapa cm² luasnya?`, a * b * k * k]; },
                    () => { const p = rand(4, 8), l = rand(3, 6), k = rand(2, 3); return [`Foto berukuran ${p} cm × ${l} cm diperbesar ${k} kali (panjang dan lebarnya). Berapa cm² luas foto setelah diperbesar?`, p * l * k * k]; }
                ]
            }
        }
    };

    // Nama lama / nama alternatif sub-mode -> nama pada tombol di index.html
    const ALIAS = {
        penjumlahan: "Tambah", pengurangan: "Kurang", perkalian: "Kali", pembagian: "Bagi",
        "Konversi Volume": "Volume", "Tambah & Kurang Volume": "Tambah Volume", "Bandingkan Volume": "Perkiraan Volume"
    };

    const LEVELS = ["easy", "medium", "hard"];

    // ============================================================
    // 3. Mesin pembuat soal
    // ============================================================
    const templatesFor = (gameMode, subMode, difficulty) => {
        const modeBank = BANK[gameMode] || BANK.operator;
        const subBank = modeBank[ALIAS[subMode] || subMode] || modeBank[Object.keys(modeBank)[0]];
        return subBank[LEVELS.indexOf(difficulty) > -1 ? difficulty : "medium"];
    };

    const isValid = (q) => Array.isArray(q) && !!q[0] && Number.isInteger(q[1]) && q[1] > 0 && !/NaN|undefined/.test(q[0]);

    /** Satu soal acak: [teks, jawaban] */
    function getStoryQuestion(gameMode, difficulty, subMode) {
        try {
            return pick(templatesFor(gameMode, subMode, difficulty))();
        } catch (e) {
            console.warn("Gagal membuat soal:", e);
            return null;
        }
    }

    /** Kumpulan soal tanpa soal kembar (kalau variasi kurang, sisanya boleh berulang) */
    function getStoryQuestionArray(gameMode, difficulty, subMode, qno) {
        const result = [];
        const seen = new Set();
        for (let i = 0; i < qno * 30 && result.length < qno; i++) {
            const q = getStoryQuestion(gameMode, difficulty, subMode);
            if (isValid(q) && !seen.has(q[0])) {
                seen.add(q[0]);
                result.push(q);
            }
        }
        for (let i = 0; i < qno * 5 && result.length < qno; i++) {
            const q = getStoryQuestion(gameMode, difficulty, subMode);
            if (isValid(q)) result.push(q);
        }
        return result;
    }

    /** Daftar fungsi pola soal (disimpan agar kompatibel dengan versi lama) */
    function getStoryQuestionsByModeAndSubMode(gameMode, subMode, difficulty) {
        return templatesFor(gameMode, subMode, difficulty);
    }

    function getRandomStoryByMode(gameMode) {
        const difficulty = typeof window.bpmDifficulty !== "undefined" ? window.bpmDifficulty : "medium";
        return getStoryQuestion(gameMode, difficulty, null);
    }

    // Objek lama yang mungkin masih dipakai file lain
    const StoryMode = {
        rand: pick,
        randInt: rand,
        randName: name,
        randItem: () => thing(pick(Object.keys(THINGS))).n,
        randFruit: () => thing("buah").n,
        randSnack: () => thing("jajan").n,
        randToy: () => thing("mainan").n,
        randAnimal: () => thing("hewan").n
    };

    window.StoryMode = StoryMode;
    window.getStoryQuestion = getStoryQuestion;
    window.getStoryQuestionArray = getStoryQuestionArray;
    window.getStoryQuestionsByModeAndSubMode = getStoryQuestionsByModeAndSubMode;
    window.getRandomStoryByMode = getRandomStoryByMode;
})();