import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import shortLinkRoutes, { redirectRouter } from './routes/shortLinkRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API роуты (с префиксом /api)
app.use('/api', shortLinkRoutes);

// Редирект роуты (без префикса, в самом конце!)
app.use('/', redirectRouter);

// Тестовый роут
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend работает!' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});