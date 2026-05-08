/**
 * O(n) algorithm to find the buy/sell pair that maximizes profit.
 * Equivalent to the "Best Time to Buy and Sell Stock" problem.
 */
export function findOptimalPoints(priceHistory) {
  let minIdx = 0;
  let buyIdx = 0;
  let sellIdx = 1;
  let maxProfit = -Infinity;

  for (let i = 1; i < priceHistory.length; i++) {
    const profit = priceHistory[i].close - priceHistory[minIdx].close;
    if (profit > maxProfit) {
      maxProfit = profit;
      buyIdx = minIdx;
      sellIdx = i;
    }
    if (priceHistory[i].close < priceHistory[minIdx].close) {
      minIdx = i;
    }
  }

  const buyPrice = priceHistory[buyIdx].close;
  const sellPrice = priceHistory[sellIdx].close;
  const maxProfitPct = ((sellPrice - buyPrice) / buyPrice) * 100;

  return {
    buyPoint: { ...priceHistory[buyIdx], index: buyIdx },
    sellPoint: { ...priceHistory[sellIdx], index: sellIdx },
    maxProfit: sellPrice - buyPrice,
    maxProfitPct,
  };
}
