alter table public.book_inventories
  add column if not exists last_volume integer;

update public.book_inventories
set last_volume = substring(volume_range from '([0-9]+)[^0-9]*$')::integer
where last_volume is null;

alter table public.book_inventories
  drop constraint if exists book_inventories_last_volume_positive;

alter table public.book_inventories
  add constraint book_inventories_last_volume_positive check (last_volume is null or last_volume > 0);

update public.book_inventories
set volume_range = case when last_volume is null then '확인 중' else format('1~%s권', last_volume) end;

drop function if exists public.upsert_inventory_for_store(uuid,text,text,text,text,text);
drop function if exists public.upsert_inventory(text,text,text,text,text);

create function public.upsert_inventory_for_store(
  p_store_id uuid, p_title text, p_author text, p_category text, p_last_volume integer, p_shelf_location text
)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_book uuid; v_inventory uuid;
begin
  if p_last_volume is not null and p_last_volume < 1 then raise exception 'last volume must be positive'; end if;
  if not public.can_manage_store(p_store_id) then raise exception 'store access denied'; end if;
  insert into public.books(title,author,category,normalized_title,normalized_author,initial_consonants)
  values(p_title,coalesce(p_author,''),coalesce(p_category,''),lower(regexp_replace(p_title,'[[:space:][:punct:]]','','g')),lower(regexp_replace(coalesce(p_author,''),'[[:space:][:punct:]]','','g')),'')
  on conflict(title,author) do update set category=excluded.category returning id into v_book;
  insert into public.book_inventories(store_id,book_id,volume_range,last_volume,shelf_location)
  values(p_store_id,v_book,case when p_last_volume is null then '확인 중' else format('1~%s권',p_last_volume) end,p_last_volume,p_shelf_location)
  on conflict(store_id,book_id) do update set volume_range=excluded.volume_range,last_volume=excluded.last_volume,shelf_location=excluded.shelf_location,updated_at=now(),archived_at=null
  returning id into v_inventory;
  return v_inventory;
end $$;

create function public.upsert_inventory(
  p_title text,p_author text,p_category text,p_last_volume integer,p_shelf_location text
)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_store_id uuid;
begin
  select public.current_staff_store_id() into v_store_id;
  if v_store_id is null then raise exception 'approved staff required'; end if;
  return public.upsert_inventory_for_store(v_store_id,p_title,p_author,p_category,p_last_volume,p_shelf_location);
end $$;

grant execute on function public.upsert_inventory_for_store(uuid,text,text,text,integer,text) to authenticated;
grant execute on function public.upsert_inventory(text,text,text,integer,text) to authenticated;
