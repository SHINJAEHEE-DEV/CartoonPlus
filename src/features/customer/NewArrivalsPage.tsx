import { useEffect, useState } from 'react';
import { loadNewArrivals } from '../book-search/catalogueRepository';
import type { SearchableBook } from '../../lib/bookSearch';

export function NewArrivalsPage() {
  const [books, setBooks] = useState<SearchableBook[]>([]);

  useEffect(() => {
    void loadNewArrivals().then(setBooks);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="section-header">
        <div>
          <div className="section-kicker">NEW ARRIVALS</div>
          <h1 className="section-title">최근 30일 신규 입고</h1>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B6354', marginTop: '6px' }}>
            새로 입고된 인기 만화와 신간 단행본 목록입니다. (입고일 기준 30일간 표시)
          </p>
        </div>
        <a href="/books" className="view-all-btn">
          ← 도서 검색으로
        </a>
      </div>

      {books.length > 0 ? (
        <div className="new-arrivals-grid">
          {books.map((book) => (
            <div key={book.id} className="new-book-card">
              <div className="book-badges">
                <span className="badge-new">NEW</span>
                <span className="badge-genre">{book.category || '기타'}</span>
              </div>
              <div className="new-book-title">{book.title}</div>
              <div className="new-book-author">{book.author || '작가 미표기'}</div>
              <div className="new-book-meta">
                <span>{book.volumeRange}</span>
                <span style={{ color: '#8A8175' }}>·</span>
                <span className="new-book-shelf">{book.shelfLocation || '서가 확인 중'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-search-box">
          <p style={{ fontWeight: 700, color: '#6B6354' }}>현재 등록된 신규 입고 도서가 없습니다.</p>
          <a href="/books" className="primary-btn">
            전체 도서 검색하기
          </a>
        </div>
      )}
    </div>
  );
}
