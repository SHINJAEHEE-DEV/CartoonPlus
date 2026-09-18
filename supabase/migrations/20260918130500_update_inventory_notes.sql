-- Supabase book_inventories note 필드 동기화
alter table public.book_inventories
  add column if not exists note text;

do $$
declare
  v_store_id uuid;
begin
  select id into v_store_id from public.stores where slug = 'snu' or name like '%서울대%' limit 1;

  update public.book_inventories bi
  set note = '3권 없음', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and b.title like '그대를 사랑합니다%';

  update public.book_inventories bi
  set note = '1권 없음', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and b.title like '나 혼자만 레벨업%';
end $$;
