const sequelize = require('../core/orm.js');
const { DataTypes } = require('sequelize');

const Partenaire = sequelize.define('Partenaire', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Partenaire;
