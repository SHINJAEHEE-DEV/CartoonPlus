// Auto-generated seed data from docs/assets/seoul_univ_2026-Sep-04_1021.csv
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

export const INITIAL_BOOKS: Book[] = [
  {
    "id": "b-snu-0001",
    "title": "내일은 발명왕",
    "normalizedTitle": "내일은발명왕",
    "initialConsonants": "ㄴㅇㅇㅂㅁㅇ",
    "author": "곰돌이",
    "category": "아이/ 교육",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0002",
    "title": "캐릭캐릭 체인지",
    "normalizedTitle": "캐릭캐릭체인지",
    "initialConsonants": "ㅋㄹㅋㄹㅊㅇㅈ",
    "author": "미상",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0003",
    "title": "캐릭캐릭 체인지 두근두근",
    "normalizedTitle": "캐릭캐릭체인지두근두근",
    "initialConsonants": "ㅋㄹㅋㄹㅊㅇㅈㄷㄱㄷㄱ",
    "author": "미상",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0004",
    "title": "공룡 메카드",
    "normalizedTitle": "공룡메카드",
    "initialConsonants": "ㄱㄹㅁㅋㄷ",
    "author": "미상",
    "category": "아이/ 판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0005",
    "title": "흔한 남매 불꽃 튀는 우리말",
    "normalizedTitle": "흔한남매불꽃튀는우리말",
    "initialConsonants": "ㅎㅎㄴㅁㅂㄲㅌㄴㅇㄹㅁ",
    "author": "한은호",
    "category": "아이/ 교육",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0006",
    "title": "신장판 꿈빛 파티시엘",
    "normalizedTitle": "신장판꿈빛파티시엘",
    "initialConsonants": "ㅅㅈㅍㄲㅂㅍㅌㅅㅇ",
    "author": "마쓰모토 나츠미",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0007",
    "title": "나츠메 우인장",
    "normalizedTitle": "나츠메우인장",
    "initialConsonants": "ㄴㅊㅁㅇㅇㅈ",
    "author": "유키 미도리카와",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0008",
    "title": "블리치",
    "normalizedTitle": "블리치",
    "initialConsonants": "ㅂㄹㅊ",
    "author": "쿠보 타이토",
    "category": "판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0009",
    "title": "GTO",
    "normalizedTitle": "gto",
    "initialConsonants": "gto",
    "author": "토오루 후지사와",
    "category": "일상",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0010",
    "title": "GTO 파라다이스 로스트",
    "normalizedTitle": "gto파라다이스로스트",
    "initialConsonants": "gtoㅍㄹㄷㅇㅅㄹㅅㅌ",
    "author": "토오루 후지사와",
    "category": "일상",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0011",
    "title": "썅년의 미학, 플러스",
    "normalizedTitle": "썅년의미학플러스",
    "initialConsonants": "ㅆㄴㅇㅁㅎㅍㄹㅅ",
    "author": "민서영",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0012",
    "title": "어느 날 공주가 되어버렸다",
    "normalizedTitle": "어느날공주가되어버렸다",
    "initialConsonants": "ㅇㄴㄴㄱㅈㄱㄷㅇㅂㄹㄷ",
    "author": "스푼, 플루토스",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0013",
    "title": "어쨌거나 청춘",
    "normalizedTitle": "어쨌거나청춘",
    "initialConsonants": "ㅇㅉㄱㄴㅊㅊ",
    "author": "이보람",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0014",
    "title": "여중생A",
    "normalizedTitle": "여중생a",
    "initialConsonants": "ㅇㅈㅅa",
    "author": "허5파6",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0015",
    "title": "연놈",
    "normalizedTitle": "연놈",
    "initialConsonants": "ㅇㄴ",
    "author": "상하",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0016",
    "title": "연애혁명",
    "normalizedTitle": "연애혁명",
    "initialConsonants": "ㅇㅇㅎㅁ",
    "author": "232",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0017",
    "title": "이번 생도 잘 부탁해",
    "normalizedTitle": "이번생도잘부탁해",
    "initialConsonants": "ㅇㅂㅅㄷㅈㅂㅌㅎ",
    "author": "이혜",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0018",
    "title": "재혼 황후",
    "normalizedTitle": "재혼황후",
    "initialConsonants": "ㅈㅎㅎㅎ",
    "author": "알파타르트/숨풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0019",
    "title": "정년이",
    "normalizedTitle": "정년이",
    "initialConsonants": "ㅈㄴㅇ",
    "author": "서이레",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0020",
    "title": "하루만 네가 되고 싶어",
    "normalizedTitle": "하루만네가되고싶어",
    "initialConsonants": "ㅎㄹㅁㄴㄱㄷㄱㅅㅇ",
    "author": "삼",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0021",
    "title": "바른연애 길잡이",
    "normalizedTitle": "바른연애길잡이",
    "initialConsonants": "ㅂㄹㅇㅇㄱㅈㅇ",
    "author": "남수",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0022",
    "title": "유미의 세포들",
    "normalizedTitle": "유미의세포들",
    "initialConsonants": "ㅇㅁㅇㅅㅍㄷ",
    "author": "이동건",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0023",
    "title": "이런 영웅은 싫어",
    "normalizedTitle": "이런영웅은싫어",
    "initialConsonants": "ㅇㄹㅇㅇㅇㅅㅇ",
    "author": "삼촌",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0024",
    "title": "밤을 걷는 선비",
    "normalizedTitle": "밤을걷는선비",
    "initialConsonants": "ㅂㅇㄱㄴㅅㅂ",
    "author": "조주희",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0025",
    "title": "설희",
    "normalizedTitle": "설희",
    "initialConsonants": "ㅅㅎ",
    "author": "강경옥",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0026",
    "title": "황제의 외동딸",
    "normalizedTitle": "황제의외동딸",
    "initialConsonants": "ㅎㅈㅇㅇㄷㄸ",
    "author": "윤슬",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0027",
    "title": "그대를 사랑합니다",
    "normalizedTitle": "그대를사랑합니다",
    "initialConsonants": "ㄱㄷㄹㅅㄹㅎㄴㄷ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0028",
    "title": "남과 여",
    "normalizedTitle": "남과여",
    "initialConsonants": "ㄴㄱㅇ",
    "author": "시니/혀노",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0029",
    "title": "내 ID는 강남미인",
    "normalizedTitle": "내id는강남미인",
    "initialConsonants": "ㄴidㄴㄱㄴㅁㅇ",
    "author": "기맹기",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0030",
    "title": "눈이 나려 꽃",
    "normalizedTitle": "눈이나려꽃",
    "initialConsonants": "ㄴㅇㄴㄹㄲ",
    "author": "임해연",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0031",
    "title": "마녀",
    "normalizedTitle": "마녀",
    "initialConsonants": "ㅁㄴ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0032",
    "title": "바보",
    "normalizedTitle": "바보",
    "initialConsonants": "ㅂㅂ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0033",
    "title": "순정만화",
    "normalizedTitle": "순정만화",
    "initialConsonants": "ㅅㅈㅁㅎ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0034",
    "title": "운빨 로맨스",
    "normalizedTitle": "운빨로맨스",
    "initialConsonants": "ㅇㅃㄹㅁㅅ",
    "author": "김달님",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0035",
    "title": "일쌍다반사",
    "normalizedTitle": "일쌍다반사",
    "initialConsonants": "ㅇㅆㄷㅂㅅ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0036",
    "title": "허니블러드",
    "normalizedTitle": "허니블러드",
    "initialConsonants": "ㅎㄴㅂㄹㄷ",
    "author": "이나래",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0037",
    "title": "후레자식",
    "normalizedTitle": "후레자식",
    "initialConsonants": "ㅎㄹㅈㅅ",
    "author": "김칸비",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0038",
    "title": "바다의 이름 달의 그림자",
    "normalizedTitle": "바다의이름달의그림자",
    "initialConsonants": "ㅂㄷㅇㅇㄹㄷㅇㄱㄹㅈ",
    "author": "미상",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0039",
    "title": "340일간의 유예",
    "normalizedTitle": "340일간의유예",
    "initialConsonants": "340ㅇㄱㅇㅇㅇ",
    "author": "미치",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0040",
    "title": "견우와 선녀",
    "normalizedTitle": "견우와선녀",
    "initialConsonants": "ㄱㅇㅇㅅㄴ",
    "author": "안수민",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0041",
    "title": "귀전구담",
    "normalizedTitle": "귀전구담",
    "initialConsonants": "ㄱㅈㄱㄷ",
    "author": "QTT",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0042",
    "title": "그녀가 공작저로 가야 했던 사정",
    "normalizedTitle": "그녀가공작저로가야했던사정",
    "initialConsonants": "ㄱㄴㄱㄱㅈㅈㄹㄱㅇㅎㄷㅅㅈ",
    "author": "고래/밀차",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0043",
    "title": "나의 마녀",
    "normalizedTitle": "나의마녀",
    "initialConsonants": "ㄴㅇㅁㄴ",
    "author": "해윤",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0044",
    "title": "날것",
    "normalizedTitle": "날것",
    "initialConsonants": "ㄴㄱ",
    "author": "로하",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0045",
    "title": "버림 받은 황비",
    "normalizedTitle": "버림받은황비",
    "initialConsonants": "ㅂㄹㅂㅇㅎㅂ",
    "author": "정유나/인아",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0046",
    "title": "사내 연애 사절",
    "normalizedTitle": "사내연애사절",
    "initialConsonants": "ㅅㄴㅇㅇㅅㅈ",
    "author": "두부/남수",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0047",
    "title": "서울 자가에 대기업 다니는 김부장 이야기",
    "normalizedTitle": "서울자가에대기업다니는김부장이야기",
    "initialConsonants": "ㅅㅇㅈㄱㅇㄷㄱㅇㄷㄴㄴㄱㅂㅈㅇㅇㄱ",
    "author": "명랑/김병관",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0048",
    "title": "악녀가 사랑할 때",
    "normalizedTitle": "악녀가사랑할때",
    "initialConsonants": "ㅇㄴㄱㅅㄹㅎㄸ",
    "author": "서귀조/대치동건물주",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0049",
    "title": "악마와 계약연애",
    "normalizedTitle": "악마와계약연애",
    "initialConsonants": "ㅇㅁㅇㄱㅇㅇㅇ",
    "author": "장진/움비",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0050",
    "title": "좋아하면 울리는",
    "normalizedTitle": "좋아하면울리는",
    "initialConsonants": "ㅈㅇㅎㅁㅇㄹㄴ",
    "author": "천계영",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0051",
    "title": "호러와 로맨스",
    "normalizedTitle": "호러와로맨스",
    "initialConsonants": "ㅎㄹㅇㄹㅁㅅ",
    "author": "루시드",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0052",
    "title": "신비",
    "normalizedTitle": "신비",
    "initialConsonants": "ㅅㅂ",
    "author": "반지",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0053",
    "title": "오늘도 사랑스럽 개",
    "normalizedTitle": "오늘도사랑스럽개",
    "initialConsonants": "ㅇㄴㄷㅅㄹㅅㄹㄱ",
    "author": "이혜",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0054",
    "title": "윈터우즈",
    "normalizedTitle": "윈터우즈",
    "initialConsonants": "ㅇㅌㅇㅈ",
    "author": "COSMOS 외",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0055",
    "title": "청춘로맨스",
    "normalizedTitle": "청춘로맨스",
    "initialConsonants": "ㅊㅊㄹㅁㅅ",
    "author": "미울",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0056",
    "title": "실",
    "normalizedTitle": "실",
    "initialConsonants": "ㅅ",
    "author": "보리",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0057",
    "title": "심연의 하늘",
    "normalizedTitle": "심연의하늘",
    "initialConsonants": "ㅅㅇㅇㅎㄴ",
    "author": "윤인완",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0058",
    "title": "총몽 완전판 (알리타 원작)",
    "normalizedTitle": "총몽완전판알리타원작",
    "initialConsonants": "ㅊㅁㅇㅈㅍㅇㄹㅌㅇㅈ",
    "author": "기시로 유키토",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0059",
    "title": "26년",
    "normalizedTitle": "26년",
    "initialConsonants": "26ㄴ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0060",
    "title": "계룡 선녀전",
    "normalizedTitle": "계룡선녀전",
    "initialConsonants": "ㄱㄹㅅㄴㅈ",
    "author": "돌배",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0061",
    "title": "머니게임",
    "normalizedTitle": "머니게임",
    "initialConsonants": "ㅁㄴㄱㅇ",
    "author": "배진수",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0062",
    "title": "부암동 복수자 소셜클럽",
    "normalizedTitle": "부암동복수자소셜클럽",
    "initialConsonants": "ㅂㅇㄷㅂㅅㅈㅅㅅㅋㄹ",
    "author": "사자토끼",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0063",
    "title": "스피릿 핑거스",
    "normalizedTitle": "스피릿핑거스",
    "initialConsonants": "ㅅㅍㄹㅍㄱㅅ",
    "author": "한경찰",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0064",
    "title": "조명가게",
    "normalizedTitle": "조명가게",
    "initialConsonants": "ㅈㅁㄱㄱ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0065",
    "title": "치즈인더트랩 시즌1",
    "normalizedTitle": "치즈인더트랩시즌1",
    "initialConsonants": "ㅊㅈㅇㄷㅌㄹㅅㅈ1",
    "author": "순끼",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0066",
    "title": "치즈인더트랩 시즌2",
    "normalizedTitle": "치즈인더트랩시즌2",
    "initialConsonants": "ㅊㅈㅇㄷㅌㄹㅅㅈ2",
    "author": "순끼",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0067",
    "title": "치즈인더트랩 시즌3",
    "normalizedTitle": "치즈인더트랩시즌3",
    "initialConsonants": "ㅊㅈㅇㄷㅌㄹㅅㅈ3",
    "author": "순끼",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0068",
    "title": "치즈인더트랩 시즌4",
    "normalizedTitle": "치즈인더트랩시즌4",
    "initialConsonants": "ㅊㅈㅇㄷㅌㄹㅅㅈ4",
    "author": "순끼",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0069",
    "title": "커피 한잔 할까요?",
    "normalizedTitle": "커피한잔할까요",
    "initialConsonants": "ㅋㅍㅎㅈㅎㄲㅇ",
    "author": "허영만",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0070",
    "title": "사내 맞선",
    "normalizedTitle": "사내맞선",
    "initialConsonants": "ㅅㄴㅁㅅ",
    "author": "해화/NARAK",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0071",
    "title": "손안의 안단테",
    "normalizedTitle": "손안의안단테",
    "initialConsonants": "ㅅㅇㅇㅇㄷㅌ",
    "author": "나윤희",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0072",
    "title": "여신강림",
    "normalizedTitle": "여신강림",
    "initialConsonants": "ㅇㅅㄱㄹ",
    "author": "야옹이",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0073",
    "title": "롱 리브 더 킹 시즌1",
    "normalizedTitle": "롱리브더킹시즌1",
    "initialConsonants": "ㄹㄹㅂㄷㅋㅅㅈ1",
    "author": "버드나무숲",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0074",
    "title": "롱 리브 더 킹 시즌2",
    "normalizedTitle": "롱리브더킹시즌2",
    "initialConsonants": "ㄹㄹㅂㄷㅋㅅㅈ2",
    "author": "버드나무숲",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0075",
    "title": "롱 리브 더 킹 시즌3",
    "normalizedTitle": "롱리브더킹시즌3",
    "initialConsonants": "ㄹㄹㅂㄷㅋㅅㅈ3",
    "author": "버드나무숲",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0076",
    "title": "롱 리브 더 킹 시즌4",
    "normalizedTitle": "롱리브더킹시즌4",
    "initialConsonants": "ㄹㄹㅂㄷㅋㅅㅈ4",
    "author": "버드나무숲",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0077",
    "title": "HELP!!",
    "normalizedTitle": "help",
    "initialConsonants": "help",
    "author": "후지와라 키요",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0078",
    "title": "꽃의 이름",
    "normalizedTitle": "꽃의이름",
    "initialConsonants": "ㄲㅇㅇㄹ",
    "author": "사이토 켄",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0079",
    "title": "미궁 시리즈",
    "normalizedTitle": "미궁시리즈",
    "initialConsonants": "ㅁㄱㅅㄹㅈ",
    "author": "카미야 유우",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0080",
    "title": "밀크",
    "normalizedTitle": "밀크",
    "initialConsonants": "ㅁㅋ",
    "author": "자쿠리 사토",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0081",
    "title": "병아리 상점",
    "normalizedTitle": "병아리상점",
    "initialConsonants": "ㅂㅇㄹㅅㅈ",
    "author": "스다 유리코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0082",
    "title": "시집가긴 다 틀렸어!",
    "normalizedTitle": "시집가긴다틀렸어",
    "initialConsonants": "ㅅㅈㄱㄱㄷㅌㄹㅇ",
    "author": "후지와라 키요",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0083",
    "title": "애지중지",
    "normalizedTitle": "애지중지",
    "initialConsonants": "ㅇㅈㅈㅈ",
    "author": "요시하라 유키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0084",
    "title": "오토 포커스",
    "normalizedTitle": "오토포커스",
    "initialConsonants": "ㅇㅌㅍㅋㅅ",
    "author": "록뽄기 아야",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0085",
    "title": "차장 하나부사씨",
    "normalizedTitle": "차장하나부사씨",
    "initialConsonants": "ㅊㅈㅎㄴㅂㅅㅆ",
    "author": "미야코 리츠",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0086",
    "title": "천상의 멜로디",
    "normalizedTitle": "천상의멜로디",
    "initialConsonants": "ㅊㅅㅇㅁㄹㄷ",
    "author": "쿠미 마키무라",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0087",
    "title": "금붕어 언덕",
    "normalizedTitle": "금붕어언덕",
    "initialConsonants": "ㄱㅂㅇㅇㄷ",
    "author": "피치핏",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0088",
    "title": "남자의 일생",
    "normalizedTitle": "남자의일생",
    "initialConsonants": "ㄴㅈㅇㅇㅅ",
    "author": "니시 케이코",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0089",
    "title": "미카미 선생님의 사랑법",
    "normalizedTitle": "미카미선생님의사랑법",
    "initialConsonants": "ㅁㅋㅁㅅㅅㄴㅇㅅㄹㅂ",
    "author": "아이카와 히로",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0090",
    "title": "악마로소이다.",
    "normalizedTitle": "악마로소이다",
    "initialConsonants": "ㅇㅁㄹㅅㅇㄷ",
    "author": "타카나시 미츠바",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0091",
    "title": "츠바키쵸 론리 플래닛",
    "normalizedTitle": "츠바키쵸론리플래닛",
    "initialConsonants": "ㅊㅂㅋㅊㄹㄹㅍㄹㄴ",
    "author": "미카 야마모리",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0092",
    "title": "4월의 너 스피카",
    "normalizedTitle": "4월의너스피카",
    "initialConsonants": "4ㅇㅇㄴㅅㅍㅋ",
    "author": "스기야마 미와코",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0093",
    "title": "결혼합시다",
    "normalizedTitle": "결혼합시다",
    "initialConsonants": "ㄱㅎㅎㅅㄷ",
    "author": "미즈카미 와타루",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0094",
    "title": "나의 짐승남",
    "normalizedTitle": "나의짐승남",
    "initialConsonants": "ㄴㅇㅈㅅㄴ",
    "author": "차경희",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0095",
    "title": "네지",
    "normalizedTitle": "네지",
    "initialConsonants": "ㄴㅈ",
    "author": "유키 카오리",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0096",
    "title": "라세츠의 꽃",
    "normalizedTitle": "라세츠의꽃",
    "initialConsonants": "ㄹㅅㅊㅇㄲ",
    "author": "시오미 치카",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0097",
    "title": "마리아님이 보고계셔",
    "normalizedTitle": "마리아님이보고계셔",
    "initialConsonants": "ㅁㄹㅇㄴㅇㅂㄱㄱㅅ",
    "author": "콘노 오유키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0098",
    "title": "물에 빠진 나이프",
    "normalizedTitle": "물에빠진나이프",
    "initialConsonants": "ㅁㅇㅃㅈㄴㅇㅍ",
    "author": "조지 아사쿠라",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0099",
    "title": "소년잔상",
    "normalizedTitle": "소년잔상",
    "initialConsonants": "ㅅㄴㅈㅅ",
    "author": "유키 카오리",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0100",
    "title": "슈가 달링",
    "normalizedTitle": "슈가달링",
    "initialConsonants": "ㅅㄱㄷㄹ",
    "author": "마츠모토 미오",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0101",
    "title": "시공이방인 쿄코",
    "normalizedTitle": "시공이방인쿄코",
    "initialConsonants": "ㅅㄱㅇㅂㅇㅋㅋ",
    "author": "타네무라 아리나",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0102",
    "title": "심심한 칠드런",
    "normalizedTitle": "심심한칠드런",
    "initialConsonants": "ㅅㅅㅎㅊㄷㄹ",
    "author": "와카바야시 토시야",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0103",
    "title": "옆자리 괴물군",
    "normalizedTitle": "옆자리괴물군",
    "initialConsonants": "ㅇㅈㄹㄱㅁㄱ",
    "author": "로비코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0104",
    "title": "이매진",
    "normalizedTitle": "이매진",
    "initialConsonants": "ㅇㅁㅈ",
    "author": "마키무라 사토루",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0105",
    "title": "잔혹동화",
    "normalizedTitle": "잔혹동화",
    "initialConsonants": "ㅈㅎㄷㅎ",
    "author": "유키 카오리",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0106",
    "title": "장난을 잘 치는 타카기양",
    "normalizedTitle": "장난을잘치는타카기양",
    "initialConsonants": "ㅈㄴㅇㅈㅊㄴㅌㅋㄱㅇ",
    "author": "소이치로 야마모토",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0107",
    "title": "집사님 마음대로 21완결 + Encore 1권",
    "normalizedTitle": "집사님마음대로21완결encore1권",
    "initialConsonants": "ㅈㅅㄴㅁㅇㄷㄹ21ㅇㄱencore1ㄱ",
    "author": "레이 이자와",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0108",
    "title": "펠루아 이야기",
    "normalizedTitle": "펠루아이야기",
    "initialConsonants": "ㅍㄹㅇㅇㅇㄱ",
    "author": "김연주",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0109",
    "title": "푸른 지평선 아래",
    "normalizedTitle": "푸른지평선아래",
    "initialConsonants": "ㅍㄹㅈㅍㅅㅇㄹ",
    "author": "시토우 쿄교",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0110",
    "title": "언성 신데렐라",
    "normalizedTitle": "언성신데렐라",
    "initialConsonants": "ㅇㅅㅅㄷㄹㄹ",
    "author": "마마레 아라이",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0111",
    "title": "너에게 닿기를",
    "normalizedTitle": "너에게닿기를",
    "initialConsonants": "ㄴㅇㄱㄷㄱㄹ",
    "author": "시이나 카루호",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0112",
    "title": "너에게 닿기를 - 번외편",
    "normalizedTitle": "너에게닿기를번외편",
    "initialConsonants": "ㄴㅇㄱㄷㄱㄹㅂㅇㅍ",
    "author": "시이나 카루호",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0113",
    "title": "새벽의 연화",
    "normalizedTitle": "새벽의연화",
    "initialConsonants": "ㅅㅂㅇㅇㅎ",
    "author": "쿠사나기 미즈호",
    "category": "로맨스/판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0114",
    "title": "June Pride",
    "normalizedTitle": "junepride",
    "initialConsonants": "junepride",
    "author": "오야 카주미",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0115",
    "title": "계절 지난 계단",
    "normalizedTitle": "계절지난계단",
    "initialConsonants": "ㄱㅈㅈㄴㄱㄷ",
    "author": "고토 시노부",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0116",
    "title": "맨발의 왈츠",
    "normalizedTitle": "맨발의왈츠",
    "initialConsonants": "ㅁㅂㅇㅇㅊ",
    "author": "오야 카즈미",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0117",
    "title": "미모의 디테일",
    "normalizedTitle": "미모의디테일",
    "initialConsonants": "ㅁㅁㅇㄷㅌㅇ",
    "author": "시노부 고토",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0118",
    "title": "바나나피쉬",
    "normalizedTitle": "바나나피쉬",
    "initialConsonants": "ㅂㄴㄴㅍㅅ",
    "author": "요시다 아키미",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0119",
    "title": "사랑의 포로",
    "normalizedTitle": "사랑의포로",
    "initialConsonants": "ㅅㄹㅇㅍㄹ",
    "author": "히노 마츠리",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0120",
    "title": "하늘 정원",
    "normalizedTitle": "하늘정원",
    "initialConsonants": "ㅎㄴㅈㅇ",
    "author": "쿠와바라유코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0121",
    "title": "5시부터 9시까지",
    "normalizedTitle": "5시부터9시까지",
    "initialConsonants": "5ㅅㅂㅌ9ㅅㄲㅈ",
    "author": "아이하라 미키",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0122",
    "title": "너는 펫",
    "normalizedTitle": "너는펫",
    "initialConsonants": "ㄴㄴㅍ",
    "author": "야요이 오가와",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0123",
    "title": "귀여운 스님의 승복마저 사랑스러워",
    "normalizedTitle": "귀여운스님의승복마저사랑스러워",
    "initialConsonants": "ㄱㅇㅇㅅㄴㅇㅅㅂㅁㅈㅅㄹㅅㄹㅇ",
    "author": "혼마 아키라",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0124",
    "title": "물에 깃든 꽃",
    "normalizedTitle": "물에깃든꽃",
    "initialConsonants": "ㅁㅇㄱㄷㄲ",
    "author": "시노하라 치에",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0125",
    "title": "소악마카페",
    "normalizedTitle": "소악마카페",
    "initialConsonants": "ㅅㅇㅁㅋㅍ",
    "author": "오다 아야",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0126",
    "title": "얼티밋 비너스",
    "normalizedTitle": "얼티밋비너스",
    "initialConsonants": "ㅇㅌㅁㅂㄴㅅ",
    "author": "시게마츠 타카코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0127",
    "title": "오늘부터 신령님",
    "normalizedTitle": "오늘부터신령님",
    "initialConsonants": "ㅇㄴㅂㅌㅅㄹㄴ",
    "author": "스즈키 줄리에타",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0128",
    "title": "오렌지 플래닛",
    "normalizedTitle": "오렌지플래닛",
    "initialConsonants": "ㅇㄹㅈㅍㄹㄴ",
    "author": "후쿠시마 하루카",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0129",
    "title": "우리들의 사육방법",
    "normalizedTitle": "우리들의사육방법",
    "initialConsonants": "ㅇㄹㄷㅇㅅㅇㅂㅂ",
    "author": "야마다 나리",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0130",
    "title": "철벽선생",
    "normalizedTitle": "철벽선생",
    "initialConsonants": "ㅊㅂㅅㅅ",
    "author": "모모코 코다",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0131",
    "title": "허니",
    "normalizedTitle": "허니",
    "initialConsonants": "ㅎㄴ",
    "author": "유타카 타치바나",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0132",
    "title": "늑대 폐하의 신부",
    "normalizedTitle": "늑대폐하의신부",
    "initialConsonants": "ㄴㄷㅍㅎㅇㅅㅂ",
    "author": "마토 카우타",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0133",
    "title": "일하지 않는 두 사람",
    "normalizedTitle": "일하지않는두사람",
    "initialConsonants": "ㅇㅎㅈㅇㄴㄷㅅㄹ",
    "author": "요시다 사토루",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0134",
    "title": "치하야후루",
    "normalizedTitle": "치하야후루",
    "initialConsonants": "ㅊㅎㅇㅎㄹ",
    "author": "유키 스에츠구",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0135",
    "title": "클로버",
    "normalizedTitle": "클로버",
    "initialConsonants": "ㅋㄹㅂ",
    "author": "토리코 치야",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0136",
    "title": "클로버 트레플",
    "normalizedTitle": "클로버트레플",
    "initialConsonants": "ㅋㄹㅂㅌㄹㅍ",
    "author": "토리코 치야",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0137",
    "title": "허니와 클로버",
    "normalizedTitle": "허니와클로버",
    "initialConsonants": "ㅎㄴㅇㅋㄹㅂ",
    "author": "우미노 치카",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0138",
    "title": "주술회전",
    "normalizedTitle": "주술회전",
    "initialConsonants": "ㅈㅅㅎㅈ",
    "author": "아쿠타미 게게",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0139",
    "title": "소녀신선",
    "normalizedTitle": "소녀신선",
    "initialConsonants": "ㅅㄴㅅㅅ",
    "author": "효미",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0140",
    "title": "나의 히어로 아카데미아",
    "normalizedTitle": "나의히어로아카데미아",
    "initialConsonants": "ㄴㅇㅎㅇㄹㅇㅋㄷㅁㅇ",
    "author": "호리코시 코헤이",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0141",
    "title": "괴수8호",
    "normalizedTitle": "괴수8호",
    "initialConsonants": "ㄱㅅ8ㅎ",
    "author": "나오야 마츠모토",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0142",
    "title": "극락가",
    "normalizedTitle": "극락가",
    "initialConsonants": "ㄱㄹㄱ",
    "author": "사노 유토",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0143",
    "title": "단다단",
    "normalizedTitle": "단다단",
    "initialConsonants": "ㄷㄷㄷ",
    "author": "타츠 유키노부",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0144",
    "title": "사카모토 데이즈",
    "normalizedTitle": "사카모토데이즈",
    "initialConsonants": "ㅅㅋㅁㅌㄷㅇㅈ",
    "author": "유토 스즈키",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0145",
    "title": "스파이 패밀리",
    "normalizedTitle": "스파이패밀리",
    "initialConsonants": "ㅅㅍㅇㅍㅁㄹ",
    "author": "타츠야 엔도",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0146",
    "title": "아메리카노 엑소더스",
    "normalizedTitle": "아메리카노엑소더스",
    "initialConsonants": "ㅇㅁㄹㅋㄴㅇㅅㄷㅅ",
    "author": "박지은",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0147",
    "title": "약사의 혼잣말",
    "normalizedTitle": "약사의혼잣말",
    "initialConsonants": "ㅇㅅㅇㅎㅈㅁ",
    "author": "네코쿠라게",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0148",
    "title": "지박소년 하나코군",
    "normalizedTitle": "지박소년하나코군",
    "initialConsonants": "ㅈㅂㅅㄴㅎㄴㅋㄱ",
    "author": "아이다이로",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0149",
    "title": "체인소 맨",
    "normalizedTitle": "체인소맨",
    "initialConsonants": "ㅊㅇㅅㅁ",
    "author": "타츠키 후지모토",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0150",
    "title": "카구라바치",
    "normalizedTitle": "카구라바치",
    "initialConsonants": "ㅋㄱㄹㅂㅊ",
    "author": "타케루 호카조노",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0151",
    "title": "푸른 상자",
    "normalizedTitle": "푸른상자",
    "initialConsonants": "ㅍㄹㅅㅈ",
    "author": "코우지 미우라",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0152",
    "title": "히카루가 죽은 여름",
    "normalizedTitle": "히카루가죽은여름",
    "initialConsonants": "ㅎㅋㄹㄱㅈㅇㅇㄹ",
    "author": "모쿠모쿠 렌",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0153",
    "title": "어쿠스틱 라이프",
    "normalizedTitle": "어쿠스틱라이프",
    "initialConsonants": "ㅇㅋㅅㅌㄹㅇㅍ",
    "author": "난다",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0154",
    "title": "3월의 라이온",
    "normalizedTitle": "3월의라이온",
    "initialConsonants": "3ㅇㅇㄹㅇㅇ",
    "author": "우미노 치카",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0155",
    "title": "마음의 소리 레전드 +50",
    "normalizedTitle": "마음의소리레전드50",
    "initialConsonants": "ㅁㅇㅇㅅㄹㄹㅈㄷ50",
    "author": "조석",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0156",
    "title": "마음의 소리 레전드 100",
    "normalizedTitle": "마음의소리레전드100",
    "initialConsonants": "ㅁㅇㅇㅅㄹㄹㅈㄷ100",
    "author": "조석",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0157",
    "title": "메이드 인 어비스",
    "normalizedTitle": "메이드인어비스",
    "initialConsonants": "ㅁㅇㄷㅇㅇㅂㅅ",
    "author": "아키히토 츠쿠시",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0158",
    "title": "문유",
    "normalizedTitle": "문유",
    "initialConsonants": "ㅁㅇ",
    "author": "조석",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0159",
    "title": "이끼",
    "normalizedTitle": "이끼",
    "initialConsonants": "ㅇㄲ",
    "author": "윤태호",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0160",
    "title": "파인",
    "normalizedTitle": "파인",
    "initialConsonants": "ㅍㅇ",
    "author": "윤태호",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0161",
    "title": "킹더랜드",
    "normalizedTitle": "킹더랜드",
    "initialConsonants": "ㅋㄷㄹㄷ",
    "author": "스푼",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0162",
    "title": "가담항설",
    "normalizedTitle": "가담항설",
    "initialConsonants": "ㄱㄷㅎㅅ",
    "author": "랑또",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0163",
    "title": "걸어서 30분",
    "normalizedTitle": "걸어서30분",
    "initialConsonants": "ㄱㅇㅅ30ㅂ",
    "author": "이온도",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0164",
    "title": "고래별",
    "normalizedTitle": "고래별",
    "initialConsonants": "ㄱㄹㅂ",
    "author": "나윤희",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0165",
    "title": "고양이와 할아버지",
    "normalizedTitle": "고양이와할아버지",
    "initialConsonants": "ㄱㅇㅇㅇㅎㅇㅂㅈ",
    "author": "네코마키",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0166",
    "title": "남사친의 법칙",
    "normalizedTitle": "남사친의법칙",
    "initialConsonants": "ㄴㅅㅊㅇㅂㅊ",
    "author": "이도윤",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0167",
    "title": "윈드 브레이커",
    "normalizedTitle": "윈드브레이커",
    "initialConsonants": "ㅇㄷㅂㄹㅇㅋ",
    "author": "조용석",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0168",
    "title": "낮에 뜨는 달",
    "normalizedTitle": "낮에뜨는달",
    "initialConsonants": "ㄴㅇㄸㄴㄷ",
    "author": "헤윰",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0169",
    "title": "녹두전",
    "normalizedTitle": "녹두전",
    "initialConsonants": "ㄴㄷㅈ",
    "author": "혜진양",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0170",
    "title": "뽀짜툰",
    "normalizedTitle": "뽀짜툰",
    "initialConsonants": "ㅃㅉㅌ",
    "author": "채유리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0171",
    "title": "순정말고 순종 시즌1",
    "normalizedTitle": "순정말고순종시즌1",
    "initialConsonants": "ㅅㅈㅁㄱㅅㅈㅅㅈ1",
    "author": "슈안",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0172",
    "title": "아 지갑놓고 나왔다 1부,2부",
    "normalizedTitle": "아지갑놓고나왔다1부2부",
    "initialConsonants": "ㅇㅈㄱㄴㄱㄴㅇㄷ1ㅂ2ㅂ",
    "author": "미역의효능",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0173",
    "title": "아쿠아맨",
    "normalizedTitle": "아쿠아맨",
    "initialConsonants": "ㅇㅋㅇㅁ",
    "author": "맥퀸스튜디오",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0174",
    "title": "앙영의 일기장",
    "normalizedTitle": "앙영의일기장",
    "initialConsonants": "ㅇㅇㅇㅇㄱㅈ",
    "author": "앙영",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0175",
    "title": "어서와",
    "normalizedTitle": "어서와",
    "initialConsonants": "ㅇㅅㅇ",
    "author": "고아라 외",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0176",
    "title": "어쩌다 고양이 집사",
    "normalizedTitle": "어쩌다고양이집사",
    "initialConsonants": "ㅇㅉㄷㄱㅇㅇㅈㅅ",
    "author": "스기사쿠",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0177",
    "title": "외과의사 엘리제",
    "normalizedTitle": "외과의사엘리제",
    "initialConsonants": "ㅇㄱㅇㅅㅇㄹㅈ",
    "author": "mini/유인",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0178",
    "title": "외모지상주의",
    "normalizedTitle": "외모지상주의",
    "initialConsonants": "ㅇㅁㅈㅅㅈㅇ",
    "author": "박태준",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0179",
    "title": "인소의 법칙",
    "normalizedTitle": "인소의법칙",
    "initialConsonants": "ㅇㅅㅇㅂㅊ",
    "author": "아현",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0180",
    "title": "취향저격 그녀",
    "normalizedTitle": "취향저격그녀",
    "initialConsonants": "ㅊㅎㅈㄱㄱㄴ",
    "author": "로즈옹",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0181",
    "title": "크로스 더 라인",
    "normalizedTitle": "크로스더라인",
    "initialConsonants": "ㅋㄹㅅㄷㄹㅇ",
    "author": "허윤미",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0182",
    "title": "화장 지워주는 남자",
    "normalizedTitle": "화장지워주는남자",
    "initialConsonants": "ㅎㅈㅈㅇㅈㄴㄴㅈ",
    "author": "이연",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0183",
    "title": "후궁계약",
    "normalizedTitle": "후궁계약",
    "initialConsonants": "ㅎㄱㄱㅇ",
    "author": "밥꾹/붉은마녀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0184",
    "title": "십이야",
    "normalizedTitle": "십이야",
    "initialConsonants": "ㅅㅇㅇ",
    "author": "무류",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0185",
    "title": "어쩌다 발견한 7월",
    "normalizedTitle": "어쩌다발견한7월",
    "initialConsonants": "ㅇㅉㄷㅂㄱㅎ7ㅇ",
    "author": "무류",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0186",
    "title": "우리사이느은",
    "normalizedTitle": "우리사이느은",
    "initialConsonants": "ㅇㄹㅅㅇㄴㅇ",
    "author": "이연지",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0187",
    "title": "창백한 말 시즌1",
    "normalizedTitle": "창백한말시즌1",
    "initialConsonants": "ㅊㅂㅎㅁㅅㅈ1",
    "author": "추혜연",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0188",
    "title": "창백한 말 시즌2",
    "normalizedTitle": "창백한말시즌2",
    "initialConsonants": "ㅊㅂㅎㅁㅅㅈ2",
    "author": "추혜연",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0189",
    "title": "갓 오브 하이스쿨",
    "normalizedTitle": "갓오브하이스쿨",
    "initialConsonants": "ㄱㅇㅂㅎㅇㅅㅋ",
    "author": "박용제",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0190",
    "title": "캐셔로",
    "normalizedTitle": "캐셔로",
    "initialConsonants": "ㅋㅅㄹ",
    "author": "team befar",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0191",
    "title": "옷소매 붉은 끝동",
    "normalizedTitle": "옷소매붉은끝동",
    "initialConsonants": "ㅇㅅㅁㅂㅇㄲㄷ",
    "author": "미상",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0192",
    "title": "그다이",
    "normalizedTitle": "그다이",
    "initialConsonants": "ㄱㄷㅇ",
    "author": "최용성",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0193",
    "title": "나빌레라",
    "normalizedTitle": "나빌레라",
    "initialConsonants": "ㄴㅂㄹㄹ",
    "author": "HUN",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0194",
    "title": "내세에는 남남이 좋겠어",
    "normalizedTitle": "내세에는남남이좋겠어",
    "initialConsonants": "ㄴㅅㅇㄴㄴㄴㅇㅈㄱㅇ",
    "author": "코니시 아스카",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0195",
    "title": "내일 (현재 시즌3)",
    "normalizedTitle": "내일현재시즌3",
    "initialConsonants": "ㄴㅇㅎㅈㅅㅈ3",
    "author": "라마",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0196",
    "title": "놓지마 정신줄",
    "normalizedTitle": "놓지마정신줄",
    "initialConsonants": "ㄴㅈㅁㅈㅅㅈ",
    "author": "신태훈/나승훈",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0197",
    "title": "두근두근 두근거려",
    "normalizedTitle": "두근두근두근거려",
    "initialConsonants": "ㄷㄱㄷㄱㄷㄱㄱㄹ",
    "author": "하일권",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0198",
    "title": "모럴센스",
    "normalizedTitle": "모럴센스",
    "initialConsonants": "ㅁㄹㅅㅅ",
    "author": "겨울",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0199",
    "title": "반딧불이의 혼례",
    "normalizedTitle": "반딧불이의혼례",
    "initialConsonants": "ㅂㄷㅂㅇㅇㅎㄹ",
    "author": "오레코 타치바나",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0200",
    "title": "손끝과 연연",
    "normalizedTitle": "손끝과연연",
    "initialConsonants": "ㅅㄲㄱㅇㅇ",
    "author": "수 모리시타",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0201",
    "title": "스킵과 로퍼",
    "normalizedTitle": "스킵과로퍼",
    "initialConsonants": "ㅅㅋㄱㄹㅍ",
    "author": "타카마츠 미사키",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0202",
    "title": "식객",
    "normalizedTitle": "식객",
    "initialConsonants": "ㅅㄱ",
    "author": "허영만",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0203",
    "title": "식객2",
    "normalizedTitle": "식객2",
    "initialConsonants": "ㅅㄱ2",
    "author": "허영만",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0204",
    "title": "아름다운 초저녁달",
    "normalizedTitle": "아름다운초저녁달",
    "initialConsonants": "ㅇㄹㄷㅇㅊㅈㄴㄷ",
    "author": "미카 야마모리",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0205",
    "title": "안나라 수마나라",
    "normalizedTitle": "안나라수마나라",
    "initialConsonants": "ㅇㄴㄹㅅㅁㄴㄹ",
    "author": "하일권",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0206",
    "title": "오무라이스 잼잼",
    "normalizedTitle": "오무라이스잼잼",
    "initialConsonants": "ㅇㅁㄹㅇㅅㅈㅈ",
    "author": "조경규",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0207",
    "title": "지옥사원",
    "normalizedTitle": "지옥사원",
    "initialConsonants": "ㅈㅇㅅㅇ",
    "author": "네온비",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0208",
    "title": "최애의 아이",
    "normalizedTitle": "최애의아이",
    "initialConsonants": "ㅊㅇㅇㅇㅇ",
    "author": "아카 아카사카/멘고 요코야리",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0209",
    "title": "타몬군 지금 어느쪽",
    "normalizedTitle": "타몬군지금어느쪽",
    "initialConsonants": "ㅌㅁㄱㅈㄱㅇㄴㅉ",
    "author": "시와즈 유키",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0210",
    "title": "고수",
    "normalizedTitle": "고수",
    "initialConsonants": "ㄱㅅ",
    "author": "문정후/류기운",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0211",
    "title": "정신병동에도 아침이 와요",
    "normalizedTitle": "정신병동에도아침이와요",
    "initialConsonants": "ㅈㅅㅂㄷㅇㄷㅇㅊㅇㅇㅇ",
    "author": "이라하",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0212",
    "title": "나 혼자만 레벨업",
    "normalizedTitle": "나혼자만레벨업",
    "initialConsonants": "ㄴㅎㅈㅁㄹㅂㅇ",
    "author": "장성락/추공",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0213",
    "title": "덴마",
    "normalizedTitle": "덴마",
    "initialConsonants": "ㄷㅁ",
    "author": "양영순",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0214",
    "title": "신의 탑",
    "normalizedTitle": "신의탑",
    "initialConsonants": "ㅅㅇㅌ",
    "author": "SIU",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0215",
    "title": "중증 외상 센터 : 골든아워",
    "normalizedTitle": "중증외상센터골든아워",
    "initialConsonants": "ㅈㅈㅇㅅㅅㅌㄱㄷㅇㅇ",
    "author": "한산이가/홍비치라",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0216",
    "title": "블러드 레인",
    "normalizedTitle": "블러드레인",
    "initialConsonants": "ㅂㄹㄷㄹㅇ",
    "author": "민",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0217",
    "title": "샤크",
    "normalizedTitle": "샤크",
    "initialConsonants": "ㅅㅋ",
    "author": "운",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0218",
    "title": "일진의 크기",
    "normalizedTitle": "일진의크기",
    "initialConsonants": "ㅇㅈㅇㅋㄱ",
    "author": "윤필",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0219",
    "title": "청소부 K",
    "normalizedTitle": "청소부k",
    "initialConsonants": "ㅊㅅㅂk",
    "author": "신진우",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0220",
    "title": "통",
    "normalizedTitle": "통",
    "initialConsonants": "ㅌ",
    "author": "민",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0221",
    "title": "통 2부 비밀",
    "normalizedTitle": "통2부비밀",
    "initialConsonants": "ㅌ2ㅂㅂㅁ",
    "author": "민",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0222",
    "title": "통 3부 유아독존",
    "normalizedTitle": "통3부유아독존",
    "initialConsonants": "ㅌ3ㅂㅇㅇㄷㅈ",
    "author": "민",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0223",
    "title": "3인칭",
    "normalizedTitle": "3인칭",
    "initialConsonants": "3ㅇㅊ",
    "author": "꼬마비",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0224",
    "title": "DP",
    "normalizedTitle": "dp",
    "initialConsonants": "dp",
    "author": "김보통",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0225",
    "title": "곱게 자란 자식",
    "normalizedTitle": "곱게자란자식",
    "initialConsonants": "ㄱㄱㅈㄹㅈㅅ",
    "author": "이무기",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0226",
    "title": "노블레스 시즌1",
    "normalizedTitle": "노블레스시즌1",
    "initialConsonants": "ㄴㅂㄹㅅㅅㅈ1",
    "author": "손제호, 이광수",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0227",
    "title": "노블레스 시즌2",
    "normalizedTitle": "노블레스시즌2",
    "initialConsonants": "ㄴㅂㄹㅅㅅㅈ2",
    "author": "손제호, 이광수",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0228",
    "title": "노블레스 시즌3",
    "normalizedTitle": "노블레스시즌3",
    "initialConsonants": "ㄴㅂㄹㅅㅅㅈ3",
    "author": "손제호, 이광수",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0229",
    "title": "닥터 프로스트 시즌4  #16~",
    "normalizedTitle": "닥터프로스트시즌416",
    "initialConsonants": "ㄷㅌㅍㄹㅅㅌㅅㅈ416",
    "author": "이종범",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0230",
    "title": "당신의 모든 순간",
    "normalizedTitle": "당신의모든순간",
    "initialConsonants": "ㄷㅅㅇㅁㄷㅅㄱ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0231",
    "title": "동네변호사 조들호",
    "normalizedTitle": "동네변호사조들호",
    "initialConsonants": "ㄷㄴㅂㅎㅅㅈㄷㅎ",
    "author": "해츨링",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0232",
    "title": "목욕의 신",
    "normalizedTitle": "목욕의신",
    "initialConsonants": "ㅁㅇㅇㅅ",
    "author": "하일권",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0233",
    "title": "무빙",
    "normalizedTitle": "무빙",
    "initialConsonants": "ㅁㅂ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0234",
    "title": "반도 프리퀄 631",
    "normalizedTitle": "반도프리퀄631",
    "initialConsonants": "ㅂㄷㅍㄹㅋ631",
    "author": "연상호",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0235",
    "title": "방과후 전쟁활동",
    "normalizedTitle": "방과후전쟁활동",
    "initialConsonants": "ㅂㄱㅎㅈㅈㅎㄷ",
    "author": "하일권",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0236",
    "title": "뷰티풀 군바리",
    "normalizedTitle": "뷰티풀군바리",
    "initialConsonants": "ㅂㅌㅍㄱㅂㄹ",
    "author": "설이",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0237",
    "title": "브릿지",
    "normalizedTitle": "브릿지",
    "initialConsonants": "ㅂㄹㅈ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0238",
    "title": "빙탕후루",
    "normalizedTitle": "빙탕후루",
    "initialConsonants": "ㅂㅌㅎㄹ",
    "author": "장희/주호민",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0239",
    "title": "선천적 얼간이들",
    "normalizedTitle": "선천적얼간이들",
    "initialConsonants": "ㅅㅊㅈㅇㄱㅇㄷ",
    "author": "가스파드",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0240",
    "title": "송곳",
    "normalizedTitle": "송곳",
    "initialConsonants": "ㅅㄱ",
    "author": "최규석",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0241",
    "title": "술꾼도시처녀들",
    "normalizedTitle": "술꾼도시처녀들",
    "initialConsonants": "ㅅㄲㄷㅅㅊㄴㄷ",
    "author": "미깡",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0242",
    "title": "스위트 홈",
    "normalizedTitle": "스위트홈",
    "initialConsonants": "ㅅㅇㅌㅎ",
    "author": "김칸비",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0243",
    "title": "시동",
    "normalizedTitle": "시동",
    "initialConsonants": "ㅅㄷ",
    "author": "조금산",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0244",
    "title": "신과 함께: 신화편",
    "normalizedTitle": "신과함께신화편",
    "initialConsonants": "ㅅㄱㅎㄲㅅㅎㅍ",
    "author": "주호민",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0245",
    "title": "신과 함께: 이승편",
    "normalizedTitle": "신과함께이승편",
    "initialConsonants": "ㅅㄱㅎㄲㅇㅅㅍ",
    "author": "주호민",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0246",
    "title": "쌍갑포차",
    "normalizedTitle": "쌍갑포차",
    "initialConsonants": "ㅆㄱㅍㅊ",
    "author": "배혜수",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0247",
    "title": "아파트",
    "normalizedTitle": "아파트",
    "initialConsonants": "ㅇㅍㅌ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0248",
    "title": "여혜",
    "normalizedTitle": "여혜",
    "initialConsonants": "ㅇㅎ",
    "author": "비나리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0249",
    "title": "이제 곧 죽습니다",
    "normalizedTitle": "이제곧죽습니다",
    "initialConsonants": "ㅇㅈㄱㅈㅅㄴㄷ",
    "author": "이원식/꿀찬",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0250",
    "title": "좀비딸",
    "normalizedTitle": "좀비딸",
    "initialConsonants": "ㅈㅂㄸ",
    "author": "이윤창",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0251",
    "title": "종의 기원",
    "normalizedTitle": "종의기원",
    "initialConsonants": "ㅈㅇㄱㅇ",
    "author": "개미",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0252",
    "title": "지옥",
    "normalizedTitle": "지옥",
    "initialConsonants": "ㅈㅇ",
    "author": "연상호/최규석",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0253",
    "title": "타이밍",
    "normalizedTitle": "타이밍",
    "initialConsonants": "ㅌㅇㅁ",
    "author": "강풀",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0254",
    "title": "타인은 지옥이다",
    "normalizedTitle": "타인은지옥이다",
    "initialConsonants": "ㅌㅇㅇㅈㅇㅇㄷ",
    "author": "김용키",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0255",
    "title": "약한 영웅",
    "normalizedTitle": "약한영웅",
    "initialConsonants": "ㅇㅎㅇㅇ",
    "author": "김진석",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0256",
    "title": "화이트 블러드",
    "normalizedTitle": "화이트블러드",
    "initialConsonants": "ㅎㅇㅌㅂㄹㄷ",
    "author": "임리나",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0257",
    "title": "화산귀환",
    "normalizedTitle": "화산귀환",
    "initialConsonants": "ㅎㅅㄱㅎ",
    "author": "비가",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0258",
    "title": "김비서가 왜 그럴까",
    "normalizedTitle": "김비서가왜그럴까",
    "initialConsonants": "ㄱㅂㅅㄱㅇㄱㄹㄲ",
    "author": "김명미",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0259",
    "title": "N번째 연애 시즌1~3",
    "normalizedTitle": "n번째연애시즌13",
    "initialConsonants": "nㅂㅉㅇㅇㅅㅈ13",
    "author": "율로",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0260",
    "title": "고양이 엉덩이를 좋아합니다",
    "normalizedTitle": "고양이엉덩이를좋아합니다",
    "initialConsonants": "ㄱㅇㅇㅇㄷㅇㄹㅈㅇㅎㄴㄷ",
    "author": "나나옹",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0261",
    "title": "남자친구를 조심해",
    "normalizedTitle": "남자친구를조심해",
    "initialConsonants": "ㄴㅈㅊㄱㄹㅈㅅㅎ",
    "author": "이네",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0262",
    "title": "남팬만화",
    "normalizedTitle": "남팬만화",
    "initialConsonants": "ㄴㅍㅁㅎ",
    "author": "장진",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0263",
    "title": "내 남편과 결혼해줘",
    "normalizedTitle": "내남편과결혼해줘",
    "initialConsonants": "ㄴㄴㅍㄱㄱㅎㅎㅈ",
    "author": "LICO/성소작",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0264",
    "title": "노곤하개",
    "normalizedTitle": "노곤하개",
    "initialConsonants": "ㄴㄱㅎㄱ",
    "author": "홍끼",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0265",
    "title": "대학일기",
    "normalizedTitle": "대학일기",
    "initialConsonants": "ㄷㅎㅇㄱ",
    "author": "자까",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0266",
    "title": "독립일기",
    "normalizedTitle": "독립일기",
    "initialConsonants": "ㄷㄹㅇㄱ",
    "author": "자까",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0267",
    "title": "소녀의 세계",
    "normalizedTitle": "소녀의세계",
    "initialConsonants": "ㅅㄴㅇㅅㄱ",
    "author": "모랑지",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0268",
    "title": "시간의 계단",
    "normalizedTitle": "시간의계단",
    "initialConsonants": "ㅅㄱㅇㄱㄷ",
    "author": "제뉴",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0269",
    "title": "썅년의 미학",
    "normalizedTitle": "썅년의미학",
    "initialConsonants": "ㅆㄴㅇㅁㅎ",
    "author": "민서영",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0270",
    "title": "성공한 덕후",
    "normalizedTitle": "성공한덕후",
    "initialConsonants": "ㅅㄱㅎㄷㅎ",
    "author": "미상",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0271",
    "title": "살롯에게는 다섯 명의 제자가 있다",
    "normalizedTitle": "살롯에게는다섯명의제자가있다",
    "initialConsonants": "ㅅㄹㅇㄱㄴㄷㅅㅁㅇㅈㅈㄱㅇㄷ",
    "author": "미상",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0272",
    "title": "도쿄 후회망상 아가씨",
    "normalizedTitle": "도쿄후회망상아가씨",
    "initialConsonants": "ㄷㅋㅎㅎㅁㅅㅇㄱㅆ",
    "author": "히가시라무라 아키코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0273",
    "title": "후쿠야당 딸들",
    "normalizedTitle": "후쿠야당딸들",
    "initialConsonants": "ㅎㅋㅇㄷㄸㄷ",
    "author": "유치 야요미",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0274",
    "title": "바라카몬",
    "normalizedTitle": "바라카몬",
    "initialConsonants": "ㅂㄹㅋㅁ",
    "author": "요시노 사츠키",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0275",
    "title": "한다군",
    "normalizedTitle": "한다군",
    "initialConsonants": "ㅎㄷㄱ",
    "author": "요시노 사츠키",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0276",
    "title": "던전밥",
    "normalizedTitle": "던전밥",
    "initialConsonants": "ㄷㅈㅂ",
    "author": "쿠이 료코",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0277",
    "title": "리얼 어카운트",
    "normalizedTitle": "리얼어카운트",
    "initialConsonants": "ㄹㅇㅇㅋㅇㅌ",
    "author": "시즈무 와타나베",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0278",
    "title": "종말의 세라프",
    "normalizedTitle": "종말의세라프",
    "initialConsonants": "ㅈㅁㅇㅅㄹㅍ",
    "author": "카가미 타카야",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0279",
    "title": "사카모토 입니다만?",
    "normalizedTitle": "사카모토입니다만",
    "initialConsonants": "ㅅㅋㅁㅌㅇㄴㄷㅁ",
    "author": "사노 나미",
    "category": "코믹스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0280",
    "title": "불쾌한 모노노케안",
    "normalizedTitle": "불쾌한모노노케안",
    "initialConsonants": "ㅂㅋㅎㅁㄴㄴㅋㅇ",
    "author": "와자와키리",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0281",
    "title": "사이키 쿠스오의 재난",
    "normalizedTitle": "사이키쿠스오의재난",
    "initialConsonants": "ㅅㅇㅋㅋㅅㅇㅇㅈㄴ",
    "author": "아소 슈이치",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0282",
    "title": "극주부도",
    "normalizedTitle": "극주부도",
    "initialConsonants": "ㄱㅈㅂㄷ",
    "author": "코우즈케 오오노",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0283",
    "title": "데스노트",
    "normalizedTitle": "데스노트",
    "initialConsonants": "ㄷㅅㄴㅌ",
    "author": "오바 츠구미",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0284",
    "title": "백 스트리트 걸스",
    "normalizedTitle": "백스트리트걸스",
    "initialConsonants": "ㅂㅅㅌㄹㅌㄱㅅ",
    "author": "재스민 규",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0285",
    "title": "아인",
    "normalizedTitle": "아인",
    "initialConsonants": "ㅇㅇ",
    "author": "사쿠라이 가몬, 미우라 츠이나",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0286",
    "title": "암살교실",
    "normalizedTitle": "암살교실",
    "initialConsonants": "ㅇㅅㄱㅅ",
    "author": "유세이 마츠이",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0287",
    "title": "마슐",
    "normalizedTitle": "마슐",
    "initialConsonants": "ㅁㅅ",
    "author": "코모토 하지메",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0288",
    "title": "미기와 다리",
    "normalizedTitle": "미기와다리",
    "initialConsonants": "ㅁㄱㅇㄷㄹ",
    "author": "사노 나미",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0289",
    "title": "아르테",
    "normalizedTitle": "아르테",
    "initialConsonants": "ㅇㄹㅌ",
    "author": "오쿠보 케이",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0290",
    "title": "여학교의 별",
    "normalizedTitle": "여학교의별",
    "initialConsonants": "ㅇㅎㄱㅇㅂ",
    "author": "아야마 야마",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0291",
    "title": "골든 카무이",
    "normalizedTitle": "골든카무이",
    "initialConsonants": "ㄱㄷㅋㅁㅇ",
    "author": "사토루 노다",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0292",
    "title": "나와 호랑이님",
    "normalizedTitle": "나와호랑이님",
    "initialConsonants": "ㄴㅇㅎㄹㅇㄴ",
    "author": "카넬",
    "category": "로맨스/판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0293",
    "title": "서뱀프",
    "normalizedTitle": "서뱀프",
    "initialConsonants": "ㅅㅂㅍ",
    "author": "타나카 스트라이크",
    "category": "순정/판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0294",
    "title": "스킵 비트",
    "normalizedTitle": "스킵비트",
    "initialConsonants": "ㅅㅋㅂㅌ",
    "author": "나카무라 요시키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0295",
    "title": "카케구루이",
    "normalizedTitle": "카케구루이",
    "initialConsonants": "ㅋㅋㄱㄹㅇ",
    "author": "아시하라 다이스케",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0296",
    "title": "카케구루이 트윈",
    "normalizedTitle": "카케구루이트윈",
    "initialConsonants": "ㅋㅋㄱㄹㅇㅌㅇ",
    "author": "아시하라 다이스케",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0297",
    "title": "블랙 클로버",
    "normalizedTitle": "블랙클로버",
    "initialConsonants": "ㅂㄹㅋㄹㅂ",
    "author": "타바타 유키",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0298",
    "title": "비스타즈",
    "normalizedTitle": "비스타즈",
    "initialConsonants": "ㅂㅅㅌㅈ",
    "author": "이타가키 파루",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0299",
    "title": "약속의 네버랜드",
    "normalizedTitle": "약속의네버랜드",
    "initialConsonants": "ㅇㅅㅇㄴㅂㄹㄷ",
    "author": "카이우 시라이 / 포스카 데미스",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0300",
    "title": "블루 록",
    "normalizedTitle": "블루록",
    "initialConsonants": "ㅂㄹㄹ",
    "author": "카네시로 무네유키",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0301",
    "title": "하이큐",
    "normalizedTitle": "하이큐",
    "initialConsonants": "ㅎㅇㅋ",
    "author": "후루다테 하루이치",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0302",
    "title": "하이큐 스핀오프 (렛츠 하이큐)",
    "normalizedTitle": "하이큐스핀오프렛츠하이큐",
    "initialConsonants": "ㅎㅇㅋㅅㅍㅇㅍㄹㅊㅎㅇㅋ",
    "author": "후루다테 하루이치",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0303",
    "title": "괴물사변",
    "normalizedTitle": "괴물사변",
    "initialConsonants": "ㄱㅁㅅㅂ",
    "author": "쇼 아이모토",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0304",
    "title": "불멸의 그대에게",
    "normalizedTitle": "불멸의그대에게",
    "initialConsonants": "ㅂㅁㅇㄱㄷㅇㄱ",
    "author": "오이마 요시토키",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0305",
    "title": "모브사이코 100",
    "normalizedTitle": "모브사이코100",
    "initialConsonants": "ㅁㅂㅅㅇㅋ100",
    "author": "원",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0306",
    "title": "버츄얼 그림동화",
    "normalizedTitle": "버츄얼그림동화",
    "initialConsonants": "ㅂㅊㅇㄱㄹㄷㅎ",
    "author": "강경옥",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0307",
    "title": "스타가 되고싶어",
    "normalizedTitle": "스타가되고싶어",
    "initialConsonants": "ㅅㅌㄱㄷㄱㅅㅇ",
    "author": "강경옥",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0308",
    "title": "오디션",
    "normalizedTitle": "오디션",
    "initialConsonants": "ㅇㄷㅅ",
    "author": "천계영",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0309",
    "title": "이 카드입니까",
    "normalizedTitle": "이카드입니까",
    "initialConsonants": "ㅇㅋㄷㅇㄴㄲ",
    "author": "강경옥",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0310",
    "title": "인연",
    "normalizedTitle": "인연",
    "initialConsonants": "ㅇㅇ",
    "author": "심수정",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0311",
    "title": "하백의 신부 24+외전",
    "normalizedTitle": "하백의신부24외전",
    "initialConsonants": "ㅎㅂㅇㅅㅂ24ㅇㅈ",
    "author": "윤미경",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0312",
    "title": "현재진행형 ing",
    "normalizedTitle": "현재진행형ing",
    "initialConsonants": "ㅎㅈㅈㅎㅎing",
    "author": "강경옥",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0313",
    "title": "킹덤",
    "normalizedTitle": "킹덤",
    "initialConsonants": "ㅋㄷ",
    "author": "마오 후지사키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0314",
    "title": "고스트 바둑왕",
    "normalizedTitle": "고스트바둑왕",
    "initialConsonants": "ㄱㅅㅌㅂㄷㅇ",
    "author": "홋타 유미",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0315",
    "title": "공각기동대",
    "normalizedTitle": "공각기동대",
    "initialConsonants": "ㄱㄱㄱㄷㄷ",
    "author": "야마다, 마사키",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0316",
    "title": "마기",
    "normalizedTitle": "마기",
    "initialConsonants": "ㅁㄱ",
    "author": "오타카 시노부",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0317",
    "title": "마기 신드바드의 모험",
    "normalizedTitle": "마기신드바드의모험",
    "initialConsonants": "ㅁㄱㅅㄷㅂㄷㅇㅁㅎ",
    "author": "오타카 시노부",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0318",
    "title": "일곱개의 대죄",
    "normalizedTitle": "일곱개의대죄",
    "initialConsonants": "ㅇㄱㄱㅇㄷㅈ",
    "author": "스즈키 나카바",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0319",
    "title": "페어리 테일",
    "normalizedTitle": "페어리테일",
    "initialConsonants": "ㅍㅇㄹㅌㅇ",
    "author": "히로 마시마",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0320",
    "title": "더 화이팅",
    "normalizedTitle": "더화이팅",
    "initialConsonants": "ㄷㅎㅇㅌ",
    "author": "조지 모리카와",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0321",
    "title": "바람의 검심",
    "normalizedTitle": "바람의검심",
    "initialConsonants": "ㅂㄹㅇㄱㅅ",
    "author": "노부히로 와츠키",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0322",
    "title": "소년왕녀",
    "normalizedTitle": "소년왕녀",
    "initialConsonants": "ㅅㄴㅇㄴ",
    "author": "유키히로 우타코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0323",
    "title": "세이버",
    "normalizedTitle": "세이버",
    "initialConsonants": "ㅅㅇㅂ",
    "author": "이은영",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0324",
    "title": "원수를 사랑하라",
    "normalizedTitle": "원수를사랑하라",
    "initialConsonants": "ㅇㅅㄹㅅㄹㅎㄹ",
    "author": "한유랑",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0325",
    "title": "유리가면 완전판14권+코믹스42~49권",
    "normalizedTitle": "유리가면완전판14권코믹스4249권",
    "initialConsonants": "ㅇㄹㄱㅁㅇㅈㅍ14ㄱㅋㅁㅅ4249ㄱ",
    "author": "미우치 스즈에",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0326",
    "title": "카드캡터 사쿠라 클리어카드편",
    "normalizedTitle": "카드캡터사쿠라클리어카드편",
    "initialConsonants": "ㅋㄷㅋㅌㅅㅋㄹㅋㄹㅇㅋㄷㅍ",
    "author": "CLAMP",
    "category": "순정/판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0327",
    "title": "카드캡터 체리",
    "normalizedTitle": "카드캡터체리",
    "initialConsonants": "ㅋㄷㅋㅌㅊㄹ",
    "author": "CLAMP",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0328",
    "title": "미래일기 12권+외전2권",
    "normalizedTitle": "미래일기12권외전2권",
    "initialConsonants": "ㅁㄹㅇㄱ12ㄱㅇㅈ2ㄱ",
    "author": "타츠카와 마츠히코",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0329",
    "title": "열혈강호",
    "normalizedTitle": "열혈강호",
    "initialConsonants": "ㅇㅎㄱㅎ",
    "author": "전극진",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0330",
    "title": "사랑애",
    "normalizedTitle": "사랑애",
    "initialConsonants": "ㅅㄹㅇ",
    "author": "한유랑",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0331",
    "title": "솔직 담백하게",
    "normalizedTitle": "솔직담백하게",
    "initialConsonants": "ㅅㅈㄷㅂㅎㄱ",
    "author": "류량",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0332",
    "title": "암컷늑대의 BOY",
    "normalizedTitle": "암컷늑대의boy",
    "initialConsonants": "ㅇㅋㄴㄷㅇboy",
    "author": "한유랑",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0333",
    "title": "조강지처 길들이기",
    "normalizedTitle": "조강지처길들이기",
    "initialConsonants": "ㅈㄱㅈㅊㄱㄷㅇㄱ",
    "author": "한유랑",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0334",
    "title": "둘시네아를 위하여",
    "normalizedTitle": "둘시네아를위하여",
    "initialConsonants": "ㄷㅅㄴㅇㄹㅇㅎㅇ",
    "author": "황미리",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0335",
    "title": "레드문",
    "normalizedTitle": "레드문",
    "initialConsonants": "ㄹㄷㅁ",
    "author": "황미나",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0336",
    "title": "환상의 게임",
    "normalizedTitle": "환상의게임",
    "initialConsonants": "ㅎㅅㅇㄱㅇ",
    "author": "이시영",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0337",
    "title": "김전일 37세의 사건부",
    "normalizedTitle": "김전일37세의사건부",
    "initialConsonants": "ㄱㅈㅇ37ㅅㅇㅅㄱㅂ",
    "author": "기바야시 신, 사토 후미야",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0338",
    "title": "꽃보다 남자 (37+FF)",
    "normalizedTitle": "꽃보다남자37ff",
    "initialConsonants": "ㄲㅂㄷㄴㅈ37ff",
    "author": "카미오 요코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0339",
    "title": "명탐정 코난",
    "normalizedTitle": "명탐정코난",
    "initialConsonants": "ㅁㅌㅈㅋㄴ",
    "author": "아오야마 고쇼",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0340",
    "title": "소년탐정 김전일 30th",
    "normalizedTitle": "소년탐정김전일30th",
    "initialConsonants": "ㅅㄴㅌㅈㄱㅈㅇ30th",
    "author": "기바야시 신, 사토 후미야",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0341",
    "title": "소년탐정 김전일 시즌1",
    "normalizedTitle": "소년탐정김전일시즌1",
    "initialConsonants": "ㅅㄴㅌㅈㄱㅈㅇㅅㅈ1",
    "author": "기바야시 신",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0342",
    "title": "소년탐정 김전일 시즌2",
    "normalizedTitle": "소년탐정김전일시즌2",
    "initialConsonants": "ㅅㄴㅌㅈㄱㅈㅇㅅㅈ2",
    "author": "기바야시 신, 사토 후미야",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0343",
    "title": "소년탐정 김전일 특별판",
    "normalizedTitle": "소년탐정김전일특별판",
    "initialConsonants": "ㅅㄴㅌㅈㄱㅈㅇㅌㅂㅍ",
    "author": "기바야시 신",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0344",
    "title": "귀멸의 칼날",
    "normalizedTitle": "귀멸의칼날",
    "initialConsonants": "ㄱㅁㅇㅋㄴ",
    "author": "고토게 코요하루",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0345",
    "title": "귀멸학원",
    "normalizedTitle": "귀멸학원",
    "initialConsonants": "ㄱㅁㅎㅇ",
    "author": "고토게 코요하루",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0346",
    "title": "불꽃 소방대",
    "normalizedTitle": "불꽃소방대",
    "initialConsonants": "ㅂㄲㅅㅂㄷ",
    "author": "오쿠보 아츠시",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0347",
    "title": "은혼",
    "normalizedTitle": "은혼",
    "initialConsonants": "ㅇㅎ",
    "author": "소라치 히데아키",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0348",
    "title": "진격의 거인",
    "normalizedTitle": "진격의거인",
    "initialConsonants": "ㅈㄱㅇㄱㅇ",
    "author": "이사야마 하지메",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0349",
    "title": "진격의 거인Before the fall",
    "normalizedTitle": "진격의거인beforethefall",
    "initialConsonants": "ㅈㄱㅇㄱㅇbeforethefall",
    "author": "이사야마 하지메",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0350",
    "title": "아르슬란 전기",
    "normalizedTitle": "아르슬란전기",
    "initialConsonants": "ㅇㄹㅅㄹㅈㄱ",
    "author": "다나카 요시키",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0351",
    "title": "문호 스트레이독스",
    "normalizedTitle": "문호스트레이독스",
    "initialConsonants": "ㅁㅎㅅㅌㄹㅇㄷㅅ",
    "author": "하루카와 산고",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0352",
    "title": "원피스",
    "normalizedTitle": "원피스",
    "initialConsonants": "ㅇㅍㅅ",
    "author": "오다 에이치로",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0353",
    "title": "원피스 레드",
    "normalizedTitle": "원피스레드",
    "initialConsonants": "ㅇㅍㅅㄹㄷ",
    "author": "오다 에이치로",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0354",
    "title": "원피스 블루",
    "normalizedTitle": "원피스블루",
    "initialConsonants": "ㅇㅍㅅㅂㄹ",
    "author": "오다 에이치로",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0355",
    "title": "강철의 연금술사 완전판",
    "normalizedTitle": "강철의연금술사완전판",
    "initialConsonants": "ㄱㅊㅇㅇㄱㅅㅅㅇㅈㅍ",
    "author": "아라카와 히로무",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0356",
    "title": "디 그레이맨",
    "normalizedTitle": "디그레이맨",
    "initialConsonants": "ㄷㄱㄹㅇㅁ",
    "author": "호시노 카츠라",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0357",
    "title": "장송의 프리렌",
    "normalizedTitle": "장송의프리렌",
    "initialConsonants": "ㅈㅅㅇㅍㄹㄹ",
    "author": "야마다 카네히토",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0358",
    "title": "총몽 라스트 오더",
    "normalizedTitle": "총몽라스트오더",
    "initialConsonants": "ㅊㅁㄹㅅㅌㅇㄷ",
    "author": "기시로 유키토",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0359",
    "title": "총몽 화성전기",
    "normalizedTitle": "총몽화성전기",
    "initialConsonants": "ㅊㅁㅎㅅㅈㄱ",
    "author": "기시로 유키토",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0360",
    "title": "헌터X헌터",
    "normalizedTitle": "헌터x헌터",
    "initialConsonants": "ㅎㅌxㅎㅌ",
    "author": "요시히로 토가시",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0361",
    "title": "도쿄 리벤저스",
    "normalizedTitle": "도쿄리벤저스",
    "initialConsonants": "ㄷㅋㄹㅂㅈㅅ",
    "author": "켄 와쿠이",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0362",
    "title": "도쿄대 리벤저스",
    "normalizedTitle": "도쿄대리벤저스",
    "initialConsonants": "ㄷㅋㄷㄹㅂㅈㅅ",
    "author": "켄 와쿠이",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0363",
    "title": "드래곤 볼 (완전판 드래곤볼)",
    "normalizedTitle": "드래곤볼완전판드래곤볼",
    "initialConsonants": "ㄷㄹㄱㅂㅇㅈㅍㄷㄹㄱㅂ",
    "author": "토리야마 아키라",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0364",
    "title": "드래곤 볼 슈퍼",
    "normalizedTitle": "드래곤볼슈퍼",
    "initialConsonants": "ㄷㄹㄱㅂㅅㅍ",
    "author": "토리야마 아키라",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0365",
    "title": "나루토",
    "normalizedTitle": "나루토",
    "initialConsonants": "ㄴㄹㅌ",
    "author": "키시모토 마사시",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0366",
    "title": "보루토",
    "normalizedTitle": "보루토",
    "initialConsonants": "ㅂㄹㅌ",
    "author": "코타치 우코",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0367",
    "title": "원펀맨",
    "normalizedTitle": "원펀맨",
    "initialConsonants": "ㅇㅍㅁ",
    "author": "원, 무라타 유스케",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0368",
    "title": "나나 (21권+7.8권)",
    "normalizedTitle": "나나21권78권",
    "initialConsonants": "ㄴㄴ21ㄱ78ㄱ",
    "author": "야자와 아이",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0369",
    "title": "다이아몬드 에이스",
    "normalizedTitle": "다이아몬드에이스",
    "initialConsonants": "ㄷㅇㅇㅁㄷㅇㅇㅅ",
    "author": "유지 테라지마",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0370",
    "title": "다이아몬드 에이스 act2",
    "normalizedTitle": "다이아몬드에이스act2",
    "initialConsonants": "ㄷㅇㅇㅁㄷㅇㅇㅅact2",
    "author": "유지 테라지마",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0371",
    "title": "메이저",
    "normalizedTitle": "메이저",
    "initialConsonants": "ㅁㅇㅈ",
    "author": "미코토 아소우",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0372",
    "title": "메이저 2nd",
    "normalizedTitle": "메이저2nd",
    "initialConsonants": "ㅁㅇㅈ2nd",
    "author": "미코토 아소우",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0373",
    "title": "겁쟁이 페달",
    "normalizedTitle": "겁쟁이페달",
    "initialConsonants": "ㄱㅈㅇㅍㄷ",
    "author": "와타나베 와타루",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0374",
    "title": "리얼 (Real)",
    "normalizedTitle": "리얼real",
    "initialConsonants": "ㄹㅇreal",
    "author": "이노우에 다케히코",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0375",
    "title": "세인트 영멘",
    "normalizedTitle": "세인트영멘",
    "initialConsonants": "ㅅㅇㅌㅇㅁ",
    "author": "히카루 나카무라",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0376",
    "title": "슬램덩크",
    "normalizedTitle": "슬램덩크",
    "initialConsonants": "ㅅㄹㄷㅋ",
    "author": "이노우에 다케히코",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0377",
    "title": "천지창조 디자인부",
    "normalizedTitle": "천지창조디자인부",
    "initialConsonants": "ㅊㅈㅊㅈㄷㅈㅇㅂ",
    "author": "헤비 조우/츠타 스즈키",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0378",
    "title": "클로저 이상용",
    "normalizedTitle": "클로저이상용",
    "initialConsonants": "ㅋㄹㅈㅇㅅㅇ",
    "author": "최훈",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0379",
    "title": "테니스의 왕자",
    "normalizedTitle": "테니스의왕자",
    "initialConsonants": "ㅌㄴㅅㅇㅇㅈ",
    "author": "코노미 타케시",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0380",
    "title": "테니스의 왕자 (신)",
    "normalizedTitle": "테니스의왕자신",
    "initialConsonants": "ㅌㄴㅅㅇㅇㅈㅅ",
    "author": "고노미 타케시",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0381",
    "title": "퍼펙트게임 시즌1",
    "normalizedTitle": "퍼펙트게임시즌1",
    "initialConsonants": "ㅍㅍㅌㄱㅇㅅㅈ1",
    "author": "장이",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0382",
    "title": "퍼펙트게임 시즌2",
    "normalizedTitle": "퍼펙트게임시즌2",
    "initialConsonants": "ㅍㅍㅌㄱㅇㅅㅈ2",
    "author": "장이",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0383",
    "title": "퍼펙트게임 시즌3",
    "normalizedTitle": "퍼펙트게임시즌3",
    "initialConsonants": "ㅍㅍㅌㄱㅇㅅㅈ3",
    "author": "장이",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0384",
    "title": "미이라 사육법",
    "normalizedTitle": "미이라사육법",
    "initialConsonants": "ㅁㅇㄹㅅㅇㅂ",
    "author": "우즈기 카케루",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0385",
    "title": "오늘부터 우리는!!",
    "normalizedTitle": "오늘부터우리는",
    "initialConsonants": "ㅇㄴㅂㅌㅇㄹㄴ",
    "author": "히로유키 니시모리",
    "category": "액션/무협",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0386",
    "title": "커프스",
    "normalizedTitle": "커프스",
    "initialConsonants": "ㅋㅍㅅ",
    "author": "토조 진",
    "category": "코믹스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0387",
    "title": "흑집사",
    "normalizedTitle": "흑집사",
    "initialConsonants": "ㅎㅈㅅ",
    "author": "야나 토보소",
    "category": "순정/판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0388",
    "title": "할램비트는 새벽까지",
    "normalizedTitle": "할램비트는새벽까지",
    "initialConsonants": "ㅎㄹㅂㅌㄴㅅㅂㄲㅈ",
    "author": "카즈사 타카시마",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0389",
    "title": "라면 짱",
    "normalizedTitle": "라면짱",
    "initialConsonants": "ㄹㅁㅉ",
    "author": "츠지야마 시게루",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0390",
    "title": "먹짱!",
    "normalizedTitle": "먹짱",
    "initialConsonants": "ㅁㅉ",
    "author": "츠치야마 시게루",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0391",
    "title": "미스터 요리왕",
    "normalizedTitle": "미스터요리왕",
    "initialConsonants": "ㅁㅅㅌㅇㄹㅇ",
    "author": "스에다 유이치로",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0392",
    "title": "미스터 초밥왕",
    "normalizedTitle": "미스터초밥왕",
    "initialConsonants": "ㅁㅅㅌㅊㅂㅇ",
    "author": "테라사와 다이스케",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0393",
    "title": "미스터 초밥왕 전국대회편 (애장판)",
    "normalizedTitle": "미스터초밥왕전국대회편애장판",
    "initialConsonants": "ㅁㅅㅌㅊㅂㅇㅈㄱㄷㅎㅍㅇㅈㅍ",
    "author": "카츠시카 호쿠세이/우라사와 나오키",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0394",
    "title": "바텐더",
    "normalizedTitle": "바텐더",
    "initialConsonants": "ㅂㅌㄷ",
    "author": "조 아라키",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0395",
    "title": "블루 자이언트",
    "normalizedTitle": "블루자이언트",
    "initialConsonants": "ㅂㄹㅈㅇㅇㅌ",
    "author": "이시즈카 신이치",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0396",
    "title": "스매시!",
    "normalizedTitle": "스매시",
    "initialConsonants": "ㅅㅁㅅ",
    "author": "사키 카오리",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0397",
    "title": "식극의 소마",
    "normalizedTitle": "식극의소마",
    "initialConsonants": "ㅅㄱㅇㅅㅁ",
    "author": "츠쿠다 유우토",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0398",
    "title": "신의 물방울",
    "normalizedTitle": "신의물방울",
    "initialConsonants": "ㅅㅇㅁㅂㅇ",
    "author": "기바야시 신",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0399",
    "title": "신의 물방울 2부 마리아주",
    "normalizedTitle": "신의물방울2부마리아주",
    "initialConsonants": "ㅅㅇㅁㅂㅇ2ㅂㅁㄹㅇㅈ",
    "author": "기바야시 신",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0400",
    "title": "신의 물방울 3부 되지엠",
    "normalizedTitle": "신의물방울3부되지엠",
    "initialConsonants": "ㅅㅇㅁㅂㅇ3ㅂㄷㅈㅇ",
    "author": "기바야시 신",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0401",
    "title": "신의 물방울 스핀오프 괴도 르 뱅",
    "normalizedTitle": "신의물방울스핀오프괴도르뱅",
    "initialConsonants": "ㅅㅇㅁㅂㅇㅅㅍㅇㅍㄱㄷㄹㅂ",
    "author": "기바야시 신",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0402",
    "title": "심야식당",
    "normalizedTitle": "심야식당",
    "initialConsonants": "ㅅㅇㅅㄷ",
    "author": "아베 야로",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0403",
    "title": "우주형제",
    "normalizedTitle": "우주형제",
    "initialConsonants": "ㅇㅈㅎㅈ",
    "author": "츄야 코야마",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0404",
    "title": "라이어 게임",
    "normalizedTitle": "라이어게임",
    "initialConsonants": "ㄹㅇㅇㄱㅇ",
    "author": "카이타니 시노부",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0405",
    "title": "라이어 게임 외전",
    "normalizedTitle": "라이어게임외전",
    "initialConsonants": "ㄹㅇㅇㄱㅇㅇㅈ",
    "author": "카이타니 시노부",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0406",
    "title": "아일랜드 1부",
    "normalizedTitle": "아일랜드1부",
    "initialConsonants": "ㅇㅇㄹㄷ1ㅂ",
    "author": "윤인완/양경일",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0407",
    "title": "아일랜드 2부",
    "normalizedTitle": "아일랜드2부",
    "initialConsonants": "ㅇㅇㄹㄷ2ㅂ",
    "author": "윤인완/양경일",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0408",
    "title": "GIGANT (기간트)",
    "normalizedTitle": "gigant기간트",
    "initialConsonants": "gigantㄱㄱㅌ",
    "author": "오쿠 히로야",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0409",
    "title": "금요일",
    "normalizedTitle": "금요일",
    "initialConsonants": "ㄱㅇㅇ",
    "author": "배진수",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0410",
    "title": "기기괴괴 시리즈",
    "normalizedTitle": "기기괴괴시리즈",
    "initialConsonants": "ㄱㄱㄱㄱㅅㄹㅈ",
    "author": "오성대",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0411",
    "title": "기생수",
    "normalizedTitle": "기생수",
    "initialConsonants": "ㄱㅅㅅ",
    "author": "이와아키 히토시",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0412",
    "title": "기생수 리버시",
    "normalizedTitle": "기생수리버시",
    "initialConsonants": "ㄱㅅㅅㄹㅂㅅ",
    "author": "이와아키 히토시",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0413",
    "title": "나쁜 상사",
    "normalizedTitle": "나쁜상사",
    "initialConsonants": "ㄴㅃㅅㅅ",
    "author": "네온비",
    "category": "로맨스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0414",
    "title": "도쿄구울",
    "normalizedTitle": "도쿄구울",
    "initialConsonants": "ㄷㅋㄱㅇ",
    "author": "스이 이시다",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0415",
    "title": "도쿄구울:re",
    "normalizedTitle": "도쿄구울re",
    "initialConsonants": "ㄷㅋㄱㅇre",
    "author": "스이 이시다",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0416",
    "title": "바쿠만",
    "normalizedTitle": "바쿠만",
    "initialConsonants": "ㅂㅋㅁ",
    "author": "오바 츠구미",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0417",
    "title": "베르세르크",
    "normalizedTitle": "베르세르크",
    "initialConsonants": "ㅂㄹㅅㄹㅋ",
    "author": "미우라 켄타로",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0418",
    "title": "붉은여우",
    "normalizedTitle": "붉은여우",
    "initialConsonants": "ㅂㅇㅇㅇ",
    "author": "하마",
    "category": "로맨스/판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0419",
    "title": "신이 말하는대로",
    "normalizedTitle": "신이말하는대로",
    "initialConsonants": "ㅅㅇㅁㅎㄴㄷㄹ",
    "author": "카네시로 무네유키",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0420",
    "title": "신이 말하는대로 제2부",
    "normalizedTitle": "신이말하는대로제2부",
    "initialConsonants": "ㅅㅇㅁㅎㄴㄷㄹㅈ2ㅂ",
    "author": "카네시로 무네유키",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0421",
    "title": "신체찾기",
    "normalizedTitle": "신체찾기",
    "initialConsonants": "ㅅㅊㅊㄱ",
    "author": "무라세 카츠토시",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0422",
    "title": "신체찾기 (해)",
    "normalizedTitle": "신체찾기해",
    "initialConsonants": "ㅅㅊㅊㄱㅎ",
    "author": "무라세 카츠토시",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0423",
    "title": "심령탐정 야쿠모",
    "normalizedTitle": "심령탐정야쿠모",
    "initialConsonants": "ㅅㄹㅌㅈㅇㅋㅁ",
    "author": "리츠 미야코",
    "category": "탐정/추리/게임",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0425",
    "title": "아일랜드 : 무법도",
    "normalizedTitle": "아일랜드무법도",
    "initialConsonants": "ㅇㅇㄹㄷㅁㅂㄷ",
    "author": "모리 코우지",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0426",
    "title": "아일랜드 : 자살도",
    "normalizedTitle": "아일랜드자살도",
    "initialConsonants": "ㅇㅇㄹㄷㅈㅅㄷ",
    "author": "모리 코우지",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0427",
    "title": "이토준지 공포박물관",
    "normalizedTitle": "이토준지공포박물관",
    "initialConsonants": "ㅇㅌㅈㅈㄱㅍㅂㅁㄱ",
    "author": "이토 준지",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0428",
    "title": "인간실격",
    "normalizedTitle": "인간실격",
    "initialConsonants": "ㅇㄱㅅㄱ",
    "author": "이토 준지",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0429",
    "title": "저속령",
    "normalizedTitle": "저속령",
    "initialConsonants": "ㅈㅅㄹ",
    "author": "오카즈 사키",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0430",
    "title": "정치9단",
    "normalizedTitle": "정치9단",
    "initialConsonants": "ㅈㅊ9ㄷ",
    "author": "히로카네 켄시",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0431",
    "title": "지금 우리 학교는",
    "normalizedTitle": "지금우리학교는",
    "initialConsonants": "ㅈㄱㅇㄹㅎㄱㄴ",
    "author": "주동근",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0432",
    "title": "환괴지대",
    "normalizedTitle": "환괴지대",
    "initialConsonants": "ㅎㄱㅈㄷ",
    "author": "이토 준지",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0433",
    "title": "환상인형괴담",
    "normalizedTitle": "환상인형괴담",
    "initialConsonants": "ㅎㅅㅇㅎㄱㄷ",
    "author": "유조 타카다",
    "category": "호러/디스토피아",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0434",
    "title": "히로인즈 게임",
    "normalizedTitle": "히로인즈게임",
    "initialConsonants": "ㅎㄹㅇㅈㄱㅇ",
    "author": "이오리 타바사",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0435",
    "title": "마스카라 블루스",
    "normalizedTitle": "마스카라블루스",
    "initialConsonants": "ㅁㅅㅋㄹㅂㄹㅅ",
    "author": "이오 사키사카",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0436",
    "title": "모르는 나라이야기",
    "normalizedTitle": "모르는나라이야기",
    "initialConsonants": "ㅁㄹㄴㄴㄹㅇㅇㄱ",
    "author": "나츠나 카와세",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0437",
    "title": "사랑노래 말고 내게 빠져봐",
    "normalizedTitle": "사랑노래말고내게빠져봐",
    "initialConsonants": "ㅅㄹㄴㄹㅁㄱㄴㄱㅃㅈㅂ",
    "author": "신조 마유",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0438",
    "title": "오빠와 나",
    "normalizedTitle": "오빠와나",
    "initialConsonants": "ㅇㅃㅇㄴ",
    "author": "토케이노 하리",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0439",
    "title": "컨트리 하우스에 어서오세요!",
    "normalizedTitle": "컨트리하우스에어서오세요",
    "initialConsonants": "ㅋㅌㄹㅎㅇㅅㅇㅇㅅㅇㅅㅇ",
    "author": "아마네 유코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0441",
    "title": "흰창문 너머",
    "normalizedTitle": "흰창문너머",
    "initialConsonants": "ㅎㅊㅁㄴㅁ",
    "author": "히가와 쿄오코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0442",
    "title": "그 남자! 그 여자!",
    "normalizedTitle": "그남자그여자",
    "initialConsonants": "ㄱㄴㅈㄱㅇㅈ",
    "author": "츠다 마사미",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0443",
    "title": "꽃에게 짐승",
    "normalizedTitle": "꽃에게짐승",
    "initialConsonants": "ㄲㅇㄱㅈㅅ",
    "author": "스기야마 미와코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0444",
    "title": "내가 인기 있어서 어쩌자는 거야",
    "normalizedTitle": "내가인기있어서어쩌자는거야",
    "initialConsonants": "ㄴㄱㅇㄱㅇㅇㅅㅇㅉㅈㄴㄱㅇ",
    "author": "준코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0445",
    "title": "이런 상사 때문에 곤란하다면",
    "normalizedTitle": "이런상사때문에곤란하다면",
    "initialConsonants": "ㅇㄹㅅㅅㄸㅁㅇㄱㄹㅎㄷㅁ",
    "author": "미카 사쿠라노",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0446",
    "title": "후르츠 바스켓",
    "normalizedTitle": "후르츠바스켓",
    "initialConsonants": "ㅎㄹㅊㅂㅅㅋ",
    "author": "타카야 나츠키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0447",
    "title": "후르츠 바스켓 another",
    "normalizedTitle": "후르츠바스켓another",
    "initialConsonants": "ㅎㄹㅊㅂㅅㅋanother",
    "author": "타카야 나츠키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0448",
    "title": "건어물 여동생 우마루짱",
    "normalizedTitle": "건어물여동생우마루짱",
    "initialConsonants": "ㄱㅇㅁㅇㄷㅅㅇㅁㄹㅉ",
    "author": "산카쿠헤드",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0449",
    "title": "그녀는 거짓말을 너무 사랑해",
    "normalizedTitle": "그녀는거짓말을너무사랑해",
    "initialConsonants": "ㄱㄴㄴㄱㅈㅁㅇㄴㅁㅅㄹㅎ",
    "author": "오가사와라 아키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0450",
    "title": "날씨의 아이",
    "normalizedTitle": "날씨의아이",
    "initialConsonants": "ㄴㅆㅇㅇㅇ",
    "author": "신카이 마코토",
    "category": "순정/판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0451",
    "title": "너의 이름은",
    "normalizedTitle": "너의이름은",
    "initialConsonants": "ㄴㅇㅇㄹㅇ",
    "author": "란마루 코토네",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0452",
    "title": "너의 이름은 another side",
    "normalizedTitle": "너의이름은anotherside",
    "initialConsonants": "ㄴㅇㅇㄹㅇanotherside",
    "author": "란마루 코토네",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0453",
    "title": "너의 췌장을 먹고 싶어",
    "normalizedTitle": "너의췌장을먹고싶어",
    "initialConsonants": "ㄴㅇㅊㅈㅇㅁㄱㅅㅇ",
    "author": "키리하라 이즈미",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0454",
    "title": "미녀는 못말려",
    "normalizedTitle": "미녀는못말려",
    "initialConsonants": "ㅁㄴㄴㅁㅁㄹ",
    "author": "스즈키 유미코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0455",
    "title": "병아리 왈츠",
    "normalizedTitle": "병아리왈츠",
    "initialConsonants": "ㅂㅇㄹㅇㅊ",
    "author": "사토나카 미카",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0456",
    "title": "사랑하고 사랑받고, 차고 차이고",
    "normalizedTitle": "사랑하고사랑받고차고차이고",
    "initialConsonants": "ㅅㄹㅎㄱㅅㄹㅂㄱㅊㄱㅊㅇㄱ",
    "author": "이오 사키사카",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0457",
    "title": "피스",
    "normalizedTitle": "피스",
    "initialConsonants": "ㅍㅅ",
    "author": "아시하라 히나코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0458",
    "title": "하트나라의 앨리스",
    "normalizedTitle": "하트나라의앨리스",
    "initialConsonants": "ㅎㅌㄴㄹㅇㅇㄹㅅ",
    "author": "호시노 소우메이",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0459",
    "title": "꽃보다도 꽃처럼",
    "normalizedTitle": "꽃보다도꽃처럼",
    "initialConsonants": "ㄲㅂㄷㄷㄲㅊㄹ",
    "author": "나리타 미나코",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0460",
    "title": "모모의 의술사",
    "normalizedTitle": "모모의의술사",
    "initialConsonants": "ㅁㅁㅇㅇㅅㅅ",
    "author": "산바 나오모토/논 아사노",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0461",
    "title": "장난스런 키스",
    "normalizedTitle": "장난스런키스",
    "initialConsonants": "ㅈㄴㅅㄹㅋㅅ",
    "author": "카오루 타다",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0462",
    "title": "히노코",
    "normalizedTitle": "히노코",
    "initialConsonants": "ㅎㄴㅋ",
    "author": "츠다  마사미",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0463",
    "title": "뻐꾸기 커플",
    "normalizedTitle": "뻐꾸기커플",
    "initialConsonants": "ㅃㄲㄱㅋㅍ",
    "author": "미키 요시카와",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0464",
    "title": "사라져라, 군청",
    "normalizedTitle": "사라져라군청",
    "initialConsonants": "ㅅㄹㅈㄹㄱㅊ",
    "author": "우즈키 아이/코노 유카타",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0465",
    "title": "스즈메의 문단속",
    "normalizedTitle": "스즈메의문단속",
    "initialConsonants": "ㅅㅈㅁㅇㅁㄷㅅ",
    "author": "신카이 마코토",
    "category": "순정/판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0466",
    "title": "GIRLxGIRLxBOY",
    "normalizedTitle": "girlxgirlxboy",
    "initialConsonants": "girlxgirlxboy",
    "author": "쿠지라",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0467",
    "title": "그러니까 사랑이라고 하지마",
    "normalizedTitle": "그러니까사랑이라고하지마",
    "initialConsonants": "ㄱㄹㄴㄲㅅㄹㅇㄹㄱㅎㅈㅁ",
    "author": "후지와라 요시코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0468",
    "title": "꿈의 궁전 피콜로",
    "normalizedTitle": "꿈의궁전피콜로",
    "initialConsonants": "ㄲㅇㄱㅈㅍㅋㄹ",
    "author": "나카지 유키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0469",
    "title": "미스터리 커플",
    "normalizedTitle": "미스터리커플",
    "initialConsonants": "ㅁㅅㅌㄹㅋㅍ",
    "author": "오카노 후미카",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0470",
    "title": "비너스의 짝사랑",
    "normalizedTitle": "비너스의짝사랑",
    "initialConsonants": "ㅂㄴㅅㅇㅉㅅㄹ",
    "author": "나카지 유키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0471",
    "title": "키잭",
    "normalizedTitle": "키잭",
    "initialConsonants": "ㅋㅈ",
    "author": "시오미 치카",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0472",
    "title": "풀 하우스 키스",
    "normalizedTitle": "풀하우스키스",
    "initialConsonants": "ㅍㅎㅇㅅㅋㅅ",
    "author": "시오뢰 유와",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0473",
    "title": "5등분의 신부",
    "normalizedTitle": "5등분의신부",
    "initialConsonants": "5ㄷㅂㅇㅅㅂ",
    "author": "하루바 네기",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0474",
    "title": "솔직하게 키스",
    "normalizedTitle": "솔직하게키스",
    "initialConsonants": "ㅅㅈㅎㄱㅋㅅ",
    "author": "후미에 아쿠타",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0475",
    "title": "오늘은 회사 쉬겠습니다",
    "normalizedTitle": "오늘은회사쉬겠습니다",
    "initialConsonants": "ㅇㄴㅇㅎㅅㅅㄱㅅㄴㄷ",
    "author": "후지무라 마리",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0476",
    "title": "커피&바닐라",
    "normalizedTitle": "커피바닐라",
    "initialConsonants": "ㅋㅍㅂㄴㄹ",
    "author": "타카라 아케가미",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0477",
    "title": "호리미야",
    "normalizedTitle": "호리미야",
    "initialConsonants": "ㅎㄹㅁㅇ",
    "author": "히로, 하기와라 다이스케",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0478",
    "title": "N과S",
    "normalizedTitle": "n과s",
    "initialConsonants": "nㄱs",
    "author": "렌쥬로 긴다이치",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0479",
    "title": "P와 여고생",
    "normalizedTitle": "p와여고생",
    "initialConsonants": "pㅇㅇㄱㅅ",
    "author": "마키 미요시",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0480",
    "title": "건방진 그녀석",
    "normalizedTitle": "건방진그녀석",
    "initialConsonants": "ㄱㅂㅈㄱㄴㅅ",
    "author": "미츠바치 미유키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0481",
    "title": "궁",
    "normalizedTitle": "궁",
    "initialConsonants": "ㄱ",
    "author": "박소희",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0482",
    "title": "오늘, 사랑을 시작합니다",
    "normalizedTitle": "오늘사랑을시작합니다",
    "initialConsonants": "ㅇㄴㅅㄹㅇㅅㅈㅎㄴㄷ",
    "author": "미나미 카난",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0483",
    "title": "캐러멜 키스",
    "normalizedTitle": "캐러멜키스",
    "initialConsonants": "ㅋㄹㅁㅋㅅ",
    "author": "야가미 치토세",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0484",
    "title": "병아리 사랑",
    "normalizedTitle": "병아리사랑",
    "initialConsonants": "ㅂㅇㄹㅅㄹ",
    "author": "유키마루 모에",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0485",
    "title": "시이나 군의 동물백과",
    "normalizedTitle": "시이나군의동물백과",
    "initialConsonants": "ㅅㅇㄴㄱㅇㄷㅁㅂㄱ",
    "author": "토츠키 시야",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0486",
    "title": "전당포 시노부의 보석상자",
    "normalizedTitle": "전당포시노부의보석상자",
    "initialConsonants": "ㅈㄷㅍㅅㄴㅂㅇㅂㅅㅅㅈ",
    "author": "니노미야 토모코",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0487",
    "title": "니세코이",
    "normalizedTitle": "니세코이",
    "initialConsonants": "ㄴㅅㅋㅇ",
    "author": "나오시 코미",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0488",
    "title": "제로에서 시작하는 마법의 서",
    "normalizedTitle": "제로에서시작하는마법의서",
    "initialConsonants": "ㅈㄹㅇㅅㅅㅈㅎㄴㅁㅂㅇㅅ",
    "author": "코바시리 카케루",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0489",
    "title": "80세 마리코",
    "normalizedTitle": "80세마리코",
    "initialConsonants": "80ㅅㅁㄹㅋ",
    "author": "오자와 유키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0490",
    "title": "무능한 나나",
    "normalizedTitle": "무능한나나",
    "initialConsonants": "ㅁㄴㅎㄴㄴ",
    "author": "Looseboy",
    "category": "판타지/SF",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0491",
    "title": "봇치 더 록",
    "normalizedTitle": "봇치더록",
    "initialConsonants": "ㅂㅊㄷㄹ",
    "author": "아키 하마지",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0492",
    "title": "월간순정 노자키군",
    "normalizedTitle": "월간순정노자키군",
    "initialConsonants": "ㅇㄱㅅㅈㄴㅈㅋㄱ",
    "author": "이즈미 츠바키",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0493",
    "title": "프로미스 신데렐라",
    "normalizedTitle": "프로미스신데렐라",
    "initialConsonants": "ㅍㄹㅁㅅㅅㄷㄹㄹ",
    "author": "오레코 타치바나",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0494",
    "title": "한밤중 하트튠",
    "normalizedTitle": "한밤중하트튠",
    "initialConsonants": "ㅎㅂㅈㅎㅌㅌ",
    "author": "마사쿠니 이가라시",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0495",
    "title": "누드 후르츠",
    "normalizedTitle": "누드후르츠",
    "initialConsonants": "ㄴㄷㅎㄹㅊ",
    "author": "키타가와 미유키",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0496",
    "title": "뉴 게임",
    "normalizedTitle": "뉴게임",
    "initialConsonants": "ㄴㄱㅇ",
    "author": "쇼타로 토쿠노",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0497",
    "title": "H2",
    "normalizedTitle": "h2",
    "initialConsonants": "h2",
    "author": "아다치 미쯔루",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0498",
    "title": "미유키",
    "normalizedTitle": "미유키",
    "initialConsonants": "ㅁㅇㅋ",
    "author": "아다치 미쯔루",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0499",
    "title": "크로스게임 소장판",
    "normalizedTitle": "크로스게임소장판",
    "initialConsonants": "ㅋㄹㅅㄱㅇㅅㅈㅍ",
    "author": "아다치 미쯔루",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0500",
    "title": "터치",
    "normalizedTitle": "터치",
    "initialConsonants": "ㅌㅊ",
    "author": "아다치 미쯔루",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0501",
    "title": "믹스(Mix)",
    "normalizedTitle": "믹스mix",
    "initialConsonants": "ㅁㅅmix",
    "author": "아다치 미쯔루",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0502",
    "title": "현자의 긴 부재",
    "normalizedTitle": "현자의긴부재",
    "initialConsonants": "ㅎㅈㅇㄱㅂㅈ",
    "author": "모야무 후지노",
    "category": "Sf",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0503",
    "title": "요츠바랑",
    "normalizedTitle": "요츠바랑",
    "initialConsonants": "ㅇㅊㅂㄹ",
    "author": "아즈마 키요히코",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0504",
    "title": "사랑전선",
    "normalizedTitle": "사랑전선",
    "initialConsonants": "ㅅㄹㅈㅅ",
    "author": "쿄유미 마슈모토",
    "category": "로맨스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0505",
    "title": "복원가의 집",
    "normalizedTitle": "복원가의집",
    "initialConsonants": "ㅂㅇㄱㅇㅈ",
    "author": "김상엽",
    "category": "코믹스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0506",
    "title": "도서관의 주인",
    "normalizedTitle": "도서관의주인",
    "initialConsonants": "ㄷㅅㄱㅇㅈㅇ",
    "author": "우미하루 시노하라",
    "category": "코믹스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0507",
    "title": "도라에몽",
    "normalizedTitle": "도라에몽",
    "initialConsonants": "ㄷㄹㅇㅁ",
    "author": "후지코F 후지오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0509",
    "title": "도라에몽 극장판 <진구의 인어대해전>",
    "normalizedTitle": "도라에몽극장판진구의인어대해전",
    "initialConsonants": "ㄷㄹㅇㅁㄱㅈㅍㅈㄱㅇㅇㅇㄷㅎㅈ",
    "author": "후지코F 후지오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0510",
    "title": "도라에몽 장편시리즈",
    "normalizedTitle": "도라에몽장편시리즈",
    "initialConsonants": "ㄷㄹㅇㅁㅈㅍㅅㄹㅈ",
    "author": "후지코F 후지오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0511",
    "title": "도라에몽 컬러작품집",
    "normalizedTitle": "도라에몽컬러작품집",
    "initialConsonants": "ㄷㄹㅇㅁㅋㄹㅈㅍㅈ",
    "author": "후지코F 후지오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0512",
    "title": "도라에몽 플러스",
    "normalizedTitle": "도라에몽플러스",
    "initialConsonants": "ㄷㄹㅇㅁㅍㄹㅅ",
    "author": "후지코F 후지오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0514",
    "title": "괴짜가족",
    "normalizedTitle": "괴짜가족",
    "initialConsonants": "ㄱㅉㄱㅈ",
    "author": "켄지 하마오카",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0515",
    "title": "조선왕조실톡",
    "normalizedTitle": "조선왕조실톡",
    "initialConsonants": "ㅈㅅㅇㅈㅅㅌ",
    "author": "무적핑크",
    "category": "역사",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0516",
    "title": "왕좌의 게임",
    "normalizedTitle": "왕좌의게임",
    "initialConsonants": "ㅇㅈㅇㄱㅇ",
    "author": "조지r.r.마틴",
    "category": "sf",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0517",
    "title": "아만츄",
    "normalizedTitle": "아만츄",
    "initialConsonants": "ㅇㅁㅊ",
    "author": "아마노 코즈에",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0518",
    "title": "메달리스트",
    "normalizedTitle": "메달리스트",
    "initialConsonants": "ㅁㄷㄹㅅㅌ",
    "author": "츠루마 이카다",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0519",
    "title": "패왕애인",
    "normalizedTitle": "패왕애인",
    "initialConsonants": "ㅍㅇㅇㅇ",
    "author": "신주",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0520",
    "title": "아사 이야기",
    "normalizedTitle": "아사이야기",
    "initialConsonants": "ㅇㅅㅇㅇㄱ",
    "author": "우라사와 나오키",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0521",
    "title": "녹색의 왕",
    "normalizedTitle": "녹색의왕",
    "initialConsonants": "ㄴㅅㅇㅇ",
    "author": "히로시 타카시지소가",
    "category": "코믹스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0522",
    "title": "몽환 백서",
    "normalizedTitle": "몽환백서",
    "initialConsonants": "ㅁㅎㅂㅅ",
    "author": "미상",
    "category": "코믹스",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0523",
    "title": "디어보이스  ACT1",
    "normalizedTitle": "디어보이스act1",
    "initialConsonants": "ㄷㅇㅂㅇㅅact1",
    "author": "야가미 히로키",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0524",
    "title": "디어보이스  ACT2",
    "normalizedTitle": "디어보이스act2",
    "initialConsonants": "ㄷㅇㅂㅇㅅact2",
    "author": "야가미 히로키",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0525",
    "title": "디어보이스  ACT3",
    "normalizedTitle": "디어보이스act3",
    "initialConsonants": "ㄷㅇㅂㅇㅅact3",
    "author": "야가미 히로키",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0526",
    "title": "개구리 하사 케로로",
    "normalizedTitle": "개구리하사케로로",
    "initialConsonants": "ㄱㄱㄹㅎㅅㅋㄹㄹ",
    "author": "요시자키 미네",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0527",
    "title": "개구리 하사 케로로 <특별판>",
    "normalizedTitle": "개구리하사케로로특별판",
    "initialConsonants": "ㄱㄱㄹㅎㅅㅋㄹㄹㅌㅂㅍ",
    "author": "요시자키 미네",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0528",
    "title": "카페타",
    "normalizedTitle": "카페타",
    "initialConsonants": "ㅋㅍㅌ",
    "author": "소다 마사히토",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0529",
    "title": "보노보노",
    "normalizedTitle": "보노보노",
    "initialConsonants": "ㅂㄴㅂㄴ",
    "author": "이가라시 미키오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0530",
    "title": "출동 119 구조대",
    "normalizedTitle": "출동119구조대",
    "initialConsonants": "ㅊㄷ119ㄱㅈㄷ",
    "author": "소다 마사히토",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0531",
    "title": "SECRET WAR(시크릿 워)(시공 그래픽 노블)",
    "normalizedTitle": "secretwar시크릿워시공그래픽노블",
    "initialConsonants": "secretwarㅅㅋㄹㅇㅅㄱㄱㄹㅍㄴㅂ",
    "author": "빅셔너리",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0532",
    "title": "Wolverine Weapon X(울버린 웨폰 X)(Marvel)",
    "normalizedTitle": "wolverineweaponx울버린웨폰xmarvel",
    "initialConsonants": "wolverineweaponxㅇㅂㄹㅇㅍxmarvel",
    "author": "마블 코믹스",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0533",
    "title": "Wolverine(울버린)(Marvel)",
    "normalizedTitle": "wolverine울버린marvel",
    "initialConsonants": "wolverineㅇㅂㄹmarvel",
    "author": "마블 코믹스",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0534",
    "title": "Wolverine(울버린)올드 맨 로건",
    "normalizedTitle": "wolverine울버린올드맨로건",
    "initialConsonants": "wolverineㅇㅂㄹㅇㄷㅁㄹㄱ",
    "author": "마블 코믹스",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0535",
    "title": "나답게 살고 있습니다",
    "normalizedTitle": "나답게살고있습니다",
    "initialConsonants": "ㄴㄷㄱㅅㄱㅇㅅㄴㄷ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0536",
    "title": "내가 정말 원하는 건 뭐지",
    "normalizedTitle": "내가정말원하는건뭐지",
    "initialConsonants": "ㄴㄱㅈㅁㅇㅎㄴㄱㅁㅈ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0537",
    "title": "너의 곁에서",
    "normalizedTitle": "너의곁에서",
    "initialConsonants": "ㄴㅇㄱㅇㅅ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0538",
    "title": "뉴 52! 원더 우먼. 1: 피(DC COMICS)",
    "normalizedTitle": "뉴52원더우먼1피dccomics",
    "initialConsonants": "ㄴ52ㅇㄷㅇㅁ1ㅍdccomics",
    "author": "브라이언 아자렐로",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0539",
    "title": "데드풀",
    "normalizedTitle": "데드풀",
    "initialConsonants": "ㄷㄷㅍ",
    "author": "Gerry",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0540",
    "title": "배트맨",
    "normalizedTitle": "배트맨",
    "initialConsonants": "ㅂㅌㅁ",
    "author": "스콧 스나이더",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0541",
    "title": "사가(Saga)",
    "normalizedTitle": "사가saga",
    "initialConsonants": "ㅅㄱsaga",
    "author": "브라이언 K",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0542",
    "title": "수어사이드 스쿼드",
    "normalizedTitle": "수어사이드스쿼드",
    "initialConsonants": "ㅅㅇㅅㅇㄷㅅㅋㄷ",
    "author": "아담 글래스",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0543",
    "title": "슈퍼맨 배트맨: 공공의 적",
    "normalizedTitle": "슈퍼맨배트맨공공의적",
    "initialConsonants": "ㅅㅍㅁㅂㅌㅁㄱㄱㅇㅈ",
    "author": "제프 로브",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0544",
    "title": "시빌 워(시공 그래픽 노블)",
    "normalizedTitle": "시빌워시공그래픽노블",
    "initialConsonants": "ㅅㅂㅇㅅㄱㄱㄹㅍㄴㅂ",
    "author": "마크 밀러",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0545",
    "title": "아메리칸 뱀파이어",
    "normalizedTitle": "아메리칸뱀파이어",
    "initialConsonants": "ㅇㅁㄹㅋㅂㅍㅇㅇ",
    "author": "스콧 스나이더",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0546",
    "title": "아무래도 싫은 사람",
    "normalizedTitle": "아무래도싫은사람",
    "initialConsonants": "ㅇㅁㄹㄷㅅㅇㅅㄹ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0547",
    "title": "아이언 맨 : S.H.I.E.L.D. 국장",
    "normalizedTitle": "아이언맨shield국장",
    "initialConsonants": "ㅇㅇㅇㅁshieldㄱㅈ",
    "author": "대니얼 & 찰",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0548",
    "title": "아이언 맨: 엑시큐트 프로그램",
    "normalizedTitle": "아이언맨엑시큐트프로그램",
    "initialConsonants": "ㅇㅇㅇㅁㅇㅅㅋㅌㅍㄹㄱㄹ",
    "author": "대니얼 노프",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0549",
    "title": "아이언 맨: 익스트리미스",
    "normalizedTitle": "아이언맨익스트리미스",
    "initialConsonants": "ㅇㅇㅇㅁㅇㅅㅌㄹㅁㅅ",
    "author": "워런 엘리스",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0550",
    "title": "아이언 맨: 헌티드",
    "normalizedTitle": "아이언맨헌티드",
    "initialConsonants": "ㅇㅇㅇㅁㅎㅌㄷ",
    "author": "대니얼 & 찰",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0551",
    "title": "앤트맨",
    "normalizedTitle": "앤트맨",
    "initialConsonants": "ㅇㅌㅁ",
    "author": "BLU-RAY",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0552",
    "title": "어메이징 스파이더맨",
    "normalizedTitle": "어메이징스파이더맨",
    "initialConsonants": "ㅇㅁㅇㅈㅅㅍㅇㄷㅁ",
    "author": "댄 슬롯",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0553",
    "title": "어벤저스 : 엔드게임 프렐류드",
    "normalizedTitle": "어벤저스엔드게임프렐류드",
    "initialConsonants": "ㅇㅂㅈㅅㅇㄷㄱㅇㅍㄹㄹㄷ",
    "author": "읠 코로나 필그림",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0554",
    "title": "어벤저스 디스어셈블드",
    "normalizedTitle": "어벤저스디스어셈블드",
    "initialConsonants": "ㅇㅂㅈㅅㄷㅅㅇㅅㅂㄷ",
    "author": "Brian M",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0555",
    "title": "엑스맨 : 세컨드 커밍(Marvel)",
    "normalizedTitle": "엑스맨세컨드커밍marvel",
    "initialConsonants": "ㅇㅅㅁㅅㅋㄷㅋㅁmarvel",
    "author": "크레이그 카일",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0556",
    "title": "엑스맨: 다크 피닉스 사가",
    "normalizedTitle": "엑스맨다크피닉스사가",
    "initialConsonants": "ㅇㅅㅁㄷㅋㅍㄴㅅㅅㄱ",
    "author": "크리스 클레어",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0557",
    "title": "엑스맨: 데들리 제네시스",
    "normalizedTitle": "엑스맨데들리제네시스",
    "initialConsonants": "ㅇㅅㅁㄷㄷㄹㅈㄴㅅㅅ",
    "author": "크리스 클레어",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0558",
    "title": "엑스맨: 데이즈 오브 퓨쳐 패스트",
    "normalizedTitle": "엑스맨데이즈오브퓨쳐패스트",
    "initialConsonants": "ㅇㅅㅁㄷㅇㅈㅇㅂㅍㅊㅍㅅㅌ",
    "author": "크리스 클레어",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0559",
    "title": "엑스맨: 뮤턴트 제네시스",
    "normalizedTitle": "엑스맨뮤턴트제네시스",
    "initialConsonants": "ㅇㅅㅁㅁㅌㅌㅈㄴㅅㅅ",
    "author": "크리스 클레어",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0560",
    "title": "울고싶은 날의 보노보노",
    "normalizedTitle": "울고싶은날의보노보노",
    "initialConsonants": "ㅇㄱㅅㅇㄴㅇㅂㄴㅂㄴ",
    "author": "이가라시 미키오",
    "category": "그래픽노블",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0561",
    "title": "울기엔 좀 애매한",
    "normalizedTitle": "울기엔좀애매한",
    "initialConsonants": "ㅇㄱㅇㅈㅇㅁㅎ",
    "author": "최규석",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0562",
    "title": "위로받고 싶은 날의 보노보노",
    "normalizedTitle": "위로받고싶은날의보노보노",
    "initialConsonants": "ㅇㄹㅂㄱㅅㅇㄴㅇㅂㄴㅂㄴ",
    "author": "이가라시 미키오",
    "category": "그래픽노블",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0563",
    "title": "저스티스 리그, 위대한 승리",
    "normalizedTitle": "저스티스리그위대한승리",
    "initialConsonants": "ㅈㅅㅌㅅㄹㄱㅇㄷㅎㅅㄹ",
    "author": "제프 존스",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0564",
    "title": "제가 좀 별나긴 합니다만…",
    "normalizedTitle": "제가좀별나긴합니다만",
    "initialConsonants": "ㅈㄱㅈㅂㄴㄱㅎㄴㄷㅁ",
    "author": "쥘리 다셰 / 마드무아젤 카롤린",
    "category": "그래픽노블",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0565",
    "title": "주말엔 숲으로",
    "normalizedTitle": "주말엔숲으로",
    "initialConsonants": "ㅈㅁㅇㅅㅇㄹ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0566",
    "title": "지금 이대로 괜찮은 걸까?",
    "normalizedTitle": "지금이대로괜찮은걸까",
    "initialConsonants": "ㅈㄱㅇㄷㄹㄱㅊㅇㄱㄲ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0567",
    "title": "차의 시간",
    "normalizedTitle": "차의시간",
    "initialConsonants": "ㅊㅇㅅㄱ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0568",
    "title": "추락",
    "normalizedTitle": "추락",
    "initialConsonants": "ㅊㄹ",
    "author": "마드무아젤 카롤린",
    "category": "그래픽노블",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0569",
    "title": "치에코씨의 소소한 행복",
    "normalizedTitle": "치에코씨의소소한행복",
    "initialConsonants": "ㅊㅇㅋㅆㅇㅅㅅㅎㅎㅂ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0570",
    "title": "캡틴 아메리카: 윈터 솔저",
    "normalizedTitle": "캡틴아메리카윈터솔저",
    "initialConsonants": "ㅋㅌㅇㅁㄹㅋㅇㅌㅅㅈ",
    "author": "에드 브루베이커",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0571",
    "title": "캡틴 아메리카: 적색의 공포",
    "normalizedTitle": "캡틴아메리카적색의공포",
    "initialConsonants": "ㅋㅌㅇㅁㄹㅋㅈㅅㅇㄱㅍ",
    "author": "에드 브루베이커",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0572",
    "title": "토르: 천둥의 시대(Marvel)",
    "normalizedTitle": "토르천둥의시대marvel",
    "initialConsonants": "ㅌㄹㅊㄷㅇㅅㄷmarvel",
    "author": "Matt Fraction",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0573",
    "title": "평균 연령 60세 사와무라씨 댁 시리즈",
    "normalizedTitle": "평균연령60세사와무라씨댁시리즈",
    "initialConsonants": "ㅍㄱㅇㄹ60ㅅㅅㅇㅁㄹㅆㄷㅅㄹㅈ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0574",
    "title": "평균 연령 60세 사와무라씨 댁 행복한 수다",
    "normalizedTitle": "평균연령60세사와무라씨댁행복한수다",
    "initialConsonants": "ㅍㄱㅇㄹ60ㅅㅅㅇㅁㄹㅆㄷㅎㅂㅎㅅㄷ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0575",
    "title": "하우스 오브 엠(시공 그래픽 노블)",
    "normalizedTitle": "하우스오브엠시공그래픽노블",
    "initialConsonants": "ㅎㅇㅅㅇㅂㅇㅅㄱㄱㄹㅍㄴㅂ",
    "author": "BRIANMI",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0576",
    "title": "할리 퀸",
    "normalizedTitle": "할리퀸",
    "initialConsonants": "ㅎㄹㅋ",
    "author": "롭 윌리엄스",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0577",
    "title": "헐크: 월드 워 헐크(MARVEL)",
    "normalizedTitle": "헐크월드워헐크marvel",
    "initialConsonants": "ㅎㅋㅇㄷㅇㅎㅋmarvel",
    "author": "Greg Pak",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0578",
    "title": "헐크: 플래닛 헐크(시공 그래픽 노블)",
    "normalizedTitle": "헐크플래닛헐크시공그래픽노블",
    "initialConsonants": "ㅎㅋㅍㄹㄴㅎㅋㅅㄱㄱㄹㅍㄴㅂ",
    "author": "Greg Pak",
    "category": "마블DC",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0579",
    "title": "북유럽 빵빠라빵 여행",
    "normalizedTitle": "북유럽빵빠라빵여행",
    "initialConsonants": "ㅂㅇㄹㅃㅃㄹㅃㅇㅎ",
    "author": "야마모토 아리",
    "category": "요리/술",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0580",
    "title": "블루 자이언트 슈프림",
    "normalizedTitle": "블루자이언트슈프림",
    "initialConsonants": "ㅂㄹㅈㅇㅇㅌㅅㅍㄹ",
    "author": "이시즈카 신이치",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0581",
    "title": "블루 자이언트 익스플로러",
    "normalizedTitle": "블루자이언트익스플로러",
    "initialConsonants": "ㅂㄹㅈㅇㅇㅌㅇㅅㅍㄹㄹ",
    "author": "이시즈카 신이치",
    "category": "일상/드라마",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0582",
    "title": "마루밑 아리에티",
    "normalizedTitle": "마루밑아리에티",
    "initialConsonants": "ㅁㄹㅁㅇㄹㅇㅌ",
    "author": "미야자키 하야오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0583",
    "title": "벼랑 위의 포뇨",
    "normalizedTitle": "벼랑위의포뇨",
    "initialConsonants": "ㅂㄹㅇㅇㅍㄴ",
    "author": "미야자키 하야오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0585",
    "title": "센과 치히로의 행방불명",
    "normalizedTitle": "센과치히로의행방불명",
    "initialConsonants": "ㅅㄱㅊㅎㄹㅇㅎㅂㅂㅁ",
    "author": "미야자키 하야오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0586",
    "title": "이웃집 토토로",
    "normalizedTitle": "이웃집토토로",
    "initialConsonants": "ㅇㅇㅈㅌㅌㄹ",
    "author": "미야자키 하야오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0587",
    "title": "하울의 움직이는 성",
    "normalizedTitle": "하울의움직이는성",
    "initialConsonants": "ㅎㅇㅇㅇㅈㅇㄴㅅ",
    "author": "미야자키 하야오",
    "category": "명랑/코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0588",
    "title": "결혼하지 않아도 괜찮을까",
    "normalizedTitle": "결혼하지않아도괜찮을까",
    "initialConsonants": "ㄱㅎㅎㅈㅇㅇㄷㄱㅊㅇㄲ",
    "author": "마스다 미리",
    "category": "웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0589",
    "title": "일하는 세포 black",
    "normalizedTitle": "일하는세포black",
    "initialConsonants": "ㅇㅎㄴㅅㅍblack",
    "author": "미상",
    "category": "일상",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0590",
    "title": "블루 록 나기",
    "normalizedTitle": "블루록나기",
    "initialConsonants": "ㅂㄹㄹㄴㄱ",
    "author": "카네시로 무네유키",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0591",
    "title": "다이아몬드 에이스 2 외전",
    "normalizedTitle": "다이아몬드에이스2외전",
    "initialConsonants": "ㄷㅇㅇㅁㄷㅇㅇㅅ2ㅇㅈ",
    "author": "미상",
    "category": "스포츠",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0592",
    "title": "조조코믹스",
    "normalizedTitle": "조조코믹스",
    "initialConsonants": "ㅈㅈㅋㅁㅅ",
    "author": "이동건",
    "category": "일상",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0593",
    "title": "전지적 독자 시점",
    "normalizedTitle": "전지적독자시점",
    "initialConsonants": "ㅈㅈㅈㄷㅈㅅㅈ",
    "author": "슬리피",
    "category": "판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0594",
    "title": "이누야시키",
    "normalizedTitle": "이누야시키",
    "initialConsonants": "ㅇㄴㅇㅅㅋ",
    "author": "오쿠 히로야",
    "category": "sf/ 판타지",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0595",
    "title": "헌신하겠습니다",
    "normalizedTitle": "헌신하겠습니다",
    "initialConsonants": "ㅎㅅㅎㄱㅅㄴㄷ",
    "author": "토마 레이",
    "category": "순정",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0596",
    "title": "메이플스토리 수학도둑",
    "normalizedTitle": "메이플스토리수학도둑",
    "initialConsonants": "ㅁㅇㅍㅅㅌㄹㅅㅎㄷㄷ",
    "author": "여운방",
    "category": "아이/ 교육",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0597",
    "title": "GOGO 카카오프렌즈",
    "normalizedTitle": "gogo카카오프렌즈",
    "initialConsonants": "gogoㅋㅋㅇㅍㄹㅈ",
    "author": "김미영",
    "category": "아이/ 교육",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0598",
    "title": "레벨업 카카오프렌즈",
    "normalizedTitle": "레벨업카카오프렌즈",
    "initialConsonants": "ㄹㅂㅇㅋㅋㅇㅍㄹㅈ",
    "author": "김미영",
    "category": "아이/ 교육",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0599",
    "title": "카카오프렌즈 과학 탐정단",
    "normalizedTitle": "카카오프렌즈과학탐정단",
    "initialConsonants": "ㅋㅋㅇㅍㄹㅈㄱㅎㅌㅈㄷ",
    "author": "조영선",
    "category": "아이/ 교육",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0600",
    "title": "스페셜 솔져 영단어를 쏴라",
    "normalizedTitle": "스페셜솔져영단어를쏴라",
    "initialConsonants": "ㅅㅍㅅㅅㅈㅇㄷㅇㄹㅆㄹ",
    "author": "송도수",
    "category": "아이/ 교육",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0601",
    "title": "스페셜 솔져 생존탐험대",
    "normalizedTitle": "스페셜솔져생존탐험대",
    "initialConsonants": "ㅅㅍㅅㅅㅈㅅㅈㅌㅎㄷ",
    "author": "유대영",
    "category": "아이/ 교육",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0602",
    "title": "도티&잠뜰 코믹시리즈",
    "normalizedTitle": "도티잠뜰코믹시리즈",
    "initialConsonants": "ㄷㅌㅈㄸㅋㅁㅅㄹㅈ",
    "author": "김현수",
    "category": "아이/ 코믹",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-snu-0603",
    "title": "그램그램 영문법 원정대",
    "normalizedTitle": "그램그램영문법원정대",
    "initialConsonants": "ㄱㄹㄱㄹㅇㅁㅂㅇㅈㄷ",
    "author": "장영준",
    "category": "아이/ 교육",
    "createdAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "b-pop-0013",
    "title": "슬램덩크 신장재편판",
    "normalizedTitle": "슬램덩크신장재편판",
    "initialConsonants": "ㅅㄹㄷㅋㅅㅈㅈㅍㅍ",
    "author": "인기 작가",
    "category": "코믹스/웹툰",
    "createdAt": "2026-09-04T10:21:00Z"
  }
];

export const INITIAL_INVENTORIES: BookInventory[] = [
  {
    "id": "inv-snu-0001",
    "storeId": "snu",
    "bookId": "b-snu-0001",
    "volumeRange": "전권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0002",
    "storeId": "snu",
    "bookId": "b-snu-0002",
    "volumeRange": "전권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0003",
    "storeId": "snu",
    "bookId": "b-snu-0003",
    "volumeRange": "전권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0004",
    "storeId": "snu",
    "bookId": "b-snu-0004",
    "volumeRange": "전권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0005",
    "storeId": "snu",
    "bookId": "b-snu-0005",
    "volumeRange": "전권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0006",
    "storeId": "snu",
    "bookId": "b-snu-0006",
    "volumeRange": "1~6권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0007",
    "storeId": "snu",
    "bookId": "b-snu-0007",
    "volumeRange": "1~32권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0008",
    "storeId": "snu",
    "bookId": "b-snu-0008",
    "volumeRange": "1~68권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0009",
    "storeId": "snu",
    "bookId": "b-snu-0009",
    "volumeRange": "1~14권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0010",
    "storeId": "snu",
    "bookId": "b-snu-0010",
    "volumeRange": "1~20권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0011",
    "storeId": "snu",
    "bookId": "b-snu-0011",
    "volumeRange": "1~2권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0012",
    "storeId": "snu",
    "bookId": "b-snu-0012",
    "volumeRange": "1~9권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0013",
    "storeId": "snu",
    "bookId": "b-snu-0013",
    "volumeRange": "1~4권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0014",
    "storeId": "snu",
    "bookId": "b-snu-0014",
    "volumeRange": "1~5권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0015",
    "storeId": "snu",
    "bookId": "b-snu-0015",
    "volumeRange": "1~20권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0016",
    "storeId": "snu",
    "bookId": "b-snu-0016",
    "volumeRange": "1~38권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0017",
    "storeId": "snu",
    "bookId": "b-snu-0017",
    "volumeRange": "1~12권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0018",
    "storeId": "snu",
    "bookId": "b-snu-0018",
    "volumeRange": "1~9권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0019",
    "storeId": "snu",
    "bookId": "b-snu-0019",
    "volumeRange": "1~10권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0020",
    "storeId": "snu",
    "bookId": "b-snu-0020",
    "volumeRange": "1~8권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0021",
    "storeId": "snu",
    "bookId": "b-snu-0021",
    "volumeRange": "1~12권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0022",
    "storeId": "snu",
    "bookId": "b-snu-0022",
    "volumeRange": "1~13권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0023",
    "storeId": "snu",
    "bookId": "b-snu-0023",
    "volumeRange": "1~27권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0024",
    "storeId": "snu",
    "bookId": "b-snu-0024",
    "volumeRange": "1~20권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0025",
    "storeId": "snu",
    "bookId": "b-snu-0025",
    "volumeRange": "1~17권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0026",
    "storeId": "snu",
    "bookId": "b-snu-0026",
    "volumeRange": "1~14권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0027",
    "storeId": "snu",
    "bookId": "b-snu-0027",
    "volumeRange": "1~3권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0028",
    "storeId": "snu",
    "bookId": "b-snu-0028",
    "volumeRange": "1~7권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0029",
    "storeId": "snu",
    "bookId": "b-snu-0029",
    "volumeRange": "1~5권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0030",
    "storeId": "snu",
    "bookId": "b-snu-0030",
    "volumeRange": "1~24권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0031",
    "storeId": "snu",
    "bookId": "b-snu-0031",
    "volumeRange": "1~4권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0032",
    "storeId": "snu",
    "bookId": "b-snu-0032",
    "volumeRange": "1~2권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0033",
    "storeId": "snu",
    "bookId": "b-snu-0033",
    "volumeRange": "1~2권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0034",
    "storeId": "snu",
    "bookId": "b-snu-0034",
    "volumeRange": "1~3권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0035",
    "storeId": "snu",
    "bookId": "b-snu-0035",
    "volumeRange": "1~2권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0036",
    "storeId": "snu",
    "bookId": "b-snu-0036",
    "volumeRange": "1~4권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0037",
    "storeId": "snu",
    "bookId": "b-snu-0037",
    "volumeRange": "1~5권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0038",
    "storeId": "snu",
    "bookId": "b-snu-0038",
    "volumeRange": "1~18권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0039",
    "storeId": "snu",
    "bookId": "b-snu-0039",
    "volumeRange": "1~3권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0040",
    "storeId": "snu",
    "bookId": "b-snu-0040",
    "volumeRange": "1~6권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0041",
    "storeId": "snu",
    "bookId": "b-snu-0041",
    "volumeRange": "1~3권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0042",
    "storeId": "snu",
    "bookId": "b-snu-0042",
    "volumeRange": "1~9권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0043",
    "storeId": "snu",
    "bookId": "b-snu-0043",
    "volumeRange": "1~4권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0044",
    "storeId": "snu",
    "bookId": "b-snu-0044",
    "volumeRange": "1~6권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0045",
    "storeId": "snu",
    "bookId": "b-snu-0045",
    "volumeRange": "1~9권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0046",
    "storeId": "snu",
    "bookId": "b-snu-0046",
    "volumeRange": "1~6권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0047",
    "storeId": "snu",
    "bookId": "b-snu-0047",
    "volumeRange": "1~5권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0048",
    "storeId": "snu",
    "bookId": "b-snu-0048",
    "volumeRange": "1~9권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0049",
    "storeId": "snu",
    "bookId": "b-snu-0049",
    "volumeRange": "1~8권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0050",
    "storeId": "snu",
    "bookId": "b-snu-0050",
    "volumeRange": "1~7권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0051",
    "storeId": "snu",
    "bookId": "b-snu-0051",
    "volumeRange": "1~5권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0052",
    "storeId": "snu",
    "bookId": "b-snu-0052",
    "volumeRange": "1~5권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0053",
    "storeId": "snu",
    "bookId": "b-snu-0053",
    "volumeRange": "1~9권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0054",
    "storeId": "snu",
    "bookId": "b-snu-0054",
    "volumeRange": "1~7권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0055",
    "storeId": "snu",
    "bookId": "b-snu-0055",
    "volumeRange": "1~6권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0056",
    "storeId": "snu",
    "bookId": "b-snu-0056",
    "volumeRange": "1~10권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0057",
    "storeId": "snu",
    "bookId": "b-snu-0057",
    "volumeRange": "1~10권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0058",
    "storeId": "snu",
    "bookId": "b-snu-0058",
    "volumeRange": "1~6권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0059",
    "storeId": "snu",
    "bookId": "b-snu-0059",
    "volumeRange": "1~3권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0060",
    "storeId": "snu",
    "bookId": "b-snu-0060",
    "volumeRange": "1~5권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0061",
    "storeId": "snu",
    "bookId": "b-snu-0061",
    "volumeRange": "1~4권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0062",
    "storeId": "snu",
    "bookId": "b-snu-0062",
    "volumeRange": "1~6권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0063",
    "storeId": "snu",
    "bookId": "b-snu-0063",
    "volumeRange": "1~13권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0064",
    "storeId": "snu",
    "bookId": "b-snu-0064",
    "volumeRange": "1~3권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0065",
    "storeId": "snu",
    "bookId": "b-snu-0065",
    "volumeRange": "1~6권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0066",
    "storeId": "snu",
    "bookId": "b-snu-0066",
    "volumeRange": "1~9권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0067",
    "storeId": "snu",
    "bookId": "b-snu-0067",
    "volumeRange": "1~12권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0068",
    "storeId": "snu",
    "bookId": "b-snu-0068",
    "volumeRange": "1~7권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0069",
    "storeId": "snu",
    "bookId": "b-snu-0069",
    "volumeRange": "1~8권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0070",
    "storeId": "snu",
    "bookId": "b-snu-0070",
    "volumeRange": "1~10권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0071",
    "storeId": "snu",
    "bookId": "b-snu-0071",
    "volumeRange": "1~5권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0072",
    "storeId": "snu",
    "bookId": "b-snu-0072",
    "volumeRange": "1~19권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0073",
    "storeId": "snu",
    "bookId": "b-snu-0073",
    "volumeRange": "1~5권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0074",
    "storeId": "snu",
    "bookId": "b-snu-0074",
    "volumeRange": "1~9권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0075",
    "storeId": "snu",
    "bookId": "b-snu-0075",
    "volumeRange": "1~10권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0076",
    "storeId": "snu",
    "bookId": "b-snu-0076",
    "volumeRange": "1~8권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0077",
    "storeId": "snu",
    "bookId": "b-snu-0077",
    "volumeRange": "1권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0078",
    "storeId": "snu",
    "bookId": "b-snu-0078",
    "volumeRange": "1~4권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0079",
    "storeId": "snu",
    "bookId": "b-snu-0079",
    "volumeRange": "1~34권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0080",
    "storeId": "snu",
    "bookId": "b-snu-0080",
    "volumeRange": "1권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0081",
    "storeId": "snu",
    "bookId": "b-snu-0081",
    "volumeRange": "1~6권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0082",
    "storeId": "snu",
    "bookId": "b-snu-0082",
    "volumeRange": "1~5권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0083",
    "storeId": "snu",
    "bookId": "b-snu-0083",
    "volumeRange": "1~8권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0084",
    "storeId": "snu",
    "bookId": "b-snu-0084",
    "volumeRange": "1~5권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0085",
    "storeId": "snu",
    "bookId": "b-snu-0085",
    "volumeRange": "1권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0086",
    "storeId": "snu",
    "bookId": "b-snu-0086",
    "volumeRange": "1~9권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0087",
    "storeId": "snu",
    "bookId": "b-snu-0087",
    "volumeRange": "1~5권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0088",
    "storeId": "snu",
    "bookId": "b-snu-0088",
    "volumeRange": "1~4권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0089",
    "storeId": "snu",
    "bookId": "b-snu-0089",
    "volumeRange": "1~8권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0090",
    "storeId": "snu",
    "bookId": "b-snu-0090",
    "volumeRange": "1~11권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0091",
    "storeId": "snu",
    "bookId": "b-snu-0091",
    "volumeRange": "1~14권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0092",
    "storeId": "snu",
    "bookId": "b-snu-0092",
    "volumeRange": "1~10권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0093",
    "storeId": "snu",
    "bookId": "b-snu-0093",
    "volumeRange": "1~4권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0094",
    "storeId": "snu",
    "bookId": "b-snu-0094",
    "volumeRange": "1~9권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0095",
    "storeId": "snu",
    "bookId": "b-snu-0095",
    "volumeRange": "1권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0096",
    "storeId": "snu",
    "bookId": "b-snu-0096",
    "volumeRange": "1~9권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0097",
    "storeId": "snu",
    "bookId": "b-snu-0097",
    "volumeRange": "1~8권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0098",
    "storeId": "snu",
    "bookId": "b-snu-0098",
    "volumeRange": "1~17권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0099",
    "storeId": "snu",
    "bookId": "b-snu-0099",
    "volumeRange": "1권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0100",
    "storeId": "snu",
    "bookId": "b-snu-0100",
    "volumeRange": "1~3권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0101",
    "storeId": "snu",
    "bookId": "b-snu-0101",
    "volumeRange": "1~3권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0102",
    "storeId": "snu",
    "bookId": "b-snu-0102",
    "volumeRange": "1~12권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0103",
    "storeId": "snu",
    "bookId": "b-snu-0103",
    "volumeRange": "1~13권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0104",
    "storeId": "snu",
    "bookId": "b-snu-0104",
    "volumeRange": "1~11권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0105",
    "storeId": "snu",
    "bookId": "b-snu-0105",
    "volumeRange": "1권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0106",
    "storeId": "snu",
    "bookId": "b-snu-0106",
    "volumeRange": "1~18권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0107",
    "storeId": "snu",
    "bookId": "b-snu-0107",
    "volumeRange": "1~22권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0108",
    "storeId": "snu",
    "bookId": "b-snu-0108",
    "volumeRange": "1~20권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0109",
    "storeId": "snu",
    "bookId": "b-snu-0109",
    "volumeRange": "1~4권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0110",
    "storeId": "snu",
    "bookId": "b-snu-0110",
    "volumeRange": "1~12권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0111",
    "storeId": "snu",
    "bookId": "b-snu-0111",
    "volumeRange": "1~30권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0112",
    "storeId": "snu",
    "bookId": "b-snu-0112",
    "volumeRange": "1~3권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0113",
    "storeId": "snu",
    "bookId": "b-snu-0113",
    "volumeRange": "1~47권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0114",
    "storeId": "snu",
    "bookId": "b-snu-0114",
    "volumeRange": "1권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0115",
    "storeId": "snu",
    "bookId": "b-snu-0115",
    "volumeRange": "1권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0116",
    "storeId": "snu",
    "bookId": "b-snu-0116",
    "volumeRange": "1권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0117",
    "storeId": "snu",
    "bookId": "b-snu-0117",
    "volumeRange": "1권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0118",
    "storeId": "snu",
    "bookId": "b-snu-0118",
    "volumeRange": "1~19권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0119",
    "storeId": "snu",
    "bookId": "b-snu-0119",
    "volumeRange": "1~5권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0120",
    "storeId": "snu",
    "bookId": "b-snu-0120",
    "volumeRange": "1권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0121",
    "storeId": "snu",
    "bookId": "b-snu-0121",
    "volumeRange": "1~16권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0122",
    "storeId": "snu",
    "bookId": "b-snu-0122",
    "volumeRange": "1~9권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0123",
    "storeId": "snu",
    "bookId": "b-snu-0123",
    "volumeRange": "1~4권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0124",
    "storeId": "snu",
    "bookId": "b-snu-0124",
    "volumeRange": "1~5권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0125",
    "storeId": "snu",
    "bookId": "b-snu-0125",
    "volumeRange": "1~4권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0126",
    "storeId": "snu",
    "bookId": "b-snu-0126",
    "volumeRange": "1~9권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0127",
    "storeId": "snu",
    "bookId": "b-snu-0127",
    "volumeRange": "1~25권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0128",
    "storeId": "snu",
    "bookId": "b-snu-0128",
    "volumeRange": "1~5권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0129",
    "storeId": "snu",
    "bookId": "b-snu-0129",
    "volumeRange": "1~6권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0130",
    "storeId": "snu",
    "bookId": "b-snu-0130",
    "volumeRange": "1~13권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0131",
    "storeId": "snu",
    "bookId": "b-snu-0131",
    "volumeRange": "1~9권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0132",
    "storeId": "snu",
    "bookId": "b-snu-0132",
    "volumeRange": "1~19권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0133",
    "storeId": "snu",
    "bookId": "b-snu-0133",
    "volumeRange": "1~11권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0134",
    "storeId": "snu",
    "bookId": "b-snu-0134",
    "volumeRange": "1~50권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0135",
    "storeId": "snu",
    "bookId": "b-snu-0135",
    "volumeRange": "1~24권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0136",
    "storeId": "snu",
    "bookId": "b-snu-0136",
    "volumeRange": "1~10권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0137",
    "storeId": "snu",
    "bookId": "b-snu-0137",
    "volumeRange": "1~10권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0138",
    "storeId": "snu",
    "bookId": "b-snu-0138",
    "volumeRange": "1~30권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0139",
    "storeId": "snu",
    "bookId": "b-snu-0139",
    "volumeRange": "1~3권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0140",
    "storeId": "snu",
    "bookId": "b-snu-0140",
    "volumeRange": "1~42권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0141",
    "storeId": "snu",
    "bookId": "b-snu-0141",
    "volumeRange": "1~16권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0142",
    "storeId": "snu",
    "bookId": "b-snu-0142",
    "volumeRange": "1~5권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0143",
    "storeId": "snu",
    "bookId": "b-snu-0143",
    "volumeRange": "1~18권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0144",
    "storeId": "snu",
    "bookId": "b-snu-0144",
    "volumeRange": "1~26권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0145",
    "storeId": "snu",
    "bookId": "b-snu-0145",
    "volumeRange": "1~16권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0146",
    "storeId": "snu",
    "bookId": "b-snu-0146",
    "volumeRange": "1~11권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0147",
    "storeId": "snu",
    "bookId": "b-snu-0147",
    "volumeRange": "1~15권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0148",
    "storeId": "snu",
    "bookId": "b-snu-0148",
    "volumeRange": "1~25권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0149",
    "storeId": "snu",
    "bookId": "b-snu-0149",
    "volumeRange": "1~23권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0150",
    "storeId": "snu",
    "bookId": "b-snu-0150",
    "volumeRange": "1~10권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0151",
    "storeId": "snu",
    "bookId": "b-snu-0151",
    "volumeRange": "1~21권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0152",
    "storeId": "snu",
    "bookId": "b-snu-0152",
    "volumeRange": "1~8권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0153",
    "storeId": "snu",
    "bookId": "b-snu-0153",
    "volumeRange": "1~14권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0154",
    "storeId": "snu",
    "bookId": "b-snu-0154",
    "volumeRange": "1~17권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0155",
    "storeId": "snu",
    "bookId": "b-snu-0155",
    "volumeRange": "1~2권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0156",
    "storeId": "snu",
    "bookId": "b-snu-0156",
    "volumeRange": "1~4권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0157",
    "storeId": "snu",
    "bookId": "b-snu-0157",
    "volumeRange": "1~13권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0158",
    "storeId": "snu",
    "bookId": "b-snu-0158",
    "volumeRange": "1~4권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0159",
    "storeId": "snu",
    "bookId": "b-snu-0159",
    "volumeRange": "1~4권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0160",
    "storeId": "snu",
    "bookId": "b-snu-0160",
    "volumeRange": "1~4권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0161",
    "storeId": "snu",
    "bookId": "b-snu-0161",
    "volumeRange": "1~2권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0162",
    "storeId": "snu",
    "bookId": "b-snu-0162",
    "volumeRange": "1~12권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0163",
    "storeId": "snu",
    "bookId": "b-snu-0163",
    "volumeRange": "1~6권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0164",
    "storeId": "snu",
    "bookId": "b-snu-0164",
    "volumeRange": "1~6권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0165",
    "storeId": "snu",
    "bookId": "b-snu-0165",
    "volumeRange": "1~6권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0166",
    "storeId": "snu",
    "bookId": "b-snu-0166",
    "volumeRange": "1~3권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0167",
    "storeId": "snu",
    "bookId": "b-snu-0167",
    "volumeRange": "1~20권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0168",
    "storeId": "snu",
    "bookId": "b-snu-0168",
    "volumeRange": "1~5권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0169",
    "storeId": "snu",
    "bookId": "b-snu-0169",
    "volumeRange": "1~5권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0170",
    "storeId": "snu",
    "bookId": "b-snu-0170",
    "volumeRange": "1~8권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0171",
    "storeId": "snu",
    "bookId": "b-snu-0171",
    "volumeRange": "1~4권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0172",
    "storeId": "snu",
    "bookId": "b-snu-0172",
    "volumeRange": "1~10권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0173",
    "storeId": "snu",
    "bookId": "b-snu-0173",
    "volumeRange": "1~10권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0174",
    "storeId": "snu",
    "bookId": "b-snu-0174",
    "volumeRange": "1~2권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0175",
    "storeId": "snu",
    "bookId": "b-snu-0175",
    "volumeRange": "1~3권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0176",
    "storeId": "snu",
    "bookId": "b-snu-0176",
    "volumeRange": "1~2권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0177",
    "storeId": "snu",
    "bookId": "b-snu-0177",
    "volumeRange": "1~10권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0178",
    "storeId": "snu",
    "bookId": "b-snu-0178",
    "volumeRange": "1~20권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0179",
    "storeId": "snu",
    "bookId": "b-snu-0179",
    "volumeRange": "1~8권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0180",
    "storeId": "snu",
    "bookId": "b-snu-0180",
    "volumeRange": "1~16권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0181",
    "storeId": "snu",
    "bookId": "b-snu-0181",
    "volumeRange": "1~8권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0182",
    "storeId": "snu",
    "bookId": "b-snu-0182",
    "volumeRange": "1~7권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0183",
    "storeId": "snu",
    "bookId": "b-snu-0183",
    "volumeRange": "1~4권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0184",
    "storeId": "snu",
    "bookId": "b-snu-0184",
    "volumeRange": "1~8권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0185",
    "storeId": "snu",
    "bookId": "b-snu-0185",
    "volumeRange": "1~10권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0186",
    "storeId": "snu",
    "bookId": "b-snu-0186",
    "volumeRange": "1~5권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0187",
    "storeId": "snu",
    "bookId": "b-snu-0187",
    "volumeRange": "1~3권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0188",
    "storeId": "snu",
    "bookId": "b-snu-0188",
    "volumeRange": "1권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0189",
    "storeId": "snu",
    "bookId": "b-snu-0189",
    "volumeRange": "1~3권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0190",
    "storeId": "snu",
    "bookId": "b-snu-0190",
    "volumeRange": "1~2권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0191",
    "storeId": "snu",
    "bookId": "b-snu-0191",
    "volumeRange": "1~4권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0192",
    "storeId": "snu",
    "bookId": "b-snu-0192",
    "volumeRange": "1~5권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0193",
    "storeId": "snu",
    "bookId": "b-snu-0193",
    "volumeRange": "1~6권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0194",
    "storeId": "snu",
    "bookId": "b-snu-0194",
    "volumeRange": "1~8권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0195",
    "storeId": "snu",
    "bookId": "b-snu-0195",
    "volumeRange": "1~22권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0196",
    "storeId": "snu",
    "bookId": "b-snu-0196",
    "volumeRange": "1~22권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0197",
    "storeId": "snu",
    "bookId": "b-snu-0197",
    "volumeRange": "1~3권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0198",
    "storeId": "snu",
    "bookId": "b-snu-0198",
    "volumeRange": "1~4권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0199",
    "storeId": "snu",
    "bookId": "b-snu-0199",
    "volumeRange": "1~11권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0200",
    "storeId": "snu",
    "bookId": "b-snu-0200",
    "volumeRange": "1~12권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0201",
    "storeId": "snu",
    "bookId": "b-snu-0201",
    "volumeRange": "1~11권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0202",
    "storeId": "snu",
    "bookId": "b-snu-0202",
    "volumeRange": "1~27권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0203",
    "storeId": "snu",
    "bookId": "b-snu-0203",
    "volumeRange": "1~3권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0204",
    "storeId": "snu",
    "bookId": "b-snu-0204",
    "volumeRange": "1~10권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0205",
    "storeId": "snu",
    "bookId": "b-snu-0205",
    "volumeRange": "1~3권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0206",
    "storeId": "snu",
    "bookId": "b-snu-0206",
    "volumeRange": "1~12권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0207",
    "storeId": "snu",
    "bookId": "b-snu-0207",
    "volumeRange": "1~9권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0208",
    "storeId": "snu",
    "bookId": "b-snu-0208",
    "volumeRange": "1~16권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0209",
    "storeId": "snu",
    "bookId": "b-snu-0209",
    "volumeRange": "1~11권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0210",
    "storeId": "snu",
    "bookId": "b-snu-0210",
    "volumeRange": "1~16권",
    "shelfLocation": "2번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0211",
    "storeId": "snu",
    "bookId": "b-snu-0211",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0212",
    "storeId": "snu",
    "bookId": "b-snu-0212",
    "volumeRange": "1~15권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0213",
    "storeId": "snu",
    "bookId": "b-snu-0213",
    "volumeRange": "1~19권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0214",
    "storeId": "snu",
    "bookId": "b-snu-0214",
    "volumeRange": "1~17권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0215",
    "storeId": "snu",
    "bookId": "b-snu-0215",
    "volumeRange": "1~11권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0216",
    "storeId": "snu",
    "bookId": "b-snu-0216",
    "volumeRange": "1~5권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0217",
    "storeId": "snu",
    "bookId": "b-snu-0217",
    "volumeRange": "1~9권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0218",
    "storeId": "snu",
    "bookId": "b-snu-0218",
    "volumeRange": "1~4권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0219",
    "storeId": "snu",
    "bookId": "b-snu-0219",
    "volumeRange": "1~5권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0220",
    "storeId": "snu",
    "bookId": "b-snu-0220",
    "volumeRange": "1~4권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0221",
    "storeId": "snu",
    "bookId": "b-snu-0221",
    "volumeRange": "1~4권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0222",
    "storeId": "snu",
    "bookId": "b-snu-0222",
    "volumeRange": "1~6권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0223",
    "storeId": "snu",
    "bookId": "b-snu-0223",
    "volumeRange": "1권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0224",
    "storeId": "snu",
    "bookId": "b-snu-0224",
    "volumeRange": "1~4권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0225",
    "storeId": "snu",
    "bookId": "b-snu-0225",
    "volumeRange": "1~9권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0226",
    "storeId": "snu",
    "bookId": "b-snu-0226",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0227",
    "storeId": "snu",
    "bookId": "b-snu-0227",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0228",
    "storeId": "snu",
    "bookId": "b-snu-0228",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0229",
    "storeId": "snu",
    "bookId": "b-snu-0229",
    "volumeRange": "1~21권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0230",
    "storeId": "snu",
    "bookId": "b-snu-0230",
    "volumeRange": "1~4권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0231",
    "storeId": "snu",
    "bookId": "b-snu-0231",
    "volumeRange": "1~6권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0232",
    "storeId": "snu",
    "bookId": "b-snu-0232",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0233",
    "storeId": "snu",
    "bookId": "b-snu-0233",
    "volumeRange": "1~5권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0234",
    "storeId": "snu",
    "bookId": "b-snu-0234",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0235",
    "storeId": "snu",
    "bookId": "b-snu-0235",
    "volumeRange": "1~5권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0236",
    "storeId": "snu",
    "bookId": "b-snu-0236",
    "volumeRange": "1~8권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0237",
    "storeId": "snu",
    "bookId": "b-snu-0237",
    "volumeRange": "1~5권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0238",
    "storeId": "snu",
    "bookId": "b-snu-0238",
    "volumeRange": "1~9권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0239",
    "storeId": "snu",
    "bookId": "b-snu-0239",
    "volumeRange": "1~4권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0240",
    "storeId": "snu",
    "bookId": "b-snu-0240",
    "volumeRange": "1~6권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0241",
    "storeId": "snu",
    "bookId": "b-snu-0241",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0242",
    "storeId": "snu",
    "bookId": "b-snu-0242",
    "volumeRange": "1~12권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0243",
    "storeId": "snu",
    "bookId": "b-snu-0243",
    "volumeRange": "1~4권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0244",
    "storeId": "snu",
    "bookId": "b-snu-0244",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0245",
    "storeId": "snu",
    "bookId": "b-snu-0245",
    "volumeRange": "1~2권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0246",
    "storeId": "snu",
    "bookId": "b-snu-0246",
    "volumeRange": "1~20권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0247",
    "storeId": "snu",
    "bookId": "b-snu-0247",
    "volumeRange": "1~2권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0248",
    "storeId": "snu",
    "bookId": "b-snu-0248",
    "volumeRange": "1~6권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0249",
    "storeId": "snu",
    "bookId": "b-snu-0249",
    "volumeRange": "1~6권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0250",
    "storeId": "snu",
    "bookId": "b-snu-0250",
    "volumeRange": "1~7권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0251",
    "storeId": "snu",
    "bookId": "b-snu-0251",
    "volumeRange": "1권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0252",
    "storeId": "snu",
    "bookId": "b-snu-0252",
    "volumeRange": "1~2권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0253",
    "storeId": "snu",
    "bookId": "b-snu-0253",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0254",
    "storeId": "snu",
    "bookId": "b-snu-0254",
    "volumeRange": "1~3권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0255",
    "storeId": "snu",
    "bookId": "b-snu-0255",
    "volumeRange": "1~9권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0256",
    "storeId": "snu",
    "bookId": "b-snu-0256",
    "volumeRange": "1~8권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0257",
    "storeId": "snu",
    "bookId": "b-snu-0257",
    "volumeRange": "1~8권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0258",
    "storeId": "snu",
    "bookId": "b-snu-0258",
    "volumeRange": "1~6권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0259",
    "storeId": "snu",
    "bookId": "b-snu-0259",
    "volumeRange": "1~6권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0260",
    "storeId": "snu",
    "bookId": "b-snu-0260",
    "volumeRange": "1권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0261",
    "storeId": "snu",
    "bookId": "b-snu-0261",
    "volumeRange": "1~3권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0262",
    "storeId": "snu",
    "bookId": "b-snu-0262",
    "volumeRange": "1~7권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0263",
    "storeId": "snu",
    "bookId": "b-snu-0263",
    "volumeRange": "1~7권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0264",
    "storeId": "snu",
    "bookId": "b-snu-0264",
    "volumeRange": "1~8권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0265",
    "storeId": "snu",
    "bookId": "b-snu-0265",
    "volumeRange": "1~5권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0266",
    "storeId": "snu",
    "bookId": "b-snu-0266",
    "volumeRange": "1~6권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0267",
    "storeId": "snu",
    "bookId": "b-snu-0267",
    "volumeRange": "1~9권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0268",
    "storeId": "snu",
    "bookId": "b-snu-0268",
    "volumeRange": "1~7권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0269",
    "storeId": "snu",
    "bookId": "b-snu-0269",
    "volumeRange": "1권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0270",
    "storeId": "snu",
    "bookId": "b-snu-0270",
    "volumeRange": "1~2권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0271",
    "storeId": "snu",
    "bookId": "b-snu-0271",
    "volumeRange": "1~2권",
    "shelfLocation": "4번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0272",
    "storeId": "snu",
    "bookId": "b-snu-0272",
    "volumeRange": "1~9권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0273",
    "storeId": "snu",
    "bookId": "b-snu-0273",
    "volumeRange": "1~11권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0274",
    "storeId": "snu",
    "bookId": "b-snu-0274",
    "volumeRange": "1~19권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0275",
    "storeId": "snu",
    "bookId": "b-snu-0275",
    "volumeRange": "1~7권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0276",
    "storeId": "snu",
    "bookId": "b-snu-0276",
    "volumeRange": "1~14권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0277",
    "storeId": "snu",
    "bookId": "b-snu-0277",
    "volumeRange": "1~24권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0278",
    "storeId": "snu",
    "bookId": "b-snu-0278",
    "volumeRange": "1~33권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0279",
    "storeId": "snu",
    "bookId": "b-snu-0279",
    "volumeRange": "1~4권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0280",
    "storeId": "snu",
    "bookId": "b-snu-0280",
    "volumeRange": "1~18권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0281",
    "storeId": "snu",
    "bookId": "b-snu-0281",
    "volumeRange": "1~26권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0282",
    "storeId": "snu",
    "bookId": "b-snu-0282",
    "volumeRange": "1~15권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0283",
    "storeId": "snu",
    "bookId": "b-snu-0283",
    "volumeRange": "1~12권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0284",
    "storeId": "snu",
    "bookId": "b-snu-0284",
    "volumeRange": "1~12권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0285",
    "storeId": "snu",
    "bookId": "b-snu-0285",
    "volumeRange": "1~17권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0286",
    "storeId": "snu",
    "bookId": "b-snu-0286",
    "volumeRange": "1~21권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0287",
    "storeId": "snu",
    "bookId": "b-snu-0287",
    "volumeRange": "1~18권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0288",
    "storeId": "snu",
    "bookId": "b-snu-0288",
    "volumeRange": "1~7권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0289",
    "storeId": "snu",
    "bookId": "b-snu-0289",
    "volumeRange": "1~20권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0290",
    "storeId": "snu",
    "bookId": "b-snu-0290",
    "volumeRange": "1~4권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0291",
    "storeId": "snu",
    "bookId": "b-snu-0291",
    "volumeRange": "1~31권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0292",
    "storeId": "snu",
    "bookId": "b-snu-0292",
    "volumeRange": "1~27권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0293",
    "storeId": "snu",
    "bookId": "b-snu-0293",
    "volumeRange": "1~21권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0294",
    "storeId": "snu",
    "bookId": "b-snu-0294",
    "volumeRange": "1~50권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0295",
    "storeId": "snu",
    "bookId": "b-snu-0295",
    "volumeRange": "1~19권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0296",
    "storeId": "snu",
    "bookId": "b-snu-0296",
    "volumeRange": "1~15권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0297",
    "storeId": "snu",
    "bookId": "b-snu-0297",
    "volumeRange": "1~36권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0298",
    "storeId": "snu",
    "bookId": "b-snu-0298",
    "volumeRange": "1~22권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0299",
    "storeId": "snu",
    "bookId": "b-snu-0299",
    "volumeRange": "1~20권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0300",
    "storeId": "snu",
    "bookId": "b-snu-0300",
    "volumeRange": "1~36권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0301",
    "storeId": "snu",
    "bookId": "b-snu-0301",
    "volumeRange": "1~45권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0302",
    "storeId": "snu",
    "bookId": "b-snu-0302",
    "volumeRange": "1~8권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0303",
    "storeId": "snu",
    "bookId": "b-snu-0303",
    "volumeRange": "1~23권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0304",
    "storeId": "snu",
    "bookId": "b-snu-0304",
    "volumeRange": "1~24권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0305",
    "storeId": "snu",
    "bookId": "b-snu-0305",
    "volumeRange": "1~16권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0306",
    "storeId": "snu",
    "bookId": "b-snu-0306",
    "volumeRange": "1~2권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0307",
    "storeId": "snu",
    "bookId": "b-snu-0307",
    "volumeRange": "1~2권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0308",
    "storeId": "snu",
    "bookId": "b-snu-0308",
    "volumeRange": "1~10권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0309",
    "storeId": "snu",
    "bookId": "b-snu-0309",
    "volumeRange": "1~3권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0310",
    "storeId": "snu",
    "bookId": "b-snu-0310",
    "volumeRange": "1~13권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0311",
    "storeId": "snu",
    "bookId": "b-snu-0311",
    "volumeRange": "1~25권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0312",
    "storeId": "snu",
    "bookId": "b-snu-0312",
    "volumeRange": "1~4권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0313",
    "storeId": "snu",
    "bookId": "b-snu-0313",
    "volumeRange": "1~75권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0314",
    "storeId": "snu",
    "bookId": "b-snu-0314",
    "volumeRange": "1~23권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0315",
    "storeId": "snu",
    "bookId": "b-snu-0315",
    "volumeRange": "1~3권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0316",
    "storeId": "snu",
    "bookId": "b-snu-0316",
    "volumeRange": "1~37권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0317",
    "storeId": "snu",
    "bookId": "b-snu-0317",
    "volumeRange": "1~19권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0318",
    "storeId": "snu",
    "bookId": "b-snu-0318",
    "volumeRange": "1~41권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0319",
    "storeId": "snu",
    "bookId": "b-snu-0319",
    "volumeRange": "1~63권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0320",
    "storeId": "snu",
    "bookId": "b-snu-0320",
    "volumeRange": "1~144권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0321",
    "storeId": "snu",
    "bookId": "b-snu-0321",
    "volumeRange": "1~22권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0322",
    "storeId": "snu",
    "bookId": "b-snu-0322",
    "volumeRange": "1~5권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0323",
    "storeId": "snu",
    "bookId": "b-snu-0323",
    "volumeRange": "1~17권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0324",
    "storeId": "snu",
    "bookId": "b-snu-0324",
    "volumeRange": "1~18권",
    "shelfLocation": "14번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0325",
    "storeId": "snu",
    "bookId": "b-snu-0325",
    "volumeRange": "1~22권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0326",
    "storeId": "snu",
    "bookId": "b-snu-0326",
    "volumeRange": "1~16권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0327",
    "storeId": "snu",
    "bookId": "b-snu-0327",
    "volumeRange": "1~12권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0328",
    "storeId": "snu",
    "bookId": "b-snu-0328",
    "volumeRange": "1~14권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0329",
    "storeId": "snu",
    "bookId": "b-snu-0329",
    "volumeRange": "1~95권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0330",
    "storeId": "snu",
    "bookId": "b-snu-0330",
    "volumeRange": "1~15권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0331",
    "storeId": "snu",
    "bookId": "b-snu-0331",
    "volumeRange": "1~7권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0332",
    "storeId": "snu",
    "bookId": "b-snu-0332",
    "volumeRange": "1~17권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0333",
    "storeId": "snu",
    "bookId": "b-snu-0333",
    "volumeRange": "1~12권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0334",
    "storeId": "snu",
    "bookId": "b-snu-0334",
    "volumeRange": "1~6권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0335",
    "storeId": "snu",
    "bookId": "b-snu-0335",
    "volumeRange": "1~18권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0336",
    "storeId": "snu",
    "bookId": "b-snu-0336",
    "volumeRange": "1~6권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0337",
    "storeId": "snu",
    "bookId": "b-snu-0337",
    "volumeRange": "1~18권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0338",
    "storeId": "snu",
    "bookId": "b-snu-0338",
    "volumeRange": "1~38권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0339",
    "storeId": "snu",
    "bookId": "b-snu-0339",
    "volumeRange": "1~107권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0340",
    "storeId": "snu",
    "bookId": "b-snu-0340",
    "volumeRange": "1~4권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0341",
    "storeId": "snu",
    "bookId": "b-snu-0341",
    "volumeRange": "1~39권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0342",
    "storeId": "snu",
    "bookId": "b-snu-0342",
    "volumeRange": "1~32권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0343",
    "storeId": "snu",
    "bookId": "b-snu-0343",
    "volumeRange": "1~6권",
    "shelfLocation": "15번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0344",
    "storeId": "snu",
    "bookId": "b-snu-0344",
    "volumeRange": "1~24권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0345",
    "storeId": "snu",
    "bookId": "b-snu-0345",
    "volumeRange": "1~6권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0346",
    "storeId": "snu",
    "bookId": "b-snu-0346",
    "volumeRange": "1~34권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0347",
    "storeId": "snu",
    "bookId": "b-snu-0347",
    "volumeRange": "1~77권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0348",
    "storeId": "snu",
    "bookId": "b-snu-0348",
    "volumeRange": "1~34권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0349",
    "storeId": "snu",
    "bookId": "b-snu-0349",
    "volumeRange": "1~17권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0350",
    "storeId": "snu",
    "bookId": "b-snu-0350",
    "volumeRange": "1~21권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0351",
    "storeId": "snu",
    "bookId": "b-snu-0351",
    "volumeRange": "1~25권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0352",
    "storeId": "snu",
    "bookId": "b-snu-0352",
    "volumeRange": "1~114권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0353",
    "storeId": "snu",
    "bookId": "b-snu-0353",
    "volumeRange": "1권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0354",
    "storeId": "snu",
    "bookId": "b-snu-0354",
    "volumeRange": "1권",
    "shelfLocation": "16번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0355",
    "storeId": "snu",
    "bookId": "b-snu-0355",
    "volumeRange": "1~18권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0356",
    "storeId": "snu",
    "bookId": "b-snu-0356",
    "volumeRange": "1~29권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0357",
    "storeId": "snu",
    "bookId": "b-snu-0357",
    "volumeRange": "1~15권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0358",
    "storeId": "snu",
    "bookId": "b-snu-0358",
    "volumeRange": "1~12권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0359",
    "storeId": "snu",
    "bookId": "b-snu-0359",
    "volumeRange": "1~9권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0360",
    "storeId": "snu",
    "bookId": "b-snu-0360",
    "volumeRange": "1~38권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0361",
    "storeId": "snu",
    "bookId": "b-snu-0361",
    "volumeRange": "1~31권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0362",
    "storeId": "snu",
    "bookId": "b-snu-0362",
    "volumeRange": "1~6권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0363",
    "storeId": "snu",
    "bookId": "b-snu-0363",
    "volumeRange": "1~34권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0364",
    "storeId": "snu",
    "bookId": "b-snu-0364",
    "volumeRange": "1~24권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0365",
    "storeId": "snu",
    "bookId": "b-snu-0365",
    "volumeRange": "1~72권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0366",
    "storeId": "snu",
    "bookId": "b-snu-0366",
    "volumeRange": "1~20권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0367",
    "storeId": "snu",
    "bookId": "b-snu-0367",
    "volumeRange": "1~35권",
    "shelfLocation": "17번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0368",
    "storeId": "snu",
    "bookId": "b-snu-0368",
    "volumeRange": "1~22권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0369",
    "storeId": "snu",
    "bookId": "b-snu-0369",
    "volumeRange": "1~47권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0370",
    "storeId": "snu",
    "bookId": "b-snu-0370",
    "volumeRange": "1~34권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0371",
    "storeId": "snu",
    "bookId": "b-snu-0371",
    "volumeRange": "1~78권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0372",
    "storeId": "snu",
    "bookId": "b-snu-0372",
    "volumeRange": "1~30권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0373",
    "storeId": "snu",
    "bookId": "b-snu-0373",
    "volumeRange": "1~92권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0374",
    "storeId": "snu",
    "bookId": "b-snu-0374",
    "volumeRange": "1~16권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0375",
    "storeId": "snu",
    "bookId": "b-snu-0375",
    "volumeRange": "1~21권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0376",
    "storeId": "snu",
    "bookId": "b-snu-0376",
    "volumeRange": "1~31권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0377",
    "storeId": "snu",
    "bookId": "b-snu-0377",
    "volumeRange": "1~8권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0378",
    "storeId": "snu",
    "bookId": "b-snu-0378",
    "volumeRange": "1~11권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0379",
    "storeId": "snu",
    "bookId": "b-snu-0379",
    "volumeRange": "1~42권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0380",
    "storeId": "snu",
    "bookId": "b-snu-0380",
    "volumeRange": "1~40권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0381",
    "storeId": "snu",
    "bookId": "b-snu-0381",
    "volumeRange": "1~3권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0382",
    "storeId": "snu",
    "bookId": "b-snu-0382",
    "volumeRange": "1~5권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0383",
    "storeId": "snu",
    "bookId": "b-snu-0383",
    "volumeRange": "1~6권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0384",
    "storeId": "snu",
    "bookId": "b-snu-0384",
    "volumeRange": "1~4권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0385",
    "storeId": "snu",
    "bookId": "b-snu-0385",
    "volumeRange": "1~38권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0386",
    "storeId": "snu",
    "bookId": "b-snu-0386",
    "volumeRange": "1~32권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0387",
    "storeId": "snu",
    "bookId": "b-snu-0387",
    "volumeRange": "1~34권",
    "shelfLocation": "7번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0388",
    "storeId": "snu",
    "bookId": "b-snu-0388",
    "volumeRange": "1~5권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0389",
    "storeId": "snu",
    "bookId": "b-snu-0389",
    "volumeRange": "1~17권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0390",
    "storeId": "snu",
    "bookId": "b-snu-0390",
    "volumeRange": "1~24권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0391",
    "storeId": "snu",
    "bookId": "b-snu-0391",
    "volumeRange": "1~41권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0392",
    "storeId": "snu",
    "bookId": "b-snu-0392",
    "volumeRange": "1~27권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0393",
    "storeId": "snu",
    "bookId": "b-snu-0393",
    "volumeRange": "1~8권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0394",
    "storeId": "snu",
    "bookId": "b-snu-0394",
    "volumeRange": "1~21권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0395",
    "storeId": "snu",
    "bookId": "b-snu-0395",
    "volumeRange": "1~10권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0396",
    "storeId": "snu",
    "bookId": "b-snu-0396",
    "volumeRange": "1~18권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0397",
    "storeId": "snu",
    "bookId": "b-snu-0397",
    "volumeRange": "1~36권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0398",
    "storeId": "snu",
    "bookId": "b-snu-0398",
    "volumeRange": "1~44권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0399",
    "storeId": "snu",
    "bookId": "b-snu-0399",
    "volumeRange": "1~26권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0400",
    "storeId": "snu",
    "bookId": "b-snu-0400",
    "volumeRange": "1~2권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0401",
    "storeId": "snu",
    "bookId": "b-snu-0401",
    "volumeRange": "1~2권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0402",
    "storeId": "snu",
    "bookId": "b-snu-0402",
    "volumeRange": "1~30권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0403",
    "storeId": "snu",
    "bookId": "b-snu-0403",
    "volumeRange": "1~45권",
    "shelfLocation": "8번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0404",
    "storeId": "snu",
    "bookId": "b-snu-0404",
    "volumeRange": "1~19권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0405",
    "storeId": "snu",
    "bookId": "b-snu-0405",
    "volumeRange": "1권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0406",
    "storeId": "snu",
    "bookId": "b-snu-0406",
    "volumeRange": "1~4권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0407",
    "storeId": "snu",
    "bookId": "b-snu-0407",
    "volumeRange": "1~4권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0408",
    "storeId": "snu",
    "bookId": "b-snu-0408",
    "volumeRange": "1~10권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0409",
    "storeId": "snu",
    "bookId": "b-snu-0409",
    "volumeRange": "1~2권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0410",
    "storeId": "snu",
    "bookId": "b-snu-0410",
    "volumeRange": "1~5권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0411",
    "storeId": "snu",
    "bookId": "b-snu-0411",
    "volumeRange": "1~8권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0412",
    "storeId": "snu",
    "bookId": "b-snu-0412",
    "volumeRange": "1~8권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0413",
    "storeId": "snu",
    "bookId": "b-snu-0413",
    "volumeRange": "1~4권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0414",
    "storeId": "snu",
    "bookId": "b-snu-0414",
    "volumeRange": "1~14권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0415",
    "storeId": "snu",
    "bookId": "b-snu-0415",
    "volumeRange": "1~16권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0416",
    "storeId": "snu",
    "bookId": "b-snu-0416",
    "volumeRange": "1~20권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0417",
    "storeId": "snu",
    "bookId": "b-snu-0417",
    "volumeRange": "1~42권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0418",
    "storeId": "snu",
    "bookId": "b-snu-0418",
    "volumeRange": "1~7권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0419",
    "storeId": "snu",
    "bookId": "b-snu-0419",
    "volumeRange": "1~5권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0420",
    "storeId": "snu",
    "bookId": "b-snu-0420",
    "volumeRange": "1~21권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0421",
    "storeId": "snu",
    "bookId": "b-snu-0421",
    "volumeRange": "1~17권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0422",
    "storeId": "snu",
    "bookId": "b-snu-0422",
    "volumeRange": "1~5권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0423",
    "storeId": "snu",
    "bookId": "b-snu-0423",
    "volumeRange": "1~2권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0424",
    "storeId": "snu",
    "bookId": "b-snu-0423",
    "volumeRange": "1~14권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0425",
    "storeId": "snu",
    "bookId": "b-snu-0425",
    "volumeRange": "1~6권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0426",
    "storeId": "snu",
    "bookId": "b-snu-0426",
    "volumeRange": "1~17권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0427",
    "storeId": "snu",
    "bookId": "b-snu-0427",
    "volumeRange": "1~10권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0428",
    "storeId": "snu",
    "bookId": "b-snu-0428",
    "volumeRange": "1~3권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0429",
    "storeId": "snu",
    "bookId": "b-snu-0429",
    "volumeRange": "1~10권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0430",
    "storeId": "snu",
    "bookId": "b-snu-0430",
    "volumeRange": "1~20권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0431",
    "storeId": "snu",
    "bookId": "b-snu-0431",
    "volumeRange": "1~5권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0432",
    "storeId": "snu",
    "bookId": "b-snu-0432",
    "volumeRange": "1권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0433",
    "storeId": "snu",
    "bookId": "b-snu-0433",
    "volumeRange": "1~5권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0434",
    "storeId": "snu",
    "bookId": "b-snu-0434",
    "volumeRange": "1~3권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0435",
    "storeId": "snu",
    "bookId": "b-snu-0435",
    "volumeRange": "1권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0436",
    "storeId": "snu",
    "bookId": "b-snu-0436",
    "volumeRange": "1~3권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0437",
    "storeId": "snu",
    "bookId": "b-snu-0437",
    "volumeRange": "1~5권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0438",
    "storeId": "snu",
    "bookId": "b-snu-0438",
    "volumeRange": "1~11권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0439",
    "storeId": "snu",
    "bookId": "b-snu-0439",
    "volumeRange": "1~3권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0440",
    "storeId": "snu",
    "bookId": "b-snu-0131",
    "volumeRange": "1~3권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0441",
    "storeId": "snu",
    "bookId": "b-snu-0441",
    "volumeRange": "1~2권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0442",
    "storeId": "snu",
    "bookId": "b-snu-0442",
    "volumeRange": "1~21권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0443",
    "storeId": "snu",
    "bookId": "b-snu-0443",
    "volumeRange": "1~10권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0444",
    "storeId": "snu",
    "bookId": "b-snu-0444",
    "volumeRange": "1~14권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0445",
    "storeId": "snu",
    "bookId": "b-snu-0445",
    "volumeRange": "1~4권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0446",
    "storeId": "snu",
    "bookId": "b-snu-0446",
    "volumeRange": "1~23권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0447",
    "storeId": "snu",
    "bookId": "b-snu-0447",
    "volumeRange": "1~4권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0448",
    "storeId": "snu",
    "bookId": "b-snu-0448",
    "volumeRange": "1~12권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0449",
    "storeId": "snu",
    "bookId": "b-snu-0449",
    "volumeRange": "1~22권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0450",
    "storeId": "snu",
    "bookId": "b-snu-0450",
    "volumeRange": "1~3권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0451",
    "storeId": "snu",
    "bookId": "b-snu-0451",
    "volumeRange": "1~3권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0452",
    "storeId": "snu",
    "bookId": "b-snu-0452",
    "volumeRange": "1~2권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0453",
    "storeId": "snu",
    "bookId": "b-snu-0453",
    "volumeRange": "1~2권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0454",
    "storeId": "snu",
    "bookId": "b-snu-0454",
    "volumeRange": "1~6권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0455",
    "storeId": "snu",
    "bookId": "b-snu-0455",
    "volumeRange": "1~9권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0456",
    "storeId": "snu",
    "bookId": "b-snu-0456",
    "volumeRange": "1~12권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0457",
    "storeId": "snu",
    "bookId": "b-snu-0457",
    "volumeRange": "1~10권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0458",
    "storeId": "snu",
    "bookId": "b-snu-0458",
    "volumeRange": "1~6권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0459",
    "storeId": "snu",
    "bookId": "b-snu-0459",
    "volumeRange": "1~22권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0460",
    "storeId": "snu",
    "bookId": "b-snu-0460",
    "volumeRange": "1~3권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0461",
    "storeId": "snu",
    "bookId": "b-snu-0461",
    "volumeRange": "1~23권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0462",
    "storeId": "snu",
    "bookId": "b-snu-0462",
    "volumeRange": "1~8권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0463",
    "storeId": "snu",
    "bookId": "b-snu-0463",
    "volumeRange": "1~28권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0464",
    "storeId": "snu",
    "bookId": "b-snu-0464",
    "volumeRange": "1~3권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0465",
    "storeId": "snu",
    "bookId": "b-snu-0465",
    "volumeRange": "1~3권",
    "shelfLocation": "10번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0466",
    "storeId": "snu",
    "bookId": "b-snu-0466",
    "volumeRange": "1권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0467",
    "storeId": "snu",
    "bookId": "b-snu-0467",
    "volumeRange": "1~5권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0468",
    "storeId": "snu",
    "bookId": "b-snu-0468",
    "volumeRange": "1~6권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0469",
    "storeId": "snu",
    "bookId": "b-snu-0469",
    "volumeRange": "1~4권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0470",
    "storeId": "snu",
    "bookId": "b-snu-0470",
    "volumeRange": "1~12권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0471",
    "storeId": "snu",
    "bookId": "b-snu-0471",
    "volumeRange": "1~7권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0472",
    "storeId": "snu",
    "bookId": "b-snu-0472",
    "volumeRange": "1~6권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0473",
    "storeId": "snu",
    "bookId": "b-snu-0473",
    "volumeRange": "1~14권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0474",
    "storeId": "snu",
    "bookId": "b-snu-0474",
    "volumeRange": "1~9권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0475",
    "storeId": "snu",
    "bookId": "b-snu-0475",
    "volumeRange": "1~13권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0476",
    "storeId": "snu",
    "bookId": "b-snu-0476",
    "volumeRange": "1~24권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0477",
    "storeId": "snu",
    "bookId": "b-snu-0477",
    "volumeRange": "1~17권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0478",
    "storeId": "snu",
    "bookId": "b-snu-0478",
    "volumeRange": "1~5권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0479",
    "storeId": "snu",
    "bookId": "b-snu-0479",
    "volumeRange": "1~16권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0480",
    "storeId": "snu",
    "bookId": "b-snu-0480",
    "volumeRange": "1~23권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0481",
    "storeId": "snu",
    "bookId": "b-snu-0481",
    "volumeRange": "1~28권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0482",
    "storeId": "snu",
    "bookId": "b-snu-0482",
    "volumeRange": "1~15권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0483",
    "storeId": "snu",
    "bookId": "b-snu-0483",
    "volumeRange": "1~4권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0484",
    "storeId": "snu",
    "bookId": "b-snu-0484",
    "volumeRange": "1~14권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0485",
    "storeId": "snu",
    "bookId": "b-snu-0485",
    "volumeRange": "1~6권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0486",
    "storeId": "snu",
    "bookId": "b-snu-0486",
    "volumeRange": "1~25권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0487",
    "storeId": "snu",
    "bookId": "b-snu-0487",
    "volumeRange": "1~25권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0488",
    "storeId": "snu",
    "bookId": "b-snu-0488",
    "volumeRange": "1~6권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0489",
    "storeId": "snu",
    "bookId": "b-snu-0489",
    "volumeRange": "1~16권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0490",
    "storeId": "snu",
    "bookId": "b-snu-0490",
    "volumeRange": "1~13권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0491",
    "storeId": "snu",
    "bookId": "b-snu-0491",
    "volumeRange": "1~8권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0492",
    "storeId": "snu",
    "bookId": "b-snu-0492",
    "volumeRange": "1~16권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0493",
    "storeId": "snu",
    "bookId": "b-snu-0493",
    "volumeRange": "1~16권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0494",
    "storeId": "snu",
    "bookId": "b-snu-0494",
    "volumeRange": "1~8권",
    "shelfLocation": "11번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0495",
    "storeId": "snu",
    "bookId": "b-snu-0495",
    "volumeRange": "1~3권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0496",
    "storeId": "snu",
    "bookId": "b-snu-0496",
    "volumeRange": "1~10권",
    "shelfLocation": "12번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0497",
    "storeId": "snu",
    "bookId": "b-snu-0497",
    "volumeRange": "1~17권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0498",
    "storeId": "snu",
    "bookId": "b-snu-0498",
    "volumeRange": "1~5권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0499",
    "storeId": "snu",
    "bookId": "b-snu-0499",
    "volumeRange": "1~9권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0500",
    "storeId": "snu",
    "bookId": "b-snu-0500",
    "volumeRange": "1~11권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0501",
    "storeId": "snu",
    "bookId": "b-snu-0501",
    "volumeRange": "1~23권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0502",
    "storeId": "snu",
    "bookId": "b-snu-0502",
    "volumeRange": "1~8권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0503",
    "storeId": "snu",
    "bookId": "b-snu-0503",
    "volumeRange": "1~16권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0504",
    "storeId": "snu",
    "bookId": "b-snu-0504",
    "volumeRange": "1~12권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0505",
    "storeId": "snu",
    "bookId": "b-snu-0505",
    "volumeRange": "1~24권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0506",
    "storeId": "snu",
    "bookId": "b-snu-0506",
    "volumeRange": "1~15권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0507",
    "storeId": "snu",
    "bookId": "b-snu-0507",
    "volumeRange": "1~45권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0508",
    "storeId": "snu",
    "bookId": "b-snu-0507",
    "volumeRange": "1권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0509",
    "storeId": "snu",
    "bookId": "b-snu-0509",
    "volumeRange": "1권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0510",
    "storeId": "snu",
    "bookId": "b-snu-0510",
    "volumeRange": "1~23권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0511",
    "storeId": "snu",
    "bookId": "b-snu-0511",
    "volumeRange": "1~2권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0512",
    "storeId": "snu",
    "bookId": "b-snu-0512",
    "volumeRange": "1~5권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0513",
    "storeId": "snu",
    "bookId": "b-snu-0506",
    "volumeRange": "1~15권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0514",
    "storeId": "snu",
    "bookId": "b-snu-0514",
    "volumeRange": "1~31권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0515",
    "storeId": "snu",
    "bookId": "b-snu-0515",
    "volumeRange": "1~7권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0516",
    "storeId": "snu",
    "bookId": "b-snu-0516",
    "volumeRange": "1~2권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0517",
    "storeId": "snu",
    "bookId": "b-snu-0517",
    "volumeRange": "1~17권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0518",
    "storeId": "snu",
    "bookId": "b-snu-0518",
    "volumeRange": "1~14권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0519",
    "storeId": "snu",
    "bookId": "b-snu-0519",
    "volumeRange": "1~9권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0520",
    "storeId": "snu",
    "bookId": "b-snu-0520",
    "volumeRange": "1~9권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0521",
    "storeId": "snu",
    "bookId": "b-snu-0521",
    "volumeRange": "1~9권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0522",
    "storeId": "snu",
    "bookId": "b-snu-0522",
    "volumeRange": "1~20권",
    "shelfLocation": "19번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0523",
    "storeId": "snu",
    "bookId": "b-snu-0523",
    "volumeRange": "1~23권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0524",
    "storeId": "snu",
    "bookId": "b-snu-0524",
    "volumeRange": "1~30권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0525",
    "storeId": "snu",
    "bookId": "b-snu-0525",
    "volumeRange": "1~21권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0526",
    "storeId": "snu",
    "bookId": "b-snu-0526",
    "volumeRange": "1~24권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0527",
    "storeId": "snu",
    "bookId": "b-snu-0527",
    "volumeRange": "1~3권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0528",
    "storeId": "snu",
    "bookId": "b-snu-0528",
    "volumeRange": "1~32권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0529",
    "storeId": "snu",
    "bookId": "b-snu-0529",
    "volumeRange": "1~45권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0530",
    "storeId": "snu",
    "bookId": "b-snu-0530",
    "volumeRange": "1~20권",
    "shelfLocation": "19번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0531",
    "storeId": "snu",
    "bookId": "b-snu-0531",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0532",
    "storeId": "snu",
    "bookId": "b-snu-0532",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0533",
    "storeId": "snu",
    "bookId": "b-snu-0533",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0534",
    "storeId": "snu",
    "bookId": "b-snu-0534",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0535",
    "storeId": "snu",
    "bookId": "b-snu-0535",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0536",
    "storeId": "snu",
    "bookId": "b-snu-0536",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0537",
    "storeId": "snu",
    "bookId": "b-snu-0537",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0538",
    "storeId": "snu",
    "bookId": "b-snu-0538",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0539",
    "storeId": "snu",
    "bookId": "b-snu-0539",
    "volumeRange": "1~4권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0540",
    "storeId": "snu",
    "bookId": "b-snu-0540",
    "volumeRange": "1~6권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0541",
    "storeId": "snu",
    "bookId": "b-snu-0541",
    "volumeRange": "1~9권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0542",
    "storeId": "snu",
    "bookId": "b-snu-0542",
    "volumeRange": "1~2권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0543",
    "storeId": "snu",
    "bookId": "b-snu-0543",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0544",
    "storeId": "snu",
    "bookId": "b-snu-0544",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0545",
    "storeId": "snu",
    "bookId": "b-snu-0545",
    "volumeRange": "1~5권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0546",
    "storeId": "snu",
    "bookId": "b-snu-0546",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0547",
    "storeId": "snu",
    "bookId": "b-snu-0547",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0548",
    "storeId": "snu",
    "bookId": "b-snu-0548",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0549",
    "storeId": "snu",
    "bookId": "b-snu-0549",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0550",
    "storeId": "snu",
    "bookId": "b-snu-0550",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0551",
    "storeId": "snu",
    "bookId": "b-snu-0551",
    "volumeRange": "1~2권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0552",
    "storeId": "snu",
    "bookId": "b-snu-0552",
    "volumeRange": "1~4권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0553",
    "storeId": "snu",
    "bookId": "b-snu-0553",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0554",
    "storeId": "snu",
    "bookId": "b-snu-0554",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0555",
    "storeId": "snu",
    "bookId": "b-snu-0555",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0556",
    "storeId": "snu",
    "bookId": "b-snu-0556",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0557",
    "storeId": "snu",
    "bookId": "b-snu-0557",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0558",
    "storeId": "snu",
    "bookId": "b-snu-0558",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0559",
    "storeId": "snu",
    "bookId": "b-snu-0559",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0560",
    "storeId": "snu",
    "bookId": "b-snu-0560",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0561",
    "storeId": "snu",
    "bookId": "b-snu-0561",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0562",
    "storeId": "snu",
    "bookId": "b-snu-0562",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0563",
    "storeId": "snu",
    "bookId": "b-snu-0563",
    "volumeRange": "1~9권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0564",
    "storeId": "snu",
    "bookId": "b-snu-0564",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0565",
    "storeId": "snu",
    "bookId": "b-snu-0565",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0566",
    "storeId": "snu",
    "bookId": "b-snu-0566",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0567",
    "storeId": "snu",
    "bookId": "b-snu-0567",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0568",
    "storeId": "snu",
    "bookId": "b-snu-0568",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0569",
    "storeId": "snu",
    "bookId": "b-snu-0569",
    "volumeRange": "1~4권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0570",
    "storeId": "snu",
    "bookId": "b-snu-0570",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0571",
    "storeId": "snu",
    "bookId": "b-snu-0571",
    "volumeRange": "1~2권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0572",
    "storeId": "snu",
    "bookId": "b-snu-0572",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0573",
    "storeId": "snu",
    "bookId": "b-snu-0573",
    "volumeRange": "1~4권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0574",
    "storeId": "snu",
    "bookId": "b-snu-0574",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0575",
    "storeId": "snu",
    "bookId": "b-snu-0575",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0576",
    "storeId": "snu",
    "bookId": "b-snu-0576",
    "volumeRange": "1~2권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0577",
    "storeId": "snu",
    "bookId": "b-snu-0577",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0578",
    "storeId": "snu",
    "bookId": "b-snu-0578",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0579",
    "storeId": "snu",
    "bookId": "b-snu-0579",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0580",
    "storeId": "snu",
    "bookId": "b-snu-0580",
    "volumeRange": "1~11권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0581",
    "storeId": "snu",
    "bookId": "b-snu-0581",
    "volumeRange": "1~9권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0582",
    "storeId": "snu",
    "bookId": "b-snu-0582",
    "volumeRange": "1~4권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0583",
    "storeId": "snu",
    "bookId": "b-snu-0583",
    "volumeRange": "1~4권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0584",
    "storeId": "snu",
    "bookId": "b-snu-0529",
    "volumeRange": "1~45권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0585",
    "storeId": "snu",
    "bookId": "b-snu-0585",
    "volumeRange": "1~5권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0586",
    "storeId": "snu",
    "bookId": "b-snu-0586",
    "volumeRange": "1~4권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0587",
    "storeId": "snu",
    "bookId": "b-snu-0587",
    "volumeRange": "1~4권",
    "shelfLocation": "18번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0588",
    "storeId": "snu",
    "bookId": "b-snu-0588",
    "volumeRange": "1권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0589",
    "storeId": "snu",
    "bookId": "b-snu-0589",
    "volumeRange": "전권",
    "shelfLocation": "1번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0590",
    "storeId": "snu",
    "bookId": "b-snu-0590",
    "volumeRange": "전권",
    "shelfLocation": "13번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0591",
    "storeId": "snu",
    "bookId": "b-snu-0591",
    "volumeRange": "전권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0592",
    "storeId": "snu",
    "bookId": "b-snu-0592",
    "volumeRange": "1~3권",
    "shelfLocation": "5번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0593",
    "storeId": "snu",
    "bookId": "b-snu-0593",
    "volumeRange": "전권",
    "shelfLocation": "3번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0594",
    "storeId": "snu",
    "bookId": "b-snu-0594",
    "volumeRange": "전권",
    "shelfLocation": "9번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0595",
    "storeId": "snu",
    "bookId": "b-snu-0595",
    "volumeRange": "전권",
    "shelfLocation": "6번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0596",
    "storeId": "snu",
    "bookId": "b-snu-0596",
    "volumeRange": "전권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0597",
    "storeId": "snu",
    "bookId": "b-snu-0597",
    "volumeRange": "전권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0598",
    "storeId": "snu",
    "bookId": "b-snu-0598",
    "volumeRange": "전권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0599",
    "storeId": "snu",
    "bookId": "b-snu-0599",
    "volumeRange": "전권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0600",
    "storeId": "snu",
    "bookId": "b-snu-0600",
    "volumeRange": "전권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0601",
    "storeId": "snu",
    "bookId": "b-snu-0601",
    "volumeRange": "전권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0602",
    "storeId": "snu",
    "bookId": "b-snu-0602",
    "volumeRange": "전권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-snu-0603",
    "storeId": "snu",
    "bookId": "b-snu-0603",
    "volumeRange": "전권",
    "shelfLocation": "20번 서가",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0001",
    "storeId": "jamsil",
    "bookId": "b-snu-0352",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-01 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0002",
    "storeId": "jamsil",
    "bookId": "b-snu-0344",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-02 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0003",
    "storeId": "jamsil",
    "bookId": "b-snu-0149",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-03 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0004",
    "storeId": "jamsil",
    "bookId": "b-snu-0007",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-04 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0005",
    "storeId": "jamsil",
    "bookId": "b-snu-0008",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-05 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0006",
    "storeId": "jamsil",
    "bookId": "b-snu-0138",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-06 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0007",
    "storeId": "jamsil",
    "bookId": "b-snu-0145",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-07 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0008",
    "storeId": "jamsil",
    "bookId": "b-snu-0208",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-08 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0009",
    "storeId": "jamsil",
    "bookId": "b-snu-0141",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-09 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0010",
    "storeId": "jamsil",
    "bookId": "b-snu-0301",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-10 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0011",
    "storeId": "jamsil",
    "bookId": "b-snu-0339",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-11 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0012",
    "storeId": "jamsil",
    "bookId": "b-snu-0507",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-12 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0013",
    "storeId": "jamsil",
    "bookId": "b-pop-0013",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-01 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0014",
    "storeId": "jamsil",
    "bookId": "b-snu-0022",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-02 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0015",
    "storeId": "jamsil",
    "bookId": "b-snu-0018",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-03 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0016",
    "storeId": "jamsil",
    "bookId": "b-snu-0072",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-04 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0017",
    "storeId": "jamsil",
    "bookId": "b-snu-0017",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-05 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0018",
    "storeId": "jamsil",
    "bookId": "b-snu-0065",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-06 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0019",
    "storeId": "jamsil",
    "bookId": "b-snu-0066",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-07 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0020",
    "storeId": "jamsil",
    "bookId": "b-snu-0067",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-08 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0021",
    "storeId": "jamsil",
    "bookId": "b-snu-0068",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-09 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0022",
    "storeId": "jamsil",
    "bookId": "b-snu-0019",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-10 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  },
  {
    "id": "inv-jamsil-0023",
    "storeId": "jamsil",
    "bookId": "b-snu-0052",
    "volumeRange": "전권 보유",
    "shelfLocation": "J-11 서가 (인기작)",
    "updatedAt": "2026-09-04T10:21:00Z"
  }
];

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
