import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi } from '../Api/authService';
import { saveToken, getToken } from '../utils/localStorageUtils';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  email: string; // Добавляем состояние для email
  password: string; // Добавляем состояние для пароля
}

const initialState: AuthState = {
  token: getToken(),
  loading: false,
  error: null,
  isAuthenticated: !!getToken(),
  email: '',
  password: '',
};

// thunk для логина
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const token = await loginApi({
        email, password,
        name: ''
      });
      if (token) {
        saveToken(token);
        return token;
      }
      return rejectWithValue('Ошибка логина');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.email = ''; // Сбрасываем email
      state.password = ''; // Сбрасываем пароль
      localStorage.removeItem('token'); // Удаляем токен из локального хранилища
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload as string;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Ошибка при логине';
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setEmail, setPassword } = authSlice.actions;

export default authSlice.reducer
