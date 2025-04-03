import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchEvents = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events`);
    return response.data; // Возвращаем полученные данные
  } catch (error) {
    console.error("Ошибка при загрузке мероприятий:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Ошибка HTTP: ${error.response?.status}`);
    } else {
      throw new Error("Неизвестная ошибка");
    }
  }
};

// Функция для поиска мероприятий
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const searchEvents = async (query: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/search`, {
        params: { description: query }, // Передаем поисковый запрос как параметр
      });
      return response.data; // Возвращаем результаты поиска
    } catch (error) {
      console.error('Ошибка при поиске мероприятий:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Ошибка HTTP: ${error.response?.status}`);
      } else {
        throw new Error('Неизвестная ошибка');
      }
    }
  };
