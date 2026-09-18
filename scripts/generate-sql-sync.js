import fs from 'node:fs';

const aPartMovedTitles = [
  '26년',
  '340일간의 유예',
  '3인칭',
  '가담항설',
  '갓 오브 하이스쿨',
  '걸어서 30분',
  '견우와 선녀',
  '계룡 선녀전',
  '고래별',
  '고수',
  '고양이 엉덩이를 좋아합니다',
  '곱게 자란 자식',
  '귀전구담',
  '그녀가 공작저로 가야 했던 사정',
  '그다이',
  '그대를 사랑합니다',
  '금요일',
  '기기괴괴 시리즈',
  '김비서가 왜 그럴까',
  '나 혼자만 레벨업',
  '나빌레라',
  '나쁜 상사',
  '나의 마녀',
  '날것',
  '남과 여',
  '남사친의 법칙',
  '남자친구를 조심해',
  '남팬만화',
  '낮에 뜨는 달',
  '내 남편과 결혼해줘',
  '내 ID는 강남미인',
];

const specificUpdates = {
  '괴수8호': { shelf: '2', category: '판타지/무협' },
  '괴수 8호': { shelf: '2', category: '판타지/무협' },
  '스파이 패밀리': { shelf: '3', category: '일상/개그' },
  '옷소매 붉은 끝동': { shelf: '4', category: '웹툰' },
  '카구라바치': { shelf: '4', category: '판타지/무협' },
  '아름다운 초저녁달': { shelf: '4', category: '로맨스/로판' },
  '반딧불이의 혼례': { shelf: '4', category: '로맨스/로판' },
  '손끝과 연연': { shelf: '5', category: '로맨스/로판' },
  '타몬군 지금 어느쪽': { shelf: '5', category: '로맨스/로판' },
  '사카모토 데이즈': { shelf: '5', category: '일상/개그' },
  '주술회전': { shelf: '6', category: '액션/모험' },
  '나의 히어로 아카데미아': { shelf: '6', category: '액션/모험' },
};

let sql = `-- 1. 서울대입구역점(snu) 기준 현재까지 진행된 서가 위치(숫자 방식: 1~6) 및 권수 동기화\n\n`;
sql += `do $$\n`;
sql += `declare\n`;
sql += `  v_store_id uuid;\n`;
sql += `begin\n`;
sql += `  select id into v_store_id from public.stores where slug = 'snu' or name like '%서울대%' limit 1;\n\n`;

// 1. A Part (1번 책장) 31개 도서
sql += `  -- [A파트 웹툰 1번 책장 (31종)]\n`;
aPartMovedTitles.forEach((t) => {
  let volSql = '';
  if (t === '그대를 사랑합니다') volSql = `, volume_range = '1~2권', last_volume = 2`;
  if (t === '나 혼자만 레벨업') volSql = `, volume_range = '2~15권', last_volume = 15`;

  sql += `  update public.book_inventories bi
  set shelf_location = '1', updated_at = now()${volSql}
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '${t}' or b.title like '${t} %');\n`;
});

sql += `\n  -- [기타 서가 이동 도서 (2~6번 책장)]\n`;
Object.entries(specificUpdates).forEach(([title, data]) => {
  sql += `  update public.book_inventories bi
  set shelf_location = '${data.shelf}', updated_at = now()
  from public.books b
  where bi.book_id = b.id and bi.store_id = v_store_id and (b.title = '${title}' or b.title like '${title} %');\n`;
});

sql += `\nend $$;\n`;

fs.writeFileSync('supabase/migrations/20260918_sync_rearranged_inventory_part1.sql', sql, 'utf-8');
console.log('Successfully written supabase/migrations/20260918_sync_rearranged_inventory_part1.sql');
