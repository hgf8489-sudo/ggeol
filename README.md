# 껄껄껄 (Ggeol)

> **"이때 샀다면 얼마나 벌었을까?"** — 주식·코인 최대 수익 시뮬레이터

---

## 서비스 개요

주식과 가상화폐의 과거 데이터를 분석해서 선택한 기간 내 **이론상 최대 수익을 낼 수 있었던 매수·매도 시점**을 찾아 시각화해 주는 웹 서비스입니다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Backend | Node.js + Express 4 |
| 차트 | Recharts |
| 상태 관리 | Zustand |
| 라우팅 | React Router v6 |
| 주식 데이터 | yahoo-finance2 |
| 코인 데이터 | CoinGecko API (무료) |

---

## 폴더 구조

```
ggeol/
├── frontend/                    # React SPA (Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js        # Axios 래퍼 (baseURL /api)
│   │   ├── components/
│   │   │   ├── Layout/          # 헤더·푸터 레이아웃
│   │   │   ├── SearchBar/       # 티커 검색 (디바운스 + 드롭다운)
│   │   │   ├── PeriodSelector/  # 기간 선택 버튼 그룹
│   │   │   ├── PriceChart/      # Recharts 영역 차트 + 매수/매도 표시
│   │   │   └── ResultCard/      # 최대 수익 요약 카드
│   │   ├── hooks/
│   │   │   └── useAnalysis.js   # 분석 API 호출 훅
│   │   ├── pages/
│   │   │   ├── Home/            # 검색 + 기간 설정 화면
│   │   │   └── Result/          # 차트 + 결과 카드 화면
│   │   ├── store/
│   │   │   └── useAnalysisStore.js  # Zustand 전역 상태
│   │   ├── styles/
│   │   │   └── global.css       # Tailwind + 커스텀 컴포넌트 클래스
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js           # /api → localhost:4000 프록시
│   ├── tailwind.config.js       # 다크 테마 커스텀 컬러
│   └── package.json
│
├── backend/                     # Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── index.js         # 환경변수 중앙화
│   │   ├── middleware/
│   │   │   └── errorHandler.js  # 에러 응답 일관화
│   │   ├── routes/
│   │   │   ├── search.js        # GET /api/search?q=&type=
│   │   │   └── analysis.js      # GET /api/analysis?ticker=&period=&type=
│   │   ├── services/
│   │   │   ├── searchService.js  # 주식·코인 통합 검색
│   │   │   ├── stockService.js   # Yahoo Finance 히스토리
│   │   │   ├── cryptoService.js  # CoinGecko 히스토리
│   │   │   └── analysisService.js # 최적 매수/매도 분석
│   │   ├── utils/
│   │   │   ├── dateUtils.js     # 기간 → 날짜 범위 변환
│   │   │   └── optimizer.js     # O(n) 최대 수익 알고리즘
│   │   └── index.js             # 서버 엔트리포인트
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 통신 아키텍처

```
┌──────────────────────────────────────────────────────┐
│                   Browser (React SPA)                 │
│                                                       │
│  HomePage ──── SearchBar ──── /api/search?q=...       │
│      │                                                │
│      └── PeriodSelector                               │
│                                                       │
│  ResultPage ─── PriceChart ─── /api/analysis?...      │
│             └── ResultCard                            │
└────────────────────┬─────────────────────────────────┘
                     │  HTTP (Vite dev proxy / Nginx prod)
                     ▼
┌──────────────────────────────────────────────────────┐
│              Express Backend (:4000)                  │
│                                                       │
│  GET /api/search   → searchService                    │
│      ├── Yahoo Finance (주식)                          │
│      └── CoinGecko API (코인)                          │
│                                                       │
│  GET /api/analysis → analysisService                  │
│      ├── stockService (Yahoo Finance historical)      │
│      ├── cryptoService (CoinGecko market_chart)       │
│      └── optimizer.js (O(n) best buy/sell finder)     │
└──────────────────────────────────────────────────────┘
```

---

## API 명세

### `GET /api/search`

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `q` | string | 검색어 (종목명·티커) |
| `type` | `stock` \| `crypto` \| `all` | 검색 유형 (기본: `all`) |

**응답 예시**
```json
[
  { "ticker": "AAPL", "name": "Apple Inc.", "type": "stock", "exchange": "NMS" },
  { "ticker": "bitcoin", "name": "Bitcoin", "symbol": "BTC", "type": "crypto" }
]
```

### `GET /api/analysis`

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `ticker` | string | 종목 ID (AAPL, bitcoin 등) |
| `period` | `1w` \| `1m` \| `3m` \| `6m` \| `1y` | 분석 기간 |
| `type` | `stock` \| `crypto` | 종목 유형 |

**응답 예시**
```json
{
  "ticker": "AAPL",
  "period": "1m",
  "priceHistory": [{ "date": "2024-01-02", "close": 185.2 }],
  "buyPoint": { "date": "2024-01-05", "close": 182.0, "index": 3 },
  "sellPoint": { "date": "2024-01-26", "close": 193.9, "index": 24 },
  "maxProfit": 11.9,
  "maxProfitPct": 6.54,
  "summary": "6.5% 수익 기회를 날렸습니다. 껄껄"
}
```

---

## 로컬 실행

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev        # http://localhost:4000

# Frontend (새 터미널)
cd frontend
npm install
npm run dev        # http://localhost:5173
```

---

## 핵심 알고리즘

`backend/src/utils/optimizer.js` — O(n) 시간복잡도로 선택 기간 내 최대 수익 매수/매도 쌍을 탐색합니다. "Best Time to Buy and Sell Stock" 문제와 동일한 접근으로, 배열을 한 번만 순회합니다.
