import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { useSelectedStaffStoreId, useStaffStore } from './StaffStoreContext';
import { publicStoreList } from '../../lib/storeContext';
import { getStaticStoreGames } from '../../lib/brandAssets';

export type Game = {
  id: string;
  title: string;
  item_type: string;
  players?: string;
  genre?: string;
  quantity?: number;
};

const labels: Record<string, string> = {
  NINTENDO: 'Nintendo Switch',
  PLAYSTATION_4: 'PlayStation 4/5',
  XBOX: 'Xbox',
  BOARD_GAME: '보드게임',
};

export function GamesPage() {
  const selectedStoreId = useSelectedStaffStoreId();
  const { selectedStoreSlug } = useStaffStore();
  const currentStore =
    publicStoreList.find((s) => s.slug === selectedStoreSlug) ?? publicStoreList[0];

  const [message, setMessage] = useState('');
  const [items, setItems] = useState<Game[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    if (!supabase || !selectedStoreId) {
      setItems(getStaticStoreGames(selectedStoreSlug) as Game[]);
      return;
    }
    const { data, error } = await supabase
      .from('entertainment_items')
      .select('id,title,item_type,players,genre,quantity')
      .eq('store_id', selectedStoreId)
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      setMessage(error.message);
      setItems(getStaticStoreGames(selectedStoreSlug) as Game[]);
    } else if (data && data.length > 0) {
      setItems(data as Game[]);
    } else {
      setItems(getStaticStoreGames(selectedStoreSlug) as Game[]);
    }
  };

  useEffect(() => {
    void load();
  }, [selectedStoreId, selectedStoreSlug]);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const newTitle = String(f.get('title')).trim();
    const newType = String(f.get('type'));
    const newPlayers = String(f.get('players') || '1-4인').trim();
    const newGenre = String(f.get('genre') || '기타').trim();

    if (!newTitle) return;

    if (supabase && selectedStoreId) {
      const { error } = await supabase.from('entertainment_items').insert({
        store_id: selectedStoreId,
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
      };
    setItems((prev) => [newItem, ...prev]);
    setMessage(`'${newTitle}' 게임을 검증 목록에 추가했습니다.`);
    e.currentTarget.reset();
  };

  const removeGame = async (item: Game) => {
    if (!window.confirm(`'${item.title}' 게임을 영구 삭제합니다. 복구할 수 없습니다.`)) return;
    if (supabase && !item.id.startsWith('g-') && !item.id.startsWith('custom-')) {
      const { error } = await supabase.from('entertainment_items').delete().eq('id', item.id);
      if (error) {
        setMessage(error.message);
        return;
      }
    }
    setItems((prev) => prev.filter((candidate) => candidate.id !== item.id));
    setMessage(`'${item.title}' 게임을 삭제했습니다.`);
  };

  const activeCount = items.length;

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div className="section-kicker">GAME VERIFICATION & INVENTORY · {currentStore.name}</div>
          <h1 className="section-title">게임 실물 검증 및 비치 현황</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#6B6354', fontWeight: 600 }}>
            {currentStore.name} 실물 비치 닌텐도 스위치, PlayStation, 보드게임 수량 및 공개 상태를 관리합니다.
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
          <span>{message}</span>
          <button
            onClick={() => setMessage('')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              fontWeight: 900,
              cursor: 'pointer',
            }}
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
        <form
          onSubmit={save}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            alignItems: 'end',
          }}
        >
          <div>
            <label
              style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}
            >
              플랫폼
            </label>
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
              <option value="NINTENDO">닌텐도 스위치</option>
              <option value="PLAYSTATION_4">PlayStation 4/5</option>
              <option value="BOARD_GAME">보드게임</option>
              <option value="XBOX">Xbox</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label
              style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}
            >
              게임 제목
            </label>
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
            <label
              style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}
            >
              플레이 인원
            </label>
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
            <label
              style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}
            >
              장르 / 특징
            </label>
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 900 }}>
            비치된 게임 목록 ({filteredItems.length}종)
          </div>

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
                const count =
                  key === 'ALL' ? items.length : items.filter((i) => i.item_type === key).length;
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            {filteredItems.map((item) => {
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
                    background: '#FFF9EC',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
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
                        {labels[item.item_type] ?? item.item_type}
                      </span>
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '6px',
                          background: '#D6F5E3',
                          color: '#1A7A3E',
                          fontSize: '11px',
                          fontWeight: 800,
                        }}
                      >
                        고객 화면 공개
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 900,
                        color: '#1E1E1E',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </div>

                    {(item.players || item.genre) && (
                      <div
                        style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}
                      >
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
                            {item.players}
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
                            {item.genre}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      paddingTop: '8px',
                      borderTop: '1px dashed #D3CEC4',
                    }}
                  >
                    <button
                      onClick={() => void removeGame(item)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '12px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      삭제
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
