/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllEvents, searchAllEvents, setSearchQuery } from '../app/eventSlice';
import styles from './Styles/Events.module.css';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  createdby: string;
}

function EventsPage() {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { eventsData, loading, error, searchQuery } = useAppSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchAllEvents(searchQuery));
      } else {


        dispatch(fetchAllEvents());
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, dispatch]);

  if (loading) {
    return <p>Загрузка мероприятий...</p>;
  }

  if (error) {
    return <p>Ошибка загрузки мероприятий: {error}</p>;
  }

  if (!eventsData || eventsData.length === 0) {
    return <p>Нет данных о мероприятиях.</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Список мероприятий</h1>

      <div className={styles
.searchContainer}>
        <input
          type="text"
          placeholder="Введите описание мероприятия"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.eventsList}>
        {eventsData.map((event: Event) => (
          <div key={event.id} className={styles.eventCard}>
            <h2 className={styles.eventTitle}>{event.title}</h2>
            <p className={styles.eventDescription}>
              Описание: {event.description}
            </p>
            <p className={styles.eventDate}>
              Дата проведения: {new Date(event.date).toLocaleDateString()}
            </p>
            <p className={styles.eventOrganizer}>
              Организатор: {event.createdby}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;