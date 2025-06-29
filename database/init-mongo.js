// Script d'initialisation pour MongoDB
db = db.getSiblingDB('quizzine');

// Créer un utilisateur pour l'application
db.createUser({
  user: 'quizzine',
  pwd: 'Azerty1234',
  roles: [
    {
      role: 'readWrite',
      db: 'quizzine'
    }
  ]
});

// Créer les collections de base
db.createCollection('users');
db.createCollection('quizzes');
db.createCollection('categories');
db.createCollection('projects');

print('Base de données Quizzine initialisée avec succès');