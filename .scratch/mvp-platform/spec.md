# Spec: 카툰플러스 (CartoonPlus Cafe) MVP 플랫폼

Status: ready-for-agent

## Problem Statement

만화카페(서울대입구역점, 잠실점) 고객들은 방문 시 띄어쓰기 불일치로 인한 도서 검색 실패, 서가 위치 파악의 어려움, 희망 도서 신청 채널의 부재로 불편을 겪고 있습니다. 또한 매장 직원은 유료 노코드 DB 구독료 부담, 수기/개별 도서 등록으로 인한 비효율, 파파고 번역기에 직접 텍스트를 입력해 안내 방송을 송출하는 번거로운 반복 업무에 시달리고 있습니다.

## Solution

React, Vite, TypeScript, Tailwind CSS 기반의 경량 반응형 웹 플랫폼을 구축하여 다음을 제공합니다:
1. **공백 무시(Whitespace-Agnostic) 및 초성 정규화 검색 엔진**: 띄어쓰기나 오타에 구애받지 않고 3초 안에 도서 보유 권수와 서가 번호(`[📍 A-03 서가]`)를 텍스트 카드로 확인.
2. **비회원 손님 도서 입고 신청 폼**: 원하는 도서가 없을 때 간편하게 희망 도서를 신청하고 직원이 처리.
3. **지점별 엔터테인먼트 & F&B 메뉴/요금제 카탈로그**: 닌텐도 스위치, Xbox, 보드게임 및 메뉴판 실시간 조회.
4. **직원/관리자 콘솔**: 
   - 개별 도서 빠른 수정 및 엑셀(CSV/XLSX) 대량 일괄 등록
   - 손님 도서 입고 신청 검토 및 발주/입고 완료 연동
   - Web Speech API 기반 원클릭 한국어 안내 방송(TTS) 6종 프리셋 및 커스텀 방송 송출
5. **운영비 0원 인프라**: GitHub Pages 정적 배포 및 향후 Supabase 무료 티어 완벽 호환 구조.

## User Stories

1. As a customer (손님), I want to select my target store (서울대입구역점 / 잠실점), so that I can see the exact book inventory and facilities available at that location.
2. As a customer, I want to search books without worrying about spacing or special characters (e.g., '체인소맨' or '체인소 맨'), so that I always get accurate search results.
3. As a customer, I want to search books using Korean initial consonants (e.g., 'ㅊㅇㅅㅁ' or 'ㄱㅁㅇㅋㄴ'), so that I can quickly find books even when typing fast on mobile.
4. As a customer, I want to filter books by genre (웹툰, 코믹스/소년, 순정/로맨스, 액션/판타지, 소설/라노벨), so that I can discover books in my preferred category.
5. As a customer, I want to see a text-only book card displaying title, author, publisher, volume range (e.g., 1~16권), and yellow shelf location badge (e.g., `[📍 A-03 서가]`), so that I can locate the physical book in the store immediately without waiting for heavy cover image downloads.
6. As a customer, I want to see a helpful message and a direct link to the book request form when no search results are found, so that I can request the store to purchase the book.
7. As a customer, I want to submit a book purchase request (도서 입고 신청) without logging in by entering the store, book title, author, desired volumes, and comments, so that I can conveniently suggest new titles to the manager.
8. As a customer, I want to browse Nintendo Switch, Xbox Series X, and Board Game catalogs with player count and genre filters, so that I know what games to play during my visit.
9. As a customer, I want to view F&B food/beverage menus, best-sellers, and hourly rate plans (선/후불 요금제), so that I can plan my order and budget in advance.
10. As a customer, I want to check store operating hours, contact numbers, address, and parking information, so that I can visit the store without confusion.
11. As a store staff (직원), I want to log in securely with my staff username and password on the counter POS/PC, so that I can access the staff management desk.
12. As a store staff, I want to trigger store audio announcements with a single click from 6 predefined presets (Drink ready, 10 PM ID check, Closing 30m, Closing 10m, No outside food, Keep quiet), so that I can broadcast clear Korean voice notices instantly through the store speakers without typing in translator tools.
13. As a store staff, I want to type custom text and broadcast it immediately via TTS, so that I can address ad-hoc in-store announcements.
14. As a store staff, I want to see the current broadcasting playback status (Idle / Playing / Done), so that I know the audio is active.
15. As a store staff, I want to register a new book with separated title and volume range fields, so that book titles and volume inventories remain properly normalized.
16. As a store staff, I want to inline-edit shelf location and volume ranges directly in the inventory table, so that I can update physical changes in seconds.
17. As a store staff, I want to upload an Excel (CSV/XLSX) file to bulk-import hundreds of books at once, so that new bulk shipments are updated in under a minute.
18. As a store staff, I want to view the list of customer book requests by store and status (PENDING, ORDERED, COMPLETED, REJECTED), so that I can review and track procurement.
19. As a store staff, I want to update request status with admin notes and have 'COMPLETED' automatically prefill the book registration modal, so that incoming requests convert seamlessly into inventory.
20. As a store staff, I want to log out easily to lock the staff desk when leaving the counter.

## Implementation Decisions

- **Framework & Build**: React 18+ with TypeScript and Vite.
- **Styling & UI**: Tailwind CSS with custom CartoonPlus color palette (Signature Yellow `#FED943`, Deep Charcoal `#1E1E1E`), Lucide icons, and Radix/Shadcn UI component patterns.
- **Routing**: `react-router-dom` with routes:
  - `/`: Home (Hero, quick search, 4 healing points, new book preview, store summary)
  - `/search`: Dedicated book search, genre filter, text-only cards, book request trigger
  - `/entertainment`: Nintendo Switch, Xbox, Board Games catalog with filters
  - `/menu`: F&B Menu & Pricing cards
  - `/store`: Store locations, hours, directions, parking
  - `/admin`: Staff Desk (Inventory management, Bulk Excel upload, Book Request review, TTS Broadcast console)
- **Audio TTS**: Web Speech API (`window.speechSynthesis`) configured with Korean language (`ko-KR`) voice selection, volume, rate, and pitch controls.
- **Search Utility**: Pure zero-dependency Unicode Hangul Choseong extractor (`(charCode - 44032) / 588`) and whitespace/punctuation stripper.
- **Data & State Architecture**:
  - Centralized Mock Store & Repository pattern with initial seed data matching real stores (서울대입구역점, 잠실점)
  - `localStorage` persistence for store selection, mock inventory additions, and book requests
  - Prepared interfaces matching future Supabase database schema
- **Auth**: `AuthContext` managing staff session state, login credentials verification, and route guarding for `/admin`.

## Testing Decisions

- **Testing Principles**: Test external behavior and user flows rather than implementation details. Focus on deterministic utilities (search normalization, hangul choseong extraction, volume range parsers, Excel bulk parser) and component integration.
- **Modules to Test**:
  - `hangul` / `search` utility: Whitespace ignoring, partial title matching, initial consonant matching, case sensitivity.
  - `excelParser` utility: Valid CSV/XLSX row parsing, error handling for missing required fields, normalization during import.
  - `auth` state: Login success/failure, protected route redirection.
  - `tts` manager: Mock speech synthesis lifecycle (start, pause, end events).
- **Tooling**: Vitest + React Testing Library.

## Out of Scope

- Floor Map interactive 2D coordinate pinpointing (Scheduled for Phase 2).
- External Kakao/Naver Map SDK API key integration (Phase 2).
- Staff biometric/GPS attendance clock-in system (Scheduled for Phase 3).
- Real-time room vacancy IoT integration (Phase 3).
- Cover image hosting storage (MVP is strictly text-only card UI as per service plan).

## Further Notes

- All UI text, badges, placeholders, and error messages must be strictly in natural Korean.
- Design must strictly maintain responsive layout for both mobile smartphones (customers) and desktop POS monitors (staff).
