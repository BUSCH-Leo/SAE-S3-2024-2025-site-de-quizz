class QuestionManager {
    constructor() {
        this.container = document.getElementById('answerOptionsContainer');
        this.addButton = document.getElementById('addOptionBtn');
        this.currentType = 'multiple';
        this.init();
    }

    init() {
        this.initializeTypeButtons();
        this.addButton.addEventListener('click', () => this.addMoreOptions());
        this.setType('multiple');
    }

    initializeTypeButtons() {
        const typeButtons = {
            'multiple': document.getElementById('multipleChoiceBtn'),
            'truefalse': document.getElementById('truefalseBtn'),
            'price': document.getElementById('priceBtn'),
            'standart': document.getElementById('standartBtn')
        };

        Object.entries(typeButtons).forEach(([type, button]) => {
            if (button) {
                button.addEventListener('click', () => {
                    this.setType(type);
                    this.updateTypeButtonStyles(typeButtons, button);
                });
            }
        });
    }

    updateTypeButtonStyles(buttons, activeButton) {
        Object.values(buttons).forEach(button => {
            if (button) {
                button.classList.remove('bg-blue-500', 'text-white');
                button.classList.add('hover:bg-blue-500', 'hover:text-white');
            }
        });
        if (activeButton) {
            activeButton.classList.add('bg-blue-500', 'text-white');
            activeButton.classList.remove('hover:bg-blue-500', 'hover:text-white');
        }
    }

    setType(type) {
        this.currentType = type;
        this.updateLayout();
        this.resetAnswers();
    }

    getMultipleChoiceTemplate(index) {
        return `
            <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div class="flex-1">
                    <input type="text" placeholder="Réponse ${index}" class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                </div>
                <button class="p-2 text-gray-400 hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                    <i class="fas fa-times"></i>
                </button>
                <button class="p-2 text-red-500 hover:text-red-700 rounded delete-option transition-colors duration-300">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    getTrueFalseTemplate() {
        return `
            <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div class="flex-1">
                    <div class="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 text-center">Vrai</div>
                </div>
                <button class="p-2 text-gray-400 hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div class="flex-1">
                    <div class="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 text-center">Faux</div>
                </div>
                <button class="p-2 text-gray-400 hover:text-green-500 rounded correct-toggle transition-colors duration-300">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    getPriceTemplate() {
        return `
            <div class="answer-option flex items-center gap-4 bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div class="flex-1">
                    <input type="number" placeholder="Prix correct" class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                </div>
            </div>
        `;
    }

    updateLayout() {
        this.container.innerHTML = '';
        
        switch (this.currentType) {
            case 'multiple':
            case 'standart':
                for (let i = 1; i <= 4; i++) {
                    this.container.innerHTML += this.getMultipleChoiceTemplate(i);
                }
                this.addButton.style.display = 'block';
                break;

            case 'truefalse':
                this.container.innerHTML = this.getTrueFalseTemplate();
                this.addButton.style.display = 'none';
                break;

            case 'price':
                this.container.innerHTML = this.getPriceTemplate();
                this.addButton.style.display = 'none';
                break;
        }

        this.initializeEventListeners();
    }

    addMoreOptions() {
        const currentOptions = this.container.querySelectorAll('.answer-option').length;
        if (currentOptions < 6) {
            this.container.innerHTML += this.getMultipleChoiceTemplate(currentOptions + 1);
            this.initializeEventListeners();
            
            if (currentOptions + 1 >= 6) {
                this.addButton.style.display = 'none';
            }
        }
    }

    initializeEventListeners() {
        this.container.querySelectorAll('.correct-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                const icon = e.currentTarget.querySelector('i');
                if (this.currentType === 'truefalse' || this.currentType === 'price') {
                    this.container.querySelectorAll('.correct-toggle').forEach(btn => {
                        const otherIcon = btn.querySelector('i');
                        otherIcon.classList.replace('fa-check', 'fa-times');
                        btn.classList.remove('text-green-500');
                        btn.classList.add('text-gray-400');
                    });
                }

                if (icon.classList.contains('fa-times')) {
                    icon.classList.replace('fa-times', 'fa-check');
                    e.currentTarget.classList.remove('text-gray-400');
                    e.currentTarget.classList.add('text-green-500');
                } else {
                    icon.classList.replace('fa-check', 'fa-times');
                    e.currentTarget.classList.remove('text-green-500');
                    e.currentTarget.classList.add('text-gray-400');
                }
            });
        });

        this.container.querySelectorAll('.delete-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const totalOptions = this.container.querySelectorAll('.answer-option').length;
                if (totalOptions > 2) {
                    e.currentTarget.closest('.answer-option').remove();
                    this.updateOptionNumbers();
                    this.addButton.style.display = 'block';
                }
            });
        });

        if (this.currentType === 'price') {
            const priceInput = this.container.querySelector('input[type="number"]');
            if (priceInput) {
                priceInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (value < 0) {
                        e.target.value = 0;
                    }
                });
            }
        }
    }

    updateOptionNumbers() {
        this.container.querySelectorAll('.answer-option input[type="text"]').forEach((input, index) => {
            input.placeholder = `Réponse ${index + 1}`;
        });
    }

    resetAnswers() {

        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });

        const correctToggles = this.container.querySelectorAll('.correct-toggle');
        correctToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            icon.classList.replace('fa-check', 'fa-times');
            toggle.classList.remove('text-green-500');
            toggle.classList.add('text-gray-400');
        });
    }

    getCurrentAnswers() {
        return Array.from(this.container.querySelectorAll('.answer-option')).map(option => {
            const input = option.querySelector('input');
            const correctToggle = option.querySelector('.correct-toggle');
            return {
                text: input ? input.value : option.querySelector('.w-full').textContent.trim(),
                isCorrect: correctToggle.classList.contains('text-green-500')
            };
        });
    }
}

// Initialize the QuestionManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.questionManager = new QuestionManager();
});