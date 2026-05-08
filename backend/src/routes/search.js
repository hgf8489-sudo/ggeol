import { Router } from 'express';
import { searchTickers } from '../services/searchService.js';

const router = Router();

// GET /api/search?q=apple&type=stock|crypto|all
router.get('/', async (req, res, next) => {
  try {
    const { q, type = 'all' } = req.query;
    if (!q || q.trim().length < 1) {
      return res.status(400).json({ error: '검색어를 입력해 주세요.' });
    }
    const results = await searchTickers(q.trim(), type);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

export default router;
