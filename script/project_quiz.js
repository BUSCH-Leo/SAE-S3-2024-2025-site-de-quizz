document.addEventListener('DOMContentLoaded', async function() {
    let quizData;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timer;
    let timeLeft;

    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }
    const projectDataScript = document.getElementById('project-data');
    if (projectDataScript) {
        try {
            const projectDataText = projectDataScript.textContent.trim();
            if (!projectDataText) {
                throw new Error('Les données du projet sont vides.');
            }

            try {
                const decodedDataText = decodeHTMLEntities(projectDataText);
                const projectData = JSON.parse(decodedDataText);
                quizData = projectData.questions;
            } catch (jsonError) {
                console.error('Erreur lors du parsing des données du projet:', jsonError);
                console.error('Données JSON:', projectDataText);
                showAlert('Erreur lors du chargement des données du projet.');
                return;
            }

            function displayQuestion() {
                const question = quizData[currentQuestionIndex];
                const container = document.getElementById('quiz-container');

                let answersHTML = '';
                if (question.type === 'multiple') {
                    answersHTML = question.answerOptions.map((answer, index) => `
                        <div class="answer-option col-12 col-md-6">
                            <input type="checkbox" id="answer${index}" data-index="${index}">
                            <label for="answer${index}">${answer.text}</label>
                        </div>
                    `).join('');
                } else if (question.type === 'price') {
                    answersHTML = `
                        <input type="number" id="price-input" class="form-control" placeholder="Entrez le prix">
                    `;
                } else if (question.type === 'truefalse') {
                    answersHTML = `
                        <div class="answer-option col-12 col-md-6">
                            <input type="radio" name="tf" id="true" value="true">
                            <label for="true">Vrai</label>
                        </div>
                        <div class="answer-option col-12 col-md-6">
                            <input type="radio" name="tf" id="false" value="false">
                            <label for="false">Faux</label>
                        </div>
                    `;
                } else {
                    answersHTML = question.answerOptions.map((answer, index) => `
                        <div class="answer-option col-12 col-md-6">
                            <input type="radio" name="answer" id="answer${index}" data-index="${index}">
                            <label for="answer${index}">${answer.text}</label>
                        </div>
                    `).join('');
                }

                container.innerHTML = `
                    <div class="question-box">
                        <h3>Question ${currentQuestionIndex + 1}/${quizData.length}</h3>
                        <h2>${question.questionText}</h2>
                        <div class="answers-grid row g-3">
                            ${answersHTML}
                        </div>
                    </div>
                `;

                startTimer(question.timeLimit);
                updateProgressBar();
            }

            function startTimer(duration) {
                clearInterval(timer);
                timeLeft = duration;
                const timerDisplay = document.getElementById('timer');

                timer = setInterval(() => {
                    timerDisplay.textContent = `Temps: ${timeLeft}s`;
                    const progress = ((duration - timeLeft) / duration) * 100;
                    document.getElementById('progress-bar').style.width = `${progress}%`;

                    if (--timeLeft < 0) {
                        clearInterval(timer);
                        showAlert("Temps écoulé pour cette question !");
                        nextQuestion();
                    }
                }, 1000);
            }

            function collectAnswer() {
                const question = quizData[currentQuestionIndex];
                let answer = [];

                if (question.type === 'multiple') {
                    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
                    answer = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
                } else if (question.type === 'price') {
                    const priceInput = document.getElementById('price-input');
                    answer = [parseFloat(priceInput.value)];
                } else if (question.type === 'truefalse') {
                    const selected = document.querySelector('input[name="tf"]:checked');
                    answer = selected ? [selected.value === 'true'] : [];
                } else {
                    const selected = document.querySelector('input[name="answer"]:checked');
                    answer = selected ? [parseInt(selected.dataset.index)] : [];
                }

                userAnswers[currentQuestionIndex] = answer;
            }

            function nextQuestion() {
                collectAnswer();
                clearInterval(timer);

                if (currentQuestionIndex < quizData.length - 1) {
                    currentQuestionIndex++;
                    displayQuestion();
                } else {
                    showResults();
                }
            }

            function updateProgressBar() {
                const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
                document.getElementById('progress-bar').style.width = `${progress}%`;
            }

            function showResults() {
                const score = calculateScore();
                const container = document.getElementById('quiz-container');
                container.innerHTML = `
                    <div class="results">
                        <h2>Quiz Terminé!</h2>
                        <p>Votre score: ${score}/${quizData.reduce((acc, q) => acc + q.points, 0)}</p>
                    </div>
                `;
                document.getElementById('submit').style.display = 'none';
            }

            function calculateScore() {
                let score = 0;
                quizData.forEach((question, index) => {
                    const userAns = userAnswers[index] || [];

                    if (question.type === 'multiple') {
                        const correctIndexes = question.answerOptions
                            .map((opt, idx) => opt.isCorrect ? idx : null)
                            .filter(idx => idx !== null);
                        if (arraysEqual(correctIndexes.sort(), userAns.sort())) {
                            score += question.points;
                        }
                    } else if (question.type === 'price') {
                        if (userAns[0] === question.correctPrice) {
                            score += question.points;
                        }
                    } else if (question.type === 'truefalse') {
                        if (userAns[0] === question.correctAnswer) {
                            score += question.points;
                        }
                    } else {
                        const correctIndex = question.answerOptions.findIndex(opt => opt.isCorrect);
                        if (userAns[0] === correctIndex) {
                            score += question.points;
                        }
                    }
                });
                return score;
            }

            function arraysEqual(a, b) {
                return JSON.stringify(a) === JSON.stringify(b);
            }

            function showAlert(message) {
                const modalMessage = document.getElementById('modal-message');
                modalMessage.innerText = message;
                document.getElementById('alert-modal').style.display = 'block';
            }

            function closeModal() {
                document.getElementById('alert-modal').style.display = 'none';
            }

            window.addEventListener('click', function(event) {
                const modal = document.getElementById('alert-modal');
                if (event.target === modal) {
                    closeModal();
                }
            });

            document.getElementById('submit').addEventListener('click', nextQuestion);

            displayQuestion();
        } catch (error) {
            console.error('Erreur lors du parsing des données du projet:', error);
            showAlert('Erreur lors du chargement des données du projet.');
        }
    } else {
        showAlert('Aucune donnée de projet disponible.');
    }
});