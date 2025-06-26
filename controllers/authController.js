const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const { sendResetEmail } = require('../config/mailer');


// Configuration correcte du limiteur
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: { message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, 
    skipFailedRequests: false,
    keyGenerator: (req) => {
        return `${req.ip}:${req.body.email || 'unknown'}`;
    },
    skip: (req) => {
        return false; 
    }
});

// Limiteur pour les demandes de réinitialisation
const resetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 3, 
    message: { message: 'Trop de demandes de réinitialisation. Réessayez dans 1 heure.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return `reset:${req.ip}:${req.body.email || 'unknown'}`;
    }
});

exports.register = async (req, res) => {
    const { userName, email, phoneNumber, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        let existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        existingUser = await User.findOne({ userName: userName.trim() });
        if (existingUser) {
            return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé' });
        }

        if (userName.length > 30 || email.length > 100) {
            return res.status(400).json({ message: 'Données trop longues' });
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({ 
            userName: userName.trim(), 
            email: email.toLowerCase().trim(), 
            phoneNumber: phoneNumber ? phoneNumber.trim() : null,
            password: hashedPassword 
        });

        await user.save();
        console.log(`Nouvel utilisateur enregistré: ${email} depuis ${req.ip} à ${new Date().toISOString()}`);

        res.status(201).json({ 
            message: 'Inscription réussie',
            redirect: '/inscription?success=true'
        });

    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err);

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};

// Fonction de connexion simplifiée sans tableau
exports.login = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    if (email.length > 100 || password.length > 128) {
        return res.status(400).json({ message: 'Données invalides' });
    }

    req.body.email = email.toLowerCase().trim();

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Erreur d\'authentification:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        
        if (!user) {
            console.log(`Tentative de connexion échouée pour ${req.body.email} depuis ${req.ip} à ${new Date().toISOString()}`);
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        if (user.isBlocked) {
            console.log(`Tentative de connexion sur compte bloqué: ${user.email} depuis ${req.ip}`);
            return res.status(403).json({ message: 'Compte temporairement bloqué' });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error('Erreur lors de la connexion:', err);
                return res.status(500).json({ message: 'Erreur lors de la connexion' });
            }

            user.lastLogin = new Date();
            user.save().catch(err => console.error('Erreur mise à jour lastLogin:', err));

            return res.status(200).json({ 
                message: 'Connexion réussie',
                redirect: '/parametres' 
            });
        });
    })(req, res, next);
};

// Demande de réinitialisation de mot de passe
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Adresse email requise' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        
        // Toujours renvoyer la même réponse pour éviter l'énumération d'emails
        const successResponse = { 
            message: 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé.' 
        };

        if (!user) {
            console.log(`Tentative de réinitialisation pour email inexistant: ${email} depuis ${req.ip}`);
            return res.status(200).json(successResponse);
        }

        // Générer un token de réinitialisation
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); 

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        await sendResetEmail(user.email, resetToken);

        console.log(`Email de réinitialisation envoyé à: ${user.email} depuis ${req.ip} à ${new Date().toISOString()}`);
        
        res.status(200).json(successResponse);
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation:', error);
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};

// Réinitialisation du mot de passe avec token
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return res.status(400).json({ message: 'Mot de passe et confirmation requis' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token invalide ou expiré' });
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        console.log(`Mot de passe réinitialisé pour: ${user.email} depuis ${req.ip} à ${new Date().toISOString()}`);

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};

// Vérification de la validité d'un token
exports.verifyResetToken = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ 
                valid: false, 
                message: 'Token invalide ou expiré' 
            });
        }

        res.status(200).json({ 
            valid: true, 
            message: 'Token valide' 
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        res.status(500).json({ 
            valid: false, 
            message: 'Erreur serveur' 
        });
    }
};
exports.showResetPasswordPage = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.render('reset-password-error', { 
                message: 'Ce lien de réinitialisation est invalide ou a expiré.' 
            });
        }

        res.render('reset-password', { token, user: null });
    } catch (error) {
        console.error('Erreur lors de l\'affichage de la page de réinitialisation:', error);
        res.render('reset-password-error', { 
            message: 'Une erreur est survenue. Veuillez réessayer.' 
        });
    }
};
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        res.redirect('/');
    });
};

exports.loginLimiter = loginLimiter;
exports.resetLimiter = resetLimiter;