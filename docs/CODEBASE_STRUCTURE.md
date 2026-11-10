# 코드베이스 구조 및 개발 컨벤션 (Codebase Structure & Conventions)

본 문서는 카툰플러스(CartoonPlus) 저장소의 실제 디렉터리 구조, 모듈별 역할과 책임, 전체 라우트 맵, 코딩·스타일·테스트 컨벤션을 정의하는 기준 문서임.

---

## 1. 전체 디렉터리 구조 (Directory Tree)

```text
cartoonplus/
├── .agents/                          # AI 에이전트 스킬 정의 (code-review, tdd, diagnosing-bugs 등)
├── .husky/                           # Git pre-commit 훅 설정
├── docs/                             # 프로젝트 표준 문서 (SSOT)
│   ├── adr/                          # Architecture Decision Records (ADR-0001 ~ ADR-0010)
│   ├── agents/                       # 에이전트 도메인·이슈·트리아지 가이드
│   ├── ARCHITECTURE.md               # 시스템 아키텍처, 번들링, SSG, 보안 명세
│   ├── CODEBASE_STRUCTURE.md         # 디렉터리 구조, 라우트 맵, 개발 컨벤션 (본 문서)
│   ├── DATA_MODEL.md                 # DB 스키마, View, RLS 정책, CSV 파싱 규칙
│   ├── FLOWS_AND_SCENARIOS.md        # 핵심 기능 실행 시퀀스 다이어그램
│   ├── PRD.md                        # 제품 요구사항 정의서
│   ├── REQUIREMENTS.md               # 기능(FR)/비기능(NFR) 요구사항 추적 매트릭스
│   └── TROUBLESHOOTING.md            # 기술 이슈 원인 분석 및 해결 아키텍처 로그
├── public/                           # 정적 배포 에셋
│   ├── assets/                       # 브랜드/지점 실사 이미지(WebP), 마스코트, 메뉴/시설 에셋
│   ├── audio/presets/                # 안내 방송 기본 정적 음원 파일 (.mp3)
│   └── data/                         # 지점별 도서 카탈로그 오프라인 폴백 JSON (catalogue-*.json)
├── scripts/
│   └── generate-ssg.js               # Node.js 기반 23개 공개 라우트 정적 HTML·메타·JSON-LD 생성기
├── src/
│   ├── features/                     # 도메인(기능) 단위 화면 및 리포지토리 모듈
│   │   ├── brand/                    # 공식 브랜드 랜딩 (BrandLandingPage.tsx, brandLanding.css)
│   │   ├── book-search/              # 도서 검색 화면 및 카탈로그 리포지토리
│   │   ├── book-request/             # 비회원 도서 입고 신청 폼, 모달, 리포지토리
│   │   ├── common/                   # 공통 UI 컴포넌트 (Pagination.tsx)
│   │   ├── customer/                 # 고객용 매장소개, 메뉴·요금, 신간, 게임·이벤트·안내 화면
│   │   ├── layout/                   # 고객/직원 공통 레이아웃 셸 (AppShell.tsx)
│   │   └── staff/                    # 직원 인증, 대시보드, 재고, 입고, 방송, 게임, 이벤트, 계정 관리
│   ├── lib/                          # 순수 도메인 로직, 검색 엔진, CSV 파서, 방송 러너, Supabase 클라이언트
│   ├── App.tsx                       # 전역 라우터, 코드 스플리팅(React.lazy), 전역 서비스 마운트
│   ├── main.tsx                      # React 19 엔트리포인트
│   └── styles.css                    # 고객 포털 및 직원 콘솔 시맨틱 스타일시트
├── supabase/
│   └── migrations/                   # PostgreSQL 테이블, View, RPC, RLS 마이그레이션 SQL
├── CONTEXT.md                        # 표준 도메인 용어집(Glossary) 및 ERD
├── AGENTS.md                         # 에이전트 역할 및 협업 규칙
├── package.json                      # 의존성 및 스크립트 정의
├── tsconfig.json                     # TypeScript 컴파일러 설정
└── vite.config.ts                    # Vite 번들러 및 Rollup manualChunks 설정
```

---

## 2. 계층별 주요 파일 및 책임

### 2.1 `src/lib/` (핵심 도메인 로직 및 인프라 유틸리티)

React UI로부터 분리되어 단독 단위 테스트(`Vitest`)가 가능한 순수 함수 및 싱글톤 모듈로 구성됨.

| 파일 경로                                                                                                        | 핵심 역할 및 책임                                                                                                                                                 |
| :--------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/lib/bookSearch.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/bookSearch.ts)                 | 공백·특수문자 제거 정규화, 한글 초성 추출, `WeakMap` 기반 도서 필드 사전 인덱싱(`getBookIndex`), 단일 패스 매칭(`matchesBookQuery`) 수행                          |
| [src/lib/broadcastRunner.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/broadcastRunner.ts)       | 인라인 Blob Web Worker(10초 주기) 기반 예약 방송 감시, 30초 Lease 중복 방지, 인메모리 스케줄 캐시, 오디오 재생 및 7일 이력 정리 훅(`useGlobalBroadcastScheduler`) |
| [src/lib/broadcastSchedule.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/broadcastSchedule.ts)   | 매일(`daily`), 요일별(`weekly`), 1회성(`once`) 예약 방송 도래 여부 판정(`isDue`) 순수 함수                                                                        |
| [src/lib/voiceAssets.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/voiceAssets.ts)               | 기본 6종 정적 안내 음원 메타데이터 정의, 오디오 파일 유효성 검증 및 Supabase Storage 업로드/삭제 처리                                                             |
| [src/lib/eventRepository.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/eventRepository.ts)       | 매장 이벤트 조회·생성·수정·삭제 및 종료일 기준 만료 필터링 (지점 UUID 캐시 연동)                                                                                  |
| [src/lib/inventoryCsv.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/inventoryCsv.ts)             | 서울대입구역(Caspio), 잠실, 홍대 3개 지점의 상이한 CSV 헤더 포맷 자동 감지, 권수 분리 및 11대 표준 장르 매핑                                                      |
| [src/lib/inventoryImport.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/inventoryImport.ts)       | 파싱된 CSV 행을 10건 단위 제한 동시성(`CONCURRENCY_LIMIT = 10`)으로 `upsert_inventory_for_store` RPC에 배치 전송                                                  |
| [src/lib/newArrival.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/newArrival.ts)                 | 재고 최초 등록일(`first_registered_at`) 기준 30일 이내 신간(`[NEW]`) 여부 판정                                                                                    |
| [src/lib/staffIdentity.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/staffIdentity.ts)           | 직원 로그인 ID를 내부 이메일 포맷으로 변환 및 가입 신청 입력값 검증                                                                                               |
| [src/lib/storeContext.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/storeContext.tsx)           | 공개 운영 3개 지점(`snu`, `jamsil`, `hongdae`) 메타데이터 정의, 선택 지점 `localStorage` 유지 및 `usePublicStore` 훅 제공                                         |
| [src/lib/storeHours.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/storeHours.ts)                 | 지점별 영업시간, 24시간 운영 여부, 요일별 오픈 상태 포맷팅 유틸리티                                                                                               |
| [src/lib/brandAssets.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/brandAssets.ts)               | 마스코트 일러스트 및 지점별 대표 공간 이미지 경로 매핑                                                                                                            |
| [src/lib/supabase.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/supabase.ts)                     | `VITE_SUPABASE_URL` 및 `VITE_SUPABASE_PUBLISHABLE_KEY` 기반 Supabase 싱글톤 클라이언트 초기화                                                                     |
| [src/lib/useDynamicManifest.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/useDynamicManifest.ts) | 현재 접속 지점 URL에 맞춰 PWA `<link rel="manifest">` 및 테마 메타태그 동적 전환                                                                                  |
| [src/lib/usePageTitle.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/usePageTitle.ts)             | 라우트 및 지점 컨텍스트별 `document.title`, Description, Canonical URL 동적 동기화                                                                                |

### 2.2 `src/features/` (도메인 화면 및 리포지토리 계층)

| 도메인 폴더               | 파일명                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 주요 역할                                                                                                                                                               |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`brand/`**              | [BrandLandingPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/brand/BrandLandingPage.tsx), [brandLanding.css](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/brand/brandLanding.css)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 루트(`/`) 공식 브랜드 랜딩 (공간 소개, 중고만화책 쇼핑몰 `bookis.store`, 3J 자동화, 직영점 안내, 가맹/제휴 상담 모달)                                                   |
| **`book-search/`**        | [BookSearchPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-search/BookSearchPage.tsx), [catalogueRepository.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-search/catalogueRepository.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 1단계 장르 `Set` 필터링 + 2단계 초성/정규화 검색 UI(페이지당 18개), `customer_book_catalogue` 조회 및 정적 JSON 폴백                                                    |
| **`book-request/`**       | [BookRequestForm.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-request/BookRequestForm.tsx), [BookRequestModal.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-request/BookRequestModal.tsx), [bookRequestRepository.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-request/bookRequestRepository.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 비회원 도서 입고 신청 전용 폼 및 모달, 입고 신청 등록·상태 변경·조회 리포지토리                                                                                         |
| **`customer/`**           | [MenuPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/MenuPage.tsx), [menuData.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/menuData.ts), [NewArrivalsPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/NewArrivalsPage.tsx), [StoreIntroductionPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/StoreIntroductionPage.tsx), [PublicInfoPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/PublicInfoPage.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 지점별 요금·식음료 메뉴판, 30일 신간 모아보기, 매장 공간 소개, 게임(`kind="games"`)/이벤트(`kind="events"`)/매장안내(`kind="store"`) 화면                               |
| **`layout/` & `common/`** | [AppShell.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/layout/AppShell.tsx), [Pagination.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/common/Pagination.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 고객용 `CustomerShell`(로고 2초 롱탭 직원 진입 포함), 직원용 `StaffShell`, 공통 페이지네이션                                                                            |
| **`staff/`**              | [StaffAccessPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/StaffAccessPage.tsx), [DashboardPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/DashboardPage.tsx), [InventoryPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/InventoryPage.tsx), [BookRequestsPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/BookRequestsPage.tsx), [BroadcastPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/BroadcastPage.tsx), [EventsPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/EventsPage.tsx), [GamesPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/GamesPage.tsx), [StoreContentPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/StoreContentPage.tsx), [AdminAccountsPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/AdminAccountsPage.tsx), [StaffStoreContext.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/StaffStoreContext.tsx), [staffAuth.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/staffAuth.ts) | 직원 로그인·가입 신청, 지점별 운영 대시보드, 재고 관리 및 CSV 가져오기, 희망도서 처리, 안내 방송 제어, 이벤트·게임·메뉴 편집, 관리자 계정 승인, 지점 UUID 캐싱 컨텍스트 |

---

## 3. 전체 라우트 맵 (`src/App.tsx`)

| 구분            | URL 경로                                                                             | 렌더링 컴포넌트                                    | 접근 권한        | 비고                                                   |
| :-------------- | :----------------------------------------------------------------------------------- | :------------------------------------------------- | :--------------- | :----------------------------------------------------- |
| **브랜드**      | `/`                                                                                  | `BrandLandingPage`                                 | 전체 공개        | 공식 브랜드 랜딩 (안내 방송 스케줄러 미실행)           |
| **고객 (기본)** | `/books`                                                                             | `CustomerRoute` > `BooksRoute`                     | 전체 공개        | 최근 선택 지점(기본 `snu`) 도서 검색 홈                |
| **고객 (기본)** | `/about`                                                                             | `CustomerRoute` > `StoreIntroductionPage`          | 전체 공개        | 매장 소개 및 공간 안내                                 |
| **고객 (기본)** | `/menu`                                                                              | `CustomerRoute` > `MenuPage`                       | 전체 공개        | 요금제 및 식음료 메뉴판                                |
| **고객 (기본)** | `/new-arrivals`                                                                      | `CustomerRoute` > `NewArrivalsPage`                | 전체 공개        | 최근 30일 이내 신규 입고 도서                          |
| **고객 (기본)** | `/games`                                                                             | `CustomerRoute` > `PublicInfoPage (kind="games")`  | 전체 공개        | 실물 검증 완료 콘솔/보드게임 카탈로그                  |
| **고객 (기본)** | `/events`                                                                            | `CustomerRoute` > `PublicInfoPage (kind="events")` | 전체 공개        | 진행 중 매장 이벤트                                    |
| **고객 (기본)** | `/store`                                                                             | `CustomerRoute` > `PublicInfoPage (kind="store")`  | 전체 공개        | 지점 영업시간, 주소, 주차, 시설 안내                   |
| **고객 (기본)** | `/book-request`                                                                      | `CustomerRoute` > `BookRequestRoute`               | 전체 공개        | 비회원 도서 입고 신청 전용 폼                          |
| **고객 (지점)** | `/stores/:storeSlug`                                                                 | `CustomerRoute` > `BooksRoute`                     | 전체 공개        | 특정 지점(`snu`, `jamsil`, `hongdae`) 도서 검색 홈     |
| **고객 (지점)** | `/stores/:storeSlug/{books,new-arrivals,book-request,about,menu,games,events,store}` | 각 대응 컴포넌트                                   | 전체 공개        | URL 지점 스코프가 고정된 고객 포털 하위 경로           |
| **직원 인증**   | `/staff`                                                                             | `StaffAccessPage`                                  | 미인증 / 대기    | 직원 로그인 및 신규 가입 신청                          |
| **직원 콘솔**   | `/staff/:storeSlug/dashboard`                                                        | `ProtectedStaffRoute` > `DashboardPage`            | `staff`, `admin` | 지점 운영 현황 요약 대시보드                           |
| **직원 콘솔**   | `/staff/:storeSlug/inventory`                                                        | `ProtectedStaffRoute` > `InventoryPage`            | `staff`, `admin` | 도서 재고 CRUD 및 CSV 일괄 가져오기                    |
| **직원 콘솔**   | `/staff/:storeSlug/requests`                                                         | `ProtectedStaffRoute` > `BookRequestsPage`         | `staff`, `admin` | 도서 입고 신청 4단계 처리 및 재고 등록 연계            |
| **직원 콘솔**   | `/staff/:storeSlug/broadcast`                                                        | `ProtectedStaffRoute` > `BroadcastPage`            | `staff`, `admin` | 수동 방송 송출, 예약 스케줄러, 7일 실행 이력           |
| **직원 콘솔**   | `/staff/:storeSlug/events`                                                           | `ProtectedStaffRoute` > `EventsPage`               | `staff`, `admin` | 매장 이벤트 등록·수정·종료 관리                        |
| **직원 콘솔**   | `/staff/:storeSlug/games`                                                            | `ProtectedStaffRoute` > `GamesPage`                | `staff`, `admin` | 보유 게임 등록 및 실물 검증 토글                       |
| **직원 콘솔**   | `/staff/:storeSlug/content`                                                          | `ProtectedStaffRoute` > `StoreContentPage`         | `staff`, `admin` | 지점 요금제, 식음료 메뉴, 매장 안내 인라인 편집        |
| **관리자 전용** | `/staff/:storeSlug/accounts`                                                         | `ProtectedStaffRoute` > `AdminAccountsPage`        | `admin` 전용     | 직원 가입 승인/비활성화 및 임시 비밀번호 발급          |
| **호환 경로**   | `/search`, `/entertainment`, `/event`, `/staff/{subPath}`                            | `Navigate` / `StaffLegacyRedirect`                 | 전체             | 구버전 북마크 접근 시 현행 표준 경로로 자동 리다이렉트 |

---

## 4. 표준 개발 컨벤션 (Development Conventions)

### 4.1 네이밍 및 파일 배치 규칙

- **디렉터리명**: `kebab-case` 사용 (`book-search/`, `book-request/`).
- **React 컴포넌트 파일**: `PascalCase.tsx` 사용 (`BookSearchPage.tsx`, `BrandLandingPage.tsx`).
- **비즈니스 로직·유틸·리포지토리·훅 파일**: `camelCase.ts(x)` 사용 (`bookSearch.ts`, `catalogueRepository.ts`, `useDynamicManifest.ts`).
- **테스트 파일**: 테스트 대상과 동일한 디렉터리에 `*.test.ts(x)`로 병렬 배치함.

### 4.2 성능 및 상태 관리 원칙

- **단일 패스 및 사전 인덱싱**: 대규모 배열(`15,000+` 도서)을 다루는 컴포넌트에서는 다중 `.filter()` 체이닝 대신 `useMemo` 단일 패스 루프와 `WeakMap` 사전 인덱싱을 사용함.
- **네트워크 워터폴 방지**: 독립적인 복수 테이블 조회(예: 방송 프리셋 + 스케줄 + 실행 이력)는 `Promise.all`로 병렬 호출하고, 변하지 않는 지점 슬러그-UUID 매핑은 `resolveStoreIdBySlug` 인메모리 캐시를 재사용함.
- **스타일 격리**: 고객 포털 및 직원 콘솔 공통 스타일은 [src/styles.css](file:///Users/jaehee/Desktop/projects/cartoonplus/src/styles.css)의 CSS 변수(`--bg-paper`, `--accent-yellow` 등)를 사용하고, 브랜드 공식 랜딩(`/`)은 [src/features/brand/brandLanding.css](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/brand/brandLanding.css)의 `.bl-root` 네임스페이스로 격리함.

### 4.3 품질 검증 필수 절차

코드 또는 설정 변경 후 커밋 전 반드시 아래 3단계 검증을 통과해야 함:

1. `npm run typecheck`: TypeScript 컴파일 에러 0건 확인.
2. `npm test`: Vitest 25개 스위트(141개 테스트) 전체 통과 확인.
3. `npm run build`: 프로덕션 번들링 및 23개 라우트 SSG 생성 정상 완료 확인.
