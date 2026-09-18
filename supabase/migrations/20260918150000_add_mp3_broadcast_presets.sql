alter table public.broadcast_presets
  alter column message_text drop not null,
  add column if not exists audio_url text,
  add column if not exists source_type text not null default 'static'
    check (source_type in ('static', 'upload')),
  add column if not exists hidden_at timestamptz;

alter table public.broadcast_presets
  drop constraint if exists broadcast_presets_audio_source_check,
  add constraint broadcast_presets_audio_source_check check (
    source_type <> 'upload'
    or (
      store_id is not null
      and nullif(btrim(audio_url), '') is not null
    )
  );

create index if not exists broadcast_presets_store_source_active_idx
  on public.broadcast_presets (store_id, source_type)
  where hidden_at is null;

create or replace function public.limit_uploaded_broadcast_presets()
returns trigger
language plpgsql
as $$
begin
  if new.source_type = 'upload' and new.hidden_at is null and (
    tg_op = 'INSERT' or old.source_type <> 'upload' or old.hidden_at is not null
  ) then
    perform pg_advisory_xact_lock(hashtextextended(new.store_id::text, 0));
    if (
      select count(*)
      from public.broadcast_presets
      where store_id = new.store_id
        and source_type = 'upload'
        and hidden_at is null
    ) >= 10 then
      raise exception '지점별 업로드 방송 프리셋은 최대 10개까지 등록할 수 있습니다.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists limit_uploaded_broadcast_presets on public.broadcast_presets;
create trigger limit_uploaded_broadcast_presets
  before insert or update of source_type, hidden_at, store_id on public.broadcast_presets
  for each row execute function public.limit_uploaded_broadcast_presets();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('broadcast-audio', 'broadcast-audio', true, 3145728, array['audio/mpeg'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "staff manages own store broadcast audio" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'broadcast-audio'
    and public.can_manage_store((storage.foldername(name))[1]::uuid)
  )
  with check (
    bucket_id = 'broadcast-audio'
    and public.can_manage_store((storage.foldername(name))[1]::uuid)
  );
