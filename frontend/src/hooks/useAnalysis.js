import { useCallback } from 'react';
import { fetchAnalysis } from '../api/client.js';
import { useAnalysisStore } from '../store/useAnalysisStore.js';

const MULTI_PERIODS = ['1w', '1m', '1y'];

export function useMultiAnalysis() {
  const { setLoading, setMultiResults, setError } = useAnalysisStore();

  const runAll = useCallback(async (ticker) => {
    if (!ticker) return;
    setLoading(true);

    try {
      const settled = await Promise.allSettled(
        MULTI_PERIODS.map(p => fetchAnalysis(ticker.ticker, p, ticker.type))
      );

      const results = {};
      MULTI_PERIODS.forEach((p, i) => {
        results[p] = settled[i].status === 'fulfilled' ? settled[i].value : null;
      });

      const anySuccess = Object.values(results).some(Boolean);
      if (!anySuccess) throw new Error('데이터를 가져올 수 없습니다.');

      setMultiResults(results);
    } catch (err) {
      setError(err.message);
    }
  }, [setLoading, setMultiResults, setError]);

  return { runAll };
}
