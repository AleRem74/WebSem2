// 1. Импорт необходимых модулей
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, authenticateDB, checkFieldSynchronization } = require('./config/db');
const { DataTypes, Model, Op } = require('sequelize'); // Добавляем DataTypes и Model из Sequelize

// Загрузка переменных окружения из файла .env
dotenv.config();
const port = process.env.PORT || 3000; // Порт из .env или 3000 по умолчанию
// 2. Создание объекта приложения Express
const app = express();

// 2.2 Настройка middleware
// Middleware для обработки JSON-запросов
app.use(express.json());
// Middleware для разрешения CORS
app.use(cors());

// Определение моделей Sequelize на основе структуры базы данных
// Модель User
class User extends Model {}
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    createdat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Указываем имя таблицы явно, если оно отличается от имени модели во множественном числе
    timestamps: false, // Отключаем автоматическое добавление полей createdAt и updatedAt
});

// Модель Event
class Event extends Model {}
Event.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdby: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Ссылка на модель User
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Event',
    tableName: 'events', // Указываем имя таблицы явно
    timestamps: false,
});

// Определение ассоциации между моделями (внешний ключ)
Event.belongsTo(User, { foreignKey: 'createdby', as: 'creator' }); // Событие принадлежит пользователю, поле внешнего ключа 'createdby'


// 2.4 Тестовый маршрут GET /
app.get('/', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

// --- API для пользователей ---

// 1. Создание нового пользователя (POST /users)
app.post('/users', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Поля "name" и "email" обязательны для заполнения.' });
    }

    try {
        const newUser = await User.create({ name, email });
        res.status(201).json(newUser); // 201 Created - успешно создан
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует.' });
        }
        console.error('Ошибка при создании пользователя:', error);
        res.status(500).json({ error: 'Не удалось создать пользователя.', details: error.message });
    }
});

// 2. Получение списка пользователей (GET /users)
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
        res.status(500).json({ error: 'Не удалось получить список пользователей.', details: error.message });
    }
});


// --- API для мероприятий ---

// 1. Получение списка всех мероприятий (GET /events)
app.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll({            include: [{
          model: User,
          as: 'creator', // Используем алиас, который указали в ассоциации
          attributes: ['id', 'name', 'email'] // Выбираем, какие поля пользователя включить
      }]
  });
  res.status(200).json(events);
} catch (error) {
  console.error('Ошибка при получении списка мероприятий:', error);
  res.status(500).json({ error: 'Не удалось получить список мероприятий.', details: error.message });
}
});

// 2. Получение одного мероприятия по ID (GET /events/:id)
app.get('/events/search', async (req, res) => {
  const title = req.query.title; // Получаем параметр title
  const description = req.query.description; // Получаем параметр description

  // Логика для обработки поиска и фильтрации мероприятий
  try {
      const events = await Event.findAll({
          where: {
              // Пример фильтрации по параметрам
              ...(title && { title: { [Op.iLike]: `%${title}%` } }),
              ...(description && { description: { [Op.iLike]:  `%${description}%`}})
          }
      });
      res.status(200).json(events);
  } catch (error) {
      console.error('Ошибка при получении мероприятий:', error);
      res.status(500).json({ error: 'Не удалось получить мероприятия.', details: error.message });
  }
});


// 3. Создание мероприятия (POST /events)
app.post('/events', async (req, res) => {
const { title, description, date, createdby } = req.body;

if (!title || !date || !createdby) {
  return res.status(400).json({ error: 'Поля "title", "date" и "createdby" обязательны для заполнения.' });
}

try {
  const newEvent = await Event.create({ title, description, date, createdby });
  res.status(201).json(newEvent);
} catch (error) {
  if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Не удалось создать мероприятие. Указанный ID пользователя (createdby) не существует.' });
  }
  console.error('Ошибка при создании мероприятия:', error);
  res.status(500).json({ error: 'Не удалось создать мероприятие.', details: error.message });
}
});

// 4. Обновление мероприятия (PUT /events/:id)
app.put('/events/:id', async (req, res) => {
const eventId = req.params.id;
const { title, description, date, createdby } = req.body;

if (!title || !date || !createdby) { // Решил оставить обязательными поля при обновлении, можно изменить логику
  return res.status(400).json({ error: 'Поля "title", "date" и "createdby" обязательны для обновления.' });
}

try {
  const event = await Event.findByPk(eventId);
  if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено.' });
  }

  await event.update({ title, description, date, createdby });
  const updatedEvent = await Event.findByPk(eventId, { // Получаем обновленную версию для ответа
      include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
      }]
  });
  res.status(200).json(updatedEvent);
} catch (error) {
  if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Не удалось обновить мероприятие. Указанный ID пользователя (createdby) не существует.' });
  }
  console.error('Ошибка при обновлении мероприятия:', error);
  res.status(500).json({ error: 'Не удалось обновить мероприятие.', details: error.message });
}
});

// 5. Удаление мероприятия (DELETE /events/:id)
app.delete('/events/:id', async (req, res) => {
const eventId = req.params.id;
try {
  const event = await Event.findByPk(eventId);
  if (!event) {            return res.status(404).json({ error: 'Мероприятие не найдено.' });
}

await event.destroy();
res.status(200).json({ message: 'Мероприятие успешно удалено.' });
} catch (error) {
console.error('Ошибка при удалении мероприятия:', error);
res.status(500).json({ error: 'Не удалось удалить мероприятие.', details: error.message });
}
});


// Проверка подключения к базе данных при запуске сервера
async function startServer() {
await authenticateDB(); // Вызываем функцию проверки подключения
await sequelize.sync(); // Синхронизация моделей с базой данных (создание таблиц, если их нет)
const expectedUserFields = ['id', 'name', 'email', 'createdat'];
await checkFieldSynchronization('users', expectedUserFields);
const expectedEventFields = ['id', 'title', 'description', 'date', 'createdby'];
await checkFieldSynchronization('events', expectedEventFields);
}

// Запуск сервера
app.listen(port, () => {
console.log(`Сервер запущен по адресу http://localhost:${port}`);
});

startServer();

