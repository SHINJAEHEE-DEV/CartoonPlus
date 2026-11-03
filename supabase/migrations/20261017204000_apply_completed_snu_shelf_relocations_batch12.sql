-- 2026-10-17 서울대입구역점 도서 원위치 12차 반영 (3번 서가 이동 완료 9종 및 신과 함께 저승편 동기화)
-- 구글 스프레드시트 원위치 목록 및 사용자 지시(신과 함께 전 시리즈 동기화) 기준 서가 위치를 '책장 3번'으로 갱신

do $$
declare
  updated_count integer;
begin
  with changes(inventory_id, target_shelf_location) as (
    values
      ('ec7f565b-a281-4f24-a3b7-8e86159d1259'::uuid, '책장 3번'), -- 빙탕후루 (기존: 책장 2번)
      ('4e144f4d-3e14-4a2e-9c42-984d348a7b17'::uuid, '책장 3번'), -- 샤크 (기존: 책장 3번)
      ('21d43f22-ec5f-4749-adfa-a28583e3dfe4'::uuid, '책장 3번'), -- 선천적 얼간이들 (기존: 책장 2번)
      ('bfaaa399-573b-48e3-8153-a50718ffa440'::uuid, '책장 3번'), -- 송곳 (기존: 책장 2번)
      ('de28b347-64cf-49fa-ad72-e4bb9e97b3cb'::uuid, '책장 3번'), -- 술꾼도시처녀들 (기존: 책장 2번)
      ('930eaaa7-032b-45d8-8541-7cb6693497bc'::uuid, '책장 3번'), -- 스위트 홈 (기존: 책장 2번)
      ('eaf4934f-8838-445e-a028-eaba0c2ac0ab'::uuid, '책장 3번'), -- 시동 (기존: 책장 2번)
      ('1b3244b3-2b4b-4825-989e-36846be6be20'::uuid, '책장 3번'), -- 신과 함께: 신화편 (기존: 책장 2번)
      ('80588985-376d-475f-9730-5318340ddf04'::uuid, '책장 3번'), -- 신과 함께: 이승편 (기존: 책장 2번)
      ('5e5026c5-7661-4402-ae13-ee88f2d49960'::uuid, '책장 3번')  -- 신과 함께: 저승편 (기존: 책장 2번)
  ), updated as (
    update public.book_inventories as inventory
       set shelf_location = changes.target_shelf_location,
           updated_at = now()
      from changes
     where inventory.id = changes.inventory_id
    returning inventory.id
  )
  select count(*) into updated_count from updated;

  if updated_count <> 10 then
    raise exception '서울대입구역점 서가 12차 원위치 반영 중 대상 불일치: expected 10, updated %', updated_count;
  end if;
end $$;
