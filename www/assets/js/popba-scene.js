/* ==========================================================================
   POPBA – scene background (siang & malam)

   Yang dilakukan file ini:
   1. Membuat scene background (matahari/bulan, pelangi/aurora, awan,
      burung, bintang, gelembung simbol matematika, bank awan) di dalam
      Shadow DOM -> tidak bisa bentrok dengan CSS lain. Scene dipasang di
      dalam #wrapper (warna dasar langit ada di popba-header.css / style.css).
   2. Membaca mode siang/malam dari class body.night-mode (diatur oleh
      nightMode.js), lalu memasang atribut data-popba-theme="day|night"
      di <html>. Atribut ini juga dipakai CSS untuk menukar logo.
   3. Menyembunyikan hiasan yang mirip balon jawaban saat game berjalan.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var SCRIPT_SRC = (doc.currentScript && doc.currentScript.src) || '';

  if (doc.getElementById('popba-scene')) return; // jangan dobel

  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- util ---------- */
  function rng(seed) { // mulberry32: posisi acak tapi selalu sama
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function cssUrl() {
    if (SCRIPT_SRC) {
      try { return new URL('../css/popba-scene.css', SCRIPT_SRC).href; } catch (e) { /* lanjut */ }
    }
    return 'assets/css/popba-scene.css';
  }

  /* ---------- potongan SVG ---------- */
  var SUN_SVG =
    '<svg viewBox="140 -170 400 400" aria-hidden="true" focusable="false">' +
    '<defs><radialGradient id="sg" gradientUnits="userSpaceOnUse" cx="332" cy="32" r="200">' +
    '<stop offset="0" stop-color="#ffce2c" stop-opacity=".62"/><stop offset=".55" stop-color="#ffce2c" stop-opacity=".30"/>' +
    '<stop offset="1" stop-color="#ffce2c" stop-opacity="0"/></radialGradient></defs>' +
    '<circle cx="332" cy="32" r="200" fill="url(#sg)"/>' +
    '<path fill="#ff952c" d="M500.7-59.8c-14.1-12-34.2-8.5-50.8-12.7s-29.8-14.2-41.7-27c-25-27.3-47.1-70.1-89.9-42.5-16.4,10.5-28,27-44.5,37.8s-33.1,16-51.1,21.8c-16.3,5.3-37.7,11.1-46.8,27.3-10.6,18.8,3.3,37.2,4.6,56.3,2.6,37.5-37.9,65.9-30.2,103.8,7,34.4,59.2,37.6,81.2,60.2,27,27.7,37.4,66.5,83.7,48.7,16.8-6.4,30.7-18.7,47.8-24.4,23.1-7.8,47.2-3.8,71-6.2,54.8-5.4,45.5-63.3,52.2-104.4,4.2-25.9,11.7-50.4,19.7-75.4C512.4-16.4,519.4-43.7,500.7-59.8Z"/>' +
    '<circle fill="#ffcb4a" cx="332.4" cy="36.3" r="135.8"><animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" values="0 0 ; 0 -15 ; 0 0"/></circle>' +
    '<path fill="#ffdc82" d="M426.8-27c-19.4-43.1-64.1-63.7-109.6-58-47.7,5.8-88,34.1-100.9,82.8-6.3,23.8,5.1,47.8,22.6,63.8,8.7,8,19.2,13,28.8,19.6s16.8,16,24.2,26.1c25.7,35.3,75.5,33.7,108,8.6C441,84.2,447.2,18.3,426.8-27Z">' +
    '<animate attributeName="d" dur="4s" repeatCount="indefinite" values="M426.8-27c-19.4-43.1-64.1-63.7-109.6-58-47.7,5.8-88,34.1-100.9,82.8-6.3,23.8,5.1,47.8,22.6,63.8,8.7,8,45.6,35.6,53,45.7,25.7,35.3,75.5,33.7,108,8.6C441,84.2,447.2,18.3,426.8-27Z;M426.8-27c-19.4-43.1-64.1-63.7-109.6-58C269.5-79.2,241.9-49.7,229-1c-6.3,23.8-1.5,36,16,52,8.7,7.9,3,9,46.5,38.5,36.2,24.5,75.5,32.5,99,0C420.9,47.4,447.2,18.3,426.8-27Z;M426.8-27c-19.4-43.1-64.1-63.7-109.6-58-47.7,5.8-88,34.1-100.9,82.8-6.3,23.8,5.1,47.8,22.6,63.8,8.7,8,45.6,35.6,53,45.7,25.7,35.3,75.5,33.7,108,8.6C441,84.2,447.2,18.3,426.8-27Z"/></path>' +
    '<path fill="#ffe6a6" d="M416.5-8.3c-4.4-40-37.6-62.6-74.9-66.7-15.7-1.8-34.8-2.1-48.5,6.6C274.4-56.5,276.2-37.8,278.2-19s-5,39.8,11.6,53.4c12.8,10.5,37,19.3,52.7,23.4C385.6,69.1,421.1,34.7,416.5-8.3Z"/>' +
    '<path fill="#ffeec2" d="M375.3,23.5c-5.1,16.7-28,24.5-51,17.4s-37.7-26.3-32.5-43,27.9-24.6,51-17.5S380.4,6.7,375.3,23.5Z"/>' +
    '</svg>';

  var MOON_SVG =
    '<svg viewBox="152 -148 360 360" aria-hidden="true" focusable="false">' +
    '<defs><radialGradient id="mg" gradientUnits="userSpaceOnUse" cx="332" cy="32" r="180">' +
    '<stop offset=".5" stop-color="#c8dcff" stop-opacity=".48"/><stop offset="1" stop-color="#c8dcff" stop-opacity="0"/></radialGradient></defs>' +
    '<circle cx="332" cy="32" r="180" fill="url(#mg)"/>' +
    '<circle cx="332" cy="32" r="100" fill="#f5f5dc"/>' +
    '<circle cx="300" cy="10" r="20" fill="#e8e8c8"/><circle cx="360" cy="50" r="15" fill="#e8e8c8"/>' +
    '<circle cx="320" cy="70" r="12" fill="#e8e8c8"/><circle cx="350" cy="0" r="10" fill="#ddddc0"/>' +
    '<circle cx="290" cy="55" r="8" fill="#ddddc0"/>' +
    '</svg>';

  var RAINBOW_SVG = (function () {
    var cols = ['#FF7B9C', '#FFA75E', '#FFD95A', '#7FDDA0', '#6EC1F2', '#A99BF0'];
    var s = '<svg viewBox="0 0 600 300" aria-hidden="true" focusable="false"><g fill="none" stroke-width="22">';
    for (var i = 0; i < cols.length; i++) {
      var r = 278 - i * 22;
      s += '<path stroke="' + cols[i] + '" d="M' + (300 - r) + ' 300A' + r + ' ' + r + ' 0 0 1 ' + (300 + r) + ' 300"/>';
    }
    return s + '</g></svg>';
  })();

  var AURORA_SVG =
    '<svg viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
    '<defs>' +
    '<linearGradient id="au1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5EE6C8" stop-opacity="0"/><stop offset=".5" stop-color="#5EE6C8" stop-opacity=".75"/><stop offset="1" stop-color="#5EE6C8" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="au2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9B8CFF" stop-opacity="0"/><stop offset=".5" stop-color="#9B8CFF" stop-opacity=".7"/><stop offset="1" stop-color="#9B8CFF" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="au3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD4FF" stop-opacity="0"/><stop offset=".5" stop-color="#7FD4FF" stop-opacity=".6"/><stop offset="1" stop-color="#7FD4FF" stop-opacity="0"/></linearGradient>' +
    '</defs>' +
    '<path fill="url(#au1)" d="M0 150C180 70 360 220 600 140S1020 60 1200 150V300C1020 230 820 330 600 250S200 330 0 270Z"/>' +
    '<path fill="url(#au2)" d="M0 200C200 130 380 260 620 190S1000 120 1200 210V330C1000 270 800 350 620 290S220 350 0 320Z"/>' +
    '<path fill="url(#au3)" d="M0 100C220 40 420 150 640 90S1040 30 1200 100V210C1040 160 840 240 640 190S240 240 0 190Z"/>' +
    '</svg>';

  function cloudSvg(fill) {
    return '<svg viewBox="0 0 200 80" aria-hidden="true" focusable="false"><g fill="' + fill + '">' +
      '<circle cx="62" cy="48" r="26"/><circle cx="96" cy="36" r="32"/><circle cx="134" cy="46" r="28"/>' +
      '<rect x="38" y="48" width="122" height="26" rx="13"/></g></svg>';
  }

  function birdSvg(dur) {
    var a = 'M2 12Q10 2 20 12Q30 2 38 12';
    var b = 'M2 7Q10 14 20 12Q30 14 38 7';
    return '<svg viewBox="0 0 40 20" aria-hidden="true" focusable="false">' +
      '<path fill="none" stroke="#35557f" stroke-opacity=".75" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="' + a + '">' +
      '<animate attributeName="d" dur="' + dur + 's" repeatCount="indefinite" values="' + a + ';' + b + ';' + a + '"/></path></svg>';
  }

  function starsSvg() {
    var r = rng(20260);
    var area = Math.max(window.innerWidth || 800, 320) * Math.max(window.innerHeight || 600, 320);
    var n = Math.max(34, Math.min(80, Math.round(area / 11000)));
    var groups = ['', '', ''], i;
    for (i = 0; i < n; i++) {
      var x = (r() * 100).toFixed(1), y = (r() * 100).toFixed(1);
      var rad = (0.7 + r() * 1.5).toFixed(1);
      groups[i % 3] += '<circle cx="' + x + '%" cy="' + y + '%" r="' + rad + '"/>';
    }
    return '<svg class="stars" width="100%" height="100%" aria-hidden="true" focusable="false" fill="#fff">' +
      '<g class="tw a">' + groups[0] + '</g><g class="tw b">' + groups[1] + '</g><g class="tw c">' + groups[2] + '</g></svg>';
  }

  /* gelembung simbol matematika: x%, y%, ukuran(px), simbol, warna, tampil di HP?, [xm,ym posisi HP], detik, delay, rotasi */
  var BUBBLES = [
    [4.5, 55, 54, '+',      '#FF5FA2', 0, null,        9,    -2,   -6],
    [93,  30, 58, '\u00D7', '#4DB3F0', 0, null,        10,   -5,    7],
    [88,   9, 44, '=',      '#FFC928', 1, [88, 8.5],   8,    -1,   -5],
    [4,   70, 48, '\u00F7', '#A678F0', 0, null,        11,   -6,    6],
    [95,  64, 50, '\u2212', '#3FD69A', 0, null,        9.5,  -3,   -7],
    [31,   6, 40, '7',      '#FF9A3D', 0, null,        8.5,  -4,    6],
    [72,  10, 38, '3',      '#FF5FA2', 1, [78, 16],    10.5, -7,   -5],
    [27,  71, 46, '5',      '#FFC928', 0, null,        9,    -2.5,  5],
    [81,  72, 42, '2',      '#4DB3F0', 0, null,        10,   -8,   -6]
  ];
  function bubblesHtml() {
    var h = '';
    for (var i = 0; i < BUBBLES.length; i++) {
      var b = BUBBLES[i];
      var style = '--x:' + b[0] + '%;--y:' + b[1] + '%;--s:' + b[2] + 'px;--c:' + b[4] +
        ';--t:' + b[7] + 's;--d:' + b[8] + 's;--r:' + b[9] + 'deg;';
      if (b[6]) style += '--xm:' + b[6][0] + '%;--ym:' + b[6][1] + '%;';
      h += '<div class="mb' + (b[5] ? ' keep' : '') + '" style="' + style + '">' +
        '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
        '<circle class="halo" cx="32" cy="32" r="42"/>' +
        '<circle class="disc" cx="32" cy="32" r="29"/>' +
        '<path class="shine" d="M15 27A18 18 0 0 1 30 13"/>' +
        '<text class="glyph" x="32" y="44" text-anchor="middle">' + b[3] + '</text></svg></div>';
    }
    return h;
  }

  function fireflies() {
    var r = rng(777), h = '';
    for (var i = 0; i < 9; i++) {
      var dx = Math.round((r() - 0.5) * 90), dy = -Math.round(30 + r() * 70);
      h += '<i class="ff" style="--x:' + (6 + r() * 88).toFixed(1) + '%;--y:' + (52 + r() * 34).toFixed(1) +
        '%;--dx:' + dx + 'px;--dy:' + dy + 'px;--t:' + (9 + r() * 7).toFixed(1) + 's;--d:-' + (r() * 9).toFixed(1) + 's"></i>';
    }
    return h;
  }

  function sceneHtml() {
    return '' +
      '<div class="layer sky-day">' +
        '<div class="glow"></div>' +
        '<div class="rainbow">' + RAINBOW_SVG + '</div>' +
        '<div class="sun">' + SUN_SVG + '</div>' +
        '<div class="dc dc1">' + cloudSvg('#ffffff') + '</div>' +
        '<div class="dc dc2">' + cloudSvg('#ffffff') + '</div>' +
        '<div class="dc dc3">' + cloudSvg('#ffffff') + '</div>' +
        '<div class="birds"><div class="bird b1">' + birdSvg(0.9) + '</div><div class="bird b2">' + birdSvg(1.1) + '</div><div class="bird b3">' + birdSvg(1.3) + '</div></div>' +
        '<div class="haze"></div>' +
      '</div>' +
      '<div class="layer sky-night">' +
        '<div class="glow"></div>' +
        starsSvg() +
        '<div class="aurora">' + AURORA_SVG + '</div>' +
        '<div class="moon">' + MOON_SVG + '</div>' +
        '<div class="dc dc1">' + cloudSvg('#46546d') + '</div>' +
        '<div class="dc dc2">' + cloudSvg('#46546d') + '</div>' +
        '<div class="dc dc3">' + cloudSvg('#46546d') + '</div>' +
        '<div class="shoot"></div>' +
        fireflies() +
        '<div class="haze"></div>' +
      '</div>' +
      '<div class="layer bubbles">' + bubblesHtml() + '</div>' +
      '<div class="layer banks-day"><div class="bank back"></div><div class="bank mid"></div><div class="bank front"></div></div>' +
      '<div class="layer banks-night"><div class="bank back"></div><div class="bank mid"></div><div class="bank front"></div></div>';
  }

  /* ---------- pasang scene ---------- */
  var host = doc.createElement('div');
  host.id = 'popba-scene';
  host.setAttribute('aria-hidden', 'true');
  // gaya inti dipasang inline supaya tidak bisa dikalahkan CSS lama
  // (!important inline mengalahkan aturan seperti "#wrapper div {...}" dari CSS lama)
  host.style.cssText = [
    'display:block', 'position:fixed', 'top:0', 'right:0', 'bottom:0', 'left:0',
    'width:100%', 'height:100%', 'min-width:0', 'min-height:0', 'max-width:none', 'max-height:none',
    'z-index:-1', 'overflow:hidden', 'pointer-events:none', 'margin:0', 'padding:0', 'border:0',
    'background:none', 'transform:none', 'opacity:1', 'filter:none'
  ].join(' !important;') + ' !important;';
  host.style.setProperty('visibility', 'hidden', 'important');

  var shadow = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
  var link = doc.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl();
  var wrap = doc.createElement('div');
  wrap.innerHTML = sceneHtml();
  shadow.appendChild(link);
  while (wrap.firstChild) shadow.appendChild(wrap.firstChild);

  var mount = doc.getElementById('wrapper') || doc.body;
  mount.insertBefore(host, mount.firstChild);

  // Scene baru ditampilkan setelah CSS-nya selesai dimuat (supaya tidak berkedip tanpa gaya)
  var revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    host.style.setProperty('visibility', 'visible', 'important');
    if (REDUCE) {
      var svgs = shadow.querySelectorAll('svg');
      for (var i = 0; i < svgs.length; i++) if (svgs[i].pauseAnimations) svgs[i].pauseAnimations();
    }
  }
  link.addEventListener('load', reveal);
  link.addEventListener('error', reveal);
  setTimeout(reveal, 1500);

  /* ---------- deteksi siang / malam ---------- */
  function isNight() {
    return !!doc.body && doc.body.classList.contains('night-mode'); // diatur oleh nightMode.js
  }
  function isGame() {
    var g = doc.getElementById('game-section');
    return !!g && !g.classList.contains('d-none') && window.getComputedStyle(g).display !== 'none';
  }

  var lastTheme = '', lastView = '';
  function sync() {
    var theme = isNight() ? 'night' : 'day';
    if (theme !== lastTheme) {
      lastTheme = theme;
      host.setAttribute('data-theme', theme);
      root.setAttribute('data-popba-theme', theme);
    }
    var view = isGame() ? 'game' : 'menu';
    if (view !== lastView) {
      lastView = view;
      host.setAttribute('data-view', view);
    }
  }

  function watch() {
    sync();
    var opts = { attributes: true, attributeFilter: ['style', 'class', 'checked', 'data-theme'] };
    if (window.MutationObserver) {
      var mo = new MutationObserver(sync);
      var gameEl = doc.getElementById('game-section');
      if (gameEl) mo.observe(gameEl, opts);
      mo.observe(doc.body, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
      mo.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    }
    ['day-mode', 'night-mode', 'btn-game-section-home', 'play'].forEach(function (id) {
      var el = doc.getElementById(id);
      if (el) el.addEventListener('click', function () { setTimeout(sync, 30); setTimeout(sync, 400); });
    });
    setInterval(sync, 800); // jaring pengaman ringan
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', watch); else watch();
})();