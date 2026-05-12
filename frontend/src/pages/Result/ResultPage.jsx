import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '../../store/useAnalysisStore.js';
import { useMultiAnalysis } from '../../hooks/useAnalysis.js';
import ResultCard from '../../components/ResultCard/ResultCard.jsx';
import PriceChart from '../../components/PriceChart/PriceChart.jsx';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';

const PERIOD_ORDER = ['1w', '1m', '1y'];

export default function ResultPage() {
  const navigate = useNavigate();
  const { selectedTicker, multiResults, loading, error } = useAnalysisStore();
  const { runAll } = useMultiAnalysis();

  useEffect(() => {
    if (!selectedTicker) { navigate('/'); return; }
    if (Object.keys(multiResults).length === 0) runAll(selectedTicker);
  }, [selectedTicker]);

  if (!selectedTicker) return null;

  const cards = PERIOD_ORDER.map(p => multiResults[p]).filter(Boolean);
  // Pick the longest period with data for the chart
  const chartData = multiResults['1y'] ?? multiResults['1m'] ?? multiResults['1w'];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="btn-ghost text-sm">
          ← 다시 검색
        </button>
        <div className="flex items-center gap-2">
          <span className="font-black text-white text-lg">{selectedTicker.name}</span>
          <span className="text-white/30 text-sm font-mono">{selectedTicker.ticker}</span>
        </div>
      </div>

      {/* Loading */}
      {loading && <LoadingScreen tickerName={selectedTicker.name} />}

      {/* Error */}
      {!loading && error && (
        <div className="card border-up/20 text-center py-12 space-y-3">
          <p className="text-4xl">😢</p>
          <p className="text-up font-bold">{error}</p>
          <p className="text-white/30 text-sm">잠시 후 다시 시도해 주세요.</p>
          <button onClick={() => runAll(selectedTicker)} className="btn-ghost text-sm mt-2">
            다시 시도
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && cards.length > 0 && (
        <>
          {/* Summary banner */}
          <SummaryBanner cards={cards} ticker={selectedTicker} />

          {/* Period cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PERIOD_ORDER.map((p, i) =>
              multiResults[p]
                ? <ResultCard key={p} data={multiResults[p]} rank={i} />
                : <EmptyCard key={p} period={p} />
            )}
          </div>

          {/* Chart */}
          {chartData && (
            <PriceChart
              priceHistory={chartData.priceHistory}
              buyPoint={chartData.buyPoint}
              sellPoint={chartData.sellPoint}
              period={chartData.period}
            />
          )}
        </>
      )}
    </div>
  );
}

function SummaryBanner({ cards, ticker }) {
  const best = cards.reduce((a, b) => (b.profitPct > a.profitPct ? b : a), cards[0]);
  if (!best) return null;

  return (
    <div className="card border-up/20 bg-up/5 text-center space-y-1 animate-pop">
      <p className="text-white/40 text-sm">
        <span className="text-white font-semibold">{ticker.name}</span>의 최고 수익 구간
      </p>
      <p className="text-5xl font-black text-up">+{best.profitPct.toFixed(2)}%</p>
      <p className="text-white/30 text-sm">
        {best.buyPoint.date} 매수 → {best.sellPoint.date} 매도
      </p>
    </div>
  );
}

function EmptyCard({ period }) {
  const labels = { '1w': '1주일', '1m': '1개월', '1y': '1년' };
  return (
    <div className="card flex items-center justify-center py-10 text-white/20 text-sm">
      {labels[period] ?? period} 데이터 없음
    </div>
  );
}
