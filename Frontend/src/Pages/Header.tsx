import React from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import { getToken } from '../utils/localStorageUtils';

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  const token = getToken(); // Получаем токен из локального хранилища

  let userName: string | null = null;

  if (token) {
    try {
      // Декодируем токен и извлекаем имя пользователя
      const decodedToken: { username?: string } = jwtDecode(token);
      console.log('Тебя зовут в этом токене как: ' + decodedToken.username)
      userName = decodedToken.username || 'Пользователь'; // Если имени нет, отображаем "Пользователь"
    } catch (error) {
      console.error('Ошибка при декодировании токена:', error);
      userName = null;
    }
  }

  return (
    <header
      style={{
        padding: '20px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: 'black',
          fontWeight: 'bold',
          fontSize: '1.2em',
        }}
      >
        Логотип
      </Link>
      <nav>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <li style={{ marginLeft: '20px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
              Главная
            </Link>
          </li>
          <li style={{ marginLeft: '20px' }}>
            <Link to="/events" style={{ textDecoration: 'none', color: 'black' }}>
              Мероприятия
            </Link>
          </li>
          {!token ? (
            <>
              <li style={{ marginLeft: '20px' }}>
                <Link to="/auth" style={{ textDecoration: 'none', color: 'black' }}>
                  Войти
                </Link>
              </li>
              <li style={{ marginLeft: '20px' }}>
                <Link to="/reg" style={{ textDecoration: 'none', color: 'black' }}>
                  Регистрация
                </Link>
              </li>
            </>
          ) : (
            <li style={{ marginLeft: '20px' }}>
              <span>Вы авторизованы как {userName}</span> {}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
