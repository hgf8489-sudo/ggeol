import { Router } from 'express';
import { analyzePeriod } from '../services/analysisService.js';

const router = Router();

// GET /api/analysis?ticker=AAPL&period=1w|1m|3m|6m|1y&type=stock|crypto
router.get('/', async (req, res, next) => {
  try {
    const { ticker, period, type = 'stock' } = req.query;

    if (!ticker) return res.status(400).json({ error: '종목을 선택해 주세요.' });
    if (!['1w', '1m', '3m', '6m', '1y'].includes(period)) {
      return res.status(400).json({ error: '유효하지 않은 기간입니다.' });
    }

    const result = await analyzePeriod(ticker, period, type);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
