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

// Функция для проверки подключения к БД
async function authenticateDB() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных установлено успешно.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
}

sequelize.sync(); //todo использовать команду синхронизации, вместо функции checkFieldSynchronization

// Функция для проверки синхронизации полей
async function checkFieldSynchronization(tableName, expectedFields) {
  try {
    const [results, metadata] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}';
    `);
    
    const actualFields = results.map(row => row.column_name);

    // Проверка синхронизации
    const isSynchronized = expectedFields.every(field => actualFields.includes(field)) &&
                           actualFields.every(field => expectedFields.includes(field));

    if (isSynchronized) {
      console.log('Поля синхронизированы.');
    } else {
      console.log('Поля не синхронизированы.');
      console.log('Ожидаемые поля:', expectedFields);
      console.log('Фактические поля:', actualFields);
    }
  } catch (error) {
    console.error('Ошибка при проверке синхронизации полей:', error);
  }
}

module.exports = {
  sequelize, // Экспортируем объект sequelize
  authenticateDB, // Экспортируем функцию проверки подключения (опционально, можно вызывать в db.js)
  checkFieldSynchronization, // Экспортируем функцию проверки синхронизации полей
};
