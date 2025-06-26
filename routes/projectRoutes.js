// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/auth');
const { createProject, getProjectById, deleteProject } = require('../controllers/projectController');

router.post('/create', isAuthenticated, createProject);
router.get('/:id', isAuthenticated, getProjectById);
router.delete('/:id', isAuthenticated,deleteProject); 

module.exports = router;