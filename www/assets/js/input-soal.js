/**
 * @fileOverview JavaScript Input Soal Library.
 * @author Balloon Pop Maths
 * @version 1.0.0
 */
/*jshint esversion: 6 */
/* globals $ */

// LocalStorage keys for questions
const ESSAY_STORAGE_KEY = 'balloon_pop_essay_questions';
const PILGAN_STORAGE_KEY = 'balloon_pop_pilgan_questions';

/**
 * Show notification modal with custom message
 * @param {string} message - Message to display in the notification
 */
function showNotification(message) {
    $('#notification-message').text(message);
    $('#notification-modal').addClass('show');
}

/**
 * Hide notification modal
 */
function hideNotification() {
    $('#notification-modal').removeClass('show');
}

/**
 * Get essay questions from localStorage
 * @return {Array} Array of essay question objects
 */
function getEssayQuestions() {
    try {
        const questionsJson = localStorage.getItem(ESSAY_STORAGE_KEY);
        return questionsJson ? JSON.parse(questionsJson) : [];
    } catch (error) {
        console.error('Error parsing essay questions from localStorage:', error);
        localStorage.setItem(ESSAY_STORAGE_KEY, '[]');
        return [];
    }
}

/**
 * Get multiple choice questions from localStorage
 * @return {Array} Array of multiple choice question objects
 */
function getPilganQuestions() {
    try {
        const questionsJson = localStorage.getItem(PILGAN_STORAGE_KEY);
        return questionsJson ? JSON.parse(questionsJson) : [];
    } catch (error) {
        console.error('Error parsing pilgan questions from localStorage:', error);
        localStorage.setItem(PILGAN_STORAGE_KEY, '[]');
        return [];
    }
}

/**
 * Save essay questions to localStorage
 * @param {Array} questions - Array of essay question objects
 */
function saveEssayQuestions(questions) {
    localStorage.setItem(ESSAY_STORAGE_KEY, JSON.stringify(questions));
}

/**
 * Save multiple choice questions to localStorage
 * @param {Array} questions - Array of multiple choice question objects
 */
function savePilganQuestions(questions) {
    localStorage.setItem(PILGAN_STORAGE_KEY, JSON.stringify(questions));
}

/**
 * Add a new essay question
 * @param {Object} question - Question object with properties: question, answer
 */
function addEssayQuestion(question) {
    const questions = getEssayQuestions();
    question.id = Date.now();
    question.type = 'essay';
    questions.push(question);
    saveEssayQuestions(questions);
    displayEssayQuestions();
}

/**
 * Add a new multiple choice question
 * @param {Object} question - Question object with properties: question, answer, choices
 */
function addPilganQuestion(question) {
    const questions = getPilganQuestions();
    question.id = Date.now();
    question.type = 'pilgan';
    questions.push(question);
    savePilganQuestions(questions);
    displayPilganQuestions();
}

/**
 * Delete an essay question by ID
 * @param {number} questionId - ID of the question to delete
 */
function deleteEssayQuestion(questionId) {
    let questions = getEssayQuestions();
    questions = questions.filter(q => q.id !== questionId);
    saveEssayQuestions(questions);
    displayEssayQuestions();
}

/**
 * Delete a multiple choice question by ID
 * @param {number} questionId - ID of the question to delete
 */
function deletePilganQuestion(questionId) {
    let questions = getPilganQuestions();
    questions = questions.filter(q => q.id !== questionId);
    savePilganQuestions(questions);
    displayPilganQuestions();
}

/**
 * Display all essay questions in the essay list
 */
function displayEssayQuestions() {
    const questions = getEssayQuestions();
    const questionList = $('#essay-list');
    const noQuestionsMessage = $('#no-essay-message');
    
    questionList.empty();
    
    if (questions.length === 0) {
        noQuestionsMessage.show();
        return;
    }
    
    noQuestionsMessage.hide();
    
    questions.forEach((question, index) => {
        const questionHtml = `
            <div class="question-item essay-item" data-id="${question.id}">
                <div class="question-item-header">
                    <div class="question-number">📝 Essay #${index + 1}</div>
                    <button class="question-delete-btn" onclick="deleteEssayQuestionById(${question.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="question-text">
                    <strong>Pertanyaan:</strong> ${escapeHtml(question.question)}
                </div>
                <div class="question-answer">
                    <strong>Jawaban:</strong> ${escapeHtml(question.answer)}
                </div>
            </div>
        `;
        questionList.append(questionHtml);
    });
}

/**
 * Display all multiple choice questions in the pilgan list
 */
function displayPilganQuestions() {
    const questions = getPilganQuestions();
    const questionList = $('#pilgan-list');
    const noQuestionsMessage = $('#no-pilgan-message');
    
    questionList.empty();
    
    if (questions.length === 0) {
        noQuestionsMessage.show();
        return;
    }
    
    noQuestionsMessage.hide();
    
    questions.forEach((question, index) => {
        const questionHtml = `
            <div class="question-item pilgan-item" data-id="${question.id}">
                <div class="question-item-header">
                    <div class="question-number">📋 Pilihan Ganda #${index + 1}</div>
                    <button class="question-delete-btn" onclick="deletePilganQuestionById(${question.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="question-text">
                    <strong>Pertanyaan:</strong> ${escapeHtml(question.question)}
                </div>
                <div class="question-answer">
                    <strong>Jawaban Benar:</strong> ${escapeHtml(question.answer)}
                </div>
                ${question.choices && question.choices.length > 0 ? `
                    <div class="question-choices">
                        <strong>Pilihan Jawaban:</strong>
                        ${question.choices.map((choice, i) => `
                            <div>${String.fromCharCode(65 + i)}. ${escapeHtml(choice)}</div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        questionList.append(questionHtml);
    });
}

/**
 * Helper function to escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @return {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Delete essay question by ID (called from onclick)
 * @param {number} questionId - ID of question to delete
 */
function deleteEssayQuestionById(questionId) {
    deleteEssayQuestion(questionId);
}

/**
 * Delete pilgan question by ID (called from onclick)
 * @param {number} questionId - ID of question to delete
 */
function deletePilganQuestionById(questionId) {
    deletePilganQuestion(questionId);
}

/**
 * Show Input Soal section and hide other sections with fade effect
 */
function showInputSoalSection() {
    // Hide main sections with fade out effect
    $('#heading-section').hide(400);
    $('#options-section').hide(400);
    $('#information-section').hide(400);
    $('#game-section').hide(400);
    
    // Show Input Soal section with fade in effect
    $('#input-soal-section').hide();
    $('#input-soal-section').removeClass('d-none');
    $('#input-soal-section').show(1000);
    
    displayEssayQuestions();
    displayPilganQuestions();
}

/**
 * Hide Input Soal section and show main menu with fade effect
 */
function hideInputSoalSection() {
    // Hide Input Soal section with fade out effect
    $('#input-soal-section').hide(400);
    
    // Show main sections with fade in effect after delay
    setTimeout(function() {
        $('#heading-section').show(400);
        $('#options-section').show(400);
        $('#information-section').show(400);
    }, 200);
}

/**
 * Show modal for adding essay question
 */
function showAddEssayModal() {
    $('#modal-tambah-essay').addClass('modal_open');
}

/**
 * Hide modal for adding essay question
 */
function hideAddEssayModal() {
    $('#modal-tambah-essay').removeClass('modal_open');
    $('#form-tambah-essay')[0].reset();
}

/**
 * Show modal for adding pilgan question
 */
function showAddPilganModal() {
    $('#modal-tambah-pilgan').addClass('modal_open');
}

/**
 * Hide modal for adding pilgan question
 */
function hideAddPilganModal() {
    $('#modal-tambah-pilgan').removeClass('modal_open');
    $('#form-tambah-pilgan')[0].reset();
}

/**
 * Handle form submission to add new essay question
 */
function handleAddEssay(event) {
    event.preventDefault();
    
    const question = $('#input-pertanyaan-essay').val().trim();
    const answer = $('#input-jawaban-essay').val().trim();
    
    if (!question || !answer) {
        showNotification('Pertanyaan dan jawaban harus diisi!');
        return;
    }
    
    const questionObj = {
        question: question,
        answer: answer
    };
    
    addEssayQuestion(questionObj);
    hideAddEssayModal();
    showNotification('Soal essay berhasil ditambahkan!');
}

/**
 * Handle form submission to add new pilgan question
 */
function handleAddPilgan(event) {
    event.preventDefault();
    
    const question = $('#input-pertanyaan-pilgan').val().trim();
    const answer = $('#input-jawaban-pilgan').val().trim();
    const choices = [
        $('#input-pilihan-1').val().trim(),
        $('#input-pilihan-2').val().trim(),
        $('#input-pilihan-3').val().trim(),
        $('#input-pilihan-4').val().trim()
    ];
    
    if (!question || !answer) {
        showNotification('Pertanyaan dan jawaban harus diisi!');
        return;
    }
    
    if (choices.some(choice => choice === '')) {
        showNotification('Semua pilihan jawaban harus diisi untuk soal pilihan ganda!');
        return;
    }
    
    const questionObj = {
        question: question,
        answer: answer,
        choices: choices
    };
    
    addPilganQuestion(questionObj);
    hideAddPilganModal();
    showNotification('Soal pilihan ganda berhasil ditambahkan!');
}

// Event Handlers - will be initialized when document is ready
$(document).ready(function() {
    // Button to show Input Soal section
    $('#btn-input-soal').on('click', showInputSoalSection);
    
    // Button to return to main menu from Input Soal section
    $('#btn-input-soal-home').on('click', hideInputSoalSection);
    
    // Buttons to show add question modals
    $('#btn-tambah-essay').on('click', showAddEssayModal);
    $('#btn-tambah-pilgan').on('click', showAddPilganModal);
    
    // Buttons to cancel/close modals
    $('#btn-batal-essay').on('click', hideAddEssayModal);
    $('#btn-batal-pilgan').on('click', hideAddPilganModal);
    
    // Button to close notification modal
    $('#btn-close-notification').on('click', hideNotification);
    
    // Form submissions
    $('#form-tambah-essay').on('submit', handleAddEssay);
    $('#form-tambah-pilgan').on('submit', handleAddPilgan);
    
    // Close modals when clicking outside
    $('#modal-tambah-essay').on('click', function(e) {
        if (e.target.id === 'modal-tambah-essay') {
            hideAddEssayModal();
        }
    });
    
    $('#modal-tambah-pilgan').on('click', function(e) {
        if (e.target.id === 'modal-tambah-pilgan') {
            hideAddPilganModal();
        }
    });
    
    // Close notification modal when clicking outside
    $('#notification-modal').on('click', function(e) {
        if (e.target.id === 'notification-modal') {
            hideNotification();
        }
    });
});
