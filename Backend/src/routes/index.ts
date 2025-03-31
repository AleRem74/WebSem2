//todo импорт роутера

// routes/index.js
import express from 'express';
const router = express.Router();
import userRoutes from './userRouter';
import eventRoutes from './eventRouter';
import publicRoutes from './public';
import authRoutes from './auth';

// Используем маршруты пользователей
router.use('/users', userRoutes);
router.use('/auth', authRoutes)
// Используем маршруты мероприятий
router.use('/events', eventRoutes);
router.use('/events', publicRoutes)


export default router;