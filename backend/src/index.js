import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import searchRouter from './routes/search.js';
import analysisRouter from './routes/analysis.js';
import { errorHandler } from './middleware/errorHandler.js';
import { analysisCache, searchCache } from './utils/cache.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api/search', searchRouter);
app.use('/api/analysis', analysisRouter);

app.get('/health', (_, res) => res.json({
  status: 'ok',
  service: 'ggeol-backend',
  cache: { analysis: analysisCache.size, search: searchCache.size },
}));

// Purge expired cache entries every 10 minutes
setInterval(() => {
  analysisCache.purgeExpired();
  searchCache.purgeExpired();
}, 10 * 60 * 1000);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`껄껄껄 Backend running on http://localhost:${PORT}`);
});
