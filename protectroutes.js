const jwt = require('jsonwebtoken');
const Event = require('./src/models/Event');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('Токен в юзере' + authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: 'Токен авторизации не предоставлен' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Токен авторизации не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Замените на ваш секретный ключ

    req.user = decoded; // Сохраняем данные пользователя из токена в req.user 
    console.log(decoded.username)
    next(); // Передаем управление следующему middleware или контроллеру
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен авторизации' });
  }
};

const verifyEventOwnership = async (req, res, next) => {
  try {
    const userIdFromToken = req.user.userId; // Предполагаем, что user ID хранится в req.user.id после verifyToken
    const eventId = req.params.id; // ID события из параметров маршрута (например, /events/:id)
    console.log('Переданный айди ивента ' + eventId);

    // 1. Получаем событие из базы данных по eventId, включая поле createdBy
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    // 2. Сравниваем ID пользователя из токена (userIdFromToken) с createdBy события
    console.log('Айди из токена ' + userIdFromToken);
    console.log('Айди из данных события ' + event.createdby);
    if (event.createdby !== userIdFromToken) {
      return res.status(403).json({ message: 'Вы не являетесь автором этого события и не можете его редактировать' }); // 403 Forbidden - доступ запрещен
    }
    if (req.user.role == 'NoName') {
      return res.status(403).json({ message: 'Ты ноунейми и ты не можешь редактировать события' });
    }

    // 3. Если ID совпадают, пользователь - автор, пропускаем дальше
    next();

  } catch (error) {
    console.error("Ошибка проверки авторства события:", error);
    return res.status(500).json({ message: 'Ошибка сервера при проверке авторства события' });
  }
};


const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Токен авторизации не предоставлен' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен авторизации не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Используем JWT_SECRET!

    // Проверяем, есть ли роль и является ли она 'admin'
    if (decoded && decoded.role === 'admin') {
      req.user = decoded; // Можно сохранить данные пользователя в req.user
      
      next(); // Админ авторизован
    } else {
      return res.status(403).json({ message: 'Доступ к маршруту админа запрещен' }); // Нет роли админа или роль неверна
    }
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен авторизации' });
  }
};
  
module.exports = module.exports = {
  verifyToken,
  verifyAdminToken,
  verifyEventOwnership,
};