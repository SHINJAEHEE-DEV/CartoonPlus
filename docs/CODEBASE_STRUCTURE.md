# 코드베이스 구조 및 개발 컨벤션 (Codebase Structure & Conventions)

본 문서는 **카툰플러스(CartoonPlus)** 프로젝트의 디렉터리 구조, 계층별 역할과 책임, 최신 라우트 맵, 그리고 팀 협업을 위한 표준 개발 컨벤션을 정의하는 기준 문서임.

---

## 1. 전체 디렉터리 구조 (Directory Tree)

```
cartoonplus/
├── .agents/                 # AI Agent 설정 및 스킬 정의
├── .husky/                  # Git pre-commit 훅 스크립트
├── .scratch/                # 이슈 트래커 및 스펙 작업 공간
├── docs/                    # 아키텍처, 도메인, 데이터모델, 트러블슈팅 등 프로젝트 표준 문서
│   ├── adr/                 # Architecture Decision Records (ADR-0001 ~ ADR-0010)
│   ├── ARCHITECTURE.md      # 시스템 아키텍처 및 배포/인프라 명세
│   ├── CODEBASE_STRUCTURE.md# 코드베이스 구조 및 개발 컨벤션 (본 문서)
│   ├── DATA_MODEL.md        # 데이터베이스 스키마, RLS 및 CSV 규칙
│   ├── FLOWS_AND_SCENARIOS.md# 핵심 기능 실행 흐름 및 시퀀스 다이어그램
│   ├── PRD.md               # 제품 요구사항 정의서
│   ├── REQUIREMENTS.md      # 기능/비기능 요구사항 추적 매트릭스
│   └── TROUBLESHOOTING.md   # 장애 원인 분석 및 해결 이력
├── public/                  # 정적 에셋 (파비콘, PWA 매니페스트, 음원 파일)
│   └── audio/               # 안내 방송 6종 기본 프리셋 음원 (.wav / .mp3)
├── scripts/                 # 빌드 및 자동화 스크립트
│   └── generate-ssg.js      # Puppeteer 기반 20개 라우트 정적 사전 렌더링 스크립트
├── src/                     # React 애플리케이션 소스 코드
│   ├── assets/              # SVG 배너, 지점 실사 사진, 캐릭터 일러스트 등 이미지 에셋
│   ├── features/            # 도메인(기능) 단위 컴포넌트 및 화면 모듈
│   │   ├── book-request/    # 고객 비회원 도서 입고 신청 모달 및 폼
│   │   ├── book-search/     # 도서 검색 화면 및 카탈로그 레포지토리
│   │   ├── common/          # 페이지네이션 등 공통 UI 컴포넌트
│   │   ├── customer/        # 메뉴판, 신규 도서, 매장 소개, 엔터테인먼트/이벤트 고객 화면
│   │   ├── layout/          # GNB, Header, Footer, CustomerShell, StaffShell
│   │   └── staff/           # 직원/관리자 전용 대시보드 및 운영 기능 일체
│   ├── lib/                 # 핵심 비즈니스 로직, 검색 엔진, Supabase 클라이언트, 공통 훅
│   ├── App.tsx              # 전역 라우터, 브로드캐스트 서비스, 지점 인터셉터
│   ├── main.tsx             # ReactDOM 렌더링 진입점
│   └── styles.css           # Tailwind CSS 및 전역 시맨틱 스타일 정의
├── supabase/                # Supabase 설정 및 DB 마이그레이션 스크립트
│   └── migrations/          # PostgreSQL 스키마 및 RLS 기준 마이그레이션
├── package.json             # 프로젝트 의존성 및 실행 스크립트
├── tsconfig.json            # TypeScript 프로젝트 설정
└── vite.config.ts           # Vite 번들러 설정
```

---

## 2. 주요 계층별 파일 및 컴포넌트 역할

### 2.1. `src/lib/` (핵심 비즈니스 로직 & 라이브러리 계층)

UI 종속성 없이 독립적으로 테스트(`Vitest`) 가능한 순수 함수, 비즈니스 규칙, 유틸리티 및 클라이언트 싱글톤 인스턴스를 관리함.

| 파일명                 | 주요 역할 및 책임                                                                                       |
| :--------------------- | :------------------------------------------------------------------------------------------------------ |
| `bookSearch.ts`        | 도서명/작가명 공백 무시 정규화, 한글 초성 분해/추출 알고리즘 및 클라이언트 인메모리 검색 엔진           |
| `broadcastRunner.ts`   | 1초 주기 예약 방송 도래 여부 감시, 백그라운드 오디오 재생, `broadcast_runs` 실행 이력 로깅 훅 및 실행기 |
| `broadcastSchedule.ts` | 매일 반복, 요일 반복, 특정 일시 등 예약 도래 조건 평가(`isDue`) 순수 함수                               |
| `voiceAssets.ts`       | 정적 안내 방송 음원(.wav/.mp3) 재생, 파일 유효성 검증 및 Supabase Storage 음성 파일 관리                |
| `eventRepository.ts`   | 매장 이벤트 조회, 생성, 수정, 만료 처리 및 Supabase 연동 계층                                           |
| `inventoryCsv.ts`      | 서울대입구역(Caspio), 잠실, 홍대 3개 지점의 서로 다른 CSV 포맷 파싱 및 유효성 검증                      |
| `inventoryImport.ts`   | 파싱된 CSV 데이터를 Supabase `books` 및 `book_inventories` 테이블로 배치 업서트(Upsert)하는 로직        |
| `newArrival.ts`        | 도서 재고 최초 등록일 기준 30일 이내 여부 판별(신간 `[NEW]` 배지 조건 계산) 유틸                        |
| `staffIdentity.ts`     | 로그인 ID를 가상 이메일 포맷으로 변환 및 직원 가입 신청 입력값 유효성 검증                              |
| `storeContext.tsx`     | 고객 현재 선택 매장(`snu`, `jamsil`, `hongdae`) Context 공급자, LocalStorage 연동 및 전용 Hook          |
| `storeHours.ts`        | 지점별 영업시간, 심야 운영 여부, 주차 및 휴무일 정보 계산/포맷팅 유틸                                   |
| `brandAssets.ts`       | 지점별 대표 사진 및 공식 마스코트 캐릭터 일러스트 에셋 매핑 모듈                                        |
| `supabase.ts`          | Supabase 클라이언트 싱글톤 인스턴스 초기화 및 익명 접근 설정                                            |
| `usePageTitle.ts`      | 라우트 이동 시 브라우저 탭 타이틀(`document.title`) 동적 갱신 훅                                        |

---

### 2.2. `src/features/` (화면 및 UI 계층)

#### 1) 도서 검색 및 입고 신청 (`features/book-search/`, `features/book-request/`)

- `BookSearchPage.tsx`: 초성 검색, 공백 무시 검색, 카테고리 필터링, 서가 위치 및 권수 확인을 지원하는 핵심 도서 검색 화면.
- `catalogueRepository.ts`: Supabase에서 지점별 도서/재고 데이터를 로드하여 메모리 검색 엔진에 공급하고 Realtime 변경을 구독하는 데이터 계층.
- `BookRequestStartPage.tsx` / `BookRequestForm.tsx`: 매장 미보유 도서의 입고를 고객이 간편하게 신청하는 독립 라우트 폼.
- `BookRequestModal.tsx`: 도서 검색 결과 0건 또는 도서 상세에서 즉시 호출되는 비회원 도서 신청 모달.
- `bookRequestRepository.ts`: 고객 입고 신청 등록 및 직원용 신청 상태 변경/조회 RPC 연동.

#### 2) 고객 전용 페이지 (`features/customer/`, `features/common/`, `features/layout/`)

- `NewArrivalsPage.tsx`: 최근 30일 이내 입고 도서 목록 카드 뷰 노출.
- `MenuPage.tsx` / `menuData.ts`: 지점별 F&B 메뉴(음료, 식사) 및 선/후불 요금제 안내 화면.
- `StoreIntroductionPage.tsx`: 매장 시설, 엔터테인먼트(콘솔/보드게임), 이용 수칙 및 찾아오는 길 안내.
- `PublicInfoPage.tsx`: 게임/보드게임(`games`), 지점 이벤트(`events`), 지점 상세 정보(`store`)를 제공하는 다목적 공개 화면.
- `AppShell.tsx`: 헤더(로고 2초 롱탭 직원 진입), 지점 선택 드롭다운, 푸터를 포함하는 레이아웃 래퍼 (`CustomerShell`, `StaffShell`).
- `Pagination.tsx`: 대량 데이터 목록의 접근성 지원 페이지네이션 컴포넌트.

#### 3) 직원 및 관리자 전용 (`features/staff/`)

- `StaffAccessPage.tsx`: 직원 로그인 및 신규 직원 가입 신청 폼 (`/staff`).
- `DashboardPage.tsx`: 매장 운영 현황(신규 입고 요청, 당일 방송 스케줄, 재고 현황) 통합 대시보드 (`/staff/dashboard`).
- `InventoryPage.tsx`: 도서 재고 수동 등록/수정/영구삭제 및 지점별 CSV 일괄 가져오기 화면 (`/staff/inventory`).
- `BroadcastPage.tsx`: 즉시 방송 송출, 예약 방송 스케줄 등록/관리, 방송 실행 기록 모니터링 (`/staff/broadcast`).
- `EventsPage.tsx`: 매장 이벤트 등록, 수정 및 기간 만료 제어 (`/staff/events`).
- `BookRequestsPage.tsx`: 고객 신청 도서 4단계 상태 관리(`접수` ➔ `주문 완료` ➔ `입고 완료` / `입고 불가`) 및 신규 재고 자동 등록 연계 (`/staff/requests`).
- `GamesPage.tsx`: 게임 팩 및 보드게임 실물 검증 상태 관리 (`/staff/games`).
- `StoreContentPage.tsx`: 지점별 F&B 메뉴 및 매장 시설 정보 인라인 편집 (`/staff/content`).
- `AdminAccountsPage.tsx`: 최고 관리자(`admin`) 전용 직원 가입 승인/반려, 계정 비활성화 및 임시 비밀번호 발급 화면 (`/staff/accounts`).
- `staffAuth.ts`: 직원 로그인/로그아웃, 세션 검증, 권한 확인 헬퍼.
- `StaffStoreContext.tsx`: 로그인 직원의 소속 지점 컨텍스트 공급자.
- `StaffLoadingScreen.tsx`: 직원 세션 및 권한 확인 중 표시되는 로딩 화면.

---

## 3. 라우트 맵 (`App.tsx`)

| URL 경로               | 렌더링 컴포넌트                  | 접근 권한                    | 상세 설명                                            |
| :--------------------- | :------------------------------- | :--------------------------- | :--------------------------------------------------- |
| `/` 또는 `/books`      | `BookSearchPage`                 | 전체 공개 (고객)             | 기본 지점 도서 검색 홈                               |
| `/menu`                | `MenuPage`                       | 전체 공개 (고객)             | 식음료 및 요금제 메뉴판                              |
| `/new-arrivals`        | `NewArrivalsPage`                | 전체 공개 (고객)             | 신규 입고 도서 (30일 이내)                           |
| `/about`               | `StoreIntroductionPage`          | 전체 공개 (고객)             | 매장 소개 및 시설 안내                               |
| `/games`               | `PublicInfoPage (kind="games")`  | 전체 공개 (고객)             | 실물 검증 완료 게임 목록                             |
| `/events`              | `PublicInfoPage (kind="events")` | 전체 공개 (고객)             | 매장 진행 이벤트 목록                                |
| `/store`               | `PublicInfoPage (kind="store")`  | 전체 공개 (고객)             | 지점 운영 정보 및 시설 안내                          |
| `/book-request`        | `BookRequestForm`                | 전체 공개 (고객)             | 비회원 도서 입고 신청 폼                             |
| `/stores/:storeSlug/*` | 상동 (지점 스코프)               | 전체 공개 (고객)             | 특정 지점(`snu`, `jamsil`, `hongdae`) 종속 하위 경로 |
| `/staff`               | `StaffAccessPage`                | 미인증 / 대기 직원           | 직원 로그인 및 가입 신청                             |
| `/staff/dashboard`     | `DashboardPage`                  | 승인 직원 (`staff`, `admin`) | 매장 관리 대시보드 허브                              |
| `/staff/inventory`     | `InventoryPage`                  | 승인 직원 (`staff`, `admin`) | 도서 재고 관리 및 CSV 가져오기                       |
| `/staff/requests`      | `BookRequestsPage`               | 승인 직원 (`staff`, `admin`) | 고객 희망도서 입고 신청 관리                         |
| `/staff/broadcast`     | `BroadcastPage`                  | 승인 직원 (`staff`, `admin`) | 매장 안내 방송 및 스케줄러                           |
| `/staff/events`        | `EventsPage`                     | 승인 직원 (`staff`, `admin`) | 지점 이벤트 등록/관리                                |
| `/staff/games`         | `GamesPage`                      | 승인 직원 (`staff`, `admin`) | 게임 실물 검증 및 카탈로그 관리                      |
| `/staff/content`       | `StoreContentPage`               | 승인 직원 (`staff`, `admin`) | 지점별 메뉴 및 매장 콘텐츠 편집                      |
| `/staff/accounts`      | `AdminAccountsPage`              | 최고 관리자 (`admin`)        | 직원 가입 승인 및 계정 관리                          |

---

## 4. 표준 개발 컨벤션 (Development Conventions)

### 4.1. 네이밍 규칙 (Naming Rules)

- **디렉터리명**: `kebab-case` 사용 (예: `book-search/`, `book-request/`).
- **React 컴포넌트 및 Context 파일**: `PascalCase.tsx` 사용 (예: `BookSearchPage.tsx`, `StaffStoreContext.tsx`).
- **비즈니스 로직, 유틸, 훅, 레포지토리 파일**: `camelCase.ts` 또는 `camelCase.tsx` 사용 (예: `bookSearch.ts`, `usePageTitle.ts`, `catalogueRepository.ts`).
- **테스트 파일**: 대상 파일과 동일 디렉터리 내 `*.test.ts` 또는 `*.test.tsx` 병렬 배치 (예: `bookSearch.test.ts`, `BookSearchPage.test.tsx`).

### 4.2. 아키텍처 및 계층 분리 원칙

- **비즈니스 로직 독립성 (`src/lib/`)**:
  - 도서 검색, 스케줄 판정, CSV 파싱 등 핵심 로직은 React 컴포넌트 내부 작성을 금지하고 `src/lib/` 순수 함수로 모듈화함.
  - 브라우저 DOM 의존성 없이 `Vitest` 기반 고속 단위 테스트 100% 실행 보장.
- **도메인 응집도 (`src/features/`)**:
  - 특정 도메인에 종속된 레포지토리 함수 및 서브 컴포넌트는 해당 feature 디렉터리 내에서 응집하여 관리함.
- **데이터 모델 정합성 준수**:
  - 데이터 스키마 변경 시 `supabase/migrations/` 및 `docs/DATA_MODEL.md`를 우선 갱신함.

### 4.3. 상태 관리 및 데이터 페칭 컨벤션

- **지점 컨텍스트 (Store Context)**:
  - 고객 화면: URL 파라미터(`:storeSlug`) 및 LocalStorage 기반 컨텍스트(`usePublicStore()`) 참조.
  - 직원 화면: 로그인 계정의 소속 지점(`staff_accounts.store_id`, `StaffStoreContext`)에 의한 엄격 격리.
- **실시간 데이터 동기화**:
  - 다빈도 갱신 데이터는 Supabase Realtime 채널(`subscribeToPublicCatalogueUpdates`)을 통한 실시간 리로드 처리.

### 4.4. 스타일링 원칙 (Styling Rules)

- Tailwind CSS 유틸리티 클래스를 기본으로 활용하되, 공통 상태 컴포넌트는 `src/styles.css` 시맨틱 클래스를 조합함:
  - `.state-card`: 로딩, 에러, 안내 메시지 카드
  - `.staff-access-shell`: 직원 로그인/가입 레이아웃 래퍼
  - `.badge`: 상태 표시 배지
- **반응형 디자인 원칙**:
  - 모바일 카운터 및 스마트폰 환경 우선 고려, 최소 너비 360px 이하 화면 깨짐 방지.

### 4.5. 테스트 작성 원칙 (Testing Standards)

- 모든 기능 추가 및 결함 수정 시 테스트 코드 작성 필수.
- **순수 함수**: 경계값, 특수문자, 오타 정규화 등 엣지 케이스 단위 테스트 작성.
- **컴포넌트 및 화면**: `@testing-library/react` 기반 사용자 인터랙션(입력, 클릭, 화면 전환) 검증.
- 커밋 전 `npm test` 및 `npm run typecheck` 통과 필수.
