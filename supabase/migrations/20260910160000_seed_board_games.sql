alter table public.entertainment_items
  add column if not exists quantity integer not null default 1 check (quantity > 0);

with store_row as (select id from public.stores where slug = 'snu')
insert into public.entertainment_items (store_id, item_type, title, quantity, is_verified, is_available)
select store_row.id, 'BOARD_GAME', source.title, source.quantity, true, true
from store_row
cross join (values
  ('다빈치코드', 3), ('시타델', 2), ('라스베가스', 1), ('스플렌더 확장: 찬란한 도시', 1),
  ('스플렌더', 2), ('요트다이스', 1), ('우봉고', 1), ('젬블로', 1), ('오델로 클래식', 1),
  ('반지의 제왕', 1), ('ACUITY', 1), ('루빅스 레이스', 1), ('텔레스트레이션', 1),
  ('체스&체커', 1), ('뒤죽박죽 서커스', 1), ('루핑루이', 1), ('카탄', 1),
  ('루미큐브 클래식', 1), ('라비린스', 1), ('뱅!', 1), ('로스트 시티', 2),
  ('콰르토', 1), ('쿼리도', 1)
) as source(title, quantity)
on conflict (store_id, item_type, title) do update
set quantity = excluded.quantity, is_verified = true, is_available = true, archived_at = null;
