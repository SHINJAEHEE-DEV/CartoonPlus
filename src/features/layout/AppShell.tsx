import type { ReactNode } from 'react';
import mascotLogo from '../../../docs/assets/mascot/mascot_logo_circle.png';

const customerLinks = [
  ['홈', '/'], ['도서 검색', '/books'], ['즐길거리', '/games'], ['메뉴·요금', '/menu'], ['이벤트·공지', '/events'], ['매장 안내', '/store'],
] as const;

const staffLinks = [
  ['대시보드', '/staff/dashboard'], ['도서·입고', '/staff/inventory'], ['입고 신청', '/staff/requests'], ['매장 콘텐츠', '/staff/content'], ['게임 관리', '/staff/games'], ['이벤트 관리', '/staff/events'], ['방송', '/staff/broadcast'],
] as const;

function Brand(){ return <a className="brand" href="/" aria-label="카툰플러스 홈"><span><img src={mascotLogo} alt=""/></span><strong>CARTOON PLUS<small>서울대입구역점</small></strong></a>; }
function Nav({ links, currentPath }: { links: readonly (readonly [string, string])[]; currentPath: string }) {
  return <nav className="primary-nav" aria-label="주요 탐색">{links.map(([label, href]) => <a key={href} href={href} aria-current={currentPath === href ? 'page' : undefined}>{label}</a>)}</nav>;
}

export function CustomerShell({ children, currentPath }: { children: ReactNode; currentPath: string }) {
  return <div className="site-shell customer-shell"><style>{'@media(max-width:820px){.site-header>.primary-nav{position:fixed;z-index:10;bottom:0;left:0;right:0;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:1px;padding:7px 3px 10px;border-top:3px solid #1e1e1e;background:#fff9ec}.site-header>.primary-nav a{padding:7px 1px;text-align:center;border-radius:8px;font-size:.6rem;letter-spacing:-.04em}}'}</style><header className="site-header"><Brand/><Nav links={customerLinks} currentPath={currentPath}/><div className="header-actions"><span className="store-status"><i/>영업 중</span><a className="staff-entry" href="/staff">직원 로그인</a></div></header><main className="page-content">{children}</main><footer className="site-footer"><strong>카툰플러스 서울대입구역점</strong><span>오늘도 편안한 휴식을 준비합니다.</span></footer></div>;
}

export function StaffShell({ children, currentPath, isAdmin }: { children: ReactNode; currentPath: string; isAdmin: boolean }) {
  return <div className="staff-shell"><aside className="staff-sidebar"><Brand/><p className="staff-label">매장 운영</p><Nav links={staffLinks} currentPath={currentPath}/>{isAdmin&&<a className="staff-account" href="/staff/accounts">계정 관리</a>}<a className="staff-back" href="/">고객 화면 보기</a></aside><main className="staff-content">{children}</main></div>;
}
