// Helper pour les tests - crée une connexion Sequelize de test
const { Sequelize } = require('sequelize');
require('dotenv').config();

const testDbName = (process.env.DB_NAME || 'kiboo') + '_test';

const testSequelize = new Sequelize(
  testDbName,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

module.exports = testSequelize;
