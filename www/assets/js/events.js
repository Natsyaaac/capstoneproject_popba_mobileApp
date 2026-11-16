/**
* @fileOverview JavaScript Event Handler Library.
* @author <a href="https://github.com/richardhenyash">Richard Ash</a>
* @version 1.1.1
*/
/*jshint esversion: 6 */
/* globals $, initialiseBalloons, returnBtnIdArray, makeNotActive, checkSelectedAnswer, returnToMenu */
/* globals modeAljabar, modeTime, modeHeavy, modeVolume, modeUp, modeOperator, modeExam */
/* globals muteAudio, unMuteAudio, muteAudioToggle */

// Initialisation Event Handlers //

// Hide in game score
$("#score").hide();
// Hide game canvas and controls.
$("#game-canvas-controls").hide();

// Show game loader until 1000ms after window has completed loading.
// Display balloon animation frame 1 in each canvas element
// Fade-in game score, game canvas and controls 1000ms after window has completed loading //
$(window).on("load", function () {
    // Display balloon animation frame 1 in each canvas element
    initialiseBalloons();
    // Set timeout
    setTimeout(function () {
        // Hide game loader
        $("#game-loader").hide();
        // Fade-in score
        $("#score").removeClass("d-none");
        $("#score").fadeIn(1000);
        // Fade-in game canvas and controls
        $("#game-canvas-controls").removeClass("d-none");
        $("#game-canvas-controls").fadeIn(1000);
    }, 1000);
});

// Options Event Handlers //

// On click event added to each game mode button to switch to that mode's option panel //
$("#aljabar").on("click", modeAljabar);
$("#time").on("click", modeTime);
$("#heavy").on("click", modeHeavy);
$("#volume").on("click", modeVolume);
$("#up").on("click", modeUp);
$("#operator").on("click", modeOperator);
$("#exam").on("click", modeExam);

// Toggle behaviour for the options buttons of each mode: only one option button can be active at a time //

$(".btn-aljabar-toggle").click(function () {
    let btnId = "#" + ($(this)[0].id);
    let btnIdArray = returnBtnIdArray("btn-aljabar");
    let i = btnIdArray.indexOf(btnId);
    if (i > -1) {
        btnIdArray.splice(i, 1);
    }
    makeNotActive(btnIdArray);
    if ($(this).hasClass("active")) {
        $(this).button('toggle');
    }
});


$(".btn-time-toggle").click(function () {
    // Ambil ID tombol yang diklik
    let btnId = "#" + ($(this)[0].id);

    // Ambil semua ID tombol dalam grup "btn-measurement"
    let btnIdArray = returnBtnIdArray("btn-time");

    // Hapus tombol yang diklik dari daftar agar tidak dimatikan
    let i = btnIdArray.indexOf(btnId);
    if (i > -1) {
        btnIdArray.splice(i, 1);
    }

    // Nonaktifkan semua tombol lain di grup ini
    makeNotActive(btnIdArray);

    // Jika tombol ini aktif, toggle kembali (mati)
    if ($(this).hasClass("active")) {
        $(this).button('toggle');
    }
});


$(".btn-heavy-toggle").click(function () {
    // Ambil ID tombol yang diklik
    let btnId = "#" + ($(this)[0].id);

    // Ambil semua ID tombol dalam grup "btn-heavy"
    let btnIdArray = returnBtnIdArray("btn-heavy");

    // Hapus tombol yang diklik dari daftar agar tidak dimatikan
    let i = btnIdArray.indexOf(btnId);
    if (i > -1) {
        btnIdArray.splice(i, 1);
    }

    // Nonaktifkan semua tombol lain di grup ini
    makeNotActive(btnIdArray);

    // Jika tombol ini aktif, toggle kembali (mati)
    if ($(this).hasClass("active")) {
        $(this).button('toggle');
    }
});

$(".btn-volume-toggle").click(function () {
    // Ambil ID tombol yang diklik
    let btnId = "#" + ($(this)[0].id);

    // Ambil semua ID tombol dalam grup "btn-volume"
    let btnIdArray = returnBtnIdArray("btn-volume");

    // Hapus tombol yang diklik dari daftar agar tidak dimatikan
    let i = btnIdArray.indexOf(btnId);
    if (i > -1) {
        btnIdArray.splice(i, 1);
    }

    // Nonaktifkan semua tombol lain di grup ini
    makeNotActive(btnIdArray);

    // Jika tombol ini aktif, toggle kembali (mati)
    if ($(this).hasClass("active")) {
        $(this).button('toggle');
    }
});

$(".btn-up-toggle").click(function () {
    // Ambil ID tombol yang diklik
    let btnId = "#" + ($(this)[0].id);

    // Ambil semua ID tombol dalam grup "btn-up"
    let btnIdArray = returnBtnIdArray("btn-up");

    // Hapus tombol yang diklik dari daftar agar tidak dimatikan
    let i = btnIdArray.indexOf(btnId);
    if (i > -1) {
        btnIdArray.splice(i, 1);
    }

    // Nonaktifkan semua tombol lain di grup ini
    makeNotActive(btnIdArray);

    // Jika tombol ini aktif, toggle kembali (mati)
    if ($(this).hasClass("active")) {
        $(this).button('toggle');
    }
});


$(".btn-operator-toggle").click(function () {
    // Ambil ID tombol yang diklik
    let btnId = "#" + ($(this)[0].id);
    let btnIdArray = returnBtnIdArray("btn-operator");
    let i = btnIdArray.indexOf(btnId);
    if (i > -1) {
        btnIdArray.splice(i, 1);
    }
    makeNotActive(btnIdArray);
    if ($(this).hasClass("active")) {
        $(this).button('toggle');
    }
});

$(".btn-exam-toggle").click(function() {
    let btnId = "#" + ($(this)[0].id);
    let btnIdArray = returnBtnIdArray("btn-exam");
    let i = btnIdArray.indexOf(btnId);
    if (i > -1) {
        btnIdArray.splice(i, 1);
    }
    makeNotActive(btnIdArray);
    if ($(this).hasClass("active")) {
        $(this).button('toggle');
    }
    
});

// Game Event Handlers //
// On click event added to balloon answer text divs to check the selected answer using checkSelectedAnswer function //
$("#balloon-answer-text-left-1").on("click", checkSelectedAnswer);
$("#balloon-answer-text-left-2").on("click", checkSelectedAnswer);
$("#balloon-answer-text-left-3").on("click", checkSelectedAnswer);
$("#balloon-answer-text-right-1").on("click", checkSelectedAnswer);
$("#balloon-answer-text-right-2").on("click", checkSelectedAnswer);
$("#balloon-answer-text-right-3").on("click", checkSelectedAnswer);

// On click event added to game mode home button to hide game section and show heading and options sections //
$("#btn-game-section-home").on("click", returnToMenu);

// On click event added to options audio off button to mute audio //
$("#audio-off").on("click", muteAudio);

// On click event added to options audio on button to un-mute audio //
$("#audio-on").on("click", unMuteAudio);

// On click event added to in-game mute button to toggle audio mute //
$("#mute").on("click", muteAudioToggle);