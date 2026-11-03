-- 2026-10-17 서울대입구역점 도서 원위치 15차 반영 (3번 서가 이동 완료 최종 8종)
-- 구글 스프레드시트 원위치 목록 기준 3번 서가 최종 잔여 도서 서가 위치를 '책장 3번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('2e04a7f9-ce17-4e46-b574-ca17404f9426'::uuid, '책장 3번'), -- 타이밍 (기존: 책장 3번)
      ('6d3030a9-3eb7-470b-9039-b1fc7a7103e2'::uuid, '책장 3번'), -- 타인은 지옥이다 (기존: 책장 3번)
      ('cc4d38c1-c091-4427-944c-d607e47145dd'::uuid, '책장 3번'), -- 통 2부 비밀 (기존: 책장 3번)
      ('b04c7d09-f4a1-4dae-8f59-11af7d3dd710'::uuid, '책장 3번'), -- 통 3부 유아독존 (기존: 책장 3번)
      ('6b0ecc8d-8949-4746-8a90-1a2bdc1ccf1b'::uuid, '책장 3번'), -- 통 (기존: 책장 3번)
      ('2c48ca3e-8cd5-4a48-bd7e-4ce43a5bfd00'::uuid, '책장 3번'), -- 화산귀환 (기존: 책장 3번)
      ('2b861a82-ae62-4373-a327-65b14eeb4703'::uuid, '책장 3번'), -- 화이트 블러드 (기존: 책장 3번)
      ('68e13082-beed-42e5-a85a-2c5895bf5c55'::uuid, '책장 3번')  -- DP (기존: 책장 3번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 8 then
    raise exception '서울대입구역점 서가 15차 원위치 반영 중 대상 불일치: expected 8, updated %', updated_count;
  end if;
end $$;
