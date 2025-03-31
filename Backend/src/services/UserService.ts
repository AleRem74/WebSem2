import User from '@models/User';
import { ValidationError, NotFoundError } from '@utils/custom-errors';
import bcryptjs from 'bcryptjs';

class UserService {
    async create(name: string, email: string, password: string): Promise<User> {
        const userInputPassword = password.trim();
        const hashedPassword = await bcryptjs.hash(userInputPassword, 5);

        try {
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
            });

            return newUser;
        } catch (error) {
            if (error instanceof Error) { //является ли ошибкой
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new ValidationError('Пользователь с таким email уже существует.');
                }
            }
            throw error; // Пробрасываем другие ошибки
        }
        
    }

    async getAll(): Promise<User[]> {
        return await User.findAll();
    }

    async updateRole(userId: number, newRole: 'user' | 'admin' | 'NoName'): Promise<User | null> {
        // eslint-disable-next-line no-useless-catch
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new NotFoundError('Пользователь не найден'); // Пользователь не найден
            }

            // Дополнительная валидация роли
            const validRoles = ['admin', 'user', 'NoName']; // список допустимых ролей
            if (!validRoles.includes(newRole)) {
                throw new ValidationError(`Недопустимая роль пользователя: "${newRole}". Допустимые роли: ${validRoles.join(', ')}`);
            }

            await user.update({ role: newRole });
            const updatedUser = await User.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'role'], // Возвращаем только нужные атрибуты
            });
            return updatedUser;
        } catch (error) {
            throw error; // Пробрасываем ошибки для обработки в контроллере
        }
    }
}

export default new UserService(); // Экспортируем экземпляр UserService
