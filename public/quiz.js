let quizData = {};
let userAnswers = [];
let currentQuestionIndex = 0;
let timer;
let timePerQuestion = 10;
const maxTime = timePerQuestion;

function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

async function fetchQuiz() {
    const categoryId = getCategoryFromURL();  // Récupère l'ID de la catégorie depuis l'URL

    try {
        const response = await fetch(`/api/quiz/category/${categoryId}`);  // Récupère les quiz pour la catégorie sélectionnée
        const quizList = await response.json();

        if (quizList.length === 0) {
            alert('Aucun quiz disponible pour cette catégorie.');
            return;
        }

        const selectedQuiz = quizList[0];  // Sélectionner le premier quiz récupéré
        quizData = selectedQuiz; // Affecte les données du quiz
        currentQuestionIndex = 0; // Réinitialise l'index de la question
        userAnswers = []; // Réinitialise les réponses

        displayCurrentQuestion();  // Affiche la première question
        startTimer();  // Démarre le timer
    } catch (error) {
        console.error('Erreur lors de la récupération du quiz', error);
    }
}


function displayCurrentQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.classList.remove('fade-in');
    quizContainer.classList.add('fade-out');

    setTimeout(() => {
        quizContainer.innerHTML = '';

        if (!quizData.questions || quizData.questions.length === 0) {
            quizContainer.innerHTML = '<p>Aucune question disponible pour ce quiz.</p>';
            return;
        }

        const question = quizData.questions[currentQuestionIndex];
        const questionElement = document.createElement('div');
        questionElement.classList.add('col-12', 'text-center', 'question-card', 'p-4');
        questionElement.innerHTML = `<h3>${currentQuestionIndex + 1}. ${question.question}</h3>`;
        quizContainer.appendChild(questionElement);

        const answers = [...question.incorrect_answers, question.correct_answer].sort();
        answers.forEach((answer) => {
            const answerElement = document.createElement('div');
            answerElement.classList.add('col-md-5', 'answer-card', 'p-3', 'text-center', 'm-2');
            answerElement.innerHTML = `
                <div class="card-body">
                    <h5>${answer}</h5>
                </div>
            `;
            quizContainer.appendChild(answerElement);

            answerElement.addEventListener('click', () => {
                document.querySelectorAll('.answer-card').forEach(card => card.classList.remove('answer-selected'));
                answerElement.classList.add('answer-selected');
                saveAnswer(answer);
            });
        });

        quizContainer.classList.remove('fade-out');
        quizContainer.classList.add('fade-in');
    }, 500);
}

function startTimer() {
    let timeLeft = timePerQuestion;
    const timerElement = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    timerElement.innerText = `Temps restant : ${timePerQuestion}s`;

    clearInterval(timer);
    timer = setInterval(() => {
        timerElement.innerText = `Temps restant : ${timeLeft}s`;
        progressBar.style.width = `${(timeLeft / maxTime) * 100}%`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            alert("Temps écoulé pour cette question !");
            nextQuestion();
        }
    }, 1000);
}

function saveAnswer(selectedAnswer) {
    userAnswers[currentQuestionIndex] = selectedAnswer;
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.questions.length) {
        displayCurrentQuestion();
        startTimer();
    } else {
        clearInterval(timer);
        calculateScore();
    }
}

function calculateScore() {
    let score = 0;

    quizData.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct_answer) {
            score++;
        }
    });

    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML = `
        <div class="finish-animation">Félicitations ! Votre score est de ${score}/${quizData.questions.length}</div>
    `;
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('timer').remove();
    document.getElementById('progress-bar').style.width = '0';
}

document.getElementById('submit').addEventListener('click', () => {
    clearInterval(timer);

    if (document.querySelector('.answer-selected')) {
        nextQuestion();
    } else {
        alert('Veuillez sélectionner une réponse avant de continuer.');
    }
});

fetchQuiz();
