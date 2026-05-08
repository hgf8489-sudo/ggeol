import axios from 'axios';
import { searchStocks } from './stockService.js';
import { MOCK_SEARCH_RESULTS } from '../utils/mockData.js';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
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
    results.push(...await safeSearch(() => searchStocks(query)));
  }
  if (type === 'all' || type === 'crypto') {
    results.push(...await safeSearch(() => searchCrypto(query)));
  }
  return results;
}

async function searchCrypto(query) {
  const headers = {};
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  }
  const { data } = await axios.get(`${COINGECKO_BASE}/search`, {
    params: { query },
    headers,
    timeout: 5000,
  });
  return (data.coins ?? []).slice(0, 5).map(c => ({
    ticker: c.id,
    name:   c.name,
    symbol: c.symbol?.toUpperCase(),
    type:   'crypto',
    thumb:  c.thumb,
  }));
}

async function safeSearch(fn) {
  try { return await fn(); } catch { return []; }
}
