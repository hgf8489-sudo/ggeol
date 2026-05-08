import yahooFinance from 'yahoo-finance2';
import { periodToDateRange } from '../utils/dateUtils.js';

// Suppress yahoo-finance2 validation warnings in production
yahooFinance.setGlobalConfig({ validation: { logErrors: false } });

const INTERVAL_MAP = {
  '1w': '1h',   // hourly for 1-week gives more data points
  '1m': '1d',
  '3m': '1d',
  '6m': '1d',
  '1y': '1wk',
};

export async function fetchStockHistory(ticker, period) {
  const { startDate, endDate } = periodToDateRange(period);
  const interval = INTERVAL_MAP[period] ?? '1d';

  const raw = await withRetry(() =>
    yahooFinance.historical(ticker, {
      period1: startDate,
      period2: endDate,
      interval,
    })
  );

  if (!raw || raw.length === 0) {
    const err = new Error(`'${ticker}' 데이터를 찾을 수 없습니다.`);
    err.status = 404;
    throw err;
  }

  return raw
    .filter(row => row.close != null)
    .map(row => ({
      date: row.date.toISOString().split('T')[0],
      open: round(row.open),
      high: round(row.high),
      low: round(row.low),
      close: round(row.close),
      volume: row.volume ?? 0,
    }));
}

// Exponential backoff retry (max 3 attempts)
async function withRetry(fn, attempts = 3, delayMs = 500) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await sleep(delayMs * 2 ** i);
    }
  }
}

const round = (n) => (n != null ? Math.round(n * 100) / 100 : null);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
