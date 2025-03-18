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