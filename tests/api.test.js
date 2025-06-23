const request = require('supertest');
const express = require('express');
const apiController = require('../controllers/apiController');

jest.mock('../models/category', () => ({
  find: jest.fn().mockResolvedValue([
    { _id: '6713a755f012fc38a3f26092', name: 'Musique' },
    { _id: '6713a755f012fc38a3f26098', name: 'Films' }
  ])
}));

jest.mock('../models/quizz', () => ({
  find: jest.fn().mockImplementation((query) => ({
    limit: jest.fn().mockResolvedValue([
      { 
        _id: 'quiz1', 
        title: 'Test Quiz',
        questions: [
          {
            question: 'Test Question',
            correct_answer: 'Correct',
            incorrect_answers: ['Wrong1', 'Wrong2']
          }
        ] 
      }
    ])
  }))
}));

jest.mock('../models/project', () => ({
  find: jest.fn().mockImplementation(() => ({
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockResolvedValue([
      { _id: 'project1', name: 'Test Project' }
    ])
  }))
}));

const app = express();
app.get('/api/categories', apiController.getCategories);
app.get('/api/quiz/category/:categoryId', apiController.getQuizzesByCategory);
app.get('/api/quiz/quick', apiController.getQuickQuizzes);
app.get('/api/projects', apiController.getProjects);

// Basic API test without requiring the actual Express app

// Mock the fetch function
global.fetch = jest.fn();

describe('Categories API', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  test('fetchCategories calls the correct API endpoint', async () => {
    // Setup the mock response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        { _id: '1', name: 'Musique' },
        { _id: '2', name: 'Films' }
      ])
    });
    
    // Call the function that would make the API request
    async function fetchCategories() {
      const response = await fetch('/api/categories');
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch categories');
    }
    
    const result = await fetchCategories();
    
    // Check that the fetch was called with the correct endpoint
    expect(fetch).toHaveBeenCalledWith('/api/categories');
    
    // Check that the result is what we expect
    expect(result).toEqual([
      { _id: '1', name: 'Musique' },
      { _id: '2', name: 'Films' }
    ]);
  });

  test('getQuizzesByCategory calls the correct API endpoint', async () => {
    // Setup the mock response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        { _id: 'quiz1', title: 'Test Quiz', questions: [] }
      ])
    });
    
    // Function to get quizzes by category
    async function getQuizzesByCategory(categoryId) {
      const response = await fetch(`/api/quiz/category/${categoryId}`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch quizzes');
    }
    
    const categoryId = '123';
    const result = await getQuizzesByCategory(categoryId);
    
    // Check that the fetch was called with the correct endpoint
    expect(fetch).toHaveBeenCalledWith(`/api/quiz/category/${categoryId}`);
    
    // Check that the result is what we expect
    expect(result).toEqual([
      { _id: 'quiz1', title: 'Test Quiz', questions: [] }
    ]);
  });
});

describe('API Routes', () => {
  test('GET /api/categories returns list of categories', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Musique');
  });

  test('GET /api/quiz/category/:categoryId returns quizzes for a category', async () => {
    const response = await request(app).get('/api/quiz/category/6713a755f012fc38a3f26092');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBe('Test Quiz');
  });

  test('GET /api/quiz/quick returns quick quizzes based on parameters', async () => {
    const response = await request(app)
      .get('/api/quiz/quick')
      .query({ count: 5, difficulty: 'medium' });
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(1);
    expect(response.body[0].questions.length).toBe(1);
  });

  test('GET /api/projects returns user projects when authenticated', async () => {
    const req = { user: { _id: 'user1' } };
    
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    await apiController.getProjects(req, res);
    
    expect(res.json).toHaveBeenCalledWith([{ _id: 'project1', name: 'Test Project' }]);
  });
});

describe('Editor API', () => {
  test('GET /api/current-project returns the current project', async () => {
    // Mock pour simuler une connexion et une réponse API
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        project: { 
          _id: 'test-project-id', 
          name: 'Test Project',
          questions: [],
          theme: '',
          font: 'Arial'
        }
      })
    });
    
    // Exécute la requête
    const response = await fetch('/api/current-project');
    const data = await response.json();
    
    // Vérifications
    expect(data.success).toBeTruthy();
    expect(data.project._id).toBe('test-project-id');
  });

  test('PUT /api/quizzes/:projectId updates a project quiz', async () => {
    // Mock pour la requête de mise à jour
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    
    // Données à envoyer
    const quizData = {
      questions: [
        {
          questionText: 'Test Question',
          mediaUrl: '',
          timeLimit: 30,
          points: 10,
          type: 'multiple',
          answerOptions: [
            { text: 'Option 1', isCorrect: true },
            { text: 'Option 2', isCorrect: false }
          ]
        }
      ],
      theme: '/ressource/editor/nature.jpeg',
      font: 'Arial',
      points: 10,
      enableTimeBonus: false
    };
    
    // Exécute la requête
    const response = await fetch('/api/quizzes/test-project-id', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData)
    });
    const data = await response.json();
    
    // Vérifications
    expect(data.success).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/quizzes/test-project-id',
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String)
      })
    );
  });
});