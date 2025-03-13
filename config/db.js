// db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Извлекаем переменные окружения для подключения к БД
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

// Создаем объект Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres', // Указываем, что используем PostgreSQL
});



sequelize.sync(); //todo использовать команду синхронизации, вместо функции checkFieldSynchronization


module.exports = {
  sequelize, // Экспортируем объект sequelize
};
