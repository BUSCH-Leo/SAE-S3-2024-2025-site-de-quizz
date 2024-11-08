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


// Fonction pour mélanger aléatoirement un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}

async function fetchQuizzes() {
    const categoryId = getCategoryFromURL();

    try {
        const response = await fetch(`/api/quiz/category/${categoryId}`);
        quizData = await response.json();

        if (quizData.length === 0) {
            showAlert('Aucun quiz disponible pour cette catégorie.');
            return;
        }


        quizData = shuffleArray(quizData);

        quizData.forEach(quiz => {
            quiz.questions = shuffleArray(quiz.questions);
        });

        currentQuizIndex = 0;
        currentQuestionIndex = 0;
        userAnswers = [];
        displayCurrentQuestion();
        startTimer();
    } catch (error) {
        console.error('Erreur lors de la récupération des quiz', error);
    }
}

async function fetchQuickQuizzes(count, difficulty) {
    try {
        const response = await fetch(`/api/quiz/quick?count=${count}&difficulty=${difficulty}`);
        const quizzes = await response.json();

        if (response.ok && quizzes.length > 0) {
            console.log('Quiz Rapide:', quizzes);

            quizData = quizzes.map(quiz => ({
                questions: quiz.questions
            }));

            currentQuizIndex = 0;
            currentQuestionIndex = 0;
            userAnswers = [];
            displayCurrentQuestion();
            startTimer();
        } else {
            console.error('Erreur: Quiz data format invalide ou questions manquantes');
        }
    } catch (error) {
        console.error('Erreur de réseau:', error);
    }
}



function startQuickQuiz() {
    const count = document.getElementById('question-count').value || 10; 
    const difficulty = document.getElementById('difficulty').value;
    fetchQuickQuizzes(count, difficulty);
}

const startQuickQuizButton = document.getElementById('start-quick-quiz');
if (startQuickQuizButton) {
    startQuickQuizButton.addEventListener('click', startQuickQuiz);
} else {
    console.error("L'élément 'start-quick-quiz' est introuvable.");
}


// Fonction pour afficher la question actuelle
function displayCurrentQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) {
        console.error("L'élément 'quiz-container' est introuvable.");
        return;
    }

    if (!quizData || quizData.length === 0 || !quizData[currentQuizIndex]) {
        console.error("Les données du quiz sont invalides ou non disponibles.");
        quizContainer.innerHTML = '<p>Aucune donnée de quiz disponible.</p>';
        return;
    }

    const currentQuiz = quizData[currentQuizIndex];
    if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
        quizContainer.innerHTML = '<p>Aucune question disponible pour ce quiz.</p>';
        return;
    }

    // Reste du code pour afficher la question
    quizContainer.classList.remove('fade-in');
    quizContainer.classList.add('fade-out');
    setTimeout(() =>  {
        quizContainer.innerHTML = '';

        const currentQuiz = quizData[currentQuizIndex];

        if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
            quizContainer.innerHTML = '<p>Aucune question disponible pour ce quiz.</p>';
            return;
        }

        const question = currentQuiz.questions[currentQuestionIndex];
        const questionElement = document.createElement('div');
        questionElement.classList.add('question-area', 'p-4');
        const totalQuestions = quizData.reduce((total, quiz) => total + quiz.questions.length, 0);
        const currentQuestionNumber = userAnswers.reduce((total, quizAnswers) => total + (quizAnswers ? quizAnswers.length : 0), 0) + currentQuestionIndex + 1;
        questionElement.innerHTML = `<h3 class="question-text">Question ${currentQuestionNumber} sur ${totalQuestions}: ${question.question}</h3>`;

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
    let memoData = [];

    quizData.forEach((quiz, quizIndex) => {
        let questionsMemo = [];
        quiz.questions.forEach((question, questionIndex) => {
            totalQuestions++;
            const userAnswer = userAnswers[quizIndex] && userAnswers[quizIndex][questionIndex];
            const correctAnswer = question.correct_answer;
            if (userAnswer === correctAnswer) {
                totalScore++;
            }

            questionsMemo.push({
                question: question.question,
                userAnswer: userAnswer || "Aucune réponse",
                correctAnswer: correctAnswer
            });
        });
        memoData.push({ questions: questionsMemo });
    });

    // Sauvegarder le score et les mémos dans localStorage
    localStorage.setItem('score', totalScore); // Sauvegarder le score
    localStorage.setItem('memos', JSON.stringify(memoData));

    // Rediriger vers la page des mémos
    window.location.href = '/memo.html';
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

// Événement pour la croix de fermeture de la modale
document.querySelector('.close').addEventListener('click', closeModal);

// (Optionnel) Fermer la modale en cliquant en dehors du contenu
window.addEventListener('click', function(event) {
    const modal = document.getElementById('alert-modal');
    if (event.target === modal) {
        closeModal();
    }
});


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
