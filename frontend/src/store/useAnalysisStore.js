import { create } from 'zustand';

export const useAnalysisStore = create((set) => ({
  selectedTicker: null,
  multiResults: {},
  loading: false,
  error: null,
  amount: 1_000_000,

  setTicker: (ticker) => set({ selectedTicker: ticker, multiResults: {}, error: null }),
  setMultiResults: (results) => set({ multiResults: results, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  setAmount: (amount) => set({ amount }),
  reset: () => set({ selectedTicker: null, multiResults: {}, error: null }),
}));
