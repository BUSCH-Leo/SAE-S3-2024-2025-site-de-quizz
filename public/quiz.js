let quizData = [];
let currentQuizIndex = 0;
let currentQuestionIndex = 0;
let userAnswers = [];
let timer;
const timePerQuestion = 10;

// Récupération de la catégorie depuis l'URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

// Fonction pour récupérer les quizzes
async function fetchQuizzes() {
    const categoryId = getCategoryFromURL();

    try {
        const response = await fetch(`/api/quiz/category/${categoryId}`);
        quizData = await response.json();

        if (quizData.length === 0) {
            showAlert('Aucun quiz disponible pour cette catégorie.');
            return;
        }

        currentQuizIndex = 0;
        currentQuestionIndex = 0;
        userAnswers = [];
        displayCurrentQuestion();
        startTimer();
    } catch (error) {
        console.error('Erreur lors de la récupération des quiz', error);
    }
}

// Fonction pour afficher la question actuelle
function displayCurrentQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.classList.remove('fade-in');
    quizContainer.classList.add('fade-out');

    setTimeout(() => {
        quizContainer.innerHTML = '';

        const currentQuiz = quizData[currentQuizIndex];

        if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
            quizContainer.innerHTML = '<p>Aucune question disponible pour ce quiz.</p>';
            return;
        }

        const question = currentQuiz.questions[currentQuestionIndex];
        const questionElement = document.createElement('div');
        questionElement.classList.add('question-area', 'p-4');
        questionElement.innerHTML = `<h3 class="question-text">Question ${currentQuestionIndex + 1} sur ${currentQuiz.questions.length}: ${question.question}</h3>`;
        quizContainer.appendChild(questionElement);

        const answers = [...question.incorrect_answers, question.correct_answer].sort();
        answers.forEach((answer, index) => {
            const answerElement = document.createElement('button');
            answerElement.classList.add('answer', 'btn', 'm-2');
            answerElement.innerHTML = `<span class="letter">${String.fromCharCode(65 + index)}</span> <span class="text">${answer}</span>`;
            quizContainer.appendChild(answerElement);

            answerElement.addEventListener('click', () => {
                document.querySelectorAll('.answer').forEach(btn => btn.classList.remove('selected'));
                answerElement.classList.add('selected');
                saveAnswer(answer);
            });
        });

        quizContainer.classList.remove('fade-out');
        quizContainer.classList.add('fade-in');
    }, 500);
}

// Fonction pour démarrer le timer
function startTimer() {
    let timeLeft = timePerQuestion;
    const timerElement = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    timerElement.innerText = `Temps restant : ${timePerQuestion}s`;
    progressBar.style.width = '100%';

    clearInterval(timer);
    timer = setInterval(() => {
        timerElement.innerText = `Temps restant : ${timeLeft}s`;
        progressBar.style.width = `${(timeLeft / timePerQuestion) * 100}%`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            showAlert("Temps écoulé pour cette question !");
            nextQuestion();
        }
    }, 1000);
}

// Fonction pour enregistrer la réponse
function saveAnswer(selectedAnswer) {
    userAnswers[currentQuizIndex] = userAnswers[currentQuizIndex] || [];
    userAnswers[currentQuizIndex][currentQuestionIndex] = selectedAnswer;
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    const currentQuiz = quizData[currentQuizIndex];

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
        startTimer();
    } else {
        clearInterval(timer);
        if (currentQuizIndex < quizData.length - 1) {
            currentQuizIndex++;
            currentQuestionIndex = 0;
            displayCurrentQuestion();
            startTimer();
        } else {
            calculateScore();
        }
    }
}

// Fonction pour calculer le score
function calculateScore() {
    let totalScore = 0;
    let totalQuestions = 0;

    quizData.forEach((quiz, quizIndex) => {
        quiz.questions.forEach((question, questionIndex) => {
            totalQuestions++;
            if (userAnswers[quizIndex] && userAnswers[quizIndex][questionIndex] === question.correct_answer) {
                totalScore++;
            }
        });
    });

    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML = `
        <div class="finish-animation">Félicitations ! Votre score est de ${totalScore}/${totalQuestions}</div>
    `;
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('timer').remove();
    document.getElementById('progress-bar').style.width = '0';
}

// Fonction pour afficher les alertes dans une modale
function showAlert(message) {
    const modalMessage = document.getElementById('modal-message');
    modalMessage.innerText = message;
    document.getElementById('alert-modal').style.display = 'block';
}

// Fonction pour fermer la modale
function closeModal() {
    document.getElementById('alert-modal').style.display = 'none';
}

// Événement pour le bouton OK de la modale
document.getElementById('modal-confirm').addEventListener('click', closeModal);

// Événement pour la croix de fermeture de la modale
document.querySelector('.close').addEventListener('click', closeModal);

// Événement de soumission
document.getElementById('submit').addEventListener('click', () => {
    if (document.querySelector('.selected')) {
        nextQuestion();
    } else {
        showAlert('Veuillez sélectionner une réponse avant de continuer.');
    }
});

// Démarrer le quiz
fetchQuizzes();
