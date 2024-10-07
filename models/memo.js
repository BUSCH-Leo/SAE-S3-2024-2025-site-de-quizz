document.addEventListener('DOMContentLoaded', displayMemos);

function displayMemos() {
    const memoData = JSON.parse(localStorage.getItem('memos')); // Récupérer les mémos du localStorage
    const memoContainer = document.getElementById('memo-content');

    if (memoData) {
        memoData.forEach((memo, index) => {
            const memoElement = document.createElement('div');
            memoElement.classList.add('memo-item', 'shadow-sm', 'p-3', 'mb-3', 'bg-light', 'rounded');

            memoElement.innerHTML = `
                <h4>Quiz ${index + 1}:</h4>
                ${memo.questions.map((q, i) => `
                    <p><strong>Question ${i + 1}:</strong> ${q.question}</p>
                    <p class="user-answer"><strong>Votre réponse:</strong> ${q.userAnswer}</p>
                    <p class="correct-answer"><strong>Bonne réponse:</strong> ${q.correctAnswer}</p>
                `).join('')}
            `;

            memoContainer.appendChild(memoElement);

            // Animation légère pour chaque mémo
            setTimeout(() => {
                memoElement.style.opacity = '1';
                memoElement.style.transform = 'translateY(0)';
            }, index * 150);
        });
    } else {
        memoContainer.innerHTML = '<p>Aucune réponse enregistrée.</p>';
    }
}
