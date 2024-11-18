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

// Route pour changer le nom d'utilisateur
router.post('/update-username', isAuthenticated, async (req, res) => {
    const { userName } = req.body;

    try {
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { userName },
            { new: true }
        );

        res.json({ message: 'Nom d\'utilisateur mis à jour', userName: user.userName });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour du nom d\'utilisateur');
    }
});

// Route pour changer le numéro de téléphone
router.post('/update-phone', isAuthenticated, async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { phoneNumber },
            { new: true }
        );

        res.json({ message: 'Numéro de téléphone mis à jour', phoneNumber: user.phoneNumber });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour du numéro de téléphone');
    }
});

// Route pour changer le mot de passe
router.post('/change-password', isAuthenticated, async (req, res) => {
    const { password, newPassword, newPasswordConfirm } = req.body;

    if (newPassword !== newPasswordConfirm) {
        return res.status(400).json({ message: 'Les nouveaux mots de passe ne correspondent pas.' });
    }

    try {
        const user = await User.findById(req.user._id);
        const isMatch = await user.matchPassword(password);  
        if (!isMatch) {
            return res.status(400).json({ message: 'Le mot de passe actuel est incorrect.' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Mot de passe modifié avec succès.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du changement de mot de passe.');
    }
});

// Route pour supprimer le compte
router.post('/delete-account', isAuthenticated, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.json({ message: 'Votre compte a été supprimé.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression du compte.');
    }
});


module.exports = router;
