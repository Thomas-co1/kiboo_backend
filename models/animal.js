const sequelize = require('../core/orm.js');
const { DataTypes } = require('sequelize');

const Animal = sequelize.define('Animal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    espece: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.STRING,
        allowNull: true
    },
    taille: {
        type: DataTypes.STRING,
        allowNull: true
    },
    race: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sexe: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    image_id: {
        type: DataTypes.INTEGER,
        allowNull: true,    
        references: {
            model: 'Images',
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    comptabilitychild: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    comptabilitycat: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    comptabilitydog: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }, 
    sterilized: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    lifeplace: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Animal;