# 디렉터리 구조 및 파일별 역할 명세 (Codebase Structure & File Responsibilities)

본 문서는 **카툰플러스(CartoonPlus)** 프론트엔드 및 백엔드 코드베이스의 디렉터리 구조와 각 파일의 책임과 역할을 정의합니다.

---

## 1. 전체 디렉터리 구조 요약 (Directory Overview)

```
cartoonplus/
├── .agents/                 # AI Agent 설정 및 스킬 정의
├── .scratch/                # 이슈 트래커 및 스펙 워크스페이스
├── docs/                    # 아키텍처, 도메인, 데이터모델, 트러블슈팅 등 프로젝트 핵심 문서
│   ├── adr/                 # Architectural Decision Records (의사결정 기록)
│   ├── ARCHITECTURE.md      # 시스템 전체 아키텍처 및 인프라
│   ├── CODEBASE_STRUCTURE.md# 코드베이스 구조 및 파일별 역할 (본 문서)
│   ├── FLOWS_AND_SCENARIOS.md# 핵심 기능 실행 흐름 및 다이어그램
│   ├── DATA_MODEL.md        # 데이터베이스 스키마 및 엔티티 정의
│   └── TROUBLESHOOTING.md   # 장애 해결 및 운영 팁 기록
├── public/                  # 정적 에셋 (파비콘, PWA 매니페스트, 오디오 파일 등)
│   └── audio/               # 안내 방송 프리셋 음원 (.mp3)
├── src/                     # React 애플리케이션 소스 코드
│   ├── assets/              # SVG 배너, 지점 사진, 캐릭터 일러스트 등 이미지 에셋
│   ├── features/            # 기능(도메인) 단위 컴포넌트 및 페이지
│   │   ├── book-request/    # 도서 입고 신청 (고객용)
│   │   ├── book-search/     # 도서 검색 화면 및 카탈로그 레포지토리
│   │   ├── customer/        # 메뉴판, 신규 도서, 매장 소개 등 일반 고객용 페이지
│   │   ├── layout/          # GNB, Header, Footer, 공통 AppShell
│   │   ├── staff/           # 직원/관리자 전용 대시보드 및 운영 페이지
│   │   └── common/          # 페이지네이션 등 공통 UI 컴포넌트
│   ├── lib/                 # 핵심 비즈니스 로직, 검색 알고리즘, Supabase 클라이언트
│   ├── App.tsx              # 메인 라우터 및 상태 공급자
│   ├── main.tsx             # ReactDOM 렌더링 진입점
│   └── styles.css           # Tailwind CSS 및 글로벌 스타일 정의
├── supabase/                # Supabase 설정 및 DB 마이그레이션 SQL 스크립트
├── package.json             # 프로젝트 의존성 및 실행 스크립트
└── vite.config.ts           # Vite 번들러 빌드 설정
```

---

## 2. 주요 계층별 파일 및 컴포넌트 역할

### 2.1. `src/lib/` (핵심 비즈니스 로직 & 라이브러리 계층)

이 계층은 순수 TypeScript 기반으로 UI와 분리되어 독립적으로 테스트(`Vitest`) 가능한 비즈니스 로직을 포함합니다.

| 파일명                 | 주요 역할 및 책임                                                                                                                     |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `bookSearch.ts`        | 도서 제목/작가명 공백 제거 정규화, 한글 초성 분해/추출 알고리즘 및 클라이언트 검색 엔진                                               |
| `voiceAssets.ts`       | 정적 안내 방송 음원(.wav/.mp3) 재생, 유효성 검증 및 Supabase Storage 음성 파일 업로드/삭제 모듈                               |
| `broadcastRunner.ts`   | 1초 주기로 예약 방송 도래 여부를 감시하고 백그라운드에서 오디오 자동 재생 및 실행 로그(`broadcast_runs`)를 기록하는 React Hook & 실행기 |
| `broadcastSchedule.ts` | 매일 반복, 요일 반복, 특정 일시 등 예약 조건 평가(`isDue`) 순수 함수                                                                  |
| `eventRepository.ts`   | 매장 이벤트 조회, 생성, 수정, 만료 처리 및 Supabase 연동 계층                                                                         |
| `inventoryCsv.ts`      | Caspio 등 외부 시스템의 CSV 재고 파일을 파싱하고 도서명/권수/서가위치 유효성을 검증하는 파서                                          |
| `inventoryImport.ts`   | 파싱된 CSV 데이터를 Supabase `books` 및 `book_inventories` 테이블로 배치 업서트(Upsert)하는 로직                                      |
| `newArrival.ts`        | 최근 30일 이내에 등록된 도서를 신규 입고 도서로 판별하는 날짜 계산 로직                                                               |
| `staffIdentity.ts`     | 로그인 아이디 ➔ 가상 이메일 포맷팅 및 가입 입력 유효성 검증                                                                           |
| `storeContext.tsx`     | 손님이 현재 보고 있는 매장(`snu`, `jamsil`, `hongdae`)의 Context 공급자 및 Hook                                                       |
| `supabase.ts`          | Supabase 클라이언트 싱글톤 인스턴스 초기화 및 익명 접근 설정                                                                          |
| `usePageTitle.ts`      | 라우트 이동 시 브라우저 탭 타이틀(`document.title`)을 동적으로 갱신하는 훅                                                            |

---

### 2.2. `src/features/` (화면 및 UI 계층)

#### 1) 고객용 기능 (`features/customer/`, `features/book-search/`, `features/book-request/`)

- `BookSearchPage.tsx`: 고객이 방문하여 가장 먼저 사용하는 핵심 도서 검색 화면. 초성 검색, 카테고리 필터링, 서가 위치 및 권수 확인 지원.
- `catalogueRepository.ts`: Supabase에서 전체 도서 및 지점별 재고 데이터를 가져와 메모리 검색 엔진에 공급하는 데이터 로더.
- `BookRequestStartPage.tsx` / `BookRequestForm.tsx`: 매장에 없는 도서의 입고를 손님이 직접 신청하는 폼 UI.
- `NewArrivalsPage.tsx`: 최근 30일 이내에 새롭게 입고된 도서 목록을 카드 형태로 노출.
- `MenuPage.tsx`: 카페 식음료 및 요금제 메뉴판 화면.
- `StoreIntroductionPage.tsx`: 매장 시설, 즐길거리(콘솔/보드게임), 이용 수칙 안내.

#### 2) 레이아웃 및 공통 (`features/layout/`, `features/common/`)

- `AppShell.tsx`: 상단 내비게이션 바, 로고, 지점 선택 드롭다운, 푸터를 아우르는 전체 레이아웃 래퍼.
- `Pagination.tsx`: 도서 목록, 이벤트 목록 등 대량 데이터의 페이징 처리 컴포넌트.

#### 3) 직원 및 관리자 전용 (`features/staff/`)

- `StaffAccessPage.tsx`: 직원 로그인 및 신규 직원 가입 신청 폼.
- `DashboardPage.tsx`: 로그인 후 매장 운영 현황(신규 입고 요청, 오늘 방송 스케줄, 재고 현황)을 한눈에 보는 허브.
- `InventoryPage.tsx`: 수동 재고 추가/수정/삭제 및 CSV 재고 일괄 가져오기 화면.
- `BroadcastPage.tsx`: 수동 즉시 방송 송출, 예약 방송 스케줄 등록/관리, 방송 실행 기록(로그) 모니터링.
- `EventsPage.tsx`: 매장 진행 이벤트 등록, 이미지 첨부, 공개/숨김 제어.
- `BookRequestsPage.tsx`: 손님이 신청한 도서의 상태 변경(`접수` ➔ `주문 완료` ➔ `입고 완료` / `입고 취소`).
- `GamesPage.tsx`: 매장 보유 닌텐도/PS4 게임 팩 및 보드게임 카탈로그 관리.
- `AdminAccountsPage.tsx`: 최고 관리자 전용 직원 계정 가입 승인/반려 및 권한(`staff`/`admin`) 관리 화면.
- `StoreContentPage.tsx`: 지점별 운영 정보 및 시설 안내 텍스트/이미지 관리.
- `staffAuth.ts`: 직원 로그인/로그아웃, 세션 검증, 권한 확인 헬퍼.
- `StaffStoreContext.tsx`: 직원이 소속된 지점의 컨텍스트를 하위 컴포넌트에 공급.

---

## 3. 라우트 맵 (`App.tsx`)

| URL 경로           | 렌더링 컴포넌트         | 접근 권한             | 비고               |
| :----------------- | :---------------------- | :-------------------- | :----------------- |
| `/`                | `BookSearchPage`        | 손님 (전체 공개)      | 홈 (도서 검색)     |
| `/menu`            | `MenuPage`              | 손님 (전체 공개)      | 식음료/요금 메뉴   |
| `/new-arrivals`    | `NewArrivalsPage`       | 손님 (전체 공개)      | 신규 입고 도서     |
| `/about`           | `StoreIntroductionPage` | 손님 (전체 공개)      | 매장 소개          |
| `/request`         | `BookRequestStartPage`  | 손님 (전체 공개)      | 도서 입고 신청     |
| `/staff/login`     | `StaffAccessPage`       | 손님/미승인 직원      | 직원 로그인/가입   |
| `/staff`           | `DashboardPage`         | 승인된 직원           | 매장 관리 대시보드 |
| `/staff/inventory` | `InventoryPage`         | 승인된 직원           | 도서 재고 관리     |
| `/staff/broadcast` | `BroadcastPage`         | 승인된 직원           | 방송 및 스케줄러   |
| `/staff/events`    | `EventsPage`            | 승인된 직원           | 이벤트 관리        |
| `/staff/requests`  | `BookRequestsPage`      | 승인된 직원           | 입고 신청 관리     |
| `/staff/games`     | `GamesPage`             | 승인된 직원           | 게임/보드게임 관리 |
| `/staff/accounts`  | `AdminAccountsPage`     | 최고 관리자 (`admin`) | 직원 계정 승인     |
