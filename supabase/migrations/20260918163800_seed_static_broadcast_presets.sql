-- Seed static audio broadcast presets with accurate titles and audio URLs for all stores
insert into public.broadcast_presets (store_id, title, message_text, audio_url, source_type)
select
  stores.id,
  seed.title,
  seed.message_text,
  seed.audio_url,
  'static'
from public.stores as stores
cross join (
  values
    (
      '기본 안내',
      '카툰플러스를 이용해주시는 고객님들께 잠시 안내 말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 쓰레기는 쓰레기통에 버려주시길 바랍니다. 다시 한번 안내말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 쓰레기는 쓰레기통에 버려주시길 바랍니다. 감사합니다.',
      '/audio/broadcast/기본 안내.wav'
    ),
    (
      '11시 마감 안내',
      '카툰플러스를 이용해주시는 고객님들께 잠시 안내 말씀 드립니다. 저희 매장 이용시간은 11시까지입니다. 10시 50분부터 마감준비를 하오니 참고 부탁드립니다. 퇴실하실 때에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 사용하신 방 자리 정돈 부탁드립니다. 다시 한번 안내말씀 드립니다. 저희매장 이용시간은 11시까지입니다. 10시 50분부터 마감 준비를 하오니 참고 부탁드립니다. 퇴실하실 때에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 사용하신 방 자리 정돈 부탁드립니다. 감사합니다.',
      '/audio/broadcast/11시 마감 안내.wav'
    ),
    (
      '만석 안내',
      '카툰플러스를 이용해주시는 고객님들께 잠시 안내 말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 자리 정돈 부탁드립니다. 또한, 현재 만석이므로 자리 이동이 제한된다는 점 안내드립니다. 다시 한번 안내말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 자리 정돈 부탁드립니다. 또한, 현재 만석이므로 자리 이동이 제한된다는 점 안내드립니다. 감사합니다.',
      '/audio/broadcast/만석 안내.wav'
    ),
    (
      '소음 안내',
      '카툰플러스를 이용해주시는 고객님들께 잠시 안내 말씀 드립니다. 다른 손님분들께 방해가 되지 않도록 큰 소리로 대화하시는 것은 삼가주시길 바랍니다. 다시 한번 안내말씀 드립니다. 다른 손님분들께 방해가 되지 않도록 큰 소리로 대화하시는 것은 삼가주시길 바랍니다. 고객님들의 너른 양해 부탁드립니다. 감사합니다.',
      '/audio/broadcast/소음 안내.wav'
    ),
    (
      '신분증 검사 안내',
      '카툰플러스를 이용해주시는 고객님들께 잠시 안내 말씀 드립니다. 잠시 후 10시부터 신분증 검사를 진행할 예정이오니, 매장을 계속 이용하실 고객님들께서는 실물 신분증을 미리 준비해주시길 바랍니다. 청소년 고객님께서는 10시 이후 매장 이용이 불가능하오니, 이용에 차질 없으시길 바랍니다. 다시 한번 안내말씀 드립니다. 잠시 후 10시부터 신분증 검사를 진행할 예정이오니, 매장을 계속 이용하실 고객님들께서는 실물 신분증을 미리 준비해주시길 바랍니다. 청소년 고객님께서는 10시 이후 매장 이용이 불가능하오니, 이용에 차질 없으시길 바랍니다. 감사합니다.',
      '/audio/broadcast/신분증 검사 안내.wav'
    ),
    (
      '음료 픽업 요청 안내',
      '주문하신 음료가 카운터에 준비되어있습니다. 카카오톡 알림 확인 부탁드립니다.',
      '/audio/broadcast/음료 픽업 요청 안내.wav'
    )
) as seed(title, message_text, audio_url)
where not exists (
  select 1 from public.broadcast_presets preset
  where preset.store_id = stores.id and preset.title = seed.title
);

-- 기존 구 타이틀('기본', '마감', '만석', '소음', '신분증 검사', '음료 픽업 요청')이 있다면 audio_url과 source_type을 갱신
update public.broadcast_presets
set source_type = 'static',
    audio_url = '/audio/broadcast/' || title || '.wav'
where source_type = 'static'
  and (audio_url is null or audio_url = '');
