-- Fix '향기로운 꽃은 늠름하게 핀다': update author='사카 미카미' category to '로맨스/로판' and remove author='미상' inventory
update public.books
set category = '로맨스/로판'
where title = '향기로운 꽃은 늠름하게 핀다' and author = '사카 미카미';

delete from public.book_inventories
where store_id = (select id from public.stores where slug = 'jamsil')
  and book_id = (select id from public.books where title = '향기로운 꽃은 늠름하게 핀다' and author = '미상');

-- Fix '심령탐정 야쿠모': delete author='리츠 미야코' for jamsil
delete from public.book_inventories
where store_id = (select id from public.stores where slug = 'jamsil')
  and book_id = (select id from public.books where title = '심령탐정 야쿠모' and author = '리츠 미야코');
