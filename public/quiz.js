let quizData = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let timer;
const timePerQuestion = 10; // Temps en secondes pour chaque question

async function fetchQuiz(quizId) {
    try {
        const response = await fetch(`/api/quiz/${quizId}`);
        quizData = await response.json();
        displayCurrentQuestion();
        startTimer();
    } catch (error) {
        console.error('Erreur lors de la récupération du quiz', error);
    }
}

function displayCurrentQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter la question

    if (!quizData.questions || quizData.questions.length === 0) {
        quizContainer.innerHTML = '<p>Aucune question disponible pour ce quiz.</p>';
        return;
    }

    const question = quizData.questions[currentQuestionIndex];
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `<h3>${currentQuestionIndex + 1}. ${question.question}</h3>`;

    const answers = [...question.incorrect_answers, question.correct_answer].sort(); // Mélanger les réponses
    answers.forEach((answer) => {
        const answerElement = document.createElement('div');
        answerElement.innerHTML = `
            <input type="radio" name="question${currentQuestionIndex}" value="${answer}">
            <label>${answer}</label>
        `;
        questionElement.appendChild(answerElement);
    });

    quizContainer.appendChild(questionElement);
}

function startTimer() {
    let timeLeft = timePerQuestion;
    let timerElement = document.getElementById('timer');

    // Si le timer existe déjà, on le réinitialise
    if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'timer';
        document.body.appendChild(timerElement); // Ajouter le timer au body s'il n'existe pas encore
    }

    // Réinitialiser le contenu du timer à chaque nouvelle question
    timerElement.innerText = `Temps restant : ${timePerQuestion}s`;

    // Arrêter le timer précédent s'il existe
    clearInterval(timer);

    // Démarrer un nouveau timer
    timer = setInterval(() => {
        timerElement.innerText = `Temps restant : ${timeLeft}s`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            saveAnswer();
            nextQuestion(); 
        }
    }, 1000);
}


function saveAnswer() {
    const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    userAnswers[currentQuestionIndex] = selectedOption ? selectedOption.value : null;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.questions.length) {
        displayCurrentQuestion(); // Afficher la prochaine question
        startTimer(); // Redémarrer le timer pour la prochaine question
    } else {
        clearInterval(timer);
        calculateScore(); 
    }
}

document.getElementById('submit').addEventListener('click', () => {
    clearInterval(timer); // Arrêter le timer lorsque l'utilisateur valide
    saveAnswer(); 
    nextQuestion(); 
});

function calculateScore() {
    let score = 0;

    quizData.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct_answer) {
            score++;
        }
    });

    document.getElementById('score').innerText = `Votre score est : ${score}/${quizData.questions.length}`;
    document.getElementById('quiz-container').innerHTML = ''; // Vider le conteneur une fois le quiz terminé
    document.getElementById('timer').remove(); // Supprimer le timer une fois le quiz terminé
}

fetchQuiz('66e4431754cdf354a9b8e51b');
