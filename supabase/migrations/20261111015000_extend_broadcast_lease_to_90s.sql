-- Extend broadcast playback lease from 30 seconds to 90 seconds so it covers the entire
-- 60-second isDue(HH:mm) evaluation window and prevents a second open tab/browser from
-- stealing an expired lease 30 seconds into the same minute.

create or replace function public.claim_broadcast_playback_lease(p_store_id uuid, p_tab_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed_store_id uuid;
begin
  if not exists (select 1 from public.stores where id = p_store_id) then
    raise exception 'invalid store id';
  end if;

  insert into public.broadcast_playback_leases(store_id, tab_id, expires_at)
  values (p_store_id, p_tab_id, now() + interval '90 seconds')
  on conflict (store_id) do update
    set tab_id = excluded.tab_id, expires_at = excluded.expires_at
    where public.broadcast_playback_leases.expires_at < now()
       or public.broadcast_playback_leases.tab_id = excluded.tab_id
  returning store_id into claimed_store_id;

  return claimed_store_id is not null;
end $$;

grant execute on function public.claim_broadcast_playback_lease(uuid, text) to anon, authenticated;
