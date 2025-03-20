// controllers/EventController.js
const EventService = require('../services/EventService');
const { ValidationError } = require('../utils/custom-errors');

class EventController {
    async create(req, res, next) {
        const { title, description, date, createdby } = req.body;

        if (!title || !date || !createdby) {
            return next(new ValidationError('Поля "title", "date" и "createdby" обязательны для заполнения.'));
        }
        //Здесь этот блок необходим чтобы с помощью next передать ошибку в обработчик
        try {
            const newEvent = await EventService.create(title, description, date, createdby);
            res.status(201).json(newEvent);
        } catch (error) {
            next(error); // Передаем ошибку в middleware
        }
    }

    async update(req, res, next) {
        const eventId = req.params.id;
        const { title, description, date, createdby } = req.body;

        if (!description ) {
            return next(new ValidationError ('Поля "title", "date" и "createdby" обязательны для обновления.' ));
        }
        //И здесь тоже для передачи в обработчик
        try {
            const updatedEvent = await EventService.update(eventId, title, description, date, createdby);
            res.status(200).json(updatedEvent);
        } catch (error) {
            next(error);
        }
    }

    async deleteEvent(req, res, next) {
        const eventId = req.params.id;
        try {
            await EventService.deleteEvent(eventId);
            res.status(200).json({ message: 'Мероприятие успешно удалено.' });
        } catch (error) {
            next(error); 
        }
    }

    async getEvents(req, res, next) {
        try {
            const events = await EventService.getAll();
            res.status(200).json(events);
        } catch (error) {
            next(error);
        }
    }

    async search(req, res, next) {
        const { title, description } = req.query;

        try {
            const events = await EventService.searchEvents(title, description);
            res.status(200).json(events);
        } catch (error) {
            next(error);
        }
    }

    
}

module.exports = new EventController();
