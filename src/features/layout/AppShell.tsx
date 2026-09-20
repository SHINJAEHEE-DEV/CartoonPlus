import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MASCOT_ASSETS } from '../../lib/brandAssets';
import {
  defaultPublicStore,
  publicStoreList,
  storePath,
  type PublicStore,
} from '../../lib/storeContext';
import { isStoreOpen } from '../../lib/storeHours';
import { StaffStoreSelector, useStaffStore } from '../staff/StaffStoreContext';

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

const STAFF_ENTRY_HOLD_MS = 2000;

function Brand({
  allowStaffEntry = false,
  onStaffEntry,
  store = defaultPublicStore,
  scoped = false,
  enableDropdown = true,
}: {
  allowStaffEntry?: boolean;
  onStaffEntry?: () => void;
  store?: PublicStore;
  scoped?: boolean;
  enableDropdown?: boolean;
}) {
  const entryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHolding = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const clearStaffEntryTimer = () => {
    if (entryTimer.current) clearTimeout(entryTimer.current);
    entryTimer.current = null;
  };

  const startStaffEntryTimer = () => {
    if (!allowStaffEntry) return;
    if (entryTimer.current) return;
    isHolding.current = false;
    entryTimer.current = setTimeout(() => {
      entryTimer.current = null;
      isHolding.current = true;
      (onStaffEntry ?? (() => window.location.assign('/staff')))();
    }, STAFF_ENTRY_HOLD_MS);
  };

  const handlePointerUp = () => {
    clearStaffEntryTimer();
  };

  const handleClick = (event: React.MouseEvent) => {
    if (isHolding.current) {
      isHolding.current = false;
      return;
    }
    if (enableDropdown) {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (allowStaffEntry) {
        startStaffEntryTimer();
      }
      if (enableDropdown) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
  };

  return (
    <div className="brand-wrapper">
      <a
        className="brand"
        href={scoped ? storePath(store) : '/'}
        aria-label="카툰플러스 홈"
        aria-expanded={enableDropdown ? isOpen : undefined}
        aria-haspopup={enableDropdown ? 'menu' : undefined}
        onClick={handleClick}
        onPointerDown={startStaffEntryTimer}
        onPointerUp={handlePointerUp}
        onPointerCancel={clearStaffEntryTimer}
        onPointerLeave={clearStaffEntryTimer}
        onKeyDown={handleKeyDown}
        onKeyUp={clearStaffEntryTimer}
        onBlur={clearStaffEntryTimer}
      >
        <div className="brand-logo-wrap">
          <img src={MASCOT_ASSETS.logoCircle} alt="카툰플러스 로고" />
        </div>
        <div className="brand-text-col">
          <div className="brand-title">CARTOON PLUS</div>
          <div className="brand-sub-wrap">
            <span className="brand-sub">{store.name}</span>
            {enableDropdown && (
              <svg
                className={`brand-caret ${isOpen ? 'open' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </div>
        </div>
      </a>

      {enableDropdown && isOpen && (
        <>
          <div className="store-dropdown-backdrop" onClick={() => setIsOpen(false)} />
          <div className="store-dropdown-menu" role="menu" aria-label="지점 선택">
            <div
              style={{
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 900,
                color: '#8A6A00',
                letterSpacing: '0.05em',
              }}
            >
              매장 지점 선택
            </div>
            {publicStoreList.map((target) => {
              const isCurrent = target.slug === store.slug;
              return (
                <a
                  key={target.slug}
                  href={storePath(target)}
                  className={`store-dropdown-item ${isCurrent ? 'active' : ''}`}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  <span>{target.name}</span>
                  {isCurrent && (
                    <span style={{ fontSize: '11px', fontWeight: 900 }}>현재 지점</span>
                  )}
                </a>
              );
            })}
          </div>
        </>
      )}
    </div>
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
  const isOpen = isStoreOpen(store.slug);

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
            <a
              href={scoped ? storePath(store, '/book-request') : '/book-request'}
              className="header-book-request-btn"
            >
              📖 도서 입고 신청
            </a>
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
              카툰플러스 {store.name}
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { currentStore } = useStaffStore();

  useEffect(() => {
    if (isDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isDrawerOpen]);

  return (
    <div className="staff-shell">
      {/* 모바일 전용 컴팩트 상단 헤더 */}
      <header className="staff-mobile-header">
        <a
          href={storePath(currentStore)}
          className="staff-mobile-header-brand"
          style={{ textDecoration: 'none', color: 'inherit' }}
          aria-label="카툰플러스 고객 홈"
        >
          <div className="staff-mobile-logo-wrap">
            <img src={MASCOT_ASSETS.logoCircle} alt="카툰플러스" />
          </div>
          <div className="staff-mobile-title-wrap">
            <span className="staff-mobile-title">STAFF</span>
            <span className="staff-mobile-store">{storeName ?? currentStore.name}</span>
          </div>
        </a>

        <div className="staff-mobile-header-actions">
          {isAdmin && <StaffStoreSelector variant="header" />}
          <button
            type="button"
            className="staff-hamburger-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="직원 메뉴 열기"
            aria-expanded={isDrawerOpen}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* 모바일 슬라이드오버 Drawer */}
      {isDrawerOpen && (
        <div className="staff-drawer-overlay">
          <div
            className="staff-drawer-backdrop"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="staff-drawer" aria-label="직원 모바일 메뉴">
            <div className="staff-drawer-header">
              <a
                href={storePath(currentStore)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                aria-label="카툰플러스 고객 홈"
              >
                <div className="staff-mobile-logo-wrap">
                  <img src={MASCOT_ASSETS.logoCircle} alt="카툰플러스" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      color: '#FED943',
                      letterSpacing: '0.12em',
                    }}
                  >
                    STAFF CONSOLE
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFF9EC' }}>
                    {isAdmin
                      ? `ADMIN · ${currentStore.name}`
                      : `STAFF · ${storeName ?? currentStore.name}`}
                  </div>
                </div>
              </a>
              <button
                type="button"
                className="staff-drawer-close-btn"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="메뉴 닫기"
              >
                ✕
              </button>
            </div>

            <div className="staff-drawer-body">
              <nav className="staff-drawer-nav" aria-label="직원 메뉴">
                {staffLinks.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    aria-current={currentPath === href ? 'page' : undefined}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`staff-drawer-link ${currentPath === href ? 'active' : ''}`}
                  >
                    {label}
                  </a>
                ))}

                {isAdmin && (
                  <a
                    href="/staff/accounts"
                    aria-current={currentPath === '/staff/accounts' ? 'page' : undefined}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`staff-drawer-link admin-link ${
                      currentPath === '/staff/accounts' ? 'active' : ''
                    }`}
                  >
                    ⚙️ 계정 관리 (관리자)
                  </a>
                )}
              </nav>

              <div className="staff-drawer-footer">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onSignOut?.();
                  }}
                  className="staff-drawer-signout-btn"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 데스크톱 사이드바 */}
      <aside className="staff-sidebar">
        <Brand enableDropdown={false} allowStaffEntry={false} store={currentStore} scoped />
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
            cursor: 'pointer',
          }}
        >
          로그아웃
        </button>
      </aside>

      <main className="staff-content">{children}</main>
    </div>
  );
}
