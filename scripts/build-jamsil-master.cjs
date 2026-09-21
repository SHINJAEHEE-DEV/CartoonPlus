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

// 1. Load existing SNU master data (~605 titles)
const snuCleaned = fs.readFileSync('public/data/cleaned-inventory.csv', 'utf-8');
const [snuHeader, ...snuLines] = snuCleaned.trim().split(/\r?\n/);
const masterMap = new Map();
snuLines.forEach((l) => {
  const v = parseCsvLine(l);
  const title = v[0]?.trim();
  const author = v[2]?.trim();
  const genre = v[3]?.trim();
  if (title) {
    masterMap.set(normalise(title), { author, genre, title });
  }
});

// 2. Comprehensive Author & Genre Dictionary
const KNOWN_AUTHORS_GENRES = {
  '그녀도여친': { author: '히로유키', genre: '일상/개그' },
  '마토메그로기헤븐': { author: '미타 타카오', genre: '일상/개그' },
  '이리와': { author: '쿠메타 코지', genre: '일상/개그' },
  '앗군과그녀': { author: '카키츠바타 와카', genre: '로맨스/로판' },
  '크라운': { author: '와다 신지', genre: '액션/모험' },
  '월화국기의전': { author: '마츠모토 테마리', genre: '판타지/무협' },
  '고래의아이들은모래위에서노래한다': { author: '우메다 아비', genre: '판타지/무협' },
  '하나마루유치원': { author: '유토', genre: '일상/개그' },
  '부엉이와밤의왕': { author: '코교쿠 이즈키', genre: '판타지/무협' },
  '텐초안돼': { author: '이치카와 킨', genre: '일상/개그' },
  '불가사의한소년': { author: '야마시타 토모코', genre: '드라마/스포츠/SF' },
  '모노크로소년소녀': { author: '후쿠야마 료코', genre: '로맨스/로판' },
  '복면노이즈': { author: '후쿠야마 료코', genre: '로맨스/로판' },
  '텐도가이야기': { author: '사이토 치호', genre: '로맨스/로판' },
  '댄싱폴리스맨': { author: '후지사와 토오루', genre: '일상/개그' },
  '오늘부터마가붙는자유업': { author: '타카바야시 토모', genre: '판타지/무협' },
  '괴력란신쿠완': { author: '타카하시 츠토무', genre: '액션/모험' },
  '가부쿠몬': { author: '타카하시 츠토무', genre: '액션/모험' },
  '큐피': { author: '타카하시 히로시', genre: '액션/모험' },
  '추남진성파이터': { author: '하야시자키 후미히로', genre: '액션/모험' },
  '해피엔드': { author: '아리마 타카시', genre: '스릴러/추리/호러' },
  '고성소의슈베스터': { author: '야하라 히로시', genre: '스릴러/추리/호러' },
  '레드가든': { author: '곤조', genre: '스릴러/추리/호러' },
  'dogs': { author: '미와 시로', genre: '액션/모험' },
  '베르세르크': { author: '미우라 켄타로', genre: '판타지/무협' },
  '종말의세라프': { author: '카가미 타카야/야마모토 야마토', genre: '판타지/무협' },
  '약사의혼잣말소설': { author: '휴우가 나츠', genre: '일반도서/소설' },
  '약사의혼잣말만화': { author: '네코쿠라게/휴우가 나츠', genre: '드라마/스포츠/SF' },
  '약사의혼잣말': { author: '네코쿠라게/휴우가 나츠', genre: '드라마/스포츠/SF' },
  '카미츄': { author: '베사메무초', genre: '일상/개그' },
  '천재유교수의생활': { author: '야마시타 카즈미', genre: '드라마/스포츠/SF' },
  '뼈드래곤의귀한딸': { author: '유키지', genre: '판타지/무협' },
  '간츠': { author: '오쿠 히로야', genre: '드라마/스포츠/SF' },
  '바키': { author: '이타가키 케이스케', genre: '액션/모험' },
  '야왕': { author: '쿠라시나 료/이노우에 노리요시', genre: '드라마/스포츠/SF' },
  '강호패도기': { author: '오치아이 유스케', genre: '판타지/무협' },
  '창천의권': { author: '하라 테츠오/부론손', genre: '액션/모험' },
  '마법총술사쿠로히메': { author: '카타쿠라 마사노리', genre: '판타지/무협' },
  '격투미신무룡': { author: '모리타 마사노리', genre: '액션/모험' },
  '거기서일하는무스부씨': { author: '모리 타이시', genre: '로맨스/로판' },
  '굿바이미니스커트': { author: '마키노 아오이', genre: '드라마/스포츠/SF' },
  '몽몽모노노케': { author: '쿠로다 에이지', genre: '판타지/무협' },
  '우루시하사라라는사랑따위하지않아': { author: 'Piroshiki', genre: '로맨스/로판' },
  '층계참에스커트가울린다': { author: '아마노 슌타', genre: '로맨스/로판' },
  '운명의사람을만나는이야기': { author: '아나시로', genre: '로맨스/로판' },
  '1년에1만엔으로수명을팔았다': { author: '미아키 스가루', genre: '드라마/스포츠/SF' },
  '아저씨는귀여운것을좋아해': { author: '츠토무', genre: '일상/개그' },
  '뉴노멀': { author: '아이하라 아카네', genre: '드라마/스포츠/SF' },
  '네가죽을때까지사랑하고싶어': { author: '아오노 나치', genre: 'BL/GL' },
  '에비가와초요괴카페': { author: '스즈키 아리코', genre: '판타지/무협' },
  '오늘부터시작하는소꿉친구': { author: '오비야 켄', genre: '로맨스/로판' },
  '오버로드': { author: '마루야마 쿠가네', genre: '판타지/무협' },
  '오버로드공식코믹아라카르트': { author: '엔터브레인', genre: '판타지/무협' },
  '매리지그레이': { author: '와다 토모히로', genre: '로맨스/로판' },
  '가라오케가자': { author: '와야마 야마', genre: '일상/개그' },
  '패밀리레스토랑가자상하': { author: '와야마 야마', genre: '일상/개그' },
  '먼작귀': { author: '나가노', genre: '일상/개그' },
  '여학교의별': { author: '와야마 야마', genre: '일상/개그' },
  '키리오팬클럽': { author: '치카', genre: '일상/개그' },
  '보이는여고생': { author: '이즈미 토모키', genre: '스릴러/추리/호러' },
  '괴이소녀와행방불명': { author: '누지마', genre: '스릴러/추리/호러' },
  '히카루가죽은여름': { author: '모쿠모쿠렌', genre: '스릴러/추리/호러' },
  '마슐': { author: '코모토 하지메', genre: '액션/모험' },
  '보석의나라': { author: '이치카와 하루코', genre: '판타지/무협' },
  '위치워치': { author: '시노하라 켄타', genre: '판타지/무협' },
  '푸른상자': { author: '미우라 코우지', genre: '로맨스/로판' },
  '타몬군지금어느쪽': { author: '시와스 유키', genre: '로맨스/로판' },
  '그비스크돌은사랑을한다': { author: '후쿠다 신이치', genre: '로맨스/로판' },
  '사쿠라사쿠': { author: '사키사카 이오', genre: '로맨스/로판' },
  '봄의폭풍과몬스터': { author: '미츠바치 미유키', genre: '로맨스/로판' },
  '반딧불이의혼례': { author: '타치바나 오레코', genre: '로맨스/로판' },
  '스킵과로퍼': { author: '타카마츠 미사키', genre: '일상/개그' },
  '사이키쿠스오의재난': { author: '아소 슈이치', genre: '일상/개그' },
  '사카모토입니다만': { author: '사노 나미', genre: '일상/개그' },
  '문호스트레이독스': { author: '아사기리 카프카/하루카와 35', genre: '액션/모험' },
  '나의히어로아카데미아': { author: '호리코시 코헤이', genre: '액션/모험' },
  '비질랜티': { author: '후루하시 히데유키/벳텐 코트', genre: '액션/모험' },
  '가치아쿠타': { author: '우라나 케이', genre: '액션/모험' },
  '파이어펀치': { author: '후지모토 타츠키', genre: '액션/모험' },
  '황천의츠가이': { author: '아라카와 히로무', genre: '판타지/무협' },
  '강철의연금술사': { author: '아라카와 히로무', genre: '판타지/무협' },
  '사이코메트리': { author: '안도 유지', genre: '스릴러/추리/호러' },
  '블루록': { author: '카네시로 무네유키/노무라 유스케', genre: '드라마/스포츠/SF' },
  '블루록에피소드나기': { author: '카네시로 무네유키', genre: '드라마/스포츠/SF' },
  '도쿄에일리언즈': { author: 'NAOE', genre: '액션/모험' },
  '극락가': { author: '사노 유토', genre: '액션/모험' },
  '팬텀버스터즈': { author: '네오 쇼코', genre: '액션/모험' },
  '카구라바치': { author: '호카조노 타케루', genre: '판타지/무협' },
  '약속의네버랜드': { author: '시라이 카이우/데미즈 포스카', genre: '스릴러/추리/호러' },
  '스파이패밀리': { author: '엔도 타츠야', genre: '일상/개그' },
  '디그잇': { author: '무츠미 쇼타로', genre: '드라마/스포츠/SF' },
  '헌터x헌터': { author: '토가시 요시히로', genre: '액션/모험' },
  '도쿄리벤저스': { author: '와쿠이 켄', genre: '액션/모험' },
  '도쿄구울': { author: '이시다 스이', genre: '액션/모험' },
  '도쿄구울re': { author: '이시다 스이', genre: '액션/모험' },
  '지옥락': { author: '카쿠 유지', genre: '액션/모험' },
  '아인': { author: '사쿠라이 가몬', genre: '스릴러/추리/호러' },
  '주술회전': { author: '아쿠타미 게게', genre: '액션/모험' },
  '진격의거인': { author: '이사야마 하지메', genre: '액션/모험' },
  '괴물사변': { author: '아이모토 쇼', genre: '판타지/무협' },
  '최애의아이': { author: '아카사카 아카/멘고 요코야리', genre: '드라마/스포츠/SF' },
  '괴수8호': { author: '마츠모토 나오야', genre: '액션/모험' },
  '귀멸의칼날': { author: '고토게 코요하루', genre: '액션/모험' },
  '귀멸학원': { author: '호카미 코지', genre: '일상/개그' },
  '지박소년하나코군': { author: '아이다이로', genre: '판타지/무협' },
  '사카모토데이즈': { author: '스즈키 유토', genre: '액션/모험' },
  '원피스': { author: '오다 에이치로', genre: '액션/모험' },
  '나루토': { author: '키시모토 마사시', genre: '액션/모험' },
  '블리치': { author: '쿠보 타이토', genre: '액션/모험' },
  '체인소맨': { author: '후지모토 타츠키', genre: '액션/모험' },
  '명탐정코난': { author: '아오야마 고쇼', genre: '스릴러/추리/호러' },
  '하이큐': { author: '후루다테 하루이치', genre: '드라마/스포츠/SF' },
  '슬램덩크': { author: '이노우에 다케히코', genre: '드라마/스포츠/SF' },
  '단다단': { author: '류 유키노부', genre: '액션/모험' },
  '너에게닿기를': { author: '시이나 카루호', genre: '로맨스/로판' },
  '원펀맨': { author: 'ONE/무라타 유스케', genre: '액션/모험' },
  '은혼': { author: '소라치 히데아키', genre: '일상/개그' },
  '데스노트': { author: '오바 츠구미/오바타 타케시', genre: '스릴러/추리/호러' },
  '블랙클로버': { author: '타바타 유키', genre: '판타지/무협' },
  '닥터스톤': { author: '이나가키 리이치로/Boichi', genre: '드라마/스포츠/SF' },
  '월간순정노자키군': { author: '츠바키 이즈미', genre: '일상/개그' },
  '바쿠만': { author: '오바 츠구미/오바타 타케시', genre: '드라마/스포츠/SF' },
  '암살교실': { author: '마츠이 유세이', genre: '액션/모험' },
  '겁쟁이페달': { author: '와타나베 와타루', genre: '드라마/스포츠/SF' },
  '일곱개의대죄': { author: '스즈키 나카바', genre: '판타지/무협' },
  '페어리테일': { author: '마시마 히로', genre: '판타지/무협' },
  '소울이터': { author: '오쿠보 아츠시', genre: '액션/모험' },
  '불꽃소방대': { author: '오쿠보 아츠시', genre: '액션/모험' },
  '킹덤': { author: '하라 야스히사', genre: '판타지/무협' },
  '테니스의왕자': { author: '코노미 타케시', genre: '드라마/스포츠/SF' },
  '신테니스의왕자': { author: '코노미 타케시', genre: '드라마/스포츠/SF' },
  '쿠로코의농구': { author: '후지마키 타다토시', genre: '드라마/스포츠/SF' },
  '다이아몬드a': { author: '테라지마 유지', genre: '드라마/스포츠/SF' },
  '골든카무이': { author: '노다 사토루', genre: '액션/모험' },
  '장송의프리렌': { author: '야마다 카네히토/아베 츠카사', genre: '판타지/무협' },
  '던전밥': { author: '쿠이 료코', genre: '판타지/무협' },
  '윈드브레이커': { author: '니이 사토루', genre: '액션/모험' },
  '샹그릴라프론티어': { author: '카타리나/후지 료스케', genre: '판타지/무협' },
  '무직전생': { author: '리후진 나 마고노테', genre: '판타지/무협' },
  '전생했더니슬라임이었던건에대하여': { author: '후세/카와카미 타이키', genre: '판타지/무협' },
  '방패용사성공담': { author: '아네코 유사기', genre: '판타지/무협' },
  '오등분의신부': { author: '하루바 네기', genre: '로맨스/로판' },
  '카구야님은고백받고싶어': { author: '아카사카 아카', genre: '로맨스/로판' },
  '호리미야': { author: 'HERO/하기와라 다이스케', genre: '로맨스/로판' },
  '아오하라이드': { author: '사키사카 이오', genre: '로맨스/로판' },
  '스트롭에지': { author: '사키사카 이오', genre: '로맨스/로판' },
  '사랑하고사랑받고차고차이고': { author: '사키사카 이오', genre: '로맨스/로판' },
  '옆자리괴물군': { author: '로비코', genre: '로맨스/로판' },
  '늑대소녀와흑왕자': { author: '하타 아유코', genre: '로맨스/로판' },
  '회장님은메이드사마': { author: '후지와라 히로', genre: '로맨스/로판' },
  '오늘부터신령님': { author: '스즈키 줄리에타', genre: '로맨스/로판' },
  '새벽의연화': { author: '쿠사나기 미즈호', genre: '로맨스/로판' },
  '빨강머리백설공주': { author: '아키즈키 소라타', genre: '로맨스/로판' },
  '나츠메우인장': { author: '미도리카와 유키', genre: '판타지/무협' },
  '충사': { author: '우루시바라 유키', genre: '판타지/무협' },
  '치하야후루': { author: '스에츠구 유키', genre: '드라마/스포츠/SF' },
  '바라카몬': { author: '요시노 사츠키', genre: '일상/개그' },
  '요츠바랑': { author: '아즈마 키요히코', genre: '일상/개그' },
  '아즈망가대왕': { author: '아즈마 키요히코', genre: '일상/개그' },
  '이토준지컬렉션': { author: '이토 준지', genre: '스릴러/추리/호러' },
  '소용돌이': { author: '이토 준지', genre: '스릴러/추리/호러' },
  '토미에': { author: '이토 준지', genre: '스릴러/추리/호러' },
  '공포박물관': { author: '이토 준지', genre: '스릴러/추리/호러' },
  '20세기소년': { author: '우라사와 나오키', genre: '스릴러/추리/호러' },
  '몬스터': { author: '우라사와 나오키', genre: '스릴러/추리/호러' },
  '플루토': { author: '우라사와 나오키', genre: '드라마/스포츠/SF' },
  '빌리배트': { author: '우라사와 나오키', genre: '스릴러/추리/호러' },
  '마스터키튼': { author: '우라사와 나오키', genre: '드라마/스포츠/SF' },
  '야와라': { author: '우라사와 나오키', genre: '드라마/스포츠/SF' },
  'h2': { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  '터치': { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  '러프': { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  '크로스게임': { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  '믹스': { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  '란마12': { author: '타카하시 루미코', genre: '일상/개그' },
  '이누야샤': { author: '타카하시 루미코', genre: '판타지/무협' },
  '메종일각': { author: '타카하시 루미코', genre: '로맨스/로판' },
  '우루세이야츠라': { author: '타카하시 루미코', genre: '일상/개그' },
  '경계의린네': { author: '타카하시 루미코', genre: '판타지/무협' },
  '카드캡터체리': { author: 'CLAMP', genre: '판타지/무협' },
  'xxx홀릭': { author: 'CLAMP', genre: '판타지/무협' },
  '츠바사': { author: 'CLAMP', genre: '판타지/무협' },
  '코드기어스': { author: '마지코', genre: '드라마/스포츠/SF' },
  '블랙잭': { author: '데즈카 오사무', genre: '드라마/스포츠/SF' },
  '아톰': { author: '데즈카 오사무', genre: '드라마/스포츠/SF' },
  '불새': { author: '데즈카 오사무', genre: '드라마/스포츠/SF' }
};

// 3. Shelf-to-genre prior defaults
const SHELF_GENRE_PRIORS = {
  1: '로맨스/로판',
  2: '판타지/무협',
  3: '액션/모험',
  4: '로맨스/로판',
  5: '일상/개그',
  6: '액션/모험',
  7: '액션/모험',
  8: '액션/모험',
  9: '로맨스/로판',
  10: '로맨스/로판',
  11: '로맨스/로판',
  12: '로맨스/로판',
  13: '로맨스/로판',
  14: '액션/모험',
  15: '로맨스/로판',
  18: '웹툰',
  19: '웹툰',
  20: '웹툰',
  21: '웹툰',
  22: '웹툰',
  23: '일상/개그',
  24: '일상/개그',
  25: '로맨스/로판',
  26: '로맨스/로판',
  27: '로맨스/로판',
  28: '로맨스/로판',
  29: '일상/개그',
  30: '액션/모험',
  31: '액션/모험',
  32: '로맨스/로판',
  33: '판타지/무협',
  34: '일상/개그',
  35: '액션/모험',
  36: '액션/모험',
  37: '드라마/스포츠/SF',
  38: '로맨스/로판',
  39: '로맨스/로판',
  40: '로맨스/로판',
  41: '로맨스/로판',
  42: '로맨스/로판',
  43: '로맨스/로판',
  44: '스릴러/추리/호러',
  45: '액션/모험',
  46: '판타지/무협',
  47: '로맨스/로판',
  48: '로맨스/로판',
  49: '스릴러/추리/호러',
  50: '코믹스/그래픽노블',
  51: '일상/개그',
  52: '로맨스/로판',
  53: '드라마/스포츠/SF',
  54: '드라마/스포츠/SF',
  55: '드라마/스포츠/SF',
  56: '드라마/스포츠/SF',
  57: '판타지/무협',
  58: '드라마/스포츠/SF',
  59: '로맨스/로판',
  60: '로맨스/로판',
  61: '판타지/무협',
  62: '판타지/무협',
  63: '액션/모험',
  64: '드라마/스포츠/SF',
  65: '스릴러/추리/호러',
  66: '스릴러/추리/호러',
  67: '스릴러/추리/호러',
  68: '액션/모험',
  69: '로맨스/로판',
  70: '판타지/무협',
  71: '판타지/무협',
  72: '판타지/무협',
  74: '로맨스/로판',
  75: '판타지/무협',
  76: '판타지/무협',
  77: '판타지/무협'
};

// 4. Parse the new Jamsil CSV
const csvNew = fs.readFileSync(
  'docs/assets/jamsilbook_2026-Sep-21_0421/jamsilbook_2026-Sep-21_0421.csv',
  'utf-8'
);
const [headerNew, ...linesNew] = csvNew.trim().split(/\r?\n/);

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

linesNew.forEach((line) => {
  const [shelfRaw, titlesRaw] = parseCsvLine(line);
  if (!titlesRaw) return;
  const shelfNumber = shelfRaw.trim();
  const shelf = `책장 ${shelfNumber}번`;
  const rawList = splitTitles(titlesRaw);
  rawList.forEach((raw) => {
    let t = raw.trim().replace(/\.$/, '').trim();
    if (!t) return;

    let title = t;
    let lastVolume = null;
    let volumeRange = '보유';

    if (t === '약사의 혼잣말 14 (소설)') {
      title = '약사의 혼잣말 (소설)';
      lastVolume = 14;
      volumeRange = '1~14권';
    } else if (t === '약사의 혼잣말 18 (만화)') {
      title = '약사의 혼잣말 (만화)';
      lastVolume = 18;
      volumeRange = '1~18권';
    } else {
      const match = /^(.*\S)\s+(\d+)$/u.exec(t);
      if (match) {
        title = match[1];
        lastVolume = parseInt(match[2], 10);
        volumeRange = `1~${lastVolume}권`;
      }
    }

    if (!map.has(title)) {
      map.set(title, { title, lastVolume, volumeRange, shelf, shelfNumber });
    } else {
      const existing = map.get(title);
      if (lastVolume && (!existing.lastVolume || lastVolume > existing.lastVolume)) {
        existing.lastVolume = lastVolume;
        existing.volumeRange = volumeRange;
      }
    }
  });
});

console.log(`Extracted ${map.size} unique books.`);

// 5. Enrich Author & Genre
const enrichedList = [];

for (const item of map.values()) {
  const normTitle = normalise(item.title);
  let author = '';
  let genre = '';

  // Check master map
  if (masterMap.has(normTitle)) {
    const m = masterMap.get(normTitle);
    author = m.author || '';
    genre = m.genre || '';
  } else if (KNOWN_AUTHORS_GENRES[normTitle]) {
    const k = KNOWN_AUTHORS_GENRES[normTitle];
    author = k.author || '';
    genre = k.genre || '';
  } else {
    // Check partial dictionary
    for (const [key, val] of Object.entries(KNOWN_AUTHORS_GENRES)) {
      if (normTitle.includes(key) || key.includes(normTitle)) {
        author = val.author;
        genre = val.genre;
        break;
      }
    }
  }

  // Fallback genre from shelf prior if genre not yet set
  if (!genre) {
    genre = SHELF_GENRE_PRIORS[item.shelfNumber] || '코믹스/그래픽노블';
  }

  // Fallback author if empty
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

// 6. Generate Clean CSV File (public/data/jamsil-inventory.csv & dist/data/jamsil-inventory.csv)
const csvHeader = '도서명,보유권수,작가,목표장르,기존서가';
const csvRows = enrichedList.map((item) => {
  const escapeCsv = (str) => (str.includes(',') ? `"${str.replace(/"/g, '""')}"` : str);
  return `${escapeCsv(item.title)},${escapeCsv(item.volumeRange)},${escapeCsv(item.author)},${escapeCsv(item.genre)},${escapeCsv(item.shelfNumber)}`;
});

const cleanCsvContent = [csvHeader, ...csvRows].join('\n');
fs.writeFileSync('public/data/jamsil-inventory.csv', cleanCsvContent, 'utf-8');
if (fs.existsSync('dist/data')) {
  fs.writeFileSync('dist/data/jamsil-inventory.csv', cleanCsvContent, 'utf-8');
}
console.log('Saved clean CSV to public/data/jamsil-inventory.csv');

// 7. Generate Supabase Migration SQL
const initials = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
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

const migrationSql = `-- Migration: Seed Jamsil store enriched book inventory (2,671 books with Author & Genre)
-- Generated on 2026-09-21 from docs/assets/jamsilbook_2026-Sep-21_0421/jamsilbook_2026-Sep-21_0421.csv

create temp table temp_jamsil_enriched (
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

insert into temp_jamsil_enriched (
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
from temp_jamsil_enriched t
on conflict (title, author) do update set
  category = case when excluded.category <> '' then excluded.category else public.books.category end,
  normalized_title = excluded.normalized_title,
  normalized_author = excluded.normalized_author,
  initial_consonants = excluded.initial_consonants,
  archived_at = null;

-- 2. Upsert into public.book_inventories for jamsil store
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
from temp_jamsil_enriched t
cross join (select id from public.stores where slug = 'jamsil') s
join public.books b on b.title = t.title and b.author = t.author
on conflict (store_id, book_id) do update set
  volume_range = excluded.volume_range,
  last_volume = excluded.last_volume,
  shelf_location = excluded.shelf_location,
  updated_at = now();
`;

fs.writeFileSync(
  'supabase/migrations/20260921140000_seed_jamsil_enriched_inventory.sql',
  migrationSql,
  'utf-8'
);
console.log('Saved migration to supabase/migrations/20260921140000_seed_jamsil_enriched_inventory.sql');
