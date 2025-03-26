import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

// Определяем интерфейс для создаваемого пользователя
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'NoName'; 
  createdat: Date; 
}

// Определяем интерфейс для создания пользователя
export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'role' | 'createdat'>

// Расширяем класс Model с типами
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'admin' | 'NoName';
  public createdat!: Date;

  // Здесь можно добавить методы или дополнительные свойства, если нужно
}

// Инициализация модели User
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'NoName'),
    defaultValue: 'user', // Роль по умолчанию
  },
  createdat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false,
});

export default User; // Экспорт модели
