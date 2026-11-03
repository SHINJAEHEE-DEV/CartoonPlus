-- 2026-10-17 서울대입구역점 도서 원위치 6차 반영 (2번 서가 이동 완료 4종)
-- 구글 스프레드시트 원위치 목록 기준 추가 확인된 도서의 서가 위치를 '책장 2번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('eefb5906-9be4-4a79-a80d-ed522d8c1029'::uuid, '책장 2번'), -- 녹두전 (기존: 책장 1번)
      ('5fc8dd67-963b-4dce-870e-acfe4f2d319d'::uuid, '책장 2번'), -- 놓지마 정신줄 (기존: 책장 1번)
      ('7d91bc3c-bcea-4aed-81f7-f6633374d6c2'::uuid, '책장 2번'), -- 두근두근 두근거려 (기존: 책장 1번)
      ('f03d7251-ee95-4038-9b01-55b1d3930189'::uuid, '책장 2번')  -- 모럴센스 (기존: 책장 2번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 4 then
    raise exception '서울대입구역점 서가 6차 원위치 반영 중 대상 불일치: expected 4, updated %', updated_count;
  end if;
end $$;
