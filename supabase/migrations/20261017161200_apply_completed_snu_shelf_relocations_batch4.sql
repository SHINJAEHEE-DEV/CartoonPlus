-- 2026-10-17 서울대입구역점 도서 원위치 4차 반영 (이동 완료 5건)
-- 구글 스프레드시트 원위치 목록 기준 추가 확인된 도서의 서가 위치를 원래 책장으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('fe6cb576-6729-4cab-8fc3-857a68341a25'::uuid, '책장 1번'), -- 카구라바치 (기존: 책장 4번)
      ('948dd852-2088-4369-9ac0-6bdc36c0277f'::uuid, '책장 1번'), -- 파인 (기존: 책장 5번)
      ('c4aa56b8-3ebe-4fd8-ad05-b1ff75c97a63'::uuid, '책장 1번'), -- 푸른 상자 (기존: 책장 5번)
      ('1e8965ad-1aec-45a7-a9ff-32e9ef306e3b'::uuid, '책장 1번'), -- 히카루가 죽은 여름 (기존: 책장 5번)
      ('d013d554-2943-47a9-b37a-1a91a199acae'::uuid, '책장 2번')  -- 가담항설 (기존: 책장 1번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 5 then
    raise exception '서울대입구역점 서가 4차 원위치 반영 중 대상 불일치: expected 5, updated %', updated_count;
  end if;
end $$;
