import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import shortLinkRoutes, { redirectRouter } from './routes/shortLinkRoutes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use('/api', shortLinkRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend работает!' });
});

app.use('/', redirectRouter);

export default app;
