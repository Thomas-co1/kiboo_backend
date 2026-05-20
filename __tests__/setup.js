// Configuration des tests
require('dotenv').config();

// Augmenter le timeout pour les tests de base de données
jest.setTimeout(30000);

// Configurer l'environnement de test
beforeAll(async () => {
  const mysql = require('mysql2/promise');
  
  // Créer la base de données de test si elle n'existe pas
  const testDbName = process.env.DB_NAME + '_test';
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${testDbName}\`;`);
    await connection.end();
  } catch (error) {
    console.error('Erreur création base de test:', error.message);
  }
});
