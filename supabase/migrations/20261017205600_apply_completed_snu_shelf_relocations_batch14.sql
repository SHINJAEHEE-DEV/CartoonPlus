-- 2026-10-17 서울대입구역점 도서 원위치 14차 반영 (3번 서가 이동 완료 7종 및 지옥 시즌 2[부활자] 동기화)
-- 구글 스프레드시트 원위치 목록 및 사용자 지시(지옥 시즌 2 동일 서가 비치) 기준 서가 위치를 '책장 3번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('feeca5de-1102-4281-a16e-d15262713a12'::uuid, '책장 3번'), -- 전지적 독자 시점 (기존: 책장 4번)
      ('eda29e71-af0d-4c1b-8c8e-aaa7f4aa32f5'::uuid, '책장 3번'), -- 정신병동에도 아침이 와요 (기존: 책장 3번)
      ('90983424-06fb-4473-8034-08573edf4945'::uuid, '책장 3번'), -- 좀비딸 (기존: 책장 3번)
      ('5a0a7ad8-9286-46f7-b467-be71a6be7337'::uuid, '책장 3번'), -- 종의 기원 (기존: 책장 3번)
      ('6504ea96-a756-4fdd-9083-48a364933bb3'::uuid, '책장 3번'), -- 중증 외상 센터 : 골든아워 (기존: 책장 3번)
      ('61422237-e864-45f7-98bb-b76f83fb93b7'::uuid, '책장 3번'), -- 지옥 (기존: 책장 3번)
      ('72e7bee0-2770-4a69-85d0-a0ea828d3377'::uuid, '책장 3번'), -- 청소부 K (기존: 책장 3번)
      ('edbc3325-69c3-4a9f-9421-10f793659bab'::uuid, '책장 3번')  -- 지옥 : 부활자 (기존: 책장 4번, 사용자 지시: 지옥 시즌 2)
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
    raise exception '서울대입구역점 서가 14차 원위치 반영 중 대상 불일치: expected 8, updated %', updated_count;
  end if;
end $$;
