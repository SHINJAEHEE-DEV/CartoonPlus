-- Seed verified price packages, beverage items, and food items for Jamsil store

with jamsil as (select id from public.stores where slug = 'jamsil')
insert into public.store_content (store_id, content_key, content_value)
select jamsil.id, 'price_packages', jsonb_build_object(
  'packages', jsonb_build_array(
    jsonb_build_object('name', '기본 1시간', 'price', '3,600원', 'note', '음료 미포함 · 초과 10분당 600원'),
    jsonb_build_object('name', '1시간 + 기본 음료', 'price', '6,500원', 'note', '기본 음료 포함 · 차액 업그레이드 가능'),
    jsonb_build_object('name', '2시간 + 기본 음료', 'price', '9,500원', 'note', '기본 음료 포함 · 최고 인기 패키지', 'isPopular', true),
    jsonb_build_object('name', '3시간 + 기본 음료', 'price', '12,500원', 'note', '기본 음료 포함'),
    jsonb_build_object('name', '5시간 + 기본 음료', 'price', '18,000원', 'note', '기본 음료 포함'),
    jsonb_build_object('name', '종일권 + 기본 음료', 'price', '15,000원', 'note', '종일 무제한 힐링 · 기본 음료 포함', 'isPopular', true)
  )
)
from jamsil
on conflict (store_id, content_key) do update set content_value = excluded.content_value, updated_at = now();

with jamsil as (select id from public.stores where slug = 'jamsil')
insert into public.store_content (store_id, content_key, content_value)
select jamsil.id, 'food_items', jsonb_build_object(
  'foods', jsonb_build_array(
    jsonb_build_object('id', 'f-ramen', 'name', '라면 (전제품 동일가격)', 'price', 4000, 'category', 'meal', 'categoryKo', '라면/음식', 'note', '대파·콩나물·청양고추·떡사리·만두·비엔나소시지·치즈·어묵 8종 토핑 바 무료', 'isPopular', true),
    jsonb_build_object('id', 'f-chicken', 'name', '치킨', 'price', 5000, 'category', 'meal', 'categoryKo', '라면/음식', 'isPopular', true),
    jsonb_build_object('id', 'f-dumpling', 'name', '만두', 'price', 4000, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-fried-rice', 'name', '볶음밥', 'price', 4000, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-jumeokbap', 'name', '주먹밥', 'price', 2000, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-kimbap', 'name', '김밥', 'price', 4800, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-tteokbokki-masitta', 'name', '떡볶이 (마시따)', 'price', 4000, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-tteokbokki-orig', 'name', '떡볶이 (오리지날)', 'price', 4800, 'category', 'meal', 'categoryKo', '라면/음식', 'isPopular', true),
    jsonb_build_object('id', 'f-sotteok', 'name', '소떡소떡', 'price', 3000, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-hotdog', 'name', '핫도그', 'price', 2500, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-frank', 'name', '닭가슴살 후랑크', 'price', 1800, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-instant-rice', 'name', '햇반', 'price', 2000, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-baked-egg', 'name', '구운계란', 'price', 2000, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'f-kimchi', 'name', '김치', 'price', 1800, 'category', 'meal', 'categoryKo', '라면/음식'),
    jsonb_build_object('id', 'd-gelato', 'name', '젤라또', 'price', 4000, 'category', 'dessert', 'categoryKo', '젤라또/디저트', 'isPopular', true),
    jsonb_build_object('id', 'd-real-brownie', 'name', '리얼브라우니', 'price', 2500, 'category', 'dessert', 'categoryKo', '젤라또/디저트'),
    jsonb_build_object('id', 'd-ddung-nancier', 'name', '뚱낭시에', 'price', 2500, 'category', 'dessert', 'categoryKo', '젤라또/디저트'),
    jsonb_build_object('id', 'd-castella', 'name', '카스테라', 'price', 3000, 'category', 'dessert', 'categoryKo', '젤라또/디저트'),
    jsonb_build_object('id', 'd-bun', 'name', '오리지날 번', 'price', 2500, 'category', 'dessert', 'categoryKo', '젤라또/디저트'),
    jsonb_build_object('id', 'd-roll-cake', 'name', '롤케익', 'price', 2500, 'category', 'dessert', 'categoryKo', '젤라또/디저트', 'isSoldOut', true),
    jsonb_build_object('id', 'd-cookies', 'name', '쿠키류', 'price', 2500, 'category', 'dessert', 'categoryKo', '젤라또/디저트', 'isSoldOut', true),
    jsonb_build_object('id', 'd-samanko', 'name', '붕어싸만코', 'price', 1500, 'category', 'dessert', 'categoryKo', '젤라또/디저트'),
    jsonb_build_object('id', 'd-cone-ice', 'name', '콘아이스크림', 'price', 1500, 'category', 'dessert', 'categoryKo', '젤라또/디저트'),
    jsonb_build_object('id', 'd-chal-ice', 'name', '찰떡아이스', 'price', 1500, 'category', 'dessert', 'categoryKo', '젤라또/디저트'),
    jsonb_build_object('id', 'd-bar-ice', 'name', '막대아이스크림', 'price', 1000, 'category', 'dessert', 'categoryKo', '젤라또/디저트'),
    jsonb_build_object('id', 's-can-drink', 'name', '캔 음료 (전제품 동일가격)', 'price', 2000, 'category', 'snack', 'categoryKo', '과자/음료', 'isPopular', true),
    jsonb_build_object('id', 's-snack-all', 'name', '과자 (전제품 동일가격)', 'price', 2500, 'category', 'snack', 'categoryKo', '과자/음료', 'isPopular', true),
    jsonb_build_object('id', 's-georgia-coldbrew', 'name', '콜드블루 블랙 (조지아)', 'price', 2500, 'category', 'snack', 'categoryKo', '과자/음료')
  )
)
from jamsil
on conflict (store_id, content_key) do update set content_value = excluded.content_value, updated_at = now();
