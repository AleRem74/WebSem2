const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const dotenv = require('dotenv');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

dotenv.config();

// Секретный ключ для подписи и верификации JWT.
const JWT_SECRET = process.env.JWT_SECRET;

const logTokenMiddleware = (req, res, next) => {
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req); // Извлекаем токен здесь
  console.log('Сырой JWT токен из заголовка:', token); // Выводим токен в консоль
  next(); // Передаем управление следующему middleware (Passport)
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Получаем токен из заголовка Authorization как Bearer token
    secretOrKey: JWT_SECRET,                                 // Секретный ключ для верификации
  };
  
  const jwtStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // jwtPayload содержит декодированный payload из JWT
      const userId = jwtPayload.id; // ID пользователя хранится в поле 'id' payload
      console.log('Айди в JWT токене ' + jwtPayload.id);
  
      // Проверяем, существует ли пользователь с таким ID в базе данных
      const user = await User.findByPk(userId);
      console.log('Айди пользователя ' + userId);
  
      if (user) {
        // Пользователь найден, передаем его в обработчик запроса
        return done(null, user); // req.user = user
      } else {
        // Пользователь не найден
        return done(null, false); // Аутентификация не удалась
      }
    } catch (error) {
      return done(error, false); // Ошибка при поиске пользователя в БД
    }
  });

  passport.use(jwtStrategy);
  module.exports = passport;

