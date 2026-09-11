export interface PricePackage {
  name: string;
  price: string;
  note: string;
  isPopular?: boolean;
}

export interface BeverageItem {
  id: string;
  nameKo: string;
  nameEn?: string;
  temp: 'HOT' | 'ICED' | 'BOTH';
  subCategory: '아이스티/티' | '콤부차' | '라떼/음료' | '에이드' | '스무디/생과일' | '쉐이크';
  packageDiff: number; // 패키지 선택 시 추가금 (0, 200, 500, 1500, 2000)
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
  { name: '2시간 + 기본 음료', price: '9,500원', note: '기본 음료 포함 · 최고 인기 패키지', isPopular: true },
  { name: '3시간 + 기본 음료', price: '12,500원', note: '기본 음료 포함' },
  { name: '5시간 + 기본 음료', price: '18,000원', note: '기본 음료 포함' },
  { name: '평일 종일권', price: '20,000원', note: '평일 한정 하루 종일 무제한 이용' },
];

// 음료 데이터 (단품 기본가 4,000원 기준 + 패키지 차액)
export const BEVERAGE_ITEMS: BeverageItem[] = [
  // 1. 기본 제공 (+0원 / 단품 4,000원)
  { id: 'b-peach-iced-tea', nameKo: '복숭아 아이스티', nameEn: 'ICED TEA PEACH', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-lemon-iced-tea', nameKo: '레몬 아이스티', nameEn: 'ICED TEA LEMON', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-zero-peach-tea', nameKo: '제로 복숭아 아이스티', nameEn: 'ICED TEA ZERO SUGAR', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-choco-banana', nameKo: '아이스 초코바나나', nameEn: 'ICED CHOCO-BANANA LATTE', temp: 'ICED', subCategory: '라떼/음료', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-hot-grain', nameKo: '따뜻한 미숫가루', nameEn: 'HOT MIXED GRAIN LATTE', temp: 'HOT', subCategory: '라떼/음료', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-iced-grain', nameKo: '아이스 미숫가루', nameEn: 'ICED MIXED GRAIN LATTE', temp: 'ICED', subCategory: '라떼/음료', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-peach-combu', nameKo: '아이스 복숭아 콤부차', nameEn: 'ICED PEACH COMBU TEA', temp: 'ICED', subCategory: '콤부차', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-lemon-combu', nameKo: '아이스 레몬 콤부차', nameEn: 'ICED LEMON COMBU TEA', temp: 'ICED', subCategory: '콤부차', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-berry-combu', nameKo: '아이스 베리 콤부차', nameEn: 'ICED BERRY COMBU TEA', temp: 'ICED', subCategory: '콤부차', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-citron-combu', nameKo: '아이스 유자 콤부차', nameEn: 'ICED CITRON COMBU TEA', temp: 'ICED', subCategory: '콤부차', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-pineapple-combu', nameKo: '아이스 파인애플 콤부차', nameEn: 'ICED PINEAPPLE COMBU TEA', temp: 'ICED', subCategory: '콤부차', packageDiff: 0, singlePrice: 4000 },
  { id: 'b-plum-combu', nameKo: '아이스 매실 콤부차', nameEn: 'ICED PLUM COMBU TEA', temp: 'ICED', subCategory: '콤부차', packageDiff: 0, singlePrice: 4000 },

  // 2. 프리미엄 티 (+200원 / 단품 4,200원)
  { id: 'b-hot-earlgrey', nameKo: '따뜻한 얼그레이 티', nameEn: 'HOT EARL GREY TEA', temp: 'HOT', subCategory: '아이스티/티', packageDiff: 200, singlePrice: 4200 },
  { id: 'b-iced-earlgrey', nameKo: '아이스 얼그레이 티', nameEn: 'ICED EARL GREY TEA', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 200, singlePrice: 4200 },
  { id: 'b-hot-chamomile', nameKo: '따뜻한 카모마일 티', nameEn: 'HOT CHAMOMILE TEA', temp: 'HOT', subCategory: '아이스티/티', packageDiff: 200, singlePrice: 4200 },
  { id: 'b-iced-chamomile', nameKo: '아이스 카모마일 티', nameEn: 'ICED CHAMOMILE TEA', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 200, singlePrice: 4200 },
  { id: 'b-hot-peppermint', nameKo: '따뜻한 페퍼민트 티', nameEn: 'HOT PEPPERMINT TEA', temp: 'HOT', subCategory: '아이스티/티', packageDiff: 200, singlePrice: 4200 },
  { id: 'b-iced-peppermint', nameKo: '아이스 페퍼민트 티', nameEn: 'ICED PEPPERMINT TEA', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 200, singlePrice: 4200 },

  // 3. 과일차 & 시그니처 (+500원 / 단품 4,500원)
  { id: 'b-ashotchu', nameKo: '아샷추 (아이스티+에스프레소)', nameEn: 'ICED TEA WITH ESPRESSO', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 500, singlePrice: 4500 },
  { id: 'b-hot-lemon-tea', nameKo: '따뜻한 레몬차', nameEn: 'HOT LEMON TEA', temp: 'HOT', subCategory: '아이스티/티', packageDiff: 500, singlePrice: 4500 },
  { id: 'b-iced-lemon-tea', nameKo: '아이스 레몬차', nameEn: 'ICED LEMON TEA', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 500, singlePrice: 4500 },
  { id: 'b-hot-citron-tea', nameKo: '따뜻한 유자차', nameEn: 'HOT CITRON TEA', temp: 'HOT', subCategory: '아이스티/티', packageDiff: 500, singlePrice: 4500 },
  { id: 'b-iced-citron-tea', nameKo: '아이스 유자차', nameEn: 'ICED CITRON TEA', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 500, singlePrice: 4500 },
  { id: 'b-iced-mango-peach', nameKo: '아이스 망고피치', nameEn: 'ICED MANGO PEACH', temp: 'ICED', subCategory: '아이스티/티', packageDiff: 500, singlePrice: 4500 },

  // 4. 에이드 (+1,500원 / 단품 5,500원)
  { id: 'b-lemon-ade', nameKo: '레몬 에이드', nameEn: 'LEMON ADE', temp: 'ICED', subCategory: '에이드', packageDiff: 1500, singlePrice: 5500 },
  { id: 'b-mango-ade', nameKo: '망고 에이드', nameEn: 'MANGO ADE', temp: 'ICED', subCategory: '에이드', packageDiff: 1500, singlePrice: 5500 },
  { id: 'b-grapefruit-ade', nameKo: '자몽 에이드', nameEn: 'GRAPEFRUIT ADE', temp: 'ICED', subCategory: '에이드', packageDiff: 1500, singlePrice: 5500 },
  { id: 'b-peach-ade', nameKo: '복숭아 에이드', nameEn: 'PEACH ADE', temp: 'ICED', subCategory: '에이드', packageDiff: 1500, singlePrice: 5500 },
  { id: 'b-cherry-coke', nameKo: '체리콕', nameEn: 'CHERRY COKE', temp: 'ICED', subCategory: '에이드', packageDiff: 1500, singlePrice: 5500 },

  // 5. 요거트 스무디 & 생과일 주스 (+2,000원 / 단품 6,000원)
  { id: 'b-plain-smoothie', nameKo: '플레인 요거트 스무디', nameEn: 'PLAIN YOGURT SMOOTHIE', temp: 'ICED', subCategory: '스무디/생과일', packageDiff: 2000, singlePrice: 6000 },
  { id: 'b-strawberry-smoothie', nameKo: '딸기 요거트 스무디', nameEn: 'STRAWBERRY YOGURT SMOOTHIE', temp: 'ICED', subCategory: '스무디/생과일', packageDiff: 2000, singlePrice: 6000 },
  { id: 'b-mango-smoothie', nameKo: '망고 요거트 스무디', nameEn: 'MANGO YOGURT SMOOTHIE', temp: 'ICED', subCategory: '스무디/생과일', packageDiff: 2000, singlePrice: 6000 },
  { id: 'b-peach-smoothie', nameKo: '복숭아 요거트 스무디', nameEn: 'PEACH YOGURT SMOOTHIE', temp: 'ICED', subCategory: '스무디/생과일', packageDiff: 2000, singlePrice: 6000 },
  { id: 'b-strawberry-juice', nameKo: '딸기 생과일 주스', nameEn: 'STRAWBERRY JUICE', temp: 'ICED', subCategory: '스무디/생과일', packageDiff: 2000, singlePrice: 6000 },

  // 6. 쉐이크 (+2,000원 / 단품 6,000원)
  { id: 'b-vanilla-shake', nameKo: '바닐라 쉐이크', nameEn: 'VANILLA SHAKE', temp: 'ICED', subCategory: '쉐이크', packageDiff: 2000, singlePrice: 6000 },
  { id: 'b-choco-shake', nameKo: '초코 쉐이크', nameEn: 'CHOCOLATE SHAKE', temp: 'ICED', subCategory: '쉐이크', packageDiff: 2000, singlePrice: 6000 },
  { id: 'b-mintchoco-shake', nameKo: '민트초코 쉐이크', nameEn: 'MINT CHOCOLATE SHAKE', temp: 'ICED', subCategory: '쉐이크', packageDiff: 2000, singlePrice: 6000 },
  { id: 'b-greentea-shake', nameKo: '녹차 쉐이크', nameEn: 'GREEN TEA SHAKE', temp: 'ICED', subCategory: '쉐이크', packageDiff: 2000, singlePrice: 6000 },
];

// 식사, 디저트, 스낵 데이터 (Easy KIOSK 실물 기반)
export const FOOD_ITEMS: MenuItem[] = [
  // 1. 라면 & 식사류 (MEAL)
  { id: 'f-ramen', name: '라면 (전제품 동일가격)', price: 4000, category: 'meal', categoryKo: '라면/음식', note: '대파·숙주·떡·계란 토핑 바 무료', isPopular: true },
  { id: 'f-chicken', name: '치킨', price: 4800, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-tteokbokki-orig', name: '떡볶이 (오리지날)', price: 4800, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-kimbap', name: '김밥 (11시 45분 입고)', price: 4800, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-dumpling', name: '만두', price: 4000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-fried-rice', name: '볶음밥', price: 4000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-cup-rice', name: '컵밥', price: 4000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-tteokbokki-cup', name: '떡볶이 (컵)', price: 4000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-pizza', name: '피자', price: 3000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-sotteok', name: '소떡', price: 3000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-hotdog', name: '핫도그', price: 2500, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-samgak', name: '삼각김밥', price: 2000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-instant-rice', name: '햇반', price: 2000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-baked-egg', name: '구운계란 (3개)', price: 2000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-tuna', name: '참치 토핑', price: 2000, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-frank', name: '닭가슴살 후랑크', price: 1800, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-kimchi', name: '김치', price: 1800, category: 'meal', categoryKo: '라면/음식' },
  { id: 'f-gim', name: '김', price: 1000, category: 'meal', categoryKo: '라면/음식' },

  // 2. 젤라또 & 디저트 (DESSERT)
  { id: 'd-gelato', name: '젤라또', price: 4500, category: 'dessert', categoryKo: '젤라또/디저트', isPopular: true },
  { id: 'd-samanko', name: '붕어싸만코', price: 1500, category: 'dessert', categoryKo: '젤라또/디저트' },
  { id: 'd-cone-ice', name: '콘 아이스크림', price: 1500, category: 'dessert', categoryKo: '젤라또/디저트' },
  { id: 'd-chal-ice', name: '찰떡아이스', price: 1500, category: 'dessert', categoryKo: '젤라또/디저트' },
  { id: 'd-macaron', name: '마카롱', price: 1200, category: 'dessert', categoryKo: '젤라또/디저트' },
  { id: 'd-bar-ice', name: '막대 아이스크림', price: 1000, category: 'dessert', categoryKo: '젤라또/디저트' },

  // 3. 과자 & 캔음료 (SNACK)
  { id: 's-snack-all', name: '봉지 과자 (전제품 동일가격)', price: 2500, category: 'snack', categoryKo: '과자/음료', isPopular: true },
  { id: 's-georgia-coldbrew', name: '조지아 콜드브루 블랙', price: 2500, category: 'snack', categoryKo: '과자/음료' },
  { id: 's-georgia-latte', name: '조지아 라떼', price: 2500, category: 'snack', categoryKo: '과자/음료' },
  { id: 's-can-drink', name: '캔 음료 (전제품 동일가격)', price: 2000, category: 'snack', categoryKo: '과자/음료' },
  { id: 's-water', name: '생수 (1병)', price: 1000, category: 'snack', categoryKo: '과자/음료' },
];
