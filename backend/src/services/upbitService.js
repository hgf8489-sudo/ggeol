import axios from 'axios';
import { periodToDays } from '../utils/dateUtils.js';

const UPBIT_BASE = 'https://api.upbit.com/v1';

// Upbit rate limit: 600 req/min for public endpoints
const client = axios.create({
  baseURL: UPBIT_BASE,
  timeout: 8000,
  headers: { Accept: 'application/json' },
});

/**
 * Fetch OHLCV candle history from Upbit.
 * Returns KRW-denominated prices.
 *
 * @param {string} coinId  e.g. "BTC", "ETH", "SOL"
 * @param {string} period  '1w' | '1m' | '3m' | '6m' | '1y'
 */
export async function fetchUpbitHistory(coinId, period) {
  const market = toMarket(coinId);
  const days   = periodToDays(period);

  // Upbit candles/days returns up to 200 records per request
  // For 1y we need 365 days → fetch in two batches
  const candles = await fetchCandles(market, days);

  if (!candles.length) {
    const err = new Error(`업비트에서 '${coinId}' 데이터를 찾을 수 없습니다.`);
    err.status = 404;
    throw err;
  }

  // Upbit returns newest-first → reverse to oldest-first
  return candles.reverse().map(c => ({
    date:   c.candle_date_time_kst.split('T')[0],
    open:   c.opening_price,
    high:   c.high_price,
    low:    c.low_price,
    close:  c.trade_price,
    volume: Math.round(c.candle_acc_trade_volume),
  }));
}

/**
 * Search Upbit markets by query string.
 * Returns coins whose Korean name, English name, or symbol matches.
 */
export async function searchUpbitMarkets(query) {
  const { data } = await client.get('/market/all', {
    params: { isDetails: true },
  });

  const q = query.toLowerCase();

  return data
    .filter(m =>
      m.market.startsWith('KRW-') &&
      (m.market.toLowerCase().includes(q) ||
       m.korean_name?.includes(query) ||
       m.english_name?.toLowerCase().includes(q))
    )
    .slice(0, 6)
    .map(m => ({
      ticker: m.market.replace('KRW-', ''), // e.g. "BTC"
      market: m.market,                     // e.g. "KRW-BTC"
      name:   m.korean_name ?? m.english_name,
      symbol: m.market.replace('KRW-', ''),
      type:   'crypto',
      exchange: 'upbit',
    }));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function toMarket(coinId) {
  // Accept "BTC", "KRW-BTC", "bitcoin" (map common ids)
  const ALIAS = { bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL', ripple: 'XRP', dogecoin: 'DOGE' };
  const symbol = ALIAS[coinId.toLowerCase()] ?? coinId.toUpperCase();
  return symbol.startsWith('KRW-') ? symbol : `KRW-${symbol}`;
}

async function fetchCandles(market, days) {
  const PER_PAGE = 200;
  const pages    = Math.ceil(days / PER_PAGE);
  const all      = [];

  let to; // undefined = latest
  for (let i = 0; i < pages; i++) {
    const params = { market, count: Math.min(PER_PAGE, days - all.length) };
    if (to) params.to = to;

    const { data } = await client.get('/candles/days', { params });
    if (!data.length) break;

    all.push(...data);
    // next page starts before the oldest candle in current batch
    to = data[data.length - 1].candle_date_time_utc;
  }

  return all;
}
