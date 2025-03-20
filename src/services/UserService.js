const User = require('../models/User');
const { ValidationError } = require('../utils/custom-errors');
const bcryptjs = require('bcryptjs');

class UserService {
    async create(name, email, password) {
        const userInputPassword = password.trim();
        const hashedPassword = await bcryptjs.hash(userInputPassword, 5)
        //этот блок обрабатывает ошибки с валидацией
        try {
            const newUser = await User.create({ name, email, password: hashedPassword});

            return newUser;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new ValidationError('Пользователь с таким email уже существует.');
            }

            throw error;
        }
    }
    /*
    async getAll() {
        return await User.findAll({
            attributes: {
                exclude: ['password'],  //Исключить отображение пароля
        },
    });
    }
    */
    async getAll() {
        return await User.findAll();
    }

    async updateRole(userId, newRole) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new NotFoundError('Пользователь'); // Пользователь не найден
            }

            // *Дополнительная валидация роли (опционально)*
            const validRoles = ['admin', 'user', 'NoName']; // Пример списка допустимых ролей
            if (!validRoles.includes(newRole)) {
                throw new ValidationError(`Недопустимая роль пользователя: "${newRole}". Допустимые роли: ${validRoles.join(', ')}.`);
            }

            await user.update({ role: newRole });
            const updatedUser = await User.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'role'] // Возвращаем только нужные атрибуты
            });
            return updatedUser;
        } catch (error) {
            throw error; // Пробрасываем ошибки для обработки в контроллере
        }
    }
}

module.exports = new UserService();