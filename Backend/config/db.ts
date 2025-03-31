// db.ts
import {Sequelize}  from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Извлекаем переменные окружения для подключения к БД
const dbName: string = process.env.DB_NAME as string;
const dbUser: string = process.env.DB_USER as string;
const dbPassword: string = process.env.DB_PASSWORD as string;
const dbHost: string = process.env.DB_HOST as string;
const dbPort: number = parseInt(process.env.DB_PORT as string, 10);

// Создаем объект Sequelize

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres', // Указываем, что используем PostgreSQL
});

sequelize.sync(); //todo использовать команду синхронизации, вместо функции checkFieldSynchronization

module.exports = {
  sequelize, // Экспортируем объект sequelize
};
