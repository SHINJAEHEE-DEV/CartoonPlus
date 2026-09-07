import { useEffect, useState } from 'react';

import { BookSearchPage } from './features/book-search/BookSearchPage';
import { loadPublicCatalogue } from './features/book-search/catalogueRepository';
import { BookRequestStartPage } from './features/book-request/BookRequestStartPage';
import type { SearchableBook } from './lib/bookSearch';

export default function App() {
  const [books, setBooks] = useState<SearchableBook[]>([]);
  const [error, setError] = useState(false);

  const requestPath = window.location.pathname.endsWith('/book-request');
  const requestedTitle = new URLSearchParams(window.location.search).get('title') ?? '';

  useEffect(() => {
    if (requestPath) return;
    loadPublicCatalogue()
      .then(setBooks)
      .catch(() => setError(true));
  }, [requestPath]);

  if (requestPath) return <BookRequestStartPage title={requestedTitle} />;

  if (error) {
    return <main className="app-notice">도서 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</main>;
  }

  if (books.length === 0) {
    return <main className="app-notice">도서 목록을 불러오는 중입니다.</main>;
  }

  return <BookSearchPage books={books} />;
}
