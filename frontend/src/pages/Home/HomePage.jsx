import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import PeriodSelector from '../../components/PeriodSelector/PeriodSelector.jsx';
import { useAnalysisStore } from '../../store/useAnalysisStore.js';
import { useAnalysis } from '../../hooks/useAnalysis.js';

export default function HomePage() {
  const navigate = useNavigate();
  const { selectedTicker, selectedPeriod, setTicker, setPeriod, loading } = useAnalysisStore();
  const { run } = useAnalysis();

  async function handleSimulate() {
    if (!selectedTicker) return;
    await run(selectedTicker, selectedPeriod);
    navigate('/result');
  }

  return (
    <div className="flex flex-col items-center gap-12 pt-8 animate-fade-in">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-6xl font-black tracking-tight">
          <span className="text-white">이때 </span>
          <span className="text-accent-gold">샀다면</span>
          <span className="text-white">...</span>
        </h1>
        <p className="text-white/40 text-lg max-w-md mx-auto leading-relaxed">
          후회는 늦었지만, 확인은 지금 할 수 있습니다.
          <br />주식·코인의 이론상 최대 수익을 계산해 드립니다.
        </p>
      </div>

      {/* Search + Config */}
      <div className="w-full max-w-2xl space-y-6">
        <SearchBar onSelect={setTicker} />

        {selectedTicker && (
          <div className="card animate-slide-up space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="font-semibold text-white">{selectedTicker.name}</span>
              <span className="text-white/40 text-sm font-mono">{selectedTicker.ticker}</span>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-3 uppercase tracking-wider">기간 선택</p>
              <PeriodSelector selected={selectedPeriod} onChange={setPeriod} />
            </div>
          </div>
        )}

        <button
          onClick={handleSimulate}
          disabled={!selectedTicker || loading}
          className="w-full btn-primary py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '분석 중...' : '껄껄껄 시뮬레이션 시작 →'}
        </button>
      </div>

      {/* Hint */}
      <p className="text-white/20 text-sm font-mono">
        "그때 1000만원만 넣었으면..." — 모든 투자자의 마음
      </p>
    </div>
  );
}
