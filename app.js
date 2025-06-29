const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile'); 
const quizRoutes = require('./routes/quiz');
const projectRoutes = require('./routes/projectRoutes');
const mainRoutes = require('./routes/mainRoutes');
const apiRoutes = require('./routes/apiRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const csrf = require('csurf');

const app = express();

// Config EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

// Securité avec Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            scriptSrcAttr: ["'unsafe-inline'"], 
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"], 
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));
// Rate Limiter
const staticLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    skip: (req) => !req.url.includes('.'), 
    message: 'Trop de requêtes de fichiers statiques.'
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: 'Trop de requêtes depuis cette IP, réessayez dans 15 minutes.'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'Trop de tentatives de connexion, réessayez dans 15 minutes.',
    skipSuccessfulRequests: true
});

// Middlewares
app.use(errorHandler);
app.use(staticLimiter);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sessions & Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'quizzine',
    resave: false,
    saveUninitialized: false, 
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true, 
        maxAge: 1000 * 60 * 60 * 24 
    },
    name: 'sessionId' 
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
// app.use(csrf()); Desactiver temporairement fleme de mettre csrf sur tout mes formulaires
// CSRF Token Middleware
/*
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
*/
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Quizzine API'
    });
});
// Routes
app.use('/auth', authLimiter, authRoutes);
app.use('/profile',generalLimiter, profileRoutes); 
app.use('/quizzes',generalLimiter, quizRoutes);
app.use('/projects',generalLimiter ,projectRoutes);
app.use('/', mainRoutes);
app.use('/api',generalLimiter, apiRoutes);

module.exports = app;
