// store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { registerUser as apiRegisterUser } from '../Api/regService'; // функция API регистрации

interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
  }
  
  interface RegState {
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
    error: string;
    successMessage: string;
    isLoading: boolean;
  }
  
  const initialState: RegState = {
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    successMessage: '',
    isLoading: false,
  };
  
  export const registerUser = createAsyncThunk(
    'auth/register',
    async (credentials: RegisterCredentials, { rejectWithValue }) => {
      try {
        const response = await apiRegisterUser(credentials);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('Произошла ошибка. Попробуйте снова позже.');
      }
    }
  );
  
  const regSlice = createSlice({
    name: 'reg',
    initialState,
    reducers: {
      setLogin: (state, action: PayloadAction<string>) => {
        state.login = action.payload;
      },
      setEmail: (state, action: PayloadAction<string>) => {
        state.email = action.payload;
      },
      setPassword: (state, action: PayloadAction<string>) => {
        state.password = action.payload;
      },
      setConfirmPassword: (state, action: PayloadAction<string>) => {
        state.confirmPassword = action.payload;
      },
      setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.successMessage = '';
      },
      clearMessages: (state) => {
        state.error = '';
        state.successMessage = '';
      },
      resetForm: (state) => {
        state.login = '';
        state.email = '';
        state.password = '';
        state.confirmPassword = '';
        state.error = '';
        state.successMessage = '';
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(registerUser.pending, (state) => {
          state.isLoading = true;
          state.error = '';
        })
        .addCase(registerUser.fulfilled, (state) => {
          state.isLoading = false;
          state.successMessage = 'Регистрация прошла успешно!';
          state.error = '';
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
          state.successMessage = '';
        });
    },
  });
  
  export const {
    setLogin,
    setEmail,
    setPassword,
    setConfirmPassword,
    setError,
    clearMessages,
    resetForm,
  } = regSlice.actions;

export default regSlice.reducer;
