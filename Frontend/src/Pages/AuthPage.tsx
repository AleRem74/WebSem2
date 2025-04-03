// src/components/LoginPage.tsx (или src/pages/LoginPage.tsx, в зависимости от структуры)

import React, { useEffect, useState } from 'react';
import { login } from '../Api/authService'; // Импортируем функцию login
import { useNavigate } from 'react-router-dom'; 
import { getToken } from '../utils/localStorageUtils';

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Состояние для хранения ошибки
  const navigate = useNavigate(); // Хук для навигации

  useEffect(() => {
    const token = getToken; // Проверяем наличие токена в localStorage
    if (token()) {
        // Если токен есть, значит пользователь уже авторизован
        navigate('/events'); // Перенаправляем на страницу мероприятий
    }
    // Если токена нет, ничего не делаем, пользователь остается на странице авторизации
}, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы
    setError(''); // Сбрасываем ошибку при новой попытке логина

    try {
      const token = await login({ name, email, password }); // Вызываем функцию login из authService
      if (token) {
        // Успешный логин, перенаправляем пользователя на страницу мероприятий
        console.log('Успешный логин, токен:', token);
        navigate('/events'); // Перенаправляем на мероприятия
      } else {
        // login вернул null, значит произошла ошибка 
        setError('Произошла ошибка при логине. Пожалуйста, попробуйте еще раз.');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (loginError: any) { // Ловим ошибку, выброшенную из login
      console.error('Ошибка логина:', loginError);
      setError('Неверные имя пользователя или пароль'); 
    }
  };

  return (
    <div>
      <h2>Страница входа</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>} {}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Имя:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;
