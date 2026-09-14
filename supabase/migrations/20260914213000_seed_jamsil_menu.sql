with jamsil as (select id from public.stores where slug = 'jamsil')
insert into public.menu_items (store_id, category, name, description, price, sort_order)
select jamsil.id, source.category, source.name, source.description, source.price, source.sort_order
from jamsil cross join (values
 ('rate','1시간','음료 미포함',3600,1),('rate','1시간+음료','기본 음료 포함',6500,2),('rate','2시간+음료','기본 음료 포함',9500,3),('rate','3시간+음료','기본 음료 포함',12000,4),('rate','종일권+음료','기본 음료 포함',15000,5),
 ('food','라면','전제품 동일가격',4000,10),('food','치킨',null,5000,11),('food','만두',null,4000,12),('food','볶음밥',null,4000,13),('food','주먹밥',null,2000,14),('food','김밥',null,4800,15),('food','떡볶이(마시따)',null,4000,16),('food','떡볶이(오리지날)',null,4800,17),('food','소떡',null,3000,18),('food','핫도그',null,2500,19),('food','닭가슴살 후랑크',null,1800,20),('food','햇반',null,2000,21),('food','구운계란',null,2000,22),('food','김치',null,1800,23),
 ('beverage','복숭아 아이스티','패키지 기본 음료',0,30),('beverage','레몬 아이스티','패키지 기본 음료',0,31),('beverage','아이스 망고피치','패키지 +500원',500,32),('beverage','레몬 에이드','패키지 +1,500원',1500,33),('beverage','망고 에이드','패키지 +1,500원',1500,34),('beverage','플레인 요거트 스무디','패키지 +2,000원',2000,35),('beverage','딸기 요거트 스무디','패키지 +2,000원',2000,36),('beverage','망고 요거트 스무디','패키지 +2,000원',2000,37),('beverage','복숭아 요거트 스무디','패키지 +2,000원',2000,38),('beverage','바닐라 쉐이크','패키지 +2,000원',2000,39),('beverage','초코 쉐이크','패키지 +2,000원',2000,40),('beverage','민트초코 쉐이크','패키지 +2,000원',2000,41),('beverage','녹차 쉐이크','패키지 +2,000원',2000,42)
) as source(category,name,description,price,sort_order);
