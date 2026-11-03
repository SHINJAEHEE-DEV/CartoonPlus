-- 2026-10-17 서울대입구역점 도서 원위치 21차 반영 (별이삼샵·이미테이션·우리집에 사는 남자 5번 서가 및 여혜 3번 서가 완료)
-- 사용자 지시(별이삼샵, 이미테이션, 우리집에 사는 남자 5번 서가 배치) 및 원위치 목록(여혜) 반영

do $$
declare
  updated_count integer;
begin
  -- 1. 기존 인벤토리 서가 위치 갱신 (별이삼샵, 여혜)
  with changes(inventory_id, target_shelf_location) as (
    values
      ('183cf288-278d-4131-af28-d3d4a083a7a9'::uuid, '책장 5번'), -- 별이삼샵 (기존: 책장 2번, 사용자 지시: 5번 서가)
      ('8c8e8e32-9c53-45bb-9f0d-b3770619db3f'::uuid, '책장 3번')  -- 여혜 (기존: 책장 3번, 시트 체크 완료)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 2 then
    raise exception '서울대입구역점 서가 21차 원위치 반영 중 대상 불일치: expected 2, updated %', updated_count;
  end if;

  -- 2. 서울대입구역점 신규 인벤토리 등록/갱신 (이미테이션, 우리집에 사는 남자)
  insert into public.book_inventories (store_id, book_id, volume_range, shelf_location)
  values
    ('796c09b7-241f-49f0-bb62-45f9b2756c59'::uuid, 'c04c3f17-d6c7-4ce9-931c-2d7dcc9200fd'::uuid, '1~12권', '책장 5번'), -- 이미테이션
    ('796c09b7-241f-49f0-bb62-45f9b2756c59'::uuid, 'c3d27508-f496-4814-a2b2-bebd9838e2df'::uuid, '1~3권', '책장 5번')   -- 우리집에 사는 남자
  on conflict (store_id, book_id) do update
    set shelf_location = excluded.shelf_location,
        volume_range = excluded.volume_range,
        updated_at = now();

end $$;
