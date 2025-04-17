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

                // Apply font and theme if available
                if (projectData.font) {
                    document.body.style.fontFamily = projectData.font;
                }
                if (projectData.theme) {
                    document.body.style.backgroundImage = `url('${projectData.theme}')`;
                }
            } catch (jsonError) {
                console.error('Erreur lors du parsing des données du projet:', jsonError);
                console.error('Données JSON:', projectDataText);
                showAlert('Erreur lors du chargement des données du projet.');
                return;
            }

            function displayQuestion() {
                const question = quizData[currentQuestionIndex];
                const container = document.getElementById('quiz-container');
                
                // Animation de transition
                container.classList.add('fade-out');
                
                setTimeout(() => {
                    let answersHTML = '';
                    
                    if (question.type === 'multiple') {
                        answersHTML = question.answerOptions.map((answer, index) => `
                            <div class="answer-card col-12 col-md-6 mb-3">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="answer${index}" data-index="${index}">
                                    <label class="custom-control-label" for="answer${index}">
                                        <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                                        <span class="answer-text">${answer.text}</span>
                                    </label>
                                </div>
                            </div>
                        `).join('');
                    } else if (question.type === 'price') {
                        answersHTML = `
                            <div class="price-input-container">
                                <div class="price-input-wrapper">
                                    <span class="price-currency">€</span>
                                    <input type="number" id="price-input" class="form-control" placeholder="Entrez le prix">
                                </div>
                            </div>
                        `;
                    } else if (question.type === 'truefalse') {
                        answersHTML = `
                            <div class="tf-container row">
                                <div class="col-12 col-md-6 mb-3">
                                    <div class="answer-card true-option">
                                        <input type="radio" name="tf" id="true" value="true">
                                        <label for="true">
                                            <i class="fas fa-check-circle"></i> Vrai
                                        </label>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mb-3">
                                    <div class="answer-card false-option">
                                        <input type="radio" name="tf" id="false" value="false">
                                        <label for="false">
                                            <i class="fas fa-times-circle"></i> Faux
                                        </label>
                                    </div>
                                </div>
                            </div>
                        `;
                    } else {
                        answersHTML = question.answerOptions.map((answer, index) => `
                            <div class="col-12 col-md-6 mb-3">
                                <div class="answer-card">
                                    <input type="radio" name="answer" id="answer${index}" data-index="${index}">
                                    <label for="answer${index}">
                                        <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                                        <span class="answer-text">${answer.text}</span>
                                    </label>
                                </div>
                            </div>
                        `).join('');
                    }
            
                    container.innerHTML = `
                        <div class="question-container">
                            <div class="question-info">
                                <span class="question-number">Question ${currentQuestionIndex + 1}/${quizData.length}</span>
                                <span class="question-points">${question.points || 10} points</span>
                            </div>
                            
                            <div class="question-content">
                                <h2 class="question-text">${question.questionText}</h2>
                                ${question.mediaUrl ? 
                                    `<div class="question-media">
                                        <img src="${question.mediaUrl}" alt="Question Media" class="img-fluid rounded question-img-large">
                                    </div>` : ''
                                }
                            </div>
                            
                            <div class="answers-container row g-4">
                                ${answersHTML}
                            </div>
                        </div>
                    `;
                    
                    if (question.type === 'multiple') {
                        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                            checkbox.parentElement.parentElement.addEventListener('click', (e) => {
                                const input = e.currentTarget.querySelector('input');
                                if (e.target !== input) {
                                    input.checked = !input.checked;
                                }
                                toggleSelectedClass(e.currentTarget);
                            });
                        });
                    } else if (question.type === 'truefalse' || question.type === 'standart') {
                        document.querySelectorAll('.answer-card').forEach(card => {
                            card.addEventListener('click', (e) => {
                                const input = card.querySelector('input');
                                input.checked = true;
                                clearSelectedClass();
                                card.classList.add('selected');
                            });
                        });
                    }
                    
                    container.classList.remove('fade-out');
                    container.classList.add('fade-in');
                    
                    startTimer(question.timeLimit);
                    updateProgressBar();
                }, 300);
            }
            

            function toggleSelectedClass(element) {
                const input = element.querySelector('input');
                if (input.checked) {
                    element.classList.add('selected');
                } else {
                    element.classList.remove('selected');
                }
            }
            
            function clearSelectedClass() {
                document.querySelectorAll('.answer-card').forEach(card => {
                    card.classList.remove('selected');
                });
            }

            function startTimer(duration) {
                clearInterval(timer);
                timeLeft = duration;
                const timerDisplay = document.getElementById('timer');

                timer = setInterval(() => {
                    timerDisplay.textContent = `Temps: ${timeLeft}s`;
                    const progress = (timeLeft / duration) * 100;
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
                    <div class="results p-4">
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