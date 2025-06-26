const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/auth/reset-password/${resetToken}`;
    
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Réinitialisation de votre mot de passe - Quizzine',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ffb700;">Réinitialisation de mot de passe</h2>
                <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                <p>Cliquez sur le lien suivant pour créer un nouveau mot de passe :</p>
                <a href="${resetUrl}" style="background-color: #ffb700; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Réinitialiser mon mot de passe
                </a>
                <p>Ce lien expirera dans 1 heure.</p>
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email de réinitialisation envoyé à:', email);
    } catch (error) {
        console.error('Erreur envoi email:', error);
        throw error;
    }
    
};


module.exports = { sendResetEmail };