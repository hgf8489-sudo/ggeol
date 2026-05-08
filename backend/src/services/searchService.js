import yahooFinance from 'yahoo-finance2';
import axios from 'axios';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export async function searchTickers(query, type) {
  const results = [];

  if (type === 'all' || type === 'stock') {
    const stockResults = await searchStocks(query);
    results.push(...stockResults);
  }

  if (type === 'all' || type === 'crypto') {
    const cryptoResults = await searchCrypto(query);
    results.push(...cryptoResults);
  }

  return results;
}

async function searchStocks(query) {
  try {
    const data = await yahooFinance.search(query, { newsCount: 0 });
    return (data.quotes || [])
      .filter(q => q.symbol && q.shortname)
      .slice(0, 8)
      .map(q => ({
        ticker: q.symbol,
        name: q.shortname || q.longname,
        type: 'stock',
        exchange: q.exchange,
      }));
  } catch {
    return [];
  }
}

async function searchCrypto(query) {
  try {
    const headers = {};
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }

    const { data } = await axios.get(`${COINGECKO_BASE}/search`, {
      params: { query },
      headers,
      timeout: 5000,
    });

    return (data.coins || [])
      .slice(0, 5)
      .map(c => ({
        ticker: c.id,
        name: c.name,
        symbol: c.symbol?.toUpperCase(),
        type: 'crypto',
        thumb: c.thumb,
      }));
  } catch {
    return [];
  }
}
