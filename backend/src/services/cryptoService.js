import axios from 'axios';
import { periodToDays } from '../utils/dateUtils.js';
import { generateMockHistory } from '../utils/mockData.js';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const USE_MOCK = process.env.USE_MOCK === 'true';

export async function fetchCryptoHistory(coinId, period) {
  if (USE_MOCK) return generateMockHistory(coinId, period);

  const days = periodToDays(period);
  const headers = {};
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  }

  const { data } = await axios.get(`${COINGECKO_BASE}/coins/${coinId}/market_chart`, {
    params: { vs_currency: 'usd', days, interval: days <= 7 ? 'hourly' : 'daily' },
    headers,
    timeout: 8000,
  });

  return data.prices.map(([timestamp, price]) => ({
    date:   new Date(timestamp).toISOString().split('T')[0],
    close:  price,
    open:   price,
    high:   price,
    low:    price,
    volume: 0,
  }));
}
