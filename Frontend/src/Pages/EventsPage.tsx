import React, { useState, useEffect } from 'react';
import { fetchEvents, searchEvents } from '../Api/eventService'; // Импортируем функции
import styles from './Styles/Events.module.css'

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  createdby: string;
}

function EventsPage() {
  const [eventsData, setEventsData] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для поискового запроса
  const [debouncedQuery, setDebouncedQuery] = useState(''); // Состояние для debounce

  // Функция для загрузки всех мероприятий
  const loadAllEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEventsData(data);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  // Функция для выполнения поиска
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // Если поле поиска пустое, загружаем все мероприятия
      loadAllEvents();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchEvents(query); // Выполняем поиск
      setEventsData(data); // Обновляем состояние с результатами поиска
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  // Обновляем debouncedQuery с задержкой (debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Устанавливаем значение с задержкой
    }, 300); // Задержка в миллисекундах

    return () => {
      clearTimeout(handler); // Очищаем таймер при каждом новом вводе
    };
  }, [searchQuery]);

  // Выполняем поиск при изменении debouncedQuery
  useEffect(() => {
    handleSearch(debouncedQuery); // Вызываем поиск только после debounce
  }, [debouncedQuery]);

  // Загрузка всех мероприятий при первом рендере компонента
  useEffect(() => {
    loadAllEvents();
  }, []);

  if (loading) {
    return <p>Загрузка мероприятий...</p>;
  }

  if (error) {
    return <p>Ошибка загрузки мероприятий: {error.message}</p>;
  }

  if (!eventsData || eventsData.length === 0) {
    return <p>Нет данных о мероприятиях.</p>;
  }

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Список мероприятий</h1>

        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Введите описание мероприятия"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />
        </div>

        <div className={styles.eventsList}>
            {eventsData.map((event) => (
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
