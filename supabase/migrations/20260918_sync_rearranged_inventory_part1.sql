-- 1. 서울대입구역점(snu) 기준 현재까지 진행된 서가 위치(숫자 방식: 1~6) 및 권수 동기화

do $$
declare
  v_store_id uuid;
begin
  select id into v_store_id from public.stores where slug = 'snu' or name like '%서울대%' limit 1;

  -- [A파트 웹툰 1번 책장 (31종)]
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '26년' or b.title like '26년 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '340일간의 유예' or b.title like '340일간의 유예 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '3인칭' or b.title like '3인칭 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '가담항설' or b.title like '가담항설 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '갓 오브 하이스쿨' or b.title like '갓 오브 하이스쿨 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '걸어서 30분' or b.title like '걸어서 30분 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '견우와 선녀' or b.title like '견우와 선녀 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '계룡 선녀전' or b.title like '계룡 선녀전 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '고래별' or b.title like '고래별 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '고수' or b.title like '고수 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '고양이 엉덩이를 좋아합니다' or b.title like '고양이 엉덩이를 좋아합니다 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '곱게 자란 자식' or b.title like '곱게 자란 자식 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '귀전구담' or b.title like '귀전구담 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '그녀가 공작저로 가야 했던 사정' or b.title like '그녀가 공작저로 가야 했던 사정 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '그다이' or b.title like '그다이 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now(), volume_range = '1~2권', last_volume = 2
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '그대를 사랑합니다' or b.title like '그대를 사랑합니다 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '금요일' or b.title like '금요일 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '기기괴괴 시리즈' or b.title like '기기괴괴 시리즈 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '김비서가 왜 그럴까' or b.title like '김비서가 왜 그럴까 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now(), volume_range = '2~15권', last_volume = 15
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '나 혼자만 레벨업' or b.title like '나 혼자만 레벨업 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '나빌레라' or b.title like '나빌레라 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '나쁜 상사' or b.title like '나쁜 상사 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '나의 마녀' or b.title like '나의 마녀 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '날것' or b.title like '날것 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '남과 여' or b.title like '남과 여 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '남사친의 법칙' or b.title like '남사친의 법칙 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '남자친구를 조심해' or b.title like '남자친구를 조심해 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '남팬만화' or b.title like '남팬만화 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '낮에 뜨는 달' or b.title like '낮에 뜨는 달 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '내 남편과 결혼해줘' or b.title like '내 남편과 결혼해줘 %');
  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '내 ID는 강남미인' or b.title like '내 ID는 강남미인 %');

  -- [기타 서가 이동 도서 (2~6번 책장)]
  update public.book_inventories bi
  set shelf_location = '2', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '괴수8호' or b.title like '괴수8호 %');
  update public.book_inventories bi
  set shelf_location = '2', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '괴수 8호' or b.title like '괴수 8호 %');
  update public.book_inventories bi
  set shelf_location = '3', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '스파이 패밀리' or b.title like '스파이 패밀리 %');
  update public.book_inventories bi
  set shelf_location = '4', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '옷소매 붉은 끝동' or b.title like '옷소매 붉은 끝동 %');
  update public.book_inventories bi
  set shelf_location = '4', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '카구라바치' or b.title like '카구라바치 %');
  update public.book_inventories bi
  set shelf_location = '4', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '아름다운 초저녁달' or b.title like '아름다운 초저녁달 %');
  update public.book_inventories bi
  set shelf_location = '4', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '반딧불이의 혼례' or b.title like '반딧불이의 혼례 %');
  update public.book_inventories bi
  set shelf_location = '5', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '손끝과 연연' or b.title like '손끝과 연연 %');
  update public.book_inventories bi
  set shelf_location = '5', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '타몬군 지금 어느쪽' or b.title like '타몬군 지금 어느쪽 %');
  update public.book_inventories bi
  set shelf_location = '5', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '사카모토 데이즈' or b.title like '사카모토 데이즈 %');
  update public.book_inventories bi
  set shelf_location = '6', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '주술회전' or b.title like '주술회전 %');
  update public.book_inventories bi
  set shelf_location = '6', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '나의 히어로 아카데미아' or b.title like '나의 히어로 아카데미아 %');

end $$;
