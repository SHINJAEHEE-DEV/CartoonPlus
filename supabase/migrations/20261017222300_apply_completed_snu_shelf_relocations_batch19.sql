-- 2026-10-17 서울대입구역점 도서 원위치 19차 반영 (5번 서가 최종 잔여 6종 및 6번 서가 4월의 너 스피카 이동 완료)
-- 구글 스프레드시트 원위치 목록 기준 서가 위치를 '책장 5번' 및 '책장 6번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      -- 5번 서가 최종 잔여 (6종)
      ('188baff4-b044-4ba2-88e4-88bf4c7e9d3b'::uuid, '책장 5번'), -- 커피 한잔 할까요? (기존: 책장 5번)
      ('d5deae9e-b75e-46c4-b2fe-d5feb2fc397b'::uuid, '책장 5번'), -- 크로스게임 소장판 (기존: 책장 5번)
      ('cd086ee5-a008-4847-98b2-e464c692d1fb'::uuid, '책장 5번'), -- 터치 (기존: 책장 5번)
      ('25161e74-786f-4848-80eb-d2a820b077ca'::uuid, '책장 5번'), -- 테니스의 왕자 (기존: 책장 5번)
      ('691cfa2e-86f3-4df3-9274-6f8e6760fb2a'::uuid, '책장 5번'), -- 호러와 로맨스 (기존: 책장 5번)
      ('3c26cc69-6801-4f92-9893-e268c8d0a905'::uuid, '책장 5번'), -- H2 (기존: 책장 5번)

      -- 6번 서가 (1종)
      ('15512f1a-3e1c-4957-af81-6906a445c9b6'::uuid, '책장 6번')  -- 4월의 너 스피카 (기존: 책장 5번)
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
    raise exception '서울대입구역점 서가 19차 원위치 반영 중 대상 불일치: expected 7, updated %', updated_count;
  end if;
end $$;
