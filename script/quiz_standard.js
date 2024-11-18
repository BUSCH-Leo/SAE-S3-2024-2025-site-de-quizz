document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const quizTypeSelector = document.getElementById('quizType');
    const questionSection = document.querySelector('.question-section');

    // Appliquer l'image de fond par défaut au chargement
    const defaultImage = '../ressource/fond1.jpg';
    document.body.style.backgroundImage = `url('${defaultImage}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

    // Fonction pour appliquer une image en fond
    function setBackgroundImage(imageUrl) {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }

    // Gestion du slider de temps
    function updateSliderBackground() {
        const timeSelect = document.getElementById('timeSelect');
        if (timeSelect) {
            const value = (timeSelect.value - timeSelect.min) / (timeSelect.max - timeSelect.min) * 100;
            timeSelect.style.background = `linear-gradient(to right, #7BD634 ${value}%, #ddd ${value}%)`;
        }
    }
    // Fonction pour ajouter les écouteurs d'événements sur les lettres des réponses
    function addAnswerClickListeners() {
        const answerLetters = document.querySelectorAll('.answer-letter');
        answerLetters.forEach(letter => {
            letter.addEventListener('click', function() {
                if (quizTypeSelector.value === 'vrai_ou_faux') {
                    answerLetters.forEach(item => item.classList.remove('clicked'));
                    letter.classList.add('clicked');
                } else if (quizTypeSelector.value === 'multiple_choice') {
                    letter.classList.toggle('clicked');
                } else {
                    answerLetters.forEach(item => item.classList.remove('clicked'));
                    letter.classList.add('clicked');
                }
            });
        });
    }

    // Initialisation du quiz type par défaut (standard) et des fonctions associées
    function initDefaultQuiz() {
        quizTypeSelector.value = 'standard';
        updateQuiz();        const timeSelect = document.getElementById('timeSelect');
        if (timeSelect) {
            updateSliderBackground();
        }
        addAnswerClickListeners();
    }

    quizTypeSelector.addEventListener('change', updateQuiz);

    quizTypeSelector.addEventListener('change', updateQuiz);

    function updateQuiz() {
        questionSection.innerHTML = '';
        const mode = quizTypeSelector.value;

        if (mode === 'juste_prix') {
            questionSection.innerHTML = `
                <input type="text" class="question-input" placeholder="Saisir une question">
                <div align="center" class="timer">
                    <label class="labelSelect" for="timeSelect">Choisissez le temps pour chaque question</label>
                    <div class="slider-container">
                        <input type="range" id="timeSelect" min="5" max="60" step="1" value="30">
                        <span id="timeDisplay">30s</span>
                    </div>
                    <div class="answer-input-container">
                        <input type="number" placeholder="Entrer le prix" class="answer-input" required>
                        <span class="answer-letter">Prix</span>
                    </div>
                </div>
                <button class="submit-btn">Valider</button>
            `;
        } else if (mode === 'vrai_ou_faux') {
            questionSection.innerHTML = `
                <input type="text" class="question-input" placeholder="Saisir une question Vrai/Faux">
                <div align="center" class="timer">
                    <label class="labelSelect" for="timeSelect">Choisissez le temps pour chaque question</label>
                    <div class="slider-container">
                        <input type="range" id="timeSelect" min="5" max="60" step="1" value="30">
                        <span id="timeDisplay">30s</span>
                    </div>
                    <div class="answers">
                        <div class="answer-input-container">
                            <input type="text" value="Vrai" class="answer-input" required readonly>
                            <span class="answer-letter" data-answer="A">A</span>
                        </div>
                        <div class="answer-input-container">
                            <input type="text" value="Faux" class="answer-input" required readonly>
                            <span class="answer-letter" data-answer="B">B</span>
                        </div>
                    </div>
                </div>
                <button class="submit-btn">Valider</button>
            `;
            addAnswerClickListeners();
        } else if (mode === 'standard') {
            questionSection.innerHTML = `
                <input type="text" class="question-input" placeholder="Saisir une question avec 4 réponses possibles">
                <div align="center" class="timer">
                    <label class="labelSelect" for="timeSelect">Choisissez le temps pour chaque question</label>
                    <div class="slider-container">
                        <input type="range" id="timeSelect" min="5" max="60" step="1" value="30">
                        <span id="timeDisplay">30s</span>
                    </div>
                </div>
                <div class="answers">
                    <div class="answer-input-container">
                        <input type="text" placeholder="Réponse A" class="answer-input" required maxlength="24">
                        <span class="answer-letter" data-answer="A">A</span>
                    </div>
                    <div class="answer-input-container">
                        <input type="text" placeholder="Réponse B" class="answer-input" required maxlength="24">
                        <span class="answer-letter" data-answer="B">B</span>
                    </div>
                    <div class="answer-input-container">
                        <input type="text" placeholder="Réponse C" class="answer-input" required maxlength="24">
                        <span class="answer-letter" data-answer="C">C</span>
                    </div>
                    <div class="answer-input-container">
                        <input type="text" placeholder="Réponse D" class="answer-input" required maxlength="24">
                        <span class="answer-letter" data-answer="D">D</span>
                    </div>
                </div>
                <button class="submit-btn">Valider</button>
            `;
            addAnswerClickListeners();
        } else if (mode === 'multiple_choice') {
            questionSection.innerHTML = `
                <input type="text" class="question-input" placeholder="Saisir une question avec 4 réponses possibles">
                <div align="center" class="timer">
                    <label class="labelSelect" for="timeSelect">Choisissez le temps pour chaque question</label>
                    <div class="slider-container">
                        <input type="range" id="timeSelect" min="5" max="60" step="1" value="30">
                        <span id="timeDisplay">30s</span>
                    </div>
                </div>
                <div class="answers">
                    <div class="answer-input-container">
                        <input type="text" placeholder="Réponse A" class="answer-input" required maxlength="24">
                        <span class="answer-letter" data-answer="A">A</span>
                    </div>
                    <div class="answer-input-container">
                        <input type="text" placeholder="Réponse B" class="answer-input" required maxlength="24">
                        <span class="answer-letter" data-answer="B">B</span>
                    </div>
                    <div class="answer-input-container">
                        <input type="text" placeholder="Réponse C" class="answer-input" required maxlength="24">
                        <span class="answer-letter" data-answer="C">C</span>
                    </div>
                    <div class="answer-input-container">
                        <input type="text" placeholder="Réponse D" class="answer-input" required maxlength="24">
                        <span class="answer-letter" data-answer="D">D</span>
                    </div>
                </div>
                <button class="submit-btn">Valider</button>
            `;
            addAnswerClickListeners(true);
        }

        const timeSelect = document.getElementById('timeSelect');
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeSelect) {
            updateSliderBackground();
            timeDisplay.textContent = `${timeSelect.value}s`;

            timeSelect.addEventListener('input', function() {
                timeDisplay.textContent = `${timeSelect.value}s`;
                updateSliderBackground();
            });
        }
    }


initDefaultQuiz();
});
