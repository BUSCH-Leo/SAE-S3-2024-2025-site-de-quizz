const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');

const router = express.Router();

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); 
        cb(null, Date.now() + ext); 
    }
});

const upload = multer({ storage });

// Middleware d'authentification
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Non authentifié' });
};

// Route pour mettre à jour la photo de profil
router.post('/update-profile', isAuthenticated, upload.single('profilePhoto'), async (req, res) => {
    try {
        const profilePhotoPath = req.file ? `/uploads/${req.file.filename}` : req.body.profilePhoto;

   
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePhoto: profilePhotoPath },
            { new: true }
        );

        res.json({ message: 'Photo de profil mise à jour', profilePhoto: profilePhotoPath });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour de la photo de profil');
    }
});

module.exports = router; 
