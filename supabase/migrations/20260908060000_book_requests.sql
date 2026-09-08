create table if not exists public.book_requests (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.stores(id), title text not null, author text, desired_volume text, customer_comment text, status text not null default 'received' check(status in ('received','ordered','completed','unavailable')), staff_note text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.book_requests enable row level security;
create policy "public submits book requests" on public.book_requests for insert with check (title <> '');
create policy "approved staff manages book requests" on public.book_requests for all using (public.is_approved_staff()) with check (public.is_approved_staff());
