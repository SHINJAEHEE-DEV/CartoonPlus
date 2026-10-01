-- Update image_url in store_events to use official mascot assets for general events

-- 1. PEACH-PIT 25주년 기념 특별전 (만화 독서 마스코트)
update public.store_events
set
  image_url = '/assets/mascot/mascot_reading.png'
where title = 'PEACH-PIT 25주년 기념 특별전 티켓 당첨 이벤트 (예정)';

-- 2. 오타메이커 보드게임 협업 (게임 마스코트)
update public.store_events
set
  image_url = '/assets/mascot/mascot_gaming.png'
where title = '오타메이커 보드게임 협업 — 플레이 & 리뷰 작성 이벤트 (예정)';

-- 3. 맘맘(MomMom) 멤버십 제휴 (휴식/힐링 마스코트)
update public.store_events
set
  image_url = '/assets/mascot/mascot_relaxing.png'
where title = '맘맘(MomMom) 멤버십 제휴 — 젤라또 & 무제한 토핑 무료';
