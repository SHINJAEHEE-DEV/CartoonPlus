alter table public.store_events add column if not exists is_always_on boolean not null default false;

drop policy if exists "public reads current events" on public.store_events;
create policy "public reads current events" on public.store_events for select using (
  is_public and archived_at is null and (is_always_on or current_date between start_date and end_date)
);

create unique index if not exists entertainment_items_store_type_title_key
  on public.entertainment_items (store_id, item_type, title);
create unique index if not exists store_events_store_title_key
  on public.store_events (store_id, title);

with store_row as (select id from public.stores where slug = 'snu')
insert into public.entertainment_items (store_id, item_type, title, is_verified, is_available)
select store_row.id, source.item_type, source.title, true, true
from store_row
cross join (values
  ('NINTENDO','슈퍼 마리오 파티 잼버리'),
  ('NINTENDO','오버쿡드'),
  ('NINTENDO','폴가이즈'),
  ('NINTENDO','슈퍼 버니 맨'),
  ('NINTENDO','태고의 달인 쿵딱! 원더풀 페스티벌'),
  ('NINTENDO','슈퍼 커비 헌터즈'),
  ('NINTENDO','포켓몬 챔피언스'),
  ('NINTENDO','리듬 세상 / 리듬천국'),
  ('PLAYSTATION_4','잇 테익스 투'),
  ('PLAYSTATION_4','휴먼: 폴 플랫'),
  ('PLAYSTATION_4','오버쿡드 2'),
  ('PLAYSTATION_4','무빙 아웃'),
  ('PLAYSTATION_4','리틀 나이트메어 2'),
  ('PLAYSTATION_4','노바디 세이브즈 더 월드'),
  ('PLAYSTATION_4','태고의 달인 모두 함께 쿵딱쿵!'),
  ('PLAYSTATION_4','브롤할라'),
  ('PLAYSTATION_4','드래곤볼 제노버스 2'),
  ('PLAYSTATION_4','폴가이즈'),
  ('PLAYSTATION_4','로블록스'),
  ('PLAYSTATION_4','포트나이트'),
  ('PLAYSTATION_4','이풋볼'),
  ('PLAYSTATION_4','프로 에볼루션 사커 2019'),
  ('PLAYSTATION_4','콜 오브 듀티'),
  ('PLAYSTATION_4','더 플레이룸'),
  ('PLAYSTATION_4','캡콤 아케이드 스타디움'),
  ('PLAYSTATION_4','캡콤 아케이드 2nd 스타디움')
) as source(item_type, title)
on conflict (store_id, item_type, title) do update set is_verified = true, is_available = true, archived_at = null;

with store_row as (select id from public.stores where slug = 'snu')
insert into public.store_events (store_id, title, content, start_date, end_date, is_public, is_always_on)
select store_row.id, source.title, source.content, source.start_date, source.end_date, true, true
from store_row
cross join (values
  ('2026 서울대학교 단과대학생회장연석회의 공식 제휴 (2026 놀러오샤)', '학생증 실물 또는 서울대학교 포털 모바일 학생증 제시 시 패키지 요금제 10% 현장 할인, 평일 종일권 음료 무료 업그레이드 등 제휴 혜택을 제공합니다.', date '2026-01-01', date '2026-12-31'),
  ('한강 즉석 라면 무제한 무료 토핑 바 상시 이벤트', '즉석 라면 구매 고객에게 대파, 숙주나물, 떡사리, 계란 토핑을 제공합니다.', date '2026-01-01', date '2026-12-31'),
  ('네이버 영수증 포토 리뷰 & SNS 인증 이벤트', '네이버 영수증 포토 리뷰와 SNS 방문 인증 후기를 작성한 고객에게 혜택을 제공합니다.', date '2026-01-01', date '2026-12-31')
) as source(title, content, start_date, end_date)
on conflict (store_id, title) do update set content = excluded.content, is_public = true, is_always_on = true, archived_at = null;
