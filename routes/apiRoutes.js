const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const MyQuiz = require('../models/project');
const { getCategories, getQuizzesByCategory, getQuickQuizzes, getProjects } = require('../controllers/apiController');

router.get('/categories', getCategories);
router.get('/quiz/category/:categoryId', getQuizzesByCategory);
router.get('/quiz/quick', getQuickQuizzes);
router.get('/projects', isAuthenticated, getProjects);

router.get('/current-project', isAuthenticated, async (req, res) => {
    try {
        const projectId = req.session.currentProjectId;
        if (!projectId) {
            return res.status(400).json({ success: false, message: 'Aucun projet sélectionné' });
        }

        const project = await MyQuiz.findOne({ 
            _id: projectId, 
            creator: req.user._id 
        });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Projet non trouvé ou accès non autorisé' });
        }

        res.json({ success: true, project });
    } catch (error) {
        console.error('Erreur lors de la récupération du projet:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

router.put('/quizzes/:id', isAuthenticated, async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user._id;
        const updatedData = req.body;
        
        const project = await MyQuiz.findOne({ 
            _id: projectId, 
            creator: userId 
        });
        
        if (!project) {
            return res.status(404).json({ error: 'Projet non trouvé ou accès non autorisé' });
        }
        
        const result = await MyQuiz.findByIdAndUpdate(
            projectId,
            { 
                $set: {
                    questions: updatedData.questions || [],
                    theme: updatedData.theme || project.theme,
                    font: updatedData.font || project.font,
                    points: updatedData.points || project.points,
                    enableTimeBonus: updatedData.enableTimeBonus !== undefined ? updatedData.enableTimeBonus : project.enableTimeBonus,
                    lastUpdated: new Date()
                }
            },
            { new: true }
        );
        
        if (!result) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du projet' });
        }
        
        res.json({ success: true, project: result });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du quiz:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

module.exports = router;