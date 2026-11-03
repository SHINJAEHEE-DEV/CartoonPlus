-- 2026-10-17 서울대입구역점 도서 원위치 9차 반영 (2번 서가 이동 완료 6종)
-- 구글 스프레드시트 원위치 목록 기준 추가 확인된 도서의 서가 위치를 '책장 2번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('98f63254-50da-4bc0-a9ac-ae7669c8b6cb'::uuid, '책장 2번'), -- 캐셔로 (기존: 책장 5번)
      ('ba348410-07e4-4800-bf7c-ee6388d3ba72'::uuid, '책장 2번'), -- 크로스 더 라인 (기존: 책장 5번)
      ('2b8083ad-9b13-4a48-b7c3-5e60fee2136a'::uuid, '책장 2번'), -- 킹더랜드 (기존: 책장 4번)
      ('12befa0c-97e6-4508-8dd8-6ef754cea522'::uuid, '책장 2번'), -- 타몬군 지금 어느쪽 (기존: 책장 2번)
      ('5c1f05ce-5a44-4e4f-9977-6d4d51253dc3'::uuid, '책장 2번'), -- 화장 지워주는 남자 (기존: 책장 4번)
      ('36686f8a-40be-454e-9dc0-9783dd96a9de'::uuid, '책장 2번')  -- 후궁계약 (기존: 책장 4번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 6 then
    raise exception '서울대입구역점 서가 9차 원위치 반영 중 대상 불일치: expected 6, updated %', updated_count;
  end if;
end $$;
