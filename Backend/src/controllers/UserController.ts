import { Request, Response, NextFunction } from 'express';
import UserService from '@services/UserService';
import { ValidationError } from '@utils/custom-errors';
import User from '@models/User';
import Event from '@models/Event'

class UserController {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
            return next(new ValidationError('Поля "name" и "email" и "password" обязательны для заполнения.'));
        }
        
        try {
            const newUser = await UserService.create(name, email, password);
            res.status(201).json(newUser);
        } catch (error) {
            next(error); // Передаем ошибку в middleware
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await UserService.getAll();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const userId = Number(req.params.id);
            
            if (isNaN(userId)) {
                res.status(400).json({ error: 'Некорректный id пользователя' });
                return;
              }
              const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }, // Исключаем пароль
              });
          
              if (!user) {
                res.status(404).json({ error: 'Пользователь не найден' + userId });
                return;
              }
          
              // Получаем список мероприятий, созданных этим пользователем
              const events = await Event.findAll({
                where: { createdby: userId },
                attributes: ['id', 'title', 'description', 'date'], // какие нужны поля
                // Не включаем ассоциацию creator!
              });
          
              res.json({
                user,
                events, // добавляем список мероприятий в ответ
              });
            } catch (error) {
              next(error); // Передаем ошибку в обработчик ошибок Express
          }
    }

    async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = parseInt(req.params.id);
        const { role } = req.body; // Получаем новую роль из тела запроса

        if (!role) {
            return next(new ValidationError('Поле "role" обязательно для обновления роли пользователя.'));
        }

        try {
            const updatedUser = await UserService.updateRole(userId, role);
            res.status(200).json(updatedUser); // Успешное обновление
        } catch (error) {
            next(error); // Передаем ошибку дальше для обработки глобальным обработчиком ошибок
        }
    }
}

export default new UserController();
