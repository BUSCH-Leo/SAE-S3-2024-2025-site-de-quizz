// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const { createProject, getProjectById } = require('../controllers/projectController');

router.post('/create', isAuthenticated, createProject);
router.get('/:id', isAuthenticated, getProjectById);

module.exports = router;