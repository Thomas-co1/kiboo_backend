const sequelize = require('../core/orm.js');
const { DataTypes } = require('sequelize');

const Astuce = sequelize.define('Astuce', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  titre1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  titre2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  titre3: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  contenu1: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contenu2: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contenu3: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Astuce;
