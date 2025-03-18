//todo импорт роутера
const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController.js');
const passport = require('passport');

  /**
 * @swagger
 * /users:
 *   post:
 *     summary: Создание нового пользователя
 *     description: Создает нового пользователя с указанными именем и email.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя.
 *                 example: "Kot"
 *               email:
 *                 type: string
 *                 description: Email пользователя.
 *                 example: "Kot@example.com"
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: "Cat"
 *     responses:
 *       201:
 *         description: Пользователь успешно создан.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Уникальный идентификатор пользователя.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Имя пользователя.
 *                   example: "Иван Иванов"
 *                 email:
 *                   type: string
 *                   description: Email пользователя.
 *                   example: "ivan@example.com"
 *       400:
 *         description: Ошибка валидации. Поля "name" и "email" обязательны для заполнения.
 *       409:
 *         description: Пользователь с таким email уже существует.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
router.post('/', userController.create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей
 *     description: Возвращает список всех пользователей.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает массив пользователей.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID пользователя.
 *                   name:
 *                     type: string
 *                     description: Имя пользователя.
 *                   email:
 *                     type: string
 *                     description: Email пользователя.
 *                   password:
 *                     type: string
 *                     description: Пароль пользователя (скрыт для безопасности)
 *                     example: "********"
 *                   
 *       500:
 *         description: Ошибка сервера.
 *         
 */
router.get('/', userController.getUsers);

module.exports = router;
