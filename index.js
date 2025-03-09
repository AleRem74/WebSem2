const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const {sequelize } = require('./config/db');
const errorHandler = require('./src/middlewares/error-handler');
const userRoutes = require('./src/routes/userRouter');
const eventRoutes = require('./src/routes/eventRouter');
const swaggerSpec = require('./Swagger');

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/api-docx', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

async function startServer() {
    await sequelize.sync();
    console.log("Все проверки успешны");
}

app.listen(port, () => {
    console.log(`Сервер запущен по адресу http://localhost:${port}`);
});

startServer();