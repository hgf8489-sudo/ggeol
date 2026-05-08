export default function ResultCard({ data }) {
  const { ticker, buyPoint, sellPoint, maxProfitPct, summary, type } = data;

  const isPositive = maxProfitPct >= 0;

  return (
    <div className="card animate-slide-up space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">{ticker}</h2>
          <p className="text-white/40 text-sm mt-0.5">
            {type === 'crypto' ? '암호화폐' : '주식'} · 이론상 최대 수익
          </p>
        </div>
        <div className={`text-right ${isPositive ? 'text-profit' : 'text-loss'}`}>
          <p className="text-4xl font-black">
            {isPositive ? '+' : ''}{maxProfitPct.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PointCard label="최적 매수" point={buyPoint} color="accent-green" />
        <PointCard label="최적 매도" point={sellPoint} color="accent-red" />
      </div>

      <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-xl px-5 py-3.5">
        <p className="text-accent-gold font-semibold text-sm">{summary}</p>
      </div>
    </div>
  );
}

function PointCard({ label, point, color }) {
  return (
    <div className="bg-surface-hover rounded-xl p-4">
      <p className={`text-xs font-semibold text-${color} mb-1 uppercase tracking-wider`}>{label}</p>
      <p className="text-xl font-black text-white font-mono">
        ${point.close.toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </p>
      <p className="text-white/40 text-xs mt-1">{point.date}</p>
    </div>
  );
}
