-- Old archived games and events were only recoverable through staff tools.
-- Delete them before the UI switches to permanent deletion.
delete from public.entertainment_items where archived_at is not null;
delete from public.store_events where archived_at is not null;
