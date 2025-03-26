import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config(); // Вызов функции для загрузки переменных окружения

const router = express.Router();

// Функция для поиска пользователя по email
async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await User.findAll({
      where: {
        email: email, // Фильтруем пользователей по email
      },
    });
    return users[0] || null; // Вернем первого пользователя или null, если никого не найдено
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
router.post('/login', (async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Необходимо предоставить email и пароль' });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Неверные учетные данные' }); // Пользователь не найден
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
    role: user.role,
  };
 
  const secretKey = process.env.JWT_SECRET; 

  const token = jwt.sign(payload, secretKey as string, {
    expiresIn: '1h', // Токен истекает через 1 час 
  });

  res.status(200).json({ token }); // Отправляем токен клиенту
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any);

export default router; // Экспортируем маршрутизатор
