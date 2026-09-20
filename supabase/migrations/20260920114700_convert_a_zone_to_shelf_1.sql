-- Migration: Convert A zone shelf locations to "책장 1번"
update public.book_inventories
set shelf_location = case
  when shelf_location = 'A구역' then '책장 1번'
  when shelf_location like 'A구역 (%' then '책장 1번 ' || substring(shelf_location from 5)
  else shelf_location
end
where store_id = (select id from public.stores where slug = 'snu')
  and shelf_location like 'A구역%';
