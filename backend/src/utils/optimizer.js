/**
 * O(n) max-profit finder.
 * Constraint: buy index must be strictly before sell index.
 *
 * Returns null when no profitable trade exists (e.g. prices only decline).
 */
export function findMaxProfit(priceHistory) {
  if (!priceHistory || priceHistory.length < 2) return null;

  let minIdx = 0;
  let bestBuy = 0;
  let bestSell = 1;
  let maxProfit = -Infinity;

  for (let i = 1; i < priceHistory.length; i++) {
    const profit = priceHistory[i].close - priceHistory[minIdx].close;

    if (profit > maxProfit) {
      maxProfit = profit;
      bestBuy = minIdx;
      bestSell = i;
    }

    if (priceHistory[i].close < priceHistory[minIdx].close) {
      minIdx = i;
    }
  }

  // Market only declined — no profitable trade possible
  if (maxProfit <= 0) {
    return buildResult(priceHistory, bestBuy, bestSell, maxProfit);
  }

  return buildResult(priceHistory, bestBuy, bestSell, maxProfit);
}

function buildResult(priceHistory, buyIdx, sellIdx, rawProfit) {
  const buyPrice = priceHistory[buyIdx].close;
  const sellPrice = priceHistory[sellIdx].close;
  const profitPct = ((sellPrice - buyPrice) / buyPrice) * 100;

  return {
    buyPoint: { ...priceHistory[buyIdx], index: buyIdx },
    sellPoint: { ...priceHistory[sellIdx], index: sellIdx },
    profitPerUnit: sellPrice - buyPrice,
    profitPct,
    isProfitable: rawProfit > 0,
  };
}
