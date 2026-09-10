import { useMemo, useState } from 'react';
import thinkingMascot from '../../assets/mascot_thinking.png';
import { searchBooks, type SearchableBook } from '../../lib/bookSearch';

type BookSearchPageProps = {
  books: SearchableBook[];
};

const SAMPLE_QUERIES = ['체인소맨', '원피스', '주술회전', '귀멸의 칼날', '스파이 패밀리'];
const GENRES = ['전체', '소년', '순정', '판타지', '웹툰', '액션', '일상'];

export function BookSearchPage({ books }: BookSearchPageProps) {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('전체');

  const filteredBooks = useMemo(() => {
    let result = books;
    if (selectedGenre !== '전체') {
      result = result.filter((b) => (b.category || '').includes(selectedGenre));
    }
    return searchBooks(result, query);
  }, [books, query, selectedGenre]);

  const hasSearch = query.trim().length > 0;

  return (
    <div className="book-search-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="search-clear-btn"
            >
              초기화
            </button>
          )}
        </div>

        {/* 추천 검색어 */}
        <div className="chips-row">
          <span className="chip-label">추천 검색</span>
          {SAMPLE_QUERIES.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setQuery(sample)}
              className="chip-sample"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* 장르 필터 */}
        <div className="chips-row">
          <span className="chip-label">장르 구분</span>
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`chip ${selectedGenre === g ? 'active' : ''}`}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* 검색 결과 카운트 & 메타 */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800 }}>
          검색 결과 <span style={{ color: '#8A6A00' }}>{filteredBooks.length}</span>건
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#8A8175' }}>
          실시간 재고 기준
        </div>
      </div>

      {/* 검색 결과 목록 */}
      {filteredBooks.length > 0 ? (
        <section aria-label="검색 결과" className="search-results-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="search-result-card">
              <div className="book-badges">
                <span className="badge-genre">{book.category || '기타'}</span>
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
                  margin: '4px 0',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '13px', fontWeight: 800 }}>
                <span>{book.volumeRange}</span>
                <span style={{ color: '#8A6A00' }}>{book.shelfLocation || '카운터에 문의해 주세요'}</span>
              </div>
            </div>
          ))}
        </section>
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
