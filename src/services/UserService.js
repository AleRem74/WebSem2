const User = require('../models/User');
const { ValidationError } = require('../utils/custom-errors');

class UserService {
    async create(name, email) {
        //этот блок обрабатывает ошибки с валидацией
        try {
            const newUser = await User.create({ name, email });

            return newUser;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new ValidationError('Пользователь с таким email уже существует.');
            }

            throw error;
        }
    }


    async getAll() {
        return await User.findAll();
    }
}

module.exports = new UserService();