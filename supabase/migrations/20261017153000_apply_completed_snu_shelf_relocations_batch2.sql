-- 2026-10-17 서울대입구역점 도서 원위치 2차 반영 (1번 서가 이동 완료 4건)
-- 구글 스프레드시트 원위치 목록 기준 추가 확인된 도서의 서가 위치를 '책장 1번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('54102ab9-003f-46ae-9a25-b424d7b45264'::uuid, '책장 1번'), -- 사카모토 데이즈 (기존: 책장 5번)
      ('87877b0a-e40b-4423-ae54-d59d74193fa0'::uuid, '책장 1번'), -- 소녀신선 (기존: 책장 2번)
      ('44f1dba6-958a-4978-b498-12edf61d6f1b'::uuid, '책장 1번'), -- 스파이 패밀리 (기존: 책장 5번)
      ('c26cf2ef-8b52-4ef8-abae-731075f1d044'::uuid, '책장 1번')  -- 아메리카노 엑소더스 (기존: 책장 2번)
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
    raise exception '서울대입구역점 서가 2차 원위치 반영 중 대상 불일치: expected 4, updated %', updated_count;
  end if;
end $$;
