import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { validateInventoryCsv } from '../../lib/inventoryImport';
import { parseBaselineInventory } from '../../lib/inventoryCsv';
import { supabase } from '../../lib/supabase';
import { Pagination } from '../common/Pagination';

interface InventoryItem {
  id: string;
  volume_range: string;
  shelf_location: string;
  archived_at: string | null;
  books: { title: string; author: string; category: string }[];
}

export function InventoryPage() {
  const [searchParams] = useSearchParams();
  const defaultTitle = searchParams.get('title') || '';
  const defaultAuthor = searchParams.get('author') || '';
  const defaultVolume = searchParams.get('volume') || '';

  const [message, setMessage] = useState('');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const load = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('book_inventories')
      .select('id,volume_range,shelf_location,archived_at,books(title,author,category)')
      .order('updated_at', { ascending: false });

    if (error) setMessage(error.message);
    else setItems(data ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (form: FormData) => {
    if (!supabase) return;
    const { error } = await supabase.rpc('upsert_inventory', {
      p_title: String(form.get('title')),
      p_author: String(form.get('author')),
      p_category: String(form.get('category')),
      p_volume_range: String(form.get('volume')),
      p_shelf_location: String(form.get('shelf')),
    });
    setMessage(error?.message ?? '도서 재고를 저장했습니다.');
    if (!error) {
      await load();
      form.delete('title');
      form.delete('author');
      form.delete('category');
      form.delete('volume');
      form.delete('shelf');
    }
  };

  const importCsv = async (file: File) => {
    if (!supabase) return;
    const text = await file.text();
    const validation = validateInventoryCsv(text);
    if (validation) return setMessage(validation);

    let done = 0;
    for (const book of parseBaselineInventory(text)) {
      const { error } = await supabase.rpc('upsert_inventory', {
        p_title: book.title,
        p_author: book.author,
        p_category: book.category,
        p_volume_range: book.volumeRange,
        p_shelf_location: book.shelfLocation,
      });
      if (!error) done++;
    }
    setMessage(`${done}건의 재고 데이터를 업데이트했습니다.`);
    await load();
  };

  const archive = async (id: string, archived: boolean) => {
    if (!supabase) return;
    const { error } = await supabase.rpc('set_inventory_archive', {
      p_inventory_id: id,
      p_archived: archived,
    });
    setMessage(error?.message ?? (archived ? '재고를 보관 처리했습니다.' : '재고를 복구했습니다.'));
    if (!error) await load();
  };

  // 검색 필터링
  const filteredItems = useMemo(() => {
    if (!searchFilter) return items;
    const q = searchFilter.toLowerCase();
    return items.filter(
      (item) =>
        item.books[0]?.title.toLowerCase().includes(q) ||
        item.books[0]?.author.toLowerCase().includes(q) ||
        item.volume_range.toLowerCase().includes(q) ||
        item.shelf_location.toLowerCase().includes(q)
    );
  }, [items, searchFilter]);

  // 페이지네이션 슬라이싱
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#8A6A00', letterSpacing: '0.08em' }}>STAFF INVENTORY</span>
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginTop: '2px' }}>도서 재고 관리</h1>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354', marginTop: '4px' }}>
          단건 등록 및 Caspio CSV 대량 가져오기를 통해 현재 서가 내 실물 재고를 관리합니다.
        </p>
      </div>

      {message && (
        <div style={{ padding: '12px 18px', background: '#FFF3C9', border: '2px solid #1E1E1E', borderRadius: '14px', fontSize: '13px', fontWeight: 800 }}>
          🔔 {message}
        </div>
      )}

      {/* 등록 및 CSV 가져오기 */}
      <section
        style={{
          background: '#FFFFFF',
          border: '3px solid #1E1E1E',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '5px 5px 0 #1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900 }}>➕ 신규 도서 등록 및 CSV 업로드</h2>
          <label
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              background: '#FED943',
              border: '2px solid #1E1E1E',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📁 CSV 대량 가져오기
            <input
              type="file"
              accept=".csv,text/csv"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void importCsv(file);
              }}
            />
          </label>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save(new FormData(e.currentTarget));
          }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}
        >
          <input name="title" defaultValue={defaultTitle} placeholder="도서명 *" required style={{ padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '13px' }} />
          <input name="author" defaultValue={defaultAuthor} placeholder="작가명" style={{ padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '13px' }} />
          <input name="category" placeholder="장르 (예: 액션/소년)" style={{ padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '13px' }} />
          <input name="volume" defaultValue={defaultVolume} placeholder="권수 (예: 1~22권) *" required style={{ padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '13px' }} />
          <input name="shelf" placeholder="서가 (예: A-03) *" required style={{ padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '13px' }} />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#1E1E1E',
              color: '#FED943',
              fontSize: '13px',
              fontWeight: 900,
              border: '2px solid #1E1E1E',
              cursor: 'pointer',
            }}
          >
            저장
          </button>
        </form>
      </section>

      {/* 재고 목록 & 검색 & 페이징 */}
      <section
        style={{
          background: '#FFFFFF',
          border: '3px solid #1E1E1E',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '5px 5px 0 #1E1E1E',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900 }}>
              📚 등록 도서 목록 ({filteredItems.length}권)
            </h2>
          </div>
          <input
            type="search"
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="목록 내 검색 (도서명, 작가, 서가)"
            style={{
              padding: '8px 14px',
              borderRadius: '999px',
              border: '2px solid #1E1E1E',
              fontSize: '13px',
              width: '240px',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {paginatedItems.map((item) => {
            const b = item.books[0];
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: item.archived_at ? '#ECEFF1' : '#FFFDF5',
                  border: '1.5px solid #1E1E1E',
                  borderRadius: '12px',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px' }}>{b?.title || '제목 없음'}</strong>
                    <span style={{ fontSize: '11px', color: '#6B6354' }}>{b?.author || '작가 미상'}</span>
                    {b?.category && (
                      <span style={{ fontSize: '10px', padding: '1px 6px', background: '#FFFFFF', border: '1px solid #1E1E1E', borderRadius: '4px' }}>
                        {b.category}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8A6A00', fontWeight: 700, marginTop: '2px' }}>
                    {item.volume_range} · 서가 위치: {item.shelf_location}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: item.archived_at ? '#D32F2F' : '#2E7D32' }}>
                    {item.archived_at ? '보관됨' : '공개 중'}
                  </span>
                  <button
                    type="button"
                    onClick={() => void archive(item.id, !item.archived_at)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #1E1E1E',
                      background: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {item.archived_at ? '복구' : '보관'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredItems.length}
          pageSize={pageSize}
          pageSizeOptions={[20, 50, 100]}
          onPageSizeChange={setPageSize}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
