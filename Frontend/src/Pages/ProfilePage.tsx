import React from 'react';
import styles from './Styles/ProfilePage.module.css';
import { useEventManagement } from '../Pages/Components/EventManagement';
import EventCard from './Components/EventCard';
import EventForm from './Components/EventForm';

const ProfilePage: React.FC = () => {
  const {
    user,
    events,
    loading,
    error,
    isModalOpen,
    isEditMode,
    editData,
    handleSave,
    openAddModal,
    closeModal,
    openEditModal,
    handleDeleteEvent,
  } = useEventManagement(true);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Пользователь не найден</p>;

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
            <EventCard 
              key={event.id}
              event={event}
              isProfilePage={true}
              onEditClick={openEditModal}
              onDeleteClick={handleDeleteEvent}
            />
          ))}
        </div>
      ) : (
        <p>Нет созданных мероприятий</p>
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
