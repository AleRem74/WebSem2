import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const registerUser = async (userData: { name: string; email: string; password: string }): Promise<void> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.data) {
      throw new Error('Ошибка регистрации.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Ошибка HTTP: ${error.response?.status}`);
    } else {
      throw new Error("Неизвестная ошибка");
    }
  }
};