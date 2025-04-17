export function submitQuiz(questionData, themeManager) {
    const projectId = new URLSearchParams(window.location.search).get('projectId');
    
    if (!projectId) {
        alert('Project ID is missing in the URL');
        return Promise.reject('Project ID missing');
    }
    
    const completeQuestionData = questionData.map(question => {
        const formattedQuestion = {
            ...question,
            questionText: question.text || 'Question sans texte',
            mediaUrl: question.media || '',
            mediaType: question.media ? 'image' : '',
            timeLimit: question.time || 30,
            points: question.points || 10,
            correctAnswer: question.correctAnswer,
            answerOptions: question.answers || []
        };

        if (question.type !== 'truefalse') {
            delete formattedQuestion.correctAnswer;
        }
        if (question.type !== 'price') {
            delete formattedQuestion.correctPrice;
        }
        if (question.type === 'price') {
            formattedQuestion.correctPrice = parseFloat(question.correctPrice) || 0;
        }
        if (question.type === 'multiple' || question.type === 'standart') {
            formattedQuestion.answerOptions = question.answers.map(answer => ({
                text: answer.text,
                isCorrect: answer.isCorrect
            }));
        }

        return formattedQuestion;
    });

    // Récupérer les paramètres généraux
    const generalParams = {
        theme: themeManager.currentTheme.url,
        font: document.body.style.fontFamily || 'Arial',
        points: parseInt(document.getElementById('defaultPoints').value) || 10,
        enableTimeBonus: document.getElementById('enableBonus').checked
    };

    const quizData = {
        ...generalParams,
        questions: completeQuestionData
    };

    return fetch(`/quizzes/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
            return Promise.reject(data.error);
        }
        return data;
    });
}