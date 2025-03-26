import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import Event from '../src/models/Event';
import User from '../src/models/User';
import  UserAttributes from '../src/models/User';

import { Request, Response, NextFunction } from 'express';


// Определяем интерфейс для Request, включая свойства пользователя
interface RequestWithUser extends Request {
  user?: UserAttributes; // Опциональное свойство user
}

// Настройка стратегии Passport для работы с JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || '',
};

// Настройка стратегии
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    // Модель User
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
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.authenticate('jwt', { session: false }, (err: any, user: User, info: any) => { //Добавляем callback функцию
    console.log('Аутентификация user= ' + user.role);
    console.log('URL данные' + req.url);
    console.log('method данные ' + req.method);
    console.log('Данные авторизации ' + req.headers.authorization)
    if (err) {
      return next(err); // Обработка ошибки Passport
    }
    if (!user) {
      // Пользователь не найден или токен невалиден
      return res.status(401).json({ message: 'Не авторизован', info: info }); 
    }

    // Аутентификация прошла успешно, устанавливаем пользователя в req.user
    req.user = user; 
    return next(); // Переходим к следующему middleware или обработчику маршрута
  })(req, res, next); //Вызываем middleware функцию, возвращенную passport.authenticate
};

// Middleware для проверки ролей пользователей
const verifyAdminToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
  console.log('значение req.user: ', req.user);
  console.log('req.user.role равно: ', req.user?.role);
  
  if (req.user && req.user.role === 'admin') {
    return next(); // Админ авторизован
  }
  return res.status(403).json({ message: 'Доступ к маршруту админа запрещен' });
};

// Middleware для проверки авторства события
const verifyEventOwnership = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userIdFromToken = req.user?.id;
    const eventId = req.params.id;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    if (event.createdby !== userIdFromToken) {
      return res.status(403).json({ message: 'Вы не являетесь автором этого события и не можете его редактировать' });
    }

    if (req.user?.role === 'NoName') {
      return res.status(403).json({ message: 'Ты ноунейми и ты не можешь редактировать события' });
    }

    next(); // Если все проверки пройдены, продолжаем
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка сервера при проверке авторства события' });
  }
};

export { verifyToken, verifyAdminToken, verifyEventOwnership, passport, RequestWithUser };
