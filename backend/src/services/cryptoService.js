import { fetchUpbitHistory } from './upbitService.js';
import { generateMockHistory } from '../utils/mockData.js';

const USE_MOCK = process.env.USE_MOCK === 'true';

/**
 * Fetch crypto price history.
 * Primary source: Upbit (KRW-based, Korean exchange).
 */
export async function fetchCryptoHistory(coinId, period) {
  if (USE_MOCK) return generateMockHistory(coinId, period);

  return fetchUpbitHistory(coinId, period);
}
