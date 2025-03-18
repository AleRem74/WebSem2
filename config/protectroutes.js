const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Токен авторизации не предоставлен' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Токен авторизации не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Замените на ваш секретный ключ

    req.user = decoded; // Сохраняем данные пользователя из токена в req.user (по желанию)
    next(); // Передаем управление следующему middleware или контроллеру
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен авторизации' });
  }
};
  
module.exports = module.exports = {
  verifyToken,
};