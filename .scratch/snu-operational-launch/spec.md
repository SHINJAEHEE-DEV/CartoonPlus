# Spec: 카툰플러스 서울대입구역점 운영 전환

Status: ready-for-agent

## Problem Statement

서울대입구역점의 기존 Imweb·Caspio 기반 사이트는 모바일과 PC 레이아웃이 깨지고, 도서명 공백 무시·초성 검색을 제공하지 않아 고객이 도서 권수와 서가 위치를 스스로 정확히 찾기 어렵다. 직원은 Caspio에서 재고를 건별로 갱신하고, 고객의 희망 도서를 수기로 받고, 매장 방송을 파파고에 직접 입력한다. 기존 사이트 운영에는 연 30만 원이 들며 고객에게 게임 목록과 진행 중 이벤트를 신뢰성 있게 제공하기도 어렵다.

서울대입구역점은 다음 주 일요일에 새 사이트로 운영을 전환한다. 도메인 비용을 제외한 월 고정 운영비는 0원이어야 하며, 고객과 직원이 여러 기기에서 같은 최신 운영 데이터를 사용해야 한다.

## Solution

GitHub Pages에서 고객 포털과 직원 운영 콘솔을 제공하고, Supabase에서 실제 운영 데이터와 승인된 직원 계정을 중앙 관리한다. 고객은 브랜드 중심 홈에서 매장을 소개받고, 별도 도서 검색 화면에서 도서명·작가명·초성으로 도서 재고와 서가 위치를 찾는다. 게임, 이벤트, 메뉴·요금, 매장 안내와 희망 도서 신청도 로그인 없이 이용한다.

승인된 직원은 재고, CSV 재고 가져오기, 희망 도서 신청, 게임·이벤트, 방송 프리셋과 예약 방송을 관리한다. 관리자는 직원이 가진 모든 권한에 더해 직원 가입 승인, 비활성화, 임시 비밀번호 발급을 처리한다. 방송은 매장 PC 브라우저가 상시 실행된 상태에서 예약 시각에 자동 재생하고, 실행 결과를 기록한다.

## User Stories

1. As a 서울대입구역점 고객, I want to see a brand-focused Home, so that I understand what CartoonPlus offers before choosing an activity.
2. As a 모바일 고객, I want every customer page to fit my screen without horizontal overflow or broken controls, so that I can use the site while visiting the store.
3. As a 고객, I want a separate 도서 검색 screen, so that I can immediately search for a book without navigating through promotional content.
4. As a 고객, I want to search by a partial 도서명, so that I can find a book without entering its full title.
5. As a 고객, I want to search by 작가명, so that I can find books when I know the creator but not the exact title.
6. As a 고객, I want 공백 무시 정규화, so that `체인소맨` and `체인소 맨` return the same relevant books.
7. As a 고객, I want 초성 검색 for an all-consonant query, so that I can find a book quickly on a Korean mobile keyboard.
8. As a 고객, I want non-matching general queries to return no result, so that a search never claims an unrelated book is available.
9. As a 고객, I want each result to show 도서명, 작가명, 장르, 실제 보유 권수, and 서가 위치, so that I can locate a non-loan book in the store without asking staff.
10. As a 고객, I want an empty search result to lead directly to 도서 입고 신청, so that an unavailable title is not lost to a verbal request.
11. As a 고객, I want to submit a 도서 입고 신청 without an account or contact information, so that I can request a book with minimal personal-data collection.
12. As a 고객, I want to see 신규 입고 도서 for 30 days after its first registration, so that I can discover recently added books.
13. As a 고객, I want to see only verified 게임 목록, so that I do not arrive expecting a game the store does not own.
14. As a 고객, I want a clear 점검 중 state when the full 게임 목록 has not been verified, so that missing information is not mistaken for availability.
15. As a 고객, I want to see active 매장 이벤트 with their period and content, so that I can use current offers.
16. As a 고객, I want expired 매장 이벤트 to disappear automatically after the end date, so that I do not see stale promotions.
17. As a 고객, I want to see menu, 이용 요금, 주소, 영업시간, 전화번호, 주차·이용 안내, so that I can plan a visit without relying on the old site.
18. As a 직원, I want to apply for a 직원 계정 with my name, login ID, password, and phone-number last four digits, so that an administrator can review my request.
19. As a 가입 대기 직원, I want to be unable to access 운영 기능 before approval, so that approval is a real access boundary.
20. As an 승인된 직원, I want to sign in with a login ID and password rather than an email address, so that account use fits the store workflow.
21. As a 직원, I want a 관리자 to issue an 임시 비밀번호 when I forget my password, so that account recovery does not require collecting my email address.
22. As a 관리자, I want to approve or deactivate 직원 계정, so that only current staff can access operating data.
23. As an 최초 관리자, I want my first administrator account to be created through the Supabase management interface, so that the account-approval workflow has a secure starting point.
24. As a 직원, I want to register a new 도서 with title, author, category, actual volume range, and shelf location, so that customer search results reflect physical inventory accurately.
25. As a 직원, I want to update existing 도서 재고 details, so that moved shelves and changed holdings are visible to customers.
26. As a 직원, I want to archive and restore an 운영 항목, so that an accidental deletion does not permanently erase a book, game, event, or 예약 방송.
27. As a 직원, I want to import a Caspio CSV, so that many books can be updated without individual data entry.
28. As a 직원, I want CSV rows with the same 도서명 and 작가명 to update their volume range and shelf location, so that repeated imports preserve one current inventory record.
29. As a 직원, I want new CSV rows added and existing-only rows preserved for review, so that an import cannot silently delete physical inventory.
30. As a 직원, I want to see and filter 도서 입고 신청 by its internal processing stage, so that I can progress every request from 접수 to 주문 완료, 입고 완료, or 입고 불가.
31. As a 직원, I want 입고 완료 to guide me into registering the resulting 도서 재고, so that fulfilled requests become a customer-visible 신규 입고 도서.
32. As a 직원, I want to manage verified 게임 목록 and 매장 이벤트, so that customer content stays current without developer intervention.
33. As a 직원, I want to copy a past 이벤트 into a new draft, so that recurring promotions can be prepared quickly.
34. As a 직원, I want to trigger a Korean 방송 프리셋 with one action, so that frequent announcements no longer require a translation site.
35. As a 직원, I want to enter and immediately broadcast custom Korean text, so that I can handle an unplanned announcement.
36. As a 직원, I want to create daily, day-of-week, and one-time 예약 방송 and turn each reservation on or off, so that routine announcements run at the correct time.
37. As a 직원, I want scheduled broadcasts to start automatically while the counter browser is open, so that no separate opening check is required.
38. As a 직원, I want to see each 방송 실행 기록 as 대기, 성공, or 실패 and replay a failed announcement, so that I can recover from audio or browser issues.
39. As a 관리자, I want the same operating privileges as a 직원, so that account administration does not block normal store work.

## Implementation Decisions

- The first Launch Store is 서울대입구역점 only. Customer pages expose only this store; the model remains extensible for later stores such as 잠실점.
- The customer portal provides Home, 도서 검색, 게임 목록, 이벤트, 매장 안내, menu·요금, and 직원 로그인. Home introduces CartoonPlus and its visit experience; 도서 검색 is a separate destination.
- React, TypeScript, Vite, Tailwind CSS, React Router, and GitHub Pages provide the static web application. The published address is `https://shinjaehee-dev.github.io/CartoonPlus/`; a purchased custom domain may be connected later.
- Supabase provides PostgreSQL data, storage for approved visual assets, authentication, and Row Level Security. Customer-visible data is publicly readable only where explicitly designated public. Operating writes require an approved Staff Account. Admin adds account approval, deactivation, and temporary-password privileges.
- Staff sign-up accepts name, login ID, password, and phone-number last four digits. The implementation may map a login ID to an internal authentication identifier, but the customer-facing and staff-facing login remains ID and password. No real staff email is collected. Password recovery is an administrator-issued temporary password.
- A Staff Account has pending, approved, and deactivated states. Pending and deactivated users cannot perform Staff operations. The Initial Admin is created manually in Supabase before staff self-registration opens.
- The database separates Book from BookInventory. A Book carries reusable metadata; BookInventory carries the 서울대입구역점's actual volume range, ShelfLocation, availability note, first-registration timestamp, and archival state. Books are in-store only; lending, return, and temporary loan states are not modeled.
- Search normalizes title, author, and query by removing whitespace and punctuation before partial matching. Initial-Consonant Search runs only when the query consists solely of Korean consonants after whitespace removal. A query whose normalized text is empty must not match any book.
- New Arrival is created only when a BookInventory is first registered, never when an existing record is edited. It is customer-visible for 30 calendar days, then automatically excluded from the customer list.
- BookRequest stores title, optional author, optional desired volume, optional customer comment, submitted time, internal stage, and staff note. It stores no customer contact information. Its stage transition is 접수 → 주문 완료 → 입고 완료 or 입고 불가. Completing a request prepares a new inventory registration without automatically claiming that physical stock exists.
- Inventory Import parses the supplied Caspio CSV, validates rows before applying them, and uses title plus author as the matching rule. Matching rows update volume range and shelf location; new rows are added. Rows present only in existing inventory are not deleted by an import and are surfaced for staff review.
- EntertainmentItem is not customer-visible until a Staff member verifies it as currently present. Until then, the public page presents Pending Game Catalog rather than invented availability.
- Store Event has title, start date, end date, content, optional image, public state, creation metadata, and archival state. It is hidden from customers starting the day after its end date. Staff can view, archive, restore, and copy expired events.
- Menu, pricing, store contact details, hours, parking, and visit guidance are staff-manageable public content. Initial values must be verified against current store information before launch.
- Broadcasting uses the browser's Korean Web Speech capability with predefined BroadcastPreset messages and custom text. Scheduled Broadcast supports daily, selected-weekday, and one-time timing with an enabled switch. It assumes the store PC and browser remain open and does not require a separate opening readiness action.
- Each broadcast attempt produces a Broadcast Run. The UI records pending before playback, marks success after completion, marks failure on a speech or playback error, and offers immediate replay for failures.
- Operational Archive hides archived BookInventory, EntertainmentItem, Store Event, and Scheduled Broadcast from customer and ordinary active views while retaining them for Staff restoration.
- The customer Home follows the supplied wireframe's yellow, charcoal, rounded-card visual language. Functional controls use one consistent linear SVG icon system. Emoji, 3D sticker, and generated decorative icons are excluded. Only official brand assets and owner-approved store or 체험단 photos may be used. Search and Staff screens favor readability over decoration.
- The known 서울대입구역점 CSV is the baseline inventory source. Game lists, event details, logos, mascot assets, store photos, and any revised public information are added only after being placed in the project assets and verified for current accuracy.

## Testing Decisions

- Tests assert observable behavior and data access rules rather than component internals. The highest useful seams are the customer portal, Staff operations console, broadcast operation, and Supabase access policy.
- Customer portal tests cover responsive navigation targets, search by title, author, whitespace-normalized query, valid all-consonant query, nonmatching query, empty query, result details, no-result BookRequest entry, New Arrival's 30-day boundary, verified-game visibility, Pending Game Catalog, and expired-event hiding.
- Staff operations tests cover pending-account denial, approval, deactivation, administrator-only account operations, temporary-password flow, creation and editing of BookInventory, archive and restore, BookRequest state changes, event copy and expiration, game verification, and public-content updates.
- Inventory Import tests cover valid quoted CSV data, commas inside fields, title-volume separation where present in source data, row-level validation failures, add behavior, title-and-author update behavior, and protection against implicit deletion.
- Search utility tests include positive and negative cases. In particular, punctuation-only and unrelated all-consonant queries must not match every book.
- Broadcast tests mock browser speech behavior to verify preset and custom starts, pending/success/failure Broadcast Run transitions, immediate replay, enabled and disabled reservations, and daily, weekday, and one-time schedule calculations. A manual acceptance test on the actual 서울대입구역점 PC verifies Korean voice output and scheduled execution while the browser is open.
- Supabase integration tests verify public reads cannot modify operating data, pending/deactivated users cannot use Staff operations, Staff can perform operating updates, and Admin-only account operations are rejected for Staff.
- Build and deployment checks run type checking, automated tests, and production build before GitHub Pages publication. The deployed site is manually checked on a customer mobile viewport and the counter PC viewport before Operational Cutover.

## Out of Scope

- Customer accounts, membership, book reservation, lending, return, and individual customer notification about BookRequest outcomes.
- 잠실점 customer exposure or operational data migration during the 서울대입구역점 launch.
- A purchased custom domain; GitHub Pages is the launch address.
- Unverified game titles, unverified events, or unverified public store information.
- Email-based Staff authentication and self-service password reset.
- Floor-map shelf pinpointing, Kakao/Naver Map API integration, staff attendance, digital work checklists, and live room or seat availability.
- Guaranteed scheduled broadcast delivery when the store PC, browser, browser speech engine, or speaker connection is unavailable. Failures are recorded for manual replay.

## Further Notes

- Operational Cutover occurs next Sunday. The launch gate is a verified 서울대입구역점 CSV import, verified public store details, required brand/photo assets, confirmed active events, and the actual game list when available.
- Existing Imweb and Caspio operation remains the source to verify current facts until cutover; the new site becomes the customer and staff operating surface after cutover.
- The existing site costs approximately 300,000 KRW yearly. The release target is 0 KRW recurring service cost excluding a future custom-domain purchase.
- The project already has a wireframe and asset directory. Asset provenance and owner permission must be recorded when externally sourced store or 체험단 images are added.
