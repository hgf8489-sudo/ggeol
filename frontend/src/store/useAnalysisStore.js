import { create } from 'zustand';

export const useAnalysisStore = create((set) => ({
  selectedTicker: null,
  // multiResults: { '1w': data|null, '1m': data|null, '1y': data|null }
  multiResults: {},
  loading: false,
  error: null,

  setTicker: (ticker) => set({ selectedTicker: ticker, multiResults: {}, error: null }),
  setMultiResults: (results) => set({ multiResults: results, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  reset: () => set({ selectedTicker: null, multiResults: {}, error: null }),
}));
