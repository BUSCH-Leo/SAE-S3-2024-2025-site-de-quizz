const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Category = require('./models/category');
const Quiz = require('./models/quizz'); // Assurez-vous que le chemin est correct

const app = express();

mongoose.connect('mongodb://localhost:27017/quizDB')
    .then(() => console.log('Connecté à MongoDB'))
    .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir index.html lorsqu'on accède à la racine "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Assurez-vous que 'index.html' est dans le dossier 'public'
});

// Route pour servir la page de quiz
app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test.html')); // Assurez-vous que 'test.html' est dans le dossier 'public'
});

// Route pour récupérer toutes les catégories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
    }
});

// Route pour récupérer des quiz par ID de catégorie
app.get('/api/quiz/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;

    try {
        // Récupérer jusqu'à 10 quiz pour la catégorie donnée
        const quizzes = await Quiz.find({ category: categoryId }).limit(10); // Limite à 10 quiz

        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: 'Aucun quiz disponible pour cette catégorie' });
        }

        res.json(quizzes); // Retourner les quiz trouvés
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("Serveur démarré sur le port ${PORT}");
});