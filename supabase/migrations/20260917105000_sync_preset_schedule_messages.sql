create or replace function public.sync_preset_schedule_messages()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.message_text is distinct from old.message_text then
    update public.scheduled_broadcasts
    set message_text = new.message_text
    where broadcast_preset_id = new.id;
  end if;
  return new;
end $$;

drop trigger if exists sync_preset_schedule_messages on public.broadcast_presets;
create trigger sync_preset_schedule_messages
after update of message_text on public.broadcast_presets
for each row execute function public.sync_preset_schedule_messages();
