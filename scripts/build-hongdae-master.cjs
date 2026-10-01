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

// 1. Load existing Master DB (SNU cleaned inventory first, then Jamsil)
const snuMasterMap = new Map();
const jamsilMasterMap = new Map();

if (fs.existsSync('public/data/cleaned-inventory.csv')) {
  const content = fs.readFileSync('public/data/cleaned-inventory.csv', 'utf-8');
  content
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .forEach((l) => {
      const v = parseCsvLine(l);
      const title = v[0]?.trim();
      const author = v[2]?.trim();
      const genre = v[3]?.trim();
      if (title && !snuMasterMap.has(normalise(title))) {
        snuMasterMap.set(normalise(title), { author, genre, title });
      }
    });
}

if (fs.existsSync('public/data/jamsil-inventory.csv')) {
  const content = fs.readFileSync('public/data/jamsil-inventory.csv', 'utf-8');
  content
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .forEach((l) => {
      const v = parseCsvLine(l);
      const title = v[0]?.trim();
      const author = v[2]?.trim();
      const genre = v[3]?.trim();
      if (title && author && author !== '미상' && !jamsilMasterMap.has(normalise(title))) {
        jamsilMasterMap.set(normalise(title), { author, genre, title });
      }
    });
}

console.log(`Loaded ${snuMasterMap.size} SNU titles and ${jamsilMasterMap.size} validated Jamsil titles.`);

// 2. Comprehensive Author & Genre Dictionary
const KNOWN_AUTHORS_GENRES = {
  // Sports / Martial Arts / Action
  아이실드21: { author: '이나가키 리이치로/무라타 유스케', genre: '드라마/스포츠/SF' },
  사상최강의제자켄이치: { author: '마츠에나 슌', genre: '액션/모험' },
  드림슈터: { author: '아오야마 키요시', genre: '드라마/스포츠/SF' },
  어택: { author: '오시마 츠카사', genre: '드라마/스포츠/SF' },
  사무라이솔저: { author: '야마모토 류이치로', genre: '드라마/스포츠/SF' },
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
  h2: { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  터치: { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  크로스게임: { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  믹스: { author: '아다치 미츠루', genre: '드라마/스포츠/SF' },
  리쿠도: { author: '마츠바라 토시미츠', genre: '드라마/스포츠/SF' },
  권법소년: { author: '마츠다 류지/후지와라 요시히데', genre: '액션/모험' },
  쿠로코의농구: { author: '후지마키 타다토시', genre: '드라마/스포츠/SF' },
  겁쟁이페달: { author: '와타나베 와타루', genre: '드라마/스포츠/SF' },
  다이아몬드a: { author: '테라지마 유지', genre: '드라마/스포츠/SF' },
  다이아몬드에이스: { author: '테라지마 유지', genre: '드라마/스포츠/SF' },
  크게휘두르며: { author: '히구치 아사', genre: '드라마/스포츠/SF' },
  메이저: { author: '미츠다 타쿠야', genre: '드라마/스포츠/SF' },
  메이저2nd: { author: '미츠다 타쿠야', genre: '드라마/스포츠/SF' },
  자이언트킬링: { author: '츠지토모/츠나모토 츠네츠구', genre: '드라마/스포츠/SF' },
  아오아시: { author: '코바야시 유고', genre: '드라마/스포츠/SF' },
  테니스의왕자: { author: '코노미 타케시', genre: '드라마/스포츠/SF' },
  신테니스의왕자: { author: '코노미 타케시', genre: '드라마/스포츠/SF' },
  슬램덩크: { author: '이노우에 타케히코', genre: '드라마/스포츠/SF' },
  리얼: { author: '이노우에 타케히코', genre: '드라마/스포츠/SF' },
  하이큐: { author: '후루다테 하루이치', genre: '드라마/스포츠/SF' },
  블루록: { author: '카네시로 무네유키/노무라 유스케', genre: '드라마/스포츠/SF' },
  블루록episode나기: { author: '카네시로 무네유키/산노미야 코타', genre: '드라마/스포츠/SF' },

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
  민속탐정야쿠모: { author: '카미нага 마나부/야마구치 사토시', genre: '스릴러/추리/호러' },
  명탐정키요시로사건노트: { author: '유키 미츠루', genre: '스릴러/추리/호러' },
  블랙아웃: { author: '아사키 마사시', genre: '스릴러/추리/호러' },
  피안도: { author: '마츠모토 코지', genre: '스릴러/추리/호러' },
  빙과: { author: '요네자와 호노부/타스크오나', genre: '스릴러/추리/호러' },
  qed큐이디증명종료: { author: '카토 모토히로', genre: '스릴러/추리/호러' },
  cmb박물관사건목록: { author: '카토 모토히로', genre: '스릴러/추리/호러' },
  탐정학원q: { author: '아마기 세이마루/사토 후미야', genre: '스릴러/추리/호러' },
  탐정학원q프리미엄: { author: '아마기 세이마루/사토 후미야', genre: '스릴러/추리/호러' },
  올드보이: { author: '츠치야 가론/미네기시 노부아키', genre: '스릴러/추리/호러' },
  지옥소녀: { author: '와타나베 히로시/에토 미유키', genre: '스릴러/추리/호러' },
  살인자o난감: { author: '꼬마비/노마비', genre: '웹툰' },
  살인자ㅇ난감: { author: '꼬마비/노마비', genre: '웹툰' },
  살육의천사: { author: '사나다 마코토/나즈카 쿠단', genre: '스릴러/추리/호러' },
  몬스터chapter: { author: '우라사와 나오키', genre: '스릴러/추리/호러' },
  몬스터: { author: '우라사와 나오키', genre: '스릴러/추리/호러' },
  '20세기소년': { author: '우라사와 나오키', genre: '스릴러/추리/호러' },
  플루토: { author: '우라사와 나오키/데즈카 오사무', genre: '드라마/스포츠/SF' },
  pluto: { author: '우라사와 나오키/데즈카 오사무', genre: '드라마/스포츠/SF' },
  빌리배트: { author: '우라사와 나오키', genre: '스릴러/추리/호러' },
  데스노트: { author: '오바 츠구미/오바타 타케시', genre: '스릴러/추리/호러' },
  블러디먼데이: { author: '류몬 료/메구미 코지', genre: '스릴러/추리/호러' },
  블러디먼데이라스트시즌: { author: '류몬 료/메구미 코지', genre: '스릴러/추리/호러' },
  약속의네버랜드: { author: '시라이 카이우/데미즈 포스카', genre: '스릴러/추리/호러' },
  카케구루이: { author: '카와모토 호무라/나오무라 토오루', genre: '스릴러/추리/호러' },
  친구게임: { author: '야마구치 미코토/사토 유키', genre: '스릴러/추리/호러' },
  카사네: { author: '마츠우라 다루마', genre: '스릴러/추리/호러' },
  배틀로얄: { author: '타카미 코슌/타구치 마사유키', genre: '스릴러/추리/호러' },
  신이말하는대로: { author: '카네시로 무네유키/후지무라 아케지', genre: '스릴러/추리/호러' },
  신이말하는대로2부: { author: '카네시로 무네유키/후지무라 아케지', genre: '스릴러/추리/호러' },
  미래일기: { author: '에스노 사카에', genre: '스릴러/추리/호러' },
  미래일기모자이크: { author: '에스노 사카에', genre: '스릴러/추리/호러' },
  우로보로스: { author: '칸자키 유야', genre: '스릴러/추리/호러' },
  이토준지: { author: '이토 준지', genre: '스릴러/추리/호러' },
  이토준지걸작집: { author: '이토 준지', genre: '스릴러/추리/호러' },
  블랙패러독스: { author: '이토 준지', genre: '스릴러/추리/호러' },
  공포박물관: { author: '이토 준지', genre: '스릴러/추리/호러' },
  센서: { author: '이토 준지', genre: '스릴러/추리/호러' },
  마의파편: { author: '이토 준지', genre: '스릴러/추리/호러' },
  미미의괴담: { author: '이토 준지', genre: '스릴러/추리/호러' },
  스위치: { author: '나미키 사키', genre: '스릴러/추리/호러' },

  // Classics & Shojo / Romance / Webtoon
  캔디캔디: { author: '이가라시 유미코/미즈키 쿄코', genre: '로맨스/로판' },
  하늘은붉은강가: { author: '시노하라 치에', genre: '로맨스/로판' },
  베르사유의장미: { author: '이케다 리요코', genre: '로맨스/로판' },
  베르사유의장미완전판: { author: '이케다 리요코', genre: '로맨스/로판' },
  프린세스: { author: '한승원', genre: '로맨스/로판' },
  미소녀전사세일러문: { author: '타케우치 나오코', genre: '로맨스/로판' },
  세일러문: { author: '타케우치 나오코', genre: '로맨스/로판' },
  유리가면: { author: '미우치 스즈에', genre: '로맨스/로판' },
  레이디빅토리안: { author: '모토 나오코', genre: '로맨스/로판' },
  꿈빛파티시엘: { author: '마츠모토 나츠미', genre: '로맨스/로판' },
  캐릭캐릭체인지: { author: 'PEACH-PIT', genre: '로맨스/로판' },
  캐릭캐릭체인지jeweljoker: { author: 'PEACH-PIT', genre: '로맨스/로판' },
  슈가슈가룬: { author: '안노 모요코', genre: '로맨스/로판' },
  치즈인더트랩: { author: '순끼', genre: '웹툰' },
  치즈인더트랩시즌3: { author: '순끼', genre: '웹툰' },
  그녀가공작저로가야했던사정: { author: '고래/밀차', genre: '웹툰' },
  토끼와흑표범의공생관계: { author: '사단/야식', genre: '웹툰' },
  선천적얼간이들: { author: '가스파드', genre: '웹툰' },
  여자만화구두: { author: '박윤영', genre: '웹툰' },
  슬픈연가: { author: '신지상/지오', genre: '로맨스/로판' },
  인형가: { author: '이빈', genre: '로맨스/로판' },
  키스로길들여지다: { author: '황미리', genre: '로맨스/로판' },
  샤베트: { author: '한유랑', genre: '로맨스/로판' },
  히싱: { author: '강특하', genre: '로맨스/로판' },
  러브바이러스: { author: '한유랑', genre: '로맨스/로판' },
  문제아건드리고살아남기: { author: '황미리', genre: '로맨스/로판' },
  둘시네아를위하여: { author: '한유랑', genre: '로맨스/로판' },
  메르오메가: { author: '한유랑', genre: '로맨스/로판' },
  늑대주의보: { author: '황미리', genre: '로맨스/로판' },
  월요일소년: { author: '이영희', genre: '로맨스/로판' },
  요정표본: { author: '유키 카오리', genre: '스릴러/추리/호러' },
  천사금렵구: { author: '유키 카오리', genre: '판타지/무협' },
  백작카인: { author: '유키 카오리', genre: '스릴러/추리/호러' },
  루비: { author: '원수연', genre: '로맨스/로판' },
  풀하우스: { author: '원수연', genre: '로맨스/로판' },
  오디션: { author: '천계영', genre: '드라마/스포츠/SF' },
  언플러그드보이: { author: '천계영', genre: '로맨스/로판' },
  좋아하면울리는: { author: '천계영', genre: '웹툰' },
  궁: { author: '박소희', genre: '로맨스/로판' },
  아르미안의네딸들: { author: '신일숙', genre: '판타지/무협' },
  리니지: { author: '신일숙', genre: '판타지/무협' },
  불의검: { author: '김혜린', genre: '드라마/스포츠/SF' },
  마이네리베: { author: '유키 카오리', genre: '로맨스/로판' },
  내이야기: { author: '카와하라 카즈네/아루코', genre: '로맨스/로판' },
  기숙학교의줄리엣: { author: '카네다 요스케', genre: '로맨스/로판' },
  두근두근프레이즈: { author: '신조 마유', genre: '로맨스/로판' },
  마치다군의세계: { author: '안도 유키', genre: '로맨스/로판' },
  타카네와하나: { author: '시와스 유키', genre: '로맨스/로판' },
  파르페틱: { author: '나나지 마구', genre: '로맨스/로판' },
  엽기인girl스나코: { author: '하야카와 토모코', genre: '로맨스/로판' },
  저스트고고: { author: '강경옥', genre: '로맨스/로판' },
  캣스트릿: { author: '카미오 요코', genre: '로맨스/로판' },
  꽃보다남자: { author: '카미오 요코', genre: '로맨스/로판' },
  꽃보다맑음: { author: '카미오 요코', genre: '로맨스/로판' },
  푸른여름: { author: '난바 아츠코', genre: '로맨스/로판' },
  내일의왕님: { author: '야치 에미코', genre: '로맨스/로판' },
  러버스키스: { author: '요시다 아키미', genre: '로맨스/로판' },
  바나나피시: { author: '요시다 아키미', genre: '액션/모험' },
  바닷마을다이어리: { author: '요시다 아키미', genre: '드라마/스포츠/SF' },
  콜레트는죽기로했다: { author: '유키무라 알토', genre: '로맨스/로판' },
  신부이야기: { author: '모리 카오루', genre: '드라마/스포츠/SF' },
  엠마: { author: '모리 카오루', genre: '로맨스/로판' },
  늑대와향신료: { author: '하세쿠라 이스나/코우메 케이토', genre: '판타지/무협' },
  책벌레의하극상: { author: '카즈키 미야/스즈카', genre: '판타지/무협' },
  마법사의신부: { author: '야마자키 코레', genre: '판타지/무협' },
  중쇄를찍자: { author: '마츠다 나오코', genre: '드라마/스포츠/SF' },
  비밀: { author: '시미즈 레이코', genre: '스릴러/추리/호러' },
  달의아이: { author: '시미즈 레이코', genre: '판타지/무협' },
  내첫사랑을너에게바친다: { author: '아오키 코토미', genre: '로맨스/로판' },
  나는내일어제의너와만난다: { author: '나나츠키 타카후미', genre: '로맨스/로판' },
  한낮의유성: { author: '야마모리 미카', genre: '로맨스/로판' },
  츠바키쵸론리플래닛: { author: '야마모리 미카', genre: '로맨스/로판' },
  초속5센티미터: { author: '신카이 마코토/세이케 유키코', genre: '로맨스/로판' },
  목소리의형태: { author: '오오이마 요시토키', genre: '드라마/스포츠/SF' },
  불멸의그대에게: { author: '오오이마 요시토키', genre: '판타지/무협' },
  그남자그여자: { author: '츠다 마사미', genre: '로맨스/로판' },
  나나: { author: '야자와 아이', genre: '로맨스/로판' },
  파라다이스키스: { author: '야자와 아이', genre: '로맨스/로판' },
  내남자친구이야기: { author: '야자와 아이', genre: '로맨스/로판' },
  백귀야행: { author: '이마 이치코', genre: '스릴러/추리/호러' },
  세븐시즈: { author: '타무라 유미', genre: '드라마/스포츠/SF' },
  바사라: { author: '타무라 유미', genre: '판타지/무협' },
  호오즈키의냉철: { author: '에구치 나츠미', genre: '일상/개그' },
  반딧불이의혼례: { author: '타치바나 오레코', genre: '로맨스/로판' },
  '4월의너스피카': { author: '스기야마 미와코', genre: '로맨스/로판' },
  w네임: { author: '타카하시 유키', genre: '로맨스/로판' },
  카구야님은고백받고싶어: { author: '아카사카 아카', genre: '로맨스/로판' },
  최애의아이: { author: '아카사카 아카/요코야리 멘고', genre: '드라마/스포츠/SF' },
  너의이름은: { author: '신카이 마코토/코토네 란마루', genre: '로맨스/로판' },
  yourname: { author: '신카이 마코토/코토네 란마루', genre: '로맨스/로판' },
  날씨의아이: { author: '신카이 마코토/쿠보타 와타루', genre: '로맨스/로판' },
  스즈메의문단속: { author: '신카이 마코토/아마다 덴키', genre: '판타지/무협' },

  // Gourmet & Lifestyle
  미스터맛짱: { author: '테라사와 다이스케', genre: '일상/개그' },
  미스터초밥왕: { author: '테라사와 다이스케', genre: '일상/개그' },
  미스터초밥왕전국대회편: { author: '테라사와 다이스케', genre: '일상/개그' },
  절대미각식탐정: { author: '테라사와 다이스케', genre: '일상/개그' },
  이세계주점노부: { author: '세미카와 나츠/바지니아니토', genre: '일상/개그' },
  어제뭐먹었어: { author: '요시나가 후미', genre: '드라마/스포츠/SF' },
  서양골동양과자점: { author: '요시나가 후미', genre: '일상/개그' },
  오오쿠: { author: '요시나가 후미', genre: '드라마/스포츠/SF' },
  식객: { author: '허영만', genre: '드라마/스포츠/SF' },
  허영만식객: { author: '허영만', genre: '드라마/스포츠/SF' },
  타짜: { author: '허영만', genre: '드라마/스포츠/SF' },
  녹풍당의사계절: { author: '시미즈 유', genre: '일상/개그' },
  신의물방울: { author: '아기 타다시/오키모토 슈', genre: '드라마/스포츠/SF' },
  신의물방울최종장마리아주: { author: '아기 타다시/오키모토 슈', genre: '드라마/스포츠/SF' },
  바텐더: { author: '조 아라키/나가토모 켄지', genre: '드라마/스포츠/SF' },
  심야식당: { author: '아베 야로', genre: '일상/개그' },
  고독한미식가: { author: '쿠스미 마사유키/타니구치 지로', genre: '일상/개그' },
  라면요리왕: { author: '쿠베 로쿠로/카와이 탄', genre: '일상/개그' },

  // Fantasy / Shonen / Action / Seinen
  페이트스테이나이트: { author: 'TYPE-MOON/니시와키 닷토', genre: '판타지/무협' },
  페이트할로우아타락시아: { author: 'TYPE-MOON/메도리', genre: '판타지/무협' },
  페이트그랜드오더: { author: 'TYPE-MOON', genre: '판타지/무협' },
  페이트그랜드오더전격코믹앤솔로지: { author: 'TYPE-MOON', genre: '판타지/무협' },
  메르: { author: '안자이 노부유키', genre: '판타지/무협' },
  열화의검: { author: '안자이 노부유키', genre: '판타지/무협' },
  심연의카발리어: { author: '가온비/쥬더', genre: '판타지/무협' },
  신만이아는세계: { author: '와카키 타미키', genre: '판타지/무협' },
  이세계삼촌: { author: '호토وند시인데이루', genre: '일상/개그' },
  사신도련님과검은메이드: { author: '이노우에 코하루', genre: '로맨스/로판' },
  뉴게임: { author: '토코노 쇼타로', genre: '일상/개그' },
  newgame: { author: '토코노 쇼타로', genre: '일상/개그' },
  안기고싶은남자1위에게협박당하고있습니다: { author: '사쿠라비 하하고', genre: 'BL/GL' },
  나의소년: { author: '타카노 아오이', genre: '드라마/스포츠/SF' },
  산: { author: '이시즈카 신이치', genre: '드라마/스포츠/SF' },
  블루자이언트: { author: '이시즈카 신이치', genre: '드라마/스포츠/SF' },
  타임슬립닥터jin: { author: '무라카미 모토카', genre: '드라마/스포츠/SF' },
  의룡: { author: '나가이 아키라/노기자카 타로', genre: '드라마/스포츠/SF' },
  와일드라이프: { author: '후지사키 마사토', genre: '드라마/스포츠/SF' },
  메이의집사: { author: '미야기 리코', genre: '로맨스/로판' },
  하야테처럼: { author: '하타 켄지로', genre: '일상/개그' },
  갓핸드테루: { author: '야마모토 카즈키', genre: '드라마/스포츠/SF' },
  나우: { author: '박성우', genre: '액션/모험' },
  천랑열전: { author: '박성우', genre: '판타지/무협' },
  흑신: { author: '임달영/박성우', genre: '액션/모험' },
  한때는신이었던짐승들에게: { author: '메이비(MAYBE)', genre: '판타지/무협' },
  우주를누비는쏙독새: { author: '카와바타 시키', genre: '드라마/스포츠/SF' },
  내일의요이치: { author: '미나모토 유우', genre: '액션/모험' },
  사슴아이어슬렁어슬렁호시탐탐: { author: '오시오시오', genre: '일상/개그' },
  소원의아스트로: { author: '와쿠이 켄', genre: '액션/모험' },
  드래곤볼: { author: '토리야마 아키라', genre: '액션/모험' },
  드래곤볼슈퍼: { author: '토리야마 아키라/토요타로', genre: '액션/모험' },
  드래곤볼총집편초오공전: { author: '토리야마 아키라', genre: '액션/모험' },
  원피스: { author: '오다 에이이치로', genre: '액션/모험' },
  원피스노블에이스: { author: '오다 에이이치로/히나타 쇼', genre: '일반도서/소설' },
  나루토: { author: '키시모토 마사시', genre: '액션/모험' },
  보루토: { author: '키시모토 마사시/이케모토 미키오', genre: '액션/모험' },
  블리치: { author: '쿠보 타이토', genre: '액션/모험' },
  은혼: { author: '소라치 히데아키', genre: '일상/개그' },
  배가본드: { author: '이노우에 타케히코', genre: '액션/모험' },
  헌터x헌터: { author: '토가시 요시히로', genre: '액션/모험' },
  유유백서: { author: '토가시 요시히로', genre: '액션/모험' },
  강철의연금술사: { author: '아라카와 히로무', genre: '판타지/무협' },
  은수저: { author: '아라카와 히로무', genre: '일상/개그' },
  진격의거인: { author: '이사야마 하지메', genre: '액션/모험' },
  도쿄구울: { author: '이시다 스이', genre: '액션/모험' },
  체인소맨: { author: '후지모토 타츠키', genre: '액션/모험' },
  룩백: { author: '후지모토 타츠키', genre: '드라마/스포츠/SF' },
  안녕에리: { author: '후지모토 타츠키', genre: '드라마/스포츠/SF' },
  스파이패밀리: { author: '엔도 타츠야', genre: '일상/개그' },
  원펀맨: { author: 'ONE/무라타 유스케', genre: '액션/모험' },
  모브사이코100: { author: 'ONE', genre: '판타지/무협' },
  나의히어로아카데미아: { author: '호리코시 코헤이', genre: '액션/모험' },
  블랙클로버: { author: '타바타 유키', genre: '판타지/무협' },
  닥터스톤: { author: '이나가키 리이치로/Boichi', genre: '드라마/스포츠/SF' },
  나홀로레벨업: { author: '추공/장성락', genre: '웹툰' },
  sololeveling: { author: '추공/장성락', genre: '웹툰' },
  헬보이: { author: '마이크 미뇰라', genre: '코믹스/그래픽노블' },
  hellboy: { author: '마이크 미뇰라', genre: '코믹스/그래픽노블' },
  배트맨: { author: '밥 케인/빌 핑거', genre: '코믹스/그래픽노블' },
  어메이징스파이더맨: { author: '스탠 리/스티브 딧코', genre: '코믹스/그래픽노블' },
  귀멸의칼날: { author: '고토게 코요하루', genre: '액션/모험' },
  귀멸의칼날외전: { author: '히라노 료지/고토게 코요하루', genre: '액션/모험' },
  귀멸학원: { author: '호카미 코지/고토게 코요하루', genre: '일상/개그' },
  귀멸의칼날행복의꽃: { author: '야지마 아야/고토게 코요하루', genre: '일반도서/소설' },
  귀멸의칼날한쪽날개의나비: { author: '야지마 아야/고토게 코요하루', genre: '일반도서/소설' },
  귀멸의칼날귀살대견문록: { author: '고토게 코요하루', genre: '액션/모험' },
  괴수8호: { author: '마츠모토 나오야', genre: '액션/모험' },
  괴수8호b: { author: '마츠모토 나오야/키즈카 케이지', genre: '액션/모험' },
  괴수8호relax: { author: '와타나베 키즈쿠', genre: '일상/개그' },
  약사의혼잣말: { author: '네코쿠라게/휴우가 나츠', genre: '드라마/스포츠/SF' },
  극락가: { author: '사노 유토', genre: '액션/모험' },
  주술회전: { author: '아쿠타미 게게', genre: '액션/모험' },
  디그레이맨: { author: '호시노 카츠라', genre: '판타지/무협' },
  디스트로이x레볼루션: { author: '모리 코우지', genre: '액션/모험' },
  세상이가르쳐준비밀: { author: '하카마다 사키', genre: '스릴러/추리/호러' },
  갱스타: { author: '코스케', genre: '액션/모험' },
  야쿠자의덕질: { author: '타츠미', genre: '일상/개그' },
  강호패도기: { author: '오치아이 유스케', genre: '판타지/무협' },
  위치헌터: { author: '조정만', genre: '판타지/무협' },
  팬텀버스터즈: { author: '네오 쇼코', genre: '액션/모험' },
  도쿄리벤저스바지케이스케로부터의편지: { author: '나츠카와 유키노리/와쿠이 켄', genre: '액션/모험' },
  '3월의라이온': { author: '우미노 치카', genre: '드라마/스포츠/SF' },
  헤이세이폴리스맨: { author: '이나바 미노루', genre: '일상/개그' },
  '100억의사나이': { author: '쿠니토모 야스유키', genre: '드라마/스포츠/SF' },
  란마12: { author: '타카하시 루미코', genre: '일상/개그' },
  k2: { author: '마후네 카즈오', genre: '드라마/스포츠/SF' },
  슈퍼닥터k: { author: '마후네 카즈오', genre: '드라마/스포츠/SF' },
  닥터k: { author: '마후네 카즈오', genre: '드라마/스포츠/SF' },
  미생: { author: '윤태호', genre: '웹툰' },
  미생시즌2: { author: '윤태호', genre: '웹툰' },
  녹두전: { author: '혜진양', genre: '웹툰' },
  마녀: { author: '강풀', genre: '웹툰' },
  이멋진세계에폭염을: { author: '아카츠키 나츠메', genre: '판타지/무협' },
  이세계가게임이란사실은나만이알고있다: { author: '우스바/이치히', genre: '판타지/무협' },
  is인피니트스트라토스: { author: '유미즈루 이즈루', genre: '액션/모험' },
  마탄의왕과바나디스: { author: '카와구치 츠카사', genre: '판타지/무협' },
  위벨블라트: { author: '시오노 에토라지', genre: '판타지/무협' },
  제트맨: { author: '카츠라 마사카즈', genre: '액션/모험' },
  아이즈: { author: '카츠라 마사카즈', genre: '로맨스/로판' },
  전영소녀: { author: '카츠라 마사카즈', genre: '로맨스/로판' },
  풀메탈패닉시그마: { author: '우에다 히로시/가토 쇼지', genre: '액션/모험' },
  슈토헬: { author: '이토 유', genre: '액션/모험' },
  서유기플러스어게인: { author: '고진호', genre: '액션/모험' },
  용비불패: { author: '문정후', genre: '판타지/무협' },
  용비불패외전: { author: '문정후', genre: '판타지/무협' },
  고수: { author: '류기운/문정후', genre: '웹툰' },
  신암행어사: { author: '윤인완/양경일', genre: '판타지/무협' },
  아일랜드: { author: '윤인완/양경일', genre: '액션/모험' },
  소마신화전기: { author: '양경일', genre: '판타지/무협' },
  프리스트: { author: '형민우', genre: '판타지/무협' },
  유레카: { author: '손희준/김윤경', genre: '판타지/무협' },
  크로우즈: { author: '타카하시 히로시', genre: '액션/모험' },
  워스트: { author: '타카하시 히로시', genre: '액션/모험' },
  엔젤전설: { author: '야기 노리히로', genre: '일상/개그' },
  클레이모어: { author: '야기 노리히로', genre: '판타지/무협' },
  봉신연의: { author: '후지사키 류', genre: '판타지/무협' },
  마기: { author: '오타카 시노부', genre: '판타지/무협' },
  페어리테일: { author: '마시마 히로', genre: '판타지/무협' },
  레이브: { author: '마시마 히로', genre: '판타지/무협' },
  에덴즈제로: { author: '마시마 히로', genre: '판타지/무협' },
  일곱개의대죄: { author: '스즈키 나카바', genre: '판타지/무협' },
  샤먼킹: { author: '타케이 히로유키', genre: '판타지/무협' },
  헬싱: { author: '히라노 코우타', genre: '액션/모험' },
  간츠: { author: '오쿠 히로야', genre: '액션/모험' },
  베르세르크: { author: '미우라 켄타로', genre: '판타지/무협' },
  바람의검심: { author: '와츠키 노부히로', genre: '액션/모험' },
  가정교사히트맨리본: { author: '아마노 아키라', genre: '액션/모험' },
  흑집사: { author: '토보소 야나', genre: '판타지/무협' },
  판도라하츠: { author: '모치즈키 준', genre: '판타지/무협' },
  소울이터: { author: '오오쿠보 아츠시', genre: '판타지/무협' },
  불꽃소방대: { author: '오오쿠보 아츠시', genre: '액션/모험' },
  청의엑소시스트: { author: '카토 카즈에', genre: '판타지/무협' },
  혈계전선: { author: '나이토 야스히로', genre: '액션/모험' },
  아인: { author: '사쿠라이 가몬', genre: '액션/모험' },
  테라포마스: { author: '사스가 유우/타치바나 켄이치', genre: '드라마/스포츠/SF' },
  킹덤: { author: '하라 야스히사', genre: '액션/모험' },
  빈란드사가: { author: '유키무라 마코토', genre: '액션/모험' },
  도로헤도로: { author: '하야시다 큐', genre: '판타지/무협' },
  던전밥: { author: '쿠이 료코', genre: '판타지/무협' },
  장송의프리렌: { author: '야마다 카네히토/아베 츠카사', genre: '판타지/무협' },
  괴짜가족: { author: '하마오카 켄지', genre: '일상/개그' },
  이나중탁구부: { author: '후루야 미노루', genre: '일상/개그' },
  시마과장: { author: '히로카네 켄시', genre: '드라마/스포츠/SF' },
  시마부장: { author: '히로카네 켄시', genre: '드라마/스포츠/SF' },
  시마이사: { author: '히로카네 켄시', genre: '드라마/스포츠/SF' },
  시마회장: { author: '히로카네 켄시', genre: '드라마/스포츠/SF' },
  바둑왕: { author: '핫타 마사미/오바타 타케시', genre: '드라마/스포츠/SF' },
  히카루의바둑: { author: '핫타 마사미/오바타 타케시', genre: '드라마/스포츠/SF' },
  바쿠만: { author: '오바 츠구미/오바타 타케시', genre: '드라마/스포츠/SF' },
  러브히나: { author: '아카마츠 켄', genre: '로맨스/로판' },
  마법선생네기마: { author: '아카마츠 켄', genre: '판타지/무협' },
  딸기100: { author: '카와시타 미즈키', genre: '로맨스/로판' },
  니세코이: { author: '코미 나오시', genre: '로맨스/로판' },
  '5등분의신부': { author: '하루바 네기', genre: '로맨스/로판' },
  그녀도여친: { author: '히로유키', genre: '일상/개그' },
  렌탈여친: { author: '미야지마 레이지', genre: '로맨스/로판' },
  여친빌리겠습니다: { author: '미야지마 레이지', genre: '로맨스/로판' },
  투러브트러블: { author: '하세미 사키/야부키 켄타로', genre: '성인' },
  블랙캣: { author: '야부키 켄타로', genre: '액션/모험' },
  식극의소마: { author: '츠쿠다 유토/사에키 슌', genre: '일상/개그' },
  암살교실: { author: '마츠이 유세이', genre: '액션/모험' },
  쌍망정은부숴야한다: { author: '후지타 카즈히로', genre: '액션/모험' },
  꼭두각시서커스: { author: '후지타 카즈히로', genre: '판타지/무협' },
  요괴소년호야: { author: '후지타 카즈히로', genre: '액션/모험' },
  바카노: { author: '나리타 료고/에나미 카츠미', genre: '판타지/무협' },
  히스토리에: { author: '이와아키 히토시', genre: '드라마/스포츠/SF' },
  기생수: { author: '이와아키 히토시', genre: '액션/모험' },
  고블린슬레이어: { author: '카규 쿠모/쿠로세 코스케', genre: '판타지/무협' },
  프리징: { author: '임달영/김광현', genre: '액션/모험' },
  가치아쿠타: { author: '우라나 케이', genre: '액션/모험' },
  gachiakuta가치아쿠타: { author: '우라나 케이', genre: '액션/모험' },
  바스타드암흑의파괴신: { author: '하기와라 카즈시', genre: '판타지/무협' },
  닥터노구찌: { author: '무츠 토시유키', genre: '드라마/스포츠/SF' },
  dr코토진료소: { author: '야마다 타카토시', genre: '드라마/스포츠/SF' },
  지팡구: { author: '카와구치 카이지', genre: '드라마/스포츠/SF' },
  침묵의함대: { author: '카와구치 카이지', genre: '드라마/스포츠/SF' },
  소년메이드: { author: '오토치바나', genre: '일상/개그' },
  히비키소설가가되는방법: { author: '야나기모토 미츠하루', genre: '드라마/스포츠/SF' },
  어둠의이지스: { author: '나나츠키 쿄이치/후지와라 요시히데', genre: '액션/모험' },
  괴물의아이: { author: '호소다 마모루/아사이 렌지', genre: '판타지/무협' },
  결계사: { author: '타나베 옐로우', genre: '판타지/무협' },
  re제로부터시작하는이세계생활: { author: '나가츠키 타페이', genre: '판타지/무협' },
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
const hongdaeCsv = fs.readFileSync('docs/assets/hongdaebook_2026-Sep-28_0714.csv', 'utf-8');
const [hHeader, ...hLines] = hongdaeCsv.trim().split(/\r?\n/);

function splitTitles(text) {
  const parts = text.split(/\s*\/\/\s*/);
  const result = [];
  parts.forEach((p) => {
    const cleanP = p.trim().replace(/^[\/\s]+|[\/\s]+$/g, '');
    if (!cleanP) return;

    const subParts = cleanP.split(/(?<!\b(?:1|스위치 1|란마 1|천사 1|Fate))\s*\/\s*(?!(?:2\b|stay\b))/ui);
    subParts.forEach((sp) => {
      const trimmed = sp.trim().replace(/^[\/\s]+|[\/\s]+$/g, '');
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
    let t = raw.trim().replace(/^[\/\s]+|[\/\s]+$/g, '');
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
      // Check attached digits like '3월의 라이온.18' or '바키31' or 'K2. 14' or 'title 12'
      const attachedMatch = /^(바키|w네임|도쿄 리벤저스 ~바지 케이스케로부터의 편지)(\d+)$/u.exec(t);
      if (attachedMatch) {
        title = attachedMatch[1].trim();
        lastVolume = parseInt(attachedMatch[2], 10);
        volumeRange = `1~${lastVolume}권`;
      } else {
        const dotNoSpaceMatch = /^(.*\S)\.(\d+)$/u.exec(t);
        if (dotNoSpaceMatch) {
          title = dotNoSpaceMatch[1].trim();
          lastVolume = parseInt(dotNoSpaceMatch[2], 10);
          volumeRange = `1~${lastVolume}권`;
        } else {
          const dotSpaceMatch = /^(.*\S)\.\s+(\d+)(?:\s*\([^\)]*\))?$/u.exec(t);
          if (dotSpaceMatch) {
            title = dotSpaceMatch[1].trim();
            lastVolume = parseInt(dotSpaceMatch[2], 10);
            volumeRange = `1~${lastVolume}권`;
          } else {
            const spaceMatch = /^(.*\S)\s+(\d+)(?:\s*\([^\)]*\))?$/u.exec(t);
            if (spaceMatch) {
              title = spaceMatch[1].trim();
              lastVolume = parseInt(spaceMatch[2], 10);
              volumeRange = `1~${lastVolume}권`;
            }
          }
        }
      }
    }

    // Clean trailing dots from title
    title = title.replace(/\.$/, '').trim();
    if (!title) return;

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

  // 1) Priority 1: Exact Match in KNOWN Dictionary
  if (KNOWN_AUTHORS_GENRES[normTitle]) {
    const k = KNOWN_AUTHORS_GENRES[normTitle];
    author = k.author || '';
    genre = k.genre || '';
  }

  // 2) Priority 2: SNU Master Map (Cleaned 600 titles)
  if (!author && snuMasterMap.has(normTitle)) {
    const m = snuMasterMap.get(normTitle);
    author = m.author || '';
    if (!genre) genre = m.genre || '';
  }

  // 3) Priority 3: Jamsil Master Map (Non-unknown author only)
  if (!author && jamsilMasterMap.has(normTitle)) {
    const m = jamsilMasterMap.get(normTitle);
    author = m.author || '';
    if (!genre) genre = m.genre || '';
  }

  // 4) Priority 4: Partial match in dictionary (Length >= 3 only, normTitle contains key)
  if (!author && normTitle.length >= 3) {
    for (const [key, val] of Object.entries(KNOWN_AUTHORS_GENRES)) {
      if (key.length >= 3 && normTitle.includes(key)) {
        author = val.author;
        if (!genre) genre = val.genre;
        break;
      }
    }
  }

  // 5) Map rawGenre to standard genre if not determined
  if (!genre && item.rawGenre && GENRE_MAPPING[item.rawGenre]) {
    genre = GENRE_MAPPING[item.rawGenre];
  }

  // 6) Fallback genre
  if (!genre) {
    genre = '코믹스/그래픽노블';
  }

  // 7) Fallback author
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
-- Generated on 2026-09-29 from docs/assets/hongdaebook_2026-Sep-28_0714.csv

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
  'supabase/migrations/20260928163000_apply_hongdae_master_inventory.sql',
  migrationSql,
  'utf-8'
);
console.log(
  'Saved migration to supabase/migrations/20260928163000_apply_hongdae_master_inventory.sql'
);
