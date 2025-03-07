class UserService {
    async create(name, email) {
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
}

module.export = new UserService();