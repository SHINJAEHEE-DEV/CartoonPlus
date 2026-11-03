-- 2026-10-17 서울대입구역점 도서 원위치 13차 반영 (3번 서가 이동 완료 5종 및 이태원 클라쓰 동기화)
-- 구글 스프레드시트 원위치 목록 및 사용자 지시(이태원 클라쓰 동일 서가 비치) 기준 서가 위치를 '책장 3번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('16e757dd-1a3b-4214-85ea-49eacec17eb8'::uuid, '책장 3번'), -- 신의 탑 (기존: 책장 2번)
      ('4ac7e370-6d89-4b1e-b1a8-e07313b60442'::uuid, '책장 3번'), -- 아파트 (기존: 책장 2번)
      ('9adb11b7-f3ab-4f87-99c6-b971fcf0567a'::uuid, '책장 3번'), -- 약한 영웅 (기존: 책장 2번)
      ('cd9556ee-7111-4089-bc6e-506aa07d8c6b'::uuid, '책장 3번'), -- 이제 곧 죽습니다 (기존: 책장 3번)
      ('6cac404d-7e16-424e-9f13-e4415d79e3bc'::uuid, '책장 3번'), -- 일진의 크기 (기존: 책장 3번)
      ('cfd79805-5db9-413e-a6e0-7eca15ad5bb8'::uuid, '책장 3번')  -- 이태원 클라쓰 (기존: 책장 3번)
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
    raise exception '서울대입구역점 서가 13차 원위치 반영 중 대상 불일치: expected 6, updated %', updated_count;
  end if;
end $$;
