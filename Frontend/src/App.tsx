/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './Pages/Header';
import HomePage from './Pages/HomePage';
import AuthPage from './Pages/AuthPage';
import RegPage from './Pages/RegPage';
import EventsPage from './Pages/EventsPage';
import NotFoundPage from './Pages/NotFoundPage';

function App() {

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await fetch('http://localhost:3000'); 

        if (response.ok) {
          console.log('✅ Подключение к бэкенду успешно установлено!');
        } else {
          console.error('❌ Ошибка подключения к бэкенду. Статус:', response.status);
          
        }
      } catch (error) {
        console.error('❌ Ошибка при попытке подключения к бэкенду:', error);
      }
    };

    testBackendConnection();
  }, []); // Пустой массив зависимостей означает, что useEffect выполнится только один раз при монтировании компонента

  // Пример состояния авторизации (для макета)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Изначально не авторизован

  return (
    <Router>
      <div>
        <Header isAuthenticated={isAuthenticated} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reg" element={<RegPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
