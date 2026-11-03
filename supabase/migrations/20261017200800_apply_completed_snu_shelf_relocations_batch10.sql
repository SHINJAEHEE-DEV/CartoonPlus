-- 2026-10-17 서울대입구역점 도서 원위치 10차 반영 (3번 서가 이동 완료 7종 및 닥터 프로스트·노블레스 전 시즌 동기화)
-- 구글 스프레드시트 원위치 목록 및 사용자 지시(노블레스/닥터프로스트 동일 서가) 기준 서가 위치를 '책장 3번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('71efb3d3-aa89-4994-a22c-78bca41518ac'::uuid, '책장 3번'), -- 3인칭 (기존: 책장 1번)
      ('ca2b57d1-2f3e-4a2b-bd28-dc67fda34704'::uuid, '책장 3번'), -- 곱게 자란 자식 (기존: 책장 1번)
      ('ccdb667b-0841-4b21-a76d-396b44c8ada3'::uuid, '책장 3번'), -- 나 혼자만 레벨업 (기존: 책장 1번)
      ('0c7bc613-659a-48d2-8449-2c36e47dc56f'::uuid, '책장 3번'), -- 노블레스 시즌1 (기존: 책장 1번)
      ('90a9b6b5-8a23-43ff-94da-373187273840'::uuid, '책장 3번'), -- 노블레스 시즌2 (기존: 책장 1번)
      ('e1fa98f0-6a71-4d57-a55d-ad32f7f3c4da'::uuid, '책장 3번'), -- 노블레스 시즌3 (기존: 책장 1번)
      ('78a6c0de-e0c2-4608-bc56-b84db50bbcfb'::uuid, '책장 3번'), -- 노블레스 시즌 4 (기존: 책장 1번)
      ('a7e39365-1022-449b-a061-fdc289842aea'::uuid, '책장 3번'), -- 노블레스 시즌 5 (기존: 책장 1번)
      ('b1610f5b-0b3f-4e6e-8043-77f6906ce30a'::uuid, '책장 3번'), -- 노블레스 시즌 6 (기존: 책장 1번)
      ('8e0e535a-aadc-4268-b0b1-8583710ee4de'::uuid, '책장 3번'), -- 노블레스 시즌 7 (기존: 책장 1번)
      ('dbf3f5cb-656a-45a0-bd27-b550e93a0b5c'::uuid, '책장 3번')  -- 닥터 프로스트 시즌4  #16~ (기존: 책장 1번)
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
    raise exception '서울대입구역점 서가 10차 원위치 반영 중 대상 불일치: expected 11, updated %', updated_count;
  end if;
end $$;
