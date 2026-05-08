import yahooFinance from 'yahoo-finance2';
import { periodToDateRange } from '../utils/dateUtils.js';

export async function fetchStockHistory(ticker, period) {
  const { startDate, endDate } = periodToDateRange(period);

  const result = await yahooFinance.historical(ticker, {
    period1: startDate,
    period2: endDate,
    interval: period === '1w' ? '1d' : '1d',
  });

  return result.map(row => ({
    date: row.date.toISOString().split('T')[0],
    open: row.open,
    high: row.high,
    low: row.low,
    close: row.close,
    volume: row.volume,
  }));
}
