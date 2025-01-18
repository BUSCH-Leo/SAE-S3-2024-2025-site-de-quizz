document.addEventListener('DOMContentLoaded', function () {
    let questionData = [];
    let currentQuestionIndex = null;

    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionsList = document.getElementById('questionsList');
    const questionInput = document.querySelector('.main-content input[type="text"]');
    const answerOptionsContainer = document.getElementById('answerOptionsContainer');
    const imageBtn = document.getElementById('imageBtn');
    const videoBtn = document.getElementById('videoBtn');
    const themePreviews = document.querySelectorAll('.theme-preview img');
    const themeContent = document.getElementById('theme-content');
    const questionForm = document.getElementById('questionForm'); 

    const defaultAnswers = [
        "Réponse 1",
        "Réponse 2",
        "Réponse 3",
        "Réponse 4"
    ];

    const themeManager = {
        elements: {
            mainContent: document.querySelector('.main-content'),
            themePreviews: document.querySelectorAll('.theme-preview img'),
            imageBtn: document.getElementById('imageBtn')
        },
        currentTheme: {
            url: null,
            opacity: 0.4
        },
        init() {
            this.initializeImageHandlers();
            this.applyPanelStyles();
        },
        initializeImageHandlers() {
            this.elements.themePreviews.forEach(preview => {
                preview.addEventListener('click', () => {
                    const imageSrc = preview.getAttribute('src');
                    if (imageSrc) {
                        this.applyTheme(imageSrc);
                        this.updatePreviewSelection(preview);
                    }
                });
            });
            this.elements.imageBtn.addEventListener('click', this.handleImageButtonClick.bind(this));
        },
        handleImageButtonClick() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleImageUpload(file);
                }
                document.body.removeChild(fileInput);
            });

            document.body.appendChild(fileInput);
            fileInput.click();
        },
        updatePreviewSelection(selectedPreview) {
            this.elements.themePreviews.forEach(p => 
                p.parentElement.style.transform = 'scale(1)');
            selectedPreview.parentElement.style.transform = 'scale(1.1)';
        },
        applyTheme(imageUrl) {
            if (!imageUrl) return;
            
            this.currentTheme.url = imageUrl;
            
            const img = new Image();
            img.onload = () => {
                const maxWidth = Math.max(window.innerWidth, 1920);
                const maxHeight = Math.max(window.innerHeight, 1080);
                const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
                const width = img.width * ratio;
                const height = img.height * ratio;

                document.body.style.background = `url('${imageUrl}')`;
                document.body.style.backgroundSize = `${width}px ${height}px`;
                document.body.style.imageRendering = 'auto';
            };
            img.src = imageUrl;
            this.elements.mainContent.style.background = 'rgba(255, 255, 255, 0.2)';
            this.applyPanelStyles();
        },
        handleImageUpload(file) {
            if (!file.type.startsWith('image/')) {
                console.error('Le fichier doit être une image');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    this.applyTheme(event.target.result);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        },
        applyPanelStyles() {
            // Logic for applying additional styling if necessary
        }
    };

    themeManager.init();

    function resetQuestionEditor() {
        questionInput.value = "";
        answerOptionsContainer.innerHTML = "";
        defaultAnswers.forEach((placeholder, index) => addAnswerOption(placeholder, index));
    }

    function addAnswerOption(placeholder, index, isCorrect = false) {
        const answerOptionDiv = document.createElement('div');
        answerOptionDiv.className = 'answer-option flex items-center gap-4';
    
        answerOptionDiv.innerHTML = `
            <div class="flex-1">
                <input type="text" class="w-full p-3 border rounded-lg" placeholder="${placeholder}">
            </div>
            <button class="p-2 ${isCorrect ? 'text-green-500' : 'text-gray-400'} hover:bg-green-50 rounded correct-toggle">
                <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
            </button>
            <button class="p-2 text-red-500 hover:bg-red-50 rounded delete-option">
                <i class="fas fa-trash"></i>
            </button>
        `;
    
        answerOptionsContainer.appendChild(answerOptionDiv);
    
        const correctToggle = answerOptionDiv.querySelector('.correct-toggle');
        const deleteOption = answerOptionDiv.querySelector('.delete-option');
    
        correctToggle.addEventListener('click', () => toggleCorrectOption(correctToggle));
        deleteOption.addEventListener('click', () => answerOptionDiv.remove());
    }
    

    function toggleCorrectOption(button) {
        button.classList.toggle('text-green-500');
        button.classList.toggle('text-gray-400');
        const icon = button.querySelector('i');
        icon.classList.toggle('fa-check');
        icon.classList.toggle('fa-times');
    }

    addQuestionBtn.addEventListener('click', function () {
        if (currentQuestionIndex !== null) saveCurrentQuestion();

        const newQuestion = {
            text: "",
            answers: defaultAnswers.map((text, index) => ({ text, index, isCorrect: false })),
            theme: null,
            media: null
        };

        questionData.push(newQuestion);
        currentQuestionIndex = questionData.length - 1;
        renderQuestionsList();
        resetQuestionEditor();
        highlightNewQuestion(currentQuestionIndex);
        scrollToBottom();
    });

    function saveCurrentQuestion() {
        if (currentQuestionIndex !== null) {
            const currentQuestion = questionData[currentQuestionIndex];
            currentQuestion.text = questionInput.value;
            currentQuestion.answers = Array.from(answerOptionsContainer.children).map((optionDiv, index) => ({
                text: optionDiv.querySelector('input').value,
                index,
                isCorrect: optionDiv.querySelector('.correct-toggle').classList.contains('text-green-500')
            }));
            renderQuestionsList();
        }
    }

    function renderQuestionsList() {
        questionsList.innerHTML = "";
        questionData.forEach((question, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card p-4 cursor-pointer border hover:border-blue-500 relative';
            questionCard.dataset.questionId = index;

            questionCard.innerHTML = `
                <span class="font-medium">Question ${index + 1}</span>
                <p class="text-sm text-gray-600 truncate">${question.text || "Nouvelle question"}</p>
                <button class="delete-question absolute top-2 right-2 text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            questionCard.addEventListener('click', function () {
                saveCurrentQuestion();
                currentQuestionIndex = index;
                loadQuestion(index);
            });

            questionCard.querySelector('.delete-question').addEventListener('click', function (e) {
                e.stopPropagation();
                deleteQuestion(index);
            });

            questionsList.appendChild(questionCard);
        });
    }

    function loadQuestion(index) {
        const question = questionData[index];
        questionInput.value = question.text;
        answerOptionsContainer.innerHTML = "";
        question.answers.forEach(answer => addAnswerOption(answer.text, answer.index, answer.isCorrect));
    }

    function deleteQuestion(index) {
        questionData.splice(index, 1);
        currentQuestionIndex = null;
        renderQuestionsList();
        resetQuestionEditor();
    }

    function highlightNewQuestion(index) {
        const questionCards = questionsList.children;
        if (questionCards[index]) {
            questionCards[index].classList.add('bg-green-100');
            setTimeout(() => questionCards[index].classList.remove('bg-green-100'), 1000);
        }
    }

    function scrollToBottom() {
        questionsList.scrollTop = questionsList.scrollHeight;
    }

    questionInput.addEventListener('input', function () {
        if (currentQuestionIndex !== null) {
            questionData[currentQuestionIndex].text = questionInput.value;
            renderQuestionsList();
        }
    });

    resetQuestionEditor();
});
