document.addEventListener('DOMContentLoaded', () => {
    const quizTypeSelector = document.getElementById('quizType');
    const questionSection = document.querySelector('.question-section');
    const timeSelect = document.getElementById('timeSelect');
    const timeDisplay = document.getElementById('timeDisplay');

    function updateTimerDisplay() {
        timeDisplay.textContent = `${timeSelect.value}s`;
    }

    timeSelect.addEventListener('input', updateTimerDisplay);

    function generateAnswerTemplate(answerLetter) {
        return `
            <div class="answer-input-container mb-2">
                <div class="input-group">
                    <span class="input-group-text bg-light">${answerLetter}</span>
                    <input type="text" placeholder="Réponse ${answerLetter}" class="form-control answer-input">
                    <button class="btn btn-outline-secondary" type="button">
                        <i class="bi bi-check-circle text-success"></i>
                    </button>
                </div>
            </div>`;
    }

    function addMoreAnswers() {
        const answersContainer = document.querySelector('.answers');
        const letters = 'CDEFGHIJKLMNOP'.split('');
        const currentAnswers = answersContainer.querySelectorAll('.answer-input-container');
        const nextLetter = letters[currentAnswers.length - 2];

        if (nextLetter) {
            const newAnswerHTML = generateAnswerTemplate(nextLetter);
            answersContainer.insertAdjacentHTML('beforeend', newAnswerHTML);
        } else {
            alert('Nombre maximum de réponses atteint.');
        }
    }

    function setupAddMoreAnswersButton() {
        const addMoreButton = document.querySelector('.add-more-btn');
        if (addMoreButton) {
            addMoreButton.addEventListener('click', addMoreAnswers);
        }
    }

    quizTypeSelector.addEventListener('change', () => {
        const quizType = quizTypeSelector.value;

        if (quizType === 'vrai_ou_faux') {
            questionSection.innerHTML = `
                <div class="answers">
                    ${generateAnswerTemplate('A')}
                    ${generateAnswerTemplate('B')}
                </div>`;
        } else {
            questionSection.innerHTML = `
                <div class="answers">
                    ${generateAnswerTemplate('A')}
                    ${generateAnswerTemplate('B')}
                    <button class="btn btn-outline-primary add-more-btn mt-2">
                        <i class="bi bi-plus me-2"></i>Ajouter plus de réponses
                    </button>
                </div>`;
            setupAddMoreAnswersButton();
        }
    });

    setupAddMoreAnswersButton();
    updateTimerDisplay();
});
