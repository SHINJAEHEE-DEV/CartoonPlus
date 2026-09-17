import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { validateInventoryCsv } from '../../lib/inventoryImport';
import {
  isHongdaeInventoryCsv,
  isJamsilInventoryCsv,
  parseBaselineInventory,
  parseHongdaeInventoryCsv,
  parseJamsilInventoryCsv,
} from '../../lib/inventoryCsv';
import { supabase } from '../../lib/supabase';
import { Pagination } from '../common/Pagination';
import { useSelectedStaffStoreId } from './StaffStoreContext';
import { normalizeBookCategory, splitBookCategories } from '../../lib/bookSearch';

type InventoryBook = { title: string; author: string; category: string };
const GENRE_OPTIONS = ['소년', '순정', '판타지', 'SF', '액션', '로맨스', '스릴러', '아이, 교육'];

interface InventoryItem {
  id: string;
  last_volume: number | null;
  volume_range: string;
  shelf_location: string;
  books: InventoryBook | InventoryBook[] | null;
}

function getBook(item: InventoryItem): InventoryBook | undefined {
  return Array.isArray(item.books) ? item.books[0] : (item.books ?? undefined);
}

export function InventoryPage() {
  const selectedStoreId = useSelectedStaffStoreId();
  const [searchParams] = useSearchParams();
  const defaultTitle = searchParams.get('title') || '';
  const defaultAuthor = searchParams.get('author') || '';
  const defaultVolume = searchParams.get('volume') || '';

  const [message, setMessage] = useState('');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [genreTags, setGenreTags] = useState<string[]>([]);

  const load = async () => {
    if (!supabase) return;
    if (!selectedStoreId) {
      setItems([]);
      return;
    }
    const { data, error } = await supabase
      .from('book_inventories')
      .select('id,last_volume,volume_range,shelf_location,books(title,author,category)')
      .eq('store_id', selectedStoreId)
      .order('updated_at', { ascending: false });

    if (error) setMessage(error.message);
    else setItems(data ?? []);
  };

  useEffect(() => {
    void load();
  }, [selectedStoreId]);

  const save = async (form: FormData) => {
    if (!supabase) return;
    if (!selectedStoreId) return;
    const { error } = await supabase.rpc('upsert_inventory_for_store', {
      p_store_id: selectedStoreId,
      p_title: String(form.get('title')),
      p_author: String(form.get('author')),
      p_category: normalizeBookCategory(genreTags.join(',')),
      p_last_volume: Number(form.get('volume')),
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

    const storeImport = isJamsilInventoryCsv(text)
      ? { storeSlug: 'jamsil', storeName: '잠실점', ...parseJamsilInventoryCsv(text) }
      : isHongdaeInventoryCsv(text)
        ? { storeSlug: 'hongdae', storeName: '홍대점', ...parseHongdaeInventoryCsv(text) }
        : null;
    if (storeImport?.ambiguousTitles.length) {
      return setMessage(
        `${storeImport.storeName} CSV에 검토가 필요한 제목이 ${storeImport.ambiguousTitles.length}건 있습니다: ${storeImport.ambiguousTitles.slice(0, 3).join(', ')}`
      );
    }

    const books = storeImport?.books ?? parseBaselineInventory(text);
    let targetStoreId: string | null = null;
    if (storeImport) {
      const { data, error } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', storeImport.storeSlug)
        .single();
      if (error || !data)
        return setMessage(error?.message ?? `${storeImport.storeName} 정보를 찾을 수 없습니다.`);
      targetStoreId = data.id;
    }

    let done = 0;
    let failed = 0;
    for (const book of books) {
      const payload = {
        p_title: book.title,
        p_author: book.author,
        p_category: book.category,
        p_last_volume: Number(/(\d+)[^\d]*$/u.exec(book.volumeRange)?.[1]) || null,
        p_shelf_location: book.shelfLocation,
      };
      const { error } = targetStoreId
        ? await supabase.rpc('upsert_inventory_for_store', {
            p_store_id: targetStoreId,
            ...payload,
          })
        : await supabase.rpc('upsert_inventory', payload);
      if (error) failed++;
      else done++;
    }
    setMessage(
      `${done}건의 재고 데이터를 업데이트했습니다.${failed ? ` ${failed}건은 반영하지 못했습니다.` : ''}${storeImport ? ` ${storeImport.storeName} 재고만 반영했습니다.` : ''}`
    );
    await load();
  };

  const removeInventory = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm('이 지점의 재고만 영구 삭제합니다. 복구할 수 없습니다.')) return;
    const { error } = await supabase.from('book_inventories').delete().eq('id', id);
    setMessage(error?.message ?? '재고를 삭제했습니다.');
    if (!error) await load();
  };

  // 검색 필터링
  const filteredItems = useMemo(() => {
    if (!searchFilter) return items;
    const q = searchFilter.toLowerCase();
    return items.filter((item) => {
      const book = getBook(item);
      return (
        book?.title.toLowerCase().includes(q) ||
        book?.author.toLowerCase().includes(q) ||
        item.volume_range.toLowerCase().includes(q) ||
        item.shelf_location.toLowerCase().includes(q)
      );
    });
  }, [items, searchFilter]);

  // 페이지네이션 슬라이싱
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const knownBooks = useMemo(
    () =>
      items
        .map(getBook)
        .filter((book): book is InventoryBook => Boolean(book))
        .sort((a, b) => a.title.localeCompare(b.title, 'ko')),
    [items]
  );
  const knownGenres = useMemo(
    () => [...new Set(knownBooks.flatMap((book) => splitBookCategories(book.category)))],
    [knownBooks]
  );

  return (
    <main className="staff-page-container">
      <div>
        <span
          style={{ fontSize: '12px', fontWeight: 900, color: '#8A6A00', letterSpacing: '0.08em' }}
        >
          STAFF INVENTORY
        </span>
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginTop: '2px' }}>도서 재고 관리</h1>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354', marginTop: '4px' }}>
          단건 등록 및 Caspio CSV 대량 가져오기를 통해 현재 서가 내 실물 재고를 관리합니다.
        </p>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 18px',
            background: '#FFF3C9',
            border: '2px solid #1E1E1E',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 800,
          }}
        >
          {message}
        </div>
      )}

      {/* 등록 및 CSV 가져오기 */}
      <section className="staff-section-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h2 style={{ fontSize: '17px', fontWeight: 900 }}>➕ 신규 도서 등록 및 CSV 업로드</h2>
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
              boxShadow: '1.5px 1.5px 0 #1E1E1E',
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
          className="staff-form-grid"
        >
          <input
            name="title"
            defaultValue={defaultTitle}
            placeholder="도서명 *"
            required
            list="inventory-book-titles"
            onChange={(event) => {
              const match = knownBooks.find((book) => book.title === event.currentTarget.value);
              if (!match) return;
              const form = event.currentTarget.form;
              const author = form?.elements.namedItem('author') as HTMLInputElement | null;
              if (author) author.value = match.author;
              setGenreTags(splitBookCategories(match.category));
            }}
            style={{
              padding: '11px 13px',
              borderRadius: '12px',
              border: '2px solid #1E1E1E',
              fontSize: '13px',
            }}
          />
          <datalist id="inventory-book-titles">
            {knownBooks.map((book) => (
              <option key={`${book.title}-${book.author}`} value={book.title}>
                {book.author}
              </option>
            ))}
          </datalist>
          <input
            name="author"
            defaultValue={defaultAuthor}
            placeholder="작가명"
            style={{
              padding: '11px 13px',
              borderRadius: '12px',
              border: '2px solid #1E1E1E',
              fontSize: '13px',
            }}
          />
          <input type="hidden" name="category" value={genreTags.join(',')} />
          <input
            placeholder="장르 입력 후 Enter 또는 쉼표"
            style={{
              padding: '11px 13px',
              borderRadius: '12px',
              border: '2px solid #1E1E1E',
              fontSize: '13px',
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ',') return;
              event.preventDefault();
              const values = splitBookCategories(event.currentTarget.value);
              setGenreTags((tags) => [...new Set([...tags, ...values])]);
              event.currentTarget.value = '';
            }}
            list="inventory-genres"
          />
          <datalist id="inventory-genres">
            {[...new Set([...GENRE_OPTIONS, ...knownGenres])].map((genre) => (
              <option key={genre} value={genre} />
            ))}
          </datalist>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', gridColumn: '1 / -1' }}>
            {GENRE_OPTIONS.map((genre) => {
              const isSelected = genreTags.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() =>
                    setGenreTags((tags) =>
                      tags.includes(genre) ? tags.filter((tag) => tag !== genre) : [...tags, genre]
                    )
                  }
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: '1.5px solid #1E1E1E',
                    background: isSelected ? '#1E1E1E' : '#FFF9EC',
                    color: isSelected ? '#FED943' : '#1E1E1E',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {genre}
                </button>
              );
            })}
            {genreTags.map((genre) => (
              <span
                key={genre}
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#8A6A00',
                  alignSelf: 'center',
                }}
              >
                #{genre}
              </span>
            ))}
          </div>
          <input
            name="volume"
            defaultValue={defaultVolume.replace(/\D/g, '')}
            placeholder="마지막 권수 (예: 22)"
            type="number"
            min="1"
            inputMode="numeric"
            required
            style={{
              padding: '11px 13px',
              borderRadius: '12px',
              border: '2px solid #1E1E1E',
              fontSize: '13px',
            }}
          />
          <input
            name="shelf"
            placeholder="서가 (예: A-03) *"
            required
            style={{
              padding: '11px 13px',
              borderRadius: '12px',
              border: '2px solid #1E1E1E',
              fontSize: '13px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '11px 20px',
              borderRadius: '12px',
              background: '#1E1E1E',
              color: '#FED943',
              fontSize: '13px',
              fontWeight: 900,
              border: '2px solid #1E1E1E',
              cursor: 'pointer',
              boxShadow: '2px 2px 0 #8A8175',
            }}
          >
            저장
          </button>
        </form>
      </section>

      {/* 재고 목록 & 검색 & 페이징 */}
      <section className="staff-section-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 900 }}>
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
              width: '100%',
              maxWidth: '260px',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {paginatedItems.map((item) => {
            const b = getBook(item);
            return (
              <div key={item.id} className="staff-item-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <strong style={{ fontSize: '15px', wordBreak: 'break-word' }}>
                      {b?.title || '제목 없음'}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#6B6354' }}>
                      {b?.author || '작가 미상'}
                    </span>
                    {b?.category && (
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          background: '#FFFFFF',
                          border: '1px solid #1E1E1E',
                          borderRadius: '4px',
                          fontWeight: 800,
                        }}
                      >
                        {b.category}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#8A6A00',
                      fontWeight: 700,
                      marginTop: '3px',
                    }}
                  >
                    {item.last_volume === null ? '권수 확인 필요' : `${item.last_volume}권`} · 서가
                    위치: {item.shelf_location}
                  </div>
                </div>

                <div className="staff-item-row-actions">
                  <button
                    type="button"
                    onClick={() => void removeInventory(item.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #1E1E1E',
                      background: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 800,
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
