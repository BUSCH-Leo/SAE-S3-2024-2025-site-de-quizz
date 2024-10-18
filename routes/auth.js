const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); 

const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
    const { userName, email, address, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Créer un nouvel utilisateur
        user = new User({ userName, email, address, password });
        await user.save();
        res.status(201).redirect('/parametres');
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
});

// Route de connexion
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/parametres');
        });
    })(req, res, next);
});

// Route de déconnexion
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        res.json({ message: 'Déconnexion réussie' });
    });
});

module.exports = router;
