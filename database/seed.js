const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Quiz = require('../models/quizz');
const Category = require('../models/category');

mongoose.connect('mongodb://localhost:27017/quizDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch((error) => console.log('Erreur de connexion à MongoDB', error));

const quizDataPath = path.join(__dirname, '../database/quizzData.json');
const quizData = JSON.parse(fs.readFileSync(quizDataPath, 'utf8'));

// Fonction pour obtenir ou créer une catégorie
const getCategoryByName = async (categoryName) => {
    let category = await Category.findOne({ name: categoryName });

    if (!category) {
        category = new Category({ name: categoryName });
        await category.save();
    }

    return category._id;
};

const importData = async () => {
    try {
        for (let quizItem of quizData) {
            const categoryId = await getCategoryByName(quizItem.category);

            const quiz = new Quiz({
                title: "Quiz Importé",
                description: "Quiz importé depuis un fichier JSON",
                category: categoryId,  // Utilise l'ID de la catégorie
                questions: [{
                    type: quizItem.type,
                    difficulty: quizItem.difficulty,
                    question: quizItem.question,
                    correct_answer: quizItem.correct_answer,
                    incorrect_answers: quizItem.incorrect_answers
                }]
            });

            await quiz.save();
        }

        console.log('Données importées avec succès !');
        process.exit();
    } catch (error) {
        console.log('Erreur lors de l\'importation des données', error);
        process.exit(1);
    }
};

importData();
