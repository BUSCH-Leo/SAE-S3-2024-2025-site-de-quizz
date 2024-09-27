let quizData = {};
let userAnswers = [];
let currentQuestionIndex = 0;
let timer;
let timePerQuestion = 10;
const maxTime = timePerQuestion; 

async function fetchQuiz() {
    try {
        const response = await fetch('/api/quiz/random');
        const quizList = await response.json();

        // Vérifier si des quiz sont disponibles
        if (quizList.length === 0) {
            alert('Aucun quiz disponible.');
            return;
        }

        // Choisir le premier quiz récupéré
        const selectedQuiz = quizList[0];

        // Remplir les questions du quiz sélectionné
        quizData = selectedQuiz; // Réassigner à quizData
        currentQuestionIndex = 0; // Réinitialiser l'index de la question
        userAnswers = []; // Réinitialiser les réponses de l'utilisateur

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
        quizContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter la question

        if (!quizData.questions || quizData.questions.length === 0) {
            quizContainer.innerHTML = '<p>Aucune question disponible pour ce quiz.</p>';
            return;
        }

        const question = quizData.questions[currentQuestionIndex]; // Obtenir la question actuelle
        const questionElement = document.createElement('div');
        questionElement.classList.add('col-12', 'text-center', 'question-card', 'p-4');
        questionElement.innerHTML = `<h3>${currentQuestionIndex + 1}. ${question.question}</h3>`;
        quizContainer.appendChild(questionElement);

        const answers = [...question.incorrect_answers, question.correct_answer].sort(); // Mélanger les réponses

        answers.forEach((answer) => {
            const answerElement = document.createElement('div');
            answerElement.classList.add('col-md-5', 'answer-card', 'p-3', 'text-center', 'm-2');
            answerElement.innerHTML = `
                <div class="card-body">
                    <h5>${answer}</h5>
                </div>
            `;
            quizContainer.appendChild(answerElement);

            // Gestion du clic sur une réponse
            answerElement.addEventListener('click', () => {
                document.querySelectorAll('.answer-card').forEach(card => card.classList.remove('answer-selected'));
                answerElement.classList.add('answer-selected');
                saveAnswer(answer); // Enregistre la réponse sélectionnée
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

    // Vérifie si l'index de la question actuelle est inférieur à la longueur des questions
    if (currentQuestionIndex < quizData.questions.length) {
        displayCurrentQuestion(); 
        startTimer(); 
    } else {
        clearInterval(timer); // Arrête le timer
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
    document.getElementById('quiz-container').innerHTML = ''; // Vider le conteneur une fois le quiz terminé
    document.getElementById('timer').remove(); // Supprimer le timer une fois le quiz terminé
    document.getElementById('progress-bar').style.width = '0'; // Réinitialiser la barre de progression
}


document.getElementById('submit').addEventListener('click', () => {
    clearInterval(timer); 

    if (document.querySelector('.answer-selected')) {
        nextQuestion();
    } else {
        alert('Veuillez sélectionner une réponse avant de continuer.'); // Alerte si aucune réponse n'est sélectionnée
    }
});


fetchQuiz();
