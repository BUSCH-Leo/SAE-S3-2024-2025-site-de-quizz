document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const quizTypeSelector = document.getElementById('quizType');
    const questionSection = document.querySelector('.question-section');
    const timeSelect = document.getElementById('timeSelect');
    const timeDisplay = document.getElementById('timeDisplay');
    

    let questionCount = 0;
    const maxQuestions = 2;

    // Appliquer une image de fond par défaut
    const defaultImage = '../ressource/fond1.jpg';
    setBackgroundImage(defaultImage);

    function setBackgroundImage(imageUrl) {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }

    // Mise à jour de l'arrière-plan du slider
    function updateSliderBackground() {
        if (timeSelect) {
            const value = ((timeSelect.value - timeSelect.min) / (timeSelect.max - timeSelect.min)) * 100;
            timeSelect.style.background = `linear-gradient(to right, #4caf50 ${value}%, #ddd ${value}%)`;
        }
    }

    // Fonction générique pour générer les réponses pour les modes standard et multiple_choice
    function generateAnswers(mode) {
        const answers = ['A', 'B', 'C', 'D'];
        let answerHTML = '';
        answers.forEach(letter => {
            answerHTML += `
                <div class="answer-input-container">
                    <input type="text" placeholder="Réponse ${letter}" class="answer-input" required maxlength="24">
                    <span class="answer-letter" data-answer="${letter}">${letter}</span>
                </div>`;
        });
        return answerHTML;
    }

    // Générer le template de la réponse pour le mode juste_prix
    function generateJustePrixAnswer() {
        return `
            <div class="answer-input-container">
                <input type="number" placeholder="Entrer le prix" class="answer-input" required>
                <span class="answer-letter">Prix</span>
            </div>`;
    }

    // Générer le template de la question, timer et réponses
    function generateQuestionTemplate(mode) {
        const baseTemplate = `
            <input type="text" class="question-input" placeholder="Saisir une question">
            <div align="center" class="timer">
                <label class="labelSelect" for="timeSelect">Temps Imparti</label>
                <div class="slider-container">
                    <input type="range" id="timeSelect" min="5" max="60" step="10" value="30">
                    <span id="timeDisplay">30s</span>
                </div>
            </div>
        `;

        let answerTemplate = '';

        if (mode === 'juste_prix') {
            answerTemplate = generateJustePrixAnswer();
        } else if (mode === 'vrai_ou_faux') {
            answerTemplate = `
                <div class="answers">
                    <div class="answer-input-container">
                        <input type="text" value="Vrai" class="answer-input" required readonly>
                        <span class="answer-letter" data-answer="A">A</span>
                    </div>
                    <div class="answer-input-container">
                        <input type="text" value="Faux" class="answer-input" required readonly>
                        <span class="answer-letter" data-answer="B">B</span>
                    </div>
                </div>`;
        } else {
            answerTemplate = `
                <div class="answers">
                    ${generateAnswers(mode)}
                </div>
                <button class="submit-btn">Ajouter plus de réponses</button>
            `;
        }

        return baseTemplate + answerTemplate;
    }

    // Fonction pour ajouter plus de réponses dans le mode standard et multiple_choice
    function addMoreAnswers() {
        if (questionCount >= maxQuestions) {
            alert("Vous ne pouvez ajouter que 6 questions au maximum.");
            return;
        }

        questionCount++;
        const answerContainer = document.querySelector('.answers');
        const newAnswer = document.createElement('div');
        newAnswer.classList.add('answer-input-container');
        newAnswer.innerHTML = `
            <input type="text" placeholder="Nouvelle réponse" class="answer-input" required maxlength="24">
            <span class="answer-letter" data-answer="E">E</span>
        `;
        answerContainer.appendChild(newAnswer);

        // Si le nombre de questions atteint la limite, désactiver le bouton
        if (questionCount >= maxQuestions) {
            const addButton = document.querySelector('.submit-btn');
            if (addButton) {
                addButton.disabled = true;
                addButton.textContent = "Limite atteinte";
            }
        }
    }

    // Fonction pour mettre à jour le quiz en fonction du type sélectionné
    function updateQuiz() {
        const mode = quizTypeSelector.value;
        questionSection.innerHTML = generateQuestionTemplate(mode);
        addAnswerClickListeners();
        updateSliderBackground();
        const addButton = document.querySelector('.submit-btn');
        if (addButton) {
            addButton.addEventListener('click', addMoreAnswers);
        }
    }


    function addAnswerClickListeners() {
        const answerLetters = document.querySelectorAll('.answer-letter');
        answerLetters.forEach(letter => {
            letter.addEventListener('click', () => {
                handleAnswerClick(letter);
            });
        });
    }

    function handleAnswerClick(letter) {
        const mode = quizTypeSelector.value;
        const answerLetters = document.querySelectorAll('.answer-letter');

        if (mode === 'vrai_ou_faux') {
            answerLetters.forEach(item => item.classList.remove('clicked'));
            letter.classList.add('clicked');
        } else if (mode === 'multiple_choice') {
            letter.classList.toggle('clicked');
        } else {
            answerLetters.forEach(item => item.classList.remove('clicked'));
            letter.classList.add('clicked');
        }
    }

    function initDefaultQuiz() {
        quizTypeSelector.value = 'standard';
        updateQuiz();
        updateSliderBackground();
    }

    quizTypeSelector.addEventListener('change', updateQuiz);
    initDefaultQuiz();
});
