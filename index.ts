import express, {RequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import { sequelize } from './config/db';
import { passport } from './config/passport';
import errorHandler from './src/middlewares/error-handler';
import userRoutes from './src/routes/userRouter';
import eventRoutes from './src/routes/eventRouter';
import authRoutes from './src/routes/auth';
import swaggerSpec from './Swagger';

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev') as RequestHandler);
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);
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