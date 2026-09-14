import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { BookSearchPage } from './features/book-search/BookSearchPage';
import { loadPublicCatalogue } from './features/book-search/catalogueRepository';
import { BookRequestForm } from './features/book-request/BookRequestForm';
import { StaffAccessPage } from './features/staff/StaffAccessPage';
import { AdminAccountsPage } from './features/staff/AdminAccountsPage';
import { InventoryPage } from './features/staff/InventoryPage';
import { BookRequestsPage } from './features/staff/BookRequestsPage';
import { StoreIntroductionPage } from './features/customer/StoreIntroductionPage';
import { PublicInfoPage } from './features/customer/PublicInfoPage';
import { MenuPage } from './features/customer/MenuPage';
import { StoreMenuPage } from './features/customer/StoreMenuPage';
import { StoreContentPage } from './features/staff/StoreContentPage';
import { EventsPage } from './features/staff/EventsPage';
import { GamesPage } from './features/staff/GamesPage';
import { BroadcastPage } from './features/staff/BroadcastPage';
import { DashboardPage } from './features/staff/DashboardPage';
import { NewArrivalsPage } from './features/customer/NewArrivalsPage';
import { CustomerShell, StaffShell } from './features/layout/AppShell';
import type { SearchableBook } from './lib/bookSearch';
import { getApprovedStaffContext, signOutStaff } from './features/staff/staffAuth';
import { useGlobalBroadcastScheduler } from './lib/broadcastRunner';
import { defaultPublicStore, getPublicStore, StoreContext, usePublicStore } from './lib/storeContext';

function InternalLinkInterceptor() {
  const navigate = useNavigate();
  useEffect(() => {
    const followInternalLink = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!target || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const destination = new URL(target.href);
      if (destination.origin !== window.location.origin || !destination.pathname.startsWith('/') || destination.pathname.startsWith('/CartoonPlus/')) return;
      
      // Allow external links or downloads to bypass
      if (target.target === '_blank' || target.hasAttribute('download')) return;

      event.preventDefault();
      navigate(destination.pathname + destination.search);
    };
    document.addEventListener('click', followInternalLink);
    return () => { document.removeEventListener('click', followInternalLink); };
  }, [navigate]);
  return null;
}

function ProtectedStaffRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'admin' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<'staff'|'admin'|null|undefined>(undefined);
  const [storeName, setStoreName] = useState<string | null>(null);
  
  useEffect(() => {
    void getApprovedStaffContext().then((context) => {
      setRole(context?.role ?? null);
      setStoreName(context?.storeName ?? null);
    });
  }, []);
  
  if (role === undefined) return <p className="state-card">직원 권한을 확인하는 중입니다.</p>;
  if (role === null) return <div className="staff-access-shell"><p className="state-card">승인된 직원 계정으로 로그인해 주세요.</p></div>;
  if (requiredRole === 'admin' && role !== 'admin') return <p className="state-card">관리자만 직원 계정을 관리할 수 있습니다.</p>;
  
  return <StaffShell currentPath={location.pathname} isAdmin={role === 'admin'} storeName={storeName} onSignOut={() => { void signOutStaff().then(() => navigate('/', { replace: true })); }}>{children}</StaffShell>;
}

function BooksRoute() {
  const { store } = usePublicStore();
  const [books, setBooks] = useState<SearchableBook[]>([]); 
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    setBooks([]);
    setError(false);
    void loadPublicCatalogue(store.slug).then((loadedBooks) => {
      if (active) setBooks(loadedBooks);
    }).catch(() => {
      if (active) setError(true);
    });
    return () => { active = false; };
  }, [store.slug]);
  if (error) return <p className="state-card">도서 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>;
  return <BookSearchPage books={books} isLoading={books.length === 0} />;
}

function BookRequestRoute() {
  const { store } = usePublicStore();
  const location = useLocation();
  const requestedTitle = new URLSearchParams(location.search).get('title') ?? '';
  return <BookRequestForm title={requestedTitle} storeSlug={store.slug} />;
}

function CustomerRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { storeSlug } = useParams();
  const store = storeSlug ? getPublicStore(storeSlug) : defaultPublicStore;
  if (!store) return <p className="state-card">페이지를 찾을 수 없습니다.</p>;
  return <StoreContext value={{ store, scoped: Boolean(storeSlug) }}><CustomerShell currentPath={location.pathname} store={store} scoped={Boolean(storeSlug)}>{children}</CustomerShell></StoreContext>;
}

function GlobalBroadcastService() {
  useGlobalBroadcastScheduler();
  return null;
}

function StoreContentPendingPage() {
  return <p className="state-card">이 지점의 콘텐츠는 점검 중입니다.</p>;
}

export default function App() {
  return (
    <BrowserRouter>
      <InternalLinkInterceptor />
      <GlobalBroadcastService />
      <Routes>
        {/* Legacy Redirects */}
        <Route path="/search" element={<Navigate to="/books" replace />} />
        <Route path="/entertainment" element={<Navigate to="/games" replace />} />
        <Route path="/event" element={<Navigate to="/events" replace />} />

        {/* Customer Routes */}
        <Route path="/" element={<CustomerRoute><BooksRoute /></CustomerRoute>} />
        <Route path="/books" element={<CustomerRoute><BooksRoute /></CustomerRoute>} />
        <Route path="/about" element={<CustomerRoute><StoreIntroductionPage /></CustomerRoute>} />
        <Route path="/menu" element={<CustomerRoute><MenuPage /></CustomerRoute>} />
        <Route path="/new-arrivals" element={<CustomerRoute><NewArrivalsPage /></CustomerRoute>} />
        <Route path="/games" element={<CustomerRoute><PublicInfoPage kind="games" /></CustomerRoute>} />
        <Route path="/events" element={<CustomerRoute><PublicInfoPage kind="events" /></CustomerRoute>} />
        <Route path="/store" element={<CustomerRoute><PublicInfoPage kind="store" /></CustomerRoute>} />
        <Route path="/book-request" element={<CustomerRoute><BookRequestRoute /></CustomerRoute>} />
        <Route path="/stores/:storeSlug" element={<CustomerRoute><BooksRoute /></CustomerRoute>} />
        <Route path="/stores/:storeSlug/books" element={<CustomerRoute><BooksRoute /></CustomerRoute>} />
        <Route path="/stores/:storeSlug/new-arrivals" element={<CustomerRoute><NewArrivalsPage /></CustomerRoute>} />
        <Route path="/stores/:storeSlug/book-request" element={<CustomerRoute><BookRequestRoute /></CustomerRoute>} />
        <Route path="/stores/:storeSlug/about" element={<CustomerRoute><StoreContentPendingPage /></CustomerRoute>} />
        <Route path="/stores/:storeSlug/menu" element={<CustomerRoute><StoreMenuPage /></CustomerRoute>} />
        <Route path="/stores/:storeSlug/games" element={<CustomerRoute><PublicInfoPage kind="games" /></CustomerRoute>} />
        <Route path="/stores/:storeSlug/events" element={<CustomerRoute><PublicInfoPage kind="events" /></CustomerRoute>} />
        <Route path="/stores/:storeSlug/store" element={<CustomerRoute><StoreContentPendingPage /></CustomerRoute>} />

        {/* Staff Routes */}
        <Route path="/staff" element={<div className="staff-access-shell"><StaffAccessPage /></div>} />
        <Route path="/staff/dashboard" element={<ProtectedStaffRoute><DashboardPage /></ProtectedStaffRoute>} />
        <Route path="/staff/accounts" element={<ProtectedStaffRoute requiredRole="admin"><AdminAccountsPage /></ProtectedStaffRoute>} />
        <Route path="/staff/inventory" element={<ProtectedStaffRoute><InventoryPage /></ProtectedStaffRoute>} />
        <Route path="/staff/requests" element={<ProtectedStaffRoute><BookRequestsPage /></ProtectedStaffRoute>} />
        <Route path="/staff/content" element={<ProtectedStaffRoute><StoreContentPage /></ProtectedStaffRoute>} />
        <Route path="/staff/events" element={<ProtectedStaffRoute><EventsPage /></ProtectedStaffRoute>} />
        <Route path="/staff/games" element={<ProtectedStaffRoute><GamesPage /></ProtectedStaffRoute>} />
        <Route path="/staff/broadcast" element={<ProtectedStaffRoute><BroadcastPage /></ProtectedStaffRoute>} />
        
        {/* Not Found */}
        <Route path="*" element={<CustomerRoute><p className="state-card">페이지를 찾을 수 없습니다.</p></CustomerRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
