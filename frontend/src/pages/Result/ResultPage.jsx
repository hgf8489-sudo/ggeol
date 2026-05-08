import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '../../store/useAnalysisStore.js';
import ResultCard from '../../components/ResultCard/ResultCard.jsx';
import PriceChart from '../../components/PriceChart/PriceChart.jsx';
import PeriodSelector from '../../components/PeriodSelector/PeriodSelector.jsx';
import { useAnalysis } from '../../hooks/useAnalysis.js';

export default function ResultPage() {
  const navigate = useNavigate();
  const { selectedTicker, selectedPeriod, analysisResult, loading, error, setPeriod } = useAnalysisStore();
  const { run } = useAnalysis();

  useEffect(() => {
    if (!selectedTicker) navigate('/');
  }, [selectedTicker, navigate]);

  useEffect(() => {
    if (selectedTicker) run(selectedTicker, selectedPeriod);
  }, [selectedPeriod]);

  if (!selectedTicker) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="btn-ghost text-sm">
          ← 다시 검색
        </button>
        <PeriodSelector selected={selectedPeriod} onChange={setPeriod} />
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-20 text-white/40">
          <div className="w-10 h-10 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
          <p className="text-sm">이론상 최대 수익을 계산하는 중...</p>
        </div>
      )}

      {error && (
        <div className="card border-accent-red/20 text-center py-10">
          <p className="text-accent-red font-semibold">{error}</p>
          <p className="text-white/30 text-sm mt-2">잠시 후 다시 시도해 주세요.</p>
        </div>
      )}

      {analysisResult && !loading && (
        <>
          <ResultCard data={analysisResult} />
          <PriceChart
            priceHistory={analysisResult.priceHistory}
            buyPoint={analysisResult.buyPoint}
            sellPoint={analysisResult.sellPoint}
          />
        </>
      )}
    </div>
  );
}
