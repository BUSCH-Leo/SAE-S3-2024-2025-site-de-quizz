import { showFeedback } from './domUtils.js';

export function setupQuestionEventListeners(editor) {
    // Configuration des écouteurs d'événements pour la question actuelle
    editor.addQuestionBtn.addEventListener('click', () => editor.addNewQuestion());
    editor.addOptionBtn.addEventListener('click', () => editor.addAnswerOption());
    editor.questionInput.addEventListener('input', () => editor.saveCurrentQuestion());
    editor.timeSlider.addEventListener('input', () => editor.updateTimeDisplay());
    editor.fileInput.addEventListener('change', (e) => editor.handleFileUpload(e));
    editor.submitQuizBtn.addEventListener('click', () => editor.submitQuiz());

    // Configuration des boutons de type de question
    Object.entries(editor.questionTypeButtons).forEach(([type, button]) => {
        button.addEventListener('click', () => editor.setQuestionType(type));
    });
}

export function setupAnswerEventListeners(editor) {
    // Configuration des écouteurs d'événements pour les options de réponse
    editor.answerOptionsContainer.querySelectorAll('.correct-toggle').forEach(button => {
        button.addEventListener('click', (e) => editor.toggleCorrectAnswer(e));
    });

    editor.answerOptionsContainer.querySelectorAll('.delete-option').forEach(button => {
        button.addEventListener('click', (e) => editor.deleteAnswerOption(e));
    });

    editor.answerOptionsContainer.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => editor.saveCurrentQuestion());
    });
}

export function toggleCorrectAnswer(e, questionType, container) {
    const icon = e.currentTarget.querySelector('i');
    
    // Pour les questions standard et vrai/faux, une seule réponse peut être correcte
    if (questionType === 'truefalse' || questionType === 'standart') {
        // Définir toutes les options comme incorrectes
        container.querySelectorAll('.correct-toggle').forEach(btn => {
            const otherIcon = btn.querySelector('i');
            otherIcon.classList.replace('fa-check', 'fa-times');
            btn.classList.remove('text-green-500');
            btn.classList.add('text-gray-400');
        });
        
        // Définir l'option cliquée comme correcte
        icon.classList.replace('fa-times', 'fa-check');
        e.currentTarget.classList.remove('text-gray-400');
        e.currentTarget.classList.add('text-green-500');
    } else if (questionType === 'multiple') {
        // Pour les questions à choix multiples, basculer l'état
        if (icon.classList.contains('fa-times')) {
            icon.classList.replace('fa-times', 'fa-check');
            e.currentTarget.classList.remove('text-gray-400');
            e.currentTarget.classList.add('text-green-500');
        } else {
            icon.classList.replace('fa-check', 'fa-times');
            e.currentTarget.classList.remove('text-green-500');
            e.currentTarget.classList.add('text-gray-400');
        }
        
        // Vérifier qu'il y a au moins deux réponses correctes pour les questions à choix multiples
        const correctAnswers = container.querySelectorAll('.correct-toggle.text-green-500').length;
        if (correctAnswers < 2) {
            showFeedback('Les questions à choix multiples doivent avoir au moins deux bonnes réponses', 'warning');
        }
    }
}