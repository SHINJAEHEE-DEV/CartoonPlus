# Spec: 카툰플러스 고객·직원 UI 재설계

Status: ready-for-agent

## Problem Statement

현재 고객 포털과 직원 운영 화면은 기능별로 분리되어 있으나, 화면마다 레이아웃과 상태 표현이 달라 목업이 제시한 브랜드 경험과 일치하지 않는다. 특히 직원의 재고·도서 입고 신청·방송·콘텐츠 관리 화면은 운영 우선순위와 역할별 접근 범위를 한눈에 파악하기 어렵다.

서울대입구역점 고객과 직원이 모바일, 태블릿, PC에서 같은 디자인 체계로 도서 검색과 매장 운영 업무를 빠르게 수행할 수 있도록 전체 UI를 재설계해야 한다.

## Solution

`docs/wireframes`의 옐로우·차콜·크림 색상, 두꺼운 테두리, 둥근 카드, 마스코트와 매장 사진의 디자인 언어를 공통 앱 셸로 구현한다. 고객 포털은 홈, 도서 검색, 즐길거리, 메뉴·요금, 이벤트·공지, 매장 안내로 구성한다. 홈에는 검색 입력창을 두지 않으며, 도서 검색은 별도 목적지에서 제공한다.

직원과 관리자는 반응형 운영 콘솔을 사용한다. 로그인 후 대시보드에서 처리 대기 도서 입고 신청, 당일 예약 방송, 최근 재고 작업을 확인하고 각 업무로 이동한다. 모든 운영 항목은 보관과 복구를 통해 관리하며, 관리자 전용 계정 관리는 역할에 따라 노출한다.

## User Stories

1. As a 고객, I want every customer page to share the wireframe's visual language, so that CartoonPlus feels like one coherent service.
2. As a 고객, I want to navigate Home, 도서 검색, 즐길거리, 메뉴·요금, 이벤트·공지, and 매장 안내 on any device, so that I can reach the information I need quickly.
3. As a 고객, I want Home to introduce the store without an embedded search box, so that brand information is not confused with 도서 검색.
4. As a 고객, I want an explicit 도서 검색 destination, so that I can search, view 신규 입고, and request unavailable books in one task flow.
5. As a 고객, I want a no-result search state to lead to 도서 입고 신청, so that a missing book can be requested without leaving search.
6. As a 고객, I want 신규 입고 to appear on Home and as a 도서 검색 filter, so that I can discover recently registered books without a primary navigation item.
7. As a 고객, I want 메뉴·요금 to show only verified store information, so that I do not rely on sample prices or unconfirmed services.
8. As a 고객, I want fixed public notices to appear with events, so that I receive operational guidance without a separate notice-management feature.
9. As a 고객, I want verified games, current events, and store guidance to distinguish loading, empty, and unavailable states, so that absent data is never presented as fact.
10. As a Staff member, I want a responsive operations console, so that I can manage the store from the counter PC or a mobile device.
11. As a Staff member, I want a dashboard with pending Book Requests, today's Scheduled Broadcasts, and recent BookInventory work, so that I know what needs attention first.
12. As a Staff member, I want inventory, Book Requests, store content, games, events, and broadcasts grouped by task, so that I do not need to infer where an operation belongs.
13. As a Staff member, I want each operating list to support archive and restore, so that a removal is recoverable.
14. As an Admin, I want Staff Account management to appear only to me, so that account controls are not exposed to Staff.
15. As a Staff member, I want sign-in, sign-up, and authorization-denied states to match the operating console design, so that account status is clear before work begins.
16. As a customer or Staff member, I want loading, empty, success, and error states designed consistently, so that I understand each operation's outcome.
17. As a motion-sensitive visitor, I want decorative motion reduced when my system preference requests it, so that the interface remains comfortable to use.
18. As an existing visitor, I want legacy wireframe URLs to redirect to the service's canonical URLs, so that saved links and QR codes continue to work.
19. As a Staff member, I want CSV file import described accurately, so that I do not expect unsupported Excel workbook uploads.

## Implementation Decisions

- A single shared application shell owns the responsive breakpoints, global navigation, typography, colors, spacing, card treatment, focus states, loading states, and error states. Customer and Staff areas use variants of this shell rather than separate visual systems.
- Customer primary navigation is Home, 도서 검색, 즐길거리, 메뉴·요금, 이벤트·공지, and 매장 안내. The current 서울대입구역점 is implicit; no store selector is shown. Staff login remains an unobtrusive utility entry, not a customer primary destination.
- Home has no quick-search input. Calls to action navigate to the canonical 도서 검색 route. 도서 입고 신청 is reached from the no-result state and a secondary action in 도서 검색. 신규 입고 is a Home section and a 도서 검색 filter.
- Menu and pricing become a customer route backed by verified store-managed content. Public notices are a fixed event-page region; they do not create a Notice entity, a notice lifecycle, or Staff notice authoring.
- The canonical customer routes remain the application's current routes. `/search`, `/entertainment`, and `/event` redirect respectively to `/books`, `/games`, and `/events`.
- Customer content uses verified BookInventory, EntertainmentItem, Store Event, MenuItem, and store guidance. Mock prices, game counts, facility claims, reservations, popularity counts, and other unverified wireframe copy are omitted. When verified data is unavailable, the interface uses a clear empty or pending state.
- Staff routing first resolves protected Staff paths so that `/staff/events` and `/staff/games` cannot be rendered as customer routes. A role-aware operations shell groups Dashboard, 도서·입고, 매장 콘텐츠, 방송, and Admin-only 계정 management. Desktop uses a persistent side navigation; mobile uses a compact navigation pattern suited to task completion.
- The Dashboard contains only actionable operations data: pending Book Requests, today's enabled Scheduled Broadcasts, recent BookInventory changes, and direct links. Revenue, visitor, reservation, and other metrics without a verified data source are excluded.
- Inventory, EntertainmentItem, Store Event, and Scheduled Broadcast use Operational Archive consistently. Archived records are hidden from customer and default active lists, searchable in a staff archive view, and restorable. The UI provides no irreversible delete action.
- Existing domain behavior remains intact: whitespace-normalized and Initial-Consonant Search, 30-day New Arrival policy, CSV-only Inventory Import, BookRequest lifecycle, Broadcast Run tracking, Staff Account approval, and Admin authority.
- The visual system uses `#FED943`, `#1E1E1E`, and `#FAF8F2`, readable Korean typography, 2–2.5px dark outlines, rounded cards and chips, official mascot assets, and verified store photos. Motion is limited to meaningful entrance and interaction feedback and honors `prefers-reduced-motion`.
- Responsive design defines explicit compact, medium, and wide layouts. Mobile is a task-complete layout rather than a shrunken desktop: customer navigation, Staff navigation, tables, filters, forms, and primary actions rearrange for touch and constrained width. PC preserves information density with multi-column content and persistent Staff navigation. The wireframe's side-by-side desktop/mobile comparison is reference material, not the implementation layout.

## Testing Decisions

- The principal test seam is the shared application shell composed with each page. Tests verify observable navigation, role visibility, redirects, and customer and Staff state rendering rather than CSS implementation details.
- Customer integration tests cover all six navigation destinations, the absent Home search input, search no-result BookRequest entry, New Arrival placement and filter, verified-or-empty content presentation, and canonical redirects.
- Staff integration tests cover login-state navigation, dashboard action data, grouping of operating destinations, Staff versus Admin account visibility, and archive/restore behavior for every Operational Archive type.
- Responsive browser checks cover a mobile viewport, a tablet-width viewport, and a counter-PC viewport. They assert no horizontal overflow, reachable navigation, usable forms, visible focus, and readable tables/cards on both mobile and PC layouts.
- Existing domain tests remain the source of truth for Book search, CSV validation/import, New Arrival date boundaries, broadcast scheduling, and Staff identity. They are extended only for changed public behavior.
- Build, test, and production-build checks run before release. Manual acceptance verifies reduced-motion behavior, actual customer content, and the primary Staff workflows.

## Out of Scope

- Multi-store customer selection or exposing 잠실점.
- XLSX import support.
- A separately authored, scheduled, or archived notice feature.
- New pricing, game, facility, room-reservation, or popularity data not verified by store operations.
- Changes to Customer accounts, Book lending, BookRequest privacy policy, authentication policy, or broadcast scheduling semantics.
- Full pixel replication of the wireframe's comparison canvas or decorative animation that impairs usability.

## Further Notes

- This redesign updates presentation and information architecture while preserving the established domain policies in `PRD.md`, `REQUIREMENTS.md`, and `CONTEXT.md`.
- The existing CSS-only presentation is replaced incrementally behind the shared app shell so customer and Staff paths retain working states throughout the change.
