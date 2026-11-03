-- 2026-10-17 서울대입구역점 도서 원위치 16차 반영 (4번 서가 14종 및 5번 서가 여신강림 이동 완료)
-- 구글 스프레드시트 원위치 목록 기준 서가 위치를 '책장 4번' 및 '책장 5번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      -- 4번 서가 대상 (14종)
      ('d3b1a5ff-b404-469f-88ee-ca0adcd1c304'::uuid, '책장 4번'), -- 그대를 사랑합니다 (기존: 책장 1번)
      ('56aa03a7-2506-4d2a-a59f-19b8c1fb9833'::uuid, '책장 4번'), -- 김비서가 왜 그럴까 (기존: 책장 1번)
      ('edfbc3e1-a52e-4500-8b09-67e01c51141e'::uuid, '책장 4번'), -- 남과 여 (기존: 책장 1번)
      ('31177ab2-5a58-4f51-876a-dfba6cccb15b'::uuid, '책장 4번'), -- 남자친구를 조심해 (기존: 책장 1번)
      ('c914cecd-7b59-4194-9b0f-00ee567c7c9c'::uuid, '책장 4번'), -- 남팬만화 (기존: 책장 1번)
      ('c7504613-454e-43ee-a3b0-8948bf27358d'::uuid, '책장 4번'), -- 내 남편과 결혼해줘 (기존: 책장 1번)
      ('a3213cd1-19ec-4990-9239-c369a83103a7'::uuid, '책장 4번'), -- 내 ID는 강남미인 (기존: 책장 1번)
      ('96673a77-0a74-4c0e-af82-538574dd358c'::uuid, '책장 4번'), -- 노곤하개 (기존: 책장 1번)
      ('58a6442d-6fe6-48ec-a4c8-34a5616e5169'::uuid, '책장 4번'), -- 눈이 나려 꽃 (기존: 책장 1번)
      ('88e65812-ef23-4f83-904c-a2fc5984e575'::uuid, '책장 4번'), -- 대학일기 (기존: 책장 1번)
      ('b5f95953-26e6-4d48-8b03-63a490f016dd'::uuid, '책장 4번'), -- 독립일기 (기존: 책장 1번)
      ('b6ea9c1d-cc2a-4c0a-bf7b-854773a1ae2b'::uuid, '책장 4번'), -- 마녀 (기존: 책장 2번)
      ('ecbb0a59-2db8-4dde-af46-08c2cd575eda'::uuid, '책장 4번'), -- 연놈 (기존: 책장 3번)
      ('985a349b-3cad-46a5-9fc3-134269e7e6b8'::uuid, '책장 4번'), -- 연애혁명 (기존: 책장 3번)
      -- 5번 서가 대상 (1종)
      ('2bb878f9-7d3b-487b-bc2c-045cb96cfd41'::uuid, '책장 5번')  -- 여신강림 (기존: 책장 3번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 15 then
    raise exception '서울대입구역점 서가 16차 원위치 반영 중 대상 불일치: expected 15, updated %', updated_count;
  end if;
end $$;
