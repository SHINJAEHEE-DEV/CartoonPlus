import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

function extractInitialConsonants(text) {
  if (!text) return '';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 44032 && code <= 55203) {
      const choseongIndex = Math.floor((code - 44032) / 588);
      result += CHOSEONG[choseongIndex];
    } else if (code >= 12593 && code <= 12622) {
      result += text[i];
    } else if (/[a-zA-Z0-9]/.test(text[i])) {
      result += text[i].toLowerCase();
    }
  }
  return result;
}

function normalizeTitle(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^가-힣a-zA-Z0-9]/g, '');
}

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  // Skip header: "title","number","genre","author"
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Match CSV fields enclosed in quotes: "val1","val2","val3","val4"
    const regex = /"([^"]*)"/g;
    const matches = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      matches.push(match[1]);
    }

    if (matches.length >= 4) {
      const rawTitle = matches[0].trim();
      const shelfNum = matches[1].trim();
      const genre = matches[2].trim() || '코믹스';
      const author = matches[3].trim() || '미상';

      // Parse title and volume range
      // e.g. "블리치 68" -> title: "블리치", vol: "1~68권"
      // e.g. "썅년의 미학, 플러스 2" -> title: "썅년의 미학, 플러스", vol: "1~2권"
      // e.g. "내일은 발명왕" -> title: "내일은 발명왕", vol: "전권"
      let cleanTitle = rawTitle;
      let volumeRange = '1권~';

      const volMatch = rawTitle.match(/^(.+?)\s+(\d+)$/);
      if (volMatch) {
        cleanTitle = volMatch[1].trim();
        const maxVol = parseInt(volMatch[2], 10);
        volumeRange = maxVol === 1 ? '1권' : `1~${maxVol}권`;
      } else {
        volumeRange = '전권';
      }

      rows.push({
        rawTitle,
        title: cleanTitle,
        shelfLocation: shelfNum ? `${shelfNum}번 서가` : '카운터 문의',
        genre: genre.replace(/,/g, '/'),
        author: author,
        volumeRange,
      });
    }
  }

  return rows;
}

const csvPath = path.resolve(__dirname, '../docs/assets/seoul_univ_2026-Sep-04_1021.csv');
const parsed = parseCsv(csvPath);

console.log(`Parsed ${parsed.length} books from CSV`);

// Build Books and BookInventory arrays
const books = [];
const inventories = [];
const bookMap = new Map();

parsed.forEach((item, index) => {
  const norm = normalizeTitle(item.title);
  let bookId = bookMap.get(norm);
  
  if (!bookId) {
    bookId = `b-snu-${String(index + 1).padStart(4, '0')}`;
    bookMap.set(norm, bookId);

    books.push({
      id: bookId,
      title: item.title,
      normalizedTitle: norm,
      initialConsonants: extractInitialConsonants(item.title),
      author: item.author,
      category: item.genre,
      createdAt: '2026-09-04T10:21:00Z',
    });
  }

  inventories.push({
    id: `inv-snu-${String(index + 1).padStart(4, '0')}`,
    storeId: 'snu',
    bookId: bookId,
    volumeRange: item.volumeRange,
    shelfLocation: item.shelfLocation,
    updatedAt: '2026-09-04T10:21:00Z',
  });
});

// Also create representative inventories for Jamsil store for top popular books
const popularTitles = [
  '원피스', '귀멸의 칼날', '체인소 맨', '나츠메 우인장', '블리치', '주술회전', '스파이 패밀리',
  '최애의 아이', '괴수 8호', '하이큐!!', '명탐정 코난', '도라에몽', '슬램덩크 신장재편판',
  '유미의 세포들', '재혼 황후', '여신강림', '이번 생도 잘 부탁해', '치즈인더트랩 시즌1',
  '치즈인더트랩 시즌2', '치즈인더트랩 시즌3', '치즈인더트랩 시즌4', '정년이', '신비'
];

popularTitles.forEach((popTitle, idx) => {
  const norm = normalizeTitle(popTitle);
  let targetBook = books.find(b => b.normalizedTitle === norm);
  
  if (!targetBook) {
    const bookId = `b-pop-${String(idx + 1).padStart(4, '0')}`;
    targetBook = {
      id: bookId,
      title: popTitle,
      normalizedTitle: norm,
      initialConsonants: extractInitialConsonants(popTitle),
      author: '인기 작가',
      category: '코믹스/웹툰',
      createdAt: '2026-09-04T10:21:00Z',
    };
    books.push(targetBook);
  }

  inventories.push({
    id: `inv-jamsil-${String(idx + 1).padStart(4, '0')}`,
    storeId: 'jamsil',
    bookId: targetBook.id,
    volumeRange: '전권 보유',
    shelfLocation: `J-${String((idx % 12) + 1).padStart(2, '0')} 서가 (인기작)`,
    updatedAt: '2026-09-04T10:21:00Z',
  });
});

const tsContent = `// Auto-generated seed data from docs/assets/seoul_univ_2026-Sep-04_1021.csv
import { Store, Book, BookInventory, EntertainmentItem, MenuItem, BroadcastPreset, AdminUser, BookRequest } from '../types/domain';

export const INITIAL_STORES: Store[] = [
  {
    id: 'snu',
    name: '서울대입구역점',
    address: '서울 관악구 관악로 155 3층 (봉천동 856-5)',
    subwayInfo: '서울대입구역 3번 출구 도보 1분 (라붐아울렛 건너편)',
    phone: '02-888-1234',
    hours: '매일 10:00 ~ 23:00 (연중무휴)',
    parking: '건물 내 주차 가능 (카운터 주차 할인권 문의)',
    isActive: true,
    mapUrl: 'https://map.kakao.com/link/search/카툰플러스 서울대입구역점',
    facilities: ['3만 권 만화/웹툰', '넷플릭스 룸', '닌텐도 스위치 룸', 'Xbox 시리즈X 룸', '프리미엄 안마의자', '초고속 Wi-Fi', '흡연실', '남/녀 화장실 구분']
  },
  {
    id: 'jamsil',
    name: '잠실점',
    address: '서울 송파구 백제고분로9길 23 2층 (잠실동 190-8)',
    subwayInfo: '잠실새내역 4번 출구 도보 3분 (먹자골목 메인거리)',
    phone: '02-412-5678',
    hours: '월~목 10:00~23:00 / 금 10:00~24:00 / 토 24시간 / 일 10:00~23:00',
    parking: '인근 유료 주차장 지원 (매장 영수증 제시 시 1시간 할인)',
    isActive: true,
    mapUrl: 'https://map.kakao.com/link/search/카툰플러스 잠실점',
    facilities: ['최신 웹툰/단행본', '넷플릭스 프라이빗 룸', '닌텐도 4인 파티룸', '보드게임 전용존', '안마의자 힐링존', '전 좌석 개별 콘센트']
  }
];

export const INITIAL_BOOKS: Book[] = ${JSON.stringify(books, null, 2)};

export const INITIAL_INVENTORIES: BookInventory[] = ${JSON.stringify(inventories, null, 2)};

export const INITIAL_ENTERTAINMENT: EntertainmentItem[] = [
  // 닌텐도 스위치
  { id: 'ent-01', storeId: 'ALL', type: 'NINTENDO', title: '마리오 카트 8 디럭스', genre: '레이싱 / 파티', players: '1~4인', isAvailable: true, sortOrder: 1 },
  { id: 'ent-02', storeId: 'ALL', type: 'NINTENDO', title: '슈퍼 스매시브라더스 얼티밋', genre: '대전 격투', players: '1~4인', isAvailable: true, sortOrder: 2 },
  { id: 'ent-03', storeId: 'ALL', type: 'NINTENDO', title: '슈퍼 마리오 파티 잼버리', genre: '보드 / 파티', players: '1~4인', isAvailable: true, sortOrder: 3 },
  { id: 'ent-04', storeId: 'ALL', type: 'NINTENDO', title: '저스트 댄스 2024', genre: '리듬 / 댄스', players: '1~4인', isAvailable: true, sortOrder: 4 },
  { id: 'ent-05', storeId: 'ALL', type: 'NINTENDO', title: '동물의 숲 (모동숲)', genre: '힐링 / 시뮬레이션', players: '1인', isAvailable: true, sortOrder: 5 },
  { id: 'ent-06', storeId: 'ALL', type: 'NINTENDO', title: '젤다의 전설: 티어스 오브 더 킹덤', genre: '오픈월드 액션', players: '1인', isAvailable: true, sortOrder: 6 },
  { id: 'ent-07', storeId: 'ALL', type: 'NINTENDO', title: '잇 테익스 투 (It Takes Two)', genre: '2인 협동 어드벤처', players: '2인 필수', isAvailable: true, sortOrder: 7 },
  { id: 'ent-08', storeId: 'ALL', type: 'NINTENDO', title: '별의 커비 디스커버리', genre: '3D 액션', players: '1~2인', isAvailable: true, sortOrder: 8 },

  // Xbox Series X
  { id: 'ent-09', storeId: 'ALL', type: 'XBOX', title: '포르자 호라이즌 5', genre: '오픈월드 레이싱', players: '1인', isAvailable: true, sortOrder: 9 },
  { id: 'ent-10', storeId: 'ALL', type: 'XBOX', title: '헤일로 인피니트', genre: 'FPS 슈팅', players: '1인', isAvailable: true, sortOrder: 10 },
  { id: 'ent-11', storeId: 'ALL', type: 'XBOX', title: 'FIFA 24 (EA FC 24)', genre: '스포츠 축구', players: '1~2인', isAvailable: true, sortOrder: 11 },
  { id: 'ent-12', storeId: 'ALL', type: 'XBOX', title: 'NBA 2K24', genre: '스포츠 농구', players: '1~2인', isAvailable: true, sortOrder: 12 },

  // 보드게임
  { id: 'ent-13', storeId: 'ALL', type: 'BOARD_GAME', title: '루미큐브 클래식', genre: '숫자 조합 전략', players: '2~4인', difficulty: '초급', isAvailable: true, sortOrder: 13 },
  { id: 'ent-14', storeId: 'ALL', type: 'BOARD_GAME', title: '스플렌더', genre: '보석 수집 엔진빌딩', players: '2~4인', difficulty: '중급', isAvailable: true, sortOrder: 14 },
  { id: 'ent-15', storeId: 'ALL', type: 'BOARD_GAME', title: '다빈치 코드', genre: '숫자 추리', players: '2~4인', difficulty: '초급', isAvailable: true, sortOrder: 15 },
  { id: 'ent-16', storeId: 'ALL', type: 'BOARD_GAME', title: '할리갈리 딜럭스', genre: '순발력 카드게임', players: '2~6인', difficulty: '초급', isAvailable: true, sortOrder: 16 },
  { id: 'ent-17', storeId: 'ALL', type: 'BOARD_GAME', title: '카탄의 개척자', genre: '자원 거래 영토확장', players: '3~4인', difficulty: '고급', isAvailable: true, sortOrder: 17 },
  { id: 'ent-18', storeId: 'ALL', type: 'BOARD_GAME', title: '뱅! (BANG!)', genre: '서부 마피아 추리', players: '4~7인', difficulty: '중급', isAvailable: true, sortOrder: 18 }
];

export const INITIAL_MENUS: MenuItem[] = [
  // 요금제 패키지 (PACKAGE)
  { id: 'm-01', storeId: 'ALL', category: 'PACKAGE', name: '기본 1시간 (후불)', description: '이후 10분당 500원 자동 추가', price: 3000, sortOrder: 1 },
  { id: 'm-02', storeId: 'ALL', category: 'PACKAGE', name: '2시간 + 기본음료 패키지', description: '아메리카노 or 아이스티 택1 포함', price: 8500, isBest: true, sortOrder: 2 },
  { id: 'm-03', storeId: 'ALL', category: 'PACKAGE', name: '3시간 + 기본음료 패키지', description: '여유롭게 즐기는 인기 1위 세트', price: 11000, isBest: true, sortOrder: 3 },
  { id: 'm-04', storeId: 'ALL', category: 'PACKAGE', name: '5시간 + 기본음료 패키지', description: '만화 정주행 추천 요금제', price: 16000, sortOrder: 4 },
  { id: 'm-05', storeId: 'ALL', category: 'PACKAGE', name: '온종일 무제한 자유이용권', description: '평일 한정 하루 종일 무제한', price: 22000, sortOrder: 5 },

  // 식사류 (MEAL)
  { id: 'm-06', storeId: 'ALL', category: 'MEAL', name: '카툰 얼큰 신라면 + 계란', description: '만화방 시그니처 꼬들 라면', price: 4000, isBest: true, sortOrder: 6 },
  { id: 'm-07', storeId: 'ALL', category: 'MEAL', name: '치즈 폭탄 짜파게티', description: '체다치즈 듬뿍 고소한 풍미', price: 4500, isBest: true, sortOrder: 7 },
  { id: 'm-08', storeId: 'ALL', category: 'MEAL', name: '불닭마요 볶음면', description: '화끈한 매운맛과 부드러운 마요네즈', price: 5000, sortOrder: 8 },
  { id: 'm-09', storeId: 'ALL', category: 'MEAL', name: '김치볶음밥 & 반숙후라이', description: '단짠 매콤한 든든 한끼 식사', price: 6500, isBest: true, sortOrder: 9 },
  { id: 'm-10', storeId: 'ALL', category: 'MEAL', name: '데리야끼 치킨마요 덮밥', description: '달콤 짭조름한 치킨 텐더 덮밥', price: 6800, sortOrder: 10 },

  // 스낵/디저트 (SNACK)
  { id: 'm-11', storeId: 'ALL', category: 'SNACK', name: '뿌링 소떡소떡', description: '휴게소 인기 간식 바삭 쫄깃', price: 3500, sortOrder: 11 },
  { id: 'm-12', storeId: 'ALL', category: 'SNACK', name: '바삭 모둠 감자튀김', description: '웨지 & 크링클컷 케이준 시즈닝', price: 4500, sortOrder: 12 },
  { id: 'm-13', storeId: 'ALL', category: 'SNACK', name: '허니버터 갈릭 크로플', description: '바삭 달콤 프랑스산 버터 크로플', price: 4800, isBest: true, sortOrder: 13 },

  // 음료/커피 (BEV)
  { id: 'm-14', storeId: 'ALL', category: 'BEV', name: '아이스 아메리카노 (Venti)', description: '고소한 다크 초콜릿 풍미 원두', price: 3500, isBest: true, sortOrder: 14 },
  { id: 'm-15', storeId: 'ALL', category: 'BEV', name: '복숭아 / 레몬 아이스티', description: '달콤 시원한 청량 과일 음료', price: 3500, sortOrder: 15 },
  { id: 'm-16', storeId: 'ALL', category: 'BEV', name: '딸기 듬뿍 요거트 스무디', description: '생딸기 퓨레와 상큼 요거트', price: 5000, isBest: true, sortOrder: 16 },
  { id: 'm-17', storeId: 'ALL', category: 'BEV', name: '자몽 에이드 (생과즙)', description: '톡 쏘는 탄산과 쌉싸름한 자몽', price: 4800, sortOrder: 17 }
];

export const INITIAL_BROADCAST_PRESETS: BroadcastPreset[] = [
  {
    id: 'bcast-01',
    presetKey: 'drinkReady',
    title: '☕ 음료/음식 픽업',
    messageText: '주문하신 음료와 음식이 준비되었습니다. 카운터 픽업대로 와주시기 바랍니다. 감사합니다.',
    sortOrder: 1
  },
  {
    id: 'bcast-02',
    presetKey: 'idCheck',
    title: '🪪 밤 10시 신분증 검사',
    messageText: '안내 말씀 드립니다. 청소년 보호법에 따라 밤 10시 이후 미성년자의 매장 이용이 제한됩니다. 신분증 확인에 협조 부탁드립니다.',
    sortOrder: 2
  },
  {
    id: 'bcast-03',
    presetKey: 'closing30',
    title: '🌙 마감 30분 전',
    messageText: '고객 여러분 안녕하십니까. 카툰플러스 마감 30분 전입니다. 이용 중이신 좌석 정리 및 퇴장 준비를 부탁드립니다.',
    sortOrder: 3
  },
  {
    id: 'bcast-04',
    presetKey: 'closing10',
    title: '⏰ 마감 10분 전',
    messageText: '고객 여러분 안녕하십니까. 영업 마감 10분 전입니다. 소지품을 챙겨주시고 보신 도서는 도서 반납대로 반납해 주시기 바랍니다.',
    sortOrder: 4
  },
  {
    id: 'bcast-05',
    presetKey: 'noFood',
    title: '🚫 외부음식 반입 제한',
    messageText: '안내 말씀 드립니다. 쾌적한 매장 환경 유지를 위해 외부 음식물 반입 및 취식을 엄격히 금지하고 있습니다. 협조 부탁드립니다.',
    sortOrder: 5
  },
  {
    id: 'bcast-06',
    presetKey: 'quiet',
    title: '🤫 정숙 및 에티켓',
    messageText: '안내 말씀 드립니다. 카툰플러스는 편안한 힐링 공간입니다. 타 이용자를 배려하여 큰 소리 대화나 소음을 자제해 주시기 바랍니다.',
    sortOrder: 6
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  { id: 'admin-01', storeId: 'snu', username: 'snu_staff', role: 'STAFF' },
  { id: 'admin-02', storeId: 'jamsil', username: 'jamsil_staff', role: 'STAFF' },
  { id: 'admin-03', storeId: 'snu', username: 'admin', role: 'ADMIN' }
];

export const INITIAL_BOOK_REQUESTS: BookRequest[] = [
  {
    id: 'req-01',
    storeId: 'snu',
    title: '괴수 8호 12권',
    author: '마츠모토 나오야',
    volumeRange: '12권 신간',
    userComment: '신간 나왔는데 입고 부탁드려요!',
    status: 'ORDERED',
    adminReply: '발주 완료했습니다. 이번 주 금요일 입고 예정입니다.',
    createdAt: '2026-09-04T15:30:00Z',
    updatedAt: '2026-09-05T09:00:00Z'
  },
  {
    id: 'req-02',
    storeId: 'snu',
    title: '단다단',
    author: '타츠 유키노부',
    volumeRange: '1~14권 전권',
    userComment: '애니메이션 보고 만화책 전권 보고 싶어요',
    status: 'PENDING',
    createdAt: '2026-09-05T14:10:00Z',
    updatedAt: '2026-09-05T14:10:00Z'
  },
  {
    id: 'req-03',
    storeId: 'jamsil',
    title: '장송의 프리렌 13권',
    author: '야마다 카네히토',
    volumeRange: '13권',
    userComment: '잠실점에 최신권 채워주세요~',
    status: 'COMPLETED',
    adminReply: '입고 완료되어 A-04 서가에 비치되었습니다.',
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-04T16:00:00Z'
  }
];
`;

const dataDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
fs.writeFileSync(path.resolve(dataDir, 'seedData.ts'), tsContent, 'utf-8');
console.log('Successfully generated src/data/seedData.ts!');

