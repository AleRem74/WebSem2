//todo импорт роутера

module.export = router;
// routes/index.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRouter');
const eventRoutes = require('./eventRouter');
const publicRoutes = require('./public')
const authRoutes = require('./auth')

// Используем маршруты пользователей
router.use('/users', userRoutes);
router.use('/auth', authRoutes)
// Используем маршруты мероприятий
router.use('/events', eventRoutes);
router.use('/events', publicRoutes)


module.exports = router;