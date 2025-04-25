/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchEvents, searchEvents, api } from '../Api/eventService';
import { getToken } from '../utils/localStorageUtils';
import axios from 'axios';
//import { Participant } from '../Pages/Components/EventManagement';
import { User } from './userSlice';

const API_BASE_URL = 'http://localhost:3000';

 export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  createdby: number;
}

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


interface EventState {
  user: User | null;
  eventsData: Event[];
  events: Event[]
  loading: boolean;
  error: string | null;
  searchQuery: string;
  currentUserId: number | null;

  isModalOpen: boolean;
  isEditMode: boolean;
  editData?: EditEventData;
  editingEventId?: string;

  participants: Participant[];
  showModal: boolean;
  modalLoading: boolean;
  modalError: string | null;
}

const initialState: EventState = {
  user: null,
  events: [],
  eventsData: [],
  loading: false,
  error: null,
  searchQuery: '',
  currentUserId: null,
  

  isModalOpen: false,
  isEditMode: false,
  editData: undefined,
  editingEventId: undefined,

  participants: [],
  showModal: false,
  modalLoading: false,
  modalError: null,
};


export interface SaveEventPayload {
  formData: EditEventData;
  isEditMode: boolean;
  editingEventId?: string;
}

export const saveEvent = createAsyncThunk<
  Event,               // возвращаемое событие
  SaveEventPayload,    // входящий payload
  { rejectValue: string }
>(
  'event/saveEvent',
  async ({ formData, isEditMode, editingEventId }, { rejectWithValue, getState }) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Токен не найден. Пожалуйста, авторизуйтесь.');

      // Получаем currentUserId из state redux если он туда загрузился
      const state = getState() as { event: EventState };
      //const userId = state.event.currentUserId;
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      if (!userId) throw new Error('Информация о пользователе отсутствует');

      // Формируем payload для API
      const eventPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: new Date(formData.date).toISOString(),
        createdby: userId,
      };

      let response;

      if (isEditMode && editingEventId) {
        response = await axios.put(
          `${API_BASE_URL}/events/${editingEventId}`,
          eventPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/events`,
          eventPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      return response.data; // ожидаем Event
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Неизвестная ошибка'
      );
    }
  }
);



// Асинхронный запрос для fetchData
export const fetchEventsAndUser = createAsyncThunk<
  // тип успешного результа (payload)
  { user: User; events: Event[]; currentUserId: number },
  // аргументы thunk
  boolean,
  { rejectValue: string }
>(
  'event/fetchEventsAndUser',
  async (isProfilePage, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Токен не найден');

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      const url = isProfilePage ? `${API_BASE_URL}/users/${userId}` : `${API_BASE_URL}/events`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = isProfilePage ? response.data : { events: response.data };
      console.log('user: ', data.user)

      return {
        user: data.user,
        events: data.events,
        currentUserId: userId,

      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      return rejectWithValue(message);
    }
  }
);

// Асинхронный запрос для fetchParticipants
export const fetchParticipants = createAsyncThunk<
  Participant[],
  string,
  { rejectValue: string }
>(
  'event/fetchParticipants',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/participant/${eventId}`);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      return rejectWithValue(message);
    }
  }
);

// Асинхронный запрос для handleParticipate
export const handleParticipate = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'event/handleParticipate',
  async (eventId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Пользователь не авторизован');

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      await axios.post(
        `${API_BASE_URL}/events/participant`,
        { eventId: Number(eventId), userId: Number(userId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Неизвестная ошибка';
      return rejectWithValue(message);
    }
  }
);


// Асинхронные thunk-действия
export const fetchAllEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchEvents();
      return data;
    } catch (error) {
      return rejectWithValue('Неизвестная ошибка при загрузке мероприятий');
    }
  }
);
//    ТУТ НАШ ПОИСК!!!
export const searchAllEvents = createAsyncThunk(
  'events/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const data = await searchEvents(query);
      console.log('data', data)
      return data;
    } catch (error) {
      return rejectWithValue('Ошибка поиска мероприятий');
    }
  }
);


export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData: any, { rejectWithValue }) => {
    try {
      return await api.createEvent(eventData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ eventId, eventData }: { eventId: string, eventData: any }, { rejectWithValue }) => {
    try {
      return await api.updateEvent(eventId, eventData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (eventId: string, { rejectWithValue }) => {
    try {
      await api.deleteEvent(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    openAddModal(state) {
      state.isEditMode = false;
      state.editData = { title: '', description: '', date: '' };
      state.isModalOpen = true;
    },
    openEditModal(state, action: PayloadAction<Event>) {
      const event = action.payload;
      state.isEditMode = true;
      state.editingEventId = event.id.toString();
      state.editData = {
        title: event.title,
        description: event.description,
        date: event.date.slice(0, 10),
      };
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    setShowModal(state, action: PayloadAction<boolean>) {
      state.showModal = action.payload;
    },


    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setEvents(state, action: PayloadAction<Event[]>) {
      state.events = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setCurrentUserId(state, action: PayloadAction<number | null>) {
      state.currentUserId = action.payload;
    },

    setIsModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
    setIsEditMode(state, action: PayloadAction<boolean>) {
      state.isEditMode = action.payload;
    },
    setEditData(state, action: PayloadAction<EditEventData | undefined>) {
      state.editData = action.payload;
    },
    setEditingEventId(state, action: PayloadAction<string | undefined>) {
      state.editingEventId = action.payload;
    },

    setParticipants(state, action: PayloadAction<Participant[]>) {
      state.participants = action.payload;
    },
    //setShowModal(state, action: PayloadAction<boolean>) {
    //  state.showModal = action.payload;
    //},
    setModalLoading(state, action: PayloadAction<boolean>) {
      state.modalLoading = action.payload;
    },
    setModalError(state, action: PayloadAction<string | null>) {
      state.modalError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEventsAndUser
      .addCase(fetchEventsAndUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsAndUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.events = action.payload.events;
        state.loading = false;
        state.error = null;
        // можно также добавить currentUserId, если нужно:
        state.currentUserId = action.payload.currentUserId //user?.id || null;
      })
      .addCase(fetchEventsAndUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки данных';
      })

      // fetchParticipants
      .addCase(fetchParticipants.pending, (state) => {
        state.modalLoading = true;
        state.modalError = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
state.participants = action.payload;
        state.showModal = true;
        state.modalLoading = false;
        state.modalError = null;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.modalLoading = false;
        state.modalError = action.payload || 'Ошибка загрузки участников';
        state.participants = [];
        state.showModal = true;
      })

      // handleParticipate
      .addCase(handleParticipate.pending, (state) => {
        // Можно установить какой-то стейт, если нужно
      })
      .addCase(handleParticipate.fulfilled, (state) => {
        alert('Вы успешно зарегистрированы на мероприятие!');
      })
      .addCase(handleParticipate.rejected, (state, action) => {
        alert('Ошибка при регистрации: ' + (action.payload || 'Неизвестная ошибка'));
      })

      .addCase(saveEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const savedEvent = action.payload;
        state.loading = false;
        state.error = null;
    
        if (state.isEditMode && state.editingEventId) {
          // Обновляем событие в списке
          state.events = state.events.map(event =>
            event.id.toString() === state.editingEventId ? savedEvent : event
          );
        } else {
          // Добавляем новое событие в список
          state.events = [...state.events, savedEvent];
        }
    
        // Закрытие модалки и сброс редактируемых данных
        state.isModalOpen = false;
        state.isEditMode = false;
        state.editData = undefined;
        state.editingEventId = undefined;
      })
      .addCase(saveEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при сохранении события';
      })
    
      // Обработка fetchAllEvents
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.eventsData = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Обработка searchAllEvents
      .addCase(searchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAllEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(searchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Обработка создания, обновления, удаления
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(event => event.id.toString() !== action.payload);
      });
  },
});

export const { setSearchQuery, 
  setUser,
  
  setEvents,
  setLoading,
  setError,
  setCurrentUserId,
  setIsModalOpen,
  setIsEditMode,
  setEditData,
  setEditingEventId,
  setParticipants,
  setShowModal,
  setModalLoading,
  setModalError,

  openAddModal,
  openEditModal,
  closeModal,
  //setShowModal
 } = eventSlice.actions;
export default eventSlice.reducer;
