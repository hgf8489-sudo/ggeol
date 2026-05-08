import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import { useAnalysisStore } from '../../store/useAnalysisStore.js';
import { useMultiAnalysis } from '../../hooks/useAnalysis.js';

const EXAMPLE_TICKERS = [
  { label: '삼성전자', sub: '005930 · KRX' },
  { label: 'NVIDIA',   sub: 'NVDA · NASDAQ' },
  { label: 'Bitcoin',  sub: 'BTC · Crypto' },
  { label: 'Tesla',    sub: 'TSLA · NASDAQ' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { selectedTicker, setTicker, loading } = useAnalysisStore();
  const { runAll } = useMultiAnalysis();

  async function handleSimulate() {
    if (!selectedTicker) return;
    await runAll(selectedTicker);
    navigate('/result');
  }

  return (
    <div className="flex flex-col items-center gap-14 pt-6 animate-fade-in">

      {/* Hero */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 bg-up/10 border border-up/20 rounded-full px-4 py-1.5 text-up text-xs font-semibold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse inline-block" />
          주식 · 코인 최대 수익 시뮬레이터
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.1]">
          종목을 검색하고<br />
          <span className="text-up">껄껄껄</span>{' '}
          <span className="text-white/80">웃어보세요</span>
        </h1>

        <p className="text-white/40 text-base max-w-sm mx-auto leading-relaxed">
          이때 샀을 걸... 이때 팔았을 걸...<br />
          선택한 기간의 <strong className="text-white/60">이론상 최대 수익</strong>을 알려드립니다.
        </p>
      </div>

      {/* Search */}
      <div className="w-full max-w-xl space-y-4">
        <SearchBar onSelect={setTicker} />

        {selectedTicker ? (
          <SelectedTicker ticker={selectedTicker} onClear={() => setTicker(null)} />
        ) : (
          <ExampleChips />
        )}

        <button
          onClick={handleSimulate}
          disabled={!selectedTicker || loading}
          className="w-full btn-primary py-4 text-base font-black tracking-wide
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><Spinner />후회 계산 중...</span>
            : '👉 지금 확인하기'}
        </button>
      </div>

      {/* Bottom tagline */}
      <p className="text-white/15 text-sm font-mono text-center">
        "그때 딱 한 번만 샀어도..." — 모든 투자자의 마음
      </p>
    </div>
  );
}

function SelectedTicker({ ticker, onClear }) {
  return (
    <div className="flex items-center justify-between bg-surface-card border border-surface-border rounded-xl px-5 py-3.5 animate-pop">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-up animate-pulse" />
        <span className="font-bold text-white">{ticker.name}</span>
        <span className="text-white/30 text-sm font-mono">{ticker.ticker}</span>
        <span className={ticker.type === 'crypto' ? 'tag-crypto' : 'tag-stock'}>
          {ticker.type === 'crypto' ? '코인' : '주식'}
        </span>
      </div>
      <button onClick={onClear} className="text-white/30 hover:text-white/70 transition-colors text-lg leading-none">×</button>
    </div>
  );
}

function ExampleChips() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <span className="text-white/20 text-xs self-center mr-1">예시:</span>
      {EXAMPLE_TICKERS.map(({ label, sub }) => (
        <span
          key={label}
          className="text-xs bg-surface-card border border-surface-border rounded-lg px-3 py-1.5
                     text-white/40 font-mono"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />;
}
