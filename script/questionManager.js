
// questionManager.js
document.addEventListener('DOMContentLoaded', function () {
    let questionData = [];
    let currentQuestionIndex = null;

    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionsList = document.getElementById('questionsList');
    const questionInput = document.querySelector('.main-content input[type="text"]');
    const answerOptionsContainer = document.getElementById('answerOptionsContainer');
    const timeSlider = document.getElementById('timeSlider');
    const timeDisplay = document.getElementById('timeDisplay');
    const defaultPoints = document.getElementById('defaultPoints');
    const enableBonus = document.getElementById('enableBonus');

    // État initial par défaut pour une nouvelle question
    const defaultQuestionState = {
        text: "",
        type: 'multiple',
        timeLimit: 30,
        points: 10,
        enableTimeBonus: false,
        answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
        ],
        media: null,
        theme: null
    };

    function resetQuestionState() {
        // Réinitialiser le texte de la question
        questionInput.value = "";

        // Réinitialiser le timer
        timeSlider.value = 30;
        timeDisplay.textContent = "30s";

        // Réinitialiser la zone de média
        const mediaUpload = document.querySelector('.media-upload');
        if (mediaUpload) {
            mediaUpload.innerHTML = `
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                <p class="text-gray-600">Déposez les fichiers média ici ou</p>
                <button class="text-blue-500 hover:text-blue-700 transition-colors duration-300">Parcourir les fichiers</button>
            `;
        }

        // Réinitialiser les points par défaut
        defaultPoints.value = 10;
        enableBonus.checked = false;

        // Réinitialiser le type de question à 'multiple'
        if (window.questionManager) {
            window.questionManager.setType('multiple');
        }

        // Réinitialiser les options de réponse
        answerOptionsContainer.innerHTML = "";
        defaultQuestionState.answers.forEach((_, index) => {
            addAnswerOption(`Réponse ${index + 1}`, index);
        });
    }

    function addAnswerOption(placeholder, index, isCorrect = false) {
        const answerOptionDiv = document.createElement('div');
        answerOptionDiv.className = 'answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg';
    
        answerOptionDiv.innerHTML = `   
            <div class="flex-1">
                <input type="text" placeholder="${placeholder}" class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
            </div>
            <button class="p-2 ${isCorrect ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
            </button>
            <button class="p-2 text-red-500 hover:text-red-700 rounded delete-option transition-colors duration-300">
                <i class="fas fa-trash"></i>
            </button>
        `;
    
        answerOptionsContainer.appendChild(answerOptionDiv);
    
        const correctToggle = answerOptionDiv.querySelector('.correct-toggle');
        const deleteOption = answerOptionDiv.querySelector('.delete-option');
    
        correctToggle.addEventListener('click', () => toggleCorrectOption(correctToggle));
        deleteOption.addEventListener('click', () => {
            answerOptionDiv.remove();
            if (window.questionManager) {
                window.questionManager.updateOptionNumbers();
            }
        });
    }

    function toggleCorrectOption(button) {
        const icon = button.querySelector('i');
        const isNowCorrect = icon.classList.contains('fa-times');
        
        if (window.questionManager && 
            (window.questionManager.currentType === 'truefalse' || 
             window.questionManager.currentType === 'standart')) {
            // Désactiver toutes les autres options
            answerOptionsContainer.querySelectorAll('.correct-toggle').forEach(toggle => {
                const toggleIcon = toggle.querySelector('i');
                toggleIcon.classList.replace('fa-check', 'fa-times');
                toggle.classList.remove('text-green-500');
                toggle.classList.add('text-gray-400');
            });
        }

        if (isNowCorrect) {
            icon.classList.replace('fa-times', 'fa-check');
            button.classList.remove('text-gray-400');
            button.classList.add('text-green-500');
        } else {
            icon.classList.replace('fa-check', 'fa-times');
            button.classList.remove('text-green-500');
            button.classList.add('text-gray-400');
        }
    }

    function saveCurrentQuestion() {
        if (currentQuestionIndex === null) return;

        const currentQuestion = questionData[currentQuestionIndex];
        currentQuestion.text = questionInput.value;
        currentQuestion.type = window.questionManager ? window.questionManager.currentType : 'multiple';
        currentQuestion.timeLimit = parseInt(timeSlider.value);
        currentQuestion.points = parseInt(defaultPoints.value);
        currentQuestion.enableTimeBonus = enableBonus.checked;
        
        currentQuestion.answers = Array.from(answerOptionsContainer.children).map((optionDiv, index) => {
            const input = optionDiv.querySelector('input');
            const correctToggle = optionDiv.querySelector('.correct-toggle');
            return {
                text: input ? input.value : optionDiv.querySelector('.w-full').textContent.trim(),
                index,
                isCorrect: correctToggle.classList.contains('text-green-500')
            };
        });

        if (window.themeManager) {
            currentQuestion.theme = window.themeManager.currentTheme.url;
        }

        renderQuestionsList();
    }

    function renderQuestionsList() {
        questionsList.innerHTML = "";
        questionData.forEach((question, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = `question-card p-4 cursor-pointer border hover:border-blue-500 relative shadow-md rounded-lg transition-all duration-300 ${index === currentQuestionIndex ? 'border-blue-500' : ''}`;
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

            questionCard.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-question')) {
                    saveCurrentQuestion();
                    currentQuestionIndex = index;
                    loadQuestion(index);
                }
            });

            questionCard.querySelector('.delete-question').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteQuestion(index);
            });

            questionsList.appendChild(questionCard);
        });
    }

    function loadQuestion(index) {
        const question = questionData[index];
        
        // Charger les données de base
        questionInput.value = question.text || "";
        timeSlider.value = question.timeLimit || 30;
        timeDisplay.textContent = `${timeSlider.value}s`;
        defaultPoints.value = question.points || 10;
        enableBonus.checked = question.enableTimeBonus || false;

        // Charger le type de question
        if (window.questionManager) {
            window.questionManager.setType(question.type || 'multiple');
            
            // Mettre à jour les réponses après que le layout soit mis à jour
            setTimeout(() => {
                const inputs = answerOptionsContainer.querySelectorAll('input[type="text"]');
                const correctToggles = answerOptionsContainer.querySelectorAll('.correct-toggle');
                
                question.answers.forEach((answer, idx) => {
                    if (inputs[idx]) {
                        inputs[idx].value = answer.text || "";
                    }
                    if (correctToggles[idx] && answer.isCorrect) {
                        toggleCorrectOption(correctToggles[idx]);
                    }
                });
            }, 0);
        }

        // Charger le thème si présent
        if (question.theme && window.themeManager) {
            window.themeManager.applyTheme(question.theme);
        }
    }

    function deleteQuestion(index) {
        questionData.splice(index, 1);
        
        if (currentQuestionIndex === index) {
            currentQuestionIndex = null;
            resetQuestionState();
        } else if (currentQuestionIndex > index) {
            currentQuestionIndex--;
        }
        
        renderQuestionsList();
    }

    function highlightNewQuestion(index) {
        const questionCards = questionsList.children;
        if (questionCards[index]) {
            questionCards[index].classList.add('bg-green-100');
            setTimeout(() => questionCards[index].classList.remove('bg-green-100'), 1000);
        }
    }

    // Event Listeners
    addQuestionBtn.addEventListener('click', () => {
        saveCurrentQuestion();
        
        const newQuestion = { ...defaultQuestionState };
        questionData.push(newQuestion);
        currentQuestionIndex = questionData.length - 1;
        
        resetQuestionState();
        renderQuestionsList();
        highlightNewQuestion(currentQuestionIndex);
    });

    timeSlider.addEventListener('input', function() {
        timeDisplay.textContent = `${this.value}s`;
    });


    resetQuestionState();
});