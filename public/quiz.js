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
    const categoryId = getCategoryFromURL();

    try {
        const response = await fetch(`/api/quiz/category/${categoryId}`);
        const quizList = await response.json();

        if (quizList.length === 0) {
            alert('Aucun quiz disponible pour cette catégorie.');
            return;
        }

        const selectedQuiz = quizList[0];
        quizData = selectedQuiz;
        currentQuestionIndex = 0;
        userAnswers = [];

        displayCurrentQuestion();
        startTimer();
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
        questionElement.classList.add('question-area', 'p-4');
        questionElement.innerHTML = `<h3 class="question-text">${currentQuestionIndex + 1}. ${question.question}</h3>`;
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

function startTimer() {
    let timeLeft = timePerQuestion;
    const timerElement = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    timerElement.innerText = `Temps restant : ${timePerQuestion}s`;
    progressBar.style.width = '100%';

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

    if (document.querySelector('.selected')) {
        nextQuestion();
    } else {
        alert('Veuillez sélectionner une réponse avant de continuer.');
    }
});

fetchQuiz();
