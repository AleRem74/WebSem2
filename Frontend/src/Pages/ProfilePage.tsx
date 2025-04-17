import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/localStorageUtils';
import axios from 'axios';
import styles from './Styles/ProfilePage.module.css';
import EventForm from './Components/EventForm'; // Импортируем компонент формы

const API_BASE_URL = 'http://localhost:3000';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface EditEventData {
  id?: string;
  title: string;
  description: string;
  date: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<EditEventData | undefined>(undefined);
  const [editingEventId, setEditingEventId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Извлечение токена из localStorage
        const token = getToken();
        if (!token) {
          throw new Error('Токен не найден. Пожалуйста, авторизуйтесь.');
        }
        // Декодируем токен для получения информации о пользователе
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId; // Предполагается, что ID пользователя находится в токене

        // Запрос данных пользователя с помощью axios
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Передача токена в заголовке
          },
        });

        const data = response.data;

        setUser(data.user);
        setEvents(data.events);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Открыть модалку добавления
  const openAddModal = () => {
    setIsEditMode(false);
    setEditData({
      title: '',
      description: '',
      date: '',
    });
    setIsModalOpen(true);
  };

  // Открыть модальное окно для редактирования мероприятия
  const openEditModal = (event: Event) => {
    setIsEditMode(true);
    setEditingEventId(event.id);
    setEditData({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 10),
    });
    setIsModalOpen(true);
  };

  // Закрыть модалку
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Сохранить изменения
  const handleSave = async (formData: EditEventData) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Токен не найден. Пожалуйста, авторизуйтесь.');
      if (!user) throw new Error('Информация о пользователе отсутствует');

      // Подготавливаем тело запроса
      const eventPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: new Date(formData.date).toISOString(),
        createdby: user.id,
      };

      if (isEditMode) {
        if (!editingEventId) {
          alert('ID мероприятия для обновления отсутствует');
          return;
        }
        // Редактирование
        const response = await axios.put(`${API_BASE_URL}/events/${editingEventId}`, eventPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents((prev) =>
          prev.map((event) => (event.id === editingEventId ? response.data : event))
        );
      } else {
        // Добавление
        const response = await axios.post(`${API_BASE_URL}/events`, eventPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents((prev) => [...prev, response.data]);
      }

      closeModal();
    } catch (err) {
      if (err instanceof Error) {
        alert(`Ошибка при сохранении мероприятия: ${err.message}`);
      } else {
        alert('Неизвестная ошибка при сохранении.');
      }
    }
  };

  // Функция удаления мероприятия
  const handleDeleteEvent = async (eventId: string) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить это мероприятие?');
    if (!confirmed) return; // если отмена - прерываем функцию
    try {
      const token = getToken();
      if (!token) throw new Error('Токен не найден. Пожалуйста, авторизуйтесь.');

      await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Обновляем список мероприятий — фильтруем удалённое
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (err) {
      if (err instanceof Error) {
        alert(`Ошибка при удалении мероприятия: ${err.message}`);
      } else {
        alert('Неизвестная ошибка при удалении мероприятия');
      }
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Пользователь не найден.</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>Профиль пользователя</h1>
        <div className={styles.userInfo}>
          <p>Имя: {user.name}</p>
<p>Email: {user.email}</p>
        </div>
      </div>

      <div className={styles.headerWithAdd}>
        <h2>Мои мероприятия</h2>
        <button onClick={openAddModal} className={styles.addButton}>
          Добавить
        </button>
      </div>
      {events.length > 0 ? (
        <div className={styles.eventsContainer}>
          {events.map((event) => (
            <div className={styles.eventCard} key={event.id}>
              <button
                className={styles.deleteButton}
                title="Удалить"
                onClick={() => handleDeleteEvent(event.id)}
              >
                &times;
              </button>
              <h3 className={styles.eventTitle}> Название: {event.title}</h3>
              <p className={styles.eventDescription}>Описание: {event.description}</p>
              <p className={styles.eventDate}>
                Дата: {new Date(event.date).toLocaleDateString()}
              </p>
              <div className={styles.eventButtons}>
                <button className={styles.editButton} onClick={() => openEditModal(event)}>
                  Редактировать
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Нет созданных мероприятий.</p>
      )}
      <EventForm
        isModalOpen={isModalOpen}
        isEditMode={isEditMode}
        closeModal={closeModal}
        handleSave={handleSave}
        initialData={editData}
      />
    </div>
  );
};

export default ProfilePage;