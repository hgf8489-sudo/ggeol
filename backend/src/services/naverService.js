import axios from 'axios';

const NAVER_AC = 'https://ac.stock.naver.com/ac';

const client = axios.create({
  timeout: 6000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; GgeolBot/1.0)',
    Referer: 'https://finance.naver.com/',
  },
});

const EXCHANGE_MAP = {
  KOSPI:  '.KS',
  KOSDAQ: '.KQ',
  KONEX:  '.KQ',
};

export async function searchNaverStocks(query) {
  const { data } = await client.get(NAVER_AC, {
    params: { q: query, target: 'stock' },
  });

  return (data?.items ?? [])
    .filter(item => item.nationCode === 'KOR' && item.category === 'stock')
    .slice(0, 6)
    .map(item => {
      const suffix = EXCHANGE_MAP[item.typeCode] ?? '.KS';
      return {
        ticker:   item.code + suffix,
        name:     item.name,
        type:     'stock',
        exchange: item.typeCode ?? 'KRX',
      };
    });
}

export function hasKorean(str) {
  return /[가-힣ᄀ-ᇿ㄰-㆏]/.test(str);
}
