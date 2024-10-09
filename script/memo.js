document.addEventListener('DOMContentLoaded', function () {
    displayMemos();
    displayScore();
    displayJoke();
});

// Fonction pour afficher les mémos
function displayMemos() {
    const memoData = JSON.parse(localStorage.getItem('memos'));
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

            setTimeout(() => {
                memoElement.style.opacity = '1';
                memoElement.style.transform = 'translateY(0)';
            }, index * 150);
        });
    } else {
        memoContainer.innerHTML = '<p>Aucune réponse enregistrée.</p>';
    }
}

// Fonction pour afficher le score
function displayScore() {
    const userScore = localStorage.getItem('score') || 0; 
    document.getElementById('user-score').innerText = userScore; 
    return userScore; 
}

// Fonction pour afficher des blagues
function displayJoke() {
    const userScore = localStorage.getItem('score') || 0; 
    const jokes = [
        `c'est deux fois plus que : ${Math.floor(userScore / 2)}`,
        `c'est presque autant que : ${userScore + 1}`,
        `vous avez dépassé le score de : ${Math.floor(Math.random() * (userScore - 1)) + 1}`,
        `vous avez battu votre record précédent de : ${userScore - 10}`,
        `vous êtes sur la bonne voie pour atteindre : ${userScore * 1.5}`,
        `personne n'a fait mieux que : ${Math.floor(Math.random() * (userScore - 1)) + 1}`,
        `Vous êtes dans le top ${Math.floor(Math.random() * 99) + 1} %`,
        `Vous êtes plus intelligent que ${Math.floor(Math.random() * 99) + 1} % de la population`,
        `Vous êtes à ${Math.floor(1000 - userScore)} points de 1000 points`,
        `Vous avez aussi bien réussi le quiz que quelqu'un qui a bien réussi le quiz`,
        `c'est quatre fois plus que : ${Math.floor(userScore / 4)}`,
        `c'est deux fois moins que : ${Math.floor(userScore * 2)}`
    ];

    function getRandomJokes(jokesArray, n) {
        const shuffled = [...jokesArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    }

    const selectedJokes = getRandomJokes(jokes, 3);

    const jokeList = document.createElement('ul');
    selectedJokes.forEach(joke => {
        const listItem = document.createElement('li');
        listItem.textContent = joke;
        jokeList.appendChild(listItem);
    });

    const jokeContainer = document.getElementById('joke-text');
    jokeContainer.innerHTML = '';
    jokeContainer.appendChild(jokeList);
}
