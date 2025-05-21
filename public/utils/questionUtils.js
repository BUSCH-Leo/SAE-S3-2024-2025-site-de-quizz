export function updateLayout(container, questionType, answers = []) {
    container.innerHTML = '';
    
    switch (questionType) {
        case 'multiple':
        case 'standart':
            if (answers.length === 0) {
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



import { getMultipleChoiceTemplate, getTrueFalseTemplate, getPriceTemplate } from '../components/questionTypes.js';