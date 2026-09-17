export interface PricePackage {
  name: string;
  price: string;
  note: string;
  isPopular?: boolean;
}

export type BeverageSubCategory =
  | 'COFFEE'
  | 'LATTE'
  | 'TEA'
  | 'KOMBU TEA'
  | 'ADE'
  | 'Fruit Juice'
  | 'SMOOTHIE'
  | 'SHAKE'
  | '커피/라떼'
  | '아이스티/티'
  | '콤부차'
  | '라떼/음료'
  | '에이드'
  | '스무디/생과일'
  | '쉐이크';

export interface BeverageCategoryMeta {
  key: string;
  nameKo: string;
  nameEn: string;
  badgeLabel?: string;
}

export const BEVERAGE_CATEGORIES: BeverageCategoryMeta[] = [
  { key: 'COFFEE', nameKo: '커피', nameEn: 'COFFEE' },
  { key: 'LATTE', nameKo: '라떼', nameEn: 'LATTE' },
  { key: 'TEA', nameKo: '티 & 아이스티', nameEn: 'TEA' },
  { key: 'KOMBU TEA', nameKo: '콤부차', nameEn: 'KOMBU TEA', badgeLabel: 'ice' },
  { key: 'ADE', nameKo: '에이드', nameEn: 'ADE', badgeLabel: 'ice' },
  { key: 'Fruit Juice', nameKo: '생과일 주스', nameEn: 'Fruit Juice', badgeLabel: 'ice' },
  { key: 'SMOOTHIE', nameKo: '요거트 스무디', nameEn: 'SMOOTHIE', badgeLabel: 'ice' },
  { key: 'SHAKE', nameKo: '쉐이크', nameEn: 'SHAKE', badgeLabel: 'ice' },
];

export function normalizeBeverageCategory(subCategory: string): string {
  const trimmed = subCategory?.trim() ?? '';
  const upper = trimmed.toUpperCase();
  if (upper === 'COFFEE' || trimmed === '커피/라떼' || trimmed === '커피') return 'COFFEE';
  if (upper === 'LATTE' || trimmed === '라떼/음료' || trimmed === '라떼') return 'LATTE';
  if (upper === 'TEA' || trimmed === '아이스티/티' || trimmed === '티') return 'TEA';
  if (upper === 'KOMBU TEA' || upper === 'KOMBU' || trimmed === '콤부차') return 'KOMBU TEA';
  if (upper === 'ADE' || trimmed === '에이드') return 'ADE';
  if (
    upper === 'FRUIT JUICE' ||
    upper === 'JUICE' ||
    trimmed === 'Fruit Juice' ||
    trimmed === '생과일' ||
    trimmed === '생과일주스'
  ) {
    return 'Fruit Juice';
  }
  if (upper === 'SMOOTHIE' || trimmed === '스무디/생과일' || trimmed === '스무디' || trimmed === '요거트스무디') {
    return 'SMOOTHIE';
  }
  if (upper === 'SHAKE' || trimmed === '쉐이크') return 'SHAKE';
  return trimmed;
}

export interface BeverageItem {
  id: string;
  nameKo: string;
  nameEn?: string;
  temp: 'HOT' | 'ICED' | 'BOTH';
  subCategory: BeverageSubCategory;
  packageDiff: number; // 패키지 선택 시 추가금 (0, 200, 300, 500, 800, 1500, 2000)
  singlePrice: number; // 단품 주문 시 가격 (기본 4000원 기준)
  isSoldOut?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'meal' | 'dessert' | 'snack';
  categoryKo: string;
  note?: string;
  isSoldOut?: boolean;
  isPopular?: boolean;
}

// 요금제 데이터
export const PRICE_PACKAGES: PricePackage[] = [
  { name: '기본 1시간', price: '3,600원', note: '음료 미포함 · 초과 10분당 600원' },
  { name: '1시간 + 기본 음료', price: '6,500원', note: '기본 음료 포함 · 차액 업그레이드 가능' },
  {
    name: '2시간 + 기본 음료',
    price: '9,500원',
    note: '기본 음료 포함 · 최고 인기 패키지',
    isPopular: true,
  },
  { name: '3시간 + 기본 음료', price: '12,500원', note: '기본 음료 포함' },
  { name: '5시간 + 기본 음료', price: '18,000원', note: '기본 음료 포함' },
  {
    name: '종일권 + 기본 음료',
    price: '15,000원',
    note: '종일 무제한 힐링 · 기본 음료 포함',
    isPopular: true,
  },
];

// 음료 데이터 (단품 기본가 4,000원 기준 + 패키지 차액)
export const BEVERAGE_ITEMS: BeverageItem[] = [
  // 1. COFFEE (커피)
  {
    id: 'b-hot-americano',
    nameKo: '따뜻한 아메리카노',
    nameEn: 'HOT AMERICANO',
    temp: 'HOT',
    subCategory: 'COFFEE',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-iced-americano',
    nameKo: '아이스 아메리카노',
    nameEn: 'ICED AMERICANO',
    temp: 'ICED',
    subCategory: 'COFFEE',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-hot-cafe-latte',
    nameKo: '따뜻한 카페라떼',
    nameEn: 'HOT CAFE LATTE',
    temp: 'HOT',
    subCategory: 'COFFEE',
    packageDiff: 300,
    singlePrice: 4300,
  },
  {
    id: 'b-iced-cafe-latte',
    nameKo: '아이스 카페라떼',
    nameEn: 'ICED CAFE LATTE',
    temp: 'ICED',
    subCategory: 'COFFEE',
    packageDiff: 300,
    singlePrice: 4300,
  },
  {
    id: 'b-hot-vanilla-latte',
    nameKo: '따뜻한 바닐라 라떼',
    nameEn: 'HOT VANILLA LATTE',
    temp: 'HOT',
    subCategory: 'COFFEE',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-iced-vanilla-latte',
    nameKo: '아이스 바닐라 라떼',
    nameEn: 'ICED VANILLA LATTE',
    temp: 'ICED',
    subCategory: 'COFFEE',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-hot-hazelnut-latte',
    nameKo: '따뜻한 헤이즐넛 라떼',
    nameEn: 'HOT HAZELNUT LATTE',
    temp: 'HOT',
    subCategory: 'COFFEE',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-iced-hazelnut-latte',
    nameKo: '아이스 헤이즐넛 라떼',
    nameEn: 'ICED HAZELNUT LATTE',
    temp: 'ICED',
    subCategory: 'COFFEE',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-hot-cafe-mocha',
    nameKo: '따뜻한 카페모카',
    nameEn: 'HOT CAFE MOCHA',
    temp: 'HOT',
    subCategory: 'COFFEE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-iced-cafe-mocha',
    nameKo: '아이스 카페모카',
    nameEn: 'ICED CAFE MOCHA',
    temp: 'ICED',
    subCategory: 'COFFEE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-hot-cappuccino',
    nameKo: '따뜻한 카푸치노',
    nameEn: 'HOT CAPPUCCINO',
    temp: 'HOT',
    subCategory: 'COFFEE',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-iced-cappuccino',
    nameKo: '아이스 카푸치노',
    nameEn: 'ICED CAPPUCCINO',
    temp: 'ICED',
    subCategory: 'COFFEE',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-hot-caramel-macchiato',
    nameKo: '따뜻한 카라멜마끼아또',
    nameEn: 'HOT CARAMEL MACCHIATO',
    temp: 'HOT',
    subCategory: 'COFFEE',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-iced-caramel-macchiato',
    nameKo: '아이스 카라멜마끼아또',
    nameEn: 'ICED CARAMEL MACCHIATO',
    temp: 'ICED',
    subCategory: 'COFFEE',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-ashotchu',
    nameKo: '아샷추 (아이스티+샷)',
    nameEn: 'ICED TEA WITH ESPRESSO',
    temp: 'ICED',
    subCategory: 'COFFEE',
    packageDiff: 500,
    singlePrice: 4500,
  },

  // 2. LATTE (논커피 라떼)
  {
    id: 'b-hot-darkchoco',
    nameKo: '따뜻한 다크초코 라떼',
    nameEn: 'HOT DARK CHOCO LATTE',
    temp: 'HOT',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-iced-darkchoco',
    nameKo: '아이스 다크초코 라떼',
    nameEn: 'ICED DARK CHOCO LATTE',
    temp: 'ICED',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-hot-mintchoco-latte',
    nameKo: '따뜻한 민트초코 라떼',
    nameEn: 'HOT MINT CHOCO LATTE',
    temp: 'HOT',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-iced-mintchoco-latte',
    nameKo: '아이스 민트초코 라떼',
    nameEn: 'ICED MINT CHOCO LATTE',
    temp: 'ICED',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-hot-greentea-latte',
    nameKo: '따뜻한 녹차 라떼',
    nameEn: 'HOT GREEN TEA LATTE',
    temp: 'HOT',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-iced-greentea-latte',
    nameKo: '아이스 녹차 라떼',
    nameEn: 'ICED GREEN TEA LATTE',
    temp: 'ICED',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-hot-blacktea-latte',
    nameKo: '따뜻한 홍차 라떼',
    nameEn: 'HOT BLACK TEA LATTE',
    temp: 'HOT',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-iced-blacktea-latte',
    nameKo: '아이스 홍차 라떼',
    nameEn: 'ICED BLACK TEA LATTE',
    temp: 'ICED',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-choco-banana',
    nameKo: '아이스 초코바나나 라떼',
    nameEn: 'ICED CHOCO-BANANA LATTE',
    temp: 'ICED',
    subCategory: 'LATTE',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-hot-grain',
    nameKo: '따뜻한 미숫가루 라떼',
    nameEn: 'HOT MIXED GRAIN LATTE',
    temp: 'HOT',
    subCategory: 'LATTE',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-iced-grain',
    nameKo: '아이스 미숫가루 라떼',
    nameEn: 'ICED MIXED GRAIN LATTE',
    temp: 'ICED',
    subCategory: 'LATTE',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-hot-whitechoco',
    nameKo: '따뜻한 화이트초코',
    nameEn: 'HOT WHITE CHOCO',
    temp: 'HOT',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-iced-whitechoco',
    nameKo: '아이스 화이트초코',
    nameEn: 'ICED WHITE CHOCO',
    temp: 'ICED',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-hot-purple-sweetpotato',
    nameKo: '따뜻한 자색고구마',
    nameEn: 'HOT SWEET POTATO LATTE',
    temp: 'HOT',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-iced-purple-sweetpotato',
    nameKo: '아이스 자색고구마',
    nameEn: 'ICED SWEET POTATO LATTE',
    temp: 'ICED',
    subCategory: 'LATTE',
    packageDiff: 800,
    singlePrice: 4800,
  },
  {
    id: 'b-iced-jollypong-latte',
    nameKo: '아이스 조리퐁라떼',
    nameEn: 'ICED JOLLYPONG LATTE',
    temp: 'ICED',
    subCategory: 'LATTE',
    packageDiff: 500,
    singlePrice: 4500,
  },

  // 3. TEA (티 & 아이스티)
  {
    id: 'b-peach-iced-tea',
    nameKo: '복숭아 아이스티',
    nameEn: 'ICED TEA PEACH',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-zero-peach-tea',
    nameKo: '복숭아 아이스티 제로',
    nameEn: 'PEACH ICED TEA ZERO',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-lemon-iced-tea',
    nameKo: '레몬 아이스티',
    nameEn: 'ICED TEA LEMON',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-iced-mango-peach',
    nameKo: '망고 피치',
    nameEn: 'MANGO PEACH TEA',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-hot-earlgrey',
    nameKo: '따뜻한 얼그레이 티',
    nameEn: 'HOT EARL GREY TEA',
    temp: 'HOT',
    subCategory: 'TEA',
    packageDiff: 200,
    singlePrice: 4200,
  },
  {
    id: 'b-iced-earlgrey',
    nameKo: '아이스 얼그레이 티',
    nameEn: 'ICED EARL GREY TEA',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 200,
    singlePrice: 4200,
  },
  {
    id: 'b-hot-chamomile',
    nameKo: '따뜻한 카모마일 티',
    nameEn: 'HOT CHAMOMILE TEA',
    temp: 'HOT',
    subCategory: 'TEA',
    packageDiff: 200,
    singlePrice: 4200,
  },
  {
    id: 'b-iced-chamomile',
    nameKo: '아이스 카모마일 티',
    nameEn: 'ICED CHAMOMILE TEA',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 200,
    singlePrice: 4200,
  },
  {
    id: 'b-hot-peppermint',
    nameKo: '따뜻한 페퍼민트 티',
    nameEn: 'HOT PEPPERMINT TEA',
    temp: 'HOT',
    subCategory: 'TEA',
    packageDiff: 200,
    singlePrice: 4200,
  },
  {
    id: 'b-iced-peppermint',
    nameKo: '아이스 페퍼민트 티',
    nameEn: 'ICED PEPPERMINT TEA',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 200,
    singlePrice: 4200,
  },
  {
    id: 'b-hot-apple-tea',
    nameKo: '따뜻한 애플 티',
    nameEn: 'HOT APPLE TEA',
    temp: 'HOT',
    subCategory: 'TEA',
    packageDiff: 200,
    singlePrice: 4200,
  },
  {
    id: 'b-iced-apple-tea',
    nameKo: '아이스 애플 티',
    nameEn: 'ICED APPLE TEA',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 200,
    singlePrice: 4200,
  },
  {
    id: 'b-hot-lemon-tea',
    nameKo: '따뜻한 레몬차',
    nameEn: 'HOT LEMON TEA',
    temp: 'HOT',
    subCategory: 'TEA',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-iced-lemon-tea',
    nameKo: '아이스 레몬차',
    nameEn: 'ICED LEMON TEA',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-hot-citron-tea',
    nameKo: '따뜻한 유자차',
    nameEn: 'HOT CITRON TEA',
    temp: 'HOT',
    subCategory: 'TEA',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-iced-citron-tea',
    nameKo: '아이스 유자차',
    nameEn: 'ICED CITRON TEA',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-hot-grapefruit-tea',
    nameKo: '따뜻한 자몽차',
    nameEn: 'HOT GRAPEFRUIT TEA',
    temp: 'HOT',
    subCategory: 'TEA',
    packageDiff: 500,
    singlePrice: 4500,
  },
  {
    id: 'b-iced-grapefruit-tea',
    nameKo: '아이스 자몽차',
    nameEn: 'ICED GRAPEFRUIT TEA',
    temp: 'ICED',
    subCategory: 'TEA',
    packageDiff: 500,
    singlePrice: 4500,
  },

  // 4. KOMBU TEA (콤부차)
  {
    id: 'b-peach-combu',
    nameKo: '복숭아 콤부차',
    nameEn: 'PEACH KOMBU TEA',
    temp: 'ICED',
    subCategory: 'KOMBU TEA',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-lemon-combu',
    nameKo: '레몬 콤부차',
    nameEn: 'LEMON KOMBU TEA',
    temp: 'ICED',
    subCategory: 'KOMBU TEA',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-citron-combu',
    nameKo: '유자 콤부차',
    nameEn: 'CITRON KOMBU TEA',
    temp: 'ICED',
    subCategory: 'KOMBU TEA',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-plum-combu',
    nameKo: '매실 콤부차',
    nameEn: 'GREEN PLUM KOMBU TEA',
    temp: 'ICED',
    subCategory: 'KOMBU TEA',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-pineapple-combu',
    nameKo: '파인애플 콤부차',
    nameEn: 'PINEAPPLE KOMBU TEA',
    temp: 'ICED',
    subCategory: 'KOMBU TEA',
    packageDiff: 0,
    singlePrice: 4000,
  },
  {
    id: 'b-berry-combu',
    nameKo: '베리 콤부차',
    nameEn: 'BERRY KOMBU TEA',
    temp: 'ICED',
    subCategory: 'KOMBU TEA',
    packageDiff: 0,
    singlePrice: 4000,
  },

  // 5. ADE (에이드)
  {
    id: 'b-lemon-ade',
    nameKo: '레몬 에이드',
    nameEn: 'LEMON ADE',
    temp: 'ICED',
    subCategory: 'ADE',
    packageDiff: 1500,
    singlePrice: 5500,
  },
  {
    id: 'b-mango-ade',
    nameKo: '망고 에이드',
    nameEn: 'MANGO ADE',
    temp: 'ICED',
    subCategory: 'ADE',
    packageDiff: 1500,
    singlePrice: 5500,
  },
  {
    id: 'b-grapefruit-ade',
    nameKo: '자몽 에이드',
    nameEn: 'GRAPEFRUIT ADE',
    temp: 'ICED',
    subCategory: 'ADE',
    packageDiff: 1500,
    singlePrice: 5500,
  },
  {
    id: 'b-peach-ade',
    nameKo: '복숭아 에이드',
    nameEn: 'PEACH ADE',
    temp: 'ICED',
    subCategory: 'ADE',
    packageDiff: 1500,
    singlePrice: 5500,
  },
  {
    id: 'b-cherry-coke',
    nameKo: '체리콕',
    nameEn: 'CHERRY COKE',
    temp: 'ICED',
    subCategory: 'ADE',
    packageDiff: 1500,
    singlePrice: 5500,
  },

  // 6. Fruit Juice (생과일 주스)
  {
    id: 'b-strawberry-juice',
    nameKo: '딸기 주스',
    nameEn: 'STRAWBERRY JUICE',
    temp: 'ICED',
    subCategory: 'Fruit Juice',
    packageDiff: 2000,
    singlePrice: 6000,
  },
  {
    id: 'b-strawberry-banana-juice',
    nameKo: '딸기 바나나 주스',
    nameEn: 'STRAWBERRY BANANA JUICE',
    temp: 'ICED',
    subCategory: 'Fruit Juice',
    packageDiff: 2000,
    singlePrice: 6000,
  },
  {
    id: 'b-mango-juice',
    nameKo: '망고 주스',
    nameEn: 'MANGO JUICE',
    temp: 'ICED',
    subCategory: 'Fruit Juice',
    packageDiff: 2000,
    singlePrice: 6000,
  },

  // 7. SMOOTHIE (요거트 스무디)
  {
    id: 'b-plain-smoothie',
    nameKo: '플레인 요거트 스무디',
    nameEn: 'PLAIN YOGURT SMOOTHIE',
    temp: 'ICED',
    subCategory: 'SMOOTHIE',
    packageDiff: 2000,
    singlePrice: 6000,
  },
  {
    id: 'b-strawberry-smoothie',
    nameKo: '딸기 요거트 스무디',
    nameEn: 'STRAWBERRY YOGURT SMOOTHIE',
    temp: 'ICED',
    subCategory: 'SMOOTHIE',
    packageDiff: 2000,
    singlePrice: 6000,
  },
  {
    id: 'b-mango-smoothie',
    nameKo: '망고 요거트 스무디',
    nameEn: 'MANGO YOGURT SMOOTHIE',
    temp: 'ICED',
    subCategory: 'SMOOTHIE',
    packageDiff: 2000,
    singlePrice: 6000,
  },
  {
    id: 'b-peach-smoothie',
    nameKo: '복숭아 요거트 스무디',
    nameEn: 'PEACH YOGURT SMOOTHIE',
    temp: 'ICED',
    subCategory: 'SMOOTHIE',
    packageDiff: 2000,
    singlePrice: 6000,
  },

  // 8. SHAKE (쉐이크)
  {
    id: 'b-vanilla-shake',
    nameKo: '바닐라 쉐이크',
    nameEn: 'VANILLA SHAKE',
    temp: 'ICED',
    subCategory: 'SHAKE',
    packageDiff: 2000,
    singlePrice: 6000,
  },
  {
    id: 'b-choco-shake',
    nameKo: '초코 쉐이크',
    nameEn: 'CHOCOLATE SHAKE',
    temp: 'ICED',
    subCategory: 'SHAKE',
    packageDiff: 2000,
    singlePrice: 6000,
  },
  {
    id: 'b-mintchoco-shake',
    nameKo: '민트초코 쉐이크',
    nameEn: 'MINT CHOCOLATE SHAKE',
    temp: 'ICED',
    subCategory: 'SHAKE',
    packageDiff: 2000,
    singlePrice: 6000,
  },
  {
    id: 'b-greentea-shake',
    nameKo: '녹차 쉐이크',
    nameEn: 'GREEN TEA SHAKE',
    temp: 'ICED',
    subCategory: 'SHAKE',
    packageDiff: 2000,
    singlePrice: 6000,
  },
];

// 식사, 디저트, 스낵 데이터 (Easy KIOSK 실물 기반)
export const FOOD_ITEMS: MenuItem[] = [
  // 1. 라면 & 식사류 (MEAL)
  {
    id: 'f-ramen',
    name: '라면 (전제품 동일가격)',
    price: 4000,
    category: 'meal',
    categoryKo: '라면/음식',
    note: '대파·숙주·떡·계란 토핑 바 무료',
    isPopular: true,
  },
  {
    id: 'f-chicken',
    name: '치킨',
    price: 5000,
    category: 'meal',
    categoryKo: '라면/음식',
    isPopular: true,
  },
  { id: 'f-dumpling', name: '만두', price: 4000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-fried-rice', name: '볶음밥', price: 4000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-jumeokbap', name: '주먹밥', price: 2000, category: 'meal', categoryKo: '라면/음식' },
  {
    id: 'f-kimbap',
    name: '김밥',
    price: 4800,
    category: 'meal',
    categoryKo: '라면/음식',
  },
  {
    id: 'f-tteokbokki-masitta',
    name: '떡볶이 (마시따)',
    price: 4000,
    category: 'meal',
    categoryKo: '라면/음식',
  },
  {
    id: 'f-tteokbokki-orig',
    name: '떡볶이 (오리지날)',
    price: 4800,
    category: 'meal',
    categoryKo: '라면/음식',
    isPopular: true,
  },
  { id: 'f-sotteok', name: '소떡', price: 3000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-hotdog', name: '핫도그', price: 2500, category: 'meal', categoryKo: '라면/음식' },
  {
    id: 'f-frank',
    name: '닭가슴살 후랑크',
    price: 1800,
    category: 'meal',
    categoryKo: '라면/음식',
  },
  { id: 'f-instant-rice', name: '햇반', price: 2000, category: 'meal', categoryKo: '라면/음식' },
  {
    id: 'f-baked-egg',
    name: '구운계란',
    price: 2000,
    category: 'meal',
    categoryKo: '라면/음식',
  },
  { id: 'f-kimchi', name: '김치', price: 1800, category: 'meal', categoryKo: '라면/음식' },

  // 2. 젤라또 & 디저트 & 베이커리 (DESSERT)
  {
    id: 'd-gelato',
    name: '젤라또',
    price: 4000,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
    isPopular: true,
  },
  {
    id: 'd-real-brownie',
    name: '리얼브라우니',
    price: 2500,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
  },
  {
    id: 'd-ddung-nancier',
    name: '뚱낭시에',
    price: 2500,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
  },
  {
    id: 'd-castella',
    name: '카스테라',
    price: 3000,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
  },
  {
    id: 'd-bun',
    name: '오리지날 번',
    price: 2500,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
  },
  {
    id: 'd-roll-cake',
    name: '롤케익',
    price: 2500,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
    isSoldOut: true,
  },
  {
    id: 'd-cookies',
    name: '쿠키류',
    price: 2500,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
    isSoldOut: true,
  },
  {
    id: 'd-samanko',
    name: '붕어싸만코',
    price: 1500,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
  },
  {
    id: 'd-cone-ice',
    name: '콘아이스크림',
    price: 1500,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
  },
  {
    id: 'd-chal-ice',
    name: '찰떡아이스',
    price: 1500,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
  },
  {
    id: 'd-bar-ice',
    name: '막대아이스크림',
    price: 1000,
    category: 'dessert',
    categoryKo: '젤라또/디저트',
  },

  // 3. 과자 & 캔음료 (SNACK)
  {
    id: 's-can-drink',
    name: '캔 음료 (전제품 동일가격)',
    price: 2000,
    category: 'snack',
    categoryKo: '과자/음료',
    isPopular: true,
  },
  {
    id: 's-snack-all',
    name: '과자 (전제품 동일가격)',
    price: 2500,
    category: 'snack',
    categoryKo: '과자/음료',
    isPopular: true,
  },
  {
    id: 's-georgia-coldbrew',
    name: '콜드블루 블랙 (조지아)',
    price: 2500,
    category: 'snack',
    categoryKo: '과자/음료',
  },
];
