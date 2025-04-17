export function updateLayout(container, questionType, answers = []) {
    container.innerHTML = '';
    
    switch (questionType) {
        case 'multiple':
        case 'standart':
            if (answers.length === 0) {
                // Ajouter 4 options par défaut pour les questions à choix multiple
                for (let i = 1; i <= 4; i++) {
                    container.innerHTML += getMultipleChoiceTemplate(i);
                }
            } else {
                answers.forEach((answer, index) => {
                    container.innerHTML += getMultipleChoiceTemplate(index + 1, answer.text, answer.isCorrect);
                });
            }
            break;
            
        case 'truefalse':
            const trueChecked = answers.find(a => a.text === 'Vrai' && a.isCorrect);
            const falseChecked = answers.find(a => a.text === 'Faux' && a.isCorrect);
            container.innerHTML = getTrueFalseTemplate(!!trueChecked, !!falseChecked);
            break;
            
        case 'price':
            const price = answers.length > 0 ? answers[0].text : "";
            container.innerHTML = getPriceTemplate(price);
            break;
    }
    
    return container;
}

export function showSavedFeedback(message = 'Sauvegardé') {
    const feedbackEl = document.createElement('div');
    feedbackEl.textContent = message;
    feedbackEl.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full opacity-0 transition-opacity duration-300';
    document.body.appendChild(feedbackEl);

    setTimeout(() => {
        feedbackEl.classList.remove('opacity-0');
    }, 100);

    setTimeout(() => {
        feedbackEl.classList.add('opacity-0');
        setTimeout(() => {
            feedbackEl.remove();
        }, 300);
    }, 2000);
}

import { getMultipleChoiceTemplate, getTrueFalseTemplate, getPriceTemplate } from '../components/questionTypes.js';