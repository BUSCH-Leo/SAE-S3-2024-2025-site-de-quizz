function togglePanel() {
    const panel = document.querySelector('.volet-coulissant');
    panel.classList.toggle('open');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function applyBackground(value) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.style.background = value;
    quizContainer.style.backgroundSize = 'cover';
    quizContainer.style.backgroundPosition = 'center';
    quizContainer.style.color = value.includes('url') ? 'white' : 'black';
    closeModal();
}

function saveQuiz() {
    const quizType = document.getElementById('quizType').value;
    localStorage.setItem('savedQuiz', quizType);
    alert('Le quiz a été enregistré !');
}
