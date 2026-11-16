/**
 * @fileOverview Tutorial interaktif "Bagaimana Cara Bermain?" untuk Pop Balon Ajaib (PopBA).
 *
 * Cara kerja singkat:
 *  - Layar digelapkan, hanya tombol sasaran yang "bolong" (bisa disentuh) dan dilingkari emas.
 *  - Tangan penunjuk menunjuk tombol sasaran, kartu penjelasan muncul di dekatnya.
 *  - Langkah "action": user harus mengetuk tombol yang ditunjuk (tombolnya benar-benar bekerja,
 *    jadi mode malam / siang / Operasi / Pilihan / PLAY betul-betul berjalan).
 *  - Langkah "info": tombol dilingkari + dijelaskan, user menekan "Lanjut".
 *  - Langkah terakhir mengetuk PLAY, game dimulai, tutorial berhenti.
 *
 * Dipanggil dari display.js lewat window.PopbaTutorial.start().
 *
 * Posisi tangan/kartu dihitung ulang setiap frame dari posisi tombol asli, jadi tetap pas saat
 * layar diputar, ukuran jendela berubah, halaman bergulir, atau panel Pilihan membuka.
 */
/*jshint esversion: 6 */
/* globals $ */

(function () {
    'use strict';

    // ====================================================================
    // Pengaturan
    // ====================================================================
    var HAND_SRC = 'assets/images/tutorial-hand.png';
    var HAND_RATIO = 172 / 256;   // tinggi / lebar gambar tangan
    var TIP_Y = 0.392;            // posisi ujung jari dari atas gambar (0-1); gambar menunjuk ke kiri
    var TIP_INSET = 8;            // ujung jari menembus tepi tombol sejauh ini (px)
    var PAD = 6;                  // jarak lingkaran emas dari tepi tombol (px)
    var MARGIN = 12;              // jarak minimal kartu dari tepi layar (px)
    var GAP = 14;                 // jarak kartu dari tombol / tangan (px)
    var MOVE_MS = 700;            // lama animasi pindah antar sasaran
    var SWAP_MS = 150;            // lama kartu memudar saat ganti isi

    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // ====================================================================
    // Langkah-langkah
    //   type 'intro'  : kartu di tengah, tanpa sasaran
    //   type 'action' : user harus mengetuk target (tombol asli ikut bekerja)
    //   type 'info'   : target dilingkari dan dijelaskan, lanjut dengan tombol "Lanjut"
    // ====================================================================
    function byId(id) {
        return function () { return document.getElementById(id); };
    }

    function panelIsOpen() {
        var p = document.getElementById('options');
        return !!p && p.classList.contains('show');
    }

    // Tunggu panel Pilihan selesai terbuka (event Bootstrap), dengan cadangan waktu.
    function waitPanelOpen(go) {
        var finished = false;
        function once() {
            if (finished) { return; }
            finished = true;
            if (window.jQuery) { window.jQuery('#options').off('shown.bs.collapse.popbaTut'); }
            setTimeout(go, 250);
        }
        if (window.jQuery) { window.jQuery('#options').one('shown.bs.collapse.popbaTut', once); }
        setTimeout(once, 1100);
    }

    var STEPS = [
        {
            key: 'welcome', type: 'intro',
            title: 'Halo, Pemain Baru! 👋',
            text: 'Yuk kenalan dengan Pop Balon Ajaib. Ikuti jari yang menunjuk, ya. Hanya sebentar kok!',
            nextLabel: 'Mulai'
        },
        {
            key: 'night', type: 'action', target: byId('night-mode'), delay: 900,
            title: 'Mode Malam 🌙',
            text: 'Ketuk tombol bulan untuk mengubah tampilan menjadi malam. Layar jadi lebih gelap dan nyaman dilihat saat cahaya redup.'
        },
        {
            key: 'day', type: 'action', target: byId('day-mode'), delay: 900,
            title: 'Mode Siang ☀️',
            text: 'Sekarang ketuk tombol matahari untuk kembali ke tampilan siang yang cerah.'
        },
        {
            key: 'mode', type: 'action', target: byId('operator'), delay: 800,
            title: 'Pilih Jenis Soal 🧮',
            text: 'Ada banyak jenis soal: Aljabar, Waktu, Massa, Volume, Bangunan, dan Operasi. Kita coba Operasi dulu. Ketuk tombolnya!'
        },
        {
            key: 'pilihan', type: 'action', opensPanel: true,
            target: function () { return document.querySelector('button[data-target="#options"]'); },
            skipIf: panelIsOpen, after: waitPanelOpen,
            title: 'Tombol Pilihan ⚙️',
            text: 'Di sinilah kamu mengatur permainanmu: jumlah soal, tingkat kesulitan, dan jenis hitungan. Ketuk Pilihan untuk membukanya!'
        },
        {
            key: 'q10', type: 'info', target: byId('10q'),
            title: '10 Soal',
            text: 'Pilih ini untuk permainan singkat dengan 10 soal.'
        },
        {
            key: 'q20', type: 'info', target: byId('20q'),
            title: '20 Soal',
            text: 'Pilih ini kalau kamu mau bermain lebih lama dengan 20 soal.'
        },
        {
            key: 'easy', type: 'info', target: byId('easy'),
            title: 'Easy (Mudah) 🌱',
            text: 'Soal yang paling gampang. Cocok untuk pemanasan dan pemain baru.'
        },
        {
            key: 'medium', type: 'info', target: byId('medium'),
            title: 'Medium (Sedang) 🌿',
            text: 'Soal tingkat sedang. Pilih ini kalau kamu sudah mulai lancar.'
        },
        {
            key: 'hard', type: 'info', target: byId('hard'),
            title: 'Hard (Sulit) 🔥',
            text: 'Soal yang paling menantang! Skor terbaik di level Hard tercatat di daftar High Score.'
        },
        {
            key: 'kurang', type: 'info', target: byId('btn-operator-1'),
            title: 'Kurang ➖',
            text: 'Di mode Operasi kamu memilih satu jenis hitungan. Ini untuk soal pengurangan, contohnya 9 − 4.'
        },
        {
            key: 'tambah', type: 'info', target: byId('btn-operator-2'),
            title: 'Tambah ➕',
            text: 'Soal penjumlahan, contohnya 5 + 3.'
        },
        {
            key: 'bagi', type: 'info', target: byId('btn-operator-3'),
            title: 'Bagi ➗',
            text: 'Soal pembagian, contohnya 12 ÷ 3.'
        },
        {
            key: 'kali', type: 'info', target: byId('btn-operator-4'),
            title: 'Kali ✖️',
            text: 'Soal perkalian, contohnya 4 × 6.'
        },
        {
            key: 'play', type: 'action', target: byId('play'), final: true,
            title: 'Saatnya Bermain! 🎈',
            text: 'Semua sudah siap. Ketuk PLAY, lalu ketuk balon yang berisi jawaban yang benar untuk memecahkannya!',
            hint: 'Ketuk PLAY untuk mulai ✨'
        }
    ];

    // ====================================================================
    // Status (null = tutorial tidak berjalan)
    // ====================================================================
    var state = null;

    // ====================================================================
    // Pembantu umum
    // ====================================================================
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function r1(n) { return Math.round(n * 10) / 10; }

    function isVisible(el) {
        if (!el) { return false; }
        var r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }

    /** Timer yang otomatis batal bila langkah sudah berganti atau tutorial berhenti. */
    function later(fn, ms) {
        var st = state;
        if (!st) { return 0; }
        var token = st.token;
        var id = setTimeout(function () {
            if (state === st && st.token === token) { fn(); }
        }, ms);
        st.timers.push(id);
        return id;
    }

    /** Timer yang hanya batal bila tutorial berhenti. */
    function always(fn, ms) {
        var st = state;
        if (!st) { return 0; }
        var id = setTimeout(function () {
            if (state === st) { fn(); }
        }, ms);
        st.timers.push(id);
        return id;
    }

    /** Tulis posisi/ukuran elemen hanya bila berubah (hemat kerja browser tiap frame). */
    function setBox(el, l, t, w, h) {
        var key = r1(l) + ',' + r1(t) + ',' + r1(w) + ',' + r1(h);
        if (el.__popbaKey === key) { return; }
        el.__popbaKey = key;
        var s = el.style;
        s.left = r1(l) + 'px';
        s.top = r1(t) + 'px';
        s.width = r1(w) + 'px';
        s.height = r1(h) + 'px';
    }

    function setPos(el, l, t) {
        var key = r1(l) + ',' + r1(t);
        if (el.__popbaKey === key) { return; }
        el.__popbaKey = key;
        el.style.left = r1(l) + 'px';
        el.style.top = r1(t) + 'px';
    }

    function handSize(vw, vh) {
        return Math.round(clamp(Math.min(vw, vh) * 0.13, 52, 76));
    }

    // ====================================================================
    // Geometri tangan
    //   side = di sisi mana tangan berada terhadap tombol:
    //   right (menunjuk kiri), left (menunjuk kanan), below (menunjuk atas), above (menunjuk bawah)
    // ====================================================================
    function contactPoint(side, r) {
        var cx = (r.left + r.right) / 2;
        var cy = (r.top + r.bottom) / 2;
        if (side === 'right') { return { x: r.right - TIP_INSET, y: cy }; }
        if (side === 'left') { return { x: r.left + TIP_INSET, y: cy }; }
        if (side === 'below') { return { x: cx, y: r.bottom - TIP_INSET }; }
        return { x: cx, y: r.top + TIP_INSET };
    }

    function handBox(side, p, hs, hh) {
        var f = TIP_Y;
        if (side === 'right') { return { l: p.x, t: p.y - f * hh, r: p.x + hs, b: p.y + (1 - f) * hh }; }
        if (side === 'left') { return { l: p.x - hs, t: p.y - f * hh, r: p.x, b: p.y + (1 - f) * hh }; }
        if (side === 'below') { return { l: p.x - (1 - f) * hh, t: p.y, r: p.x + f * hh, b: p.y + hs }; }
        return { l: p.x - f * hh, t: p.y - hs, r: p.x + (1 - f) * hh, b: p.y };
    }

    // ====================================================================
    // Membangun elemen
    // ====================================================================
    function build() {
        var root = document.createElement('div');
        root.className = 'popba-tut is-entering is-empty';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', 'Tutorial cara bermain');
        root.setAttribute('data-type', 'intro');
        root.innerHTML =
            '<div class="popba-tut__block"></div>' +
            '<div class="popba-tut__block"></div>' +
            '<div class="popba-tut__block"></div>' +
            '<div class="popba-tut__block"></div>' +
            '<div class="popba-tut__ring"></div>' +
            '<div class="popba-tut__hand is-hidden no-trans" aria-hidden="true">' +
            '<img class="popba-tut__hand-img" src="' + HAND_SRC + '" alt="" draggable="false">' +
            '</div>' +
            '<div class="popba-tut__card">' +
            '<div class="popba-tut__top">' +
            '<span class="popba-tut__bar"><span class="popba-tut__bar-fill"></span></span>' +
            '<span class="popba-tut__count"></span>' +
            '</div>' +
            '<div class="popba-tut__content" aria-live="polite">' +
            '<h2 class="popba-tut__title"></h2>' +
            '<p class="popba-tut__text"></p>' +
            '<div class="popba-tut__actions">' +
            '<span class="popba-tut__hint"></span>' +
            '<button type="button" class="popba-tut__skip">Lewati</button>' +
            '<button type="button" class="popba-tut__next">Lanjut</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        document.body.appendChild(root);
        return root;
    }

    // ====================================================================
    // Start / stop
    // ====================================================================
    function start() {
        if (state) { return; }

        var root = build();
        var q = function (sel) { return root.querySelector(sel); };
        var st = {
            root: root,
            els: {
                blocks: Array.prototype.slice.call(root.querySelectorAll('.popba-tut__block')),
                ring: q('.popba-tut__ring'),
                hand: q('.popba-tut__hand'),
                card: q('.popba-tut__card'),
                content: q('.popba-tut__content'),
                title: q('.popba-tut__title'),
                text: q('.popba-tut__text'),
                hint: q('.popba-tut__hint'),
                count: q('.popba-tut__count'),
                bar: q('.popba-tut__bar-fill'),
                skip: q('.popba-tut__skip'),
                next: q('.popba-tut__next')
            },
            idx: -1,
            token: 0,
            target: null,
            plan: null,
            done: false,
            rendered: false,
            handSide: null,
            handSwap: false,
            hs: 0,
            vw: 0,
            vh: 0,
            lockUntil: 0,
            rafId: 0,
            moveTimer: 0,
            nudgeTimer: 0,
            timers: [],
            stepCleanup: [],
            wasNight: document.body.classList.contains('night-mode'),
            openedPanel: false,
            spacer: null,
            onKey: null
        };
        state = st;

        // Pastikan panel Pilihan tertutup supaya langkah "ketuk Pilihan" masuk akal.
        if (window.jQuery) {
            var $opt = window.jQuery('#options');
            if ($opt.hasClass('show')) { $opt.collapse('hide'); }
        }

        // Sentuhan di luar tombol sasaran: goyang tangan + kartu sebagai pengingat.
        st.els.blocks.forEach(function (b) { b.addEventListener('click', nudge); });
        st.els.ring.addEventListener('click', nudge);

        // Cegah halaman bergulir oleh user selama tutorial (gulir otomatis tetap jalan).
        function preventScroll(e) {
            if (e.target && e.target.closest && e.target.closest('.popba-tut__card')) { return; }
            e.preventDefault();
        }
        root.addEventListener('wheel', preventScroll, { passive: false });
        root.addEventListener('touchmove', preventScroll, { passive: false });

        st.els.skip.addEventListener('click', function () { stop('skip'); });
        st.els.next.addEventListener('click', function () {
            var step = STEPS[st.idx];
            if (!step || step.type === 'action' || Date.now() < st.lockUntil) { return; }
            goTo(st.idx + 1);
        });

        st.onKey = function (e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                e.preventDefault();
                stop('skip');
                return;
            }
            var ae = document.activeElement;
            var inCard = !!(ae && ae.tagName === 'BUTTON' && root.contains(ae));
            var step = STEPS[st.idx];
            if (!inCard && step && step.type !== 'action' &&
                (e.key === 'Enter' || e.key === 'ArrowRight') && Date.now() >= st.lockUntil) {
                e.preventDefault();
                goTo(st.idx + 1);
            }
        };
        document.addEventListener('keydown', st.onKey, true);

        layout();
        frame();
        always(function () { st.root.classList.remove('is-entering'); }, 700);
        goTo(0);
    }

    function stop(reason) {
        var st = state;
        if (!st) { return; }
        state = null;

        cancelAnimationFrame(st.rafId);
        st.timers.forEach(function (id) { clearTimeout(id); });
        clearTimeout(st.moveTimer);
        clearTimeout(st.nudgeTimer);
        runStepCleanup(st);
        document.removeEventListener('keydown', st.onKey, true);
        if (st.spacer && st.spacer.parentNode) { st.spacer.parentNode.removeChild(st.spacer); }

        st.root.classList.add('is-leaving');
        setTimeout(function () {
            if (st.root.parentNode) { st.root.parentNode.removeChild(st.root); }
        }, 350);

        // Kalau dilewati di tengah jalan, kembalikan tampilan seperti semula.
        if (reason === 'skip') {
            var isNight = document.body.classList.contains('night-mode');
            if (isNight !== st.wasNight) {
                var btn = document.getElementById(st.wasNight ? 'night-mode' : 'day-mode');
                if (btn) { btn.click(); }
            }
            if (st.openedPanel && window.jQuery) { window.jQuery('#options').collapse('hide'); }
        }
    }

    function runStepCleanup(st) {
        st.stepCleanup.forEach(function (fn) { fn(); });
        st.stepCleanup = [];
    }

    // ====================================================================
    // Pindah langkah
    // ====================================================================
    function goTo(i) {
        var st = state;
        if (!st) { return; }
        runStepCleanup(st);

        if (i >= STEPS.length) { stop('done'); return; }
        var step = STEPS[i];
        if (step.skipIf && step.skipIf()) { goTo(i + 1); return; }

        st.idx = i;
        st.token += 1;
        st.lockUntil = Date.now() + 350;
        var token = st.token;

        // Animasi pindah halus selama MOVE_MS
        st.root.classList.add('is-moving');
        clearTimeout(st.moveTimer);
        st.moveTimer = setTimeout(function () {
            if (state === st) { st.root.classList.remove('is-moving'); }
        }, MOVE_MS);

        // Kartu: memudar, ganti isi, muncul lagi
        var first = !st.rendered;
        st.els.content.classList.add('is-swap');
        later(function () {
            renderStep(step, i);
            st.rendered = true;
            st.els.content.classList.remove('is-swap');
            resolveTarget(step, token);
        }, first ? 0 : SWAP_MS);
    }

    function renderStep(step, i) {
        var st = state;
        var e = st.els;
        e.title.textContent = step.title;
        e.text.textContent = step.text;
        e.count.textContent = (i + 1) + ' / ' + STEPS.length;
        e.bar.style.width = Math.round(((i + 1) / STEPS.length) * 100) + '%';
        e.next.textContent = step.nextLabel || 'Lanjut';
        e.hint.textContent = step.type === 'action' ? (step.hint || 'Ketuk tombol yang ditunjuk ✨') : '';
        st.root.setAttribute('data-type', step.type);
    }

    /** Cari tombol sasaran (tunggu sebentar bila belum tampil), lalu rencanakan tata letak. */
    function resolveTarget(step, token) {
        var st = state;
        var tries = 0;

        function apply(el) {
            st.target = el;
            st.done = false;
            st.root.classList.remove('is-done');
            st.root.classList.toggle('is-empty', !el);
            if (!el) { st.plan = null; return; }

            planStep(true);
            if (step.type === 'action') { bindAction(step, el, token); }
            // Setelah gulir selesai, hitung ulang sisi tangan/kartu tanpa menggulir lagi.
            later(function () { planStep(false); }, MOVE_MS - 100);
        }

        if (!step.target) { apply(null); } else { poll(); }

        function poll() {
            if (state !== st || st.token !== token) { return; }
            var el = step.target();
            if (isVisible(el)) { apply(el); return; }
            tries += 1;
            if (tries > 30) { goTo(st.idx + 1); return; }   // tombol tidak ada: lewati langkah ini
            setTimeout(poll, 50);
        }

        if (step.type !== 'action') {
            // Fokus ke tombol Lanjut supaya Enter / Spasi langsung bekerja
            try { st.els.next.focus({ preventScroll: true }); } catch (err) { /* abaikan */ }
        }
    }

    // ====================================================================
    // Langkah "action": tunggu user mengetuk tombol yang ditunjuk
    // ====================================================================
    function bindAction(step, el, token) {
        var st = state;
        var fired = false;

        function proceed() {
            if (state === st && st.token === token) { goTo(st.idx + 1); }
        }

        function onHit() {
            if (fired || state !== st || st.token !== token) { return; }
            fired = true;           // <label> menembakkan klik dua kali; yang kedua diabaikan
            st.done = true;
            st.root.classList.add('is-done');
            st.els.hint.textContent = 'Bagus sekali! 🎉';
            if (step.opensPanel) { st.openedPanel = true; }

            if (step.final) {
                later(function () { stop('done'); }, 150);
            } else if (step.after) {
                step.after(proceed);
            } else {
                later(proceed, step.delay || 700);
            }
        }

        el.addEventListener('click', onHit);
        st.stepCleanup.push(function () {
            el.removeEventListener('click', onHit);
            if (window.jQuery) { window.jQuery('#options').off('shown.bs.collapse.popbaTut'); }
        });
    }

    function nudge() {
        var st = state;
        if (!st) { return; }
        st.root.classList.remove('is-nudge');
        void st.root.offsetWidth;
        st.root.classList.add('is-nudge');
        clearTimeout(st.nudgeTimer);
        st.nudgeTimer = setTimeout(function () {
            if (state === st) { st.root.classList.remove('is-nudge'); }
        }, 600);
    }

    /** Tambah ruang kosong di bawah halaman (dibuang saat tutorial berhenti). */
    function addScrollRoom(st, extra) {
        if (!st.spacer) {
            st.spacer = document.createElement('div');
            st.spacer.setAttribute('aria-hidden', 'true');
            st.spacer.style.cssText = 'width:1px;height:0;pointer-events:none;';
            document.body.appendChild(st.spacer);
        }
        st.spacer.style.height = (parseFloat(st.spacer.style.height) || 0) + Math.ceil(extra) + 'px';
    }

    // ====================================================================
    // Rencana tata letak: sisi tangan, sisi kartu, dan gulir halaman bila perlu
    // ====================================================================
    function planStep(allowScroll) {
        var st = state;
        if (!st || !st.target) { return; }

        var vw = st.root.clientWidth;
        var vh = st.root.clientHeight;
        st.vw = vw;
        st.vh = vh;

        var r = st.target.getBoundingClientRect();
        var hs = handSize(vw, vh);
        var hh = hs * HAND_RATIO;
        var ch = st.els.card.offsetHeight;
        var need = ch + GAP;
        var T = { top: r.top - PAD, bottom: r.bottom + PAD };

        var sides = ['right', 'left', 'below', 'above'];
        var best = null;
        var fallback = null;

        for (var i = 0; i < sides.length; i++) {
            var side = sides[i];
            var hb = handBox(side, contactPoint(side, r), hs, hh);
            if (hb.l < 2 || hb.r > vw - 2) { continue; }                  // tidak muat melebar
            var U = { top: Math.min(T.top, hb.t), bottom: Math.max(T.bottom, hb.b) };
            if (!fallback) { fallback = { side: side, U: U }; }
            if (hb.t < 2 || hb.b > vh - 2) { continue; }                  // tidak muat meninggi
            if (vh - U.bottom - MARGIN >= need) { best = { side: side, card: 'below' }; break; }
            if (U.top - MARGIN >= need) { best = { side: side, card: 'above' }; break; }
        }

        if (best) { st.plan = best; return; }

        if (!fallback) { fallback = { side: 'below', U: T }; }

        if (allowScroll) {
            // Gulir halaman supaya (tombol + tangan + kartu) berada di tengah layar.
            var total = (fallback.U.bottom - fallback.U.top) + GAP + ch;
            var desiredTop = Math.max(MARGIN, (vh - total) / 2);
            var delta = fallback.U.top - desiredTop;
            if (Math.abs(delta) > 1) {
                if (delta > 0) {
                    // Halaman sudah mentok di bawah? Beri ruang kosong sementara supaya bisa digulir lebih jauh.
                    var room = document.documentElement.scrollHeight - (window.pageYOffset + window.innerHeight);
                    if (room < delta) { addScrollRoom(st, delta - room + 4); }
                }
                try {
                    window.scrollBy({ top: delta, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
                } catch (err) {
                    window.scrollBy(0, delta);
                }
            }
            st.plan = { side: fallback.side, card: 'below' };
        } else {
            st.plan = {
                side: fallback.side,
                card: (vh - fallback.U.bottom) >= fallback.U.top ? 'below' : 'above'
            };
        }
    }

    // ====================================================================
    // Tata letak per frame (mengikuti posisi tombol asli)
    // ====================================================================
    function frame() {
        var st = state;
        if (!st) { return; }
        layout();
        st.rafId = requestAnimationFrame(frame);
    }

    function layout() {
        var st = state;
        if (!st) { return; }
        var e = st.els;
        var vw = st.root.clientWidth;
        var vh = st.root.clientHeight;

        var hs = handSize(vw, vh);
        if (st.hs !== hs) {
            st.hs = hs;
            st.root.style.setProperty('--hs', hs + 'px');
        }
        if (st.target && (st.vw !== vw || st.vh !== vh)) { planStep(false); }

        var cw = e.card.offsetWidth;
        var ch = e.card.offsetHeight;
        var hole;
        var r = null;

        if (st.target) {
            if (!isVisible(st.target)) { return; }   // tombol sedang tidak tampil: pertahankan posisi terakhir
            r = st.target.getBoundingClientRect();
            hole = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
            setBox(e.ring, r.left - PAD, r.top - PAD, r.width + PAD * 2, r.height + PAD * 2);
        } else {
            hole = { left: vw / 2, top: vh / 2, right: vw / 2, bottom: vh / 2 };
            setBox(e.ring, vw / 2, vh / 2, 0, 0);
        }

        // 4 panel penahan sentuhan mengelilingi lubang
        var holeH = Math.max(0, hole.bottom - hole.top);
        setBox(e.blocks[0], 0, 0, vw, Math.max(0, hole.top));
        setBox(e.blocks[1], hole.right, hole.top, Math.max(0, vw - hole.right), holeH);
        setBox(e.blocks[2], 0, hole.bottom, vw, Math.max(0, vh - hole.bottom));
        setBox(e.blocks[3], 0, hole.top, Math.max(0, hole.left), holeH);

        // Kartu + tangan
        var cardLeft;
        var cardTop;
        var handVisible = false;

        if (st.target && st.plan && r) {
            var plan = st.plan;
            var hh = hs * HAND_RATIO;
            var p = contactPoint(plan.side, r);
            var hb = handBox(plan.side, p, hs, hh);
            var uTop = Math.min(r.top - PAD, hb.t);
            var uBottom = Math.max(r.bottom + PAD, hb.b);

            cardLeft = clamp((r.left + r.right) / 2 - cw / 2, MARGIN, vw - cw - MARGIN);
            cardTop = plan.card === 'below' ? uBottom + GAP : uTop - GAP - ch;
            cardTop = clamp(cardTop, MARGIN, vh - ch - MARGIN);

            setHandSide(plan.side);
            setPos(e.hand, p.x, p.y - TIP_Y * hh);
            handVisible = true;
        } else {
            cardLeft = (vw - cw) / 2;
            cardTop = (vh - ch) / 2;
        }

        setPos(e.card, cardLeft, cardTop);
        e.hand.classList.toggle('is-hidden', !handVisible || st.done || st.handSwap);
    }

    /** Ganti sisi tangan tanpa animasi putar: sembunyikan, ganti arah, lalu munculkan lagi. */
    function setHandSide(side) {
        var st = state;
        if (st.handSide === side) { return; }
        var h = st.els.hand;
        st.handSide = side;
        st.handSwap = true;
        h.classList.add('no-trans', 'is-hidden');
        h.classList.remove('side-right', 'side-left', 'side-below', 'side-above');
        h.classList.add('side-' + side);
        h.__popbaKey = '';   // paksa posisi ditulis ulang
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                if (state !== st) { return; }
                h.classList.remove('no-trans');
                st.handSwap = false;
            });
        });
    }

    // ====================================================================
    // API publik
    // ====================================================================
    window.PopbaTutorial = {
        start: start,
        stop: function () { stop('skip'); },
        isActive: function () { return !!state; }
    };
}());
