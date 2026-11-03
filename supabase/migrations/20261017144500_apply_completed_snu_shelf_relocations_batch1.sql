-- 2026-10-17 서울대입구역점 도서 원위치 1차 반영 (1번 서가 이동 완료 9건)
-- 구글 스프레드시트 원위치 목록 기준 이동완료 확인된 도서의 서가 위치를 '책장 1번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('2e6ffbc2-b7ee-41c2-ae11-c74a7684229d'::uuid, '책장 1번'), -- 3월의 라이온 (기존: 책장 4번)
      ('d5e4b670-7132-49a9-a460-b802309d9532'::uuid, '책장 1번'), -- 괴수8호 (기존: 책장 4번)
      ('a3ec5046-0f9c-4288-82a1-227c62fcb71c'::uuid, '책장 1번'), -- 극락가 (기존: 책장 5번)
      ('7a56be7a-7cb9-4343-a4d4-2f8d965e6158'::uuid, '책장 1번'), -- 나의 히어로 아카데미아 (기존: 책장 1번)
      ('2573b109-e3f7-4481-9e15-0f421e502912'::uuid, '책장 1번'), -- 단다단 (기존: 책장 19번)
      ('6fc088c3-ff03-4cd3-b53d-9901a35e1eb3'::uuid, '책장 1번'), -- 마음의 소리 레전드 +50 (기존: 책장 2번)
      ('3a864264-7888-4554-8bc6-23993798c734'::uuid, '책장 1번'), -- 마음의 소리 레전드 100 (기존: 책장 2번)
      ('232eb6fc-c63f-4c6e-8f0b-287851e5ba04'::uuid, '책장 1번'), -- 메이드 인 어비스 (기존: 책장 5번)
      ('e8dae76a-3e61-4b54-8c83-ac426a6712f1'::uuid, '책장 1번')  -- 문유 (기존: 책장 2번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 9 then
    raise exception '서울대입구역점 서가 1차 원위치 반영 중 대상 불일치: expected 9, updated %', updated_count;
  end if;
end $$;
