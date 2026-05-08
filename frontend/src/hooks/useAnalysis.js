import { useCallback } from 'react';
import { fetchAnalysis } from '../api/client.js';
import { useAnalysisStore } from '../store/useAnalysisStore.js';

export function useAnalysis() {
  const { selectedTicker, selectedPeriod, setLoading, setResult, setError } = useAnalysisStore();

  const run = useCallback(async (ticker, period) => {
    if (!ticker) return;
    setLoading(true);
    try {
      const result = await fetchAnalysis(ticker.ticker, period, ticker.type);
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
  }, [setLoading, setResult, setError]);

  return { run };
}
