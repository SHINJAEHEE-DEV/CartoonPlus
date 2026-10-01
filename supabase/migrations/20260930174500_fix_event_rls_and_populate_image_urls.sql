-- 1. Fix RLS policy on store_events so upcoming (scheduled) events and active events are visible to public
drop policy if exists "public reads current events" on public.store_events;
create policy "public reads current events" on public.store_events for select using (
  is_public
  and archived_at is null
  and (is_always_on or end_date >= current_date)
);

-- 2. Populate image_url and banner_type for all collaboration and partnership events

-- (1) 난타 홍대극장 X 카툰플러스 홍대점 특별 패키지
with hongdae as (select id, slug from public.stores where slug = 'hongdae')
insert into public.store_events (
  store_id, store_slug, title, content, tag, target,
  banner_type, image_url, start_date, end_date, is_always_on, is_public, is_featured
)
select
  hongdae.id,
  hongdae.slug,
  '난타 홍대극장 X 카툰플러스 홍대점 특별 패키지',
  '난타 홍대극장 X 카툰플러스 홍대점 특별 패키지 판매 진행 중
난타 티켓 + 카툰플러스 이용권 특별 할인 패키지
예매 및 상세 안내: [난타 예매 링크](https://www.nanta.co.kr:452/index.php)',
  '홍대점 제휴',
  '난타 홍대극장 관람객 및 카툰플러스 홍대점 이용 고객',
  'nanta',
  '/assets/events/event_nanta_hongdae.jpg',
  date '2026-09-01',
  date '2026-12-31',
  false,
  true,
  true
from hongdae
on conflict (scope_key, title) do update set
  content = excluded.content,
  tag = excluded.tag,
  target = excluded.target,
  banner_type = excluded.banner_type,
  image_url = excluded.image_url,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  is_always_on = excluded.is_always_on,
  is_public = excluded.is_public,
  is_featured = excluded.is_featured,
  archived_at = null;

-- (2) PEACH-PIT 25주년 기념 특별전 (예정)
insert into public.store_events (
  store_id, store_slug, title, content, tag, target,
  banner_type, image_url, start_date, end_date, is_always_on, is_public, is_featured
)
values (
  null,
  null,
  'PEACH-PIT 25주년 기념 특별전 티켓 당첨 이벤트 (예정)',
  'PEACH-PIT 25주년 기념 특별전 (10.09 ~ 10.22)
카툰플러스 매장 방문 후 인스타그램 인증 참여 시 추첨을 통해 특별전 티켓 증정
진행 일정: 2026년 10월 9일 ~ 10월 22일 (예정)',
  '티켓 증정 이벤트',
  '매장 방문 후 인스타그램 인증 참여 고객 전원',
  'peach_pit',
  '/assets/events/event_peach_pit.jpg',
  date '2026-10-09',
  date '2026-10-22',
  false,
  true,
  false
)
on conflict (scope_key, title) do update set
  content = excluded.content,
  tag = excluded.tag,
  target = excluded.target,
  banner_type = excluded.banner_type,
  image_url = excluded.image_url,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  is_always_on = excluded.is_always_on,
  is_public = excluded.is_public,
  is_featured = excluded.is_featured,
  archived_at = null;

-- (3) 오타메이커 보드게임 협업 (예정)
insert into public.store_events (
  store_id, store_slug, title, content, tag, target,
  banner_type, image_url, start_date, end_date, is_always_on, is_public, is_featured
)
values (
  null,
  null,
  '오타메이커 보드게임 협업 — 플레이 & 리뷰 작성 이벤트 (예정)',
  '매장 내 오타메이커 보드게임 즐긴 후 리뷰 작성 시 특별 경품 증정
오타메이커 보드게임 자유 플레이 체험
리뷰 작성 후 카운터 인증 시 현장 경품 증정 (진행 예정)',
  '보드게임 이벤트',
  '매장 내 오타메이커 보드게임 이용 및 리뷰 작성 고객',
  'otamaker',
  '/assets/events/event_otamaker.jpg',
  date '2026-10-01',
  date '2099-12-31',
  true,
  true,
  false
)
on conflict (scope_key, title) do update set
  content = excluded.content,
  tag = excluded.tag,
  target = excluded.target,
  banner_type = excluded.banner_type,
  image_url = excluded.image_url,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  is_always_on = excluded.is_always_on,
  is_public = excluded.is_public,
  is_featured = excluded.is_featured,
  archived_at = null;

-- (4) 맘맘(MomMom) 멤버십 제휴
insert into public.store_events (
  store_id, store_slug, title, content, tag, target,
  banner_type, image_url, start_date, end_date, is_always_on, is_public, is_featured
)
values (
  null,
  null,
  '맘맘(MomMom) 멤버십 제휴 — 젤라또 & 무제한 토핑 무료',
  '매장 방문하여 어플리케이션 내 멤버십 QR코드 제시 시 젤라또 1개 무료 + 라면 무제한 토핑 바 증정
홍대점, 잠실점, 서울대입구역점, 사당점 동일 적용 (타 이벤트 중복 가능)
지점별 상세: [홍대점](https://mom-mom.net/travel/places/68a4587babc6bae6ac20c968) · [잠실점](https://mom-mom.net/travel/places/69cf866dcdb5885d8f358d3e) · [서울대입구역점](https://mom-mom.net/travel/places/69fa986f2b26c07cbf7b1af2) · [사당점](https://mom-mom.net/travel/places/6a474e5d3484d9ce4290e5d8)',
  '네이버·멤버십 제휴',
  '맘맘(MomMom) 멤버십 QR 인증 고객 전원 (타 이벤트 중복 가능)',
  'mommom',
  '/assets/events/event_mommom.jpg',
  date '2026-01-01',
  date '2099-12-31',
  true,
  true,
  false
)
on conflict (scope_key, title) do update set
  content = excluded.content,
  tag = excluded.tag,
  target = excluded.target,
  banner_type = excluded.banner_type,
  image_url = excluded.image_url,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  is_always_on = excluded.is_always_on,
  is_public = excluded.is_public,
  is_featured = excluded.is_featured,
  archived_at = null;

-- (5) 서울대학교 학생증 인증 (서울대점)
with snu as (select id, slug from public.stores where slug = 'snu')
insert into public.store_events (
  store_id, store_slug, title, content, tag, target,
  banner_type, image_url, start_date, end_date, is_always_on, is_public, is_featured
)
select
  snu.id,
  snu.slug,
  '서울대학교 학생증 인증 — 아이스크림 무료 증정',
  '서울대학교 학생 방문하여 학생증 인증 시 아이스크림 무료 증정 (~11.20)
모바일 또는 실물 학생증 카운터 제시 시 즉시 제공
단과대 연석회의 패키지 할인과 중복 혜택 가능',
  '서울대점 단독 제휴',
  '서울대학교 학생 방문 및 학생증 인증 고객 전원',
  'snu',
  '/assets/banners/snu_partnership_banner.png',
  date '2026-09-01',
  date '2026-11-20',
  false,
  true,
  true
from snu
on conflict (scope_key, title) do update set
  content = excluded.content,
  tag = excluded.tag,
  target = excluded.target,
  banner_type = excluded.banner_type,
  image_url = excluded.image_url,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  is_always_on = excluded.is_always_on,
  is_public = excluded.is_public,
  is_featured = excluded.is_featured,
  archived_at = null;
