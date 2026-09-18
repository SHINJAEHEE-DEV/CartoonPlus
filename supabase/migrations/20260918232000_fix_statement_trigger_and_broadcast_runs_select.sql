-- 1. Fix cleanup_old_broadcast_runs trigger function to return NULL for statement triggers
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

-- 2. Allow public to read broadcast_runs so insert().select('id') succeeds
drop policy if exists "public reads broadcast runs" on public.broadcast_runs;
create policy "public reads broadcast runs"
  on public.broadcast_runs
  for select
  using (true);
