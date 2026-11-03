-- 2026-10-17 서울대입구역점 도서 원위치 7차 반영 (2번 서가 17종 및 3번 서가 1종 이동 완료)
-- 구글 스프레드시트 원위치 목록 기준 추가 확인된 도서의 서가 위치를 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('1ed12c34-366f-4c02-956c-a5a4ad562e49'::uuid, '책장 2번'), -- 반딧불이의 혼례 (기존: 책장 2번)
      ('ea526fde-1058-4f43-8efa-bd70c1706ce7'::uuid, '책장 2번'), -- 뽀짜툰 (기존: 책장 2번)
      ('803a5a01-882e-450a-acf8-24cce07c5bbc'::uuid, '책장 2번'), -- 손끝과 연연 (기존: 책장 2번)
      ('5571ff51-0e46-434c-9259-ba112b6eeb30'::uuid, '책장 2번'), -- 순정말고 순종 시즌1 (기존: 책장 2번)
      ('81bbaf86-4aa4-48ed-9acd-7e55d8bf3d2d'::uuid, '책장 2번'), -- 스킵과 로퍼 (기존: 책장 4번)
      ('2fbb31d8-ae0a-4d42-a2aa-fbb28e926a38'::uuid, '책장 2번'), -- 식객 (기존: 책장 4번)
      ('0208738c-8360-40f0-a688-a05206e97de5'::uuid, '책장 2번'), -- 식객2 (기존: 책장 2번)
      ('a81cd332-d946-4b45-ab8c-12199965417e'::uuid, '책장 2번'), -- 십이야 (기존: 책장 2번)
      ('dd1a99db-d680-4590-98f8-f591eb097f82'::uuid, '책장 2번'), -- 아 지갑놓고 나왔다 1부,2부 (기존: 책장 2번)
      ('87645559-8109-400a-9ea4-d3d28c5800b1'::uuid, '책장 2번'), -- 아름다운 초저녁달 (기존: 책장 2번)
      ('61daec03-0506-4592-a1bd-cf3693b32a6c'::uuid, '책장 2번'), -- 아쿠아맨 (기존: 책장 2번)
      ('0eaebf5b-c1c4-4cf3-935f-488818b08ae1'::uuid, '책장 2번'), -- 안나라 수마나라 (기존: 책장 2번)
      ('44a79207-319e-45b0-8d89-fa91022752e3'::uuid, '책장 2번'), -- 앙영의 일기장 (기존: 책장 2번)
      ('991970a5-52c5-4a18-9eb4-09e9331e7b00'::uuid, '책장 2번'), -- 어서와 (기존: 책장 2번)
      ('8b5db2cb-e89e-4a7f-afd9-81c36488ad8e'::uuid, '책장 2번'), -- 어쩌다 고양이 집사 (기존: 책장 2번)
      ('e7ef43a0-89d2-419b-9d8e-2f4619f759ab'::uuid, '책장 2번'), -- 어쩌다 발견한 7월 (기존: 책장 3번)
      ('418e57c2-03eb-4e15-b4a4-28b9c3a9c96b'::uuid, '책장 2번'), -- 오무라이스 잼잼 (기존: 책장 2번)
      ('91d7dce9-05e2-4cd4-bd31-940b25eb6e63'::uuid, '책장 3번')  -- 쌍갑포차 (기존: 책장 2번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 18 then
    raise exception '서울대입구역점 서가 7차 원위치 반영 중 대상 불일치: expected 18, updated %', updated_count;
  end if;
end $$;
