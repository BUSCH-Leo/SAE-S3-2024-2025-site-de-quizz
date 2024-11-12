const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); 
        cb(null, Date.now() + ext); 
    }
});

const upload = multer({ storage: storage });

// Route pour mettre à jour la photo de profil
router.post('/update-profile-photo', upload.single('profilePhoto'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Aucune image téléchargée');
        }

        const profilePhotoPath = `/uploads/${req.file.filename}`; 

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
