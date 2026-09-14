-- Seed store_info for SNU, Jamsil, and Hongdae stores

with snu as (select id from public.stores where slug = 'snu')
insert into public.store_content (store_id, content_key, content_value)
select snu.id, 'store_info', jsonb_build_object(
  'name', '서울대입구역점',
  'phone', '02-888-0852',
  'address', '서울특별시 관악구 관악로 155, 3층 (봉천동 대우디오슈페리움 1단지)',
  'hours', '매일 10:00 – 23:00 · 연중무휴 정상 영업',
  'directions', '지하철 2호선 서울대입구역 3번 출구에서 도보 1~2분',
  'parking', '건물 지하 주차장 이용 가능'
)
from snu
on conflict (store_id, content_key) do update set content_value = excluded.content_value, updated_at = now();

with jamsil as (select id from public.stores where slug = 'jamsil')
insert into public.store_content (store_id, content_key, content_value)
select jamsil.id, 'store_info', jsonb_build_object(
  'name', '잠실점',
  'phone', '02-423-9588',
  'address', '서울특별시 송파구 백제고분로9길 23, 2층 (잠실동)',
  'hours', '월~목 10:00–23:00 / 금 10:00–24:00 / 토 24시간 / 일 00:00–23:00',
  'directions', '지하철 2호선 잠실새내역 4번 출구에서 도보 5분',
  'parking', '주변 공영 주차장 및 매장 문의'
)
from jamsil
on conflict (store_id, content_key) do update set content_value = excluded.content_value, updated_at = now();

with hongdae as (select id from public.stores where slug = 'hongdae')
insert into public.store_content (store_id, content_key, content_value)
select hongdae.id, 'store_info', jsonb_build_object(
  'name', '홍대점',
  'phone', '02-337-6588',
  'address', '서울특별시 마포구 양화로16길 29 (서교동) 홍익몰 지하 1층',
  'hours', '24시간 영업 · 연중무휴 정상 영업',
  'directions', '지하철 2호선·공항철도 홍대입구역 9번 출구에서 도보 5분',
  'parking', '홍익몰 건물 주차장 이용 가능'
)
from hongdae
on conflict (store_id, content_key) do update set content_value = excluded.content_value, updated_at = now();
