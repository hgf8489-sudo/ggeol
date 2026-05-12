import { searchStocks } from './stockService.js';
import { searchUpbitMarkets } from './upbitService.js';
import { searchNaverStocks, hasKorean } from './naverService.js';
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
  const isKorean = hasKorean(query);

  if (type === 'all' || type === 'stock') {
    if (isKorean) {
      // 한글 쿼리는 네이버 금융으로 검색
      results.push(...await safe(() => searchNaverStocks(query)));
    } else {
      results.push(...await safe(() => searchStocks(query)));
    }
  }

  if (type === 'all' || type === 'crypto') {
    results.push(...await safe(() => searchUpbitMarkets(query)));
  }

  return results;
}

async function safe(fn) {
  try { return await fn(); } catch { return []; }
}
