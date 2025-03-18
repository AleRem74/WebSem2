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
}

module.exports = new UserService();