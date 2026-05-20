const sequelize = require('../core/orm.js');
const { DataTypes } = require('sequelize');

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Users',
        key: 'id'
    }
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
module.exports = Like;