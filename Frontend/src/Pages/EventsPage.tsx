import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setSearchQuery } from '../app/eventSlice';
import { useEventManagement } from '../Pages/Components/EventManagement';
import EventCard from './Components/EventCard';
import EventForm from './Components/EventForm';
import styles from './Styles/Events.module.css';
import debounce from 'lodash.debounce';

const EventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector(state => state.event);

  const {
    events: eventsData,
    loading,
    error,
    currentUserId,
    isModalOpen,
    isEditMode,
    editData,
    participants,
    showModal,
    modalLoading,
    modalError,
    fetchParticipants,
    handleParticipate,
    handleSave,
    searchEventsByQuery,
    openAddModal,
    closeModal,
    setShowModal,
  } = useEventManagement(false);

  // Дебаунс для поиска
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchEventsByQuery(query);
    }, 300),
    []
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    dispatch(setSearchQuery(query));  // обновляем локальный state запроса
    debouncedSearch(query);            // вызываем поиск с задержкой
  };

  if (loading) return <p>Загрузка мероприятий...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!eventsData || eventsData.length === 0) return <p>Нет мероприятий</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Список мероприятий</h1>
      <button onClick={openAddModal} className={styles.addButton}>Добавить</button>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск мероприятий"
          value={searchQuery}
          onChange={onSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.eventsList}>
        {eventsData.map(event => (
          <EventCard
            key={event.id.toString()}
            event={event}
            currentUserId={currentUserId}
            onParticipantsClick={fetchParticipants}
            onParticipate={handleParticipate}
            //onDelete={handleDeleteEvent}  // если есть кнопка удаления
            //onEdit={openEditModal}
          />
        ))}
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Участники мероприятия</h3>
            {modalError && <p style={{ color: 'red' }}>{modalError}</p>}
            {!modalError && !modalLoading && participants.length === 0 && <p>Участников нет</p>}
            {!modalError && participants.length > 0 && (
              <ul>
                {participants.map(p => (
                  <li key={p.id}>{p.user.name}</li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowModal(false)} className={styles.closeButton}>Закрыть</button>
          </div>
        </div>
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

export default EventsPage;