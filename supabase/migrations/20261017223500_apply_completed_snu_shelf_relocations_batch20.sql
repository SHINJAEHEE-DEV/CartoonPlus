-- 2026-10-17 서울대입구역점 도서 원위치 20차 반영 (사용자 지정 2번 서가 5종 및 9·11·15·17·18·20번 서가 14종 이동 완료)
-- 구글 스프레드시트 원위치 목록 및 사용자 지시(조선왕조실톡, 퍼펙트 게임, 클로저 이상용 2번 배치) 기준 서가 위치 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      -- 사용자 특별 지시: 책장 2번 (5종)
      ('82205742-128c-46c2-b0f1-96b1abaa46d9'::uuid, '책장 2번'), -- 조선왕조실톡 (기존: 책장 18번)
      ('73319e67-4d43-4290-8ac0-37f34b323d78'::uuid, '책장 2번'), -- 클로저 이상용 (기존: 책장 18번)
      ('6e31580a-62cf-4d42-af69-30f8025fefc8'::uuid, '책장 2번'), -- 퍼펙트게임 시즌1 (기존: 책장 18번)
      ('6b6d4319-1295-4689-ab96-5d7be6e4cf05'::uuid, '책장 2번'), -- 퍼펙트게임 시즌2 (기존: 책장 18번)
      ('3d9cfa9b-444a-42ec-a126-5fbdea62ee71'::uuid, '책장 2번'), -- 퍼펙트게임 시즌3 (기존: 책장 18번)

      -- 책장 9번 (7종)
      ('6e579c31-5a1d-4d51-8ac3-e20fefcc21c8'::uuid, '책장 9번'), -- 금요일 (기존: 책장 1번)
      ('1abfaadc-7ebb-4fd0-b94b-8df1c09668ad'::uuid, '책장 9번'), -- 기기괴괴 시리즈 (기존: 책장 1번)
      ('ffdba0bc-bfbd-434b-b1aa-93cff4a7e42f'::uuid, '책장 9번'), -- 나쁜 상사 (기존: 책장 1번)
      ('692ad90a-6d37-4c4d-be17-49cc63937d29'::uuid, '책장 9번'), -- 붉은여우 (기존: 책장 2번)
      ('dafaf687-3ab6-462f-aa98-ff7e42ac38ba'::uuid, '책장 9번'), -- 아일랜드 1부 (기존: 책장 2번)
      ('bee50b41-b42a-4afd-9fa6-a6c084dc025c'::uuid, '책장 9번'), -- 아일랜드 2부 (기존: 책장 2번)
      ('7e3f25e1-822c-404c-ac6f-c7f6ae4fcc2d'::uuid, '책장 9번'), -- 지금 우리 학교는 (기존: 책장 9번)

      -- 책장 11번 (2종)
      ('68b95cf1-6534-4c7b-a565-c59dc2582b61'::uuid, '책장 11번'), -- 5등분의 신부 (기존: 책장 5번)
      ('8286c2c5-379a-4856-8715-f44fff832c50'::uuid, '책장 11번'), -- 80세 마리코 (기존: 책장 5번)

      -- 책장 15번 (2종)
      ('b57a8115-055f-4619-8329-d19e1bee4dca'::uuid, '책장 15번'), -- 소년탐정 김전일 시즌1 (기존: 책장 15번)
      ('6003becc-3a11-49b5-b477-40c9bffd5206'::uuid, '책장 15번'), -- 소년탐정 김전일 시즌2 (기존: 책장 15번)

      -- 책장 17번 (1종)
      ('3dd82a0b-7e99-41c2-8a9b-39319ac0643c'::uuid, '책장 17번'), -- 도쿄대 리벤저스 (기존: 책장 17번)

      -- 책장 18번 (1종)
      ('4c41faf4-bea4-42ee-abd4-e474cb4ffad4'::uuid, '책장 18번'), -- 도라에몽 (기존: 책장 18번)

      -- 책장 20번 (1종)
      ('7a796065-ce2c-4262-83f1-0c0e3c717494'::uuid, '책장 20번')  -- 울기엔 좀 애매한 (기존: 책장 20번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 19 then
    raise exception '서울대입구역점 서가 20차 원위치 반영 중 대상 불일치: expected 19, updated %', updated_count;
  end if;
end $$;
