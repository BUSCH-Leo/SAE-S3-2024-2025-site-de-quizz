class QuestionManager {
    constructor() {
        this.container = document.getElementById('answerOptionsContainer');
        this.addButton = document.getElementById('addOptionBtn');
        this.currentType = 'multiple';
        this.init();
    }

    init() {
        document.getElementById('multipleChoiceBtn').addEventListener('click', () => this.setType('multiple'));
        document.getElementById('truefalseBtn').addEventListener('click', () => this.setType('truefalse'));
        document.getElementById('priceBtn').addEventListener('click', () => this.setType('price'));
        document.getElementById('standartBtn').addEventListener('click', () => this.setType('standart'));
        this.addButton.addEventListener('click', () => this.addMoreOptions());
        this.setType('multiple');
    }

    setType(type) {
        this.currentType = type;
        this.updateLayout();
    }

    getMultipleChoiceTemplate(index) {
        return `
            <div class="answer-option flex items-center gap-4">
                <div class="flex-1">
                    <input type="text" placeholder="Réponse ${index}" class="w-full p-3 border rounded-lg">
                </div>
                <button class="p-2 text-gray-400 hover:bg-green-50 rounded correct-toggle">
                    <i class="fas fa-times"></i>
                </button>
                <button class="p-2 text-red-500 hover:bg-red-50 rounded delete-option">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    getTrueFalseTemplate() {
        return `
            <div class="answer-option flex items-center gap-4">
                <div class="flex-1">
                    <div class="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 text-center">
                        Vrai
                    </div>
                </div>
                <button class="p-2 text-gray-400 hover:bg-green-50 rounded correct-toggle">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="answer-option flex items-center gap-4">
                <div class="flex-1">
                    <div class="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 text-center">
                        Faux
                    </div>
                </div>
                <button class="p-2 text-gray-400 hover:bg-green-50 rounded correct-toggle">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
    

    getPriceTemplate() {
        return `
            <div class="answer-option flex items-center gap-4">
                <div class="flex-1">
                    <input type="text" placeholder="Question" class="w-full p-3 border rounded-lg">
                </div>
            </div>
        `;
    }

    updateLayout() {

        this.container.innerHTML = '';

        // Gérer l'affichage selon le type
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
            this.container.innerHTML += this.getMultipleChoiceTemplate(currentOptions + 2);
            this.initializeEventListeners();

            if (currentOptions + 2 >= 6) {
                this.addButton.style.display = 'none';
            }
        }
    }

    initializeEventListeners() {
        this.container.querySelectorAll('.correct-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                const icon = e.currentTarget.querySelector('i');
                
                
                if (this.currentType === 'truefalse' || this.currentType === 'standart') {

                    this.container.querySelectorAll('.correct-toggle').forEach(btn => {
                        const otherIcon = btn.querySelector('i');
                        otherIcon.classList.replace('fa-check', 'fa-times');
                        btn.classList.remove('text-green-500');
                    });
                }

                if (icon.classList.contains('fa-times')) {
                    icon.classList.replace('fa-times', 'fa-check');
                    e.currentTarget.classList.add('text-green-500');
                } else {
                    icon.classList.replace('fa-check', 'fa-times');
                    e.currentTarget.classList.remove('text-green-500');
                }
            });
        });
    
        this.container.querySelectorAll('.delete-option').forEach(button => {
            button.addEventListener('click', (e) => {
                e.currentTarget.closest('.answer-option').remove();
                this.updateOptionNumbers();
            });
        });
    }
    
    
    updateOptionNumbers() {
        this.container.querySelectorAll('.answer-option input[type="text"]').forEach((input, index) => {
            if (!input.readOnly) {
                input.placeholder = `Réponse ${index + 1}`;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.questionManager = new QuestionManager();
});
