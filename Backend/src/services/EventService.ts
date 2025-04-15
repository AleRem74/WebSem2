import Event from '@models/Event';
import User from '@models/User';
import { ValidationError, NotFoundError } from '@utils/custom-errors';
import { Op } from 'sequelize';

class EventService {
    async create(title: string, description: string, date: Date, createdby: number) {
        try {
            const newEvent = await Event.create({ title, description, date, createdby });
            return newEvent;
        } catch (error) {
            if (error instanceof Error) { // Проверяем, является ли ошибкой
                if (error.name === 'SequelizeForeignKeyConstraintError') {
                    throw new ValidationError('Указанный ID пользователя (createdby) не существует.');
                }
            }
            throw error;
        }
    }

    async update(eventId: number, title: string, description: string, date: Date, createdby: number) {
        try {
            const event = await Event.findByPk(eventId);
            if (!event) {
                throw new NotFoundError('Мероприятие не найдено'); 
            }

            await event.update({ title, description, date, createdby });
            const updatedEvent = await Event.findByPk(eventId, {
                include: [{
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                }]
            }); 
            return updatedEvent;
        } catch (error) {
            if (error instanceof Error) { // Проверяем, является ли ошибкой
                if (error.name === 'SequelizeForeignKeyConstraintError') {
                    throw new ValidationError('Не удалось обновить мероприятие. Указанный ID пользователя (createdby) не существует.'); 
                }
            }
            throw error; // Пробрасываем остальные ошибки для обработки в контроллере
        }
    }

    async deleteEvent(eventId: number) {
        const event = await Event.findByPk(eventId);
        if (!event) {
            throw new NotFoundError('Мероприятие не найдено'); // Бросаем ошибку, если не найдено
        } 

        await event.destroy();
    }

    async getAll() {
        return await Event.findAll();
    }


    async searchEvents(title?: string, description?: string) {
        // eslint-disable-next-line no-useless-catch
        try {
            const events = await Event.findAll({
                where: {
                    ...(title && { title: { [Op.iLike]: `%${title}%` } }),
                    ...(description && { description: { [Op.iLike]: `%${description}%` } })
                }
            });
            return events;
        } catch (error) {
            throw error;
        }
    }
}

export default new EventService(); // Экспортируем экземпляр EventService
