const MyQuiz = require('../models/project');
const { getUserProjects}= require('./projectController');

const renderCreerPage = async (req, res) => {
    try {
        const projects = await MyQuiz.find({ creator: req.user._id })
            .select('name createdAt lastModified')
            .sort({ lastModified: -1 });

        res.render('creer_page', { 
            user: req.user,
            projects: projects
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        res.render('creer_page', { 
            user: req.user,
            projects: []
        });
    }
};

const renderJouerPage = async (req, res) => {
    try {
        const user = req.user;
        const projects = user ? await getUserProjects(user._id) : [];
        res.render('jouer_page', { user: user, projects: projects });
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        res.status(500).send('Erreur lors de la récupération des projets');
    }
};

const renderQuizPage = async (req, res) => {
    try {
        const projectId = req.query.projectId;
        if (projectId) {

            const query = req.user ? { _id: projectId, creator: req.user._id } : { _id: projectId };
            
            const project = await MyQuiz.findOne(query);

            if (!project) {
                return res.status(404).send('Projet non trouvé');
            }

            res.render('play_project_quiz', { user: req.user, projectData: project });
        } else {
            res.render('play_quiz', { user: req.user, project: null });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du projet:', error);
        res.status(500).send('Erreur lors de la récupération du projet');
    }
};

const renderIndexPage = (req, res) => {
    res.render('index', { user: req.user });
};

const renderParametresPage = (req, res) => {
    res.render('parametres', { user: req.user });
};

const renderProfilePage = (req, res) => {
    res.render('profile', { user: req.user });
};

const renderConnexionPage = (req, res) => {
    res.render('connexion', { user: req.user });
};

const renderInscriptionPage = (req, res) => {
    res.render('inscription', { user: req.user });
};

const renderQuizCreationPage = (req, res) => {
    res.render('quiz_creation', { user: req.user });
};

module.exports = {
    renderCreerPage,
    renderJouerPage,
    renderQuizPage,
    renderIndexPage,
    renderParametresPage,
    renderProfilePage,
    renderConnexionPage,
    renderInscriptionPage,
    renderQuizCreationPage
};