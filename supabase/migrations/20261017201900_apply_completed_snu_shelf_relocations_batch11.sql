-- 2026-10-17 서울대입구역점 도서 원위치 11차 반영 (3번 서가 이동 완료 10종 및 블러드 레인·독고 전 시리즈 동기화)
-- 구글 스프레드시트 원위치 목록 및 사용자 지시(블러드 레인과 독고 함께 비치) 기준 서가 위치를 '책장 3번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('8c348523-0e53-45f9-8929-e465b53eeabe'::uuid, '책장 3번'), -- 당신의 모든 순간 (기존: 책장 1번)
      ('458b43a9-276a-4928-9759-6d3dbed67102'::uuid, '책장 3번'), -- 덴마 (기존: 책장 1번)
      ('e90f0d9c-8a5a-40e5-a450-362524bc8e26'::uuid, '책장 3번'), -- 동네변호사 조들호 (기존: 책장 1번)
      ('d7c31c5f-b76a-4e7f-bc63-d541259ed897'::uuid, '책장 3번'), -- 목욕의 신 (기존: 책장 2번)
      ('fdbb640f-a5be-4afe-bcb2-b1b1dae588ea'::uuid, '책장 3번'), -- 무빙 (기존: 책장 2번)
      ('bd5a232d-de2e-448d-ba1f-a92aa4d1f93e'::uuid, '책장 3번'), -- 반도 프리퀄 631 (기존: 책장 2번)
      ('a9375dfb-9c89-4657-ad27-a97fbc990901'::uuid, '책장 3번'), -- 방과후 전쟁활동 (기존: 책장 2번)
      ('51fc327b-365c-4bc6-960a-a8bfde7ba55b'::uuid, '책장 3번'), -- 뷰티풀 군바리 (기존: 책장 2번)
      ('c5500fd7-3e6a-4a90-8ee0-c2d8a84bf163'::uuid, '책장 3번'), -- 브릿지 (기존: 책장 2번)
      ('68473683-7e96-498d-84a5-15788e534c30'::uuid, '책장 3번'), -- 블러드 레인 (기존: 책장 3번)
      ('df564073-da7a-4ea9-99ce-daf1e9aafa61'::uuid, '책장 3번'), -- 독고 (기존: 책장 1번)
      ('088a655f-4c78-44e7-83b9-452c4c111972'::uuid, '책장 3번'), -- 독고2 (기존: 책장 1번)
      ('e2942429-761f-4667-b1ec-10a33fed1d28'::uuid, '책장 3번')  -- 독고 리와인드 (기존: 책장 1번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 13 then
    raise exception '서울대입구역점 서가 11차 원위치 반영 중 대상 불일치: expected 13, updated %', updated_count;
  end if;
end $$;
