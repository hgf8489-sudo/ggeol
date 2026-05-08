import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

api.interceptors.response.use(
  res => res.data,
  err => {
    const message = err.response?.data?.error || '서버 오류가 발생했습니다.';
    throw new Error(message);
  }
);

export function searchTickers(query, type = 'all') {
  return api.get('/search', { params: { q: query, type } });
}

export function fetchAnalysis(ticker, period, type = 'stock') {
  return api.get('/analysis', { params: { ticker, period, type } });
}
