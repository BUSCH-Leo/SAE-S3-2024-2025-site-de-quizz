// middleware/auth.js
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // Vérifier si la requête attend une réponse JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({
            success: false,
            message: 'Non authentifié'
        });
    }
    // Sinon rediriger vers la page de connexion
    res.redirect('/connexion');
};

module.exports = isAuthenticated;