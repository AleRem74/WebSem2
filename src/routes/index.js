//todo импорт роутера

module.export = router;
// routes/index.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRouter');
const eventRoutes = require('./eventRouter');

// Используем маршруты пользователей
router.use('/users', userRoutes);

// Используем маршруты мероприятий
router.use('/events', eventRoutes);

module.exports = router;