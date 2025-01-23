document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    if (!projectId) {
        alert('Project ID is missing in the URL');
        return;
    }

    try {
        const response = await fetch(`/quizzes/${projectId}`);
        const data = await response.json();

        if (data._id) {
            const project = data;
            document.querySelector('.quiz-title').value = project.name;
            // Populate other fields with project data
            project.questions.forEach((question, index) => {
                createQuestionElement(question, index);
            });
        } else {
            alert('Failed to load project data');
        }
    } catch (error) {
        console.error('Error fetching project data:', error);
        alert('An error occurred while fetching project data');
    }
});

function createQuestionElement(question, index) {
    const questionList = document.getElementById('questionsList');
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card p-4 cursor-pointer border hover:border-blue-500 relative shadow-md rounded-lg transition-all duration-300';
    questionCard.dataset.questionId = index + 1;

    const questionHeader = document.createElement('div');
    questionHeader.className = 'flex items-center justify-between mb-2';

    const questionTitle = document.createElement('span');
    questionTitle.className = 'font-medium';
    questionTitle.textContent = `Question ${index + 1}`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-question text-red-500 hover:text-red-700 transition-colors duration-300';
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener('click', () => {
        questionCard.remove();
    });

    const questionText = document.createElement('p');
    questionText.className = 'text-sm text-gray-600 truncate';
    questionText.textContent = question.questionText;

    questionHeader.appendChild(questionTitle);
    questionHeader.appendChild(deleteButton);
    questionCard.appendChild(questionHeader);
    questionCard.appendChild(questionText);
    questionList.appendChild(questionCard);
}