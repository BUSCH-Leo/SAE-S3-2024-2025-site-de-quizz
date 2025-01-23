// controllers/projectController.js
const MyQuiz = require('../models/project');

const createProject = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Le nom du projet est requis'
            });
        }

        const existingProject = await MyQuiz.findOne({
            creator: req.user._id,
            name: name
        });

        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: 'Un projet avec ce nom existe déjà'
            });
        }

        const project = new MyQuiz({
            name: name,
            creator: req.user._id,
            theme: 'standart',
            font: 'Arial',
            questions: []
        });

        await project.save();

        res.status(201).json({
            success: true,
            project: {
                id: project._id,
                name: project.name
            }
        });

    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du projet'
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await MyQuiz.findOne({
            _id: req.params.id,
            creator: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projet non trouvé'
            });
        }

        res.json({
            success: true,
            project
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du projet:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du projet'
        });
    }
};
const getUserProjects = async (userId) => {
    try {
        const projects = await MyQuiz.find({ creator: userId });
        return projects;
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        throw error;
    }
};

module.exports = {
    createProject,
    getProjectById,
    getUserProjects
};