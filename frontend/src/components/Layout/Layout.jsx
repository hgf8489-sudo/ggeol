import { Link, useLocation } from 'react-router-dom';

const TICKER_ITEMS = [
  { label: 'AAPL', pct: '+2.4%', up: true },
  { label: 'TSLA', pct: '-1.8%', up: false },
  { label: 'BTC',  pct: '+5.1%', up: true },
  { label: 'ETH',  pct: '+3.2%', up: true },
  { label: 'NVDA', pct: '+8.9%', up: true },
  { label: 'MSFT', pct: '-0.3%', up: false },
  { label: 'AMZN', pct: '+1.1%', up: true },
  { label: 'META', pct: '+4.7%', up: true },
  { label: '005930', pct: '-0.9%', up: false },
  { label: 'SOL',  pct: '+6.6%', up: true },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-surface bg-grid-pattern">
      {/* Ticker tape */}
      <div className="ticker-wrap border-b border-surface-border py-1.5 text-xs font-mono">
        <div className="ticker-inner gap-8">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 mx-4">
              <span className="text-white/40">{item.label}</span>
              <span className={item.up ? 'text-up' : 'text-down'}>{item.pct}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-surface-border">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="text-3xl font-black tracking-tighter text-white group-hover:text-up transition-colors duration-200">
            껄껄껄
          </span>
          <span className="text-white/20 text-xs font-mono">GGEOL</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse inline-block" />
          실시간 데이터
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border px-6 py-4 flex items-center justify-between text-white/20 text-xs">
        <span>껄껄껄 — 후회는 배움이 된다.</span>
        <span className="font-mono">투자 권유 아님</span>
      </footer>
    </div>
  );
}
