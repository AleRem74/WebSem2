import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../Api/regService'; // Импортируем функцию для регистрации

const RegPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegistration = async (event: React.FormEvent) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Валидация на стороне клиента
    if (!login || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля.');
      setSuccessMessage('');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      setSuccessMessage('');
      return;
    }

    if (password.length < 3) {
      setError('Пароль должен быть не менее 3 символов.');
      setSuccessMessage('');
      return;
    }

    try {
      // Отправляем данные на сервер
      await registerUser({ name: login, email, password }); // Используем функцию из authService
      setSuccessMessage('Регистрация прошла успешно!');
      setError('');
      
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setError((error instanceof Error) ? error.message : 'Произошла ошибка. Попробуйте снова позже.');
      setSuccessMessage('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Регистрация</h1>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
      <form onSubmit={handleRegistration}>
        <div>
          <label htmlFor="login">Логин:</label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="confirmPassword">Подтвердите пароль:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <button type="submit" style={{ marginTop: '20px' }}>Зарегистрироваться</button>
      </form>
      <p style={{ marginTop: '20px' }}>
        Уже зарегистрированы? <Link to="/auth">Авторизация</Link>
      </p>
    </div>
  );
};

export default RegPage;