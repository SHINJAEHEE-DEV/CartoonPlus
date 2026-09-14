import { useRef } from 'react';
import type { ReactNode } from 'react';
import { MASCOT_ASSETS } from '../../lib/brandAssets';
import {
  defaultPublicStore,
  publicStoreList,
  storePath,
  type PublicStore,
} from '../../lib/storeContext';
import { StaffStoreSelector } from '../staff/StaffStoreContext';

const customerLinks = [
  ['도서 검색', '/'],
  ['매장 소개', '/about'],
  ['즐길거리', '/games'],
  ['메뉴·요금', '/menu'],
  ['이벤트·공지', '/events'],
  ['매장 안내', '/store'],
] as const;

const staffLinks = [
  ['대시보드', '/staff/dashboard'],
  ['도서·입고', '/staff/inventory'],
  ['입고 신청', '/staff/requests'],
  ['메뉴·요금 관리', '/staff/content'],
  ['게임 관리', '/staff/games'],
  ['이벤트 관리', '/staff/events'],
  ['방송', '/staff/broadcast'],
] as const;

const STAFF_ENTRY_HOLD_MS = 3000;

function Brand({
  allowStaffEntry = false,
  onStaffEntry,
  store = defaultPublicStore,
  scoped = false,
}: {
  allowStaffEntry?: boolean;
  onStaffEntry?: () => void;
  store?: PublicStore;
  scoped?: boolean;
}) {
  const entryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearStaffEntryTimer = () => {
    if (entryTimer.current) clearTimeout(entryTimer.current);
    entryTimer.current = null;
  };

  const startStaffEntryTimer = () => {
    if (!allowStaffEntry) return;
    if (entryTimer.current) return;
    entryTimer.current = setTimeout(() => {
      entryTimer.current = null;
      (onStaffEntry ?? (() => window.location.assign('/staff')))();
    }, STAFF_ENTRY_HOLD_MS);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (!allowStaffEntry || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    startStaffEntryTimer();
  };

  return (
    <a
      className="brand"
      href={scoped ? storePath(store) : '/'}
      aria-label="카툰플러스 홈"
      onPointerDown={startStaffEntryTimer}
      onPointerUp={clearStaffEntryTimer}
      onPointerCancel={clearStaffEntryTimer}
      onPointerLeave={clearStaffEntryTimer}
      onKeyDown={handleKeyDown}
      onKeyUp={clearStaffEntryTimer}
      onBlur={clearStaffEntryTimer}
    >
      <div className="brand-logo-wrap">
        <img src={MASCOT_ASSETS.logoCircle} alt="카툰플러스 로고" />
      </div>
      <div>
        <div className="brand-title">CARTOON PLUS</div>
        <div className="brand-sub">{store.name}</div>
      </div>
    </a>
  );
}

function Nav({
  links,
  currentPath,
}: {
  links: readonly (readonly [string, string])[];
  currentPath: string;
}) {
  return (
    <nav className="primary-nav" aria-label="주요 탐색">
      {links.map(([label, href]) => (
        <a key={href} href={href} aria-current={currentPath === href ? 'page' : undefined}>
          {label}
        </a>
      ))}
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BooksIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function GamesIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <path d="M6 12h4m-2-2v4" />
      <circle cx="17" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

function EventsIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
      <path d="M13 5v2m0 4v2m0 4v2" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const mobileNavItems = [
  { label: '도서 검색', href: '/', icon: BooksIcon },
  { label: '매장 소개', href: '/about', icon: HomeIcon },
  { label: '즐길거리', href: '/games', icon: GamesIcon },
  { label: '메뉴·요금', href: '/menu', icon: MenuIcon },
  { label: '이벤트·공지', href: '/events', icon: EventsIcon },
  { label: '매장 안내', href: '/store', icon: StoreIcon },
] as const;

export function CustomerShell({
  children,
  currentPath,
  onStaffEntry,
  store = defaultPublicStore,
  scoped = false,
}: {
  children: ReactNode;
  currentPath: string;
  onStaffEntry?: () => void;
  store?: PublicStore;
  scoped?: boolean;
}) {
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 10 && currentHour < 23;

  return (
    <div className="site-shell customer-shell">
      <header className="site-header">
        <div className="header-inner">
          <Brand allowStaffEntry onStaffEntry={onStaffEntry} store={store} scoped={scoped} />
          <Nav
            links={customerLinks.map(
              ([label, href]) =>
                [label, scoped ? storePath(store, href === '/' ? '' : href) : href] as const
            )}
            currentPath={currentPath}
          />
          <div className="header-actions">
            <label>
              <span className="sr-only">지점 변경</span>
              <select
                aria-label="지점 변경"
                value={store.slug}
                onChange={(event) => {
                  window.location.assign(
                    storePath(
                      publicStoreList.find((candidate) => candidate.slug === event.target.value) ??
                        defaultPublicStore
                    )
                  );
                }}
              >
                {publicStoreList.map((candidate) => (
                  <option key={candidate.slug} value={candidate.slug}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="store-status">
              <span
                className="status-dot"
                style={{ backgroundColor: isOpen ? '#2FA14B' : '#E03E3E' }}
              />
              <span>
                {store.hours ? (isOpen ? '영업 중' : '영업 준비 중') : '매장 정보 점검 중'}
              </span>
            </div>
            {store.phone && (
              <a
                className="phone-btn"
                href={`tel:${store.phone.replace(/[^0-9]/g, '')}`}
                aria-label="매장 전화 걸기"
              >
                {store.phone}
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="page-content">{children}</main>

      {/* 모바일 하단 고정 언더바 (Bottom Navigation Bar) */}
      <nav className="mobile-bottom-nav" aria-label="모바일 하단 주요 탐색">
        {mobileNavItems.map(({ label, href, icon: Icon }) => {
          const storeHref = scoped ? storePath(store, href === '/' ? '' : href) : href;
          const isActive =
            currentPath === storeHref || (href !== '/' && currentPath.startsWith(storeHref));
          return (
            <a
              key={storeHref}
              href={storeHref}
              className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon />
              <span>{label}</span>
            </a>
          );
        })}
      </nav>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div
              style={{ fontWeight: 900, color: '#1E1E1E', fontSize: '14px', marginBottom: '4px' }}
            >
              카툰플러스 서울대입구역점
            </div>
            <div>{store.address ?? '매장 안내 점검 중'}</div>
            <div>{store.hours ?? '영업시간 점검 중'}</div>
          </div>
          <div style={{ color: '#8A8175', fontSize: '13px', fontWeight: 700, alignSelf: 'center' }}>
            만화 · 보드게임 · OTT · 안마의자 복합 힐링 라운지
          </div>
        </div>
      </footer>
    </div>
  );
}

export function StaffShell({
  children,
  currentPath,
  isAdmin,
  storeName,
  onSignOut,
}: {
  children: ReactNode;
  currentPath: string;
  isAdmin: boolean;
  storeName?: string | null;
  onSignOut?: () => void;
}) {
  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <Brand />
        <div
          style={{
            fontSize: '11px',
            fontWeight: 900,
            color: '#FED943',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          STAFF CONSOLE
        </div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFF9EC' }}>
          {isAdmin ? 'ADMIN · 전체 지점 권한' : `STAFF · ${storeName ?? '소속 지점 확인 중'}`}
        </div>
        <StaffStoreSelector />
        <Nav links={staffLinks} currentPath={currentPath} />
        {isAdmin && (
          <a
            href="/staff/accounts"
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#2A2A2A',
              color: '#FFF9EC',
              fontSize: '13px',
              fontWeight: 800,
            }}
          >
            계정 관리
          </a>
        )}
        <button
          type="button"
          onClick={onSignOut}
          style={{
            padding: '10px 14px',
            borderRadius: '999px',
            border: '2px solid #4A4438',
            color: '#FFF9EC',
            fontSize: '12px',
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          로그아웃
        </button>
        <a
          href="/"
          style={{
            marginTop: 'auto',
            padding: '10px 14px',
            borderRadius: '999px',
            border: '2px solid #4A4438',
            color: '#FED943',
            fontSize: '12px',
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          ← 고객 화면 보기
        </a>
      </aside>
      <main className="staff-content">{children}</main>
    </div>
  );
}
