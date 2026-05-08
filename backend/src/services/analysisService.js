import { fetchStockHistory } from './stockService.js';
import { fetchCryptoHistory } from './cryptoService.js';
import { findOptimalPoints } from '../utils/optimizer.js';

export async function analyzePeriod(ticker, period, type) {
  const priceHistory = type === 'crypto'
    ? await fetchCryptoHistory(ticker, period)
    : await fetchStockHistory(ticker, period);

  if (!priceHistory || priceHistory.length < 2) {
    throw Object.assign(new Error('데이터가 부족합니다.'), { status: 404 });
  }

  const { buyPoint, sellPoint, maxProfit, maxProfitPct } = findOptimalPoints(priceHistory);

  return {
    ticker,
    period,
    type,
    priceHistory,
    buyPoint,
    sellPoint,
    maxProfit,
    maxProfitPct,
    summary: buildSummary(maxProfitPct),
  };
}

function buildSummary(pct) {
  if (pct >= 100) return `그때 샀다면 두 배 넘게 먹었을 텐데... 껄껄껄 😭`;
  if (pct >= 50) return `${pct.toFixed(1)}% 수익. 인생이 바뀔 수도 있었는데. 껄껄껄`;
  if (pct >= 20) return `${pct.toFixed(1)}% 수익 기회를 날렸습니다. 껄껄`;
  if (pct >= 5) return `${pct.toFixed(1)}% 소소한 기회... 그래도 했어야 했어. 껄`;
  return `${pct.toFixed(1)}% 수익. 뭐, 이 정도면 괜찮... 아니 아쉽다.`;
}
