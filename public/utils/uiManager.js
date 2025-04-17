export function getAnswersFromUI(questionType, container) {
    switch (questionType) {
        case 'multiple':
        case 'standart':
            return Array.from(container.children).map((optionDiv, index) => ({
                text: optionDiv.querySelector('input').value,
                index,
                isCorrect: optionDiv.querySelector('.correct-toggle').classList.contains('text-green-500')
            }));
        case 'truefalse':
            return Array.from(container.children).map((optionDiv, index) => ({
                text: optionDiv.querySelector('.text-center').textContent.trim(),
                index,
                isCorrect: optionDiv.querySelector('.correct-toggle').classList.contains('text-green-500')
            }));
        case 'price':
            const priceInput = container.querySelector('input[type="number"]');
            return [{
                text: priceInput.value,
                isCorrect: true
            }];
    }
}

export function getCorrectAnswerFromUI(questionType, container) {
    if (questionType === 'multiple') {
        return container.querySelectorAll('.correct-toggle .fa-check').length > 0;
    } else if (questionType === 'truefalse') {
        const trueButton = container.querySelector('.answer-option:nth-child(1) .correct-toggle .fa-check');
        return !!trueButton;
    }
    return false;
}