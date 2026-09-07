const fs = require('fs');

const storeInfo = {
  store: {
    brand: "카툰플러스 (CartoonPlus)",
    branch: "서울대입구역점",
    summary: "서울대입구역 3번 출구 바로 앞에 위치한 프리미엄 만화 & 엔터테인먼트 카페. 수만 권의 만화/웹툰, OTT 전용 룸, 닌텐도 스위치, 보드게임, 무료 안마의자, 한강 즉석 라면 셀프 바를 완비한 복합 힐링 공간입니다.",
    address: {
      road: "서울특별시 관악구 관악로 155, 3층",
      jibun: "서울특별시 관악구 봉천동 856-5 대우디오슈페리움 1단지 3층",
      directions: "지하철 2호선 서울대입구역 3번 출구에서 도보 약 1~2분 직진 (1층 빽다방/올리브영 건물 3층)",
      parking: "건물 지하 주차장 이용 가능 (이용 시 카운터 문의)"
    },
    business_hours: {
      open: "10:00",
      close: "23:00",
      operation: "연중무휴 (매일 정상 영업, 공휴일 및 설/추석 명절 운영)"
    },
    contact: {
      tel: "02-888-0852",
      inquiry: "매장 이용 및 도서 재고 문의"
    },
    pricing: {
      standard: [
        { name: "기본 1시간 (음료 미포함)", price: 3600, note: "초과 10분당 추가 요금" },
        { name: "1시간 + 기본 음료 패키지", price: 6000, note: "아메리카노 / 아이스티 / 캔음료 택1 포함" },
        { name: "2시간 + 기본 음료 패키지", price: 9500, note: "기본 음료 포함" },
        { name: "3시간 + 기본 음료 패키지", price: 12500, note: "기본 음료 포함" },
        { name: "5시간 + 기본 음료 패키지", price: 18000, note: "기본 음료 포함" },
        { name: "평일 종일권", price: 20000, note: "평일 한정 하루 종일 무제한 이용" }
      ],
      beverage_upgrade: "기본 음료 외 라떼, 스무디, 에이드 등 주문 시 차액 결제"
    },
    facilities: [
      {
        zone: "Book Zone (도서/서가)",
        description: "수만 권 규모의 인기 웹툰 단행본, 순정/소년/액션 만화, 그래픽 노블, 최신 신간 매주 업데이트, 도서 검색 전용 키오스크/PC 비치"
      },
      {
        zone: "Media Zone (OTT 넷플릭스 룸)",
        description: "넷플릭스, 왓챠, 티빙, 디즈니+, 유튜브 프리미엄 시청 가능한 대형 스크린/모니터 및 아늑한 암막 굴방"
      },
      {
        zone: "Gaming Zone (닌텐도 스위치 & 콘솔 룸)",
        description: "닌텐도 스위치 멀티플레이 타이틀(마리오 카트, 대난투, 오버쿡드 등) 2~4인 동시 플레이"
      },
      {
        zone: "Board Game Zone (보드게임 존)",
        description: "루미큐브, 스플렌더, 다빈치코드, 할리갈리 등 100여 종의 프리미엄 보드게임 자유 이용"
      },
      {
        zone: "Healing Zone (안마의자 존)",
        description: "매장 이용 고객 누구나 100% 무료로 이용 가능한 세라젬/바디프랜드 고급 안마의자 비치"
      },
      {
        zone: "Private Rooms (좌석 구성)",
        description: "1인/2인 아늑한 복층 굴방(토굴방), 리클라이너 소파석, 카페형 테이블석, 전 좌석 콘센트 및 극세사 담요"
      },
      {
        zone: "K-Ramen & F&B Bar (식음료)",
        description: "한강 즉석 라면 조리기계 완비, 계란/파/숙주/떡사리 무제한 무료 토핑 바 운영, 볶음밥/치킨/떡볶이/젤라또 판매"
      }
    ],
    amenities: [
      "초고속 무료 Wi-Fi",
      "전 좌석 멀티 충전 케이블 & 콘센트",
      "남/녀 구분 내부 화장실 (가글 구강세정제, 머리끈, 핸드크림 비치)",
      "쾌적한 실내 흡연실 완비",
      "도서 검색 전용 PC 시스템",
      "무인 키오스크 셀프 입/퇴실"
    ]
  }
};

const events = {
  affiliations_and_events: [
    {
      id: "snu-official-partnership",
      title: "2026 서울대학교 단과대학생회장연석회의 공식 제휴 (2026 놀러오샤)",
      type: "AFFILIATION",
      partner: "서울대학교 (Seoul National University)",
      target: "서울대학교 학부생 및 대학원생 전원",
      period: "2026.01.01 ~ 2026.12.31 (상시 제휴)",
      verification: "학생증 실물 또는 서울대학교 포털 모바일 학생증 제시 필수",
      benefits: [
        "패키지 요금제(2시간/3시간/5시간+음료) 10% 즉시 현장 할인",
        "평일 종일권 결제 시 아메리카노 또는 아이스티 1잔 무료 업그레이드 제공",
        "중간/기말 시험 기간 야간 집중 & 힐링 스페셜 패키지 프로모션"
      ],
      poster_image: "docs/assets/snu_partnership_banner.png"
    },
    {
      id: "free-topping-ramen",
      title: "한강 즉석 라면 무제한 무료 토핑 바 상시 이벤트",
      type: "EVENT",
      target: "즉석 라면 구매 고객 전원",
      period: "상시 진행",
      benefits: [
        "신라면, 진라면, 너구리, 불닭볶음면, 짜파게티 등 주문 시 대파, 숙주나물, 떡사리, 계란 무제한 무료 제공"
      ]
    },
    {
      id: "naver-review-gift",
      title: "네이버 영수증 포토 리뷰 & SNS 인증 이벤트",
      type: "EVENT",
      target: "방문 후기 작성 고객",
      period: "상시 진행",
      benefits: [
        "네이버 영수증 포토 리뷰 작성 시 음료/스낵 즉시 증정",
        "블로그/인스타그램 방문 인증 후기 작성 시 재방문 1시간 무료 이용권 증정"
      ]
    }
  ]
};

const manifest = {
  store: "카툰플러스 서울대입구역점",
  assets: {
    mascot: [
      { file: "docs/assets/mascot/mascot_logo_circle.png", title: "카툰플러스 카페 공식 원형 엠블럼 로고" },
      { file: "docs/assets/mascot/mascot_front_peek.png", title: "마스코트 기본 정면 (빼꼼) - 온전한 귀" },
      { file: "docs/assets/mascot/mascot_reading.png", title: "마스코트 만화책 읽기" },
      { file: "docs/assets/mascot/mascot_ott.png", title: "마스코트 OTT/넷플릭스 시청" },
      { file: "docs/assets/mascot/mascot_gaming.png", title: "마스코트 닌텐도 게임 집중" },
      { file: "docs/assets/mascot/mascot_massage.png", title: "마스코트 안마의자 힐링" },
      { file: "docs/assets/mascot/mascot_coffee.png", title: "마스코트 커피/음료 티타임" },
      { file: "docs/assets/mascot/mascot_thinking.png", title: "마스코트 도서 고민/검색" },
      { file: "docs/assets/mascot/mascot_relaxing.png", title: "마스코트 매트에서 뒹굴뒹굴 휴식" },
      { file: "docs/assets/mascot/mascot_sunglasses.png", title: "마스코트 선글라스 쓰고 걷기" }
    ],
    partnership: [
      { file: "docs/assets/snu_partnership_banner.png", title: "2026 서울대학교 단과대학생회장연석회의 공식 제휴 포스터" }
    ],
    store_photos: [
      { file: "docs/assets/store_photos/01_store_exterior.jpg", title: "매장 건물 외관 및 노란 CARTOON+ 간판" },
      { file: "docs/assets/store_photos/02_entrance_and_guide.jpg", title: "매장 입구 신발장 및 이용 가이드 포스터" },
      { file: "docs/assets/store_photos/03_kiosk_system.jpg", title: "무인 키오스크 입실/퇴실 시스템 & 메뉴" },
      { file: "docs/assets/store_photos/04_bookshelf_and_rooms.jpg", title: "도서 서가 및 2층 복층 아늑한 토굴방" },
      { file: "docs/assets/store_photos/05_massage_chair_zone.jpg", title: "무료 프리미엄 안마의자(세라젬) 힐링 존" },
      { file: "docs/assets/store_photos/06_boardgame_shelf.jpg", title: "100여 종 인기 보드게임 진열대" },
      { file: "docs/assets/store_photos/07_manga_collection.jpg", title: "인기 만화/단행본 서가" },
      { file: "docs/assets/store_photos/08_webtoon_reading.jpg", title: "인기 웹툰 단행본 독서 실사" }
    ]
  }
};

fs.writeFileSync('docs/assets/store_info.json', JSON.stringify(storeInfo, null, 2), 'utf8');
fs.writeFileSync('docs/assets/events.json', JSON.stringify(events, null, 2), 'utf8');
fs.writeFileSync('docs/assets/manifest.json', JSON.stringify(manifest, null, 2), 'utf8');

console.log('All metadata files saved in docs/assets successfully.');
