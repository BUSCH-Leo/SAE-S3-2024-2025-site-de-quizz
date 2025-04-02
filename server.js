const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile'); 
const quizRoutes = require('./routes/quiz');
const projectRoutes = require('./routes/projectRoutes');
const mainRoutes = require('./routes/mainRoutes');
const apiRoutes = require('./routes/apiRoutes');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB Atlas'))
.catch((error) => console.error('Erreur de connexion à MongoDB:', error));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(session({
    secret: 'quizzine',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes); 
app.use('/quizzes', quizRoutes);
app.use('/projects', projectRoutes);
app.use('/', mainRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}, connectez-vous sur http://localhost:${PORT}`);
});