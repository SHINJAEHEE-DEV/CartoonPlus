create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id),
  category text not null,
  name text not null,
  description text,
  price integer,
  is_soldout boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;

drop policy if exists "public reads menu items" on public.menu_items;
create policy "public reads menu items" on public.menu_items
  for select using (true);

drop policy if exists "staff manages menu items" on public.menu_items;
create policy "staff manages menu items" on public.menu_items
  for all using (public.is_approved_staff()) with check (public.is_approved_staff());
