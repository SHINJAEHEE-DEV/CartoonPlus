import { useMemo, useState } from 'react';

import { searchBooks, type SearchableBook } from '../../lib/bookSearch';

type BookSearchPageProps = {
  books: SearchableBook[];
};

export function BookSearchPage({ books }: BookSearchPageProps) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchBooks(books, query), [books, query]);
  const hasSearch = query.trim().length > 0;

  return (
    <main className="book-search-page">
      <header className="book-search-header">
        <p className="eyebrow">서울대입구역점</p>
        <h1>도서 검색</h1>
        <p>도서명, 작가명 또는 초성으로 매장 재고와 서가 위치를 찾아보세요.</p>
      </header>

      <a className="primary-action" href="/new-arrivals">신규 입고 도서 보기 <span>→</span></a>

      <label className="search-field" htmlFor="book-search">
        <span className="sr-only">도서 검색</span>
        <input
          id="book-search"
          type="search"
          role="searchbox"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: 체인소맨, 후지모토, ㅊㅇㅅㅁ"
          autoComplete="off"
        />
      </label>

      {!hasSearch && <p className="search-hint">검색어를 입력하면 보유 도서를 확인할 수 있어요.</p>}

      {hasSearch && results.length > 0 && (
        <section aria-label="검색 결과" className="search-results">
          <p className="result-count">{results.length}권의 도서를 찾았어요.</p>
          <ul>
            {results.map((book) => (
              <li className="book-card" key={book.id}>
                <p className="book-category">{book.category || '미분류'}</p>
                <h2>{book.title}</h2>
                <p className="book-author">{book.author || '작가 정보 없음'}</p>
                <dl>
                  <div>
                    <dt>보유 권수</dt>
                    <dd>{book.volumeRange}</dd>
                  </div>
                  <div>
                    <dt>서가 위치</dt>
                    <dd>{book.shelfLocation || '카운터에 문의해 주세요'}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasSearch && results.length === 0 && (
        <section className="empty-result" aria-live="polite">
          <h2>찾으시는 도서가 없나요?</h2>
          <p>원하시는 도서를 남겨 주시면 매장에서 입고 여부를 검토합니다.</p>
          <a href={`/book-request?title=${encodeURIComponent(query)}`}>{query} 입고 신청하기</a>
        </section>
      )}
    </main>
  );
}
