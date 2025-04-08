import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { clearToken, getToken } from '../utils/localStorageUtils';
import styles from './Styles/Header.module.css';
//import { useAuth } from '../Api/authContext'; 

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  const [token, setToken] = useState(getToken()); // Получаем токен из локального хранилища
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const currentToken = getToken(); // Получаем текущий токен из localStorage

    if (currentToken !== token) { // Проверяем, изменился ли токен с момента последнего рендера
      setToken(currentToken); // Обновляем состояние токена, если он изменился
    }

    if (currentToken) {
      try {
        const decodedToken: { username?: string } = jwtDecode(currentToken);
        setUserName(decodedToken.username || 'Пользователь');
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  }, [token]);

  const handleLogout = () => {
    clearToken(); // Удаляем токен
    setToken(null); // Обновляем состояние токена
  };

  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.nav}>
          {/* Левая часть навигации */}
          <div className={styles.leftNav}>
            <li className={styles.navItem}>
              <Link to="/" className={styles.navLink}>
                Главная
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/events" className={styles.navLink}>
                Мероприятия
              </Link>
            </li>
          </div>
  
          {/* Правая часть навигации */}
          <div className={styles.rightNav}>
            {!token ? (
              <>
                <li className={styles.navItem}>
                  <Link to="/auth" className={styles.navLink}>
                    Войти
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/reg" className={styles.navLink}>
                    Регистрация
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className={styles.navItem}>
                  <span className={styles.navLink}>
                    Вы авторизованы как {userName}
                  </span>
                </li>
                <li className={styles.navItem}>
                  <button onClick={handleLogout} className={styles.navLink}>
                    Выйти
                  </button>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
