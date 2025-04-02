export function getMultipleChoiceTemplate(index, text = "", isCorrect = false) {
    const placeholderText = index <= 2 ? `Réponse ${index} (obligatoire)` : `Réponse ${index} (facultative)`;
    return `
        <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <div class="flex-1">
                <input type="text" placeholder="${placeholderText}" value="${text}" class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
            </div>
            <button class="p-2 ${isCorrect ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
            </button>
            ${index > 4 ? `
            <button class="p-2 text-red-500 hover:text-red-700 rounded delete-option transition-colors duration-300">
                <i class="fas fa-trash"></i>
            </button>` : ''}
        </div>
    `;
}

export function getTrueFalseTemplate(trueIsCorrect = false, falseIsCorrect = false) {
    return `
        <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <div class="flex-1">
                <div class="w-full p-2 border rounded-lg text-center">Vrai</div>
            </div>
            <button class="p-2 ${trueIsCorrect ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                <i class="fas ${trueIsCorrect ? 'fa-check' : 'fa-times'}"></i>
            </button>
        </div>
        <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <div class="flex-1">
                <div class="w-full p-2 border rounded-lg text-center">Faux</div>
            </div>
            <button class="p-2 ${falseIsCorrect ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                <i class="fas ${falseIsCorrect ? 'fa-check' : 'fa-times'}"></i>
            </button>
        </div>
    `;
}

export function getPriceTemplate(price = "") {
    return `
        <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <div class="flex-1">
                <input type="number" placeholder="Prix correct" value="${price}" class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
            </div>
        </div>
    `;
}