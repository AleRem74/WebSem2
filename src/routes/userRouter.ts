//todo импорт роутера
import express from 'express';
import { Response, NextFunction, RequestHandler } from 'express';
const router = express.Router();

import userController from '@controllers/UserController';
import { verifyToken, verifyAdminToken, RequestWithUser } from '@config/passport';


const wrapUserMiddleware = (
  middleware: (req: RequestWithUser, res: Response, next: NextFunction) => void
): RequestHandler => {
  return (req, res, next) => middleware(req as RequestWithUser, res, next);
};


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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Неавторизованный доступ.
 *       403:
 *         description: Доступ запрещен (например, недостаточно прав).
 *       500:
 *         description: Ошибка сервера.
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
//router.get('/' ,userController.getUsers);
router.get('/', verifyToken,wrapUserMiddleware(verifyAdminToken) ,userController.getUsers);

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Обновить роль пользователя (только для администраторов)
 *     description: >
 *       Обновляет роль указанного пользователя.
 *       Требуется аутентификация администратора.
 *     tags: [Users] # Группа пользователей
 *     security:
 *       - bearerAuth: [] # Указываем, что требуется bearer token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пользователя, роль которого нужно обновить
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 description: Новая роль пользователя (например, 'admin', 'user', 'editor')
 *     responses:
 *       200:
 *         description: Успешное обновление роли пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: # Опишите поля объекта пользователя, которые возвращаются
 *                 id:
 *                   type: integer
 *                   description: ID пользователя
 *                 name:
 *                   type: string
 *                   description: Имя пользователя
 *                 email:
 *                   type: string
 *                   description: Email пользователя
 *                 role:
 *                   type: string
 *                   description: Роль пользователя
 *       400:
 *         description: Ошибка валидации входных данных (например, отсутствует поле 'role')
 *       401:
 *         description: Отсутствует или недействительный токен авторизации
 *       403:
 *         description: Недостаточно прав (требуется роль администратора)
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 * components:
 *   securitySchemes:
 *     bearerAuth:            # Название схемы безопасности, используется в security секции маршрута
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.put('/:id/role', verifyToken, wrapUserMiddleware(verifyAdminToken), userController.updateRole);

export default router;
