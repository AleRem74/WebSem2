/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchEvents, searchEvents, api } from '../Api/eventService';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  createdby: string;
}

interface EventState {
  eventsData: Event[];
  events: any[]
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: EventState = {
  eventsData: [],
  loading: false,
  error: null,
  searchQuery: '',
  events: []
};

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

export const searchAllEvents = createAsyncThunk(
  'events/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const data = await searchEvents(query);
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
  },
  extraReducers: (builder) => {
    builder
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
        state.eventsData = action.payload;
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
        state.events = state.events.filter(event => event.id !== action.payload);
      });
  },
});

export const { setSearchQuery } = eventSlice.actions;
export default eventSlice.reducer;
