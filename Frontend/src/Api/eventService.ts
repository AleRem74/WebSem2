/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getToken } from '../utils/localStorageUtils';

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


  export const api = {
    getUserProfile: async (userId: number) => {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
  
    createEvent: async (eventData: any) => {
      const token = getToken();
      const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
  
    updateEvent: async (eventId: string, eventData: any) => {
      const token = getToken();
      const response = await axios.put(`${API_BASE_URL}/events/${eventId}`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
  
    deleteEvent: async (eventId: string) => {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };
