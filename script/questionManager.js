document.addEventListener('DOMContentLoaded', function () {
    let questionData = [];
    let currentQuestionIndex = null;

    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionsList = document.getElementById('questionsList');
    const questionInput = document.querySelector('.main-content input[type="text"]');
    const answerOptionsContainer = document.getElementById('answerOptionsContainer');
    const mediaUpload = document.getElementById('media-upload-question');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('imagePreview');

    const defaultAnswers = [
        "Réponse 1",
        "Réponse 2",
        "Réponse 3",
        "Réponse 4"
    ];

    function resetMediaUpload() {
        imagePreview.innerHTML = "";
        fileInput.value = "";
        mediaUpload.classList.remove('has-file');
    }

    function resetQuestionEditor() {
        questionInput.value = "";
        answerOptionsContainer.innerHTML = "";
        resetMediaUpload();
        defaultAnswers.forEach((placeholder, index) => addAnswerOption(placeholder, index));
    }

    function addAnswerOption(placeholder, index, isCorrect = false, value = "") {
        const answerOptionDiv = document.createElement('div');
        answerOptionDiv.className = 'answer-option flex items-center gap-4';

        answerOptionDiv.innerHTML = `
            <div class="flex-1">
                <input type="text" class="w-full p-3 border rounded-lg" 
                       placeholder="${placeholder}"
                       value="${value}">
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

        if (currentQuestionIndex !== null) {
            saveCurrentQuestion();
        }

        const newQuestion = {
            text: "",
            answers: defaultAnswers.map((text, index) => ({ 
                text, 
                index, 
                isCorrect: false 
            })),
            media: null
        };

        questionData.push(newQuestion);
        currentQuestionIndex = questionData.length - 1;

        resetQuestionEditor();
        renderQuestionsList();
        highlightNewQuestion(currentQuestionIndex);
    });

    // Sauvegarde l'état complet de la question courante
    function saveCurrentQuestion() {
        if (currentQuestionIndex !== null) {
            const currentQuestion = questionData[currentQuestionIndex];

            currentQuestion.text = questionInput.value;

            currentQuestion.answers = Array.from(answerOptionsContainer.children).map((optionDiv, index) => {
                const input = optionDiv.querySelector('input');
                const correctToggle = optionDiv.querySelector('.correct-toggle');
                return {
                    text: input ? input.value : "",
                    index,
                    isCorrect: correctToggle.classList.contains('text-green-500')
                };
            });

            if (imagePreview.querySelector('img')) {
                currentQuestion.media = imagePreview.querySelector('img').src;
            } else {
                currentQuestion.media = null;
            }

            renderQuestionsList();
        }
    }

    function loadQuestion(index) {
        const question = questionData[index];
        
        questionInput.value = question.text;

        answerOptionsContainer.innerHTML = "";
        question.answers.forEach((answer, idx) => {
            addAnswerOption(
                answer.text || `Réponse ${idx + 1}`, 
                idx,
                answer.isCorrect,
                answer.text
            );
        });

        if (question.media) {
            imagePreview.innerHTML = `<img src="${question.media}" class="max-w-full h-auto rounded">`;
            mediaUpload.classList.add('has-file');
        } else {
            resetMediaUpload();
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

    // Gestion du média
    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" class="max-w-full h-auto rounded">`;
                mediaUpload.classList.add('has-file');

                if (currentQuestionIndex !== null) {
                    questionData[currentQuestionIndex].media = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    });
    


    questionInput.addEventListener('input', function() {
        if (currentQuestionIndex !== null) {
            questionData[currentQuestionIndex].text = this.value;
            renderQuestionsList();
        }
    });

    // Initialisation
    resetQuestionEditor();
});