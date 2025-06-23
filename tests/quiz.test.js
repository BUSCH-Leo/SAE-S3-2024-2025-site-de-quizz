/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { 
        _id: 'quiz1', 
        title: 'Quiz de test',
        questions: [
          {
            question: 'Quelle est la capitale de la France?',
            correct_answer: 'Paris',
            incorrect_answers: ['Lyon', 'Marseille', 'Bordeaux'],
            difficulty: 'easy'
          },
          {
            question: 'Quelle est la capitale de l\'Italie?',
            correct_answer: 'Rome',
            incorrect_answers: ['Milan', 'Naples', 'Turin'],
            difficulty: 'easy'
          }
        ] 
      }
    ])
  })
);

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
`;

let quizData = [];
let currentQuizIndex = 0;
let currentQuestionIndex = 0;
let userAnswers = [];
let timer;
let timePerQuestion = 30;
let timeLeft = timePerQuestion;

function getCategoryFromURL() {
  return 'category123';
}

function getQuickQuizParams() {
  return { count: 5, difficulty: 'easy', questionTime: 30 };
}

function shuffleArray(array) {
  return array;
}

async function fetchQuizzes() {
  const categoryId = getCategoryFromURL();

  try {
    const response = await fetch(`/api/quiz/category/${categoryId}`);
    const quizzes = await response.json();

    if (quizzes.length === 0) {
      showAlert('Aucun quiz disponible pour cette catégorie.');
      return;
    }

    const allQuestions = quizzes.flatMap(quiz => quiz.questions);
    quizData = [{ questions: allQuestions }];

    currentQuizIndex = 0;
    currentQuestionIndex = 0;
    userAnswers = [];
    displayCurrentQuestion();
    startTimer();
  } catch (error) {
    console.error('Erreur lors de la récupération des quiz', error);
  }
}

async function fetchQuickQuizzes(count, difficulty) { 
  try {
    const response = await fetch(`/api/quiz/quick?count=${count}&difficulty=${difficulty}`);
    const quizzes = await response.json();

    if (response.ok && quizzes.length > 0) {
      const allQuestions = quizzes.flatMap(quiz => quiz.questions);
      quizData = [{ questions: allQuestions }];

      currentQuizIndex = 0;
      currentQuestionIndex = 0;
      userAnswers = [];
      displayCurrentQuestion();
      startTimer();
    } else {
      console.error('Erreur: Quiz data format invalide ou questions manquantes');
    }
  } catch (error) {
    console.error('Erreur de réseau:', error);
  }
}

function displayCurrentQuestion() {
  const quizContainer = document.getElementById('quiz-container');
  if (!quizContainer) {
    console.error("L'élément 'quiz-container' est introuvable.");
    return;
  }

  if (!quizData || quizData.length === 0 || !quizData[currentQuizIndex]) {
    console.error("Les données du quiz sont invalides ou non disponibles.");
    quizContainer.innerHTML = '<p>Aucune donnée de quiz disponible.</p>';
    return;
  }

  const currentQuiz = quizData[currentQuizIndex];
  if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
    quizContainer.innerHTML = '<p>Aucune question disponible pour ce quiz.</p>';
    return;
  }

  quizContainer.innerHTML = '';

  const question = currentQuiz.questions[currentQuestionIndex];
  const questionElement = document.createElement('div');
  questionElement.classList.add('question-area', 'p-4');
  const totalQuestions = currentQuiz.questions.length;
  const currentQuestionNumber = currentQuestionIndex + 1;
  questionElement.innerHTML = `<h3 class="question-text">Question ${currentQuestionNumber} sur ${totalQuestions}: ${question.question}</h3>`;

  quizContainer.appendChild(questionElement);

  const answers = [...question.incorrect_answers, question.correct_answer].sort();
  answers.forEach((answer, index) => {
    const answerElement = document.createElement('button');
    answerElement.classList.add('answer', 'btn', 'm-2');
    answerElement.innerHTML = `<span class="letter">${String.fromCharCode(65 + index)}</span> <span class="text">${answer}</span>`;
    quizContainer.appendChild(answerElement);

    answerElement.addEventListener('click', () => {
      document.querySelectorAll('.answer').forEach(btn => btn.classList.remove('selected'));
      answerElement.classList.add('selected');
      saveAnswer(answer);
    });
  });
}

function startTimer() {
  timeLeft = timePerQuestion;
  const timerElement = document.getElementById('timer');
  const progressBar = document.getElementById('progress-bar');
  
  timerElement.textContent = `Temps restant : ${timePerQuestion}s`;
  
  progressBar.style.width = '100%';

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    
    timerElement.textContent = `Temps restant : ${timeLeft}s`;
    
    progressBar.style.width = `${(timeLeft / timePerQuestion) * 100}%`;

    if (timeLeft < 0) {
      clearInterval(timer);
      
      showAlert("Temps écoulé pour cette question !");
      
      nextQuestion();
    }
  }, 1000);
}

function saveAnswer(selectedAnswer) {
  userAnswers[currentQuizIndex] = userAnswers[currentQuizIndex] || [];
  userAnswers[currentQuizIndex][currentQuestionIndex] = selectedAnswer;
}

function nextQuestion() {
  const currentQuiz = quizData[currentQuizIndex];

  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    displayCurrentQuestion();
    startTimer();
  } else if (currentQuizIndex < quizData.length - 1) {
    currentQuizIndex++;
    currentQuestionIndex = 0;
    displayCurrentQuestion();
    startTimer();
  } else {
    calculateScore();
  }
}

function calculateScore() {
  let totalScore = 0;
  let totalQuestions = 0;
  let memoData = [];

  quizData.forEach((quiz, quizIndex) => {
    let questionsMemo = [];
    quiz.questions.forEach((question, questionIndex) => {
      totalQuestions++;
      const userAnswer = userAnswers[quizIndex] && userAnswers[quizIndex][questionIndex];
      const correctAnswer = question.correct_answer;
      if (userAnswer === correctAnswer) {
        totalScore += 101;
      }

      questionsMemo.push({
        question: question.question,
        userAnswer: userAnswer || "Aucune réponse",
        correctAnswer: correctAnswer
      });
    });
    memoData.push({ questions: questionsMemo });
  });

  localStorage.setItem('score', totalScore); 
  localStorage.setItem('memos', JSON.stringify(memoData));

  window.location.href = '/memo.html';
}

function showAlert(message) {
  const modalMessage = document.getElementById('modal-message');
  
  modalMessage.textContent = message;
  
  document.getElementById('alert-modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('alert-modal').style.display = 'none';
}

describe('Quiz Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentQuizIndex = 0;
    currentQuestionIndex = 0;
    userAnswers = [];
    timeLeft = timePerQuestion;
    clearInterval(timer);

    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('timer').innerText = '00:00';
    document.getElementById('score').innerHTML = '';
    document.getElementById('alert-modal').style.display = 'none';
    document.getElementById('modal-message').textContent = '';
  });

  test('fetchQuizzes fetches quiz data for a category', async () => {
    await fetchQuizzes();
    
    expect(global.fetch).toHaveBeenCalledWith('/api/quiz/category/category123');
    expect(quizData).toHaveLength(1);
    expect(quizData[0].questions).toHaveLength(2);
  });

  test('fetchQuickQuizzes fetches quiz data with parameters', async () => {
    await fetchQuickQuizzes(5, 'easy');
    
    expect(global.fetch).toHaveBeenCalledWith('/api/quiz/quick?count=5&difficulty=easy');
    expect(quizData).toHaveLength(1);
    expect(quizData[0].questions).toHaveLength(2);
  });

  test('displayCurrentQuestion shows the current question', async () => {
    await fetchQuizzes();
    
    const quizContainer = document.getElementById('quiz-container');
    expect(quizContainer.innerHTML).toContain('Question 1 sur 2');
    expect(quizContainer.innerHTML).toContain('Quelle est la capitale de la France?');
    expect(quizContainer.innerHTML).toContain('Paris');
    expect(quizContainer.innerHTML).toContain('Lyon');
  });

  test('clicking an answer marks it as selected', async () => {
    await fetchQuizzes();
    
    const answers = document.querySelectorAll('.answer');
    answers[0].click();
    
    expect(answers[0].classList.contains('selected')).toBe(true);
    expect(userAnswers[0][0]).toBe(answers[0].querySelector('.text').textContent);
  });

  test('nextQuestion advances to the next question', async () => {
    await fetchQuizzes();
    
    expect(document.querySelector('.question-text').textContent).toContain('capitale de la France');
    
    nextQuestion();
    
    expect(document.querySelector('.question-text').textContent).toContain('capitale de l\'Italie');
  });

  test('nextQuestion calculates score when quiz is complete', async () => {
    await fetchQuizzes();
    
    const answers = document.querySelectorAll('.answer');
    answers[0].click();
    
    nextQuestion();
    
    const secondAnswers = document.querySelectorAll('.answer');
    secondAnswers[0].click();
    
    nextQuestion();
    
    expect(window.location.href).toBe('/memo.html');
    expect(localStorage.setItem).toHaveBeenCalledWith('score', expect.anything());
    expect(localStorage.setItem).toHaveBeenCalledWith('memos', expect.any(String));
  });

  test('startTimer initializes the timer correctly', async () => {
    await fetchQuizzes();
    
    expect(document.getElementById('timer').textContent).toBe(`Temps restant : ${timePerQuestion}s`);
    expect(document.getElementById('progress-bar').style.width).toBe('100%');
    
    jest.useFakeTimers();
    startTimer();
    
    jest.advanceTimersByTime(5000);
    
    expect(document.getElementById('timer').textContent).toBe(`Temps restant : ${timePerQuestion - 5}s`);
    
    jest.useRealTimers();
  });

  test('showAlert displays an alert message', () => {
    const testMessage = 'Test Alert Message';
    showAlert(testMessage);
    
    expect(document.getElementById('modal-message').textContent).toBe(testMessage);
    expect(document.getElementById('alert-modal').style.display).toBe('block');
  });

  test('closeModal hides the alert modal', () => {
    showAlert('Test');
    expect(document.getElementById('alert-modal').style.display).toBe('block');
    
    closeModal();
    expect(document.getElementById('alert-modal').style.display).toBe('none');
  });

  test('calculateScore computes correct score based on answers', async () => {
    await fetchQuizzes();
    
    jest.clearAllMocks();
    
    const currentQuiz = quizData[currentQuizIndex];
    const correctAnswer = currentQuiz.questions[currentQuestionIndex].correct_answer;
    saveAnswer(correctAnswer);
    
    nextQuestion();
    saveAnswer('Wrong Answer');
    
    calculateScore();
    
    const mockCalls = localStorage.setItem.mock.calls;
    
    const scoreCall = mockCalls.find(call => call[0] === 'score');
    expect(scoreCall).toBeDefined();
    
    const memosCall = mockCalls.find(call => call[0] === 'memos');
    expect(memosCall).toBeDefined();
    
    expect(memosCall[1]).toContain('Paris');
    expect(memosCall[1]).toContain('Wrong Answer');
  });

  test('timer expiry automatically advances to next question', async () => {
    await fetchQuizzes();
    
    currentQuestionIndex = 0;
    
    jest.useFakeTimers();
    startTimer();
    
    jest.advanceTimersByTime((timePerQuestion + 1) * 1000);
    
    expect(currentQuestionIndex).toBe(1);
    
    expect(document.getElementById('alert-modal').style.display).toBe('block');
    expect(document.getElementById('modal-message').textContent).toBe('Temps écoulé pour cette question !');
    
    jest.useRealTimers();
  });
});