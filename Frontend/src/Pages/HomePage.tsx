import React from 'react';
import styles from './Styles/HomePage.module.css'; // Импортируем CSS-модуль

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.welcomeText}>Добро пожаловать на главную страницу нашего сайта!</h1>
    </div>
  );
};

export default HomePage;
