import { useRef } from 'react';
import { useEmojiEffect, EmojiParticles } from '../EmojiEffect/EmojiEffect.jsx';

const PERIOD_LABEL = { '1w': '1주일', '1m': '1개월', '3m': '3개월', '6m': '6개월', '1y': '1년' };

const REGRET_LINES = [
  '이때 샀어야 했는데...',
  '그때 딱 한 번만 눌렀으면...',
  '왜 망설였을까...',
  '남들은 다 벌었을 때',
  '지금 생각해도 아깝다',
];

export default function ResultCard({ data, rank }) {
  const { ticker, period, type, buyPoint, sellPoint, profitPct, profitKrw, regretMessage, isProfitable } = data;
  const { particles, burst } = useEmojiEffect();
  const cardRef = useRef(null);

  const isUp = isProfitable && profitPct > 0;
  const regretLine = REGRET_LINES[Math.floor(profitPct * 100) % REGRET_LINES.length];

  return (
    <div
      ref={cardRef}
      className="card-hover relative overflow-hidden select-none animate-slide-up"
      style={{ animationDelay: `${(rank ?? 0) * 0.08}s` }}
      onClick={burst}
    >
      <EmojiParticles particles={particles} />

      {/* Period badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold bg-surface-hover border border-surface-border rounded-lg px-3 py-1 text-white/50 font-mono">
          {PERIOD_LABEL[period] ?? period}
        </span>
        <span className={type === 'crypto' ? 'tag-crypto' : 'tag-stock'}>
          {type === 'crypto' ? '코인' : '주식'}
        </span>
      </div>

      {/* Profit headline */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-white/40 text-xs mb-1 italic">"{regretLine}"</p>
          <p className={`text-5xl font-black tabular-nums tracking-tight ${isUp ? 'text-up' : 'text-down'}`}>
            {isUp ? '+' : ''}{profitPct.toFixed(2)}%
          </p>
          {profitKrw != null && data.investAmount != null && (
            <p className="text-white/40 text-sm mt-1 font-mono">
              {formatKrw(data.investAmount)} 투자 시 <span className={isUp ? 'text-up' : 'text-down'}>+{formatKrw(profitKrw)}</span> 수익
            </p>
          )}
        </div>
        <div className="text-5xl animate-float opacity-80">
          {isUp ? '📈' : '📉'}
        </div>
      </div>

      <div className="glow-line mb-4 opacity-50" />

      {/* Buy / Sell points */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <PointBox label="최적 매수" date={buyPoint.date} price={buyPoint.close} color="up" arrow="▲" />
        <PointBox label="최적 매도" date={sellPoint.date} price={sellPoint.close} color="down" arrow="▼" />
      </div>

      {/* Regret message from backend */}
      {regretMessage && (
        <div className="bg-accent-dim border border-accent-gold/20 rounded-xl px-4 py-3">
          <p className="text-accent-gold text-sm font-semibold leading-snug">{regretMessage}</p>
        </div>
      )}

      {/* Comparisons */}
      {data.comparisons?.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {data.comparisons.map((c, i) => (
            <span key={i} className="text-xs bg-surface-hover rounded-lg px-3 py-1.5 text-white/40">
              {c.emoji} {c.label}
            </span>
          ))}
        </div>
      )}

      {/* Subtle click hint */}
      <p className="text-white/10 text-xs text-right mt-3 font-mono">클릭해서 후회하기</p>
    </div>
  );
}

function PointBox({ label, date, price, color, arrow }) {
  return (
    <div className="bg-surface rounded-xl p-3.5 border border-surface-border">
      <p className={`text-xs font-bold text-${color} mb-1.5 flex items-center gap-1`}>
        <span>{arrow}</span>{label}
      </p>
      <p className="text-white font-black font-mono text-lg">
        ${price?.toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </p>
      <p className="text-white/30 text-xs mt-0.5 font-mono">{date}</p>
    </div>
  );
}

function formatKrw(amount) {
  if (!amount) return '0원';
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}억원`;
  if (amount >= 10_000) return `${Math.round(amount / 10_000)}만원`;
  return `${amount.toLocaleString('ko-KR')}원`;
}
