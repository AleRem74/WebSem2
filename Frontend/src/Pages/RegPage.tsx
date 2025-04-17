import React, { useEffect } from 'react';
import { setLogin,setEmail,
    setPassword,
    setConfirmPassword,
    setError,
    registerUser,
    resetForm  } from '../app/regSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Styles/Auth.module.css' 

const RegPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const {
      login,
      email,
      password,
      confirmPassword,
      error,
      successMessage,
      isLoading
    } = useAppSelector(state => state.reg);
  
    useEffect(() => {
      // Очистка формы при размонтировании компонента
      return () => {
        dispatch(resetForm());
      };
    }, [dispatch]);
  
    useEffect(() => {
      // Перенаправление после успешной регистрации
      if (successMessage) {
        const timer = setTimeout(() => {
          navigate('/auth');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }, [successMessage, navigate]);
  
    const handleRegistration = async (event: React.FormEvent) => {
      event.preventDefault();
      
      if (!login || !email || !password || !confirmPassword) {
        dispatch(setError('Пожалуйста, заполните все поля.'));
        return;
      }
      
      if (password !== confirmPassword) {
        dispatch(setError('Пароли не совпадают.'));
        return;
      }
      
      if (password.length < 3) {
        dispatch(setError('Пароль должен быть не менее 3 символов.'));
        return;
      }
      
      dispatch(registerUser({ name: login, email, password }));
    };

    return (
        <div className={styles.container}>
          <div className={styles.loginBox}>
            <h1>Регистрация</h1>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            <form onSubmit={handleRegistration}>
              <div>
                <label htmlFor="login" className={styles.label}>Логин:</label>
                <input
                  type="text"
                  id="login"
                  value={login}
                  onChange={(e) => dispatch(setLogin(e.target.value))}
                  required
                  className={styles.inputField}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="email" className={styles.label}>Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                  required
                  className={styles.inputField}
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className={styles.label}>Подтвердите пароль:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
                  required
                  className={styles.inputField}
                  disabled={isLoading}
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
              </button>
            </form>
            <p style={{ marginTop: '20px' }}>
              Уже зарегистрированы? <Link to="/auth">Авторизация</Link>
            </p>
          </div>
        </div>
      );
    };

export default RegPage;


