/**
 * Generates realistic-looking price history for demo / offline mode.
 * Crypto prices are KRW-denominated (Upbit convention).
 */
export function generateMockHistory(ticker, period) {
  const days = { '1w': 7, '1m': 30, '3m': 90, '6m': 180, '1y': 365 }[period] ?? 30;

  const BASE_PRICES = {
    // Stocks (USD)
    AAPL: 175, TSLA: 250, NVDA: 500, MSFT: 380, AMZN: 185, GOOGL: 170, META: 490,
    // Korean stocks (KRW)
    '005930': 72000, '000660': 180000, '035420': 210000,
    // Crypto (KRW — Upbit prices)
    BTC: 92_000_000, ETH: 5_100_000, SOL: 195_000,
    XRP: 850, DOGE: 230, ADA: 620, AVAX: 45_000,
    bitcoin: 92_000_000, ethereum: 5_100_000, solana: 195_000,
  };

  const key = ticker.toUpperCase();
  const basePrice = BASE_PRICES[key] ?? BASE_PRICES[ticker] ?? 100;
  const volatility = basePrice * 0.025;

  const result = [];
  let price = basePrice * (0.78 + Math.random() * 0.35);
  const end = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const change = (Math.random() - 0.47) * volatility;
    price = Math.max(price + change, basePrice * 0.25);

    result.push({
      date:   dateStr,
      open:   round(price - Math.random() * volatility * 0.4),
      high:   round(price + Math.random() * volatility * 0.8),
      low:    round(price - Math.random() * volatility * 0.8),
      close:  round(price),
      volume: Math.floor(Math.random() * 50_000_000 + 5_000_000),
    });
  }

  return result;
}

export const MOCK_SEARCH_RESULTS = [
  // 한국 주식
  { ticker: '005930', name: '삼성전자',     type: 'stock',  exchange: 'KRX' },
  { ticker: '000660', name: 'SK하이닉스',   type: 'stock',  exchange: 'KRX' },
  { ticker: '035420', name: 'NAVER',        type: 'stock',  exchange: 'KRX' },
  // 미국 주식
  { ticker: 'AAPL',   name: 'Apple Inc.',   type: 'stock',  exchange: 'NASDAQ' },
  { ticker: 'NVDA',   name: 'NVIDIA Corp.', type: 'stock',  exchange: 'NASDAQ' },
  { ticker: 'TSLA',   name: 'Tesla, Inc.',  type: 'stock',  exchange: 'NASDAQ' },
  // 업비트 코인 (KRW)
  { ticker: 'BTC',  market: 'KRW-BTC',  name: '비트코인',  symbol: 'BTC',  type: 'crypto', exchange: 'upbit' },
  { ticker: 'ETH',  market: 'KRW-ETH',  name: '이더리움',  symbol: 'ETH',  type: 'crypto', exchange: 'upbit' },
  { ticker: 'SOL',  market: 'KRW-SOL',  name: '솔라나',    symbol: 'SOL',  type: 'crypto', exchange: 'upbit' },
  { ticker: 'XRP',  market: 'KRW-XRP',  name: '리플',      symbol: 'XRP',  type: 'crypto', exchange: 'upbit' },
  { ticker: 'DOGE', market: 'KRW-DOGE', name: '도지코인',  symbol: 'DOGE', type: 'crypto', exchange: 'upbit' },
];

const round = (n) => Math.round(n * 100) / 100;
