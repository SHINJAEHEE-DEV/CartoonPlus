-- 1. Fix public book inventory RLS to allow reading catalogue for all public stores
drop policy if exists "public can read active SNU inventory" on public.book_inventories;
drop policy if exists "public can read active inventory" on public.book_inventories;
create policy "public can read active inventory" on public.book_inventories
  for select using (
    exists (
      select 1 from public.stores where stores.id = book_inventories.store_id
    )
  );

-- Recreate customer_book_catalogue view with security invoker
drop view if exists public.customer_book_catalogue;
create or replace view public.customer_book_catalogue
with (security_invoker = true) as
select
  inventories.id as inventory_id,
  stores.slug as store_slug,
  books.title,
  books.author,
  books.category,
  inventories.volume_range,
  inventories.last_volume,
  inventories.shelf_location,
  inventories.first_registered_at
from public.book_inventories as inventories
join public.books on books.id = inventories.book_id
join public.stores on stores.id = inventories.store_id
where books.archived_at is null;

-- 2. Clean up conflicting overloaded functions
drop function if exists public.upsert_inventory_for_store(uuid, text, text, text, text, text);
drop function if exists public.upsert_inventory_for_store(uuid, text, text, text, integer, text);
drop function if exists public.upsert_inventory(text, text, text, text, text);
drop function if exists public.upsert_inventory(text, text, text, integer, text);

-- 3. Define single canonical upsert_inventory_for_store RPC
create or replace function public.upsert_inventory_for_store(
  p_store_id uuid,
  p_title text,
  p_author text,
  p_category text,
  p_last_volume integer,
  p_shelf_location text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_book_id uuid;
  v_inventory_id uuid;
  v_clean_title text := btrim(coalesce(p_title, ''));
  v_clean_author text := btrim(coalesce(p_author, ''));
  v_clean_category text := btrim(coalesce(p_category, ''));
  v_clean_shelf text := btrim(coalesce(p_shelf_location, ''));
  v_norm_title text;
  v_norm_author text;
begin
  if v_clean_title = '' then
    raise exception 'title cannot be empty';
  end if;

  if p_last_volume is not null and p_last_volume < 1 then
    raise exception 'last volume must be positive';
  end if;

  if not public.can_manage_store(p_store_id) then
    raise exception 'store access denied';
  end if;

  v_norm_title := lower(regexp_replace(v_clean_title, '[[:space:][:punct:]]', '', 'g'));
  v_norm_author := lower(regexp_replace(v_clean_author, '[[:space:][:punct:]]', '', 'g'));

  insert into public.books (
    title,
    author,
    category,
    normalized_title,
    normalized_author,
    initial_consonants
  )
  values (
    v_clean_title,
    v_clean_author,
    v_clean_category,
    v_norm_title,
    v_norm_author,
    ''
  )
  on conflict (title, author) do update
  set category = case when excluded.category <> '' then excluded.category else public.books.category end
  returning id into v_book_id;

  insert into public.book_inventories (
    store_id,
    book_id,
    volume_range,
    last_volume,
    shelf_location,
    updated_at
  )
  values (
    p_store_id,
    v_book_id,
    case when p_last_volume is null then '확인 중' else format('1~%s권', p_last_volume) end,
    p_last_volume,
    v_clean_shelf,
    now()
  )
  on conflict (store_id, book_id) do update
  set volume_range = case when excluded.last_volume is null then excluded.volume_range else format('1~%s권', excluded.last_volume) end,
      last_volume = excluded.last_volume,
      shelf_location = excluded.shelf_location,
      updated_at = now()
  returning id into v_inventory_id;

  return v_inventory_id;
end;
$$;

-- 4. Define single canonical upsert_inventory RPC
create or replace function public.upsert_inventory(
  p_title text,
  p_author text,
  p_category text,
  p_last_volume integer,
  p_shelf_location text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_store_id uuid;
begin
  select public.current_staff_store_id() into v_store_id;
  if v_store_id is null then
    raise exception 'approved staff required';
  end if;
  return public.upsert_inventory_for_store(v_store_id, p_title, p_author, p_category, p_last_volume, p_shelf_location);
end;
$$;

grant execute on function public.upsert_inventory_for_store(uuid, text, text, text, integer, text) to authenticated;
grant execute on function public.upsert_inventory(text, text, text, integer, text) to authenticated;

-- 5. Update staff account signup RPC to support store selection
drop function if exists public.apply_for_staff_account(text, text, text);
drop function if exists public.apply_for_staff_account(text, text, text, text);

create or replace function public.apply_for_staff_account(
  p_name text,
  p_login_id text,
  p_phone_last4 text,
  p_store_slug text default 'snu'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_store_id uuid;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  select id into v_store_id from public.stores where slug = coalesce(p_store_slug, 'snu');
  if v_store_id is null then
    select id into v_store_id from public.stores where slug = 'snu';
  end if;

  insert into public.staff_accounts (
    id,
    store_id,
    name,
    login_id,
    phone_last4,
    status
  )
  values (
    auth.uid(),
    v_store_id,
    btrim(p_name),
    btrim(p_login_id),
    btrim(p_phone_last4),
    'pending'
  );
end;
$$;

grant execute on function public.apply_for_staff_account(text, text, text, text) to authenticated;
