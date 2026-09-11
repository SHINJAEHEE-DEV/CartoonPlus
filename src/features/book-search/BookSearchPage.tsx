import { useMemo, useState, useEffect } from 'react';
import thinkingMascot from '../../assets/mascot_thinking.png';
import { normalizeBookCategory, searchBooks, splitBookCategories, type SearchableBook } from '../../lib/bookSearch';
import { Pagination } from '../common/Pagination';
import { usePageTitle } from '../../lib/usePageTitle';

type BookSearchPageProps = {
  books: SearchableBook[];
  isLoading?: boolean;
};

const PAGE_SIZE = 18;

export function BookSearchPage({ books, isLoading = false }: BookSearchPageProps) {
  usePageTitle('도서 검색');
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);

  // 검색어 또는 장르 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedGenre]);

  // 실제 저장된 도서들의 카테고리/장르를 동적으로 추출
  const dynamicGenres = useMemo(() => {
    const genreCounts = new Map<string, number>();
    for (const book of books) {
      if (!book.category) continue;
      const parts = splitBookCategories(book.category);
      for (const part of parts) {
        genreCounts.set(part, (genreCounts.get(part) || 0) + 1);
      }
    }
    const sorted = Array.from(genreCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    return ['전체', ...sorted];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = books;
    if (selectedGenre !== '전체') {
      result = result.filter((book) => splitBookCategories(book.category).includes(selectedGenre));
    }
    if (!query.trim()) {
      return result;
    }
    return searchBooks(result, query);
  }, [books, query, selectedGenre]);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBooks.slice(start, start + PAGE_SIZE);
  }, [filteredBooks, currentPage]);

  const hasSearch = query.trim().length > 0;

  return (
    <div className="book-search-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '80vh' }}>
      {/* 상단 검색 컨트롤 카드 */}
      <section className="search-box-card">
        <div>
          <div className="section-kicker">BOOK SEARCH</div>
          <h1 className="section-title">도서 검색</h1>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B6354', marginTop: '6px', lineHeight: 1.5 }}>
            공백을 무시하고, 초성만 입력해도 찾아 드립니다. 결과에서 보유 권수와 서가 위치를 바로 확인하세요.
          </p>
        </div>

        {/* 검색 인풋 + 초기화 버튼 */}
        <div className="search-input-row">
          <input
            id="book-search"
            type="search"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="도서명 또는 작가명 (예: 체인소맨, ㅊㅇㅅㅁ)"
            className="search-input"
            autoComplete="off"
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="search-clear-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>초기화</span>
            </button>
          )}
        </div>

        {/* 1. 데스크톱 화면용: 가로 칩 형태 장르 선택 바 */}
        <div className="genre-chips-desktop">
          <span className="chip-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            장르 구분
          </span>
          {dynamicGenres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`chip ${selectedGenre === g ? 'active' : ''}`}
              disabled={isLoading}
            >
              {g}
            </button>
          ))}
        </div>

        {/* 2. 모바일 화면용: 네오 브루탈리즘 모달 트리거 버튼 */}
        <div className="genre-select-mobile">
          <button
            type="button"
            className="mobile-genre-trigger"
            onClick={() => setIsGenreModalOpen(true)}
            aria-haspopup="dialog"
            disabled={isLoading}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>장르: <strong>{selectedGenre === '전체' ? '전체 장르' : selectedGenre}</strong></span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 900, background: '#1E1E1E', color: '#FED943', padding: '4px 10px', borderRadius: '8px' }}>
              변경
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* 모바일 장르 바텀시트 모달 */}
      {isGenreModalOpen && (
        <div
          className="genre-modal-backdrop"
          onClick={() => setIsGenreModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="장르 선택"
        >
          <div className="genre-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="genre-modal-header">
              <div className="genre-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>장르 선택 ({dynamicGenres.length})</span>
              </div>
              <button
                type="button"
                className="genre-modal-close-btn"
                onClick={() => setIsGenreModalOpen(false)}
                aria-label="닫기"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="genre-modal-grid">
              {dynamicGenres.map((g) => {
                const isSelected = selectedGenre === g;
                return (
                  <button
                    key={g}
                    type="button"
                    className={`genre-modal-item-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedGenre(g);
                      setIsGenreModalOpen(false);
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      <span>{g}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 검색 결과 카운트 & 메타 */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800 }}>
          {isLoading ? (
            <span>검색 데이터 로딩 중...</span>
          ) : (
            <>
              검색 결과 <span style={{ color: '#8A6A00' }}>{filteredBooks.length}</span>건
              {filteredBooks.length > PAGE_SIZE && (
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#8A8175', marginLeft: '6px' }}>
                  ({currentPage} / {Math.ceil(filteredBooks.length / PAGE_SIZE)} 페이지)
                </span>
              )}
            </>
          )}
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#8A8175' }}>
          실시간 재고 기준
        </div>
      </div>

      {/* 검색 결과 목록 */}
      {isLoading ? (
        <section aria-label="로딩 중" className="search-results-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="search-result-card" style={{ opacity: 0.6, pointerEvents: 'none' }}>
              <div className="book-badges">
                <span className="badge-genre" style={{ width: '40px', background: '#e0d8c8', color: 'transparent' }}>분류</span>
                <span className="badge-new" style={{ width: '40px', background: '#e0d8c8', color: 'transparent' }}>보유중</span>
              </div>
              <h2 style={{ fontSize: '17px', fontWeight: 900, background: '#e0d8c8', color: 'transparent', width: '70%', borderRadius: '4px', display: 'inline-block' }}>
                로딩중입니다
              </h2>
              <p style={{ fontSize: '13px', fontWeight: 600, background: '#e0d8c8', color: 'transparent', width: '50%', borderRadius: '4px', marginTop: '4px' }}>
                작가 미표기
              </p>
              <div style={{ height: '1px', background: '#E6DFCF', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '13px', fontWeight: 800 }}>
                <span style={{ background: '#e0d8c8', color: 'transparent', borderRadius: '4px' }}>1-10권</span>
                <span style={{ background: '#e0d8c8', color: 'transparent', borderRadius: '4px' }}>A-1 책장</span>
              </div>
            </div>
          ))}
        </section>
      ) : filteredBooks.length > 0 ? (
        <>
          <section aria-label="검색 결과" className="search-results-grid">
            {paginatedBooks.map((book) => (
              <div key={book.id} className="search-result-card">
                <div className="book-badges">
                  <span className="badge-genre">{normalizeBookCategory(book.category) || '기타'}</span>
                  <span className="badge-new">보유중</span>
                </div>
                <h2 style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                  {book.title}
                </h2>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354' }}>
                  {book.author || '작가 미표기'}
                </p>
                <div
                  style={{
                    height: '1px',
                    background: '#E6DFCF',
                    margin: '8px 0',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800 }}>
                  <span style={{ background: '#F4F0E6', padding: '4px 8px', borderRadius: '4px', color: '#6B6354' }}>
                    {book.volumeRange}
                  </span>
                  <span style={{ background: '#FFF6D6', padding: '4px 8px', borderRadius: '4px', color: '#8A6A00' }}>
                    {book.shelfLocation || '카운터 문의'}
                  </span>
                </div>
              </div>
            ))}
          </section>

          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredBooks.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          />
        </>
      ) : (
        /* 결과 없을 때 안내 및 신청 폼 링크 */
        <section className="empty-search-box" aria-live="polite">
          <img src={thinkingMascot} alt="고민하는 마스코트" />
          <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.03em' }}>
            찾으시는 도서가 아직 없어요
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354', maxWidth: '420px', lineHeight: 1.6 }}>
            개인정보 없이 도서명만 남겨 주시면 직원이 입고를 적극 검토합니다. 처리 상태는 카운터에서 확인하실 수 있어요.
          </p>
          <a
            className="primary-btn"
            href={hasSearch ? `/book-request?title=${encodeURIComponent(query)}` : '/book-request'}
            style={{ marginTop: '8px' }}
          >
            {hasSearch ? `${query} 입고 신청하기` : '도서 입고 신청하기'}
          </a>
        </section>
      )}
    </div>
  );
}
