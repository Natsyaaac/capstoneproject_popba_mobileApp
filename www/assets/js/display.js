/**
* @fileOverview JavaScript Display Interaction Function Library.
* @author <a href="https://github.com/richardhenyash">Richard Ash</a>
* @version 1.1.1
*/
/*jshint esversion: 6 */
/* globals $ */

/**
* [Function to return to menu - hides game section and shows heading and options]
*/
function returnToMenu() {
    // Hide game section
    $("#game-section").hide(400);
    // Show heading section 
    $("#heading-section").show(400);
    // Show options section 
    $("#options-section").show(400);
    // Show information section 
    $("#information-section").show(400);
}

function modeAljabar() {
    // Sembunyikan semua opsi lain
    $("#options-add-time").hide(400);
    $("#options-add-operator").hide(400);
    $("#options-add-exam").hide(400);
    $("#options-add-subtract").hide(400);
    $("#options-multiply-divide").hide(400);
    $("#options-add-heavy").hide(400);
    // Tampilkan opsi untuk Aljabar
    $("#options-add-aljabar").show(400);
    $("#options-add-up").hide(400);
    $("#options-add-volume").hide(400);

    $("#hard").show(400);
    $("#medium").show(400);
    $("#easy").show(400);
    $("#20q").show(400);
    $("#10q").show(400);

    // Aktifkan tombol pertama
    makeActive("#btn-aljabar-1");

    // Isi teks tombol dengan pilihan Aljabar
    $("#btn-aljabar-1").html("Isi Kotak Kosong");
    $("#btn-aljabar-2").html("Nilai Variabel");
    $("#btn-aljabar-3").html("Persamaan Sederhana");
    $("#btn-aljabar-4").html("Pola Bilangan");
}


function modeTime() {
    $("#options-add-time").show(400);
    $("#options-add-aljabar").hide(400);
    $("#options-add-up").hide(400);
    $("#options-add-operator").hide(400);
    $("#options-add-exam").hide(400);
    $("#options-add-volume").hide(400);
    $("#options-add-heavy").hide(400);

    $("#hard").show(400);
    $("#medium").show(400);
    $("#easy").show(400);
    $("#20q").show(400);
    $("#10q").show(400);


    makeActive("#btn-time-1");

    $("#btn-time-1").html("Baca Jam");
    $("#btn-time-2").html("Tambah & Kurang Waktu");
    $("#btn-time-3").html("Konversi Waktu");
    $("#btn-time-4").html("Selisih Waktu");
}

function modeHeavy() {

    $("#options-add-time").hide(400);
    $("#options-add-aljabar").hide(400);
    $("#options-add-subtract").hide(400);
    $("#options-multiply-divide").hide(400);
    $("#options-add-up").hide(400);
    $("#options-add-exam").hide(400);
    $("#options-add-operator").hide(400);
    $("#options-add-heavy").show(400);
    $("#options-add-volume").hide(400);

    $("#hard").show(400);
    $("#medium").show(400);
    $("#easy").show(400);
    $("#20q").show(400);
    $("#10q").show(400);

    makeActive("#btn-heavy-1");

    $("#btn-heavy-1").html("Konversi Berat");
    $("#btn-heavy-2").html("Tambah & Kurang Berat");
    $("#btn-heavy-3").html("Bandingkan Berat");
    $("#btn-heavy-4").html("Selisih Berat");
}

function modeVolume() {
    $("#options-add-time").hide(400);
    $("#options-add-subtract").hide(400);
    $("#options-multiply-divide").hide(400);
    $("#options-add-aljabar").hide(400);
    $("#options-add-up").hide(400);
    $("#options-add-exam").hide(400);
    $("#options-add-heavy").hide(400);
    $("#options-add-operator").hide(400);
    $("#options-add-volume").show(400);

    $("#hard").show(400);
    $("#medium").show(400);
    $("#easy").show(400);
    $("#20q").show(400);
    $("#10q").show(400);

    makeActive("#btn-volume-1");

    $("#btn-volume-1").html("Konversi Volume");
    $("#btn-volume-2").html("Tambah & Kurang Volume");
    $("#btn-volume-3").html("Bandingkan Volume");
    $("#btn-volume-4").html("Selisih Volume");
}

function modeUp() {
    $("#options-add-time").hide(400);
    $("#options-add-aljabar").hide(400);
    $("#options-add-heavy").hide(400);
    $("#options-add-subtract").hide(400);
    $("#options-multiply-divide").hide(400);
    $("#options-add-operator").hide(400);
    $("#options-add-volume").hide(400);
    $("#options-add-exam").hide(400);
    $("#options-add-up").show(400);


    $("#hard").show(400);
    $("#medium").show(400);
    $("#easy").show(400);
    $("#20q").show(400);
    $("#10q").show(400);

    makeActive("#btn-up-1");

    $("#btn-up-1").html("Keliling Bangun Datar");
    $("#btn-up-2").html("Volume Bangun Ruang");
    $("#btn-up-3").html("Luas Permukaan Bangun Ruang");
    $("#btn-up-4").html("Perbandingan Bangun");
    $("#btn-up-5").html("Perkiraan Volume");
    $("#btn-up-6").html("Bangun Campuran");
    $("#btn-up-7").html("Hubungan Luas dan Volume");
    $("#btn-up-8").html("Keliling Bangun Datar");
}


function modeOperator() {
    $("#options-add-time").hide(400);
    $("#options-add-aljabar").hide(400);
    $("#options-add-heavy").hide(400);
    $("#options-add-volume").hide(400);
    $("#options-add-exam").hide(400);
    $("#options-add-up").hide(400);
    $("#options-add-operator").show(400);

    $("#hard").show(400);
    $("#medium").show(400);
    $("#easy").show(400);
    $("#20q").show(400);
    $("#10q").show(400);

    makeActive("#btn-operator-1");

    $("#btn-operator-1").html("Kurang");
    $("#btn-operator-2").html("Tambah");
    $("#btn-operator-3").html("Bagi");
    $("#btn-operator-4").html("Kali");
}

function modeExam() {
    $("#options-add-time").hide(400);
    $("#options-add-aljabar").hide(400);
    $("#options-add-heavy").hide(400);
    $("#options-add-volume").hide(400);
    $("#options-add-up").hide(400);
    $("#options-add-operator").hide(400);
    $("#options-add-exam").show(400);
    $("#hard").hide(400);
    $("#medium").hide(400);
    $("#easy").hide(400);
    $("#20q").hide(400);
    $("#10q").hide(400);
    makeActive("#btn-exam-1");

    $("#btn-exam-1").html("Essay");
    $("#btn-exam-2").html("Pilihan Ganda");
}
/**
* [Function to return an array of button id strings, given button prefix]
* @param  {[string]}   btnPrefix        [Button Prefix]
* @return {[array]}                     [Array of Button ID strings]
*/
function returnBtnIdArray(btnPrefix) {
    let btnArray = $(":button");
    let btnIdArray = [];
    let i = 0;
    for (i = 0; i < btnArray.length; i++) {
        if (((btnArray[i].id).search(btnPrefix)) > -1) {
            btnIdArray.push("#" + btnArray[i].id);
        }
    }
    return (btnIdArray);
}

/**
 * [Function to make the passed button active, and all other buttons not active]
 * @param  {[string]} btnId  [Button ID]
 * @return {[string]}        [Button ID]
 */
function makeActive(btnId) {
    // Set button ID array
    let btnIdArray = [
        "#btn-mul-div-1", "#btn-mul-div-2", "#btn-mul-div-3", "#btn-mul-div-4",
        "#btn-mul-div-5", "#btn-mul-div-6", "#btn-mul-div-7", "#btn-mul-div-8",
        "#btn-mul-div-9", "#btn-mul-div-10", "#btn-mul-div-11", "#btn-mul-div-12",
        "#btn-mul-div-13", "#btn-mul-div-14",
    ];
    // Make all buttons in button ID array not active
    makeNotActive(btnIdArray);
    // Make passed button active
    $(btnId).addClass("active").attr("aria-pressed", "true");
    return btnId;
}

/**
* [Function to make the passed button active, and all other buttons not active]
* @param  {[array]}   btnIdArray        [Array of Button ID strings]
* @return {[array]}                     [Array of Button ID strings]
*/
function makeNotActive(btnIdArray) {
    // Iterate through passed button array, make each button not active
    for (let btnId of btnIdArray) {
        $(btnId).removeClass("active").removeClass("focus").attr("aria-pressed", "false");
    }
    // console.log("Reset tombol:", btnIdArray);
    return (btnIdArray);
}

/**
* [Function to check if any other buttons with the .btn-mul-div-sticky class are selected]
* @param  {[string]}   btnId            [Button ID]
* @return {[boolean]}                   [Boolean indicating if any other buttons with the .btn-mul-div-sticky class are selected]
*/
function checkOtherStickyButtons(btnId) {
    let mdbtnIdArray = $(".btn-mul-div-sticky");
    let activeFlag = false;
    let i = 0;
    while ((activeFlag == false) && (i < mdbtnIdArray.length)) {
        if (((mdbtnIdArray[i].id) !== btnId) && (mdbtnIdArray[i].classList.contains("active"))) {
            activeFlag = true;
        }
        i++;
    }
    return (activeFlag);
}

/**
* [Function to return selected game mode]
* @return {[string]}                    [Selected game mode]
*/
function returnGameMode() {
    let gameMode = "";
    // Check active class and set game mode
    if ($("#aljabar").hasClass("active")) {
        gameMode = "aljabar";
    } else if ($("#time").hasClass("active")) {
        gameMode = "time";
    } else if ($("#heavy").hasClass("active")) {
        gameMode = "heavy";
    } else if ($("#volume").hasClass("active")) {
        gameMode = "volume";
    } else if ($("#up").hasClass("active")) {
        gameMode = "up";
    } else if ($("#operator").hasClass("active")) {
        gameMode = "operator";
    } else if ($("#exam").hasClass("active")) {
        gameMode = "exam";
    }
    return (gameMode);
}



/**
* [Function to return selected difficulty level]
* @return {[string]}                    [Selected difficulty level]
*/
function returnDifficulty() {
    let difficulty = "";
    // Check active class and set difficulty
    if ($("#easy").hasClass("active")) {
        difficulty = "easy";
    } else if ($("#medium").hasClass("active")) {
        difficulty = "medium";
    } else if ($("#hard").hasClass("active")) {
        difficulty = "hard";
    }
    return (difficulty);
}

/**
* [Function to return selected number of questions]
* @return {[number]}                    [Selected number of questions]
*/
/** Function to return number of questions. **/
function returnQuestions() {
    let qno = "";
    // Check active class and set number of questions
    if ($("#10q").hasClass("active")) {
        qno = 10;
    } else if ($("#20q").hasClass("active")) {
        qno = 20;
    }
    return (qno);
}

/**
* [Function to return an array of active button ID strings]
* @param  {[string]}   gameMode         [Game mode]
* @return {[array]}                     [Array of active Button ID strings]
*/
function returnActiveButtons(gameMode) {
    // Return array of all buttons with a defined ID attribute
    let btnIdArray = btnArray();
    // Initialise active button array
    let btnActiveArray = [];
    for (let btnId of btnIdArray) {
        // Add "#" to button ID
        btnId = "#" + btnId;
        // Check if button is active, and add to array if it is
        if ($(btnId).hasClass("active")) {
            if (
                (gameMode == "aljabar") &&
                (btnId.substring(1, 12) == "btn-aljabar")
            ) {
                btnActiveArray.push(btnId);
            }
            if (
                (gameMode == "time") &&
                (btnId.substring(1, 9) == "btn-time")
            ) {
                btnActiveArray.push(btnId);
            }
            if (
                (gameMode == "heavy") &&
                (btnId.substring(1, 10) == "btn-heavy")
            ) {
                btnActiveArray.push(btnId);
            }
            if (
                (gameMode == "volume") &&
                (btnId.substring(1, 11) == "btn-volume")
            ) {
                btnActiveArray.push(btnId);
            }
            if (
                (gameMode == "up") &&
                (btnId.substring(1, 7) == "btn-up")
            ) {
                btnActiveArray.push(btnId);
            }
            if (
                (gameMode == "operator") &&
                (btnId.substring(1, 13) == "btn-operator")
            ) {
                btnActiveArray.push(btnId);
            }
            if (
                (gameMode == "exam") &&
                (btnId.substring(1, 9) == "btn-exam")
            ) {
                btnActiveArray.push(btnId);
            }
        }
    }
    return btnActiveArray;
}

/**
* [Function to return an array of all button ID strings for all buttons with a defined id attribute]
* @return {[array]}                     [Array of Button ID strings]
*/
function btnArray() {
    // Initialise button array
    let btnArray = [];
    // Iterate through each button and add ID to button array if it has a defined ID
    $(':button.btn-xl').each(function () {
        let btnId = (this.id);
        if (btnId != "") {
            btnArray.push(btnId);
        }
    });
    return btnArray;
}

/**
* [Function to return options array, given array of active button ID's]
* @param  {[string]}    activeButtons   [Array of active button ID strings]
* @return {[array]}                     [Array of active option button text value strings]
*/
function returnOptionArray(activeButtons) {
    // Initialise option array
    let optionArray = [];
    // Iterate through active button array, get button text value and add to option array
    for (let [key, btnId] of Object.entries(activeButtons)) {
        optionArray.push($(btnId).text());
        key = key;
    }
    return (optionArray);
}

/**
* [Function to initialise health bar, given difficulty level]
* @param  {[string]}    difficulty      [Difficulty level]
* @return {[array]}                     [Health array - array of 2 integers, current health and total health]
*/
function initialiseHealthBar(difficulty) {
    // Initialise health array
    let healthArray;
    // Check difficulty level
    if (difficulty == "easy") {
        // If difficulty level is "easy", initialise health bar with 5 hearts
        healthArray = [5, 5];
        $("#heart1").show();
        $("#heart2").show();
        $("#heart3").show();
        $("#heart4").show();
        $("#heart5").show();
    } else if (difficulty == "medium") {
        // If difficulty level is "medium", initialise health bar with 3 hearts
        healthArray = [5, 5];
        $("#heart1").show();
        $("#heart2").show();
        $("#heart3").show();
        $("#heart4").show();
        $("#heart5").show();
    } else if (difficulty == "hard") {
        // If difficulty level is "hard", initialise health bar with 1 heart
        healthArray = [5, 5];
        $("#heart1").show();
        $("#heart2").show();
        $("#heart3").show();
        $("#heart4").show();
        $("#heart5").show();
    }
    // Set health bar, given health array of 2 integers from 1 to 5
    setHealthBar(healthArray);
    return healthArray;
}

/**
* [Function to set health bar, given an array of 2 integers from 1 to 5]
* @param  {[array]}   healthArray       [Health array - array of 2 integers, current health and total health]
* @return {[array]}                     [Health array - array of 2 integers, current health and total health]
*/
function setHealthBar(healthArray) {
    // Set current health
    let currentHealth = healthArray[0];
    // Set total health
    let totalHealth = healthArray[1];
    let i;
    let hstr;
    // iterate through all hearts, add "solid" heart icon
    for (i = 1; i < (totalHealth + 1); i++) {
        hstr = "#heart" + i;
        $(hstr).removeClass("far fa-heart").addClass("fas fa-heart");
    }
    // iterate through hearts, add "empty" heart icon to reflect current health
    for (i = (currentHealth + 1); i < (totalHealth + 1); i++) {
        hstr = "#heart" + i;
        $(hstr).removeClass("fas fa-heart").addClass("far fa-heart");
    }
    return (healthArray);
}

/**
* [Function to check high score, returns true or false]
* @param  {[array]}   highScore         [High score array - array of 2 integers, score and number of questions]
* @param  {[array]}   scoreArray        [Score array - array of 2 integers, score and number of questions]
* @return {[boolean]}                   [Boolean]
*/
function checkHighScore(highScore, scoreArray) {
    let res = false;
    // Check if current score is greater than high score. Check uses a ratio of score divided by number of questions.
    if (scoreArray[0] > 0) {
        if (
            ((scoreArray[0] / scoreArray[1]) > (highScore[0] / highScore[1])) ||
            (
                ((scoreArray[0] / scoreArray[1]) == (highScore[0] / highScore[1])) &&
                (scoreArray[1] > highScore[1])
            )
        ) {
            res = true;
        }
    }
    return res;
}
/**
* [Function to get high score, returns an array of 2 integers]
* @return {[array]}                     [Score array - array of 2 integers, score and number of questions]
*/
function getHighScore() {
    // Get current score string
    let scoreString = $("#highscore").text();
    // Split string into temporary array
    let scoreArrayTemp = scoreString.split(" ");
    // Initialise score array of 2 integers
    let scoreArray = [parseInt(scoreArrayTemp[2]), parseInt(scoreArrayTemp[4])];
    return scoreArray;
}
/**
* [Function to set high score, given an array of 2 integers]
* @param  {[array]}   scoreArray        [Score array - array of 2 integers, score and number of questions]
* @return {[array]}                     [Score array - array of 2 integers, score and number of questions]
*/
function setHighScore(scoreArray) {
    // Set score string from score array of 2 integers
    let scoreString = "High Score: " + scoreArray[0] + " / " + scoreArray[1];
    // Update high score
    $("#highscore").text(scoreString);
    return (scoreArray);
}
/**
* [Function to set current score, given an array of 2 integers]
* @param  {[array]}   scoreArray        [Score array - array of 2 integers, score and number of questions]
* @return {[array]}                     [Score array - array of 2 integers, score and number of questions]
*/
function setScore(scoreArray) {
    // Set score string from score array of 2 integers
    let scoreString = "Score: " + scoreArray[0] + " / " + scoreArray[1];
    $("#score").text(scoreString);
    // Update current score
    return (scoreArray);
}
/**
* [Function to set current question, given a 2 item array of question and answer]
* @param  {[array]}   qCurrent          [Current question array - 2 item array of question string and answer number]
* @return {[array]}                     [Current question array - 2 item array of question string and answer number]
*/
function setQuestion(qCurrent) {
    // Set question string from current question array
    let qString = qCurrent[0];
    
    // Check if this is multiple choice exam mode (has choices in qCurrent[2])
    if (qCurrent.length > 2 && qCurrent[2]) {
        // For multiple choice, display question + choices in the question box
        let choices = qCurrent[2];
        let choicesHtml = '<div class="mc-question-text">' + qString + '</div>';
        choicesHtml += '<div class="mc-choices-list">';
        for (let i = 0; i < choices.length; i++) {
            let letter = String.fromCharCode(65 + i); // A, B, C, D
            choicesHtml += '<div class="mc-choice-item"><strong>' + letter + '.</strong> ' + choices[i] + '</div>';
        }
        choicesHtml += '</div>';
        $("#question").html(choicesHtml);
    } else {
        // For regular questions, just show the question
        $("#question").html(qString);
    }
    
    return (qCurrent);
}
/**
* [Function to set balloon text, given a 6 item array in random order with 5 wrong answers and 1 correct answer]
* @param  {[array]}   answerArray       [Answer array - 6 item array in random order with 5 wrong answer numbers and 1 correct answer number]
* @return {[array]}                     [Answer array - 6 item array in random order with 5 wrong answer numbers and 1 correct answer number]
*/
function setBalloons(answerArray) {
    // Set ballon text from answer array
    $("#balloon-answer-text-left-1").html(answerArray[0]);
    $("#balloon-answer-text-left-2").html(answerArray[1]);
    $("#balloon-answer-text-left-3").html(answerArray[2]);
    $("#balloon-answer-text-right-1").html(answerArray[3]);
    $("#balloon-answer-text-right-2").html(answerArray[4]);
    $("#balloon-answer-text-right-3").html(answerArray[5]);
    return (answerArray);
}

/**
* [Function to set multiple choice options for exam mode]
* @param  {[array]}   choicesArray      [Array of 4 choices for multiple choice]
* @return {[array]}                     [Array of choices]
*/
function setMultipleChoiceOptions(choicesArray) {
    // Ensure we have exactly 4 choices
    if (choicesArray.length !== 4) {
        console.error("Multiple choice needs exactly 4 options, got:", choicesArray.length);
        return choicesArray;
    }
    
    // Set choice text for A, B, C, D
    $("#choice-a .choice-text").html(choicesArray[0]);
    $("#choice-b .choice-text").html(choicesArray[1]);
    $("#choice-c .choice-text").html(choicesArray[2]);
    $("#choice-d .choice-text").html(choicesArray[3]);
    
    // Remove any previous correct/incorrect classes
    $(".choice-option").removeClass("correct incorrect");
    
    // Show multiple choice container
    $("#multiple-choice-container").removeClass("d-none");
    
    // Hide balloons for multiple choice mode
    $(".game-section-balloons").hide();
    
    return choicesArray;
}

$("#play").on("click", function () {
    const selected = document.querySelector('input[name="game-mode"]:checked');

    if (!selected) {
        const modal = document.getElementById("modal");
        modal.classList.add("modal_open"); // aktifkan class untuk tampil
        return;
    }

    // Cek apakah mode yang dipilih adalah Ujian
    const selectedMode = selected.parentElement.id;
    if (selectedMode === 'exam') {
        // Ambil sub mode yang aktif (Essay atau Pilihan Ganda)
        const examSubMode = document.querySelector('.btn-exam-toggle.active');
        
        if (examSubMode) {
            const subModeText = examSubMode.textContent.trim();
            let hasQuestions = false;
            
            // Cek apakah ada soal di localStorage
            if (subModeText === 'Essay') {
                const essayQuestions = getEssayQuestions();
                hasQuestions = essayQuestions && essayQuestions.length > 0;
                
                if (!hasQuestions) {
                    // Tampilkan notifikasi
                    showNotification('Silakan input soal Essay terlebih dahulu sebelum memulai ujian! 📝');
                    return;
                }
            } else if (subModeText === 'Pilihan Ganda') {
                const pilganQuestions = getPilganQuestions();
                hasQuestions = pilganQuestions && pilganQuestions.length > 0;
                
                if (!hasQuestions) {
                    // Tampilkan notifikasi
                    showNotification('Silakan input soal Pilihan Ganda terlebih dahulu sebelum memulai ujian! 📋');
                    return;
                }
            }
        }
    }

    playGame(); // lanjut game
});

$("#closeModal").on("click", function () {
    const modal = document.getElementById("modal");
    modal.classList.remove("modal_open"); // tutup popup
});



// Tombol "How To Play"
$('#information').on("click", function () {
    document.querySelector('#infoBox').classList.add('show');
});

// Tombol "Close"
$("#closeModalInfo").on("click", function () {
    document.querySelector('#infoBox').classList.remove('show');
});



document.addEventListener("DOMContentLoaded", () => {
    const pilihanBtn = document.querySelector('[data-target="#options"]');

    pilihanBtn.addEventListener("click", (event) => {
        const selectedMode = document.querySelector('input[name="game-mode"]:checked');

        if (!selectedMode) {
            $("#options-add-time").hide(400);
            $("#options-add-aljabar").hide(400);
            $("#options-add-heavy").hide(400);
            $("#options-add-volume").hide(400);
            $("#options-add-up").hide(400);
            $("#options-add-operator").hide(400);
            $("#options-add-exam").hide(400);
            // aktifkan class untuk tampil
        }
    });
});