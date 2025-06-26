// middleware/auth.js
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    console.log(`Tentative d'accès non autorisée à ${req.originalUrl} depuis ${req.ip} à ${new Date().toISOString()}`);
    // Vérifier si la requête attend une réponse JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({
            success: false,
            message: 'Authentification requise'
        });
    }
    // Sinon rediriger vers la page de connexion
    res.redirect('/connexion');
};

const checkResourceOwnership = (model) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params.id;
            const resource = await model.findById(resourceId);
            
            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Ressource non trouvée'
                });
            }
            
            if (resource.creator.toString() !== req.user._id.toString()) {
                console.log(`Tentative d'accès non autorisé à la ressource ${resourceId} par ${req.user.email}`);
                return res.status(403).json({
                    success: false,
                    message: 'Accès non autorisé à cette ressource'
                });
            }
            
            req.resource = resource;
            next();
        } catch (error) {
            console.error('Erreur lors de la vérification de propriété:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur'
            });
        }
    };
};

module.exports = {
    isAuthenticated,
    checkResourceOwnership
};