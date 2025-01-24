const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const { getCategories, getQuizzesByCategory, getQuickQuizzes, getProjects } = require('../controllers/apiController');

router.get('/categories', getCategories);
router.get('/quiz/category/:categoryId', getQuizzesByCategory);
router.get('/quiz/quick', getQuickQuizzes);
router.get('/projects', isAuthenticated, getProjects);

module.exports = router;