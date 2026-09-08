create table if not exists public.store_content (id uuid primary key default gen_random_uuid(),store_id uuid not null references public.stores(id),content_key text not null,content_value jsonb not null,updated_at timestamptz not null default now(),unique(store_id,content_key));
alter table public.store_content enable row level security;
create policy "public reads store content" on public.store_content for select using (true);
create policy "staff updates store content" on public.store_content for all using (public.is_approved_staff()) with check (public.is_approved_staff());
