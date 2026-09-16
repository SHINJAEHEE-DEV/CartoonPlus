-- Replace title-based MP3 scheduling with Store-owned TTS presets.
alter table public.scheduled_broadcasts
  add column if not exists broadcast_preset_id uuid references public.broadcast_presets(id) on delete cascade;

alter table public.broadcast_runs
  drop constraint if exists broadcast_runs_scheduled_broadcast_id_fkey;
alter table public.broadcast_runs
  add constraint broadcast_runs_scheduled_broadcast_id_fkey
  foreign key (scheduled_broadcast_id) references public.scheduled_broadcasts(id) on delete set null;

alter table public.scheduled_broadcasts
  drop column if exists archived_at;

insert into public.broadcast_presets (store_id, title, message_text)
select stores.id, seed.title, seed.message_text
from public.stores as stores
cross join (
  values
    ('기본', '카툰플러스를 이용해 주시는 고객님들께 안내 말씀드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등을 모두 반납해 주시고 쓰레기는 쓰레기통에 버려 주시기 바랍니다. 감사합니다.'),
    ('마감', '안내 말씀드립니다. 저희 매장 이용 시간은 11시까지입니다. 10시 50분부터 마감 준비를 하오니 사용하신 담요, 만화책, 식기 등을 모두 반납하고 자리 정돈 부탁드립니다. 감사합니다.'),
    ('만석', '현재 만석으로 자리 이동이 제한됩니다. 퇴실 시 사용하신 담요, 만화책, 식기 등을 반납하고 자리 정돈 부탁드립니다.'),
    ('소음', '모든 고객님이 편안하게 이용하실 수 있도록 큰 소리는 삼가 주시고 자리 정돈 부탁드립니다.'),
    ('신분증 검사', '잠시 후 10시부터 신분증 확인을 진행합니다. 계속 이용하실 고객님께서는 실물 신분증을 미리 준비해 주시기 바랍니다.'),
    ('음료 픽업 요청', '주문하신 음료가 카운터에 준비되어 있습니다. 카카오톡 알림을 확인해 주시기 바랍니다.')
) as seed(title, message_text)
where stores.slug = 'snu'
  and not exists (
    select 1 from public.broadcast_presets preset
    where preset.store_id = stores.id and preset.title = seed.title
  );
