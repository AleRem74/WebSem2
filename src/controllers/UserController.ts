import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';
import { ValidationError } from '../utils/custom-errors';

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
