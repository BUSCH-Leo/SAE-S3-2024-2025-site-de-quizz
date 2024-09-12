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
    quizContainer.innerHTML = ''; 

    quizData.questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `<h3>${question.question}</h3>`;
        
        const answers = [...question.incorrect_answers, question.correct_answer]; // Toutes les réponses
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

fetchQuiz('66d9ac76e1496d2db8fe1198');  
