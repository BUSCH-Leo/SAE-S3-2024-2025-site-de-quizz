let quizData = [];
let userAnswers = [];

async function fetchQuiz(quizId) {
    try {
        const response = await fetch(`/api/quiz/${quizId}`);
        quizData = await response.json();
        displayQuiz();
    } catch (error) {
        console.error('Erreur lors de la récupération du quiz', error);
    }
}

function displayQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les questions

    if (!quizData.questions || quizData.questions.length === 0) {
        quizContainer.innerHTML = '<p>Aucune question disponible pour ce quiz.</p>';
        return;
    }

    // Limiter le nombre de questions à 10
    const limitedQuestions = quizData.questions.slice(0, 10);

    limitedQuestions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `<h3>${index + 1}. ${question.question}</h3>`;

        const answers = [...question.incorrect_answers, question.correct_answer]; // Mélanger les réponses (correcte + incorrectes)
        answers.forEach((answer) => {
            const answerElement = document.createElement('div');
            answerElement.innerHTML = `
                <input type="radio" name="question${index}" value="${answer}">
                <label>${answer}</label>
            `;
            questionElement.appendChild(answerElement);
        });

        quizContainer.appendChild(questionElement);
    });
}


document.getElementById('submit').addEventListener('click', () => {
    userAnswers = [];
    quizData.questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        userAnswers.push(selectedOption ? selectedOption.value : null);
    });

    calculateScore();
});

function calculateScore() {
    let score = 0;

    quizData.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct_answer) {
            score++;
        }
    });

    document.getElementById('score').innerText = `Votre score est : ${score}/${quizData.questions.length}`;
}

fetchQuiz('66e4431754cdf354a9b8e51b');  
