import { Router } from 'express';
import { searchTickers } from '../services/searchService.js';
import { searchCache } from '../utils/cache.js';

const router = Router();

// GET /api/search?q=apple&type=stock|crypto|all
router.get('/', async (req, res, next) => {
  try {
    const { q, type = 'all' } = req.query;
    if (!q || q.trim().length < 1) {
      return res.status(400).json({ error: '검색어를 입력해 주세요.' });
    }

    const cacheKey = `${type}:${q.trim().toLowerCase()}`;
    const cached = searchCache.get(cacheKey);
    if (cached) return res.json(cached);

    const results = await searchTickers(q.trim(), type);
    searchCache.set(cacheKey, results);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

export default router;
