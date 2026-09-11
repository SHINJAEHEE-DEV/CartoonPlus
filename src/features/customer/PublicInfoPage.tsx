import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import gamingMascot from '../../assets/mascot_gaming.png';
import coffeeMascot from '../../assets/mascot_coffee.png';
import storePhoto1 from '../../assets/store_photo_043.jpg';
import storePhoto2 from '../../assets/store_photo_049.jpg';
import storePhoto3 from '../../assets/store_photo_03.jpg';
import { loadManagedEvents, getBannerImageUrl, type ManagedEvent } from '../../lib/eventRepository';

type Item = {
  id: string;
  title: string;
  players?: string | null;
  genre?: string | null;
  item_type?: string;
  quantity?: number;
  content?: string | null;
  is_always_on?: boolean;
};

// 정적 기본 데이터 (와이어프레임 및 교정된 게임 목록)
const DEFAULT_GAMES = {
  switch: [
    { tag: 'NSW', title: '슈퍼 마리오 파티 잼버리', en: 'Super Mario Party Jamboree' },
    { tag: 'NSW', title: '오버쿡드', en: 'Overcooked!' },
    { tag: 'NSW', title: '폴가이즈', en: 'Fall Guys' },
    { tag: 'NSW', title: '슈퍼 버니 맨', en: 'Super Bunny Man' },
    { tag: 'NSW', title: '태고의 달인 쿵딱! 원더풀 페스티벌', en: 'Taiko no Tatsujin: Rhythm Festival' },
    { tag: 'NSW', title: '슈퍼 커비 헌터즈', en: 'Super Kirby Clash' },
    { tag: 'NSW', title: '포켓몬 챔피언스', en: 'Pokémon Champions' },
    { tag: 'NSW', title: '리듬 세상', en: 'Rhythm Heaven' },
  ],
  ps4: [
    { tag: 'PS4', title: '잇 테익스 투', en: 'It Takes Two' },
    { tag: 'PS4', title: '휴먼: 폴 플랫', en: 'Human: Fall Flat' },
    { tag: 'PS4', title: '오버쿡드 2', en: 'Overcooked! 2' },
    { tag: 'PS4', title: '무빙 아웃', en: 'Moving Out' },
    { tag: 'PS4', title: '리틀 나이트메어 2', en: 'Little Nightmares II' },
    { tag: 'PS4', title: '노바디 세이브즈 더 월드', en: 'Nobody Saves the World' },
    { tag: 'PS4', title: '태고의 달인 모두 함께 쿵딱쿵!', en: 'Taiko no Tatsujin: Drum Session!' },
    { tag: 'PS4', title: '브롤할라', en: 'Brawlhalla' },
    { tag: 'PS4', title: '드래곤볼 제노버스 2', en: 'Dragon Ball Xenoverse 2' },
    { tag: 'PS4', title: '로블록스', en: 'Roblox' },
    { tag: 'PS4', title: '포트나이트', en: 'Fortnite' },
    { tag: 'PS4', title: '이풋볼', en: 'eFootball™' },
  ],
  board: [
    { tag: 'BOARD', title: '다빈치코드', en: '3개' }, { tag: 'BOARD', title: '시타델', en: '2개' },
    { tag: 'BOARD', title: '라스베가스', en: '' }, { tag: 'BOARD', title: '스플렌더 확장: 찬란한 도시', en: '' },
    { tag: 'BOARD', title: '스플렌더', en: '2개' }, { tag: 'BOARD', title: '요트다이스', en: '' },
    { tag: 'BOARD', title: '우봉고', en: '' }, { tag: 'BOARD', title: '젬블로', en: '' },
    { tag: 'BOARD', title: '오델로 클래식', en: '' }, { tag: 'BOARD', title: '반지의 제왕', en: '' },
    { tag: 'BOARD', title: 'ACUITY', en: '' }, { tag: 'BOARD', title: '루빅스 레이스', en: '' },
    { tag: 'BOARD', title: '텔레스트레이션', en: '' }, { tag: 'BOARD', title: '체스&체커', en: '' },
    { tag: 'BOARD', title: '뒤죽박죽 서커스', en: '' }, { tag: 'BOARD', title: '루핑루이', en: '' },
    { tag: 'BOARD', title: '카탄', en: '' }, { tag: 'BOARD', title: '루미큐브 클래식', en: '' },
    { tag: 'BOARD', title: '라비린스', en: '' }, { tag: 'BOARD', title: '뱅!', en: '' },
    { tag: 'BOARD', title: '로스트 시티', en: '2개' }, { tag: 'BOARD', title: '콰르토', en: '' },
    { tag: 'BOARD', title: '쿼리도', en: '' },
  ],
};



const STORE_ROWS = [
  { k: '영업시간', v: '매일 10:00 – 23:00 (연중무휴, 공휴일·명절 정상 영업)' },
  { k: '주소', v: '서울특별시 관악구 관악로 155, 3층 (봉천동 856-5 대우디오슈페리움 1단지)' },
  { k: '오시는 길', v: '지하철 2호선 서울대입구역 3번 출구에서 도보 1~2분 직진. 1층 빽다방·올리브영 건물 3층.' },
  { k: '주차', v: '건물 지하 주차장 이용 가능 (이용 시 카운터 문의)' },
  { k: '문의', v: '02-888-0852 · 매장 이용 및 도서 재고 문의' },
];

const GUIDE_STEPS = [
  { n: '1', title: '키오스크에서 입실', desc: '이용 시간과 음료를 선택한 뒤 결제해 주세요.' },
  { n: '2', title: '배정받은 락카에 신발 넣기', desc: '신발은 배정된 락카에 보관해 주세요.' },
  { n: '3', title: '방 · 좌석 자유 선택', desc: '입실 후 원하는 방과 자리를 자유롭게 이용하세요.' },
  { n: '4', title: '퇴실은 키오스크에서', desc: '먼저 키오스크에서 퇴실하면 신발장이 열립니다.' },
];

const FACILITIES = [
  { zone: 'Book Zone · 도서/서가', description: '수만 권 규모의 인기 웹툰 단행본, 순정·소년·액션 만화, 그래픽 노블. 매주 신간 업데이트와 도서 검색 전용 PC 비치.' },
  { zone: 'Media Zone · OTT 룸', description: '넷플릭스, 왓챠, 티빙, 디즈니+, 유튜브 프리미엄 시청이 가능한 대형 스크린과 아늑한 암막 굴방.' },
  { zone: 'Gaming Zone · 콘솔 룸', description: '닌텐도 스위치 및 PS4 멀티플레이 타이틀을 2~4인이 동시에 즐길 수 있는 콘솔 전용 좌석.' },
  { zone: 'Board Game Zone', description: '다빈치코드, 스플렌더, 카탄 등 프리미엄 보드게임 자유 이용.' },
  { zone: 'Healing Zone · 안마의자', description: '매장 이용 고객 누구나 100% 무료로 이용 가능한 고급 바디프랜드 안마의자 비치.' },
  { zone: 'Private Rooms · 좌석', description: '1~2인 복층 굴방, 리클라이너 소파석, 카페형 테이블석. 전 좌석 콘센트와 극세사 담요 제공.' },
  { zone: 'K-Ramen & F&B Bar', description: '즉석 라면 조리기계 완비. 계란·파·숙주·떡사리 무제한 무료 토핑 바 운영.' },
];

const AMENITIES = [
  '초고속 무료 Wi-Fi',
  '남/녀 구분 내부 화장실',
  '가글 · 머리끈 · 핸드크림 비치',
  '도서 검색 전용 PC',
  '무인 키오스크 셀프 입·퇴실',
];

import { usePageTitle } from '../../lib/usePageTitle';

export function PublicInfoPage({ kind }: { kind: 'games' | 'events' | 'store' }) {
  const titles = { games: '즐길거리', events: '진행 중인 이벤트', store: '매장 안내' };
  usePageTitle(titles[kind]);
  const [items, setItems] = useState<Item[] | null>(null);
  const [gameTab, setGameTab] = useState<'switch' | 'ps4' | 'board'>('switch');

  useEffect(() => {
    if (!supabase) {
      setItems([]);
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const query =
      kind === 'games'
        ? supabase.from('entertainment_items').select('id,title,players,genre,item_type,quantity').eq('is_verified', true).eq('is_available', true).is('archived_at', null)
        : kind === 'events'
        ? supabase.from('store_events').select('id,title,content,is_always_on').eq('is_public', true).is('archived_at', null).or('is_always_on.eq.true,and(start_date.lte.' + today + ',end_date.gte.' + today + ')')
        : null;

    if (query) {
      void query.then(({ data }) => setItems((data ?? []) as Item[]));
    }
  }, [kind]);

  // 1. 즐길거리 (Games) 화면
  if (kind === 'games') {
    const remoteType = gameTab === 'switch' ? 'NINTENDO' : gameTab === 'ps4' ? 'PLAYSTATION_4' : 'BOARD_GAME';
    const remoteGames = (items ?? []).filter((item) => item.item_type === remoteType);
    const fallbackGames = DEFAULT_GAMES[gameTab];
    // The local list keeps the public page accurate until the corresponding DB seed migration is applied.
    const list = remoteGames.length >= fallbackGames.length
      ? remoteGames.map((item) => ({ tag: gameTab === 'board' ? 'BOARD' : gameTab === 'switch' ? 'NSW' : 'PS4', title: item.title, en: item.quantity && item.quantity > 1 ? `${item.quantity}개` : '' }))
      : fallbackGames;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div className="section-kicker">ENTERTAINMENT</div>
          <h1 className="section-title">즐길거리</h1>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B6354', marginTop: '6px' }}>
            직원이 실물을 확인한 타이틀만 공개합니다. 이용 방법은 카운터에서 안내해 드려요.
          </p>
        </div>

        {/* 탭 버튼 */}
        <div className="chips-row">
          <button
            type="button"
            onClick={() => setGameTab('switch')}
            className={`chip ${gameTab === 'switch' ? 'active' : ''}`}
          >
            닌텐도 스위치 ({DEFAULT_GAMES.switch.length})
          </button>
          <button
            type="button"
            onClick={() => setGameTab('ps4')}
            className={`chip ${gameTab === 'ps4' ? 'active' : ''}`}
          >
            PlayStation 4 ({DEFAULT_GAMES.ps4.length})
          </button>
          <button
            type="button"
            onClick={() => setGameTab('board')}
            className={`chip ${gameTab === 'board' ? 'active' : ''}`}
          >
            보드게임 ({DEFAULT_GAMES.board.length})
          </button>
        </div>

        {/* 게임 그리드 */}
        <div className="game-grid">
          {list.map((g) => (
            <div key={g.title} className="game-card">
              <div className="game-tag-box">{g.tag}</div>
              <div style={{ minWidth: 0 }}>
                <div className="game-title-kr">{g.title}</div>
                <div className="game-title-en">{g.en}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 보드게임 배너 */}
        <div className="banner-card-yellow">
          <img src={gamingMascot} alt="게임 마스코트" style={{ width: '64px', height: '64px', objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '-0.02em' }}>
              인기 보드게임 상시 구비 & 자유 이용
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#5C5344', marginTop: '4px' }}>
              다빈치코드 · 스플렌더 · 카탄 · 루미큐브 클래식 등 20여 종 완비! 이용 후 다음 고객님을 위해 정리 정돈 부탁드립니다.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. 이벤트 · 제휴 (Events) 화면
  if (kind === 'events') {
    const publicEvents = loadManagedEvents().filter((ev) => {
      if (!ev.isPublic || ev.archivedAt) return false;
      if (ev.isAlwaysOn) return true;
      const today = new Date().toISOString().split('T')[0];
      return !ev.endDate || ev.endDate >= today;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <div className="section-kicker">EVENTS & PARTNERSHIP</div>
          <h1 className="section-title">이벤트 · 제휴</h1>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B6354', marginTop: '6px' }}>
            카툰플러스에서 진행 중인 제휴 혜택과 상시 이벤트를 확인하세요.
          </p>
        </div>

        {publicEvents.length > 0 ? (
          publicEvents.map((ev) => {
            const bullets = ev.detail.split(/[+\n·]/).map((s) => s.trim()).filter(Boolean);
            return (
              <div key={ev.id} className="event-poster-row">
                <div className="poster-box" style={{ background: '#2A2A2A', padding: '10px' }}>
                  <img
                    src={getBannerImageUrl(ev.bannerType, ev.customBannerUrl)}
                    alt={ev.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '22px 24px',
                    background: ev.isFeatured ? '#FFFDF5' : '#FFFFFF',
                    border: '3px solid #1E1E1E',
                    borderRadius: '24px',
                    boxShadow: '5px 5px 0 #1E1E1E',
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        background: '#1E1E1E',
                        color: '#FED943',
                        fontSize: '11px',
                        fontWeight: 900,
                        marginBottom: '10px',
                      }}
                    >
                      {ev.tag}
                    </span>
                    <div style={{ fontSize: '19px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.3 }}>
                      {ev.title}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#5C5344', marginTop: '4px' }}>
                      {ev.isAlwaysOn ? '상시 혜택 제공' : `${ev.startDate} ~ ${ev.endDate}`}
                      {ev.target ? ` · ${ev.target}` : ''}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {bullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          background: '#FFF9EC',
                          border: '2px solid #1E1E1E',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: 800,
                        }}
                      >
                        ✨ {bullet}
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#8A8175' }}>
                    * 현장 카운터 직원에게 문의 또는 인증 후 즉시 혜택이 적용됩니다.
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-search-box">
            <p style={{ fontWeight: 700, color: '#6B6354' }}>현재 진행 중인 이벤트가 없습니다.</p>
          </div>
        )}
      </div>
    );
  }

  // 3. 매장 안내 (Store) 화면
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div className="section-kicker">STORE INFO</div>
        <h1 className="section-title">매장 안내</h1>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B6354', marginTop: '6px' }}>
          서울대입구역 3번 출구 도보 1분, 연중무휴 편안한 힐링 공간입니다.
        </p>
      </div>

      {/* 영업 정보 & 4단계 이용 가이드 (2열) */}
      <div className="home-split">
        {/* 영업 정보 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            padding: '24px',
            background: '#ffffff',
            border: '3px solid #1E1E1E',
            borderRadius: '24px',
            boxShadow: '5px 5px 0 #1E1E1E',
          }}
        >
          <div style={{ fontSize: '17px', fontWeight: 900 }}>영업 정보</div>
          {STORE_ROWS.map((r) => (
            <div key={r.k} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '74px', flexShrink: 0, fontSize: '13px', fontWeight: 800, color: '#8A8175', paddingTop: '2px' }}>
                {r.k}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.55, minWidth: 0 }}>
                {r.v}
              </div>
            </div>
          ))}
          <a
            href="tel:0288880852"
            style={{
              alignSelf: 'flex-start',
              marginTop: 'auto',
              padding: '12px 20px',
              borderRadius: '999px',
              background: '#1E1E1E',
              color: '#FED943',
              fontSize: '13px',
              fontWeight: 800,
            }}
          >
            전화로 문의하기 (02-888-0852)
          </a>
        </div>

        {/* 4단계 이용 가이드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            padding: '24px',
            background: '#FFF9EC',
            border: '3px solid #1E1E1E',
            borderRadius: '24px',
            boxShadow: '5px 5px 0 #1E1E1E',
          }}
        >
          <div style={{ fontSize: '17px', fontWeight: 900 }}>이용 가이드</div>
          {GUIDE_STEPS.map((s) => (
            <div key={s.n} className="guide-step-card">
              <div className="step-num">{s.n}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.02em' }}>{s.title}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354', lineHeight: 1.5, marginTop: '2px' }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 공간 구성 7대 Zone */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          padding: '24px',
          background: '#ffffff',
          border: '3px solid #1E1E1E',
          borderRadius: '24px',
          boxShadow: '5px 5px 0 #1E1E1E',
        }}
      >
        <div style={{ fontSize: '17px', fontWeight: 900 }}>공간 구성</div>
        <div className="facility-grid">
          {FACILITIES.map((f) => (
            <div key={f.zone} className="facility-card">
              <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '-0.02em' }}>{f.zone}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B6354', lineHeight: 1.55 }}>
                {f.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 편의 사항 알약 칩 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '22px',
          background: '#FED943',
          border: '3px solid #1E1E1E',
          borderRadius: '24px',
          boxShadow: '5px 5px 0 #1E1E1E',
        }}
      >
        <div style={{ fontSize: '17px', fontWeight: 900 }}>편의 사항</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {AMENITIES.map((a) => (
            <span
              key={a}
              style={{
                padding: '9px 15px',
                borderRadius: '999px',
                background: '#FFF9EC',
                border: '2px solid #1E1E1E',
                fontSize: '12px',
                fontWeight: 800,
              }}
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* 매장 실물 사진 갤러리 (3장 그리드) */}
      <div className="photo-grid">
        <div className="photo-card">
          <img src={storePhoto1} alt="카툰플러스 입구 및 서가" />
        </div>
        <div className="photo-card">
          <img src={storePhoto2} alt="카툰플러스 복층 룸" />
        </div>
        <div className="photo-card">
          <img src={storePhoto3} alt="카툰플러스 은은한 독서 공간" />
        </div>
      </div>
    </div>
  );
}
