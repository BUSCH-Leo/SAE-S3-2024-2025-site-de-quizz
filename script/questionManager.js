document.addEventListener('DOMContentLoaded', function() {
    class QuizEditor {
        constructor() {
            this.questionData = [];
            this.currentQuestionIndex = null;
            this.initializeElements();
            this.bindEvents();
            this.addNewQuestion();
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

        bindEvents() {
            this.addQuestionBtn.addEventListener('click', () => this.addNewQuestion());
            this.addOptionBtn.addEventListener('click', () => this.addAnswerOption());
            this.questionInput.addEventListener('input', () => this.saveCurrentQuestion());
            this.timeSlider.addEventListener('input', () => this.updateTimeDisplay());
            this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
            this.submitQuizBtn.addEventListener('click', () => this.submitQuiz());

            Object.entries(this.questionTypeButtons).forEach(([type, button]) => {
                button.addEventListener('click', () => this.setQuestionType(type));
            });
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
                this.questionData[this.currentQuestionIndex].type = type;
                this.updateLayout();
                this.saveCurrentQuestion();
            }
        }

        updateLayout() {
            this.answerOptionsContainer.innerHTML = '';
        
            switch (this.questionData[this.currentQuestionIndex].type) {
                case 'multiple':
                case 'standart':
                    for (let i = 1; i <= 4; i++) {
                        this.answerOptionsContainer.innerHTML += this.getMultipleChoiceTemplate(i);
                    }
                    this.addOptionBtn.style.display = 'block';
                    break;
        
                case 'truefalse':
                    this.answerOptionsContainer.innerHTML = this.getTrueFalseTemplate();
                    this.addOptionBtn.style.display = 'none';
                    break;
        
                case 'price':
                    this.answerOptionsContainer.innerHTML = this.getPriceTemplate();
                    this.addOptionBtn.style.display = 'none';
                    break;
            }
        
            this.initializeAnswerEventListeners();
        }

        getMultipleChoiceTemplate(index, text = "", isCorrect = false) {
            return `
                <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                    <div class="flex-1">
                        <input type="text" placeholder="Réponse ${index}" value="${text}" class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                    </div>
                    <button class="p-2 ${isCorrect ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                        <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
                    </button>
                    <button class="p-2 text-red-500 hover:text-red-700 rounded delete-option transition-colors duration-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }

        getTrueFalseTemplate(trueIsCorrect = false, falseIsCorrect = false) {
            return `
                <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                    <div class="flex-1">
                        <div class="w-full p-2 border rounded-lg text-center">Vrai</div>
                    </div>
                    <button class="p-2 ${trueIsCorrect ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                        <i class="fas ${trueIsCorrect ? 'fa-check' : 'fa-times'}"></i>
                    </button>
                </div>
                <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                    <div class="flex-1">
                        <div class="w-full p-2 border rounded-lg text-center">Faux</div>
                    </div>
                    <button class="p-2 ${falseIsCorrect ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                        <i class="fas ${falseIsCorrect ? 'fa-check' : 'fa-times'}"></i>
                    </button>
                </div>
            `;
        }

        getPriceTemplate(price = "") {
            return `
                <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                    <div class="flex-1">
                        <input type="number" placeholder="Prix correct" value="${price}" class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                    </div>
                </div>
            `;
        }

        addAnswerOption() {
            const currentOptions = this.answerOptionsContainer.querySelectorAll('.answer-option').length;
            if (currentOptions < 6) {
                this.answerOptionsContainer.innerHTML += this.getMultipleChoiceTemplate(currentOptions + 1);
                this.initializeAnswerEventListeners();
                this.updateAddOptionButtonVisibility();
                this.saveCurrentQuestion();
            }
        }

        updateAddOptionButtonVisibility() {
            const currentOptions = this.answerOptionsContainer.querySelectorAll('.answer-option').length;
            this.addOptionBtn.style.display = currentOptions < 6 ? 'block' : 'none';
        }

        initializeAnswerEventListeners() {
            this.answerOptionsContainer.querySelectorAll('.correct-toggle').forEach(button => {
                button.addEventListener('click', (e) => this.toggleCorrectAnswer(e));
            });

            this.answerOptionsContainer.querySelectorAll('.delete-option').forEach(button => {
                button.addEventListener('click', (e) => this.deleteAnswerOption(e));
            });

            this.answerOptionsContainer.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', () => this.saveCurrentQuestion());
            });
        }

        toggleCorrectAnswer(e) {
            const currentQuestion = this.questionData[this.currentQuestionIndex];
            const icon = e.currentTarget.querySelector('i');

            if (currentQuestion.type === 'truefalse' || currentQuestion.type === 'standart') {
                this.answerOptionsContainer.querySelectorAll('.correct-toggle').forEach(btn => {
                    const otherIcon = btn.querySelector('i');
                    otherIcon.classList.replace('fa-check', 'fa-times');
                    btn.classList.remove('text-green-500');
                    btn.classList.add('text-gray-400');
                });
            }

            if (icon.classList.contains('fa-times')) {
                icon.classList.replace('fa-times', 'fa-check');
                e.currentTarget.classList.remove('text-gray-400');
                e.currentTarget.classList.add('text-green-500');
            } else {
                icon.classList.replace('fa-check', 'fa-times');
                e.currentTarget.classList.remove('text-green-500');
                e.currentTarget.classList.add('text-gray-400');
            }

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
                currentQuestion.answers = this.getAnswersFromUI();
                currentQuestion.points = this.getPointsFromUI();
                currentQuestion.media = this.getMediaFromUI();
                currentQuestion.correctAnswer = this.getCorrectAnswerFromUI();
        
                this.renderQuestionsList();
                this.updateAddOptionButtonVisibility();
                this.showSavedFeedback();
            }
        }

        getAnswersFromUI() {
            const currentQuestion = this.questionData[this.currentQuestionIndex];
            switch (currentQuestion.type) {
                case 'multiple':
                case 'standart':
                    return Array.from(this.answerOptionsContainer.children).map((optionDiv, index) => ({
                        text: optionDiv.querySelector('input').value,
                        index,
                        isCorrect: optionDiv.querySelector('.correct-toggle').classList.contains('text-green-500')
                    }));
                case 'truefalse':
                    return Array.from(this.answerOptionsContainer.children).map((optionDiv, index) => ({
                        text: optionDiv.querySelector('.text-center').textContent.trim(),
                        index,
                        isCorrect: optionDiv.querySelector('.correct-toggle').classList.contains('text-green-500')
                    }));
                case 'price':
                    const priceInput = this.answerOptionsContainer.querySelector('input[type="number"]');
                    return [{
                        text: priceInput.value,
                        isCorrect: true
                    }];
            }
        }

        showSavedFeedback() {
            const feedbackEl = document.createElement('div');
            feedbackEl.textContent = 'Sauvegardé';
            feedbackEl.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full opacity-0 transition-opacity duration-300';
            document.body.appendChild(feedbackEl);

            setTimeout(() => {
                feedbackEl.classList.remove('opacity-0');
            }, 100);

            setTimeout(() => {
                feedbackEl.classList.add('opacity-0');
                setTimeout(() => {
                    feedbackEl.remove();
                }, 300);
            }, 2000);
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
        
                // Update question type and layout
                Object.entries(this.questionTypeButtons).forEach(([type, button]) => {
                    if (type === question.type) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                });
        
                this.updateLayout();
        
                // Restore answers and correct states
                question.answers.forEach((answer, index) => {
                    const optionDiv = this.answerOptionsContainer.children[index];
                    if (optionDiv) {
                        const input = optionDiv.querySelector('input');
                        if (input) {
                            input.value = answer.text;
                        }
                        const correctToggle = optionDiv.querySelector('.correct-toggle');
                        if (correctToggle) {
                            const icon = correctToggle.querySelector('i');
                            if (answer.isCorrect) {
                                icon.classList.replace('fa-times', 'fa-check');
                                correctToggle.classList.add('text-green-500');
                                correctToggle.classList.remove('text-gray-400');
                            } else {
                                icon.classList.replace('fa-check', 'fa-times');
                                correctToggle.classList.add('text-gray-400');
                                correctToggle.classList.remove('text-green-500');
                            }
                        }
                    }
                });
        
                // Update the visibility of the add option button
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
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview.innerHTML = `<img src="${e.target.result}" class="max-w-full h-auto rounded">`;
                    this.mediaUpload.classList.add('has-file');
                    this.saveCurrentQuestion();
                };
                reader.readAsDataURL(file);
            }
        }

        updateTimeDisplay() {
            this.timeDisplay.textContent = `${this.timeSlider.value}s`;
            this.saveCurrentQuestion();
        }

        submitQuiz() {
            const projectId = new URLSearchParams(window.location.search).get('projectId');
            if (!projectId) {
                alert('Project ID is missing in the URL');
                return;
            }
        
            // Vérifiez et complétez les données des questions
            const completeQuestionData = this.questionData.map(question => {
                const formattedQuestion = {
                    ...question,
                    questionText: question.text || 'Question sans texte',
                    mediaUrl: question.media || '',
                    mediaType: question.media ? 'image' : '',
                    timeLimit: question.time || 30,
                    points: question.points || 10,
                    correctAnswer: question.correctAnswer,
                    answerOptions: question.answers || []
                };
        
                // Supprimer les champs inutiles selon le type de question
                if (question.type !== 'truefalse') {
                    delete formattedQuestion.correctAnswer;
                }
                if (question.type !== 'price') {
                    delete formattedQuestion.correctPrice;
                }
                if (question.type === 'price') {
                    formattedQuestion.correctPrice = parseFloat(question.correctPrice) || 0;
                }
                if (question.type === 'multiple' || question.type === 'standart') {
                    formattedQuestion.answerOptions = question.answers.map(answer => ({
                        text: answer.text,
                        isCorrect: answer.isCorrect
                    }));
                }
        
                return formattedQuestion;
            });
        
            // Récupérer les paramètres généraux
            const generalParams = {
                theme: themeManager.currentTheme.url,
                font: document.body.style.fontFamily || 'Arial',
                points: parseInt(document.getElementById('defaultPoints').value) || 10,
                enableTimeBonus: document.getElementById('enableBonus').checked
            };
        
            const quizData = {
                ...generalParams,
                questions: completeQuestionData
            };
        
            fetch(`/quizzes/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(`Error: ${data.error}`);
                } else {
                    alert('Quiz submitted successfully!');
                }
            })
            .catch(error => {
                console.error('Error submitting quiz:', error);
                alert('An error occurred while submitting the quiz.');
            });
        }
        getPointsFromUI() {
            return parseInt(document.getElementById('defaultPoints').value) || 10;
        }
    
        getMediaFromUI() {
            const mediaElement = this.imagePreview.querySelector('img');
            return mediaElement ? mediaElement.src : '';
        }
        getMediaFromUI() {
            const mediaElement = this.imagePreview.querySelector('img');
            return mediaElement ? mediaElement.src : '';
        }
        
        getCorrectAnswerFromUI() {
            const currentQuestion = this.questionData[this.currentQuestionIndex];
            if (currentQuestion.type === 'multiple') {
                return this.answerOptionsContainer.querySelectorAll('.correct-toggle .fa-check').length > 0;
            } else if (currentQuestion.type === 'truefalse') {
                const trueButton = this.answerOptionsContainer.querySelector('.answer-option:nth-child(1) .correct-toggle .fa-check');
                return !!trueButton;
            }
            return false;
        }

        

    }

    const quizEditor = new QuizEditor();
});