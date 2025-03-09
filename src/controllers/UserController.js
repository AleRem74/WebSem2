const UserService = require('../services/UserService');
const { ValidationError } = require('../utils/custom-errors');

class UserController {
    async create(req, res, next) {
        const { name, email } = req.body;
    
        if (!name || !email) {
            return next(new ValidationError('Поля "name" и "email" обязательны для заполнения.'));
        }
        //Здесь этот блок необходим чтобы с помощью next передать ошибку в обработчик
        try {
            const newUser = await UserService.create(name, email);
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
}

module.exports = new UserController();