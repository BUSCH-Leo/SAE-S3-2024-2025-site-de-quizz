// question_volet.js

(function() {
    let questions = [];
    let currentQuestionIndex = null;
    let currentQuizType = 'standard';

    function initQuestionVolet() {
        const submitButton = document.querySelector('.submit-btn');
        const questionInput = document.querySelector('.question-input');
        const timeSelect = document.getElementById('timeSelect');
        const imageDisplay = document.getElementById('imageDisplay');
        const imageUpload = document.getElementById('imageUpload');
        const quizTypeSelector = document.getElementById('quizType');

        quizTypeSelector.addEventListener('change', function(e) {
            currentQuizType = e.target.value;
            updateQuizForm();
            window.quizStandard.updateQuiz(); // Utiliser la fonction de quiz_standard.js
        });

        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            saveOrUpdateQuestion();
        });

        // Initialisation du slider
        if (timeSelect) {
            timeSelect.addEventListener('input', window.quizStandard.updateSliderBackground);
            window.quizStandard.updateSliderBackground();
        }

        updateQuizForm();
        addAnswerClickListeners();
    }

    function updateQuizForm() {
        const answersContainer = document.querySelector('.answers');
        answersContainer.innerHTML = '';

        switch (currentQuizType) {
            case 'standard':
            case 'multiple_choice':
                for (let i = 0; i < 4; i++) {
                    answersContainer.innerHTML += `
                        <div class="answer-input-container">
                            <input type="text" placeholder="Réponse ${String.fromCharCode(65 + i)}" class="answer-input" required maxlength="24">
                            <span class="answer-letter" data-answer="${String.fromCharCode(65 + i)}">${String.fromCharCode(65 + i)}</span>
                        </div>
                    `;
                }
                break;
            case 'vrai_ou_faux':
                answersContainer.innerHTML = `
                    <div class="answer-input-container">
                        <input type="text" value="Vrai" class="answer-input" readonly>
                        <span class="answer-letter" data-answer="A">A</span>
                    </div>
                    <div class="answer-input-container">
                        <input type="text" value="Faux" class="answer-input" readonly>
                        <span class="answer-letter" data-answer="B">B</span>
                    </div>
                `;
                break;
            case 'juste_prix':
                answersContainer.innerHTML = `
                    <div class="answer-input-container">
                        <input type="number" placeholder="Entrer le prix" class="answer-input" required>
                        <span class="answer-letter">Prix</span>
                    </div>
                `;
                break;
        }

        addAnswerClickListeners();
    }

    function saveOrUpdateQuestion() {
        const questionText = document.querySelector('.question-input').value.trim();
        const timer = document.getElementById('timeSelect').value;
        const answers = Array.from(document.querySelectorAll('.answer-input')).map(input => input.value.trim());
        const correctAnswerLetter = getCorrectAnswer();
        const imageDisplay = document.getElementById('imageDisplay');

        if (!questionText || answers.some(answer => !answer)) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        const question = {
            text: questionText,
            timer: timer,
            answers: answers,
            correctAnswer: correctAnswerLetter,
            imageUrl: imageDisplay.src,
            type: currentQuizType,
            timestamp: new Date().toISOString()
        };

        if (currentQuestionIndex !== null) {
            questions[currentQuestionIndex] = question;
        } else {
            questions.push(question);
        }

        refreshQuestionsList();
        resetForm();
    }

    function getCorrectAnswer() {
        let selectedAnswer = null;
        document.querySelectorAll('.answer-letter').forEach(letter => {
            if (letter.classList.contains('clicked')) {
                selectedAnswer = letter.dataset.answer;
            }
        });
        return selectedAnswer;
    }

    function resetForm() {
        document.querySelector('.question-input').value = '';
        document.querySelectorAll('.answer-input').forEach(input => input.value = '');
        document.querySelectorAll('.answer-letter').forEach(letter => letter.classList.remove('clicked'));
        document.getElementById('imageDisplay').src = '../ressource/page_creation_quiz/png.png';
        currentQuestionIndex = null;
    }

    function addAnswerClickListeners() {
        document.querySelectorAll('.answer-letter').forEach(letter => {
            letter.addEventListener('click', function() {
                if (currentQuizType === 'multiple_choice') {
                    this.classList.toggle('clicked');
                } else {
                    document.querySelectorAll('.answer-letter').forEach(l => l.classList.remove('clicked'));
                    this.classList.add('clicked');
                }
            });
        });
    }

    function editQuestion(index) {
        currentQuestionIndex = index;
        const question = questions[index];

        document.querySelector('.question-input').value = question.text;
        document.getElementById('timeSelect').value = question.timer;
        document.getElementById('quizType').value = question.type;
        currentQuizType = question.type;

        updateQuizForm();

        const answerInputs = document.querySelectorAll('.answer-input');
        answerInputs.forEach((input, i) => {
            if (i < question.answers.length) {
                input.value = question.answers[i];
            }
        });

        const answerLetters = document.querySelectorAll('.answer-letter');
        answerLetters.forEach(letter => {
            letter.classList.remove('clicked');
            if (letter.dataset.answer === question.correctAnswer) {
                letter.classList.add('clicked');
            }
        });

        document.getElementById('imageDisplay').src = question.imageUrl;
    }

    function deleteQuestion(index) {
        if (confirm('Voulez-vous vraiment supprimer cette question ?')) {
            questions.splice(index, 1);
            if (currentQuestionIndex === index) {
                resetForm();
            } else if (currentQuestionIndex > index) {
                currentQuestionIndex--;
            }
            refreshQuestionsList();
        }
    }

    function refreshQuestionsList() {
        const container = document.getElementById('questionsContainer');
        if (!container) return;

        container.innerHTML = '';

        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            if (index === currentQuestionIndex) {
                questionDiv.classList.add('active');
            }

            questionDiv.innerHTML = `
                <span class="question-text">Question ${index + 1}: ${question.text.substring(0, 30)}...</span>
                <div class="question-actions">
                    <button class="edit-button" onclick="window.questionVolet.editQuestion(${index})">Éditer</button>
                    <button class="delete-button" onclick="window.questionVolet.deleteQuestion(${index})">Supprimer</button>
                </div>
                <img src="${question.imageUrl}" alt="Question Image">
                <p>Type: ${question.type}</p>
                <p>Bonne réponse: ${question.correctAnswer}</p>
            `;

            container.appendChild(questionDiv);
        });
    }

    // Exposer les fonctions nécessaires globalement
    window.questionVolet = {
        init: initQuestionVolet,
        editQuestion: editQuestion,
        deleteQuestion: deleteQuestion
    };
})();

// Initialisation
document.addEventListener('DOMContentLoaded', window.questionVolet.init);