const { Sequelize } = require('sequelize');

const dbName = process.env.NODE_ENV === 'test'
  ? (process.env.DB_NAME + '_test')
  : process.env.DB_NAME;

const sequelize = new Sequelize(
    dbName,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

module.exports = sequelize;