-- 1. Truncate existing accumulated broadcast runs
delete from public.broadcast_runs;

-- 2. Automatically delete broadcast_runs older than 7 days on each insert
create or replace function public.cleanup_old_broadcast_runs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.broadcast_runs
  where triggered_at < now() - interval '7 days';
  return null;
end;
$$;

drop trigger if exists cleanup_old_broadcast_runs_trigger on public.broadcast_runs;
create trigger cleanup_old_broadcast_runs_trigger
  after insert on public.broadcast_runs
  for each statement
  execute function public.cleanup_old_broadcast_runs();

-- 3. Enable public read access for scheduled broadcasts and presets (for unauthenticated counter playback)
drop policy if exists "public reads scheduled broadcasts" on public.scheduled_broadcasts;
create policy "public reads scheduled broadcasts"
  on public.scheduled_broadcasts
  for select
  using (true);

drop policy if exists "public reads broadcast presets" on public.broadcast_presets;
create policy "public reads broadcast presets"
  on public.broadcast_presets
  for select
  using (true);

-- 4. Enable public logging and reading for broadcast runs
drop policy if exists "public reads broadcast runs" on public.broadcast_runs;
create policy "public reads broadcast runs"
  on public.broadcast_runs
  for select
  using (true);

drop policy if exists "public inserts broadcast runs" on public.broadcast_runs;
create policy "public inserts broadcast runs"
  on public.broadcast_runs
  for insert
  with check (true);

drop policy if exists "public updates broadcast runs" on public.broadcast_runs;
create policy "public updates broadcast runs"
  on public.broadcast_runs
  for update
  using (true)
  with check (true);

-- 5. Update claim_broadcast_playback_lease to allow unauthenticated playback tabs for valid stores
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
  values (p_store_id, p_tab_id, now() + interval '30 seconds')
  on conflict (store_id) do update
    set tab_id = excluded.tab_id, expires_at = excluded.expires_at
    where public.broadcast_playback_leases.expires_at < now()
       or public.broadcast_playback_leases.tab_id = excluded.tab_id
  returning store_id into claimed_store_id;

  return claimed_store_id is not null;
end $$;

grant execute on function public.claim_broadcast_playback_lease(uuid, text) to anon, authenticated;
