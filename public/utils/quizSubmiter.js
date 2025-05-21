export async function submitQuiz(questionData, themeManager, projectId) {
    console.log('Début de la soumission du quiz', { questionData, themeManager, projectId });
    
    try {
        if (!projectId) {
            console.log('ID du projet manquant, tentative de récupération via l\'API');
            try {
                const response = await fetch('/api/current-project');
                const data = await response.json();
                
                if (data.success) {
                    projectId = data.project._id;
                    console.log('ID du projet récupéré avec succès:', projectId);
                } else {
                    console.error('Échec de récupération de l\'ID du projet:', data.message);
                    return { error: 'ID du projet non disponible: ' + data.message };
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'ID du projet:', error);
                return { error: 'Erreur lors de la récupération de l\'ID du projet' };
            }
        }
        
        if (!projectId) {
            console.error('Impossible de continuer sans ID de projet');
            return { error: 'ID du projet manquant' };
        }
        
        if (!Array.isArray(questionData)) {
            console.error('Les données de questions ne sont pas un tableau:', questionData);
            return { error: 'Format de données de questions invalide' };
        }
        
        console.log('Formattage des questions');
        
        const completeQuestionData = questionData.map(question => {
            const formattedQuestion = {
                questionText: question.text || question.questionText || 'Question sans texte',
                mediaUrl: question.media || question.mediaUrl || '',
                mediaType: (question.media || question.mediaUrl) ? 'image' : '',
                timeLimit: parseInt(question.time || question.timeLimit || 30),
                points: parseInt(question.points || 10),
                type: question.type || 'multiple',
                answerOptions: question.answers || question.answerOptions || []
            };

            if (question.type === 'truefalse') {
                formattedQuestion.correctAnswer = !!question.correctAnswer;
            }
            
            if (question.type === 'price') {
                formattedQuestion.correctPrice = parseFloat(question.correctPrice) || 0;
            }
            
            if (question.type === 'multiple' || question.type === 'standart') {
                formattedQuestion.answerOptions = (question.answers || question.answerOptions || []).map(answer => ({
                    text: answer.text || '',
                    isCorrect: !!answer.isCorrect
                }));
            }

            return formattedQuestion;
        });

        const generalParams = {
            theme: themeManager?.currentTheme?.url || document.body.style.backgroundImage?.replace(/url\(['"](.+)['"]\)/, '$1') || '',
            font: document.body.style.fontFamily || 'Arial',
            points: parseInt(document.getElementById('defaultPoints')?.value || 10),
            enableTimeBonus: document.getElementById('enableBonus')?.checked || false
        };

        const quizData = {
            ...generalParams,
            questions: completeQuestionData
        };

        console.log('Données du quiz formatées:', quizData);
        console.log('Envoi de la requête à /api/quizzes/' + projectId);

        const response = await fetch(`/api/quizzes/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quizData)
        });
        
        console.log('Réponse reçue, statut:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur de réponse:', response.status, errorText);
            return { 
                error: `Erreur du serveur (${response.status}): ${errorText}` 
            };
        }
        
        const data = await response.json();
        console.log('Données de réponse:', data);
        
        if (data.error) {
            return { error: data.error };
        }
        
        return data;
    } catch (error) {
        console.error('Erreur lors de la soumission du quiz:', error);
        return { error: 'Erreur lors de la soumission du quiz: ' + error.message };
    }
}