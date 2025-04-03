import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>404 - Страница не найдена</h1>
      <p> Запрашиваемая страница не существует.</p>
      {}
      <p>Вернуться на <a href="/">главную страницу</a></p>
    </div>
  );
};

export default NotFoundPage;
