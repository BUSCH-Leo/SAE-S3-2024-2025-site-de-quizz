const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Quiz = require('../models/quizz');

mongoose.connect('mongodb://localhost:27017/quizDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch((error) => console.log('Erreur de connexion à MongoDB', error));

const quizDataPath = path.join(__dirname, '../database/quizzData.json');
const quizData = JSON.parse(fs.readFileSync(quizDataPath, 'utf8'));

const importData = async () => {
    try {
       
        const quiz = new Quiz({
            title: "Quiz Importé",  
            description: "Quiz importé depuis un fichier JSON",
            questions: quizData  
        });

        await quiz.save();
        console.log('Données importées avec succès !');
        process.exit();
    } catch (error) {
        console.log('Erreur lors de l\'importation des données', error);
        process.exit(1);
    }
};


importData();
