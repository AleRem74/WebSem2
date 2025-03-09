const Event = require('../models/Event');
const User = require('../models/User');
const { ValidationError, NotFoundError } = require('../utils/custom-errors');
const { Op } = require('sequelize');

class EventService {
    async create(title, description, date, createdby) {
        try {
            const newEvent = await Event.create({ title, description, date, createdby });
            return newEvent;
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new ValidationError('Указанный ID пользователя (createdby) не существует.');
            }
            throw error;
        }
    }

    async update(eventId, title, description, date, createdby) {
        try {
            const event = await Event.findByPk(eventId);
            if (!event) {
                throw new NotFoundError('Мероприятие'); 
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
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new ValidationError('Не удалось обновить мероприятие. Указанный ID пользователя (createdby) не существует.'); 
            }
            throw error; // Пробрасываем остальные ошибки для обработки в контроллере
        }
    }

    async deleteEvent(eventId) {
        const event = await Event.findByPk(eventId);
        if (!event) {
            throw new NotFoundError('Мероприятие'); // Бросаем ошибку, если не найдено
        }

        await event.destroy();
    }

    async getAll() {
        return await Event.findAll();
    }

    async searchEvents(title, description) {
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

module.exports = new EventService();