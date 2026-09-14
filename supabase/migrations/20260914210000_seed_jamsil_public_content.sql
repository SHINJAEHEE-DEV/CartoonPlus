with jamsil as (select id from public.stores where slug = 'jamsil')
insert into public.entertainment_items (store_id, item_type, title, is_verified, is_available)
select jamsil.id, source.item_type, source.title, true, true
from jamsil cross join (values
  ('NINTENDO','마리오카트 8 디럭스'), ('NINTENDO','태고의 달인'), ('NINTENDO','Overcooked! All You Can Eat'), ('NINTENDO','슈퍼 마리오 파티 잼버리'), ('NINTENDO','Super Bunny Man'), ('NINTENDO','별의 커비 스타 얼라이즈'),
  ('PLAYSTATION_4','It Takes Two'), ('PLAYSTATION_4','Nobody Saves the World'), ('PLAYSTATION_4','Overcooked'), ('PLAYSTATION_4','Moving Out 2'), ('PLAYSTATION_4','Roblox'), ('PLAYSTATION_4','Human Fall Flat'), ('PLAYSTATION_4','Fall Guys'), ('PLAYSTATION_4','콜 오브 듀티 Modern Warfare 2')
) as source(item_type, title)
on conflict (store_id, item_type, title) do update set is_verified = true, is_available = true, archived_at = null;

with jamsil as (select id from public.stores where slug = 'jamsil')
insert into public.store_events (store_id, title, content, start_date, end_date, is_public, is_always_on)
select jamsil.id, source.title, source.content, source.start_date, source.end_date, true, true
from jamsil cross join (values
  ('잠실 직관 티켓 인증 — 4,000원 음료 무료 증정', '잠실 야구장 경기 또는 종합운동장 공연/콘서트 당일 티켓 소지 시 4,000원 상당 음료 무료 증정', date '2026-01-01', date '2099-12-31'),
  ('네이버 영수증 포토 리뷰 — 라면 무료 쿠폰', '네이버 플레이스 영수증 인증 후 포토 리뷰 작성 시 라면 무료 + 무제한 토핑 바 제공', date '2026-01-01', date '2099-12-31'),
  ('맘맘(MomMom) 멤버십 제휴 — 젤라또 & 무제한 토핑 무료', '현장에서 맘맘 멤버십 QR 인증 시 프리미엄 젤라또 1개 무료 + 라면 무제한 토핑 바 이용', date '2026-01-01', date '2099-12-31')
) as source(title, content, start_date, end_date)
on conflict (store_id, title) do update set content = excluded.content, is_public = true, is_always_on = true, archived_at = null;
