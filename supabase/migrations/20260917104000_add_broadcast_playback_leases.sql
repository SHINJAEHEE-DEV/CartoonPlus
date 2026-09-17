create table if not exists public.broadcast_playback_leases (
  store_id uuid primary key references public.stores(id) on delete cascade,
  tab_id text not null,
  expires_at timestamptz not null
);

alter table public.broadcast_playback_leases enable row level security;

create or replace function public.claim_broadcast_playback_lease(p_store_id uuid, p_tab_id text)
returns boolean language plpgsql security definer set search_path=public as $$
declare claimed_store_id uuid;
begin
  if not public.can_manage_store(p_store_id) then
    raise exception 'store access denied';
  end if;

  insert into public.broadcast_playback_leases(store_id, tab_id, expires_at)
  values (p_store_id, p_tab_id, now() + interval '30 seconds')
  on conflict (store_id) do update
    set tab_id = excluded.tab_id, expires_at = excluded.expires_at
    where public.broadcast_playback_leases.expires_at < now()
       or public.broadcast_playback_leases.tab_id = excluded.tab_id
  returning store_id into claimed_store_id;

  return claimed_store_id is not null;
end $$;

grant execute on function public.claim_broadcast_playback_lease(uuid, text) to authenticated;
