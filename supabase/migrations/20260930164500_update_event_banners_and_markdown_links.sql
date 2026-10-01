-- Update event banner_type and formatted markdown links for collaboration and partnership events

-- 1. 난타 홍대점
update public.store_events
set
  banner_type = 'nanta',
  content = '난타 홍대극장 X 카툰플러스 홍대점 특별 패키지 판매 진행 중
난타 티켓 + 카툰플러스 이용권 특별 할인 패키지
예매 및 상세 안내: [난타 예매 링크](https://www.nanta.co.kr:452/index.php)'
where title = '난타 홍대극장 X 카툰플러스 홍대점 특별 패키지';

-- 2. PEACH-PIT 25주년 특별전
update public.store_events
set
  banner_type = 'peach_pit'
where title = 'PEACH-PIT 25주년 기념 특별전 티켓 당첨 이벤트 (예정)';

-- 3. 오타메이커 보드게임 협업
update public.store_events
set
  banner_type = 'otamaker'
where title = '오타메이커 보드게임 협업 — 플레이 & 리뷰 작성 이벤트 (예정)';

-- 4. 맘맘 멤버십 제휴
update public.store_events
set
  banner_type = 'mommom',
  content = '매장 방문하여 어플리케이션 내 멤버십 QR코드 제시 시 젤라또 1개 무료 + 라면 무제한 토핑 바 증정
홍대점, 잠실점, 서울대입구역점, 사당점 동일 적용 (타 이벤트 중복 가능)
지점별 상세: [홍대점](https://mom-mom.net/travel/places/68a4587babc6bae6ac20c968) · [잠실점](https://mom-mom.net/travel/places/69cf866dcdb5885d8f358d3e) · [서울대입구역점](https://mom-mom.net/travel/places/69fa986f2b26c07cbf7b1af2) · [사당점](https://mom-mom.net/travel/places/6a474e5d3484d9ce4290e5d8)'
where title = '맘맘(MomMom) 멤버십 제휴 — 젤라또 & 무제한 토핑 무료';
