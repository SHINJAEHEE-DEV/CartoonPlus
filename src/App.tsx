import { useEffect, useState } from 'react';
import { BookSearchPage } from './features/book-search/BookSearchPage';
import { loadPublicCatalogue } from './features/book-search/catalogueRepository';
import { BookRequestForm } from './features/book-request/BookRequestForm';
import { StaffAccessPage } from './features/staff/StaffAccessPage';
import { AdminAccountsPage } from './features/staff/AdminAccountsPage';
import { InventoryPage } from './features/staff/InventoryPage';
import { BookRequestsPage } from './features/staff/BookRequestsPage';
import { HomePage } from './features/customer/HomePage';
import { PublicInfoPage } from './features/customer/PublicInfoPage';
import { MenuPage } from './features/customer/MenuPage';
import { StoreContentPage } from './features/staff/StoreContentPage';
import { EventsPage } from './features/staff/EventsPage';
import { GamesPage } from './features/staff/GamesPage';
import { BroadcastPage } from './features/staff/BroadcastPage';
import { NewArrivalsPage } from './features/customer/NewArrivalsPage';
import { CustomerShell, StaffShell } from './features/layout/AppShell';
import type { SearchableBook } from './lib/bookSearch';

const legacyRoutes: Record<string, string> = { '/search': '/books', '/entertainment': '/games', '/event': '/events' };
function Dashboard(){ return <section className="dashboard-page"><p className="section-kicker">OPERATIONS</p><h1>오늘의 매장 운영</h1><p className="page-lede">처리할 업무를 확인하고 바로 시작하세요.</p><div className="dashboard-grid"><a href="/staff/requests"><strong>도서 입고 신청</strong><span>처리 대기 항목 확인</span></a><a href="/staff/broadcast"><strong>오늘의 예약 방송</strong><span>예약과 실패 기록 확인</span></a><a href="/staff/inventory"><strong>최근 재고 작업</strong><span>도서 재고 관리로 이동</span></a></div></section>; }

export default function App() {
  const [books, setBooks] = useState<SearchableBook[]>([]); const [error, setError] = useState(false);
  const path = window.location.pathname.replace(/\/$/, '') || '/'; const redirect = legacyRoutes[path];
  useEffect(() => { if (redirect) window.history.replaceState(null, '', redirect); }, [redirect]);
  const currentPath = redirect ?? path; const isStaff = currentPath.startsWith('/staff'); const booksPath = currentPath === '/books';
  useEffect(() => { if (!booksPath) return; loadPublicCatalogue().then(setBooks).catch(() => setError(true)); }, [booksPath]);
  const requestedTitle = new URLSearchParams(window.location.search).get('title') ?? '';
  let page: React.ReactNode;
  if (currentPath === '/staff') page = <StaffAccessPage />;
  else if (currentPath === '/staff/dashboard') page = <Dashboard />;
  else if (currentPath === '/staff/accounts') page = <AdminAccountsPage />;
  else if (currentPath === '/staff/inventory') page = <InventoryPage />;
  else if (currentPath === '/staff/requests') page = <BookRequestsPage />;
  else if (currentPath === '/staff/content') page = <StoreContentPage />;
  else if (currentPath === '/staff/events') page = <EventsPage />;
  else if (currentPath === '/staff/games') page = <GamesPage />;
  else if (currentPath === '/staff/broadcast') page = <BroadcastPage />;
  else if (currentPath === '/book-request') page = <BookRequestForm title={requestedTitle} />;
  else if (currentPath === '/new-arrivals') page = <NewArrivalsPage />;
  else if (currentPath === '/games' || currentPath === '/events' || currentPath === '/store') page = <PublicInfoPage kind={currentPath.slice(1) as 'games'|'events'|'store'} />;
  else if (currentPath === '/menu') page = <MenuPage />;
  else if (booksPath) page = error ? <p className="state-card">도서 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p> : books.length === 0 ? <p className="state-card">도서 목록을 불러오는 중입니다.</p> : <BookSearchPage books={books} />;
  else page = <HomePage />;
  if (currentPath === '/staff') return <div className="staff-access-shell">{page}</div>;
  return isStaff ? <StaffShell currentPath={currentPath}>{page}</StaffShell> : <CustomerShell currentPath={currentPath}>{page}</CustomerShell>;
}
