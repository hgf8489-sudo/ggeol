import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';

const PERIOD_LABEL = { '1w': '1주일', '1m': '1개월', '3m': '3개월', '6m': '6개월', '1y': '1년' };

export default function PriceChart({ priceHistory, buyPoint, sellPoint, period }) {
  if (!priceHistory?.length) return null;

  const data = priceHistory.map((p, i) => ({
    ...p,
    isBuy:  i === buyPoint?.index,
    isSell: i === sellPoint?.index,
  }));

  const prices = priceHistory.map(p => p.close).filter(Boolean);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.12;

  // Korean stock colors: red = up (buy line), blue = sell line
  const BUY_COLOR  = '#ff3a3a';
  const SELL_COLOR = '#3a8fff';
  const LINE_COLOR = '#ff3a3a';

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">
          가격 차트
          {period && <span className="ml-2 text-white/30 font-normal">— {PERIOD_LABEL[period]}</span>}
        </h3>
        <div className="flex items-center gap-4 text-xs text-white/30">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-up inline-block rounded" />매수 시점
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-down inline-block rounded" />매도 시점
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={LINE_COLOR} stopOpacity={0.25} />
              <stop offset="95%" stopColor={LINE_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" />

          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={d => d?.slice(5) ?? ''}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString()}`}
            width={70}
          />

          <Tooltip content={<CustomTooltip />} />

          {buyPoint && (
            <ReferenceLine
              x={buyPoint.date}
              stroke={BUY_COLOR}
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: '▲ 매수', fill: BUY_COLOR, fontSize: 10, position: 'top' }}
            />
          )}
          {sellPoint && (
            <ReferenceLine
              x={sellPoint.date}
              stroke={SELL_COLOR}
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: '▼ 매도', fill: SELL_COLOR, fontSize: 10, position: 'top' }}
            />
          )}

          <Area
            type="monotone"
            dataKey="close"
            stroke={LINE_COLOR}
            strokeWidth={1.5}
            fill="url(#priceGrad)"
            dot={false}
            activeDot={{ r: 4, fill: LINE_COLOR, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm shadow-2xl">
      <p className="text-white/40 text-xs mb-1 font-mono">{label}</p>
      <p className="font-mono font-black text-white text-base">
        ${d.close?.toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </p>
      {d.isBuy  && <p className="text-up   text-xs mt-1 font-bold">▲ 최적 매수 시점</p>}
      {d.isSell && <p className="text-down text-xs mt-1 font-bold">▼ 최적 매도 시점</p>}
    </div>
  );
}
