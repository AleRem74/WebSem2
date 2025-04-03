import React, { useState, useEffect } from 'react';
import { fetchEvents, searchEvents } from '../Api/eventService'; // Импортируем функции

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
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Если поле поиска пустое, загружаем все мероприятия
      loadAllEvents();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchEvents(searchQuery); // Выполняем поиск
      setEventsData(data); // Обновляем состояние с результатами поиска
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  

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
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Список мероприятий</h1>

      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Введите описание мероприятия"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Обновляем состояние при вводе текста
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleSearch} // Вызываем функцию поиска при нажатии на кнопку
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Поиск
        </button>
      </div>

      {}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {eventsData.map((event) => (
          <div
            key={event.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
            }}
          >
            <h2 style={{ margin: '0 0 10px' }}>{event.title}</h2>
            <p  style={{ margin: '0 0 10px', color: '#555' }}> Описание: {event.description}</p>
            <p style={{ margin: '0', fontSize: '14px', color: '#888' }}>
              Дата проведения: {new Date(event.date).toLocaleDateString()}
            </p>
            <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#aaa' }}>
              Организатор: {event.createdby}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
