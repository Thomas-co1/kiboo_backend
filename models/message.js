const sequelize = require('../core/orm.js');
const { DataTypes } = require('sequelize');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: { 
        type: DataTypes.TEXT,
        allowNull: false
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
},
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {  
            model: 'Users',
            key: 'id'
        }
    }
});

module.exports = Message;