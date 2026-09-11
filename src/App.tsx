import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { DashboardPage } from './features/staff/DashboardPage';
import { NewArrivalsPage } from './features/customer/NewArrivalsPage';
import { CustomerShell, StaffShell } from './features/layout/AppShell';
import type { SearchableBook } from './lib/bookSearch';
import { supabase } from './lib/supabase';
import { useGlobalBroadcastScheduler } from './lib/broadcastRunner';

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
  const [role, setRole] = useState<'staff'|'admin'|null|undefined>(undefined);
  
  useEffect(() => {
    const client = supabase;
    if (!client) { setRole(null); return; }
    void client.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setRole(null); return; }
      const { data: account } = await client.from('staff_accounts').select('role,status').eq('id', data.user.id).single();
      setRole(account?.status === 'approved' ? (account.role as 'staff'|'admin') : null);
    });
  }, []);
  
  if (role === undefined) return <p className="state-card">직원 권한을 확인하는 중입니다.</p>;
  if (role === null) return <div className="staff-access-shell"><p className="state-card">승인된 직원 계정으로 로그인해 주세요.</p></div>;
  if (requiredRole === 'admin' && role !== 'admin') return <p className="state-card">관리자만 직원 계정을 관리할 수 있습니다.</p>;
  
  return <StaffShell currentPath={location.pathname} isAdmin={role === 'admin'}>{children}</StaffShell>;
}

function BooksRoute() {
  const [books, setBooks] = useState<SearchableBook[]>([]); 
  const [error, setError] = useState(false);
  useEffect(() => { loadPublicCatalogue().then(setBooks).catch(() => setError(true)); }, []);
  if (error) return <p className="state-card">도서 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>;
  return <BookSearchPage books={books} isLoading={books.length === 0} />;
}

function BookRequestRoute() {
  const location = useLocation();
  const requestedTitle = new URLSearchParams(location.search).get('title') ?? '';
  return <BookRequestForm title={requestedTitle} />;
}

function CustomerRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return <CustomerShell currentPath={location.pathname}>{children}</CustomerShell>;
}

function GlobalBroadcastService() {
  useGlobalBroadcastScheduler();
  return null;
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
        <Route path="/" element={<CustomerRoute><HomePage /></CustomerRoute>} />
        <Route path="/books" element={<CustomerRoute><BooksRoute /></CustomerRoute>} />
        <Route path="/menu" element={<CustomerRoute><MenuPage /></CustomerRoute>} />
        <Route path="/new-arrivals" element={<CustomerRoute><NewArrivalsPage /></CustomerRoute>} />
        <Route path="/games" element={<CustomerRoute><PublicInfoPage kind="games" /></CustomerRoute>} />
        <Route path="/events" element={<CustomerRoute><PublicInfoPage kind="events" /></CustomerRoute>} />
        <Route path="/store" element={<CustomerRoute><PublicInfoPage kind="store" /></CustomerRoute>} />
        <Route path="/book-request" element={<CustomerRoute><BookRequestRoute /></CustomerRoute>} />

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
