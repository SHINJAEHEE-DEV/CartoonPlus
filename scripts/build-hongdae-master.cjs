const fs = require('fs');

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"' && line[i + 1] === '"' && quoted) {
      value += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (c === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += c;
    }
  }
  values.push(value);
  return values;
}

const normalise = (v) => (v || '').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');

// 1. Load existing Master DB (SNU & Jamsil ~2,960 titles)
const masterMap = new Map();

['public/data/cleaned-inventory.csv', 'public/data/jamsil-inventory.csv'].forEach((path) => {
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf-8');
    content
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .forEach((l) => {
        const v = parseCsvLine(l);
        const title = v[0]?.trim();
        const author = v[2]?.trim();
        const genre = v[3]?.trim();
        if (title && !masterMap.has(normalise(title))) {
          masterMap.set(normalise(title), { author, genre, title });
        }
      });
  }
});

console.log(`Loaded ${masterMap.size} existing master titles from SNU & Jamsil.`);

// 2. Comprehensive Author & Genre Dictionary
const KNOWN_AUTHORS_GENRES = {
  // Sports / Martial Arts / Action
  아이실드21: { author: '이나가키 리이치로/무라타 유스케', genre: '드라마/스포츠/SF' },
  사상최강의제자켄이치: { author: '마츠에나 슌', genre: '액션/모험' },
  드림슈터: { author: '아오야마 키요시', genre: '드라마/스포츠/SF' },
  어택: { author: '오시마 츠카사', genre: '드라마/스포츠/SF' },
  총알처럼고고: { author: '나카하라 유지', genre: '드라마/스포츠/SF' },
  골프천재탄도xi: { author: '사카타 노부히로/반조우 토시히로', genre: '드라마/스포츠/SF' },
  이니셜d: { author: '시게노 슈이치', genre: '드라마/스포츠/SF' },
  오버드라이브: { author: '야스다 츠요시', genre: '드라마/스포츠/SF' },
  홀리랜드: { author: '모리 코우지', genre: '드라마/스포츠/SF' },
  고고한사람: { author: '사카모토 신이치/닛타 지로', genre: '드라마/스포츠/SF' },
  홍색히어로: { author: '타카나시 미츠바', genre: '드라마/스포츠/SF' },
  노노노노: { author: '오카모토 린', genre: '드라마/스포츠/SF' },
  해피: { author: '우라사와 나오키', genre: '드라마/스포츠/SF' },
  슈팅korea: { author: '전상영', genre: '드라마/스포츠/SF' },
  메달리스트: { author: '츠루마이카다', genre: '드라마/스포츠/SF' },
  하늘의플라타너스: { author: '나미타로/카와 산바시', genre: '드라마/스포츠/SF' },
  터프외전아버지: { author: '사루와타리 테츠야', genre: '액션/모험' },
  바키: { author: '이타가키 케이스케', genre: '액션/모험' },
  격투맨바키: { author: '이타가키 케이스케', genre: '액션/모험' },
  한마바키: { author: '이타가키 케이스케', genre: '액션/모험' },
  고교철권전터프: { author: '사루와타리 테츠야', genre: '액션/모험' },
  터프: { author: '사루와타리 테츠야', genre: '액션/모험' },
  마스라왕: { author: '모리타 마사노리', genre: '드라마/스포츠/SF' },
  비바블루스: { author: '모리타 마사노리', genre: '드라마/스포츠/SF' },
  카츠: { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  리쿠도: { author: '마츠바라 토시미츠', genre: '드라마/스포츠/SF' },
  권법소년: { author: '마츠다 류지/후지와라 요시히데', genre: '액션/모험' },

  // Mystery / Detective / Thriller
  게임x러시: { author: '쿠사나기 미즈호', genre: '스릴러/추리/호러' },
  다중인격탐정사이코: { author: '오츠카 에이지/타지마 쇼우', genre: '스릴러/추리/호러' },
  원한해결사무소: { author: '쿠리하라 쇼쇼', genre: '스릴러/추리/호러' },
  명탐정코난: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난제로의일상: { author: '아라이 타카히로/아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난제로의집행인: { author: '아베 유타카/마루 지로', genre: '스릴러/추리/호러' },
  소년탐정김전일: { author: '아마기 세이마루/사토 후미야', genre: '스릴러/추리/호러' },
  소년탐정김전일season2: { author: '아마기 세이마루/사토 후미야', genre: '스릴러/추리/호러' },
  소년탐정김전일단편집: { author: '아마기 세이마루/사토 후미야', genre: '스릴러/추리/호러' },
  김전일37세의사건부: { author: '아마기 세이마루/사토 후미야', genre: '스릴러/추리/호러' },
  명탐정코난범인한자와씨: { author: '칸바 마유코/아오야마 고쇼', genre: '일상/개그' },
  명탐정코난경찰학교셀렉션: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난시크릿아카이브괴도키드: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난fbi셀렉션: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난절체절명셀렉션: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난하이바라: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난헤이지카즈하셀렉션: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난vs검은조직의남자들: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난탐정연구소입문백과괴도키드세트: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  명탐정코난vs괴도키드: { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  호스트탐정사무소에어서오세요: { author: '이가라시 카오루', genre: '스릴러/추리/호러' },
  마술사: { author: '이치카와 준', genre: '스릴러/추리/호러' },
  거짓말풀이수사학: { author: '미야코 리츠', genre: '스릴러/추리/호러' },
  민속탐정야쿠모: { author: '카미나가 마나부/야마구치 사토시', genre: '스릴러/추리/호러' },
  명탐정키요시로사건노트: { author: '유키 미츠루', genre: '스릴러/추리/호러' },
  블랙아웃: { author: '아사키 마사시', genre: '스릴러/추리/호러' },

  // Popular Series & Spin-offs
  귀멸의칼날외전: { author: '히라노 료지/고토게 코요하루', genre: '액션/모험' },
  귀멸학원: { author: '호카미 코지/고토게 코요하루', genre: '일상/개그' },
  귀멸의칼날행복의꽃: { author: '야지마 아야/고토게 코요하루', genre: '일반도서/소설' },
  귀멸의칼날한쪽날개의나비: { author: '야지마 아야/고토게 코요하루', genre: '일반도서/소설' },
  귀멸의칼날귀살대견문록: { author: '고토게 코요하루', genre: '액션/모험' },
  괴수8호: { author: '마츠모토 나오야', genre: '액션/모험' },
  괴수8호b: { author: '마츠모토 나오야/키즈카 케이지', genre: '액션/모험' },
  괴수8호relax: { author: '와타나베 키즈쿠', genre: '일상/개그' },
  블루록: { author: '카네시로 무네유키/노무라 유스케', genre: '드라마/스포츠/SF' },
  블루록episode나기: { author: '카네시로 무네유키/산노미야 코타', genre: '드라마/스포츠/SF' },
  약사의혼잣말: { author: '네코쿠라게/휴우가 나츠', genre: '드라마/스포츠/SF' },
  반딧불이의혼례: { author: '타치바나 오레코', genre: '로맨스/로판' },
  극락가: { author: '사노 유토', genre: '액션/모험' },
  주술회전: { author: '아쿠타미 게게', genre: '액션/모험' },
  디그레이맨: { author: '호시노 카츠라', genre: '판타지/무협' },
  약속의네버랜드: { author: '시라이 카이우/데미즈 포스카', genre: '스릴러/추리/호러' },
  카케구루이: { author: '카와모토 호무라/나오무라 토오루', genre: '스릴러/추리/호러' },
  디스트로이x레볼루션: { author: '모리 코우지', genre: '액션/모험' },
  세상이가르쳐준비밀: { author: '하카마다 사키', genre: '스릴러/추리/호러' },
  갱스타: { author: '코스케', genre: '액션/모험' },
  야쿠자의덕질: { author: '타츠미', genre: '일상/개그' },
  강호패도기: { author: '오치아이 유스케', genre: '판타지/무협' },
  위치헌터: { author: '조정만', genre: '판타지/무협' },
  팬텀버스터즈: { author: '네오 쇼코', genre: '액션/모험' },
  도쿄리벤저스바지케이스케로부터의편지: {
    author: '나츠카와 유키노리/와쿠이 켄',
    genre: '액션/모험',
  },
  '3월의라이온': { author: '우미노 치카', genre: '드라마/스포츠/SF' },
  '4월의너스피카': { author: '스기야마 미와코', genre: '로맨스/로판' },
  헤이세이폴리스맨: { author: '이나바 미노루', genre: '일상/개그' },
  '100억의사나이': { author: '쿠니토모 야스유키', genre: '드라마/스포츠/SF' },
  란마12: { author: '타카하시 루미코', genre: '일상/개그' },
  스위치: { author: '나미키 사키', genre: '스릴러/추리/호러' },
  w네임: { author: '타카하시 유키', genre: '로맨스/로판' },
};

// 3. Raw Genre mapping to Standard 11 Categories
const GENRE_MAPPING = {
  스포츠: '드라마/스포츠/SF',
  격투: '액션/모험',
  추리: '스릴러/추리/호러',
  스릴러: '스릴러/추리/호러',
  '공포/호러': '스릴러/추리/호러',
  국내순정: '로맨스/로판',
  일본순정: '로맨스/로판',
  '일본 순정': '로맨스/로판',
  해외순정: '로맨스/로판',
  로맨스: '로맨스/로판',
  '로맨스 코미디': '로맨스/로판',
  로맨스코미디: '로맨스/로판',
  판타지: '판타지/무협',
  소년만화: '액션/모험',
  '남성향 만화': '액션/모험',
  요리: '일상/개그',
  코미디: '일상/개그',
  일상: '일상/개그',
  웹툰: '웹툰',
  유아도서: '코믹스/그래픽노블',
  그래픽노블: '코믹스/그래픽노블',
  신간도서: '코믹스/그래픽노블',
  인기도서: '코믹스/그래픽노블',
  성인: '성인',
  학원: '드라마/스포츠/SF',
  드라마: '드라마/스포츠/SF',
  '회사/도박': '드라마/스포츠/SF',
  의료: '드라마/스포츠/SF',
  시대극: '드라마/스포츠/SF',
  예술: '드라마/스포츠/SF',
  외국서적: '일반도서/소설',
};

// 4. Parse Hongdae CSV
const hongdaeCsv = fs.readFileSync('docs/assets/hongdaebook_2026-Sep-21_1711.csv', 'utf-8');
const [hHeader, ...hLines] = hongdaeCsv.trim().split(/\r?\n/);

function splitTitles(text) {
  const parts = text.split(/\s*\/\/\s*/);
  const result = [];
  parts.forEach((p) => {
    const subParts = p.split(/\s+\/\s+|(?<=\d)\s*\/(?=\s*[^\d\s])/u);
    subParts.forEach((sp) => {
      const trimmed = sp.trim();
      if (trimmed) result.push(trimmed);
    });
  });
  return result;
}

const map = new Map();

hLines.forEach((line) => {
  const [titlesRaw, shelfRaw, genreRaw] = parseCsvLine(line);
  if (!titlesRaw || !shelfRaw) return;
  const shelfNumber = shelfRaw.trim();
  const shelf = `책장 ${shelfNumber}번`;
  const rawGenre = (genreRaw || '').trim();

  const rawList = splitTitles(titlesRaw);
  rawList.forEach((raw) => {
    let t = raw.trim().replace(/\.$/, '').trim();
    if (!t) return;

    let title = t;
    let lastVolume = null;
    let volumeRange = '보유';

    // Normalize special titles
    if (t.toLowerCase() === 'ranma1/2') {
      title = '란마 1/2';
    } else if (t.startsWith('스위치 1/2')) {
      title = '스위치 1/2';
    } else {
      // Check attached digits like '3월의 라이온.18' or '바키31' or 'title 12'
      const dotMatch = /^(.*\S)\.(\d+)$/u.exec(t);
      if (dotMatch) {
        title = dotMatch[1].trim();
        lastVolume = parseInt(dotMatch[2], 10);
        volumeRange = `1~${lastVolume}권`;
      } else {
        const spaceMatch = /^(.*\S)\s+(\d+)$/u.exec(t);
        if (spaceMatch) {
          title = spaceMatch[1].trim();
          lastVolume = parseInt(spaceMatch[2], 10);
          volumeRange = `1~${lastVolume}권`;
        } else {
          const attachedMatch = /^(바키|w네임|도쿄 리벤저스 ~바지 케이스케로부터의 편지)(\d+)$/u.exec(
            t
          );
          if (attachedMatch) {
            title = attachedMatch[1].trim();
            lastVolume = parseInt(attachedMatch[2], 10);
            volumeRange = `1~${lastVolume}권`;
          }
        }
      }
    }

    if (!map.has(title)) {
      map.set(title, { title, lastVolume, volumeRange, shelf, shelfNumber, rawGenre });
    } else {
      const existing = map.get(title);
      if (lastVolume && (!existing.lastVolume || lastVolume > existing.lastVolume)) {
        existing.lastVolume = lastVolume;
        existing.volumeRange = volumeRange;
      }
      if (!existing.rawGenre && rawGenre) existing.rawGenre = rawGenre;
    }
  });
});

console.log(`Extracted ${map.size} unique books for Hongdae store.`);

// 5. Enrich Author & Genre
const enrichedList = [];

for (const item of map.values()) {
  const normTitle = normalise(item.title);
  let author = '';
  let genre = '';

  // 1) Match from master map (SNU + Jamsil)
  if (masterMap.has(normTitle)) {
    const m = masterMap.get(normTitle);
    author = m.author || '';
    genre = m.genre || '';
  }

  // 2) Match from KNOWN dictionary
  if (!author && KNOWN_AUTHORS_GENRES[normTitle]) {
    const k = KNOWN_AUTHORS_GENRES[normTitle];
    author = k.author || '';
    if (!genre) genre = k.genre || '';
  }

  // 3) Partial match in dictionary
  if (!author) {
    for (const [key, val] of Object.entries(KNOWN_AUTHORS_GENRES)) {
      if (normTitle.includes(key) || key.includes(normTitle)) {
        author = val.author;
        if (!genre) genre = val.genre;
        break;
      }
    }
  }

  // 4) Map rawGenre to standard genre if not determined
  if (!genre && item.rawGenre && GENRE_MAPPING[item.rawGenre]) {
    genre = GENRE_MAPPING[item.rawGenre];
  }

  // 5) Fallback genre
  if (!genre) {
    genre = '코믹스/그래픽노블';
  }

  // 6) Fallback author
  if (!author) {
    if (genre === '웹툰') author = '웹툰 작가';
    else author = '미상';
  }

  enrichedList.push({
    title: item.title,
    author,
    genre,
    volumeRange: item.volumeRange,
    lastVolume: item.lastVolume,
    shelf: item.shelf,
    shelfNumber: item.shelfNumber,
  });
}

// 6. Generate Clean CSV File (public/data/hongdae-inventory.csv & dist/data/hongdae-inventory.csv)
const csvHeader = '도서명,보유권수,작가,목표장르,기존서가';
const csvRows = enrichedList.map((item) => {
  const escapeCsv = (str) => (str.includes(',') ? `"${str.replace(/"/g, '""')}"` : str);
  return `${escapeCsv(item.title)},${escapeCsv(item.volumeRange)},${escapeCsv(item.author)},${escapeCsv(item.genre)},${escapeCsv(item.shelfNumber)}`;
});

const cleanCsvContent = [csvHeader, ...csvRows].join('\n');
fs.writeFileSync('public/data/hongdae-inventory.csv', cleanCsvContent, 'utf-8');
if (fs.existsSync('dist/data')) {
  fs.writeFileSync('dist/data/hongdae-inventory.csv', cleanCsvContent, 'utf-8');
}
console.log('Saved clean CSV to public/data/hongdae-inventory.csv');

// 7. Generate Supabase Migration SQL
const initials = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];
const getInitial = (v) =>
  [...v]
    .map((c) => {
      const code = c.charCodeAt(0);
      return code >= 0xac00 && code <= 0xd7a3 ? initials[Math.floor((code - 0xac00) / 588)] : c;
    })
    .join('');

const escapeSql = (str) => (str || '').replace(/'/g, "''");

const valuesSql = enrichedList
  .map((item) => {
    const lastVolStr = item.lastVolume !== null ? item.lastVolume : 'null';
    const normT = normalise(item.title);
    const normA = normalise(item.author);
    const initC = getInitial(normT);
    return `  ('${escapeSql(item.title)}', '${escapeSql(item.author)}', '${escapeSql(item.genre)}', '${escapeSql(normT)}', '${escapeSql(normA)}', '${escapeSql(initC)}', '${escapeSql(item.volumeRange)}', ${lastVolStr}, '${escapeSql(item.shelf)}')`;
  })
  .join(',\n');

const migrationSql = `-- Migration: Seed Hongdae store enriched book inventory (${enrichedList.length} books with Author & Genre)
-- Generated on 2026-09-22 from docs/assets/hongdaebook_2026-Sep-21_1711.csv

create temp table temp_hongdae_enriched (
  title text,
  author text,
  category text,
  normalized_title text,
  normalized_author text,
  initial_consonants text,
  volume_range text,
  last_volume integer,
  shelf_location text
) on commit drop;

insert into temp_hongdae_enriched (
  title, author, category, normalized_title, normalized_author, initial_consonants, volume_range, last_volume, shelf_location
)
values
${valuesSql};

-- 1. Insert/Update into public.books table
insert into public.books (
  title,
  author,
  category,
  normalized_title,
  normalized_author,
  initial_consonants
)
select
  t.title,
  t.author,
  t.category,
  t.normalized_title,
  t.normalized_author,
  t.initial_consonants
from temp_hongdae_enriched t
on conflict (title, author) do update set
  category = case when excluded.category <> '' then excluded.category else public.books.category end,
  normalized_title = excluded.normalized_title,
  normalized_author = excluded.normalized_author,
  initial_consonants = excluded.initial_consonants,
  archived_at = null;

-- 2. Upsert into public.book_inventories for hongdae store
insert into public.book_inventories (
  store_id,
  book_id,
  volume_range,
  last_volume,
  shelf_location,
  updated_at
)
select
  s.id as store_id,
  b.id as book_id,
  t.volume_range,
  t.last_volume,
  t.shelf_location,
  now()
from temp_hongdae_enriched t
cross join (select id from public.stores where slug = 'hongdae') s
join public.books b on b.title = t.title and b.author = t.author
on conflict (store_id, book_id) do update set
  volume_range = excluded.volume_range,
  last_volume = excluded.last_volume,
  shelf_location = excluded.shelf_location,
  updated_at = now();
`;

fs.writeFileSync(
  'supabase/migrations/20260922020000_seed_hongdae_enriched_inventory.sql',
  migrationSql,
  'utf-8'
);
console.log(
  'Saved migration to supabase/migrations/20260922020000_seed_hongdae_enriched_inventory.sql'
);
