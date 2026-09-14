import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import shortLinkRoutes, { redirectRouter } from './routes/shortLinkRoutes';
import { requestLogger } from './middlewares/requestLogger';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api', shortLinkRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend работает!' });
});

app.use('/', redirectRouter);

export default app;
