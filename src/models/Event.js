//todo Инициализация модели Event и его связи
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('./User');

class Event extends Model {}
Event.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdby: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: false,
});

Event.belongsTo(User, { foreignKey: 'createdby', as: 'creator' });

module.exports =  Event 