// CartoonPlus 정적 에셋 경로 상수

export const MASCOT_ASSETS = {
  logoCircle: '/assets/mascot/mascot_logo_circle.png',
  thinking: '/assets/mascot/mascot_thinking.png',
  reading: '/assets/mascot/mascot_reading.png',
  relaxing: '/assets/mascot/mascot_relaxing.png',
  coffee: '/assets/mascot/mascot_coffee.png',
  gaming: '/assets/mascot/mascot_gaming.png',
  massage: '/assets/mascot/mascot_massage.png',
  ott: '/assets/mascot/mascot_ott.png',
  frontPeek: '/assets/mascot/mascot_front_peek.png',
  sunglasses: '/assets/mascot/mascot_sunglasses.png',
} as const;

export const STORE_PHOTOS = {
  photo1: '/assets/store_photos/store_photo_043.jpg',
  photo2: '/assets/store_photos/store_photo_049.jpg',
  photo3: '/assets/store_photos/store_photo_03.jpg',
  photo01: '/assets/store_photos/store_photo_01.jpg',
  photo02: '/assets/store_photos/store_photo_02.jpg',
} as const;

export type StorePhotoSet = {
  photo1: string;
  photo2: string;
  photo3: string;
};

export const STORE_PHOTOS_BY_SLUG: Record<string, StorePhotoSet> = {
  snu: {
    photo1: '/assets/store_photos/store_photo_043.jpg',
    photo2: '/assets/store_photos/store_photo_049.jpg',
    photo3: '/assets/store_photos/store_photo_03.jpg',
  },
  jamsil: {
    photo1: '/assets/store_photos/store_photo_01.jpg',
    photo2: '/assets/store_photos/store_photo_02.jpg',
    photo3: '/assets/store_photos/store_photo_03.jpg',
  },
  hongdae: {
    photo1: '/assets/store_photos/store_photo_043.jpg',
    photo2: '/assets/store_photos/store_photo_01.jpg',
    photo3: '/assets/store_photos/store_photo_049.jpg',
  },
};

export function getStorePhotos(storeSlug?: string): StorePhotoSet {
  if (storeSlug && STORE_PHOTOS_BY_SLUG[storeSlug]) {
    return STORE_PHOTOS_BY_SLUG[storeSlug];
  }
  return STORE_PHOTOS_BY_SLUG.snu;
}

export const EVENT_BANNERS = {
  weekday: '/assets/events/event_weekday_pass.svg',
  naverRamen: '/assets/events/event_naver_ramen_coupon.svg',
  naverReview: '/assets/events/naver_review_banner.svg',
  snu: '/assets/banners/snu_partnership_banner.png',
  placeholder: '/assets/events/placeholder.svg',
} as const;

export type StaticGameItem = {
  id: string;
  title: string;
  item_type: 'NINTENDO' | 'PLAYSTATION_4' | 'BOARD_GAME';
  players?: string;
  genre?: string;
  quantity?: number;
};

// 잠실점 실측 게임 목록
export const JAMSIL_GAMES: StaticGameItem[] = [
  {
    id: 'jam-nsw-01',
    title: '마리오카트 8 디럭스',
    item_type: 'NINTENDO',
    players: '1-4인',
    genre: '레이싱 / 파티',
  },
  {
    id: 'jam-nsw-02',
    title: '태고의 달인',
    item_type: 'NINTENDO',
    players: '1-2인',
    genre: '리듬 액션',
  },
  {
    id: 'jam-nsw-03',
    title: 'Overcooked! All You Can Eat',
    item_type: 'NINTENDO',
    players: '1-4인',
    genre: '협동 요리',
  },
  {
    id: 'jam-nsw-04',
    title: '슈퍼 마리오 파티 잼버리',
    item_type: 'NINTENDO',
    players: '1-4인',
    genre: '파티 / 보드',
  },
  {
    id: 'jam-nsw-05',
    title: 'Super Bunny Man',
    item_type: 'NINTENDO',
    players: '2인 전용',
    genre: '협동 액션',
  },
  {
    id: 'jam-nsw-06',
    title: '별의 커비 스타 얼라이즈',
    item_type: 'NINTENDO',
    players: '1-4인',
    genre: '액션 어드벤처',
  },
  {
    id: 'jam-ps4-01',
    title: 'It Takes Two',
    item_type: 'PLAYSTATION_4',
    players: '2인 협동',
    genre: '협동 어드벤처',
  },
  {
    id: 'jam-ps4-02',
    title: 'Nobody Saves the World',
    item_type: 'PLAYSTATION_4',
    players: '1-2인',
    genre: '액션 RPG',
  },
  {
    id: 'jam-ps4-03',
    title: 'Overcooked',
    item_type: 'PLAYSTATION_4',
    players: '1-4인',
    genre: '협동 요리',
  },
  {
    id: 'jam-ps4-04',
    title: 'Moving Out 2',
    item_type: 'PLAYSTATION_4',
    players: '1-4인',
    genre: '협동 이사 액션',
  },
  {
    id: 'jam-ps4-05',
    title: 'Roblox',
    item_type: 'PLAYSTATION_4',
    players: '멀티플레이',
    genre: '샌드박스 / 파티',
  },
  {
    id: 'jam-ps4-06',
    title: 'Human Fall Flat',
    item_type: 'PLAYSTATION_4',
    players: '1-2인',
    genre: '물리 퍼즐 액션',
  },
  {
    id: 'jam-ps4-07',
    title: 'Fall Guys',
    item_type: 'PLAYSTATION_4',
    players: '파티 플레이',
    genre: '배틀로얄 파티',
  },
  {
    id: 'jam-ps4-08',
    title: '콜 오브 듀티 Modern Warfare 2',
    item_type: 'PLAYSTATION_4',
    players: '1-2인',
    genre: 'FPS 액션',
  },
];

// 서울대입구역점 기본 게임 목록
export const SNU_GAMES: StaticGameItem[] = [
  {
    id: 'snu-nsw-01',
    title: '슈퍼 마리오 파티 잼버리',
    item_type: 'NINTENDO',
    players: '1-4인',
    genre: '파티/보드',
  },
  {
    id: 'snu-nsw-02',
    title: '오버쿡드! 올유캔잇',
    item_type: 'NINTENDO',
    players: '1-4인',
    genre: '협동 요리',
  },
  {
    id: 'snu-nsw-03',
    title: '폴가이즈 (Fall Guys)',
    item_type: 'NINTENDO',
    players: '1-4인',
    genre: '배틀로얄 파티',
  },
  {
    id: 'snu-nsw-04',
    title: '슈퍼 버니 맨 (Super Bunny Man)',
    item_type: 'NINTENDO',
    players: '2인 전용',
    genre: '협동 액션',
  },
  {
    id: 'snu-nsw-05',
    title: '태고의 달인 쿵딱! 원더풀 페스티벌',
    item_type: 'NINTENDO',
    players: '1-2인',
    genre: '리듬 액션',
  },
  {
    id: 'snu-nsw-06',
    title: '슈퍼 커비 헌터즈',
    item_type: 'NINTENDO',
    players: '1-4인',
    genre: '액션 RPG',
  },
  {
    id: 'snu-nsw-07',
    title: '포켓몬 챔피언스',
    item_type: 'NINTENDO',
    players: '1-2인',
    genre: '배틀/어드벤처',
  },
  {
    id: 'snu-nsw-08',
    title: '리듬 세상 더 베스트 플러스',
    item_type: 'NINTENDO',
    players: '1-4인',
    genre: '리듬 게임',
  },
  {
    id: 'snu-ps4-01',
    title: '잇 테익스 투 (It Takes Two)',
    item_type: 'PLAYSTATION_4',
    players: '2인 전용',
    genre: '협동 어드벤처',
  },
  {
    id: 'snu-ps4-02',
    title: '휴먼: 폴 플랫 (Human Fall Flat)',
    item_type: 'PLAYSTATION_4',
    players: '1-2인',
    genre: '물리 퍼즐 액션',
  },
  {
    id: 'snu-ps4-03',
    title: '오버쿡드 2',
    item_type: 'PLAYSTATION_4',
    players: '1-4인',
    genre: '협동 요리',
  },
  {
    id: 'snu-ps4-04',
    title: '무빙 아웃',
    item_type: 'PLAYSTATION_4',
    players: '1-4인',
    genre: '협동 이사 액션',
  },
  {
    id: 'snu-ps4-05',
    title: '노바디 세이브즈 더 월드',
    item_type: 'PLAYSTATION_4',
    players: '1-2인',
    genre: '액션 RPG',
  },
  {
    id: 'snu-ps4-06',
    title: '태고의 달인 모두 함께 쿵딱쿵!',
    item_type: 'PLAYSTATION_4',
    players: '1-2인',
    genre: '리듬 액션',
  },
  {
    id: 'snu-ps4-07',
    title: '브롤할라',
    item_type: 'PLAYSTATION_4',
    players: '1-4인',
    genre: '난투 액션',
  },
  {
    id: 'snu-ps4-08',
    title: '드래곤볼 제노버스 2',
    item_type: 'PLAYSTATION_4',
    players: '1-2인',
    genre: '대전 격투',
  },
  {
    id: 'snu-ps4-09',
    title: '폴가이즈',
    item_type: 'PLAYSTATION_4',
    players: '파티 플레이',
    genre: '배틀로얄 파티',
  },
  {
    id: 'snu-ps4-10',
    title: '로블록스',
    item_type: 'PLAYSTATION_4',
    players: '멀티플레이',
    genre: '샌드박스',
  },
  {
    id: 'snu-ps4-11',
    title: '콜 오브 듀티',
    item_type: 'PLAYSTATION_4',
    players: '1-2인',
    genre: 'FPS',
  },
];

export const DEFAULT_BOARD_GAMES: StaticGameItem[] = [
  { id: 'bg-01', title: '다빈치코드', item_type: 'BOARD_GAME', quantity: 3, genre: '추리 / 숫자' },
  { id: 'bg-02', title: '스플렌더', item_type: 'BOARD_GAME', quantity: 2, genre: '전략 / 칩 수집' },
  {
    id: 'bg-03',
    title: '루미큐브 클래식',
    item_type: 'BOARD_GAME',
    quantity: 1,
    genre: '숫자 조합',
  },
  { id: 'bg-04', title: '카탄', item_type: 'BOARD_GAME', quantity: 1, genre: '건설 / 협상' },
  { id: 'bg-05', title: '시타델', item_type: 'BOARD_GAME', quantity: 2, genre: '심리 / 전략' },
  { id: 'bg-06', title: '라스베가스', item_type: 'BOARD_GAME', quantity: 1, genre: '주사위 배팅' },
  { id: 'bg-07', title: '우봉고', item_type: 'BOARD_GAME', quantity: 1, genre: '퍼즐 액션' },
  { id: 'bg-08', title: '뱅!', item_type: 'BOARD_GAME', quantity: 1, genre: '마피아 / 서부극' },
  {
    id: 'bg-09',
    title: '로스트 시티',
    item_type: 'BOARD_GAME',
    quantity: 2,
    genre: '2인 전용 탐험',
  },
  { id: 'bg-10', title: '요트다이스', item_type: 'BOARD_GAME', quantity: 1, genre: '주사위 족보' },
];

export function getStaticStoreGames(storeSlug: string): StaticGameItem[] {
  if (storeSlug === 'jamsil') {
    return [...JAMSIL_GAMES, ...DEFAULT_BOARD_GAMES];
  }
  return [...SNU_GAMES, ...DEFAULT_BOARD_GAMES];
}
