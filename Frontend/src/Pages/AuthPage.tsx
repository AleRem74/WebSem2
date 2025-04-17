import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks'; // хуки с типизацией
import { login, setEmail, setPassword } from '../app/authSlice';
import styles from './Styles/Auth.module.css';

const LoginPage: React.FC = () => {
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { email, password, isAuthenticated, loading, error } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/events');
      window.location.reload();
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

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
          <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => dispatch(setEmail(e.target.value))}
              required
              className={styles.inputField}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className={styles.label}>Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => dispatch(setPassword(e.target.value))}
              required
              className={styles.inputField}
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Вход...' : 'Войти'}</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
