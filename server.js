const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Quiz = require('./models/quizz');

// Créer l'application Express
const app = express();

// Middleware pour traiter le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/quizDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB'))
.catch((error) => console.log('Erreur de connexion à MongoDB', error));

// Servir les fichiers statiques (HTML, CSS, JS) depuis le dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir index.html lorsqu'on accède à la racine "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Test.html'));
});

// Route pour récupérer un quiz par ID
// Route pour récupérer un quiz par ID avec un maximum de 10 questions
app.get('/api/quiz/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz non trouvé' });
        }

        // Limiter à 10 questions
        const limitedQuestions = quiz.questions.slice(0, 10);  // Utilise .slice pour limiter à 10 questions

        // Retourner le quiz avec les 10 premières questions
        res.json({
            ...quiz.toObject(),  // Convertir le quiz en objet JS
            questions: limitedQuestions  // Remplacer les questions par la version limitée
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Démarrer le serveur sur le port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});