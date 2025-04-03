import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../Api/eventService'; // Импортируем функцию для получения данных

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

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchEvents(); // Вызываем функцию для получения данных
        setEventsData(data);
      } catch (error) {
        setError(error instanceof Error ? error : new Error("Неизвестная ошибка"));
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []); // Пустой массив зависимостей

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
            <p style={{ margin: '0 0 10px', color: '#555' }}>{event.description}</p>
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
