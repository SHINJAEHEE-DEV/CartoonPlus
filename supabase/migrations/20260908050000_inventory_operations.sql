create or replace function public.set_inventory_archive(p_inventory_id uuid, p_archived boolean)
returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.is_approved_staff() then raise exception 'approved staff required'; end if;
 update book_inventories set archived_at=case when p_archived then now() else null end,updated_at=now() where id=p_inventory_id;
end $$;
grant execute on function public.set_inventory_archive(uuid,boolean) to authenticated;

create or replace function public.upsert_inventory(p_title text,p_author text,p_category text,p_volume_range text,p_shelf_location text)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_book uuid; v_store uuid; v_inventory uuid;
begin
 if not public.is_approved_staff() then raise exception 'approved staff required'; end if;
 select id into v_store from stores where slug='snu';
 insert into books(title,author,category,normalized_title,normalized_author,initial_consonants)
 values(p_title,coalesce(p_author,''),coalesce(p_category,''),lower(regexp_replace(p_title,'[[:space:][:punct:]]','','g')),lower(regexp_replace(coalesce(p_author,''),'[[:space:][:punct:]]','','g')),'')
 on conflict(title,author) do update set category=excluded.category returning id into v_book;
 insert into book_inventories(store_id,book_id,volume_range,shelf_location)
 values(v_store,v_book,p_volume_range,p_shelf_location)
 on conflict(store_id,book_id) do update set volume_range=excluded.volume_range,shelf_location=excluded.shelf_location,updated_at=now(),archived_at=null returning id into v_inventory;
 return v_inventory;
end $$;
grant execute on function public.upsert_inventory(text,text,text,text,text) to authenticated;
