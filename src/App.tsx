import { useEffect, useState } from 'react';

import { BookSearchPage } from './features/book-search/BookSearchPage';
import { loadPublicCatalogue } from './features/book-search/catalogueRepository';
import { BookRequestStartPage } from './features/book-request/BookRequestStartPage';
import { StaffAccessPage } from './features/staff/StaffAccessPage';
import { AdminAccountsPage } from './features/staff/AdminAccountsPage';
import type { SearchableBook } from './lib/bookSearch';

export default function App() {
  const [books, setBooks] = useState<SearchableBook[]>([]);
  const [error, setError] = useState(false);

  const requestPath = window.location.pathname.endsWith('/book-request');
  const staffPath = window.location.pathname.endsWith('/staff');
  const adminPath = window.location.pathname.endsWith('/staff/accounts');
  const requestedTitle = new URLSearchParams(window.location.search).get('title') ?? '';

  useEffect(() => {
    if (requestPath || staffPath || adminPath) return;
    loadPublicCatalogue()
      .then(setBooks)
      .catch(() => setError(true));
  }, [requestPath, staffPath, adminPath]);

  if (requestPath) return <BookRequestStartPage title={requestedTitle} />;
  if (staffPath) return <StaffAccessPage />;
  if (adminPath) return <AdminAccountsPage />;

  if (error) {
    return <main className="app-notice">도서 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</main>;
  }

  if (books.length === 0) {
    return <main className="app-notice">도서 목록을 불러오는 중입니다.</main>;
  }

  return <BookSearchPage books={books} />;
}
