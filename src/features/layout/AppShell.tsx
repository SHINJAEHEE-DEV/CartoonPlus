import type { ReactNode } from 'react';

const customerLinks = [
  ['홈', '/'], ['도서 검색', '/books'], ['즐길거리', '/games'], ['메뉴·요금', '/menu'], ['이벤트·공지', '/events'], ['매장 안내', '/store'],
] as const;

const staffLinks = [
  ['대시보드', '/staff/dashboard'], ['도서·입고', '/staff/inventory'], ['입고 신청', '/staff/requests'], ['매장 콘텐츠', '/staff/content'], ['게임 관리', '/staff/games'], ['이벤트 관리', '/staff/events'], ['방송', '/staff/broadcast'],
] as const;

function Brand(){ return <a className="brand" href="/" aria-label="카툰플러스 홈"><span>CP</span><strong>Cartoon<br/>Plus</strong></a>; }
function Nav({ links, currentPath }: { links: readonly (readonly [string, string])[]; currentPath: string }) {
  return <nav className="primary-nav" aria-label="주요 탐색">{links.map(([label, href]) => <a key={href} href={href} aria-current={currentPath === href ? 'page' : undefined}>{label}</a>)}</nav>;
}

export function CustomerShell({ children, currentPath }: { children: ReactNode; currentPath: string }) {
  return <div className="site-shell customer-shell"><header className="site-header"><Brand/><Nav links={customerLinks} currentPath={currentPath}/><a className="staff-entry" href="/staff">직원 로그인</a></header><main className="page-content">{children}</main><footer className="site-footer"><strong>카툰플러스 서울대입구역점</strong><span>오늘도 편안한 휴식을 준비합니다.</span></footer></div>;
}

export function StaffShell({ children, currentPath, isAdmin }: { children: ReactNode; currentPath: string; isAdmin: boolean }) {
  return <div className="staff-shell"><aside className="staff-sidebar"><Brand/><p className="staff-label">매장 운영</p><Nav links={staffLinks} currentPath={currentPath}/>{isAdmin&&<a className="staff-account" href="/staff/accounts">계정 관리</a>}<a className="staff-back" href="/">고객 화면 보기</a></aside><main className="staff-content">{children}</main></div>;
}
