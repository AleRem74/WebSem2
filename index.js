// Импорт необходимых модулей
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, authenticateDB, checkFieldSynchronization } = require('./config/db');
const { DataTypes, Model, Op } = require('sequelize'); // Добавляем объекты из Sequelize
const swaggerJsdoc = require('swagger-jsdoc');  //Стандарты документации
const swaggerUi = require('swagger-ui-express');  //Визуализация
const morgan = require('morgan');


// Загрузка переменных окружения из файла .env
dotenv.config();
const port = process.env.PORT || 3000; // Порт из .env или 3000 по умолчанию
// Создание объекта приложения Express
const app = express();

// Настройка middleware
// Middleware для обработки JSON-запросов
app.use(express.json());
// Middleware для разрешения CORS
app.use(cors());
app.use(morgan('dev'));

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

app.use(morgan('dev')); // Включаем логирование Morgan

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API мероприятий',
      version: '1.0.0',
      description: 'Документация API для управления мероприятиями и пользователями',
    },
  },
  apis: ['./index.js'], // Путь к файлу с API endpoints и Swagger аннотациями
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docx', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//Тестовый маршрут 
app.get('/', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

// Кастомные ошибки
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
    console.error('Произошла ошибка:', err);

    if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ error: 'Произошла внутренняя ошибка сервера.', details: err.message });
});

//API для пользователей 
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создание нового пользователя
 *     description: Создает нового пользователя с указанными именем и email.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя.
 *                 example: "Иван Иванов"
 *               email:
 *                 type: string
 *                 description: Email пользователя.
 *                 example: "ivan@example.com"
 *     responses:
 *       201:
 *         description: Пользователь успешно создан.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Уникальный идентификатор пользователя.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Имя пользователя.
 *                   example: "Иван Иванов"
 *                 email:
 *                   type: string
 *                   description: Email пользователя.
 *                   example: "ivan@example.com"
 *       400:
 *         description: Ошибка валидации. Поля "name" и "email" обязательны для заполнения.
 *       409:
 *         description: Пользователь с таким email уже существует.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
//Создание нового пользователя (POST /users)
app.post('/users', async (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return next(new ValidationError('Поля "name" и "email" обязательны для заполнения.'));
    }

    try {
        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return next(new ValidationError('Пользователь с таким email уже существует.'));
        }
        next(error);
    }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей
 *     description: Возвращает список всех пользователей.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает массив пользователей.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID пользователя.
 *                   name:
 *                     type: string
 *                     description: Имя пользователя.
 *                   email:
 *                     type: string
 *                     description: Email пользователя.
 *                   
 *       500:
 *         description: Ошибка сервера.
 *         
 */

// Получение списка пользователей (GET /users)
app.get('/users', async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список мероприятий 
 *     description: Возвращает список всех мероприятий 
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает массив мероприятий.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID мероприятия.
 *                   title:
 *                     type: string
 *                     description: Название мероприятия.
 *                   description:
 *                     type: string
 *                     description: Описание мероприятия.
 *                   
 *       404:
 *         description: Мероприятия не найдены.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Мероприятия не найдены."
 *       500:
 *         description: Ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Не удалось получить мероприятия."
 *                 details:
 *                   type: string
 *                   example: "Ошибка"
 */
//API для мероприятий 
//Получение списка всех мероприятий (GET /events)
app.get('/events', async (req, res, next) => {
    try {
        const events = await Event.findAll({
            include: [{
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'email']
            }]
        });
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
});

//Получение одного мероприятия по поиску
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


// Создание мероприятия (POST /events)
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создание нового мероприятия
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - createdby
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название мероприятия
 *               description:
 *                 type: string
 *                 description: Описание мероприятия
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата и время мероприятия
 *               createdby:
 *                 type: integer
 *                 description: ID пользователя, создавшего мероприятие
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка валидации данных
 *       500:
 *         description: Ошибка сервера
 */
// Создание мероприятия (POST /events)
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

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновление информации о мероприятии
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия для обновления
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - createdby
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название мероприятия
 *               description:
 *                 type: string
 *                 description: Описание мероприятия
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата и время мероприятия
 *               createdby:
 *                 type: integer
 *                 description: ID пользователя, создавшего мероприятие
 *     responses:
 *       200:
 *         description: Мероприятие успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка валидации данных или неверный ID пользователя (createdby)
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
// Обновление мероприятия (PUT /events/:id)
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

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удаление мероприятия по ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия для удаления
 *     responses:
 *       200:
 *         description: Мероприятие успешно удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
// Удаление мероприятия (DELETE /events/:id)
app.delete('/events/:id', async (req, res, next) => {
    const eventId = req.params.id;
    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            return next(new NotFoundError('Мероприятие не найдено.'));
        }

        await event.destroy();
        res.status(200).json({ message: 'Мероприятие успешно удалено.' });
    } catch (error) {
        next(error);
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

