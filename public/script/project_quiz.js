document.addEventListener('DOMContentLoaded', async function() {
    let quizData;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timer;
    let timeLeft;

    // Initialisation
    await initializeQuiz();

    async function initializeQuiz() {
        const projectDataScript = document.getElementById('project-data');
        if (!projectDataScript) {
            showAlert('Aucune donnée de projet disponible.');
            return;
        }

        try {
            const projectData = parseProjectData(projectDataScript.textContent.trim());
            quizData = projectData.questions;
            applyTheme(projectData);
            displayQuestion();
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            showAlert('Erreur lors du chargement des données du projet.');
        }
    }

    function parseProjectData(dataText) {
        if (!dataText) throw new Error('Les données du projet sont vides.');
        
        const decodedText = decodeHTMLEntities(dataText);
        return JSON.parse(decodedText);
    }

    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    function applyTheme(projectData) {
        if (projectData.font) {
            document.body.style.fontFamily = projectData.font;
        }
        if (projectData.theme) {
            document.body.style.backgroundImage = `url('${projectData.theme}')`;
        }
    }

    function displayQuestion() {
        const question = quizData[currentQuestionIndex];
        const container = document.getElementById('quiz-container');
        
        container.classList.add('fade-out');
        
        setTimeout(() => {
            container.innerHTML = buildQuestionHTML(question);
            attachEventListeners(question.type);
            
            container.classList.remove('fade-out');
            container.classList.add('fade-in');
            
            startTimer(question.timeLimit);
            updateProgressBar();
        }, 300);
    }

    function buildQuestionHTML(question) {
        return `
            <div class="question-container">
                <div class="question-info">
                    <span class="question-number">Question ${currentQuestionIndex + 1}/${quizData.length}</span>
                    <span class="question-points">${question.points || 10} points</span>
                </div>
                
                <div class="question-content">
                    <h2 class="question-text">${question.questionText}</h2>
                    ${question.mediaUrl ? `<div class="question-media">
                        <img src="${question.mediaUrl}" alt="Question Media" class="img-fluid rounded question-img-large">
                    </div>` : ''}
                </div>
                
                <div class="answers-container row g-4">
                    ${buildAnswersHTML(question)}
                </div>
            </div>
        `;
    }

    function buildAnswersHTML(question) {
        const builders = {
            multiple: () => question.answerOptions.map((answer, index) => `
                <div class="answer-card col-12 col-md-6 mb-3">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="answer${index}" data-index="${index}">
                        <label class="custom-control-label" for="answer${index}">
                            <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                            <span class="answer-text">${answer.text}</span>
                        </label>
                    </div>
                </div>
            `).join(''),

            price: () => `
                <div class="price-input-container">
                    <div class="price-input-wrapper">
                        <span class="price-currency">€</span>
                        <input type="number" id="price-input" class="form-control" placeholder="Entrez le prix">
                    </div>
                </div>
            `,

            truefalse: () => `
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
            `,

            default: () => question.answerOptions.map((answer, index) => `
                <div class="col-12 col-md-6 mb-3">
                    <div class="answer-card">
                        <input type="radio" name="answer" id="answer${index}" data-index="${index}">
                        <label for="answer${index}">
                            <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                            <span class="answer-text">${answer.text}</span>
                        </label>
                    </div>
                </div>
            `).join('')
        };

        return builders[question.type] || builders.default();
    }

    function attachEventListeners(questionType) {
        if (questionType === 'multiple') {
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.parentElement.parentElement.addEventListener('click', handleMultipleChoice);
            });
        } else if (['truefalse', 'standart'].includes(questionType)) {
            document.querySelectorAll('.answer-card').forEach(card => {
                card.addEventListener('click', handleSingleChoice);
            });
        }
    }

    function handleMultipleChoice(e) {
        const input = e.currentTarget.querySelector('input');
        if (e.target !== input) {
            input.checked = !input.checked;
        }
        e.currentTarget.classList.toggle('selected', input.checked);
    }

    function handleSingleChoice(e) {
        const input = e.currentTarget.querySelector('input');
        input.checked = true;
        
        document.querySelectorAll('.answer-card').forEach(card => {
            card.classList.remove('selected');
        });
        e.currentTarget.classList.add('selected');
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
        const collectors = {
            multiple: () => Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => parseInt(cb.dataset.index)),
            
            price: () => {
                const value = document.getElementById('price-input').value;
                return value ? [parseFloat(value)] : [];
            },
            
            truefalse: () => {
                const selected = document.querySelector('input[name="tf"]:checked');
                return selected ? [selected.value === 'true'] : [];
            },
            
            default: () => {
                const selected = document.querySelector('input[name="answer"]:checked');
                return selected ? [parseInt(selected.dataset.index)] : [];
            }
        };

        userAnswers[currentQuestionIndex] = (collectors[question.type] || collectors.default)();
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
        const totalPoints = quizData.reduce((acc, q) => acc + q.points, 0);
        
        document.getElementById('quiz-container').innerHTML = `
            <div class="results p-4">
                <h2>Quiz Terminé!</h2>
                <p>Votre score: ${score}/${totalPoints}</p>
            </div>
        `;
        document.getElementById('submit').style.display = 'none';
    }

    function calculateScore() {
        return quizData.reduce((score, question, index) => {
            const userAns = userAnswers[index] || [];
            
            const scorers = {
                multiple: () => {
                    const correctIndexes = question.answerOptions
                        .map((opt, idx) => opt.isCorrect ? idx : null)
                        .filter(idx => idx !== null)
                        .sort();
                    return JSON.stringify(correctIndexes) === JSON.stringify(userAns.sort()) 
                        ? question.points : 0;
                },
                
                price: () => userAns[0] === question.correctPrice ? question.points : 0,
                
                truefalse: () => userAns[0] === question.correctAnswer ? question.points : 0,
                
                default: () => {
                    const correctIndex = question.answerOptions.findIndex(opt => opt.isCorrect);
                    return userAns[0] === correctIndex ? question.points : 0;
                }
            };

            return score + ((scorers[question.type] || scorers.default)());
        }, 0);
    }

    function showAlert(message) {
        document.getElementById('modal-message').innerText = message;
        document.getElementById('alert-modal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('alert-modal').style.display = 'none';
    }

    // Event listeners
    document.getElementById('submit').addEventListener('click', nextQuestion);
    
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('alert-modal')) {
            closeModal();
        }
    });
});
