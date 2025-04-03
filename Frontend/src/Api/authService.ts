import axios from 'axios';
import { saveToken, clearToken } from '../utils/localStorageUtils'; 

const API_BASE_URL = 'http://localhost:3000';

interface LoginResponse {
  token: string;
}

export const login = async (userData: { name: string; email: string; password: string }): Promise<string | null> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const token = response.data.token;

    // Сохраняем токен в localStorage через импортированную функцию
    saveToken(token);
    return token; // Возвращаем токен, чтобы компонент мог его использовать

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка при логине:', error.response?.status, error.response?.data);
      throw new Error(`Ошибка логина: ${error.response?.status} ${error.response?.statusText}`);
    } else {
      console.error('Ошибка при выполнении запроса на логин:', error);
    }
    
    return null; // Возвращаем null в случае ошибки
  }
};

export const logout = (): void => {
  clearToken(); // Вызываем функцию для удаления токена из localStorage
};
