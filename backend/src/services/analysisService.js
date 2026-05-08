import { fetchStockHistory } from './stockService.js';
import { fetchCryptoHistory } from './cryptoService.js';
import { findMaxProfit } from '../utils/optimizer.js';
import { buildRegretMessage, getComparisons } from '../utils/comparisons.js';
import { analysisCache } from '../utils/cache.js';

// Default investment amount (KRW) used when caller doesn't specify
const DEFAULT_AMOUNT_KRW = 1_000_000;

/**
 * @param {string} ticker
 * @param {string} period   1w | 1m | 3m | 6m | 1y
 * @param {string} type     stock | crypto
 * @param {number} amountKrw  investment amount in KRW
 */
export async function analyzePeriod(ticker, period, type, amountKrw = DEFAULT_AMOUNT_KRW) {
  const cacheKey = `${type}:${ticker}:${period}`;
  const cached = analysisCache.get(cacheKey);
  if (cached) {
    // Re-compute amount-dependent fields (comparisons change per request)
    return withAmountFields(cached, amountKrw);
  }

  const priceHistory = type === 'crypto'
    ? await fetchCryptoHistory(ticker, period)
    : await fetchStockHistory(ticker, period);

  if (!priceHistory || priceHistory.length < 2) {
    const err = new Error('데이터가 부족합니다.');
    err.status = 404;
    throw err;
  }

  const result = findMaxProfit(priceHistory);
  if (!result) {
    const err = new Error('수익 구간을 계산할 수 없습니다.');
    err.status = 422;
    throw err;
  }

  const base = {
    ticker,
    period,
    type,
    priceHistory,
    buyPoint: result.buyPoint,
    sellPoint: result.sellPoint,
    profitPct: result.profitPct,
    profitPerUnit: result.profitPerUnit,
    isProfitable: result.isProfitable,
  };

  // Cache the price-history part (amount-independent)
  analysisCache.set(cacheKey, base);

  return withAmountFields(base, amountKrw);
}

function withAmountFields(base, amountKrw) {
  const units = amountKrw / base.buyPoint.close;   // how many units you could've bought
  const profitKrw = Math.round(units * base.profitPerUnit);

  return {
    ...base,
    investAmount: amountKrw,
    profitKrw,
    comparisons: getComparisons(profitKrw, 2),
    regretMessage: buildRegretMessage(profitKrw, base.profitPct),
  };
}
