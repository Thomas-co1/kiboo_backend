const sequelize = require('../core/orm.js');
const { DataTypes } = require('sequelize');

const DemandeAdoption = sequelize.define('DemandeAdoption', {
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
    },
    status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
    }
});

module.exports = DemandeAdoption;