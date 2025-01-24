const User = require('../models/user');

exports.updateProfilePhoto = async (req, res) => {
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
};

exports.updateUsername = async (req, res) => {
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
};

exports.updatePhoneNumber = async (req, res) => {
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
};

exports.changePassword = async (req, res) => {
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
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.json({ message: 'Votre compte a été supprimé.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression du compte.');
    }
};