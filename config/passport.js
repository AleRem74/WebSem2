const passport = require('passport');  
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');  
const Event = require('../src/models/Event');  
const User = require('../src/models/User'); 

// Настройка стратегии Passport для работы с JWT  
const opts = {  
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  
  secretOrKey: process.env.JWT_SECRET, 
};  

// Настройка стратегии  
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {  
  try {   
    //  модель User:  
    const user = await User.findByPk(jwt_payload.userId);  
    if (user) {  
      return done(null, user);  
    } else {  
      return done(null, false); // Пользователь не найден  
    }  
  } catch (error) {  
    return done(error, false);  
  }  
}));  

// Middleware для верификации токена   
const verifyToken = passport.authenticate('jwt', { session: false });  

// Middleware для проверки ролей пользователей  
const verifyAdminToken = (req, res, next) => {  
  console.log('значение req.user ' + req.user);
  console.log('req.user.role равно ' + req.user.role);
  if (req.user && req.user.role === 'admin') {  
    return next(); // Админ авторизован  
  }  
  return res.status(403).json({ message: 'Доступ к маршруту админа запрещен' });  
};  

// Middleware для проверки авторства события  
const verifyEventOwnership = async (req, res, next) => {  
  try {  
    const userIdFromToken = req.user.userId;  
    const eventId = req.params.id;  

    const event = await Event.findByPk(eventId);  
    if (!event) {  
      return res.status(404).json({ message: 'Событие не найдено' });  
    }  

    if (event.createdby !== userIdFromToken) {  
      return res.status(403).json({ message: 'Вы не являетесь автором этого события и не можете его редактировать' });  
    }  

    if (req.user.role === 'NoName') {  
      return res.status(403).json({ message: 'Ты ноунейми и ты не можешь редактировать события' });  
    }  

    next(); // Если все проверки пройдены, продолжаем  
  } catch (error) {  
    return res.status(500).json({ message: 'Ошибка сервера при проверке авторства события' });  
  }  
};  

module.exports = {  
  verifyToken,  
  verifyAdminToken,  
  verifyEventOwnership,  
  passport,
};  