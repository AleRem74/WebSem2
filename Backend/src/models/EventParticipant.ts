import { Model, DataTypes, Optional } from 'sequelize';
import {sequelize} from '../../config/db';  
import User from './User';
import Event from './Event';

interface EventParticipantAttributes {
  id: number;
  eventId: number;
  userId: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface EventParticipantCreationAttributes extends Optional<EventParticipantAttributes, 'id'> {}

class EventParticipant extends Model<EventParticipantAttributes, EventParticipantCreationAttributes> implements EventParticipantAttributes {
  public id!: number;
  public eventId!: number;
  public userId!: number;

  // timestamps, если нужны
}

EventParticipant.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'EventParticipant',
  tableName: 'event_participants',
  timestamps: false,
});

// Связи
EventParticipant.belongsTo(Event, { foreignKey: 'eventId' });
EventParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Для обратной связи 
Event.hasMany(EventParticipant, { foreignKey: 'eventId', as: 'participants' });
User.hasMany(EventParticipant, { foreignKey: 'userId' });

export default EventParticipant;
