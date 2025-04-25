/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { closeModal, deleteEvent, Event, fetchEventsAndUser, fetchParticipants, handleParticipate, openAddModal, openEditModal, saveEvent, searchAllEvents, setShowModal } from '../../app/eventSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';


export interface EditEventData {
  id?: string;
  title: string;
  description: string;
  date: string;
}

export interface Participant {
  id: string | number;
  eventId: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const useEventManagement = (isProfilePage = false) => {
  const dispatch = useAppDispatch();
  const {
    user, events, loading, error, currentUserId,
    isModalOpen, isEditMode, editData, editingEventId,
    participants, showModal, modalLoading, modalError,
  } = useAppSelector(state => state.event);

  // Добавляем функцию для совершения поиска:
  const searchEventsByQuery = (query: string) => {
    dispatch(searchAllEvents(query));
  };

  useEffect(() => {
    dispatch(fetchEventsAndUser(isProfilePage));
  }, [dispatch, isProfilePage]);

  // Обернуть fetchParticipants и handleParticipate чтобы удобнее вызывать
  const loadParticipants = (eventId: string) => {
    dispatch(fetchParticipants(eventId));
  };

  const participateInEvent = (eventId: string) => {
    dispatch(handleParticipate(eventId));
  };

  const saveEventHandler = (formData: EditEventData) => {
    dispatch(saveEvent({ formData, isEditMode, editingEventId }));
  };

  const handleDeleteEventHandler = (eventId: string) => {
    const confirmed = window.confirm('Удалить мероприятие?');
    if (!confirmed) return;
  
    dispatch(deleteEvent(eventId));
  };
  
  const openAddModalHandler = () => dispatch(openAddModal());
  const openEditModalHandler = (event: Event) => dispatch(openEditModal(event));
  const closeModalHandler = () => dispatch(closeModal());
  const setShowModalHandler = (value: boolean) => dispatch(setShowModal(value));

  return {
    user,
    events,
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
    searchEventsByQuery,
    fetchParticipants: loadParticipants,
    handleParticipate: participateInEvent,
    handleSave: saveEventHandler,
    handleDeleteEvent: handleDeleteEventHandler,
    openAddModal: openAddModalHandler,
    openEditModal: openEditModalHandler,
    closeModal: closeModalHandler,
    setShowModal: setShowModalHandler,
  };
};
