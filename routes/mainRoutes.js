const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const { renderCreerPage, renderJouerPage, renderQuizPage, renderIndexPage, renderParametresPage, renderProfilePage, renderConnexionPage, renderInscriptionPage, renderQuizCreationPage } = require('../controllers/mainController');

router.get('/creer_page', isAuthenticated, renderCreerPage);
router.get('/jouer_page', renderJouerPage);
router.get('/quiz', renderQuizPage);
router.get('/index', renderIndexPage);
router.get('/parametres', renderParametresPage);
router.get('/profile', renderProfilePage);
router.get('/connexion', renderConnexionPage);
router.get('/inscription', renderInscriptionPage);
router.get('/quiz_creation', isAuthenticated, renderQuizCreationPage);

module.exports = router;