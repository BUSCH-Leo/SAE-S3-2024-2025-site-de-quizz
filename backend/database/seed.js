const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Quiz = require('../models/quizz');
const Category = require('../models/category');

mongoose.connect('mongodb+srv://mamadoulcisse9236:2wOI5WMcV1cP19fC@quizzine.3q907.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connecté à MongoDB Atlas'))
    .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

const quizDataPath = path.join(__dirname, '../database/quizzData.json');
const quizData = JSON.parse(fs.readFileSync(quizDataPath, 'utf8'));

// Fonction pour obtenir et créer une catégorie
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
                category: categoryId,  
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
