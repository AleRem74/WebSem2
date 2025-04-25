import EventParticipant from '@models/EventParticipant';
import User from '@models/User';

class EventParticipantService {
  static async getParticipantsByEventId(eventId: number) {
    // Возвращаем список пользователей, участвующих в мероприятии
    const participants = await EventParticipant.findAll({
      where: { eventId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'], // нужные поля
      }],
    });

    // Форматируем, чтобы возвращать список пользователей
    return participants//.map(p => p.userId);
  }

  static async addParticipant(eventId: number, userId: number) {
    
    const [participant, created] = await EventParticipant.findOrCreate({
      where: { eventId, userId },
      defaults: { eventId, userId },
    });

    if (!created) {
      throw new Error('Пользователь уже зарегистрирован на это мероприятие');
    }

    return participant;
  }
}

export default EventParticipantService;
