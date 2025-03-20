const UserService = require('../services/UserService');
const { ValidationError } = require('../utils/custom-errors');

class UserController {
    async create(req, res, next) {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
            return next(new ValidationError('Поля "name" и "email" и "password" обязательны для заполнения.'));
        }
        //Здесь этот блок необходим чтобы с помощью next передать ошибку в обработчик
        try {
            const newUser = await UserService.create(name, email, password);
                res.status(201).json(newUser);
        } catch (error) {
                next(error); // Передаем ошибку в middleware
        }
        
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAll();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async updateRole(req, res, next) {
        const userId = req.params.id;
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

module.exports = new UserController();