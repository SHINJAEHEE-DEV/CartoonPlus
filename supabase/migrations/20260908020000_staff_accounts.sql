create table if not exists public.staff_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  store_id uuid not null references public.stores(id),
  name text not null,
  login_id text not null unique,
  phone_last4 text not null check (phone_last4 ~ '^[0-9]{4}$'),
  role text not null default 'staff' check (role in ('staff','admin')),
  status text not null default 'pending' check (status in ('pending','approved','deactivated')),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.staff_accounts enable row level security;

create or replace function public.is_approved_staff()
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from staff_accounts where id=auth.uid() and status='approved');
$$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from staff_accounts where id=auth.uid() and status='approved' and role='admin');
$$;

drop policy if exists "staff reads own account" on public.staff_accounts;
create policy "staff reads own account" on public.staff_accounts for select using (id=auth.uid() or public.is_admin());
drop policy if exists "admin updates accounts" on public.staff_accounts;
create policy "admin updates accounts" on public.staff_accounts for update using (public.is_admin()) with check (public.is_admin());

create or replace function public.apply_for_staff_account(p_name text,p_login_id text,p_phone_last4 text)
returns void language plpgsql security definer set search_path=public as $$
declare v_store uuid;
begin
 select id into v_store from stores where slug='snu';
 if auth.uid() is null then raise exception 'authentication required'; end if;
 insert into staff_accounts(id,store_id,name,login_id,phone_last4)
 values(auth.uid(),v_store,p_name,p_login_id,p_phone_last4);
end $$;
grant execute on function public.apply_for_staff_account(text,text,text) to authenticated;
grant execute on function public.is_approved_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "staff writes inventories" on public.book_inventories;
create policy "staff writes inventories" on public.book_inventories for all using (public.is_approved_staff()) with check (public.is_approved_staff());
