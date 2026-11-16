/**
 * @fileOverview Riwayat Skor - Pop Balon Ajaib.
 * @description Menyimpan hasil setiap permainan yang selesai dan menampilkannya di halaman
 *              "Riwayat Permainan" (dibuka lewat tombol High Score di menu utama).
 *
 * Daftar terdiri dari 10 baris:
 *   Baris 1-3   : 3 skor tertinggi dari permainan Hard. Permanen, hanya bisa tergeser oleh skor yang lebih baik.
 *                 Skor yang tergeser turun ke baris 4.
 *   Baris 4-10  : 7 permainan terakhir (semua tingkat kesulitan), yang terbaru di atas.
 *                 Baris paling lama hilang kalau tertimpa permainan baru.
 *
 * Yang dicatat per permainan: skor, hati yang bertahan, mode, jumlah soal (+ sub-mode Ujian dan tingkat kesulitan).
 * Permainan yang dihentikan di tengah jalan (tombol Home) tidak dicatat.
 *
 * Data disimpan di localStorage (per browser/perangkat). Kalau localStorage diblokir,
 * data tetap jalan selama halaman terbuka (disimpan di memori).
 */
/*jshint esversion: 6 */
/* globals $, bpmScoreArray, bpmHealthArray, bpmGameMode, bpmDifficulty, bpmOptionArray, getHighScore, setHighScore */

(function (window, $) {
    'use strict';

    // ===================== PENGATURAN =====================
    var KUNCI_PENYIMPANAN = 'balloon_pop_riwayat_skor';
    var JUMLAH_PODIUM = 3;        // baris permanen (skor tertinggi)
    var JUMLAH_TERAKHIR = 7;      // baris permainan terakhir (3 + 7 = 10 baris)

    // true  = hanya permainan Hard yang boleh masuk 3 besar permanen.
    // false = permainan dengan tingkat kesulitan apa pun boleh masuk 3 besar.
    var PODIUM_HANYA_HARD = true;

    var JEDA_BARIS = 60;          // ms antar baris saat muncul bergantian
    var FADE_KELUAR = 250;        // ms menu memudar
    var FADE_MASUK = 300;         // ms halaman riwayat memudar masuk

    var NAMA_MODE = {
        aljabar: 'Aljabar',
        time: 'Waktu',
        heavy: 'Massa',
        volume: 'Volume',
        up: 'Bangunan',
        operator: 'Operasi',
        exam: 'Ujian'
    };
    var NAMA_LEVEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

    // ===================== KEADAAN =====================
    var cadanganMemori = null;    // dipakai kalau localStorage tidak bisa dipakai
    var sudahDicatat = false;     // mencegah satu permainan tercatat dua kali (mis. klik ganda)
    var sedangBerpindah = false;  // mencegah animasi buka/tutup tertumpuk
    var penghitungWaktu = [];     // id setTimeout animasi baris

    // ===================== PENYIMPANAN =====================
    function stateKosong() {
        return { versi: 1, podium: [], terakhir: [], terbaik: null };
    }

    function adalahAngka(v) {
        return typeof v === 'number' && isFinite(v);
    }

    function rapikan(teks) {
        return String(teks === undefined || teks === null ? '' : teks).replace(/\s+/g, ' ').trim();
    }

    function bersihkanEntri(e) {
        if (!e || !adalahAngka(e.skor) || !adalahAngka(e.total) || e.total <= 0) {
            return null;
        }
        var hatiTotal = adalahAngka(e.hatiTotal) && e.hatiTotal > 0 ? e.hatiTotal : 5;
        return {
            skor: Math.max(0, Math.min(e.skor, e.total)),
            total: e.total,
            hati: Math.max(0, Math.min(adalahAngka(e.hati) ? e.hati : 0, hatiTotal)),
            hatiTotal: hatiTotal,
            mode: rapikan(e.mode),
            sub: rapikan(e.sub),
            kesulitan: rapikan(e.kesulitan),
            waktu: adalahAngka(e.waktu) ? e.waktu : 0
        };
    }

    function bersihkanState(data) {
        var s = stateKosong();
        if (!data || typeof data !== 'object') {
            return s;
        }
        s.podium = (Array.isArray(data.podium) ? data.podium : []).map(bersihkanEntri).filter(Boolean).slice(0, JUMLAH_PODIUM);
        s.terakhir = (Array.isArray(data.terakhir) ? data.terakhir : []).map(bersihkanEntri).filter(Boolean).slice(0, JUMLAH_TERAKHIR);
        if (Array.isArray(data.terbaik) && adalahAngka(data.terbaik[0]) && adalahAngka(data.terbaik[1]) && data.terbaik[1] > 0) {
            s.terbaik = [data.terbaik[0], data.terbaik[1]];
        }
        return s;
    }

    function muat() {
        var mentah = null;
        try {
            mentah = window.localStorage.getItem(KUNCI_PENYIMPANAN);
        } catch (e) {
            return bersihkanState(cadanganMemori);
        }
        if (!mentah) {
            return bersihkanState(cadanganMemori);
        }
        try {
            return bersihkanState(JSON.parse(mentah));
        } catch (e) {
            return stateKosong();
        }
    }

    function simpan(state) {
        cadanganMemori = state;
        try {
            window.localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(state));
        } catch (e) {
            // localStorage penuh/diblokir: data tetap ada di memori selama halaman terbuka
        }
    }

    // ===================== ATURAN PERINGKAT =====================
    // Sama dengan checkHighScore(): rasio skor/soal lebih tinggi menang, kalau sama maka soal lebih banyak menang.
    // Dibandingkan dengan perkalian silang supaya tidak ada selisih pembulatan.
    function lebihBaik(a, b) {
        var kiri = a.skor * b.total;
        var kanan = b.skor * a.total;
        return kiri > kanan || (kiri === kanan && a.total > b.total);
    }

    function layakPodium(entri) {
        return entri.skor > 0 && (!PODIUM_HANYA_HARD || entri.kesulitan === 'hard');
    }

    // Memasukkan satu entri ke state. Mengembalikan peringkat podium (1-3) atau 0 kalau tidak masuk podium.
    function masukkan(state, entri) {
        var peringkat = 0;
        if (layakPodium(entri)) {
            var idx = -1;
            for (var i = 0; i < state.podium.length; i++) {
                if (lebihBaik(entri, state.podium[i])) {
                    idx = i;
                    break;
                }
            }
            if (idx === -1 && state.podium.length < JUMLAH_PODIUM) {
                idx = state.podium.length;
            }
            if (idx !== -1) {
                state.podium.splice(idx, 0, entri);
                peringkat = idx + 1;
                if (state.podium.length > JUMLAH_PODIUM) {
                    // yang tergeser dari baris 3 turun ke baris 4 (paling atas daftar terakhir)
                    state.terakhir.unshift(state.podium.pop());
                }
            }
        }
        if (!peringkat) {
            state.terakhir.unshift(entri);
        }
        state.terakhir = state.terakhir.slice(0, JUMLAH_TERAKHIR);
        return peringkat;
    }

    // ===================== PENCATATAN PERMAINAN =====================
    function ambilEntriSaatIni() {
        if (typeof bpmScoreArray === 'undefined' || !bpmScoreArray) {
            return null;
        }
        var total = Number(bpmScoreArray[1]);
        if (!(total > 0)) {
            return null;
        }
        var skor = Math.max(0, Math.min(Number(bpmScoreArray[0]) || 0, total));
        var adaHati = typeof bpmHealthArray !== 'undefined' && bpmHealthArray;
        var hatiTotal = adaHati && Number(bpmHealthArray[1]) > 0 ? Number(bpmHealthArray[1]) : 5;
        var hati = Math.max(0, Math.min(adaHati ? (Number(bpmHealthArray[0]) || 0) : 0, hatiTotal));
        var mode = typeof bpmGameMode !== 'undefined' ? rapikan(bpmGameMode) : '';
        var kesulitan = typeof bpmDifficulty !== 'undefined' ? rapikan(bpmDifficulty) : '';
        var sub = '';
        if (mode === 'exam' && typeof bpmOptionArray !== 'undefined' && bpmOptionArray && bpmOptionArray[0]) {
            sub = rapikan(bpmOptionArray[0]);
        }
        return {
            skor: skor,
            total: total,
            hati: hati,
            hatiTotal: hatiTotal,
            mode: mode,
            sub: sub,
            kesulitan: kesulitan,
            waktu: Date.now()
        };
    }

    /**
     * Dipanggil dari game-logic.js saat permainan selesai (menang atau hati habis).
     * @return {object|null} {peringkat, entri} atau null kalau tidak ada yang dicatat
     */
    function catat() {
        if (sudahDicatat) {
            return null;
        }
        var entri = ambilEntriSaatIni();
        if (!entri) {
            return null;
        }
        sudahDicatat = true;
        var state = muat();
        var peringkat = masukkan(state, entri);
        // Simpan juga angka High Score yang tampil di tombol menu supaya tidak kembali ke 0 setelah refresh
        if (typeof getHighScore === 'function') {
            try {
                var hs = getHighScore();
                if (adalahAngka(hs[0]) && adalahAngka(hs[1]) && hs[1] > 0) {
                    state.terbaik = [hs[0], hs[1]];
                }
            } catch (e) {
                // abaikan: High Score di tombol hanya pelengkap
            }
        }
        simpan(state);
        return { peringkat: peringkat, entri: entri };
    }

    /** Dipanggil dari playGame() setiap permainan baru dimulai. */
    function reset() {
        sudahDicatat = false;
    }

    function pulihkanHighScore() {
        var s = muat();
        if (s.terbaik && typeof setHighScore === 'function') {
            setHighScore(s.terbaik);
        }
    }

    // ===================== TAMPILAN =====================
    function buatElemen(tag, kelas, teks) {
        var e = document.createElement(tag);
        if (kelas) {
            e.className = kelas;
        }
        if (teks !== undefined && teks !== null) {
            e.textContent = teks;
        }
        return e;
    }

    function namaMode(entri) {
        var nama = NAMA_MODE[entri.mode] || entri.mode || '-';
        return entri.sub ? nama + ' · ' + entri.sub : nama;
    }

    function buatBaris(entri, nomor, podium) {
        var li = buatElemen('li', 'riwayat-row riwayat-anim');
        if (podium) {
            li.classList.add('is-podium', 'rank-' + nomor);
        }

        // Kolom peringkat
        var rank = buatElemen('span', 'riwayat-c c-rank');
        if (podium) {
            var piala = buatElemen('i', 'fas fa-trophy');
            piala.setAttribute('aria-hidden', 'true');
            rank.appendChild(piala);
        }
        rank.appendChild(buatElemen('span', 'rank-angka', String(nomor)));
        li.appendChild(rank);

        if (!entri) {
            li.classList.add('is-empty');
            li.appendChild(buatElemen('span', 'riwayat-c c-kosong', PODIUM_HANYA_HARD ? 'Belum ada skor Hard' : 'Belum ada skor'));
            return li;
        }

        // Kolom skor
        li.appendChild(buatElemen('span', 'riwayat-c c-skor', entri.skor + ' / ' + entri.total));

        // Kolom hati yang bertahan
        var hati = buatElemen('span', 'riwayat-c c-hati');
        hati.setAttribute('role', 'img');
        hati.setAttribute('aria-label', entri.hati + ' dari ' + entri.hatiTotal + ' hati');
        var ikonHati = buatElemen('span', 'hati-ikon');
        for (var i = 1; i <= entri.hatiTotal; i++) {
            var h = buatElemen('i', (i <= entri.hati ? 'fas' : 'far') + ' fa-heart');
            h.setAttribute('aria-hidden', 'true');
            ikonHati.appendChild(h);
        }
        hati.appendChild(ikonHati);
        hati.appendChild(buatElemen('span', 'hati-angka', entri.hati + '/' + entri.hatiTotal));
        li.appendChild(hati);

        // Kolom mode (+ tingkat kesulitan kecil)
        var mode = buatElemen('span', 'riwayat-c c-mode');
        mode.appendChild(buatElemen('span', 'mode-nama', namaMode(entri)));
        if (NAMA_LEVEL[entri.kesulitan]) {
            mode.appendChild(buatElemen('small', 'mode-level level-' + entri.kesulitan, NAMA_LEVEL[entri.kesulitan]));
        }
        li.appendChild(mode);

        // Kolom jumlah soal
        li.appendChild(buatElemen('span', 'riwayat-c c-soal', entri.total + ' soal'));

        li.setAttribute('aria-label', 'Peringkat ' + nomor + ': skor ' + entri.skor + ' dari ' + entri.total +
            ', ' + entri.hati + ' dari ' + entri.hatiTotal + ' hati, mode ' + namaMode(entri) + ', ' + entri.total + ' soal');
        return li;
    }

    function render() {
        var s = muat();

        $('#riwayat-label-podium').text(PODIUM_HANYA_HARD ? '3 Skor Tertinggi · Hard (permanen)' : '3 Skor Tertinggi (permanen)');

        var daftarPodium = document.getElementById('riwayat-podium');
        var daftarTerakhir = document.getElementById('riwayat-terakhir');
        if (!daftarPodium || !daftarTerakhir) {
            return;
        }
        daftarPodium.innerHTML = '';
        daftarTerakhir.innerHTML = '';

        for (var i = 0; i < JUMLAH_PODIUM; i++) {
            daftarPodium.appendChild(buatBaris(s.podium[i] || null, i + 1, true));
        }

        if (s.terakhir.length === 0) {
            daftarTerakhir.appendChild(buatElemen('li', 'riwayat-kosong riwayat-anim',
                'Belum ada permainan. Selesaikan satu permainan dulu, ya!'));
        } else {
            for (var j = 0; j < s.terakhir.length; j++) {
                daftarTerakhir.appendChild(buatBaris(s.terakhir[j], JUMLAH_PODIUM + 1 + j, false));
            }
        }

        // semua elemen animasi mulai dari keadaan tersembunyi
        $('#riwayat-section .riwayat-anim').removeClass('is-in');
    }

    function hentikanPenghitungWaktu() {
        while (penghitungWaktu.length) {
            clearTimeout(penghitungWaktu.pop());
        }
    }

    function munculkanBarisBergantian() {
        hentikanPenghitungWaktu();
        $('#riwayat-section .riwayat-anim').each(function (urutan) {
            var elemen = this;
            penghitungWaktu.push(setTimeout(function () {
                elemen.classList.add('is-in');
            }, urutan * JEDA_BARIS));
        });
    }

    /** Menu memudar -> halaman riwayat memudar masuk -> baris muncul satu per satu. */
    function buka() {
        if (sedangBerpindah || !$('#riwayat-section').length) {
            return;
        }
        sedangBerpindah = true;
        hentikanPenghitungWaktu();

        var $menu = $('#heading-section, #options-section, #information-section');
        $menu.stop(true, true).fadeOut(FADE_KELUAR);
        $menu.promise().done(function () {
            render();
            window.scrollTo(0, 0);
            $('#riwayat-section').stop(true, true).hide().removeClass('d-none').fadeIn(FADE_MASUK, function () {
                munculkanBarisBergantian();
                sedangBerpindah = false;
            });
        });
    }

    /** Halaman riwayat memudar keluar -> menu memudar masuk. */
    function tutup() {
        if (sedangBerpindah) {
            return;
        }
        sedangBerpindah = true;
        hentikanPenghitungWaktu();

        $('#riwayat-section').stop(true, true).fadeOut(FADE_KELUAR, function () {
            var $menu = $('#heading-section, #options-section, #information-section');
            $menu.stop(true, true).fadeIn(FADE_MASUK);
            $menu.promise().done(function () {
                sedangBerpindah = false;
            });
        });
    }

    // ===================== PASANG KE HALAMAN =====================
    $(function () {
        pulihkanHighScore();
        $('#btn-riwayat').on('click', buka);
        $('#btn-riwayat-home').on('click', tutup);
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $('#riwayat-section').is(':visible')) {
                tutup();
            }
        });
    });

    // Dipakai game-logic.js (fungsi global)
    window.catatRiwayatPermainan = catat;
    window.resetPencatatanRiwayat = reset;

    // Untuk pengujian
    window.RiwayatSkor = {
        catat: catat,
        reset: reset,
        muat: muat,
        render: render,
        buka: buka,
        tutup: tutup,
        _masukkan: masukkan,
        _stateKosong: stateKosong,
        _lebihBaik: lebihBaik
    };
})(window, jQuery);
