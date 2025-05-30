let quizData = [];
let currentQuizIndex = 0;
let currentQuestionIndex = 0;
let userAnswers = [];
let timer;
let timePerQuestion = 30;
let timeLeft = timePerQuestion;

// Récupération de la catégorie depuis l'URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

function getQuickQuizParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const count = urlParams.get('count');
    const difficulty = urlParams.get('difficulty');
    const questionTime = urlParams.get('questionTime');
    return { count, difficulty, questionTime };
}

const { count, difficulty, questionTime } = getQuickQuizParams();
if (count && difficulty) {
    timePerQuestion = questionTime ? parseInt(questionTime) : 30;
    fetchQuickQuizzes(count, difficulty);
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
        const quizzes = await response.json();

        if (quizzes.length === 0) {
            showAlert('Aucun quiz disponible pour cette catégorie.');
            return;
        }

        const allQuestions = quizzes.flatMap(quiz => quiz.questions);
        quizData = [{ questions: shuffleArray(allQuestions) }];

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
            
            quizzes.forEach(quiz => {
                quiz.questions = shuffleArray(quiz.questions);  
            });

            const allQuestions = quizzes.flatMap(quiz => quiz.questions);
            const shuffledQuestions = shuffleArray(allQuestions);

            quizData = [{
                questions: shuffledQuestions
            }];

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
    const questionTime = document.getElementById('question-time').value || 30;
    const difficulty = document.getElementById('difficulty').value;
    const urlParams = new URLSearchParams({ count, difficulty, questionTime });

    window.location.href = `/quiz?${urlParams.toString()}`;
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
        const totalQuestions = currentQuiz.questions.length;
        const currentQuestionNumber = currentQuestionIndex + 1;
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
    timeLeft = timePerQuestion;
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
    } else if (currentQuizIndex < quizData.length - 1) {
        currentQuizIndex++;
        currentQuestionIndex = 0;
        displayCurrentQuestion();
        startTimer();
    } else {
        calculateScore();
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
                totalScore += Math.round(50 + (timeLeft / timePerQuestion * 50)) + 1;
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
    localStorage.setItem('score', totalScore); 
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


document.querySelector('.close').addEventListener('click', closeModal);

// Fermer la modale en cliquant en dehors du contenu
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
const categoryBackgrounds = {
    "6713a755f012fc38a3f26092": [
        "/ressource/categorie/music1.jpg",
        "/ressource/categorie/music2.jpg",
        "/ressource/categorie/music3.jpg"
    ],
    "6713a755f012fc38a3f26098": [
        "/ressource/categorie/film1.jpg",
        "/ressource/categorie/film2.jpg",
        "/ressource/categorie/film3.jpg"
    ],
    "6713a755f012fc38a3f2609f": [
        "/ressource/categorie/theatre1.jpg",
        "/ressource/categorie/theatre2.jpg",
        "/ressource/categorie/theatre3.jpg"
    ],
    "6713a756f012fc38a3f260a5": [
        "/ressource/categorie/videogame1.jpg",
        "/ressource/categorie/videogame2.jpg",
        "/ressource/categorie/videogame3.jpg"
    ],
    "6713a756f012fc38a3f260ab": [
        "/ressource/categorie/computer1.jpg",
        "/ressource/categorie/computer2.jpg",
        "/ressource/categorie/computer3.jpg"
    ],
    "6713a756f012fc38a3f260b1": [
        "/ressource/categorie/nature1.jpg",
        "/ressource/categorie/nature2.jpg",
        "/ressource/categorie/nature3.jpg"
    ],
    "6713a756f012fc38a3f260b7": [
        "/ressource/categorie/television1.jpg",
        "/ressource/categorie/television2.jpg",
        "/ressource/categorie/television3.jpg"
    ],
    "6713a756f012fc38a3f260c1": [
        "/ressource/categorie/generalknownledge1.jpg",
        "/ressource/categorie/generalknownledge2.jpg",
        "/ressource/categorie/generalknownledge3.jpg"
    ],
    "6713a756f012fc38a3f260c7": [
        "/ressource/categorie/vehicles1.jpg",
        "/ressource/categorie/vehicles2.jpg",
        "/ressource/categorie/vehicles3.jpg"
    ],
    "6713a757f012fc38a3f260d5": [
        "/ressource/categorie/geography1.jpg",
        "/ressource/categorie/geography2.jpg",
        "/ressource/categorie/geography3.jpg"
    ],
    "6713a757f012fc38a3f260e7": [
        "/ressource/categorie/books1.jpg",
        "/ressource/categorie/books2.jpg",
        "/ressource/categorie/books3.jpg"
    ],
    "6713a757f012fc38a3f260ed": [
        "/ressource/categorie/history1.jpg",
        "/ressource/categorie/history2.jpg",
        "/ressource/categorie/history3.jpg"
    ],
    "6713a758f012fc38a3f260fb": [
        "/ressource/categorie/mythology1.jpg",
        "/ressource/categorie/mythology2.jpg",
        "/ressource/categorie/mythology3.jpg"
    ],
    "6713a758f012fc38a3f26111": [
        "/ressource/categorie/cartoon1.jpg",
        "/ressource/categorie/cartoon2.jpg",
        "/ressource/categorie/cartoon3.jpg"
    ],
    "6713a758f012fc38a3f2611b": [
        "/ressource/categorie/comics1.jpg",
        "/ressource/categorie/comics2.jpg",
        "/ressource/categorie/comics3.jpg"
    ],
    "6713a759f012fc38a3f26135": [
        "/ressource/categorie/gadgets1.jpg",
        "/ressource/categorie/gadgets2.jpg",
        "/ressource/categorie/gadgets3.jpg"
    ],
    "6713a75ef012fc38a3f261f7": [
        "/ressource/categorie/animals1.jpg",
        "/ressource/categorie/animals2.jpg",
        "/ressource/categorie/animals3.jpg"
    ],
    "6713a75ef012fc38a3f26209": [
        "/ressource/categorie/animemanga1.jpg",
        "/ressource/categorie/animemanga2.jpg",
        "/ressource/categorie/animemanga3.jpg"
    ],
    "6713a75ef012fc38a3f2621f": [
        "/ressource/categorie/sports1.jpg",
        "/ressource/categorie/sports2.jpg",
        "/ressource/categorie/sports3.jpg"
    ],
    "6713a75ff012fc38a3f26245": [
        "/ressource/categorie/boardgames1.jpg",
        "/ressource/categorie/boardgames2.jpg",
        "/ressource/categorie/boardgames3.jpg"
    ],
    "6713a760f012fc38a3f26267": [
        "/ressource/categorie/art1.jpg",
        "/ressource/categorie/art2.jpg",
        "/ressource/categorie/art3.jpg"
    ],
    "6713a763f012fc38a3f262d5": [
        "/ressource/categorie/celebrity1.jpg",
        "/ressource/categorie/celebrity2.jpg",
        "/ressource/categorie/celebrity3.jpg"
    ],
    "6713a768f012fc38a3f263c7": [
        "/ressource/categorie/politics1.jpg",
        "/ressource/categorie/politics2.jpg",
        "/ressource/categorie/politics3.jpg"
    ],
    "6713a76bf012fc38a3f26439": [
        "/ressource/categorie/maths1.jpg",
        "/ressource/categorie/maths2.jpg",
        "/ressource/categorie/maths3.jpg"
    ]
};

function getRandomBackground(categoryId) {
    const backgrounds = categoryBackgrounds[categoryId];
    if (backgrounds && backgrounds.length > 0) {
        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        return backgrounds[randomIndex];
    }
    return null;
}

function applyBackgroundForCategory(categoryId) {
    const backgroundUrl = getRandomBackground(categoryId);
    if (backgroundUrl) {
        document.body.style.background = `url('${backgroundUrl}') no-repeat center center fixed`;
        document.body.style.backgroundSize = "cover";
    } else {
        console.warn(`Aucun fond défini pour l'ID de catégorie : ${categoryId}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const projectDataScript = document.getElementById('project-data');
    if (projectDataScript) {
        const project = JSON.parse(projectDataScript.textContent);
        quizData = [{ questions: shuffleArray(project.questions) }];
        currentQuizIndex = 0;
        currentQuestionIndex = 0;
        userAnswers = [];
        displayCurrentQuestion();
        startTimer();
    } else {
        const categoryId = getCategoryFromURL();
        if (categoryId) {
            fetchQuizzes();
        } else {
            const { count, difficulty } = getQuickQuizParams();
            if (count && difficulty) {
                fetchQuickQuizzes(count, difficulty);
            }
        }
    }

    const categoryId = getCategoryFromURL();
    if (categoryId) {
        applyBackgroundForCategory(categoryId);
    } else {
        console.warn("Aucune catégorie spécifiée dans l'URL.");
    }
});
fetchQuizzes();
