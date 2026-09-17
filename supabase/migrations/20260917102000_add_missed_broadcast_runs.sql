alter table public.broadcast_runs
  drop constraint if exists broadcast_runs_status_check;

alter table public.broadcast_runs
  add constraint broadcast_runs_status_check
  check (status in ('pending', 'success', 'failure', 'missed'));
