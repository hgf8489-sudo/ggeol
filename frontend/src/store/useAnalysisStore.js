import { create } from 'zustand';

export const useAnalysisStore = create((set) => ({
  selectedTicker: null,
  selectedPeriod: '1m',
  analysisResult: null,
  loading: false,
  error: null,

  setTicker: (ticker) => set({ selectedTicker: ticker, analysisResult: null, error: null }),
  setPeriod: (period) => set({ selectedPeriod: period }),
  setResult: (result) => set({ analysisResult: result, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  reset: () => set({ selectedTicker: null, analysisResult: null, error: null }),
}));
