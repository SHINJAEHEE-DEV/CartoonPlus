update public.store_events
set title = replace(title, '한강 즉석 라면', '즉석 라면')
where title like '한강 즉석 라면%';
