import { Router } from 'express';
import { analyzePeriod } from '../services/analysisService.js';

const router = Router();

const VALID_PERIODS = ['1w', '1m', '3m', '6m', '1y'];
const MAX_AMOUNT = 10_000_000_000; // 100억 상한

// GET /api/analysis?ticker=AAPL&period=1m&type=stock&amount=10000000
router.get('/', async (req, res, next) => {
  try {
    const { ticker, period, type = 'stock', amount } = req.query;

    if (!ticker) {
      return res.status(400).json({ error: '종목을 선택해 주세요.' });
    }
    if (!VALID_PERIODS.includes(period)) {
      return res.status(400).json({ error: '기간은 1w, 1m, 3m, 6m, 1y 중 하나여야 합니다.' });
    }

    const amountKrw = amount
      ? Math.min(Math.max(parseInt(amount, 10) || 1_000_000, 1), MAX_AMOUNT)
      : 1_000_000;

    const result = await analyzePeriod(ticker, period, type, amountKrw);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
