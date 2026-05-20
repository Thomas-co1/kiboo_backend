const sequelize = require('../core/orm.js');
const { DataTypes } = require('sequelize');

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Animals',
        key: 'id'
    }
  }
});

module.exports = Image;