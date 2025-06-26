const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/auth');
const { renderCreerPage, renderJouerPage, renderQuizPage, renderIndexPage, renderParametresPage, renderProfilePage, renderConnexionPage, renderInscriptionPage, renderQuizCreationPage } = require('../controllers/mainController');

router.get('/creer_page', isAuthenticated, renderCreerPage);
router.get('/jouer_page', renderJouerPage);

router.post('/select-project', isAuthenticated, (req, res) => {
    const projectId = req.body.projectId;
    if (projectId) {
        req.session.currentProjectId = projectId;
        if (req.query.destination === 'editor') {
            res.redirect('/editor');
        } else {
            res.redirect('/quiz');
        }
    } else {
        res.status(400).send('ID de projet manquant');
    }
});

router.get('/quiz', renderQuizPage);
router.get('/index', renderIndexPage);
router.get('/parametres', renderParametresPage);
router.get('/profile', renderProfilePage);
router.get('/connexion', renderConnexionPage);
router.get('/inscription', renderInscriptionPage);
router.get('/quiz_creation', isAuthenticated, renderQuizCreationPage);
router.get('/editor', isAuthenticated, (req, res) => {
    if (!req.session.currentProjectId) {
        return res.redirect('/creer_page');
    }
    res.sendFile('editor.html', { root: './public' });
});

module.exports = router;