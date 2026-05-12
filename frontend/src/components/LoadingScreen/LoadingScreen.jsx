import { useState, useEffect } from 'react';

const LOADING_LINES = [
  '과거 데이터 불러오는 중...',
  '최적의 매수 시점 계산 중...',
  '최적의 매도 시점 찾는 중...',
  '후회 지수 측정 중...',
  '껄 계수 산출 중...',
  '결과 정리 중...',
];

const FAKE_TICKERS = [
  { t: 'AAPL',   p: '+142.3%' },
  { t: 'BTC',    p: '+418.0%' },
  { t: 'NVDA',   p: '+238.5%' },
  { t: 'TSLA',   p: '+189.2%' },
  { t: 'ETH',    p: '+312.7%' },
];

export default function LoadingScreen({ tickerName }) {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIdx(i => (i + 1) % LOADING_LINES.length);
    }, 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10 animate-fade-in">

      {/* Animated chart bars */}
      <div className="flex items-end gap-1.5 h-20">
        {[40, 65, 35, 80, 55, 90, 45, 70, 60, 85, 50, 75].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm bg-up/70"
            style={{
              height: `${h}%`,
              animation: `float ${1.2 + i * 0.15}s ease-in-out infinite`,
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>

      {/* Status text */}
      <div className="text-center space-y-3">
        <p className="text-white/30 text-sm font-mono">
          <span className="text-up">{tickerName}</span>의 숨겨진 수익을 찾는 중
        </p>
        <p className="text-white/50 text-base font-semibold h-6 animate-fade-in" key={lineIdx}>
          {LOADING_LINES[lineIdx]}
        </p>
        <div className="flex justify-center gap-1 mt-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-up/60"
              style={{ animation: `blink 1.2s step-end infinite`, animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      {/* "Others missed these" mini-cards */}
      <div className="flex gap-3 flex-wrap justify-center">
        {FAKE_TICKERS.map(({ t, p }) => (
          <div key={t} className="bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-center">
            <p className="text-white/30 text-xs font-mono">{t}</p>
            <p className="text-up font-black text-lg">{p}</p>
          </div>
        ))}
      </div>

      <p className="text-white/15 text-xs font-mono animate-pulse">
        샀을 걸... 샀을 걸... 샀을 걸...
      </p>
    </div>
  );
}
