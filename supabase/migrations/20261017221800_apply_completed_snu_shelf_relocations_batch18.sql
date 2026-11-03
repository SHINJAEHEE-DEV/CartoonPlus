-- 2026-10-17 서울대입구역점 도서 원위치 18차 반영 (5번 서가 19종, 총몽 17번, 치즈인더트랩 4번 이동 완료)
-- 구글 스프레드시트 원위치 목록 및 사용자 지시(총몽 17번, 치즈인더트랩 4번) 기준 서가 위치 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      -- 총몽 완전판 (사용자 지시: 책장 17번)
      ('706420cc-60dd-4487-9c07-409b42fa5595'::uuid, '책장 17번'), -- 총몽 완전판 (알리타 원작) (기존: 책장 5번)

      -- 치즈인더트랩 전 시즌 (사용자 지시: 책장 4번)
      ('540a1203-88e6-4fa2-a601-d3ba59aa7b66'::uuid, '책장 4번'), -- 치즈인더트랩 시즌1 (기존: 책장 5번)
      ('bd9127da-43a6-4beb-8725-9ec165c10acc'::uuid, '책장 4번'), -- 치즈인더트랩 시즌2 (기존: 책장 5번)
      ('73d6931e-c410-4b24-a4be-461a9b2ed947'::uuid, '책장 4번'), -- 치즈인더트랩 시즌3 (기존: 책장 5번)
      ('9ddec5f7-1ffe-4903-bde3-815926148986'::uuid, '책장 4번'), -- 치즈인더트랩 시즌4 (기존: 책장 5번)

      -- 5번 서가 도서 (19종)
      ('0360e2ae-3024-4cd2-99bd-c4ab3c7a0bf9'::uuid, '책장 5번'), -- 버림 받은 황비 (기존: 책장 2번)
      ('87f17030-cb5c-4b7e-b714-10f62e5a58c0'::uuid, '책장 5번'), -- 부암동 복수자 소셜클럽 (기존: 책장 2번)
      ('66f66bc0-0650-4edd-8fa9-caaf4b9cc077'::uuid, '책장 5번'), -- 사내 맞선 (기존: 책장 2번)
      ('5596e69c-f4a4-42d7-9f0c-58b9f97ae415'::uuid, '책장 5번'), -- 사내 연애 사절 (기존: 책장 2번)
      ('3f21fc7f-2ff4-458a-b489-ef976510acf6'::uuid, '책장 5번'), -- 서울 자가에 대기업 다니는 김부장 이야기 (기존: 책장 2번)
      ('54d275e2-db1c-47bd-a649-0ba31d04716e'::uuid, '책장 5번'), -- 손안의 안단테 (기존: 책장 5번)
      ('499eea8d-0ac0-4536-aeed-884bdb73c3b6'::uuid, '책장 5번'), -- 스피릿 핑거스 (기존: 책장 2번)
      ('de53e5f8-5553-4a35-b5f6-53c3cadf3a2f'::uuid, '책장 5번'), -- 슬램덩크 (기존: 책장 5번)
      ('f7e0bd69-1d40-45e2-91b4-f27d1eb0758b'::uuid, '책장 5번'), -- 신비 (기존: 책장 2번)
      ('7ac9438c-9bcb-495f-9ce4-12109ef8814e'::uuid, '책장 5번'), -- 실 (기존: 책장 2번)
      ('8236042a-8136-4528-8884-70187853a34d'::uuid, '책장 5번'), -- 심연의 하늘 (기존: 책장 2번)
      ('e2e09b8d-2e83-4503-b0c7-e2f718190c7b'::uuid, '책장 5번'), -- 악녀가 사랑할 때 (기존: 책장 2번)
      ('cf7636dd-f728-4361-b975-d6ba696a667a'::uuid, '책장 5번'), -- 악마와 계약연애 (기존: 책장 2번)
      ('516b0234-5989-45fb-b4cd-ddca618be0d5'::uuid, '책장 5번'), -- 오늘도 사랑스럽 개 (기존: 책장 3번)
      ('c11e7c87-661f-44af-aa8b-3fdb49c4ba25'::uuid, '책장 5번'), -- 윈터우즈 (기존: 책장 5번)
      ('31be96aa-044b-4655-a0a5-54effe082622'::uuid, '책장 5번'), -- 조명가게 (기존: 책장 5번)
      ('e9be0e8d-37d5-419d-9d2f-4f49a7bdc1ad'::uuid, '책장 5번'), -- 조조코믹스 (기존: 책장 4번)
      ('27619f4d-dad2-4264-9a3c-430668754673'::uuid, '책장 5번'), -- 좋아하면 울리는 (기존: 책장 5번)
      ('900c5641-9972-4f5c-acbb-b9e756d41993'::uuid, '책장 5번')  -- 청춘로맨스 (기존: 책장 5번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 24 then
    raise exception '서울대입구역점 서가 18차 원위치 반영 중 대상 불일치: expected 24, updated %', updated_count;
  end if;
end $$;
