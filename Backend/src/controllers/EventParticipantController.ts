import { Request, Response, NextFunction } from 'express';
import EventParticipantService from '@services/EventParticipantService';

class EventParticipantController {
    async getParticipants (req: Request, res: Response, next: NextFunction): Promise<void> {
      const eventId = parseInt(req.params.id);
  
      if (isNaN(eventId)) {
         res.status(400).json({ message: 'Неверный ID мероприятия' });
         return;
      }
  
      try {
        const participants = await EventParticipantService.getParticipantsByEventId(eventId);
        res.status(200).json(participants);
      } catch (error) {
        next(error);
      }
    }

    async addParticipant (req: Request, res: Response, next: NextFunction): Promise<void> {
        const { eventId, userId } = req.body;
    
        if (typeof eventId !== 'number' || typeof userId !== 'number') {
           res.status(400).json({ message: 'eventId и userId должны быть числами' });
        }
    
        try {
          const participant = await EventParticipantService.addParticipant(eventId, userId);
          res.status(201).json(participant);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error.message.includes('зарегистрирован')) {
             res.status(409).json({ message: error.message }); // конфликт повторной регистрации
          }
          next(error);
        }
      }
  }
  
  export default new EventParticipantController();
  
