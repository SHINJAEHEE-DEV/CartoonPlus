create extension if not exists pgcrypto;

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null default '',
  category text not null default '',
  normalized_title text not null,
  normalized_author text not null,
  initial_consonants text not null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  unique (title, author)
);

create table if not exists public.book_inventories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id),
  book_id uuid not null references public.books(id),
  volume_range text not null,
  shelf_location text,
  first_registered_at timestamptz not null default now(),
  archived_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (store_id, book_id)
);

create index if not exists book_inventories_public_catalogue_index
  on public.book_inventories (store_id) where archived_at is null;

alter table public.stores enable row level security;
alter table public.books enable row level security;
alter table public.book_inventories enable row level security;

drop policy if exists "public can read launch store" on public.stores;
create policy "public can read launch store" on public.stores for select using (slug = 'snu');

drop policy if exists "public can read active books" on public.books;
create policy "public can read active books" on public.books for select using (archived_at is null);

drop policy if exists "public can read active SNU inventory" on public.book_inventories;
create policy "public can read active SNU inventory" on public.book_inventories for select using (
  archived_at is null and exists (
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
where inventories.archived_at is null and books.archived_at is null;
