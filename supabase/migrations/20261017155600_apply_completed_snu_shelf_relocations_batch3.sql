-- 2026-10-17 서울대입구역점 도서 원위치 3차 반영 (1번 서가 이동 완료 7종)
-- 구글 스프레드시트 원위치 목록 기준 추가 확인된 도서의 서가 위치를 '책장 1번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('4cb79efd-0e99-4c5c-bcad-cdf9a14d0e85'::uuid, '책장 1번'), -- 약사의 혼잣말 (기존: 책장 19번)
      ('ea27535a-a23b-44c2-9b77-780f76178562'::uuid, '책장 1번'), -- 어쿠스틱 라이프 (기존: 책장 3번)
      ('ab6cbcd1-2213-4faa-9416-63488373f469'::uuid, '책장 1번'), -- 이끼 (기존: 책장 5번)
      ('e905b339-6a16-4b75-83b3-483ccb72638b'::uuid, '책장 1번'), -- 일하는 세포 black (기존: 책장 5번)
      ('064c9cae-d665-46f6-907c-87b81b9c74bd'::uuid, '책장 1번'), -- 일하는 세포 black (기존: 책장 5번)
      ('a48862ee-d576-412a-b31d-ed48ead6777e'::uuid, '책장 1번'), -- 주술회전 (기존: 책장 6번)
      ('56ad33ca-f8d0-471f-823d-7adc1c8baa57'::uuid, '책장 1번'), -- 지박소년 하나코군 (기존: 책장 19번)
      ('7e42b4f7-c89f-4b59-94b4-2daf1448c027'::uuid, '책장 1번')  -- 체인소 맨 (기존: 책장 5번)
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
    raise exception '서울대입구역점 서가 3차 원위치 반영 중 대상 불일치: expected 8, updated %', updated_count;
  end if;
end $$;
