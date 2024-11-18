const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('./models/user');

// Importation des routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile'); // Importation de la route pour la photo de profil
const Category = require('./models/category');
const Quiz = require('./models/quizz');

const app = express();

mongoose.connect('mongodb+srv://mamadoulcisse9236:2wOI5WMcV1cP19fC@quizzine.3q907.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connecté à MongoDB Atlas'))
    .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour les sessions
app.use(session({
    secret: 'quizzine', // Secret pour l'environnement de production
    resave: false,
    saveUninitialized: true
}));

// Initialisation de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configuration de la stratégie locale pour Passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Utilisateur non trouvé' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Mot de passe incorrect' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Middleware pour le parsing des requêtes POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/ressource', express.static(path.join(__dirname, 'ressource')));
app.use('/script', express.static(path.join(__dirname, 'script')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Utilisation des routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour servir la page de quiz
app.get('/quiz', (req, res) => {
    res.render('Test', { user: req.user });
});

// Route pour parametre
app.get('/parametres', (req, res) => {
    res.render('parametres', { user: req.user });
});
// Route pour jouer_page
app.get('/jouer_page', (req, res) => {
    res.render('jouer_page', { user: req.user }); 
});
// Route pour créer_page
app.get('/creer_page', (req, res) => {
    res.render('creer_page', { user: req.user }); 
});
// Route pour connexion
app.get('/connexion', (req, res) => {
    res.render('connexion', { user: req.user }); 
});
// Route pour inscription
app.get('/inscription', (req, res) => {
    res.render('inscription', { user: req.user }); 
});
// Route vers les pages de creation de quiz
app.get('/quiz_creation', (req, res) => {
    res.render('quiz_creation', { user: req.user });
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
        const quizzes = await Quiz.find({ category: categoryId }).limit(10);

        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: 'Aucun quiz disponible pour cette catégorie' });
        }

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour le quiz rapide avec paramètres personnalisés
app.get('/api/quiz/quick', async (req, res) => {
    const { count, difficulty } = req.query;

    try {
        const quizzes = await Quiz.find({ 'questions.difficulty': difficulty })
            .limit(parseInt(count, 10));

        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: 'Aucun quiz disponible pour cette sélection' });
        }

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des quizzes' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}, connectez-vous sur http://localhost:${PORT}`);
});
