// src/components/LoginPage.tsx (или src/pages/LoginPage.tsx, в зависимости от структуры)

import React, { useEffect, useState } from 'react';
import { login } from '../Api/authService';
import { useNavigate } from 'react-router-dom';
import { getToken, saveToken } from '../utils/localStorageUtils'; // Импортируем setToken
import styles from './Styles/Auth.module.css';

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Добавляем состояние isAuthenticated

  useEffect(() => {
    const token = getToken(); // Получаем токен из localStorage
    if (token) {
      setIsAuthenticated(true); // Устанавливаем isAuthenticated в true, если токен есть
      navigate('/events');
    } else {
      setIsAuthenticated(false); // Устанавливаем isAuthenticated в false, если токена нет
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const token = await login({ name, email, password });
      if (token) {
        saveToken(token); // Сохраняем токен в localStorage после успешного логина
        setIsAuthenticated(true); // Обновляем состояние isAuthenticated после успешного логина
        console.log('Успешный логин, токен:', token);
        navigate('/events');
        window.location.reload();
      } else {
        setError('Произошла ошибка при логине. Пожалуйста, попробуйте еще раз.');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (loginError: any) {
      console.error('Ошибка логина:', loginError);
      setError('Неверные имя пользователя или пароль');
    }
  };

  // Пример условного рендера, зависящего от isAuthenticated.
  // В реальном приложении это будет влиять на отображение "других полей" в других компонентах.
  if (isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h2>Вы успешно авторизованы!</h2>
          <p>Перенаправляем на страницу мероприятий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>Страница входа</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={styles.label}>Имя:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div>
            <label htmlFor="password" className={styles.label}>Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

