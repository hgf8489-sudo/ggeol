import { searchStocks } from './stockService.js';
import { searchUpbitMarkets } from './upbitService.js';
import { MOCK_SEARCH_RESULTS } from '../utils/mockData.js';

const USE_MOCK = process.env.USE_MOCK === 'true';

export async function searchTickers(query, type) {
  if (USE_MOCK) {
    const q = query.toLowerCase();
    return MOCK_SEARCH_RESULTS.filter(
      r => (type === 'all' || r.type === type) &&
           (r.name.toLowerCase().includes(q) || r.ticker.toLowerCase().includes(q))
    );
  }

  const results = [];

  if (type === 'all' || type === 'stock') {
    results.push(...await safe(() => searchStocks(query)));
  }

  if (type === 'all' || type === 'crypto') {
    // Upbit: Korean exchange, KRW-denominated
    results.push(...await safe(() => searchUpbitMarkets(query)));
  }

  return results;
}

async function safe(fn) {
  try { return await fn(); } catch { return []; }
}
