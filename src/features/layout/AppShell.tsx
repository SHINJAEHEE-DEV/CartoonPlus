import type { ReactNode } from 'react';
import mascotLogo from '../../../docs/assets/mascot/mascot_logo_circle.png';

const customerLinks = [
  ['홈', '/'],
  ['도서 검색', '/books'],
  ['즐길거리', '/games'],
  ['메뉴·요금', '/menu'],
  ['이벤트·공지', '/events'],
  ['매장 안내', '/store'],
] as const;

const staffLinks = [
  ['대시보드', '/staff/dashboard'],
  ['도서·입고', '/staff/inventory'],
  ['입고 신청', '/staff/requests'],
  ['매장 콘텐츠', '/staff/content'],
  ['게임 관리', '/staff/games'],
  ['이벤트 관리', '/staff/events'],
  ['방송', '/staff/broadcast'],
] as const;

function Brand() {
  return (
    <a className="brand" href="/" aria-label="카툰플러스 홈">
      <div className="brand-logo-wrap">
        <img src={mascotLogo} alt="카툰플러스 로고" />
      </div>
      <div>
        <div className="brand-title">CARTOON PLUS</div>
        <div className="brand-sub">서울대입구역점</div>
      </div>
    </a>
  );
}

function Nav({ links, currentPath }: { links: readonly (readonly [string, string])[]; currentPath: string }) {
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

export function CustomerShell({ children, currentPath }: { children: ReactNode; currentPath: string }) {
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 10 && currentHour < 23;

  return (
    <div className="site-shell customer-shell">
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <Nav links={customerLinks} currentPath={currentPath} />
          <div className="header-actions">
            <div className="store-status">
              <span className="status-dot" style={{ backgroundColor: isOpen ? '#2FA14B' : '#E03E3E' }} />
              <span>{isOpen ? '10:00–23:00 영업 중' : '영업 준비 중 (10시 오픈)'}</span>
            </div>
            <a className="phone-btn" href="tel:0288880852" aria-label="매장 전화 걸기">
              02-888-0852
            </a>
            <a className="staff-link" href="/staff">직원 로그인</a>
          </div>
        </div>
      </header>

      <main className="page-content">{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div style={{ fontWeight: 900, color: '#1E1E1E', fontSize: '14px', marginBottom: '4px' }}>
              카툰플러스 서울대입구역점
            </div>
            <div>서울특별시 관악구 관악로 155, 3층 (봉천동 대우디오슈페리움 1단지) · 02-888-0852</div>
            <div>매일 10:00 – 23:00 · 연중무휴 정상 영업</div>
          </div>
          <div style={{ color: '#8A8175', fontSize: '13px', fontWeight: 700, alignSelf: 'center' }}>
            만화 · 보드게임 · OTT · 안마의자 복합 힐링 라운지
          </div>
        </div>
      </footer>
    </div>
  );
}

export function StaffShell({ children, currentPath, isAdmin }: { children: ReactNode; currentPath: string; isAdmin: boolean }) {
  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <Brand />
        <div style={{ fontSize: '11px', fontWeight: 900, color: '#FED943', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          STAFF CONSOLE
        </div>
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
            ⚙️ 계정 관리
          </a>
        )}
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
