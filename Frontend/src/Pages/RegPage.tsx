import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../Api/regService'; // Импортируем функцию для регистрации
import styles from './Styles/Auth.module.css'

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
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setError((error instanceof Error) ? error.message : 'Произошла ошибка. Попробуйте снова позже.');
      setSuccessMessage('');
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.loginBox}>
            <h1>Регистрация</h1>
            {error && <div className={`${styles.errorMessage}`}>{error}</div>}
            {successMessage && <div className={`${styles.successMessage}`}>{successMessage}</div>}
            <form onSubmit={handleRegistration}>
                <div>
                    <label htmlFor="login" className={styles.label}>Логин:</label>
                    <input
                        type="text"
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
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
                <div>
                    <label htmlFor="confirmPassword" className={styles.label}>Подтвердите пароль:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Уже зарегистрированы? <Link to="/auth">Авторизация</Link>
            </p>
        </div>
    </div>
  );
};

export default RegPage;