/**
 * Generates humorous "what you could've bought" comparisons
 * based on profit amount in KRW.
 */

const TIERS = [
  {
    min: 500_000_000, // 5억+
    items: [
      { label: '한강뷰 아파트 계약금', emoji: '🏙️' },
      { label: '강남 꼬마빌딩 지분', emoji: '🏢' },
      { label: '페라리 로마 한 대', emoji: '🏎️' },
    ],
  },
  {
    min: 100_000_000, // 1억+
    items: [
      { label: '서울 외곽 아파트 전세', emoji: '🏠' },
      { label: '포르쉐 박스터', emoji: '🚗' },
      { label: '10년치 해외여행 경비', emoji: '✈️' },
    ],
  },
  {
    min: 50_000_000, // 5000만+
    items: [
      { label: '제네시스 GV80 풀옵션', emoji: '🚙' },
      { label: '롤렉스 서브마리너 2개', emoji: '⌚' },
      { label: '강남 성형외과 올인원 패키지', emoji: '💉' },
    ],
  },
  {
    min: 10_000_000, // 1000만+
    items: [
      { label: '에르메스 버킨백', emoji: '👜' },
      { label: '발리 한 달 풀빌라 숙박', emoji: '🌴' },
      { label: '아이폰 + 맥북 + 에어팟 풀셋', emoji: '📱' },
    ],
  },
  {
    min: 3_000_000, // 300만+
    items: [
      { label: '명품 가방 2~3개', emoji: '💼' },
      { label: '한우 오마카세 10번', emoji: '🥩' },
      { label: '갤럭시 S 최신형', emoji: '📱' },
    ],
  },
  {
    min: 1_000_000, // 100만+
    items: [
      { label: '제주도 커플 여행 패키지', emoji: '🍊' },
      { label: '스타벅스 아메리카노 500잔', emoji: '☕' },
      { label: '넷플릭스 4K 7년치', emoji: '🎬' },
    ],
  },
  {
    min: 100_000, // 10만+
    items: [
      { label: '치킨 30마리', emoji: '🍗' },
      { label: '편의점 삼각김밥 200개', emoji: '🍙' },
      { label: '배달비 50번치', emoji: '🛵' },
    ],
  },
  {
    min: 0, // 그 외
    items: [
      { label: '아이스아메리카노 한 잔', emoji: '🧊' },
      { label: '버스 카드 한 번 충전', emoji: '🚌' },
      { label: '편의점 껌 한 통', emoji: '🫧' },
    ],
  },
];

/**
 * @param {number} profitKrw - profit amount in KRW
 * @param {number} count     - number of comparisons to return
 */
export function getComparisons(profitKrw, count = 2) {
  const tier = TIERS.find(t => profitKrw >= t.min) ?? TIERS[TIERS.length - 1];
  return shuffle(tier.items).slice(0, count);
}

/**
 * Build the full regret message.
 * @param {number} profitKrw
 * @param {number} profitPct
 */
export function buildRegretMessage(profitKrw, profitPct) {
  const formatted = formatKrw(profitKrw);

  if (!profitKrw || profitPct <= 0) {
    return '그나마 안 산 게 다행일 수도... 껄?';
  }

  const comparisons = getComparisons(profitKrw);
  const items = comparisons.map(c => `${c.emoji} ${c.label}`).join(', ');

  if (profitPct >= 100) return `+${profitPct.toFixed(0)}% 🤯 ${formatted} 수익. ${items} 살 수 있었는데. 껄껄껄`;
  if (profitPct >= 50)  return `+${profitPct.toFixed(1)}% 😭 ${formatted}... ${items}. 왜 안 샀지. 껄껄껄`;
  if (profitPct >= 20)  return `+${profitPct.toFixed(1)}% 🥲 ${formatted}. ${items} 값. 껄껄`;
  if (profitPct >= 5)   return `+${profitPct.toFixed(1)}% 😤 ${formatted}. 소소하지만 ${items}. 껄`;
  return `+${profitPct.toFixed(2)}% 😶 ${formatted}. 뭐... ${items} 한 잔 값이네.`;
}

function formatKrw(amount) {
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}억원`;
  if (amount >= 10_000)      return `${Math.round(amount / 10_000)}만원`;
  return `${amount.toLocaleString('ko-KR')}원`;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
