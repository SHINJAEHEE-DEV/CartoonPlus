-- Store Events are shared operational data. `store_slug` is nullable only for a Global Store Event.
alter table public.store_events
  add column if not exists store_slug text,
  add column if not exists tag text not null default '이벤트',
  add column if not exists target text not null default '카툰플러스 고객',
  add column if not exists banner_type text not null default 'weekday',
  add column if not exists is_always_on boolean not null default false,
  add column if not exists is_featured boolean not null default false;

update public.store_events event
set store_slug = stores.slug
from public.stores stores
where event.store_id = stores.id and event.store_slug is null;

alter table public.store_events alter column store_id drop not null;
alter table public.store_events
  add constraint store_events_store_scope_check
  check ((store_id is null and store_slug is null) or (store_id is not null and store_slug is not null)) not valid;

alter table public.store_events
  add column if not exists scope_key text generated always as (coalesce(store_slug, 'all')) stored;
create unique index if not exists store_events_scope_title_key
  on public.store_events (scope_key, title);

create or replace function public.assert_store_event_scope()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.store_id is null and new.store_slug is null then return new; end if;
  if not exists (select 1 from public.stores where id = new.store_id and slug = new.store_slug) then
    raise exception 'store event store_id and store_slug must identify the same Store';
  end if;
  return new;
end;
$$;
drop trigger if exists assert_store_event_scope on public.store_events;
create trigger assert_store_event_scope before insert or update on public.store_events
  for each row execute function public.assert_store_event_scope();

create index if not exists store_events_scope_created_at_idx
  on public.store_events (store_slug, created_at desc)
  where archived_at is null;

-- Store Event artwork is held in the existing public image_url field. Create a dedicated bucket once.
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

create policy "staff manages event images" on storage.objects
for all to authenticated
using (bucket_id = 'event-images' and public.is_approved_staff())
with check (bucket_id = 'event-images' and public.is_approved_staff());

-- A title/author correction can deliberately consolidate two inventories in the same Store.
create or replace function public.update_inventory_for_store(
  p_inventory_id uuid, p_title text, p_author text, p_category text,
  p_last_volume integer, p_shelf_location text, p_merge_duplicate boolean default false
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_store_id uuid; v_book_id uuid; v_duplicate_id uuid; v_duplicate_book_id uuid;
  v_title text := btrim(coalesce(p_title, '')); v_author text := btrim(coalesce(p_author, ''));
  v_category text := btrim(coalesce(p_category, '')); v_shelf text := btrim(coalesce(p_shelf_location, ''));
begin
  if v_title = '' then raise exception 'title cannot be empty'; end if;
  if p_last_volume is null or p_last_volume < 1 then raise exception 'last volume must be positive'; end if;
  select store_id, book_id into v_store_id, v_book_id from public.book_inventories where id = p_inventory_id for update;
  if v_store_id is null then raise exception 'inventory not found'; end if;
  if not public.can_manage_store(v_store_id) then raise exception 'store access denied'; end if;
  select inventory.id, inventory.book_id into v_duplicate_id, v_duplicate_book_id
  from public.book_inventories inventory join public.books book on book.id = inventory.book_id
  where inventory.store_id = v_store_id and inventory.id <> p_inventory_id and book.title = v_title and book.author = v_author
  limit 1 for update;
  if v_duplicate_id is not null and not p_merge_duplicate then raise exception 'duplicate inventory exists for this store'; end if;
  if v_duplicate_id is not null then
    update public.books set category = case when v_category = '' then category else v_category end where id = v_duplicate_book_id;
    update public.book_inventories set volume_range = format('1~%s권', p_last_volume), last_volume = p_last_volume,
      shelf_location = v_shelf, note = coalesce(note, ''), updated_at = now() where id = v_duplicate_id;
    delete from public.book_inventories where id = p_inventory_id;
    return v_duplicate_id;
  end if;
  update public.books set title = v_title, author = v_author,
    category = case when v_category = '' then category else v_category end,
    normalized_title = lower(regexp_replace(v_title, '[[:space:][:punct:]]', '', 'g')),
    normalized_author = lower(regexp_replace(v_author, '[[:space:][:punct:]]', '', 'g')) where id = v_book_id;
  update public.book_inventories set volume_range = format('1~%s권', p_last_volume), last_volume = p_last_volume,
    shelf_location = v_shelf, updated_at = now() where id = p_inventory_id;
  return p_inventory_id;
end;
$$;
