const { body, validationResult } = require('express-validator');

// Middleware pour vérifier les erreurs de validation
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Données invalides',
            errors: errors.array()
        });
    }
    next();
};

// Validation pour l'inscription
const validateRegistration = [
    body('userName')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Adresse email invalide'),
    
    body('phoneNumber')
        .optional()
        .isMobilePhone('fr-FR')
        .withMessage('Numéro de téléphone invalide'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
    
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Les mots de passe ne correspondent pas');
            }
            return true;
        }),
    
    handleValidationErrors
];

// Validation pour la connexion
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Adresse email invalide'),
    
    body('password')
        .notEmpty()
        .withMessage('Mot de passe requis'),
    
    handleValidationErrors
];

// Validation pour la création de projet
const validateProject = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Le nom du projet doit contenir entre 1 et 100 caractères')
        .escape(), 
    
    handleValidationErrors
];

// Validation pour les quiz
const validateQuiz = [
    body('questions')
        .isArray({ min: 1 })
        .withMessage('Le quiz doit contenir au moins une question'),
    
    body('questions.*.question')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('La question doit contenir entre 1 et 500 caractères')
        .escape(),
    
    body('questions.*.answers')
        .isArray({ min: 2, max: 4 })
        .withMessage('Chaque question doit avoir entre 2 et 4 réponses'),
    
    handleValidationErrors
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateProject,
    validateQuiz,
    handleValidationErrors
};