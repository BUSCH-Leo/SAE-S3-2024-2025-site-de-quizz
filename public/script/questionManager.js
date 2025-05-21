import { setupQuestionEventListeners, setupAnswerEventListeners, toggleCorrectAnswer } from '../utils/eventHandler.js';
import { getAnswersFromUI, getCorrectAnswerFromUI } from '../utils/uiManager.js';
import { updateLayout } from '../utils/questionUtils.js';
import { submitQuiz } from '../utils/quizSubmiter.js';
import { getMultipleChoiceTemplate, getTrueFalseTemplate, getPriceTemplate } from '../components/questionTypes.js';

document.addEventListener('DOMContentLoaded', function() {
        const mainContent = document.querySelector('.main-content');
        const leftPanel = document.querySelector('.left-panel');
        const rightPanel = document.querySelector('.right-panel');
        const loadingIndicator = document.getElementById('loading-indicator');
        if (mainContent) mainContent.style.display = 'none';
        if (leftPanel) leftPanel.style.display = 'none';
        if (rightPanel) rightPanel.style.display = 'none';
        if (loadingIndicator) loadingIndicator.style.display = 'flex';
    class QuizEditor {
        constructor() {
            this.questionData = [];
            this.currentQuestionIndex = null;
            this.initializeElements();
            this.bindEvents();
            this.addNewQuestion();
            this.setupProjectDataListener();
            this.dataLoadTimeout = setTimeout(() => {
                this.showInterface();
                this.addNewQuestion();
            }, 3000);
        }
        showInterface() {
            if (this.dataLoadTimeout) {
                clearTimeout(this.dataLoadTimeout);
                this.dataLoadTimeout = null;
            }
            
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            if (leftPanel) leftPanel.style.display = 'block';
            if (rightPanel) rightPanel.style.display = 'block';
        }

        initializeElements() {
            this.addQuestionBtn = document.getElementById('addQuestionBtn');
            this.questionsList = document.getElementById('questionsList');
            this.questionInput = document.querySelector('.main-content input[type="text"]');
            this.answerOptionsContainer = document.getElementById('answerOptionsContainer');
            this.mediaUpload = document.getElementById('media-upload-question');
            this.fileInput = document.getElementById('file-input');
            this.imagePreview = document.getElementById('imagePreview');
            this.timeSlider = document.getElementById('timeSlider');
            this.timeDisplay = document.getElementById('timeDisplay');
            this.addOptionBtn = document.getElementById('addOptionBtn');
            this.submitQuizBtn = document.getElementById('submit-quiz');
            this.themeManager = themeManager;
            this.questionTypeButtons = {
                multiple: document.getElementById('multipleChoiceBtn'),
                truefalse: document.getElementById('truefalseBtn'),
                price: document.getElementById('priceBtn'),
                standart: document.getElementById('standartBtn')
            };
        }

        setupProjectDataListener() {
            document.addEventListener('projectDataLoaded', (event) => {
                const projectData = event.detail;
                this.loadProjectData(projectData);
                this.showInterface();
            });
        }

        loadProjectData(projectData) {
            if (projectData.questions && projectData.questions.length > 0) {
                this.questionData = projectData.questions.map(q => ({
                    text: q.questionText || q.text || '',
                    type: q.type || 'multiple',
                    answers: q.answerOptions || [],
                    media: q.mediaUrl || q.media || '',
                    time: q.timeLimit || q.time || 30,
                    points: q.points || 10
                }));
                
                this.currentQuestionIndex = 0;
                this.loadQuestion(0);
                this.renderQuestionsList();
                this.highlightSelectedQuestion();
            }
            else {
                this.addNewQuestion();
            }

            // Charger les paramètres généraux si présents
            if (projectData.theme) {
                document.body.style.backgroundImage = `url(${projectData.theme})`;
            }
            if (projectData.font) {
                document.body.style.fontFamily = projectData.font;
            }
            if (projectData.points) {
                document.getElementById('defaultPoints').value = projectData.points;
            }
            if (projectData.enableTimeBonus !== undefined) {
                document.getElementById('enableBonus').checked = projectData.enableTimeBonus;
            }
        }

        bindEvents() {
            setupQuestionEventListeners(this);
        }

        addNewQuestion() {
            this.saveCurrentQuestion();
            const newQuestion = {
                text: "",
                type: 'multiple',
                answers: [],
                media: null,
                time: 30
            };
            this.questionData.push(newQuestion);
            this.currentQuestionIndex = this.questionData.length - 1;
            this.resetQuestionEditor();
            this.renderQuestionsList();
            this.highlightSelectedQuestion();
        }

        setQuestionType(type) {
            if (this.currentQuestionIndex !== null) {

                Object.values(this.questionTypeButtons).forEach(button => {
                    button.classList.remove('active');
                });
                
                if (this.questionTypeButtons[type]) {
                    this.questionTypeButtons[type].classList.add('active');
                }
                
                this.questionData[this.currentQuestionIndex].type = type;
                this.updateLayout();
                this.saveCurrentQuestion();
            }
        }

        updateLayout() {
            const currentQuestion = this.questionData[this.currentQuestionIndex];
            updateLayout(this.answerOptionsContainer, currentQuestion.type, currentQuestion.answers);
            this.initializeAnswerEventListeners();
        }

        addAnswerOption() {
            const currentQuestion = this.questionData[this.currentQuestionIndex];
            if (currentQuestion.type === 'truefalse' || currentQuestion.type === 'price') {
            this.addOptionBtn.style.display = 'none';
            return;
            }
            
            const currentOptions = this.answerOptionsContainer.querySelectorAll('.answer-option').length;
            if (currentOptions < 6) {
            this.answerOptionsContainer.innerHTML += getMultipleChoiceTemplate(currentOptions + 1);
            this.initializeAnswerEventListeners();
            this.updateAddOptionButtonVisibility();
            this.saveCurrentQuestion();
            }
        }

        updateAddOptionButtonVisibility() {
            const currentQuestion = this.questionData[this.currentQuestionIndex];

            if (currentQuestion.type === 'truefalse' || currentQuestion.type === 'price') {
                this.addOptionBtn.style.display = 'none';
                return;
            }

            const currentOptions = this.answerOptionsContainer.querySelectorAll('.answer-option').length;
            this.addOptionBtn.style.display = currentOptions < 6 ? 'block' : 'none';
        }


        initializeAnswerEventListeners() {
            setupAnswerEventListeners(this);
        }

        toggleCorrectAnswer(e) {
            const currentQuestion = this.questionData[this.currentQuestionIndex];
            toggleCorrectAnswer(e, currentQuestion.type, this.answerOptionsContainer);
            this.saveCurrentQuestion();
        }

        deleteAnswerOption(e) {
            e.currentTarget.closest('.answer-option').remove();
            this.updateAnswerNumbers();
            this.updateAddOptionButtonVisibility();
            this.saveCurrentQuestion();
        }

        updateAnswerNumbers() {
            this.answerOptionsContainer.querySelectorAll('.answer-option input[type="text"]').forEach((input, index) => {
                input.placeholder = `Réponse ${index + 1}`;
            });
        }

        resetQuestionEditor() {
            this.questionInput.value = "";
            this.answerOptionsContainer.innerHTML = "";
            this.resetMediaUpload();
            this.timeSlider.value = 30;
            this.timeDisplay.textContent = "30s";
            this.setQuestionType('multiple');
        }

        resetMediaUpload() {
            this.imagePreview.innerHTML = "";
            this.fileInput.value = "";
            this.mediaUpload.classList.remove('has-file');
        }

        saveCurrentQuestion() {
            if (this.currentQuestionIndex !== null) {
                const currentQuestion = this.questionData[this.currentQuestionIndex];
                currentQuestion.text = this.questionInput.value;
                currentQuestion.time = parseInt(this.timeSlider.value);
                currentQuestion.answers = getAnswersFromUI(currentQuestion.type, this.answerOptionsContainer);
                currentQuestion.points = this.getPointsFromUI();
                currentQuestion.media = this.getMediaFromUI();
                currentQuestion.correctAnswer = getCorrectAnswerFromUI(currentQuestion.type, this.answerOptionsContainer);
        
                this.renderQuestionsList();
                this.updateAddOptionButtonVisibility();
            }
        }

        loadQuestion(index) {
            const question = this.questionData[index];
            this.currentQuestionIndex = index;
        
            document.querySelector('.main-content').classList.add('opacity-0');
        
            setTimeout(() => {
                this.questionInput.value = question.text || '';
                this.timeSlider.value = question.time || 30;
                this.timeDisplay.textContent = `${question.time || 30}s`;
        
                this.resetMediaUpload();
                if (question.media) {
                    this.imagePreview.innerHTML = `<img src="${question.media}" class="max-w-full h-auto rounded">`;
                    this.mediaUpload.classList.add('has-file');
                }

                Object.entries(this.questionTypeButtons).forEach(([type, button]) => {
                    if (type === question.type) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                });
        
                this.updateLayout();
        
                if (question.type === 'truefalse' || question.type === 'price') {
                    this.addOptionBtn.style.display = 'none';
                } else {
                    this.addOptionBtn.style.display = 'block';
                }
        
                document.querySelector('.main-content').classList.remove('opacity-0');
            }, 300);
        }

        renderQuestionsList() {
            this.questionsList.innerHTML = "";
            this.questionData.forEach((question, index) => {
                const questionCard = document.createElement('div');
                questionCard.className = `question-card p-4 cursor-pointer border hover:border-blue-500 relative shadow-md rounded-lg transition-all duration-300 ${index === this.currentQuestionIndex ? 'border-blue-500' : ''}`;
                questionCard.dataset.questionId = index;

                questionCard.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-medium">Question ${index + 1}</span>
                        <div class="flex gap-2">
                            <button class="delete-question text-red-500 hover:text-red-700 transition-colors duration-300">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 truncate">${question.text || "Nouvelle question"}</p>
                `;

                questionCard.addEventListener('click', () => {
                    this.saveCurrentQuestion();
                    this.currentQuestionIndex = index;
                    this.loadQuestion(index);
                    this.highlightSelectedQuestion();
                });

                questionCard.querySelector('.delete-question').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteQuestion(index);
                });

                this.questionsList.appendChild(questionCard);
            });
        }

        deleteQuestion(index) {
            this.questionData.splice(index, 1);
            if (this.questionData.length === 0) {
                this.currentQuestionIndex = null;
                this.resetQuestionEditor();
            } else {
                this.currentQuestionIndex = Math.min(index, this.questionData.length - 1);
                this.loadQuestion(this.currentQuestionIndex);
            }
            this.renderQuestionsList();
        }

        highlightSelectedQuestion() {
            const questionCards = this.questionsList.querySelectorAll('.question-card');
            questionCards.forEach((card, index) => {
                if (index === this.currentQuestionIndex) {
                    card.classList.add('border-blue-500');
                } else {
                    card.classList.remove('border-blue-500');
                }
            });
        }

        handleFileUpload(e) {
            const file = e.target.files[0];
            if (file) {
                this.fileInput.value = '';
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '100%';
                    img.style.objectFit = 'cover';
                    this.imagePreview.appendChild(img);
                    this.mediaUpload.classList.add('has-file');
                    
                    if (this.currentQuestionIndex !== null) {
                        this.questionData[this.currentQuestionIndex].media = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            } else {
                this.imagePreview.innerHTML = '';
                this.mediaUpload.classList.remove('has-file');
                if (this.currentQuestionIndex !== null) {
                    this.questionData[this.currentQuestionIndex].media = null;
                }
            }
        }

        updateTimeDisplay() {
            this.timeDisplay.textContent = `${this.timeSlider.value}s`;
            this.saveCurrentQuestion();
        }

        submitQuiz() {
            submitQuiz(this.questionData, this.themeManager)
                .then(data => {
                    window.location.href = '/jouer_page';
                })
                .catch(error => {
                    console.error('Error submitting quiz:', error);
                    alert('Une erreur est survenue lors de la soumission du quiz.');
                });
        }

        getPointsFromUI() {
            return parseInt(document.getElementById('defaultPoints').value) || 10;
        }
    
        getMediaFromUI() {
            const mediaElement = this.imagePreview.querySelector('img');
            return mediaElement ? mediaElement.src : '';
        }
    }

    const quizEditor = new QuizEditor();
});

