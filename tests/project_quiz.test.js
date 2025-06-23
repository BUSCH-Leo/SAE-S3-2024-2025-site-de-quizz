/**
 * @jest-environment jsdom
 */

const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    getAll: () => store
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

delete window.location;
window.location = { href: jest.fn() };

document.body.innerHTML = `
  <div id="quiz-container" class="quiz-container row g-4 justify-content-center"></div>
  <div class="progress mb-4" id="progress-bar-box">
    <div id="progress-bar" class="progress-bar" role="progressbar" style="width: 0%;"></div>
    <span id="timer" class="timer position-absolute">00:00</span>
  </div>
  <div id="score" class="text-center mt-4 score-section"></div>
  <div class="text-center mt-4">
    <button id="submit" class="btn btn-primary submit">Soumettre les réponses</button>
  </div>
  <div id="alert-modal" class="modal">
    <div class="modal-content">
      <span class="close">&times;</span> 
      <p id="modal-message"></p>
    </div>
  </div>
  <script id="project-data" type="application/json">
    {
      "name": "Test Project",
      "theme": "/ressource/editor/nature.jpeg",
      "font": "Arial",
      "points": 10,
      "enableTimeBonus": true,
      "questions": [
        {
          "questionText": "Quelle est la capitale de la France?",
          "type": "standart",
          "timeLimit": 30,
          "points": 10,
          "answerOptions": [
            { "text": "Paris", "isCorrect": true },
            { "text": "Lyon", "isCorrect": false },
            { "text": "Marseille", "isCorrect": false }
          ]
        },
        {
          "questionText": "Quels sont les pays qui font partie de l'Union Européenne?",
          "type": "multiple",
          "timeLimit": 45,
          "points": 20,
          "answerOptions": [
            { "text": "France", "isCorrect": true },
            { "text": "Allemagne", "isCorrect": true },
            { "text": "Russie", "isCorrect": false },
            { "text": "Italie", "isCorrect": true }
          ]
        },
        {
          "questionText": "La Terre est plate",
          "type": "truefalse",
          "timeLimit": 15,
          "points": 5,
          "correctAnswer": false
        },
        {
          "questionText": "Quel est le prix d'un café en France?",
          "type": "price",
          "timeLimit": 20,
          "points": 15,
          "correctPrice": 2.5
        }
      ]
    }
  </script>
`;

let quizData;
let currentQuestionIndex = 0;
let userAnswers = [];
let timer;
let timeLeft;

function decodeHTMLEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

function displayQuestion() {
  const question = quizData[currentQuestionIndex];
  const container = document.getElementById('quiz-container');
  
  container.innerHTML = '';
  
  const questionCard = document.createElement('div');
  questionCard.className = 'col-12 mb-4';
  
  let answersHTML = '';
  
  if (question.type === 'multiple') {
    answersHTML = question.answerOptions.map((answer, index) => `
      <div class="answer-card col-12 col-md-6 mb-3">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="answer${index}" data-index="${index}">
          <label class="custom-control-label" for="answer${index}">
            <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
            <span class="answer-text">${answer.text}</span>
          </label>
        </div>
      </div>
    `).join('');
  } else if (question.type === 'price') {
    answersHTML = `
      <div class="price-input-container">
        <div class="price-input-wrapper">
          <span class="price-currency">€</span>
          <input type="number" id="price-input" class="form-control" placeholder="Entrez le prix">
        </div>
      </div>
    `;
  } else if (question.type === 'truefalse') {
    answersHTML = `
      <div class="tf-container row">
        <div class="col-12 col-md-6 mb-3">
          <div class="answer-card true-option">
            <input type="radio" name="tf" id="true" value="true">
            <label for="true">
              <i class="fas fa-check-circle"></i> Vrai
            </label>
          </div>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <div class="answer-card false-option">
            <input type="radio" name="tf" id="false" value="false">
            <label for="false">
              <i class="fas fa-times-circle"></i> Faux
            </label>
          </div>
        </div>
      </div>
    `;
  } else {
    answersHTML = question.answerOptions.map((answer, index) => `
      <div class="answer-card col-12 col-md-6 mb-3">
        <div class="custom-control custom-radio">
          <input type="radio" name="answer" class="custom-control-input" id="answer${index}" data-index="${index}">
          <label class="custom-control-label" for="answer${index}">
            <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
            <span class="answer-text">${answer.text}</span>
          </label>
        </div>
      </div>
    `).join('');
  }
  
  questionCard.innerHTML = `
    <div class="question-container">
      <div class="question-info">
        <span class="question-number">Question ${currentQuestionIndex + 1}/${quizData.length}</span>
        <span class="question-points">${question.points} points</span>
      </div>
      <div class="question-content">
        <h2 class="question-text">${question.questionText}</h2>
      </div>
      
      <div class="answers-container row g-4">
        ${answersHTML}
      </div>
    </div>
  `;
  
  container.appendChild(questionCard);
  
  if (question.type === 'multiple') {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.parentElement.parentElement.addEventListener('click', (e) => {
        const input = e.currentTarget.querySelector('input');
        if (e.target !== input) {
          input.checked = !input.checked;
        }
        toggleSelectedClass(e.currentTarget);
      });
    });
  } else if (question.type === 'truefalse' || question.type === 'standart') {
    document.querySelectorAll('.answer-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const input = card.querySelector('input');
        input.checked = true;
        clearSelectedClass();
        card.classList.add('selected');
      });
    });
  }
  
  startTimer(question.timeLimit);
  updateProgressBar();
}

function toggleSelectedClass(element) {
  const input = element.querySelector('input');
  if (input.checked) {
    element.classList.add('selected');
  } else {
    element.classList.remove('selected');
  }
}

function clearSelectedClass() {
  document.querySelectorAll('.answer-card').forEach(card => {
    card.classList.remove('selected');
  });
}

function startTimer(duration) {
  clearInterval(timer);
  timeLeft = duration;
  const timerDisplay = document.getElementById('timer');
  
  timerDisplay.textContent = `Temps: ${timeLeft}s`;
  document.getElementById('progress-bar').style.width = '100%';
  
  timer = setInterval(() => {
    timerDisplay.textContent = `Temps: ${timeLeft}s`;
    const progress = (timeLeft / duration) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    if (--timeLeft < 0) {
      clearInterval(timer);
      showAlert("Temps écoulé pour cette question !");
      nextQuestion();
    }
  }, 1000);
}

function collectAnswer() {
  const question = quizData[currentQuestionIndex];
  let answer = [];
  
  if (question.type === 'multiple') {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    answer = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
  } else if (question.type === 'price') {
    const priceInput = document.getElementById('price-input');
    answer = [parseFloat(priceInput.value)];
  } else if (question.type === 'truefalse') {
    const selected = document.querySelector('input[name="tf"]:checked');
    answer = selected ? [selected.value === 'true'] : [];
  } else {
    const selected = document.querySelector('input[name="answer"]:checked');
    answer = selected ? [parseInt(selected.dataset.index)] : [];
  }
  
  userAnswers[currentQuestionIndex] = answer;
}

function nextQuestion() {
  collectAnswer();
  clearInterval(timer);
  
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    showResults();
  }
}

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
}

function showResults() {
  const score = calculateScore();
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <div class="results p-4">
      <h2>Quiz Terminé!</h2>
      <p>Votre score: ${score}/${quizData.reduce((acc, q) => acc + q.points, 0)}</p>
    </div>
  `;
  document.getElementById('submit').style.display = 'none';
}

function calculateScore() {
  let score = 0;
  quizData.forEach((question, index) => {
    const userAns = userAnswers[index] || [];
    
    if (question.type === 'multiple') {
      const correctIndexes = question.answerOptions
        .map((opt, idx) => opt.isCorrect ? idx : null)
        .filter(idx => idx !== null);
      if (arraysEqual(correctIndexes.sort(), userAns.sort())) {
        score += question.points;
      }
    } else if (question.type === 'price') {
      if (userAns[0] === question.correctPrice) {
        score += question.points;
      }
    } else if (question.type === 'truefalse') {
      if (userAns[0] === question.correctAnswer) {
        score += question.points;
      }
    } else {
      const correctIndex = question.answerOptions.findIndex(opt => opt.isCorrect);
      if (userAns[0] === correctIndex) {
        score += question.points;
      }
    }
  });
  return score;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function showAlert(message) {
  const modalMessage = document.getElementById('modal-message');
  modalMessage.textContent = message;
  document.getElementById('alert-modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('alert-modal').style.display = 'none';
}

describe('Project Quiz Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentQuestionIndex = 0;
    userAnswers = [];
    clearInterval(timer);
    
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('score').innerHTML = '';
    document.getElementById('alert-modal').style.display = 'none';
    document.getElementById('submit').style.display = 'block';
    
    const projectDataScript = document.getElementById('project-data');
    const projectDataText = projectDataScript.textContent.trim();
    const projectData = JSON.parse(decodeHTMLEntities(projectDataText));
    quizData = projectData.questions;
  });
  
  test('chargement des données du projet et affichage de la première question', () => {
    displayQuestion();
    
    const container = document.getElementById('quiz-container');
    expect(container.innerHTML).toContain('Quelle est la capitale de la France?');
    expect(container.innerHTML).toContain('Question 1/4');
    expect(container.innerHTML).toContain('10 points');
    expect(container.innerHTML).toContain('Paris');
    expect(container.innerHTML).toContain('Lyon');
    expect(container.innerHTML).toContain('Marseille');
  });
  
  test('affichage correct d\'une question à choix multiples', () => {
    currentQuestionIndex = 1;
    displayQuestion();
    
    const container = document.getElementById('quiz-container');
    expect(container.innerHTML).toContain('Quels sont les pays qui font partie de l\'Union Européenne?');
    expect(container.innerHTML).toContain('Question 2/4');
    expect(container.innerHTML).toContain('20 points');
    expect(container.innerHTML).toContain('France');
    expect(container.innerHTML).toContain('Allemagne');
    expect(container.innerHTML).toContain('Russie');
    expect(container.innerHTML).toContain('Italie');
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(4);
  });
  
  test('affichage correct d\'une question vrai/faux', () => {
    currentQuestionIndex = 2;
    displayQuestion();
    
    const container = document.getElementById('quiz-container');
    expect(container.innerHTML).toContain('La Terre est plate');
    expect(container.innerHTML).toContain('Question 3/4');
    expect(container.innerHTML).toContain('5 points');
    expect(container.innerHTML).toContain('Vrai');
    expect(container.innerHTML).toContain('Faux');
    
    const radios = document.querySelectorAll('input[type="radio"]');
    expect(radios.length).toBe(2);
  });
  
  test('affichage correct d\'une question de type prix', () => {
    currentQuestionIndex = 3;
    displayQuestion();
    
    const container = document.getElementById('quiz-container');
    expect(container.innerHTML).toContain('Quel est le prix d\'un café en France?');
    expect(container.innerHTML).toContain('Question 4/4');
    expect(container.innerHTML).toContain('15 points');
    expect(container.innerHTML).toContain('€');
    
    const priceInput = document.getElementById('price-input');
    expect(priceInput).toBeTruthy();
  });
  
  test('sélection d\'une réponse pour une question standard', () => {
    displayQuestion();
    
    const answerCards = document.querySelectorAll('.answer-card');
    answerCards[0].click();
    
    expect(answerCards[0].classList.contains('selected')).toBe(true);
    
    const radio = document.querySelector('input[name="answer"]:checked');
    expect(radio).toBeTruthy();
    expect(radio.dataset.index).toBe('0');
  });
  
  test('sélection de plusieurs réponses pour une question à choix multiples', () => {
    currentQuestionIndex = 1;
    displayQuestion();
    
    const answerCards = document.querySelectorAll('.answer-card');
    answerCards[0].click();
    answerCards[1].click();
    
    expect(answerCards[0].classList.contains('selected')).toBe(true);
    expect(answerCards[1].classList.contains('selected')).toBe(true);
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    expect(checkboxes.length).toBe(2);
  });
  
  test('saisie d\'un prix pour une question de type prix', () => {
    currentQuestionIndex = 3;
    displayQuestion();
    
    const priceInput = document.getElementById('price-input');
    priceInput.value = '2.5';
    
    collectAnswer();
    
    expect(userAnswers[3]).toEqual([2.5]);
  });
  
  test('minuteur démarre correctement et s\'affiche', () => {
    jest.useFakeTimers();
    
    const originalUpdateProgressBar = updateProgressBar;
    updateProgressBar = jest.fn();
    
    displayQuestion();
    
    expect(document.getElementById('timer').textContent).toBe('Temps: 30s');
    expect(document.getElementById('progress-bar').style.width).toBe('100%');
    
    jest.advanceTimersByTime(3000);
    
    const timerText = document.getElementById('timer').textContent;
    expect(['Temps: 27s', 'Temps: 28s', 'Temps: 26s']).toContain(timerText);
    
    const progressBarWidth = document.getElementById('progress-bar').style.width;
    expect(parseFloat(progressBarWidth)).toBeGreaterThanOrEqual(83);
    expect(parseFloat(progressBarWidth)).toBeLessThanOrEqual(95);
    
    updateProgressBar = originalUpdateProgressBar;
    
    jest.useRealTimers();
  });
  
  test('passage à la question suivante', () => {
    displayQuestion();
    
    document.querySelectorAll('.answer-card')[0].click();
    
    nextQuestion();
    
    expect(currentQuestionIndex).toBe(1);
    
    expect(document.getElementById('quiz-container').innerHTML).toContain('Quels sont les pays qui font partie de l\'Union Européenne?');
  });
  
  test('calcul du score pour différents types de questions', () => {
    displayQuestion();
    document.querySelectorAll('.answer-card')[0].click();
    nextQuestion();
    
    document.querySelectorAll('.answer-card')[0].click();
    document.querySelectorAll('.answer-card')[1].click();
    document.querySelectorAll('.answer-card')[3].click();
    nextQuestion();
    
    document.getElementById('false').click();
    nextQuestion();
    
    document.getElementById('price-input').value = '2.5';
    collectAnswer();
    
    const score = calculateScore();
    
    expect(score).toBe(10 + 20 + 5 + 15);
  });
  
  test('affichage des résultats à la fin du quiz', () => {
    displayQuestion();
    document.querySelectorAll('.answer-card')[0].click();
    nextQuestion();
    
    document.querySelectorAll('.answer-card')[0].click();
    nextQuestion();
    
    document.getElementById('false').click();
    nextQuestion();
    
    document.getElementById('price-input').value = '2.5';
    nextQuestion();
    
    expect(document.getElementById('quiz-container').innerHTML).toContain('Quiz Terminé!');
    expect(document.getElementById('quiz-container').innerHTML).toContain('Votre score:');
    expect(document.getElementById('submit').style.display).toBe('none');
  });
  
  test('affichage d\'une alerte lorsque le temps est écoulé', () => {
    jest.useFakeTimers();
    displayQuestion();
    
    jest.advanceTimersByTime(31000);
    
    expect(document.getElementById('alert-modal').style.display).toBe('block');
    expect(document.getElementById('modal-message').textContent).toBe('Temps écoulé pour cette question !');
    
    expect(currentQuestionIndex).toBe(1);
    
    jest.useRealTimers();
  });
  
  test('fermeture de la modal d\'alerte', () => {
    showAlert('Test message');
    expect(document.getElementById('alert-modal').style.display).toBe('block');
    
    closeModal();
    expect(document.getElementById('alert-modal').style.display).toBe('none');
  });
  
  test('barre de progression mise à jour correctement', () => {
    const originalStartTimer = startTimer;
    const originalUpdateProgressBar = updateProgressBar;
    
    updateProgressBar = originalUpdateProgressBar;
    
    startTimer = jest.fn();
    
    document.getElementById('progress-bar').style.width = '0%';
    
    currentQuestionIndex = 0;
    updateProgressBar();
    expect(document.getElementById('progress-bar').style.width).toBe('25%');
    
    currentQuestionIndex = 1;
    updateProgressBar();
    expect(document.getElementById('progress-bar').style.width).toBe('50%');
    
    currentQuestionIndex = 2;
    updateProgressBar();
    expect(document.getElementById('progress-bar').style.width).toBe('75%');
    
    currentQuestionIndex = 3;
    updateProgressBar();
    expect(document.getElementById('progress-bar').style.width).toBe('100%');
    
    startTimer = originalStartTimer;
  });
});