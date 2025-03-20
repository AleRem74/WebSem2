const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

async function findUserByEmail(email) {
    try {
      const users = await User.findAll({
        where: {
          email: email // Фильтруем пользователей, где email соответствует предоставленному
        }
      });
      // findAll всегда возвращает массив, даже если ожидается один результат.
      return users[0]; // Вернем первого пользователя или undefined, если никого не найдено
    } catch (error) {
      console.error("Ошибка при поиске пользователя по email:", error);
      return null; 
    }
  }



/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Аутентификация пользователя и получение JWT токена.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *                 example: Kot@example.com
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: Cat
 *     responses:
 *       200:
 *         description: Успешная аутентификация. Возвращает JWT токен.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен для аутентификации
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidXNlcm5hbWUiLCJpYXQiOjE2NzY1NDM2MDAsImV4cCI6MTY3NjU0NzIwMH0.exampleToken
 *       400:
 *         description: Неверный запрос. Не предоставлены email и пароль.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об ошибке
 *                   example: Необходимо предоставить email и пароль
 *       401:
 *         description: Неверные учетные данные. Пользователь не найден или пароль неверный.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об ошибке
 *                   example: Неверные учетные данные
 */
// Эндпоинт POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Необходимо предоставить email и пароль' });
  }

   user = findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Неверные учетные данные' }); // Пользователь не найден
  }

   user = await User.findOne({ where: { email } });
   if (!user) {
       throw new Error('Пользователь не найден'); 
   }

   if (!user.password) {
    throw new Error('Хеш пароля отсутствует');
    }

   const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Неверные учетные данные' }); // Пароль неверный
  }

  // Аутентификация успешна, генерируем JWT токен
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.name,
    role: user.role
    // Можно добавить другие данные пользователя, которые вы хотите включить в токен
  };
 
  const secretKey = process.env.JWT_SECRET; 

  const token = jwt.sign(payload, secretKey, {
    expiresIn: '1h' // Токен истекает через 1 час 
  });

  res.status(200).json({ token: token }); // Отправляем токен клиенту
});



module.exports = router;
