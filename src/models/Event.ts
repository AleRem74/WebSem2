// Инициализация модели Event и его связи
import { DataTypes, Model } from 'sequelize';
import User from './User';
import { sequelize } from '../../config/db';

class Event extends Model {
  public id!: number; 
  public title!: string; 
  public description?: string; 
  public date!: Date; 
  public createdby!: number; 

  
}

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
    allowNull: true,
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

// Установка связей
Event.belongsTo(User, { foreignKey: 'createdby', as: 'creator' }); // Связь с таблицей User

export default Event; // Экспорт модели
