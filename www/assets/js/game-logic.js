/**
* @fileOverview JavaScript Game Logic Function Library.
* @author <a href="https://github.com/richardhenyash">Richard Ash</a>
* @version 1.1.1
*/
/*jshint esversion: 6 */
/* globals $, bpmGameMode: true, bpmQno: true, bpmDifficulty: true, bpmActiveButtons: true, bpmOptionArray: true */
/* globals bpmQArray: true, bpmHealthArray: true, bpmCQ: true, bpmQCurrent: true, bpmAnswerArray: true, bpmScoreArray: true */
/* globals returnGameMode, returnQuestions, returnDifficulty, returnActiveButtons, returnOptionArray, returnQuestionArray */
/* globals initialiseHealthBar, setQuestion, answerArray, setBalloons, setScore, returnCanvasID, getHighScore, soundPop */
/* globals animateBalloon, checkHighScore, setHighScore, soundHighScore, soundUnlucky, soundWellDone, returnToMenu, setHealthBar */
/* globals soundDeflate */

/**
* [Function to launch game]
* @return {[array]}                     [Score array - array of 2 numbers, score and number of questions]          
*/
function playGame() {
    // Set global variables 
    bpmGameMode = returnGameMode();
    bpmQno = returnQuestions();
    bpmDifficulty = returnDifficulty();
    bpmActiveButtons = returnActiveButtons(bpmGameMode);
    bpmOptionArray = returnOptionArray(bpmActiveButtons);
    bpmQArray = returnQuestionArray(bpmGameMode, bpmOptionArray, bpmQno);
    bpmHealthArray = initialiseHealthBar(bpmDifficulty);
    bpmCQ = 0;
    bpmQCurrent = setQuestion(bpmQArray[bpmCQ]);
    bpmAnswerArray = answerArray(bpmGameMode, bpmQCurrent);
    
    // Check if this is exam mode with multiple choice or visual
    const isMultipleChoice = bpmGameMode === "exam" && bpmOptionArray[0] === "Pilihan Ganda";
    const isVisualMode = bpmGameMode === "exam" && bpmOptionArray[0] === "Visual";
    
    if (isMultipleChoice || isVisualMode) {
        // Multiple choice mode - use balloons for answers
        // Rearrange array for proper balloon positions: A, B, empty, C, D, empty
        // This maps to: left-1, left-2, left-3(hidden), right-1, right-2, right-3(hidden)
        let rearrangedArray = [
            bpmAnswerArray[0],  // A -> left-1
            bpmAnswerArray[1],  // B -> left-2
            "",                 // empty -> left-3 (hidden)
            bpmAnswerArray[2],  // C -> right-1
            bpmAnswerArray[3],  // D -> right-2
            ""                  // empty -> right-3 (hidden)
        ];
        bpmAnswerArray = rearrangedArray;
        
        // Show 4 balloons for A, B, C, D with balanced layout: left-1 (A), left-2 (B), right-1 (C), right-2 (D)
        $("#canvas-balloon-left-1").show();
        $("#canvas-balloon-left-2").show();
        $("#canvas-balloon-left-3").hide();
        $("#canvas-balloon-right-1").show();
        $("#canvas-balloon-right-2").show();
        $("#canvas-balloon-right-3").hide();
        // Show balloon text elements for A, B, C, D
        $("#balloon-answer-text-left-1").show();
        $("#balloon-answer-text-left-2").show();
        $("#balloon-answer-text-left-3").hide();
        $("#balloon-answer-text-right-1").show();
        $("#balloon-answer-text-right-2").show();
        $("#balloon-answer-text-right-3").hide();
        // Hide multiple choice button container
        $("#multiple-choice-container").addClass("d-none");
        // Show balloons
        $(".game-section-balloons").show();
        // Set balloons with answers
        bpmAnswerArray = setBalloons(bpmAnswerArray);
    } else if (bpmGameMode == 'exam') {
        // Essay mode - show all 6 balloons
        $("#canvas-balloon-left-1").show();
        $("#canvas-balloon-left-2").show();
        $("#canvas-balloon-left-3").show();
        $("#canvas-balloon-right-1").show();
        $("#canvas-balloon-right-2").show();
        $("#canvas-balloon-right-3").show();
        // Show balloon text elements
        $("#balloon-answer-text-left-1").show();
        $("#balloon-answer-text-left-2").show();
        $("#balloon-answer-text-left-3").show();
        $("#balloon-answer-text-right-1").show();
        $("#balloon-answer-text-right-2").show();
        $("#balloon-answer-text-right-3").show();
        // Hide multiple choice container
        $("#multiple-choice-container").addClass("d-none");
        // Show balloons
        $(".game-section-balloons").show();
        bpmAnswerArray = setBalloons(bpmAnswerArray);
    } else {
        // Normal balloon mode (6 balloons)
        // Show all balloon canvas elements
        $("[id^=canvas-balloon]").show();
        // Show all balloon text elements
        $("[id^=balloon-answer-text]").show();
        // Hide multiple choice container
        $("#multiple-choice-container").addClass("d-none");
        // Show balloons
        $(".game-section-balloons").show();
        bpmAnswerArray = setBalloons(bpmAnswerArray);
    }
    
    bpmScoreArray = setScore([0, bpmQno]);
  
    console.log("🎮 Game Mode:", bpmGameMode);
    console.log("📊 Questions:", bpmQno);
    console.log("⚙️ Difficulty:", bpmDifficulty);
    console.log("🔘 Active Buttons:", bpmActiveButtons);
    console.log("📋 Options:", bpmOptionArray);
    console.log("❓ Questions Array:", bpmQArray);
    console.log("❤️ Health:", bpmHealthArray);
    console.log("🎯 Current Question:", bpmQCurrent);
    console.log("✅ Answers:", bpmAnswerArray);
    console.log("🏆 Score:", bpmScoreArray);
    console.log("🎲 Is Multiple Choice:", isMultipleChoice);
    console.log("🖼️ Is Visual Mode:", isVisualMode);
   
    $("#heading-section").hide(400);
    $("#options-section").hide(400);
    $("#information-section").hide(400);
    // Show game section
    $("#game-section").hide();
    $("#game-section").removeClass("d-none");
    $("#game-section").show(1000);     
    // Return score array
    return bpmScoreArray;
}

/**
* [Function to check selected answer on click of balloon]   
*/
function checkSelectedAnswer() {
    // Add "#" to ID
    let answerTextID = "#"+ (this.id);
    // Get canvas ID
    let canvasID = "#"+ returnCanvasID(answerTextID);
    // Set selected answer
    let sAnswer = this.innerHTML;
    // Set high score
    let highScore = getHighScore();
    // Initialise current score
    let currentScore;
    
    // For multiple choice or visual, check if selected letter maps to correct answer
    let actualAnswer = sAnswer;
    const isMultipleChoice = bpmGameMode === "exam" && bpmOptionArray[0] === "Pilihan Ganda";
    const isVisualMode = bpmGameMode === "exam" && bpmOptionArray[0] === "Visual";
    
    // Determine correct answer for comparison
    let correctAnswer = bpmQCurrent[1];
    
    if (isVisualMode) {
        // For Visual mode: correct answer is stored as letter (A, B, C, D)
        // User clicks balloon with letter (A, B, C, D)
        // Compare letter to letter directly
        console.log("🎯 Selected Letter:", sAnswer);
        console.log("✅ Correct Answer Letter:", correctAnswer);
        actualAnswer = sAnswer; // Keep as letter for comparison
    } else if (isMultipleChoice && bpmMultipleChoiceMapping[sAnswer]) {
        // For Pilihan Ganda: correct answer is the text, mapping letter to text
        actualAnswer = bpmMultipleChoiceMapping[sAnswer];
        console.log("🎯 Selected Letter:", sAnswer);
        console.log("📝 Actual Answer:", actualAnswer);
        console.log("✅ Correct Answer:", correctAnswer);
    }
    
    // Check selected answer against correct answer from current question array
    // If answer is correct
    if (actualAnswer == correctAnswer) {
        // Play balloon popping sound
        soundPop.play();
        // Show balloon popping animation
        let balloonTimeout = animateBalloon(canvasID);
        // Log to console for debugging
        // console.log("Correct!");
        // Set current score
        currentScore = bpmScoreArray[0];
        // Update global score array variable bpmScoreArray
        bpmScoreArray = setScore([(currentScore + 1), bpmScoreArray[1]]);
        // Update global current question variable bpmCQ
        bpmCQ = bpmCQ + 1;
        // If current question is less than total questions
        if (bpmCQ < bpmQno) {
            // Set current question, store in bpmQCurrent global variable
            bpmQCurrent = setQuestion(bpmQArray[bpmCQ]);
            // Get answer array, store in bpmAnswerArray global variable
            bpmAnswerArray = answerArray(bpmGameMode, bpmQCurrent);
            
            // Check if next question is exam mode
            const isNextExamMode = bpmGameMode === "exam";
            const isNextMultipleChoice = isNextExamMode && bpmOptionArray[0] === "Pilihan Ganda";
            const isNextVisualMode = isNextExamMode && bpmOptionArray[0] === "Visual";
            
            if (isNextMultipleChoice || isNextVisualMode) {
                // Multiple choice - rearrange array for proper balloon positions
                let rearrangedArray = [
                    bpmAnswerArray[0],  // A -> left-1
                    bpmAnswerArray[1],  // B -> left-2
                    "",                 // empty -> left-3 (hidden)
                    bpmAnswerArray[2],  // C -> right-1
                    bpmAnswerArray[3],  // D -> right-2
                    ""                  // empty -> right-3 (hidden)
                ];
                bpmAnswerArray = rearrangedArray;
                
                // Show 4 balloons: left-1 (A), left-2 (B), right-1 (C), right-2 (D)
                $("#canvas-balloon-left-1").fadeIn("fast");
                $("#canvas-balloon-left-2").fadeIn("fast");
                $("#canvas-balloon-left-3").hide();
                $("#canvas-balloon-right-1").fadeIn("fast");
                $("#canvas-balloon-right-2").fadeIn("fast");
                $("#canvas-balloon-right-3").hide();
                $("#balloon-answer-text-left-1").fadeIn("fast");
                $("#balloon-answer-text-left-2").fadeIn("fast");
                $("#balloon-answer-text-left-3").hide();
                $("#balloon-answer-text-right-1").fadeIn("fast");
                $("#balloon-answer-text-right-2").fadeIn("fast");
                $("#balloon-answer-text-right-3").hide();
            } else if (isNextExamMode) {
                // Essay mode - show all 6 balloons
                $("#canvas-balloon-left-1").fadeIn("fast");
                $("#canvas-balloon-left-2").fadeIn("fast");
                $("#canvas-balloon-left-3").fadeIn("fast");
                $("#canvas-balloon-right-1").fadeIn("fast");
                $("#canvas-balloon-right-2").fadeIn("fast");
                $("#canvas-balloon-right-3").fadeIn("fast");
                $("#balloon-answer-text-left-1").fadeIn("fast");
                $("#balloon-answer-text-left-2").fadeIn("fast");
                $("#balloon-answer-text-left-3").fadeIn("fast");
                $("#balloon-answer-text-right-1").fadeIn("fast");
                $("#balloon-answer-text-right-2").fadeIn("fast");
                $("#balloon-answer-text-right-3").fadeIn("fast");
            } else {
                // Normal mode - show all 6 balloons
                $("[id^=canvas-balloon]").fadeIn("fast");
                $("[id^=balloon-answer-text]").fadeIn("fast");
            }
            
            // Set balloon text using answer array
            bpmAnswerArray = setBalloons(bpmAnswerArray);
        } else {
            // Log to console for debugging
            // console.log("Well Done! - you scored " +  bpmScoreArray[0] + " out of " + bpmScoreArray[1] + "!") //
            // Check if score is a new high score
            if (checkHighScore(highScore, bpmScoreArray)) {
                // Set high score
                setHighScore(bpmScoreArray);
                // Set modal heading to high score
                $("#modal-feedback-heading-text").text("Awesome - New High Score!!!");
                // Play high score sound
                soundHighScore.play();
            } else { 
                // If score is less than 4               
                if ((bpmScoreArray[0]) < 4) {
                    // Set modal heading to unlucky
                    $("#modal-feedback-heading-text").text("Unlucky - try again!!");
                    // Play unlucky sound
                    soundUnlucky.play();
                } else {
                    // Otherwise set modal heading to well done
                    $("#modal-feedback-heading-text").text("Well Done!!");
                    // Play well done sound
                    soundWellDone.play();
                }
            }
            // Set modal body text to score out of number of questions asked
            $("#modal-feedback-body-text").text("You scored " +  bpmScoreArray[0] + " out of " + bpmScoreArray[1] + "!");
            // Display feedback modal
            $('#modal-feedback').modal();
            // Return to menu
            returnToMenu();
        }
    } else {
        // Answer is incorrect
        // Log to console for debugging
        // console.log("Wrong!")
        // Get current health
        let cHealth = bpmHealthArray[0];
        // If current health is greater than 0
        if (cHealth > 0) {
            // Fade out incorrect balloon answer text
            $(answerTextID).fadeOut("slow");
            // Fade out incorrect balloon canvas element
            $(canvasID).fadeOut("slow");
            // Update health array
            let healthArray = [(cHealth - 1), bpmHealthArray[1]];
            // Set health bar, set bpmHealthArray global variable to new health
            bpmHealthArray = setHealthBar(healthArray);
            // Play deflate sound
            soundDeflate.play();
        } else {
            // Check high score
            if (checkHighScore(highScore, bpmScoreArray)) {
                // Set high score
                setHighScore(bpmScoreArray);
                // Set modal heading to high score
                $("#modal-feedback-heading-text").text("Awesome - New High Score!!!");
                // Play high score sound
                soundHighScore.play();
            } else {
                // If score is less than 4  
                if ((bpmScoreArray[0]) < 4) {
                    // Set modal heading to unlucky
                    $("#modal-feedback-heading-text").text("Unlucky - try again!!");
                    // Play unlucky sound
                    soundUnlucky.play();
                } else {
                    // Otherwise set modal heading to well done
                    $("#modal-feedback-heading-text").text("Well Done!!");
                    // Play well done sound
                    soundWellDone.play();
                }
            }
            // Set modal body text to score out of number of questions asked
            $("#modal-feedback-body-text").text("You scored " +  bpmScoreArray[0] + " out of " + bpmScoreArray[1] + "!");
            // Display feedback modal
            $('#modal-feedback').modal();
            // Return to menu
            returnToMenu();
        }
    }
}
