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

export default function PriceChart({ priceHistory, buyPoint, sellPoint }) {
  const data = priceHistory.map((p, i) => ({
    ...p,
    isBuy: i === buyPoint.index,
    isSell: i === sellPoint.index,
  }));

  const prices = priceHistory.map(p => p.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="card animate-fade-in">
      <h3 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">
        가격 차트
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={d => d.slice(5)}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `$${v.toLocaleString()}`}
            width={75}
          />
          <Tooltip content={<CustomTooltip buyIdx={buyPoint.index} sellIdx={sellPoint.index} />} />
          <ReferenceLine
            x={buyPoint.date}
            stroke="#00d084"
            strokeDasharray="4 3"
            label={{ value: '매수', fill: '#00d084', fontSize: 11 }}
          />
          <ReferenceLine
            x={sellPoint.date}
            stroke="#ff4d4d"
            strokeDasharray="4 3"
            label={{ value: '매도', fill: '#ff4d4d', fontSize: 11 }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#4f8ef7"
            strokeWidth={2}
            fill="url(#priceGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#4f8ef7' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, label, buyIdx, sellIdx }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isBuy = d.isBuy;
  const isSell = d.isSell;

  return (
    <div className="bg-surface-card border border-white/10 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="font-mono font-bold text-white">
        ${d.close.toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </p>
      {isBuy && <p className="text-accent-green text-xs mt-1 font-semibold">▲ 최적 매수 시점</p>}
      {isSell && <p className="text-accent-red text-xs mt-1 font-semibold">▼ 최적 매도 시점</p>}
    </div>
  );
}
