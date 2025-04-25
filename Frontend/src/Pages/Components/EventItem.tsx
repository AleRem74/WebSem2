import React, { useState } from 'react';

interface Participant {
    id: number;
    name: string;
    // другие поля, если есть
  }
  
  interface Event {
    id: number;
    title: string;
    // ...
  }
  

interface Props {
  event: Event;
}

const EventItem: React.FC<Props> = ({ event }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${event.id}/participants`);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке участников');
      }
      const data: Participant[] = await response.json();
      setParticipants(data);
      setShowModal(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-container">
      <h3>{event.title}</h3>
      <button onClick={fetchParticipants} disabled={loading}>
        {loading ? 'Загрузка...' : 'Участники'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h4>Участники мероприятия</h4>
            <ul>
              {participants.length > 0 ? (
                participants.map(p => <li key={p.id}>{p.name}</li>)
              ) : (
                <li>Участников нет</li>
              )}
            </ul>
            <button onClick={() => setShowModal(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventItem;
