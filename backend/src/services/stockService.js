import axios from 'axios';
import { periodToRange } from '../utils/dateUtils.js';
import { generateMockHistory } from '../utils/mockData.js';

const YF_BASE = 'https://query1.finance.yahoo.com';
const USE_MOCK = process.env.USE_MOCK === 'true';

const INTERVAL_MAP = {
  '1w': '1h',
  '1m': '1d',
  '3m': '1d',
  '6m': '1d',
  '1y': '1wk',
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; GgeolBot/1.0)',
};

export async function fetchStockHistory(ticker, period) {
  if (USE_MOCK) return generateMockHistory(ticker, period);

  const range    = periodToRange(period);
  const interval = INTERVAL_MAP[period] ?? '1d';

  const { data } = await withRetry(() =>
    axios.get(`${YF_BASE}/v8/finance/chart/${encodeURIComponent(ticker)}`, {
      params: { range, interval, includeAdjustedClose: true },
      headers: HEADERS,
      timeout: 10000,
    })
  );

  const result = data?.chart?.result?.[0];
  if (!result) {
    const err = new Error(`'${ticker}' 데이터를 찾을 수 없습니다.`);
    err.status = 404;
    throw err;
  }

  const timestamps = result.timestamp ?? [];
  const q          = result.indicators?.quote?.[0] ?? {};

  return timestamps
    .map((ts, i) => ({
      date:   new Date(ts * 1000).toISOString().split('T')[0],
      open:   round(q.open?.[i]),
      high:   round(q.high?.[i]),
      low:    round(q.low?.[i]),
      close:  round(q.close?.[i]),
      volume: q.volume?.[i] ?? 0,
    }))
    .filter(row => row.close != null);
}

export async function searchStocks(query) {
  if (USE_MOCK) {
    const { MOCK_SEARCH_RESULTS } = await import('../utils/mockData.js');
    const q = query.toLowerCase();
    return MOCK_SEARCH_RESULTS.filter(
      r => r.type === 'stock' &&
           (r.name.toLowerCase().includes(q) || r.ticker.toLowerCase().includes(q))
    );
  }

  const { data } = await withRetry(() =>
    axios.get(`${YF_BASE}/v1/finance/search`, {
      params: { q: query, quotesCount: 8, newsCount: 0, enableFuzzyQuery: false },
      headers: HEADERS,
      timeout: 6000,
    })
  );

  return (data?.quotes ?? data?.finance?.result?.[0]?.quotes ?? [])
    .filter(q => q.symbol && (q.shortname || q.longname))
    .slice(0, 8)
    .map(q => ({
      ticker:   q.symbol,
      name:     q.shortname || q.longname,
      type:     'stock',
      exchange: q.exchange,
    }));
}

async function withRetry(fn, attempts = 3, delayMs = 600) {
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === attempts - 1) throw err;
      await sleep(delayMs * 2 ** i);
    }
  }
}

const round = (n) => (n != null ? Math.round(n * 100) / 100 : null);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
