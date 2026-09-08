import { useEffect, useState } from 'react';
import { loadNewArrivals } from '../book-search/catalogueRepository';
import type { SearchableBook } from '../../lib/bookSearch';

export function NewArrivalsPage() {
  const [books, setBooks] = useState<SearchableBook[]>([]);
  useEffect(() => { void loadNewArrivals().then(setBooks); }, []);
  return <main className="app-notice"><h1>신규 입고 도서</h1><p>처음 등록한 날부터 30일 동안만 보여 드립니다.</p>{books.length === 0 ? <p>새로 등록된 도서가 없습니다.</p> : <ul>{books.map((book) => <li key={book.id}><strong>{book.title}</strong> · {book.author || '작가 미상'} · {book.volumeRange} · {book.shelfLocation}</li>)}</ul>}<a href="./books">도서 검색으로 이동</a></main>;
}
