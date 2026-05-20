// Charger les variables d'environnement
require('dotenv').config();

// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Importer les modèles et la connexion
const { sequelize } = require('./models');

// Permet de lire le JSON dans les requêtes
app.use(express.json());

// Activer le CORS pour autoriser les requêtes externes (App Web & Mobile)
const cors = require('cors');
app.use(cors());

// Importer les routes
const userRoutes = require('./routes/User');
const animalRoutes = require('./routes/Animal');
const imageRoutes = require('./routes/Images');
const likeRoutes = require('./routes/Like');
const messageRoutes = require('./routes/Message');
const demandeRoutes = require('./routes/Demande_Adoption');
const partenaireRoutes = require('./routes/Partenaire');
const astuceRoutes = require('./routes/Astuce');
const tagRoutes = require('./routes/Tag');

// Utiliser les routes
app.use('/api/users', userRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/demandes', demandeRoutes);
app.use('/api/partenaires', partenaireRoutes);
app.use('/api/astuces', astuceRoutes);
app.use('/api/tags', tagRoutes);

// Route test
app.get('/', (req, res) => {
  res.send('Backend KIBOO fonctionne !');
});

// Synchroniser la base de données et démarrer le serveur
async function startServer() {
  try {
    // Créer une connexion sans spécifier la base de données pour vérifier si elle existe
    const { Sequelize } = require('sequelize');
    const mysql = require('mysql2/promise');
    
    // Connexion temporaire pour créer la base de données si nécessaire
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    // Créer la base de données si elle n'existe pas
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`✓ Base de données '${process.env.DB_NAME}' vérifiée/créée`);
    await connection.end();
    
    // Tester la connexion avec Sequelize
    await sequelize.authenticate();
    console.log('✓ Connexion à la base de données réussie');

    // Synchroniser les modèles (crée les tables si elles n'existent pas)
    // Pour nettoyer et recréer : { force: true } (⚠️ supprime les données)
    // Pour juste créer sans modifier : {}
    await sequelize.sync();
    console.log('✓ Base de données synchronisée');

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`✓ Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Erreur lors du démarrage:', error);
    process.exit(1);
  }
}

startServer();