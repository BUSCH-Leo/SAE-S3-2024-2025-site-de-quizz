const passport = require('passport');
const User = require('../models/user');

exports.register = async (req, res) => {
    const { userName, email, phoneNumber, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        user = new User({ userName, email, phoneNumber, password });
        await user.save();

        res.redirect('/inscription?success=true');
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }        
        
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/parametres');
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        res.redirect('/index.html');
    });
};