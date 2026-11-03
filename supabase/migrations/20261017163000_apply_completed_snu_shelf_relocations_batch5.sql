-- 2026-10-17 서울대입구역점 도서 원위치 5차 반영 (2번 서가 이동 완료 11종)
-- 구글 스프레드시트 원위치 목록 기준 추가 확인된 도서의 서가 위치를 '책장 2번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('13984022-4b91-4c7a-a3bf-e0cb1bbb0332'::uuid, '책장 2번'), -- 갓 오브 하이스쿨 (기존: 책장 1번)
      ('28d7f3ad-7069-463e-bf37-5dcd79cf39f1'::uuid, '책장 2번'), -- 걸어서 30분 (기존: 책장 1번)
      ('a3278340-a0b1-4fbf-bedd-d6086feaccae'::uuid, '책장 2번'), -- 고래별 (기존: 책장 1번)
      ('c5da5df8-728a-4887-853f-72a2b317f781'::uuid, '책장 2번'), -- 고수 (기존: 책장 1번)
      ('78fab000-ba79-4127-b016-6af011ee49f6'::uuid, '책장 2번'), -- 고양이와 할아버지 (기존: 책장 2번)
      ('2efc786c-c158-4a42-8253-adfeff3974e6'::uuid, '책장 2번'), -- 그다이 (기존: 책장 1번)
      ('bbebb623-610a-4f14-a9ff-70b7e04024a0'::uuid, '책장 2번'), -- 나빌레라 (기존: 책장 1번)
      ('ec043352-f3f5-4dc6-9e60-3fd0250dd8d2'::uuid, '책장 2번'), -- 남사친의 법칙 (기존: 책장 1번)
      ('29f44287-4bb0-43a0-8313-08499ff5412a'::uuid, '책장 2번'), -- 낮에 뜨는 달 (기존: 책장 1번)
      ('41086f27-e0a9-4ca2-9606-90207c81148a'::uuid, '책장 2번'), -- 내세에는 남남이 좋겠어 (기존: 책장 5번)
      ('21f68017-977a-4bbb-a48f-d3fb983747d1'::uuid, '책장 2번')  -- 내일 (현재 시즌3) (기존: 책장 1번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 11 then
    raise exception '서울대입구역점 서가 5차 원위치 반영 중 대상 불일치: expected 11, updated %', updated_count;
  end if;
end $$;
