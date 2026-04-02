import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimit.js'
const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.use(routes);

app.use((_, res) =>
  res.status(404).json({ success: false, error: 'Route not found' })
);


export default app;