-- 2026-10-17 서울대입구역점 도서 원위치 22차 반영 (사용자 지정 서가 도서 10종 반영 및 에세이 신규 등록)
-- 사용자 지시:
-- 2번 서가: 죽음에 관하여, 미생 (시즌 1, 2)
-- 1번 서가: 극락왕생
-- 5번 서가: 아는 여자애, 향기로운 꽃은 늠름하게 핀다, 원수를 사랑하라, 미이라 사육법
-- 19번 서가: 이미 애쓰고 있는데 힘내라니요, 하마터면 열심히 살뻔했다

do $$
declare
  updated_count integer;
  v_essay1_id uuid;
  v_essay2_id uuid;
begin
  -- 1. 기존 인벤토리 서가 위치 갱신 (7종)
  with changes(inventory_id, target_shelf_location) as (
    values
      -- 책장 2번 (죽음에 관하여, 미생)
      ('be68dc92-a0be-4479-baff-5efd9d93b829'::uuid, '책장 2번'), -- 죽음에 관하여 (기존: 책장 3번)
      ('170a2cea-6f89-4cf3-81d6-50507fd251b1'::uuid, '책장 2번'), -- 미생 (기존: 책장 2번)

      -- 책장 1번 (극락왕생)
      ('c2e408d3-6e4a-4061-966e-527b9e195de1'::uuid, '책장 1번'), -- 극락왕생 (기존: 책장 5번)

      -- 책장 5번 (아는 여자애, 향기로운 꽃은 늠름하게 핀다, 원수를 사랑하라, 미이라 사육법)
      ('1b479c5e-c87b-479b-94a8-7396d402bf01'::uuid, '책장 5번'), -- 아는 여자애 (기존: 책장 2번)
      ('885bc7dd-30c4-4559-9f9a-2c22dd453b36'::uuid, '책장 5번'), -- 향기로운 꽃은 늠름하게 핀다 (기존: 4)
      ('6be3a174-4ace-46c0-b41e-7768798a0d80'::uuid, '책장 5번'), -- 원수를 사랑하라 (기존: 책장 14번)
      ('6af9646e-502a-4bdd-a5fa-5570690b5894'::uuid, '책장 5번')  -- 미이라 사육법 (기존: 책장 4번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 7 then
    raise exception '서울대입구역점 서가 22차 원위치 반영 중 대상 불일치: expected 7, updated %', updated_count;
  end if;

  -- 2. 미생 시즌2 서울대입구역점 인벤토리 등록/갱신 (책장 2번)
  insert into public.book_inventories (store_id, book_id, volume_range, shelf_location)
  values
    ('796c09b7-241f-49f0-bb62-45f9b2756c59'::uuid, 'de736c6c-3f53-48be-9290-03524a682ce8'::uuid, '1~13권', '책장 2번')
  on conflict (store_id, book_id) do update
    set shelf_location = excluded.shelf_location,
        volume_range = excluded.volume_range,
        updated_at = now();

  -- 3. 19번 서가 신규 에세이 books 등록 및 서울대입구역점 인벤토리 등록
  -- 3-1. 이미 애쓰고 있는데 힘내라니요
  insert into public.books (title, author, category, normalized_title, normalized_author, initial_consonants)
  values ('이미 애쓰고 있는데 힘내라니요', '마샤린', '에세이', '이미애쓰고있는데힘내라니요', '마샤린', 'ㅇㅁㅇㅆㄱㅇㄴㄷㅎㄴㄹㄴㅇ')
  on conflict (title, author) do update
    set category = excluded.category
  returning id into v_essay1_id;

  insert into public.book_inventories (store_id, book_id, volume_range, shelf_location)
  values ('796c09b7-241f-49f0-bb62-45f9b2756c59'::uuid, v_essay1_id, '단권/완비', '책장 19번')
  on conflict (store_id, book_id) do update
    set shelf_location = excluded.shelf_location,
        volume_range = excluded.volume_range,
        updated_at = now();

  -- 3-2. 하마터면 열심히 살뻔했다
  insert into public.books (title, author, category, normalized_title, normalized_author, initial_consonants)
  values ('하마터면 열심히 살뻔했다', '하완', '에세이', '하마터면열심히살뻔했다', '하완', 'ㅎㅁㅌㅁㅇㅅㅎㅅㅃㅎㄷ')
  on conflict (title, author) do update
    set category = excluded.category
  returning id into v_essay2_id;

  insert into public.book_inventories (store_id, book_id, volume_range, shelf_location)
  values ('796c09b7-241f-49f0-bb62-45f9b2756c59'::uuid, v_essay2_id, '단권/완비', '책장 19번')
  on conflict (store_id, book_id) do update
    set shelf_location = excluded.shelf_location,
        volume_range = excluded.volume_range,
        updated_at = now();

end $$;
