const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile'); 
const quizRoutes = require('./routes/quiz');
const projectRoutes = require('./routes/projectRoutes');
const mainRoutes = require('./routes/mainRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Config EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sessions & Passport
app.use(session({
    secret: 'quizzine',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes); 
app.use('/quizzes', quizRoutes);
app.use('/projects', projectRoutes);
app.use('/', mainRoutes);
app.use('/api', apiRoutes);

module.exports = app;
