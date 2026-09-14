-- Enforce Store ownership independently of client-supplied filters.
create or replace function public.can_manage_store(p_store_id uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select public.is_admin() or exists (
    select 1 from public.staff_accounts
    where id = auth.uid() and status = 'approved' and store_id = p_store_id
  );
$$;

create or replace function public.current_staff_store_id()
returns uuid language sql stable security definer set search_path=public as $$
  select store_id from public.staff_accounts
  where id = auth.uid() and status = 'approved';
$$;

grant execute on function public.can_manage_store(uuid) to authenticated;
grant execute on function public.current_staff_store_id() to authenticated;

drop policy if exists "public can read launch store" on public.stores;
create policy "public reads public stores" on public.stores for select using (true);

drop policy if exists "staff writes inventories" on public.book_inventories;
drop policy if exists "staff reads all SNU inventory" on public.book_inventories;
create policy "staff manages own store inventory" on public.book_inventories
  for all using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

drop policy if exists "approved staff manages book requests" on public.book_requests;
create policy "staff manages own store book requests" on public.book_requests
  for all using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

drop policy if exists "staff updates store content" on public.store_content;
create policy "staff manages own store content" on public.store_content
  for all using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

drop policy if exists "staff manages games" on public.entertainment_items;
create policy "staff manages own store games" on public.entertainment_items
  for all using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

drop policy if exists "staff manages events" on public.store_events;
create policy "staff manages own store events" on public.store_events
  for all using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

drop policy if exists "staff manages menu items" on public.menu_items;
create policy "staff manages own store menu items" on public.menu_items
  for all using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

drop policy if exists "staff manages broadcasts" on public.scheduled_broadcasts;
create policy "staff manages own store broadcasts" on public.scheduled_broadcasts
  for all using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

create policy "staff manages own store presets" on public.broadcast_presets
  for all using (store_id is null and public.is_admin() or public.can_manage_store(store_id))
  with check (store_id is null and public.is_admin() or public.can_manage_store(store_id));

alter table public.broadcast_runs add column if not exists store_id uuid references public.stores(id);
update public.broadcast_runs as runs
set store_id = schedules.store_id
from public.scheduled_broadcasts as schedules
where runs.scheduled_broadcast_id = schedules.id and runs.store_id is null;

drop policy if exists "staff reads runs" on public.broadcast_runs;
drop policy if exists "staff records runs" on public.broadcast_runs;
drop policy if exists "staff updates runs" on public.broadcast_runs;
create policy "staff manages own store broadcast runs" on public.broadcast_runs
  for all using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

create or replace function public.set_inventory_archive(p_inventory_id uuid, p_archived boolean)
returns void language plpgsql security definer set search_path=public as $$
declare v_store_id uuid;
begin
  select store_id into v_store_id from public.book_inventories where id = p_inventory_id;
  if v_store_id is null or not public.can_manage_store(v_store_id) then
    raise exception 'store access denied';
  end if;
  update public.book_inventories
  set archived_at = case when p_archived then now() else null end, updated_at = now()
  where id = p_inventory_id;
end $$;

create or replace function public.upsert_inventory_for_store(
  p_store_id uuid, p_title text, p_author text, p_category text, p_volume_range text, p_shelf_location text
)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_book uuid; v_inventory uuid;
begin
  if not public.can_manage_store(p_store_id) then raise exception 'store access denied'; end if;
  insert into public.books(title,author,category,normalized_title,normalized_author,initial_consonants)
  values(p_title,coalesce(p_author,''),coalesce(p_category,''),lower(regexp_replace(p_title,'[[:space:][:punct:]]','','g')),lower(regexp_replace(coalesce(p_author,''),'[[:space:][:punct:]]','','g')),'')
  on conflict(title,author) do update set category=excluded.category returning id into v_book;
  insert into public.book_inventories(store_id,book_id,volume_range,shelf_location)
  values(p_store_id,v_book,p_volume_range,p_shelf_location)
  on conflict(store_id,book_id) do update set volume_range=excluded.volume_range,shelf_location=excluded.shelf_location,updated_at=now(),archived_at=null
  returning id into v_inventory;
  return v_inventory;
end $$;

create or replace function public.upsert_inventory(
  p_title text,p_author text,p_category text,p_volume_range text,p_shelf_location text
)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_store_id uuid;
begin
  select public.current_staff_store_id() into v_store_id;
  if v_store_id is null then raise exception 'approved staff required'; end if;
  return public.upsert_inventory_for_store(v_store_id,p_title,p_author,p_category,p_volume_range,p_shelf_location);
end $$;

grant execute on function public.upsert_inventory_for_store(uuid,text,text,text,text,text) to authenticated;
