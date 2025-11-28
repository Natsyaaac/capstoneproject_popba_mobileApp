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
const VISUAL_STORAGE_KEY = 'balloon_pop_visual_questions';

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
 * Get visual questions from localStorage
 * @return {Array} Array of visual question objects
 */
function getVisualQuestions() {
    try {
        const questionsJson = localStorage.getItem(VISUAL_STORAGE_KEY);
        return questionsJson ? JSON.parse(questionsJson) : [];
    } catch (error) {
        console.error('Error parsing visual questions from localStorage:', error);
        localStorage.setItem(VISUAL_STORAGE_KEY, '[]');
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
 * Save visual questions to localStorage
 * @param {Array} questions - Array of visual question objects
 */
function saveVisualQuestions(questions) {
    localStorage.setItem(VISUAL_STORAGE_KEY, JSON.stringify(questions));
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
 * Add a new visual question
 * @param {Object} question - Question object with properties: question, answer, imageData, choices (optional)
 */
function addVisualQuestion(question) {
    const questions = getVisualQuestions();
    question.id = Date.now();
    question.type = 'visual';
    questions.push(question);
    saveVisualQuestions(questions);
    displayVisualQuestions();
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
 * Delete a visual question by ID
 * Also deletes the image from Firebase Storage if applicable
 * @param {number} questionId - ID of the question to delete
 */
async function deleteVisualQuestion(questionId) {
    let questions = getVisualQuestions();
    
    const questionToDelete = questions.find(q => q.id === questionId);
    
    if (questionToDelete && questionToDelete.imageData) {
        if (window.firebaseUtils && window.firebaseUtils.isFirebaseUrl) {
            const isFirebaseImage = window.firebaseUtils.isFirebaseUrl(questionToDelete.imageData);
            
            if (isFirebaseImage) {
                try {
                    console.log('Deleting image from Firebase Storage...');
                    const deleted = await window.firebaseUtils.deleteImageFromFirebase(questionToDelete.imageData);
                    if (deleted) {
                        console.log('Image successfully deleted from Firebase Storage');
                    } else {
                        console.warn('Failed to delete image from Firebase, but continuing with local deletion');
                    }
                } catch (error) {
                    console.error('Error deleting from Firebase:', error);
                }
            }
        }
    }
    
    questions = questions.filter(q => q.id !== questionId);
    saveVisualQuestions(questions);
    displayVisualQuestions();
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
 * Display all visual questions in the visual list
 */
function displayVisualQuestions() {
    const questions = getVisualQuestions();
    const questionList = $('#visual-list');
    const noQuestionsMessage = $('#no-visual-message');
    
    questionList.empty();
    
    if (questions.length === 0) {
        noQuestionsMessage.show();
        return;
    }
    
    noQuestionsMessage.hide();
    
    questions.forEach((question, index) => {
        const questionHtml = `
            <div class="question-item visual-item" data-id="${question.id}">
                <div class="question-item-header">
                    <div class="question-number">🖼️ Visual #${index + 1}</div>
                    <button class="question-delete-btn" onclick="deleteVisualQuestionById(${question.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                ${question.imageData ? `
                    <div class="question-image" style="text-align: center; margin: 10px 0;">
                        <img src="${question.imageData}" alt="Gambar Soal" style="max-width: 100%; max-height: 150px; border-radius: 8px; border: 2px solid #A2529A;">
                    </div>
                ` : ''}
                <div class="question-text">
                    <strong>Pertanyaan:</strong> ${escapeHtml(question.question)}
                </div>
                <div class="question-answer">
                    <strong>Jawaban Benar:</strong> ${escapeHtml(question.answer)}
                </div>
                ${question.choices && question.choices.length > 0 && question.choices.some(c => c.trim() !== '') ? `
                    <div class="question-choices">
                        <strong>Pilihan Jawaban:</strong>
                        ${question.choices.filter(c => c.trim() !== '').map((choice, i) => `
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
 * Delete visual question by ID (called from onclick)
 * Handles async deletion including Firebase Storage cleanup
 * @param {number} questionId - ID of question to delete
 */
async function deleteVisualQuestionById(questionId) {
    try {
        await deleteVisualQuestion(questionId);
        if (typeof showNotification === 'function') {
            showNotification('Soal visual berhasil dihapus!');
        }
    } catch (error) {
        console.error('Error deleting visual question:', error);
        if (typeof showNotification === 'function') {
            showNotification('Gagal menghapus soal. Silakan coba lagi.');
        }
    }
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
    displayVisualQuestions();
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
 * Show modal for adding visual question
 */
function showAddVisualModal() {
    $('#modal-tambah-visual').addClass('modal_open');
    resetVisualUploadState();
}

/**
 * Hide modal for adding visual question
 */
function hideAddVisualModal() {
    $('#modal-tambah-visual').removeClass('modal_open');
    $('#form-tambah-visual')[0].reset();
    resetVisualUploadState();
}

/**
 * Reset visual upload state
 */
function resetVisualUploadState() {
    currentVisualFile = null;
    currentVisualBase64 = null;
    $('#dropzone-content').show();
    $('#dropzone-preview').hide();
    $('#img-preview-visual').attr('src', '');
    $('#upload-progress').hide();
    $('#progress-bar-fill').css('width', '0%');
    $('#submit-text').show();
    $('#submit-loading').hide();
    $('input[name="jawaban-benar-visual"]').prop('checked', false);
}

let currentVisualFile = null;
let currentVisualBase64 = null;

/**
 * Handle file selection for visual upload
 */
function handleVisualFileSelect(file) {
    if (!file) return;
    
    const validation = window.firebaseUtils.validateImageFile(file);
    if (!validation.valid) {
        showNotification(validation.error);
        return;
    }
    
    currentVisualFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentVisualBase64 = e.target.result;
        $('#img-preview-visual').attr('src', e.target.result);
        $('#dropzone-content').hide();
        $('#dropzone-preview').show();
    };
    reader.readAsDataURL(file);
}

/**
 * Remove selected image
 */
function removeVisualImage() {
    currentVisualFile = null;
    currentVisualBase64 = null;
    $('#dropzone-content').show();
    $('#dropzone-preview').hide();
    $('#img-preview-visual').attr('src', '');
    $('#input-gambar-visual').val('');
}

/**
 * Show upload progress
 */
function showUploadProgress(percent, text) {
    $('#upload-progress').show();
    $('#progress-bar-fill').css('width', percent + '%');
    $('#progress-text').text(text || 'Uploading...');
}

/**
 * Hide upload progress
 */
function hideUploadProgress() {
    $('#upload-progress').hide();
    $('#progress-bar-fill').css('width', '0%');
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

/**
 * Handle form submission to add new visual question
 */
async function handleAddVisual(event) {
    event.preventDefault();
    
    const question = $('#input-pertanyaan-visual').val().trim() || 'Soal Visual';
    const selectedAnswer = $('input[name="jawaban-benar-visual"]:checked').val();
    const choices = [
        $('#input-pilihan-visual-1').val().trim(),
        $('#input-pilihan-visual-2').val().trim(),
        $('#input-pilihan-visual-3').val().trim(),
        $('#input-pilihan-visual-4').val().trim()
    ];
    
    if (!currentVisualBase64) {
        showNotification('Gambar harus di-upload untuk soal visual!');
        return;
    }
    
    if (choices.some(choice => choice === '')) {
        showNotification('Semua pilihan jawaban (A, B, C, D) harus diisi!');
        return;
    }
    
    if (!selectedAnswer) {
        showNotification('Pilih jawaban yang benar (A, B, C, atau D)!');
        return;
    }
    
    $('#submit-text').hide();
    $('#submit-loading').show();
    $('#btn-submit-visual').prop('disabled', true);
    
    let imageUrl = currentVisualBase64;
    const questionId = Date.now();
    
    if (currentVisualFile && window.firebaseUtils.isFirebaseConfigured()) {
        showUploadProgress(30, 'Mengunggah ke Firebase...');
        
        try {
            const uploadedUrl = await window.firebaseUtils.uploadImageToFirebase(currentVisualFile, questionId);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
                showUploadProgress(100, 'Upload selesai!');
            } else {
                showUploadProgress(100, 'Menggunakan penyimpanan lokal...');
            }
        } catch (error) {
            console.error('Firebase upload error:', error);
            showUploadProgress(100, 'Menggunakan penyimpanan lokal...');
        }
    } else {
        showUploadProgress(100, 'Menyimpan...');
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const answerIndex = selectedAnswer.charCodeAt(0) - 65;
    const correctAnswerText = choices[answerIndex];
    
    const questionObj = {
        id: questionId,
        question: question,
        answer: selectedAnswer,
        answerText: correctAnswerText,
        imageData: imageUrl,
        choices: choices,
        isFirebaseImage: imageUrl.includes('firebase')
    };
    
    const questions = getVisualQuestions();
    questionObj.type = 'visual';
    questions.push(questionObj);
    saveVisualQuestions(questions);
    displayVisualQuestions();
    
    hideUploadProgress();
    $('#submit-text').show();
    $('#submit-loading').hide();
    $('#btn-submit-visual').prop('disabled', false);
    
    hideAddVisualModal();
    showNotification('Soal visual berhasil ditambahkan!');
}

/**
 * Handle image preview for visual question (legacy - kept for compatibility)
 */
function handleImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
        handleVisualFileSelect(file);
    }
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
    $('#btn-tambah-visual').on('click', showAddVisualModal);
    
    // Buttons to cancel/close modals
    $('#btn-batal-essay').on('click', hideAddEssayModal);
    $('#btn-batal-pilgan').on('click', hideAddPilganModal);
    $('#btn-batal-visual').on('click', hideAddVisualModal);
    
    // Button to close notification modal
    $('#btn-close-notification').on('click', hideNotification);
    
    // Form submissions
    $('#form-tambah-essay').on('submit', handleAddEssay);
    $('#form-tambah-pilgan').on('submit', handleAddPilgan);
    $('#form-tambah-visual').on('submit', handleAddVisual);
    
    // Image preview for visual question (file input)
    $('#input-gambar-visual').on('change', handleImagePreview);
    
    // Visual Dropzone - Click to select file (using native click for better mobile support)
    $('#visual-dropzone').on('click', function(e) {
        if (e.target.id !== 'btn-remove-image' && !$(e.target).closest('#btn-remove-image').length) {
            // Use native click() for better mobile/cross-browser support
            var fileInput = document.getElementById('input-gambar-visual');
            if (fileInput) {
                fileInput.click();
            }
        }
    });
    
    // Also add touchend for mobile devices
    $('#visual-dropzone').on('touchend', function(e) {
        if (e.target.id !== 'btn-remove-image' && !$(e.target).closest('#btn-remove-image').length) {
            e.preventDefault();
            var fileInput = document.getElementById('input-gambar-visual');
            if (fileInput) {
                fileInput.click();
            }
        }
    });
    
    // Visual Dropzone - Drag and Drop
    const dropzone = document.getElementById('visual-dropzone');
    
    if (dropzone) {
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('dragover');
        });
        
        dropzone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('dragover');
        });
        
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleVisualFileSelect(files[0]);
            }
        });
    }
    
    // Remove image button
    $('#btn-remove-image').on('click', function(e) {
        e.stopPropagation();
        removeVisualImage();
    });
    
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
    
    $('#modal-tambah-visual').on('click', function(e) {
        if (e.target.id === 'modal-tambah-visual') {
            hideAddVisualModal();
        }
    });
    
    // Close notification modal when clicking outside
    $('#notification-modal').on('click', function(e) {
        if (e.target.id === 'notification-modal') {
            hideNotification();
        }
    });
    
    // Initialize Firebase when page loads
    if (window.firebaseUtils && window.firebaseUtils.isFirebaseConfigured()) {
        window.firebaseUtils.initializeFirebase().then(function(success) {
            if (success) {
                console.log('🔥 Firebase ready for visual uploads');
            }
        });
    }
});
