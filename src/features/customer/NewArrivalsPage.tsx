import { useEffect, useState, useMemo } from 'react';
import { loadNewArrivals } from '../book-search/catalogueRepository';
import type { SearchableBook } from '../../lib/bookSearch';
import { Pagination } from '../common/Pagination';
import { usePageTitle } from '../../lib/usePageTitle';

const PAGE_SIZE = 12;

export function NewArrivalsPage() {
  usePageTitle('신규 입고 도서');
  const [books, setBooks] = useState<SearchableBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    void loadNewArrivals().then(setBooks);
  }, []);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return books.slice(start, start + PAGE_SIZE);
  }, [books, currentPage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="section-header">
        <div>
          <div className="section-kicker">NEW ARRIVALS</div>
          <h1 className="section-title">최근 30일 신규 입고</h1>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B6354', marginTop: '6px' }}>
            새로 입고된 인기 만화와 신간 단행본 목록입니다. (총 {books.length}권)
          </p>
        </div>
        <a href="/books" className="view-all-btn">
          ← 도서 검색으로
        </a>
      </div>

      {books.length > 0 ? (
        <>
          <div className="new-arrivals-grid">
            {paginatedBooks.map((book) => (
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

          <Pagination
            currentPage={currentPage}
            totalItems={books.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
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
