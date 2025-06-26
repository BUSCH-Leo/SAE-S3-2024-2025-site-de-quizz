const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validator');

router.post('/register',authController.register);
router.post('/login', validateLogin, authController.loginLimiter, authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.resetLimiter, authController.forgotPassword);
router.get('/reset-password/:token', authController.showResetPasswordPage);
router.get('/verify-reset-token/:token', authController.verifyResetToken);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;