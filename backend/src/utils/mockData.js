/**
 * Generates realistic-looking price history for demo / offline mode.
 */
export function generateMockHistory(ticker, period) {
  const days = { '1w': 7, '1m': 30, '3m': 90, '6m': 180, '1y': 365 }[period] ?? 30;

  const BASE_PRICES = {
    AAPL: 175, TSLA: 250, NVDA: 500, MSFT: 380, AMZN: 185,
    GOOGL: 170, META: 490, BTC: 65000, ETH: 3500, bitcoin: 65000,
    ethereum: 3500, solana: 140, '005930': 72000,
  };

  const basePrice = BASE_PRICES[ticker.toUpperCase()] ?? BASE_PRICES[ticker] ?? 100;
  const volatility = basePrice * 0.02;

  const result = [];
  let price = basePrice * (0.8 + Math.random() * 0.3);
  const end = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const change = (Math.random() - 0.48) * volatility;
    price = Math.max(price + change, basePrice * 0.3);

    result.push({
      date: dateStr,
      open:   round(price - Math.random() * volatility * 0.5),
      high:   round(price + Math.random() * volatility),
      low:    round(price - Math.random() * volatility),
      close:  round(price),
      volume: Math.floor(Math.random() * 50_000_000 + 5_000_000),
    });
  }

  return result;
}

export const MOCK_SEARCH_RESULTS = [
  { ticker: 'AAPL',   name: 'Apple Inc.',      type: 'stock',  exchange: 'NMS' },
  { ticker: 'TSLA',   name: 'Tesla, Inc.',      type: 'stock',  exchange: 'NMS' },
  { ticker: 'NVDA',   name: 'NVIDIA Corporation', type: 'stock', exchange: 'NMS' },
  { ticker: 'MSFT',   name: 'Microsoft Corporation', type: 'stock', exchange: 'NMS' },
  { ticker: 'bitcoin', name: 'Bitcoin',         type: 'crypto', symbol: 'BTC' },
  { ticker: 'ethereum', name: 'Ethereum',       type: 'crypto', symbol: 'ETH' },
  { ticker: '005930', name: '삼성전자',           type: 'stock',  exchange: 'KSC' },
];

const round = (n) => Math.round(n * 100) / 100;
