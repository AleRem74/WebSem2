import React from 'react';
import styles from '../Styles/EventCard.module.css';

interface EventCardProps {
  event: {
    id: string | number;
    title: string;
    description: string;
    date: string;
    createdby?: number | string;
  };
  isProfilePage?: boolean;
  currentUserId?: number | null;
  onParticipantsClick?: (eventId: string) => void;
  onParticipate?: (eventId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditClick?: (event: any) => void;
  onDeleteClick?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isProfilePage = false,
  currentUserId = null,
  onParticipantsClick,
  onParticipate,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <div className={styles.eventCard}>
      {isProfilePage && onDeleteClick && (
        <button
          className={styles.deleteButton}
          title="Удалить"
          onClick={() => onDeleteClick(event.id.toString())}
        >
          &times;
        </button>
      )}

      <h3 className={styles.eventTitle}>Название: {event.title}</h3>
      <p className={styles.eventDescription}>Описание: {event.description}</p>
      <p className={styles.eventDate}>
        Дата: {new Date(event.date).toLocaleDateString()}
      </p>

      {isProfilePage && onEditClick && (
        <div className={styles.eventButtons}>
          <button 
            className={styles.editButton} 
            onClick={() => onEditClick(event)}
          >
            Редактировать
          </button>
        </div>
      )}

      {!isProfilePage && onParticipantsClick && currentUserId !== null && (
        <>
          <button
            onClick={() => onParticipantsClick(event.id.toString())}
            className={styles.participantsButton}
          >
            Участники
          </button>
          {/* Кнопка "Участвовать" только для страницы мероприятий */}
          {onParticipate && currentUserId !== null && currentUserId !== event.createdby && (
            <button 
              className={styles.participateButton}
              onClick={() => onParticipate(event.id.toString())}
            >
              Участвовать
            </button> 
          )
          }
        </>
      )}
    </div>
  );
};

export default EventCard;
