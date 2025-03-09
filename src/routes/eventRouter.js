const express = require('express');
const router = express.Router();
const eventController = require('../controllers/EventController');

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список мероприятий 
 *     description: Возвращает список всех мероприятий 
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает массив мероприятий.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID мероприятия.
 *                   title:
 *                     type: string
 *                     description: Название мероприятия.
 *                   description:
 *                     type: string
 *                     description: Описание мероприятия.
 *                   
 *       404:
 *         description: Мероприятия не найдены.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Мероприятия не найдены."
 *       500:
 *         description: Ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Не удалось получить мероприятия."
 *                 details:
 *                   type: string
 *                   example: "Ошибка"
 */
router.get('/', eventController.getEvents);


/**
 * @swagger
 * /events/search:
 *   get:
 *     summary: Получение мероприятий по поисковому запросу
 *     description: Возвращает список мероприятий, соответствующих поисковому запросу по заголовку и описанию.
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Часть заголовка мероприятия для поиска (регистронезависимый поиск).
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Часть описания мероприятия для поиска (регистронезависимый поиск).
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает массив мероприятий, соответствующих критериям поиска.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object # Здесь нужно описать структуру объекта Event, если она известна, например:
 *                 # $ref: '#/components/schemas/Event'
 *                 example: # Пример ответа, можно убрать или заменить на реальный пример Event
 *                   - id: 1
 *                     title: "Название мероприятия 1"
 *                     description: "Описание мероприятия 1"
 *                     # ... другие поля Event
 *                   - id: 2
 *                     title: "Название мероприятия 2"
 *                     description: "Описание мероприятия 2"
 *                     # ... другие поля Event
 *       500:
 *         description: Ошибка сервера. Не удалось получить мероприятия.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Не удалось получить мероприятия."
 *                 details:
 *                   type: string
 *                   example: "SequelizeDatabaseError: ..." # Пример ошибки
 */
router.get('/search', eventController.search);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создание нового мероприятия
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - createdby
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название мероприятия
 *               description:
 *                 type: string
 *                 description: Описание мероприятия
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата и время мероприятия
 *               createdby:
 *                 type: integer
 *                 description: ID пользователя, создавшего мероприятие
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка валидации данных
 *       500:
 *         description: Ошибка сервера
 */
router.post('/', eventController.create);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновление информации о мероприятии
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия для обновления
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - createdby
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название мероприятия
 *               description:
 *                 type: string
 *                 description: Описание мероприятия
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата и время мероприятия
 *               createdby:
 *                 type: integer
 *                 description: ID пользователя, создавшего мероприятие
 *     responses:
 *       200:
 *         description: Мероприятие успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка валидации данных или неверный ID пользователя (createdby)
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
// Обновление мероприятия (PUT /events/:id)
router.put('/:id', eventController.update);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удаление мероприятия по ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия для удаления
 *     responses:
 *       200:
 *         description: Мероприятие успешно удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
// Удаление мероприятия (DELETE /events/:id)
router.delete('/:id', eventController.deleteEvent);

module.exports = router;