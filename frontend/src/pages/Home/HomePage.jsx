import { useState } from 'react';
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

const PRESETS = [
  { label: '10만원',  value: 100_000 },
  { label: '100만원', value: 1_000_000 },
  { label: '500만원', value: 5_000_000 },
  { label: '1천만원', value: 10_000_000 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { selectedTicker, setTicker, loading, amount, setAmount } = useAnalysisStore();
  const { runAll } = useMultiAnalysis();
  const [inputVal, setInputVal] = useState('1,000,000');

  async function handleSimulate() {
    if (!selectedTicker) return;
    await runAll(selectedTicker);
    navigate('/result');
  }

  function handleAmountChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) { setInputVal(''); setAmount(0); return; }
    const num = Math.min(parseInt(raw, 10), 10_000_000_000);
    setInputVal(num.toLocaleString('ko-KR'));
    setAmount(num);
  }

  function handlePreset(value) {
    setInputVal(value.toLocaleString('ko-KR'));
    setAmount(value);
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

      {/* Search + Amount */}
      <div className="w-full max-w-xl space-y-4">
        <SearchBar onSelect={setTicker} />

        {selectedTicker ? (
          <SelectedTicker ticker={selectedTicker} onClear={() => setTicker(null)} />
        ) : (
          <ExampleChips />
        )}

        {/* 투자금 설정 */}
        <div className="bg-surface-card border border-surface-border rounded-xl px-5 py-4 space-y-3">
          <p className="text-white/40 text-xs font-semibold tracking-wide">💰 투자금 설정</p>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="numeric"
                value={inputVal}
                onChange={handleAmountChange}
                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5
                           text-white font-mono text-right text-lg focus:outline-none
                           focus:border-white/30 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">원</span>
            </div>
          </div>

          <div className="flex gap-2">
            {PRESETS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handlePreset(value)}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors font-semibold
                  ${amount === value
                    ? 'bg-up/20 border-up/40 text-up'
                    : 'bg-surface border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

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
      {EXAMPLE_TICKERS.map(({ label }) => (
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
