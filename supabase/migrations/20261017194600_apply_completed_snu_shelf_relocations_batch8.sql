-- 2026-10-17 서울대입구역점 도서 원위치 8차 반영 (2번 서가 이동 완료 11종)
-- 구글 스프레드시트 원위치 목록 기준 추가 확인된 도서의 서가 위치를 '책장 2번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('f5f74e52-0652-4756-bc9c-045592767aeb'::uuid, '책장 2번'), -- 옷소매 붉은 끝동 (기존: 4)
      ('be6dc3d1-44d3-4d0a-8c9f-6b1602440838'::uuid, '책장 2번'), -- 옷소매 붉은 끝동 (기존: 책장 2번)
      ('5e658fdb-c4b6-4047-99a7-4cc9846f1475'::uuid, '책장 2번'), -- 외과의사 엘리제 (기존: 책장 4번)
      ('0aaa7e0c-4a0a-4b2a-bed4-51c716fe1dfe'::uuid, '책장 2번'), -- 외모지상주의 (기존: 책장 5번)
      ('5fee3ca9-f061-400b-9137-0303ca62e714'::uuid, '책장 2번'), -- 우리사이느은 (기존: 책장 4번)
      ('80045037-08f0-4762-ab85-f2b24472b95b'::uuid, '책장 2번'), -- 윈드 브레이커 (기존: 책장 4번)
      ('c887d2d5-4bfc-4540-afe1-4f3b74d37b87'::uuid, '책장 2번'), -- 인소의 법칙 (기존: 책장 4번)
      ('4e3686fa-9499-4ef1-aae8-6c0a9614e930'::uuid, '책장 2번'), -- 지옥사원 (기존: 책장 2번)
      ('1799094c-3f8d-4e1d-916d-122dcf0d1879'::uuid, '책장 2번'), -- 창백한 말 시즌1 (기존: 책장 2번)
      ('d7438346-184d-4283-ab37-2f6230ae8831'::uuid, '책장 2번'), -- 창백한 말 시즌2 (기존: 책장 2번)
      ('019ebd90-c168-4eab-a4a3-87f4ad7864d2'::uuid, '책장 2번'), -- 최애의 아이 (기존: 책장 5번)
      ('47604472-bc2c-41c8-86cf-11c099f59fae'::uuid, '책장 2번')  -- 취향저격 그녀 (기존: 책장 2번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 12 then
    raise exception '서울대입구역점 서가 8차 원위치 반영 중 대상 불일치: expected 12, updated %', updated_count;
  end if;
end $$;
