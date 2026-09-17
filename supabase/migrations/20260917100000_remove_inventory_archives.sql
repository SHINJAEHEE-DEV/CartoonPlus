-- Inventory deletions are permanent and scoped to a single store inventory row.
delete from public.book_inventories where archived_at is not null;

drop function if exists public.set_inventory_archive(uuid, boolean);

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
  on conflict(store_id,book_id) do update set volume_range=excluded.volume_range,shelf_location=excluded.shelf_location,updated_at=now()
  returning id into v_inventory;
  return v_inventory;
end $$;

-- Recreate policies and views before dropping archived_at
drop policy if exists "public can read active SNU inventory" on public.book_inventories;
create policy "public can read active SNU inventory" on public.book_inventories for select using (
  exists (
    select 1 from public.stores where stores.id = book_inventories.store_id and stores.slug = 'snu'
  )
);

create or replace view public.customer_book_catalogue
with (security_invoker = true) as
select
  inventories.id as inventory_id,
  stores.slug as store_slug,
  books.title,
  books.author,
  books.category,
  inventories.volume_range,
  inventories.shelf_location,
  inventories.first_registered_at
from public.book_inventories as inventories
join public.books on books.id = inventories.book_id
join public.stores on stores.id = inventories.store_id
where books.archived_at is null;

alter table public.book_inventories drop column if exists archived_at;
