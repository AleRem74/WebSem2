import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './eventSlice';
import authReducer from './authSlice'
import regReducer from './regSlice'
import userReducer from './userSlice';
import filterReducer from './filterSlice'

export const store = configureStore({
    reducer: {
      event: eventReducer,
      auth: authReducer,
      reg: regReducer,
      user: userReducer,
      filters: filterReducer,
    },
  });
// типы для useSelector и useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

