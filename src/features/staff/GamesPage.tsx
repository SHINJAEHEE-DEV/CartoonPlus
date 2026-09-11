import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';

export type Game = {
  id: string;
  title: string;
  item_type: string;
  players?: string;
  genre?: string;
  archived_at: string | null;
};

const labels: Record<string, string> = {
  NINTENDO: 'Nintendo Switch',
  PLAYSTATION_4: 'PlayStation 4/5',
  XBOX: 'Xbox',
  BOARD_GAME: '보드게임',
};

const platformEmojis: Record<string, string> = {
  NINTENDO: '🎮',
  PLAYSTATION_4: '🕹️',
  XBOX: '🎯',
  BOARD_GAME: '🎲',
};

const INITIAL_GAMES: Game[] = [
  // 1. 닌텐도 스위치 (8종)
  { id: 'g-nsw-01', title: '슈퍼 마리오 파티 잼버리', item_type: 'NINTENDO', players: '1-4인', genre: '파티/보드', archived_at: null },
  { id: 'g-nsw-02', title: '오버쿡드! 올유캔잇', item_type: 'NINTENDO', players: '1-4인', genre: '협동 요리', archived_at: null },
  { id: 'g-nsw-03', title: '폴가이즈 (Fall Guys)', item_type: 'NINTENDO', players: '1-4인', genre: '배틀로얄 파티', archived_at: null },
  { id: 'g-nsw-04', title: '슈퍼 버니 맨 (Super Bunny Man)', item_type: 'NINTENDO', players: '2인 전용', genre: '협동 액션', archived_at: null },
  { id: 'g-nsw-05', title: '태고의 달인 쿵딱! 원더풀 페스티벌', item_type: 'NINTENDO', players: '1-2인', genre: '리듬 액션 (북 컨트롤러)', archived_at: null },
  { id: 'g-nsw-06', title: '슈퍼 커비 헌터즈', item_type: 'NINTENDO', players: '1-4인', genre: '액션 RPG', archived_at: null },
  { id: 'g-nsw-07', title: '포켓몬 챔피언스', item_type: 'NINTENDO', players: '1-2인', genre: '배틀/어드벤처', archived_at: null },
  { id: 'g-nsw-08', title: '리듬 세상 더 베스트 플러스', item_type: 'NINTENDO', players: '1-4인', genre: '리듬 게임', archived_at: null },

  // 2. PlayStation 4 / 5 (12종)
  { id: 'g-ps4-01', title: '잇 테익스 투 (It Takes Two)', item_type: 'PLAYSTATION_4', players: '2인 전용', genre: '협동 어드벤처 (최고인기)', archived_at: null },
  { id: 'g-ps4-02', title: '휴먼: 폴 플랫 (Human Fall Flat)', item_type: 'PLAYSTATION_4', players: '1-2인', genre: '물리 퍼즐/액션', archived_at: null },
  { id: 'g-ps4-03', title: '오버쿡드 2 (Overcooked! 2)', item_type: 'PLAYSTATION_4', players: '1-4인', genre: '협동 요리', archived_at: null },
  { id: 'g-ps4-04', title: '무빙 아웃 (Moving Out)', item_type: 'PLAYSTATION_4', players: '1-4인', genre: '협동 이사 액션', archived_at: null },
  { id: 'g-ps4-05', title: '리틀 나이트메어 2 (Little Nightmares II)', item_type: 'PLAYSTATION_4', players: '1인', genre: '서스펜스 어드벤처', archived_at: null },
  { id: 'g-ps4-06', title: '노바디 세이브즈 더 월드', item_type: 'PLAYSTATION_4', players: '1-2인', genre: '액션 RPG', archived_at: null },
  { id: 'g-ps4-07', title: '태고의 달인 모두 함께 쿵딱쿵!', item_type: 'PLAYSTATION_4', players: '1-2인', genre: '리듬 액션', archived_at: null },
  { id: 'g-ps4-08', title: '브롤할라 (Brawlhalla)', item_type: 'PLAYSTATION_4', players: '1-4인', genre: '난투 대전 액션', archived_at: null },
  { id: 'g-ps4-09', title: '드래곤볼 제노버스 2', item_type: 'PLAYSTATION_4', players: '1-2인', genre: '격투 액션', archived_at: null },
  { id: 'g-ps4-10', title: '로블록스 (Roblox)', item_type: 'PLAYSTATION_4', players: '1-4인', genre: '샌드박스 파티', archived_at: null },
  { id: 'g-ps4-11', title: '포트나이트 (Fortnite)', item_type: 'PLAYSTATION_4', players: '1-4인', genre: '배틀로얄/슈팅', archived_at: null },
  { id: 'g-ps4-12', title: '이풋볼 (eFootball™)', item_type: 'PLAYSTATION_4', players: '1-2인', genre: '축구 스포츠', archived_at: null },

  // 3. 실물 보드게임 (40여종)
  { id: 'g-bg-01', title: '다빈치코드 (Da Vinci Code)', item_type: 'BOARD_GAME', players: '2-4인', genre: '숫자 추리 (3세트 보유)', archived_at: null },
  { id: 'g-bg-02', title: '루미큐브 클래식 (Rummikub)', item_type: 'BOARD_GAME', players: '2-4인', genre: '숫자 조합 전략 (스테디셀러)', archived_at: null },
  { id: 'g-bg-03', title: '스플렌더 (Splendor)', item_type: 'BOARD_GAME', players: '2-4인', genre: '보석 자원 엔진빌딩 (2세트 보유)', archived_at: null },
  { id: 'g-bg-04', title: '스플렌더 확장: 찬란한 도시', item_type: 'BOARD_GAME', players: '2-4인', genre: '스플렌더 공식 확장판', archived_at: null },
  { id: 'g-bg-05', title: '시타델 (Citadels)', item_type: 'BOARD_GAME', players: '2-8인', genre: '직업 블러핑/도시 건설 (2세트)', archived_at: null },
  { id: 'g-bg-06', title: '라스베가스 (Las Vegas)', item_type: 'BOARD_GAME', players: '2-5인', genre: '카지노 주사위 베팅', archived_at: null },
  { id: 'g-bg-07', title: '카탄 (Catan)', item_type: 'BOARD_GAME', players: '3-4인', genre: '자원 채취 & 무역 영토확장', archived_at: null },
  { id: 'g-bg-08', title: '뱅! (BANG!)', item_type: 'BOARD_GAME', players: '4-7인', genre: '서부 총잡이 마피아 게임', archived_at: null },
  { id: 'g-bg-09', title: '로스트 시티 (Lost Cities)', item_type: 'BOARD_GAME', players: '2인 전용', genre: '2인 카드 탐험 (2세트)', archived_at: null },
  { id: 'g-bg-10', title: '텔레스트레이션 (Telestrations)', item_type: 'BOARD_GAME', players: '4-8인', genre: '릴레이 스케치 파티 게임', archived_at: null },
  { id: 'g-bg-11', title: '루핑루이 (Loopin Louie)', item_type: 'BOARD_GAME', players: '2-4인', genre: '순발력 비행기 튕기기', archived_at: null },
  { id: 'g-bg-12', title: '우봉고 (Ubongo)', item_type: 'BOARD_GAME', players: '1-4인', genre: '스피드 도형 퍼즐 맞추기', archived_at: null },
  { id: 'g-bg-13', title: '젬블로 (Gemblo)', item_type: 'BOARD_GAME', players: '1-6인', genre: '육각형 보석 영역 확장', archived_at: null },
  { id: 'g-bg-14', title: '콰르토 (Quarto)', item_type: 'BOARD_GAME', players: '2인 전용', genre: '멘사 추천 4목 추상 전략', archived_at: null },
  { id: 'g-bg-15', title: '라비린스 (Labyrinth)', item_type: 'BOARD_GAME', players: '2-4인', genre: '움직이는 미로 보물찾기', archived_at: null },
  { id: 'g-bg-16', title: '오델로 클래식 (Othello)', item_type: 'BOARD_GAME', players: '2인 전용', genre: '정통 흑백 뒤집기 리버시', archived_at: null },
  { id: 'g-bg-17', title: '체스 & 체커 (Chess & Checkers)', item_type: 'BOARD_GAME', players: '2인 전용', genre: '정통 전략 보드게임 세트', archived_at: null },
  { id: 'g-bg-18', title: '뒤죽박죽 서커스', item_type: 'BOARD_GAME', players: '2-4인', genre: '서커스 캐릭터 균형 쌓기', archived_at: null },
  { id: 'g-bg-19', title: '루빅스 레이스 (Rubik\'s Race)', item_type: 'BOARD_GAME', players: '2인 전용', genre: '스피드 슬라이딩 큐브 대결', archived_at: null },
  { id: 'g-bg-20', title: '요트 다이스 (Yacht Dice)', item_type: 'BOARD_GAME', players: '1-4인', genre: '주사위 조합 족보 게임', archived_at: null },
  { id: 'g-bg-21', title: '반지의 제왕 보드게임', item_type: 'BOARD_GAME', players: '2-5인', genre: '판타지 테마 협동 모험', archived_at: null },
  { id: 'g-bg-22', title: 'ACUITY (어큐어티)', item_type: 'BOARD_GAME', players: '2-6인', genre: '시각 패턴 인지 퍼즐', archived_at: null },
  { id: 'g-bg-23', title: '할리갈리 디럭스 (Halli Galli)', item_type: 'BOARD_GAME', players: '2-6인', genre: '과일 5개 종치기 순발력', archived_at: null },
  { id: 'g-bg-24', title: '할리갈리 컵스', item_type: 'BOARD_GAME', players: '2-4인', genre: '색상 컵 쌓기 대결', archived_at: null },
  { id: 'g-bg-25', title: '클루 (Clue)', item_type: 'BOARD_GAME', players: '2-6인', genre: '살인 사건 정통 추리', archived_at: null },
  { id: 'g-bg-26', title: '치킨 차차차 (Zicke Zacke)', item_type: 'BOARD_GAME', players: '2-4인', genre: '기억력 닭 꼬리잡기', archived_at: null },
  { id: 'g-bg-27', title: '모노폴리 클래식', item_type: 'BOARD_GAME', players: '2-6인', genre: '세계 부동산 투자 거래', archived_at: null },
  { id: 'g-bg-28', title: '모노폴리 K-부동산 (서울)', item_type: 'BOARD_GAME', players: '2-6인', genre: '국내 부동산 투자 보드게임', archived_at: null },
  { id: 'g-bg-29', title: '인생게임 (The Game of Life)', item_type: 'BOARD_GAME', players: '2-6인', genre: '직업/결혼/은퇴 인생 시뮬레이션', archived_at: null },
  { id: 'g-bg-30', title: '젠가 클래식 (Jenga)', item_type: 'BOARD_GAME', players: '1-8인', genre: '원목 블록 빼기 파티', archived_at: null },
  { id: 'g-bg-31', title: '상어 아일랜드 (Shark Island)', item_type: 'BOARD_GAME', players: '2-4인', genre: '상어 피해 달아나기 레이스', archived_at: null },
  { id: 'g-bg-32', title: '도블 (Dobble)', item_type: 'BOARD_GAME', players: '2-8인', genre: '같은 그림 찾기 스피드', archived_at: null },
];

export function GamesPage() {
  const [message, setMessage] = useState('');
  const [items, setItems] = useState<Game[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    if (!supabase) {
      setItems(INITIAL_GAMES);
      return;
    }
    const { data, error } = await supabase
      .from('entertainment_items')
      .select('id,title,item_type,players,genre,archived_at')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      setItems(INITIAL_GAMES);
    } else {
      // 기존 저장된 데이터 + 누락된 기본 데이터를 결합하여 표시
      const existingTitles = new Set(data.map((d) => d.title));
      const missingDefaults = INITIAL_GAMES.filter((g) => !existingTitles.has(g.title));
      setItems([...(data as Game[]), ...missingDefaults]);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const newTitle = String(f.get('title')).trim();
    const newType = String(f.get('type'));
    const newPlayers = String(f.get('players') || '1-4인').trim();
    const newGenre = String(f.get('genre') || '기타').trim();

    if (!newTitle) return;

    if (supabase) {
      const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
      const { error } = await supabase.from('entertainment_items').insert({
        store_id: store?.id,
        item_type: newType,
        title: newTitle,
        players: newPlayers,
        genre: newGenre,
        is_verified: true,
        is_available: true,
      });
      if (error) {
        setMessage(`저장 실패: ${error.message}`);
        return;
      }
    }

    // 로컬 상태 즉시 추가
    const newItem: Game = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      item_type: newType,
      players: newPlayers,
      genre: newGenre,
      archived_at: null,
    };
    setItems((prev) => [newItem, ...prev]);
    setMessage(`'${newTitle}' 게임을 검증 목록에 추가했습니다.`);
    e.currentTarget.reset();
  };

  const archive = async (item: Game) => {
    const nextArchivedAt = item.archived_at ? null : new Date().toISOString();
    if (supabase && !item.id.startsWith('g-') && !item.id.startsWith('custom-')) {
      await supabase
        .from('entertainment_items')
        .update({ archived_at: nextArchivedAt })
        .eq('id', item.id);
    }
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, archived_at: nextArchivedAt } : i))
    );
    setMessage(item.archived_at ? `'${item.title}' 게임을 공개로 복구했습니다.` : `'${item.title}' 게임을 보관 처리했습니다.`);
  };

  const activeCount = items.filter((x) => !x.archived_at).length;
  const archivedCount = items.filter((x) => x.archived_at).length;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = currentTab === 'ALL' || item.item_type === currentTab;
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.genre && item.genre.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [items, currentTab, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* 헤더 및 통계 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="section-kicker">GAME VERIFICATION & INVENTORY</div>
          <h1 className="section-title">게임 실물 검증 및 비치 현황</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#6B6354', fontWeight: 600 }}>
            서울대입구역점 실물 비치 닌텐도 스위치 8종, PS4 12종, 보드게임 40여종의 수량 및 공개 상태를 관리합니다.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              background: '#D6F5E3',
              border: '2px solid #1E1E1E',
              fontSize: '13px',
              fontWeight: 800,
              color: '#1A7A3E',
            }}
          >
            ● 공개 중 {activeCount}건
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              background: '#FFF9EC',
              border: '2px solid #1E1E1E',
              fontSize: '13px',
              fontWeight: 800,
              color: '#6B6354',
            }}
          >
            📦 보관 {archivedCount}건
          </div>
        </div>
      </div>

      {/* 상태 메시지 배너 */}
      {message && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            background: '#FFF3C9',
            border: '2px solid #1E1E1E',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>🎮 {message}</span>
          <button
            onClick={() => setMessage('')}
            style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 900, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. 신규 게임 등록 폼 카드 */}
      <div
        style={{
          background: '#ffffff',
          border: '3px solid #1E1E1E',
          borderRadius: '22px',
          padding: '24px',
          boxShadow: '4px 4px 0 #1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: 900 }}>+ 신규 실물 게임/보드게임 추가</div>
        <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>플랫폼</label>
            <select
              name="type"
              defaultValue="NINTENDO"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '2px solid #1E1E1E',
                fontWeight: 800,
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            >
              <option value="NINTENDO">🎮 닌텐도 스위치</option>
              <option value="PLAYSTATION_4">🕹️ PlayStation 4/5</option>
              <option value="BOARD_GAME">🎲 보드게임</option>
              <option value="XBOX">🎯 Xbox</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>게임 제목</label>
            <input
              name="title"
              placeholder="예: 슈퍼 마리오 오디세이 / 스플렌더"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '2px solid #1E1E1E',
                fontWeight: 700,
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>플레이 인원</label>
            <input
              name="players"
              placeholder="예: 1-4인 / 2-8인"
              defaultValue="1-4인"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '2px solid #1E1E1E',
                fontWeight: 700,
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>장르 / 특징</label>
            <input
              name="genre"
              placeholder="예: 파티 / 액션 / 전략"
              defaultValue="파티/액션"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '2px solid #1E1E1E',
                fontWeight: 700,
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '11px 18px',
                borderRadius: '10px',
                background: '#FED943',
                color: '#1E1E1E',
                border: '2.5px solid #1E1E1E',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '2px 2px 0 #1E1E1E',
              }}
            >
              검증 후 즉시 공개 ↵
            </button>
          </div>
        </form>
      </div>

      {/* 2. 검색 & 플랫폼 탭 필터 & 목록 */}
      <div
        style={{
          background: '#ffffff',
          border: '3px solid #1E1E1E',
          borderRadius: '22px',
          padding: '24px',
          boxShadow: '4px 4px 0 #1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>📦 비치된 게임 목록 ({filteredItems.length}종)</div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="게임명 또는 장르 검색..."
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1.5px solid #1E1E1E',
                fontSize: '12px',
                fontWeight: 600,
                minWidth: '180px',
              }}
            />

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                ['ALL', '전체'],
                ['NINTENDO', '닌텐도 스위치'],
                ['PLAYSTATION_4', 'PlayStation'],
                ['BOARD_GAME', '보드게임'],
                ['XBOX', 'Xbox'],
              ].map(([key, label]) => {
                const count = key === 'ALL' ? items.length : items.filter((i) => i.item_type === key).length;
                const active = currentTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setCurrentTab(key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      border: '2px solid #1E1E1E',
                      background: active ? '#FED943' : '#FFF',
                      fontWeight: 900,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div
            style={{
              padding: '36px',
              textAlign: 'center',
              color: '#8A8175',
              background: '#FAF9F6',
              border: '2px dashed #D3CEC4',
              borderRadius: '16px',
              fontWeight: 700,
            }}
          >
            검색 또는 선택된 카테고리에 해당하는 게임이 없습니다.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {filteredItems.map((item) => {
              const isArchived = Boolean(item.archived_at);
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '2.5px solid #1E1E1E',
                    background: isArchived ? '#F5F3EF' : '#FFF9EC',
                    opacity: isArchived ? 0.7 : 1,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#1E1E1E',
                          color: '#FED943',
                          fontSize: '11px',
                          fontWeight: 900,
                        }}
                      >
                        {platformEmojis[item.item_type] ?? '🎮'} {labels[item.item_type] ?? item.item_type}
                      </span>
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '6px',
                          background: isArchived ? '#E0DCD3' : '#D6F5E3',
                          color: isArchived ? '#6B6354' : '#1A7A3E',
                          fontSize: '11px',
                          fontWeight: 800,
                        }}
                      >
                        {isArchived ? '보관됨' : '고객 화면 공개'}
                      </span>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#1E1E1E', lineHeight: 1.3 }}>
                      {item.title}
                    </div>

                    {(item.players || item.genre) && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                        {item.players && (
                          <span
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: '#FFF',
                              border: '1px solid #1E1E1E',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            👥 {item.players}
                          </span>
                        )}
                        {item.genre && (
                          <span
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: '#FFF',
                              border: '1px solid #1E1E1E',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            🏷️ {item.genre}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px dashed #D3CEC4' }}>
                    <button
                      onClick={() => void archive(item)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: isArchived ? '#FED943' : '#FFFFFF',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '12px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      {isArchived ? '공개 복구 ⟲' : '비치 보관 처리'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


