# CartoonPlus (카툰플러스)

만화카페 브랜드 공식 랜딩(`/`), 지점별 고객 도서 검색·매장 안내 포털(`/stores/:storeSlug`), 매장 직원·관리자 운영 콘솔(`/staff`)을 통합 제공하는 반응형 웹 애플리케이션임.  
월 고정 서버 운영비 \$0(도메인 실비 제외) 달성을 목표로 Cloudflare Pages 정적 호스팅과 Supabase(PostgreSQL, RLS, Auth, Storage) 기반 서버리스 아키텍처로 구성함.

---

## 1. 프로젝트 개요 및 서비스 구성

| 구분 | 진입 경로 | 대상 사용자 | 주요 제공 기능 |
| :--- | :--- | :--- | :--- |
| **브랜드 공식 랜딩** | `/` | 일반 방문객, 예비 가맹점주 | 만화카페 공간 소개, 중고만화책 쇼핑몰(`bookis.store`) 안내, 3J 무인·자동화 시스템 소개, 가맹·창업·제휴 문의 |
| **지점별 고객 포털** | `/books`<br/>`/stores/:storeSlug/*` | 매장 방문 고객 (`snu`, `jamsil`, `hongdae`) | 실시간 도서 초성·정규화 검색, 서가 위치 확인, 신간 안내, 비회원 도서 입고 신청, 요금·식음료 메뉴, 게임·이벤트 조회 |
| **직원 운영 콘솔** | `/staff`<br/>`/staff/:storeSlug/*` | 매장 스태프 (`staff`), 최고 관리자 (`admin`) | 지점별 도서 재고 CRUD 및 CSV 일괄 동기화, 입고 신청 처리, 매장 메뉴·이벤트 관리, 안내 방송 수동/예약 송출, 직원 계정 승인(`admin`) |

- **공개 운영 직영점 (3개 지점)**: 서울대입구역점(`snu`), 잠실점(`jamsil`), 홍대점(`hongdae`)

---

## 2. 기술 스택 (Tech Stack)

| 영역 | 기술 및 버전 | 도입 목적 및 역할 |
| :--- | :--- | :--- |
| **Core Frontend** | React `^19.1.1`, TypeScript `~5.9.2` | 컴포넌트 기반 UI 렌더링 및 정적 타입 안정성 확보 |
| **Build & Routing** | Vite `^7.1.5`, React Router `^7.18.3` | ESModule 고속 번들링, Rollup 청크 분리(`manualChunks`), 다지점 URL 스코프 라우팅 |
| **Styling** | Semantic Vanilla CSS (`styles.css`, `brandLanding.css`) | 외부 CSS 런타임 의존성 제거, CSS Custom Properties 기반 테마 분리 |
| **Backend (BaaS)** | Supabase (`@supabase/supabase-js ^2.57.4`) | PostgreSQL 15+ 데이터베이스, Row Level Security(RLS) 권한 격리, Auth, Storage(음원/배너) |
| **SEO & Hosting** | Cloudflare Pages, Node.js SSG (`scripts/generate-ssg.js`) | 23개 공개 라우트 정적 HTML 사전 생성, `sitemap.xml` / `robots.txt` / JSON-LD 구조화 데이터 제공 |
| **Testing & Quality** | Vitest `^3.2.4`, Testing Library, Prettier, Husky | 25개 테스트 스위트(141개 단위·통합 테스트) 검증 및 커밋 전 코드 포맷팅 강제 |

---

## 3. 빠른 시작 가이드 (Quick Start)

### 3.1 사전 요구사항 (Prerequisites)

- **Node.js**: `v20.10.0` 이상 (LTS 권장)
- **npm**: `v10.0.0` 이상
- **Supabase 프로젝트**: 연동 대상 Supabase URL 및 Publishable(Anon) Key 필요

### 3.2 설치 및 환경 변수 설정

```bash
# 1. 저장소 클론 및 패키지 설치 (Husky 훅 자동 등록)
git clone https://github.com/SHINJAEHEE-DEV/CartoonPlus.git
cd cartoonplus
npm install
```

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 환경 변수를 설정함 (`.gitignore`에 의해 Git 추적에서 제외됨).

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

> **오프라인 폴백 지원**: 환경 변수 미설정 시 로컬 정적 JSON(`public/data/catalogue-*.json`) 및 로컬 스토리지 폴백 모드로 자동 전환되어 UI 확인 및 테스트 실행이 가능함.

### 3.3 주요 실행 스크립트

| 명령어 | 실행 동작 | 비고 |
| :--- | :--- | :--- |
| `npm run dev` | Vite 로컬 개발 서버 구동 (`http://localhost:5173`) | HMR 활성화 |
| `npm test` | Vitest 전체 단위·통합 테스트 1회 실행 | 25개 스위트 / 141개 테스트 |
| `npm run test:watch` | Vitest 파일 변경 감지(Watch) 모드 실행 | TDD 개발 시 활용 |
| `npm run typecheck` | TypeScript 컴파일러 정적 타입 검사 (`tsc -b --noEmit`) | 빌드 전 타입 무결성 확인 |
| `npm run build` | 타입체크 ➔ Vite 프로덕션 번들링 ➔ 23개 라우트 SSG 생성 | `dist/` 디렉터리 산출 |
| `npm run build:cloudflare` | Cloudflare Pages 배포용 프로덕션 빌드 (`--base /`) | CI/CD 배포 표준 명령어 |
| `npm run format:check` | Prettier 코드 포맷팅 규칙 준수 여부 검증 | `npm run format`으로 자동 수정 |

---

## 4. 프로젝트 디렉터리 구조 (Project Structure)

```text
cartoonplus/
├── public/                        # 정적 에셋 (음원 MP3, 매장/메뉴 WebP 이미지, 오프라인 카탈로그 JSON, PWA 매니페스트)
├── scripts/
│   └── generate-ssg.js            # 빌드 후 23개 공개 라우트 정적 HTML/메타태그/JSON-LD 생성 스크립트
├── supabase/
│   └── migrations/                # PostgreSQL 스키마, View, RPC, RLS 정책 마이그레이션 SQL (물리적 단일 기준)
├── src/
│   ├── App.tsx                    # 전역 라우트 정의, 코드 스플리팅(React.lazy), 카운터 방송 스케줄러 마운트
│   ├── main.tsx                   # React 19 엔트리포인트
│   ├── styles.css                 # 고객 포털 및 직원 콘솔 공통 스타일시트
│   ├── features/
│   │   ├── brand/                 # 공식 브랜드 랜딩 페이지 (BrandLandingPage.tsx, brandLanding.css)
│   │   ├── book-search/           # 도서 검색 UI 및 카탈로그 리포지토리 (SWR 인메모리 캐시 + 정적 JSON 폴백)
│   │   ├── book-request/          # 비회원 도서 입고 신청 폼, 모달 및 리포지토리
│   │   ├── common/                # 공통 페이지네이션 컴포넌트 (Pagination.tsx)
│   │   ├── customer/              # 고객용 매장소개, 요금/식음료 메뉴, 신간, 게임/이벤트/매장정보 화면
│   │   ├── layout/                # 고객/직원 공통 레이아웃 셸 (AppShell.tsx)
│   │   └── staff/                 # 직원 인증, 대시보드, 재고 관리, 입고 처리, 방송 제어, 계정 관리
│   └── lib/                       # 도메인 유틸리티 (초성 검색 인덱싱, CSV 파서, 지점 설정, 방송 스케줄러, SEO 메타)
└── docs/                          # 기획서, 요구사항, 아키텍처, 데이터 모델, 시나리오, 트러블슈팅, ADR 문서
```

---

## 5. 핵심 운영 정책 및 현장 카운터 PC 체크리스트

### 5.1 시스템 핵심 정책
- **초성 및 공백 무시 도서 검색**: `WeakMap` 사전 인덱싱과 단일 패스 매칭을 통해 초성 검색(`ㅊㅇㅅㅁ` ➔ `체인소 맨`) 및 띄어쓰기 무시 검색을 지원하며, 최초 등록 후 30일 이내 도서에 `[NEW]` 배지를 자동 부여함.
- **숨은 직원 진입 (Hidden Staff Access)**: 고객 화면에는 직원 로그인 버튼을 노출하지 않으며, 상단 로고를 **2초 이상 길게 누름(Long Press)**으로써 `/staff`에 진입함.
- **비로그인 카운터 자동 방송**: 매장 카운터 PC에서 브라우저가 실행되어 있으면 별도 직원 로그인 없이도 예약된 시간에 안내 방송을 자동 송출함 ([ADR-0010](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/adr/0010-unauthenticated-broadcast-and-7day-retention.md)).

### 5.2 현장 카운터 PC 운영 체크리스트

| 점검 항목 | 확인 시점 | 현장 조치 방법 |
| :--- | :--- | :--- |
| **브라우저 오디오 잠금 해제 (Unlock)** | 매일 매장 오픈 시 / 브라우저 재시작 직후 | 카운터 PC 브라우저 화면 내 아무 곳이나 **최초 1회 마우스 클릭**하여 Web Audio 자동재생 차단 해제 |
| **카운터 PC 지점 스코프 확인** | 최초 셋업 시 / 캐시 초기화 후 | URL이 해당 지점 경로(`/stores/snu`, `/stores/jamsil`, `/stores/hongdae`)로 설정되어 있는지 확인 |
| **재고 CSV 일괄 업로드** | Caspio / 포스 재고 동기화 시 | 파일명에 지점 식별자(`snu`, `jamsil`, `hongdae`) 포함 여부 확인 (UTF-8 및 EUC-KR/CP949 인코딩 자동 감지 지원) |

---

## 6. 표준 문서 네비게이션 (Documentation Index)

| 분류 | 문서명 | 경로 | 핵심 책임 및 포함 내용 |
| :--- | :--- | :--- | :--- |
| **도메인** | 도메인 모델 및 용어집 | [CONTEXT.md](file:///Users/jaehee/Desktop/projects/cartoonplus/CONTEXT.md) | 표준 도메인 용어(Glossary) 정의 및 핵심 엔티티 관계도(ERD) |
| **기획** | 제품 요구사항 정의서 (PRD) | [docs/PRD.md](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/PRD.md) | 비즈니스 목표, 타깃 페르소나, 기능 범위, 성과 지표 |
| **명세** | 요구사항 명세서 | [docs/REQUIREMENTS.md](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/REQUIREMENTS.md) | 기능(FR) 및 비기능(NFR) 요구사항 ID 추적 매트릭스 |
| **설계** | 시스템 아키텍처 | [docs/ARCHITECTURE.md](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/ARCHITECTURE.md) | 서버리스 인프라, 번들 청크 분리, 23개 라우트 SSG, RLS 보안 및 성능 지표 |
| **구조** | 코드베이스 구조 및 컨벤션 | [docs/CODEBASE_STRUCTURE.md](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/CODEBASE_STRUCTURE.md) | 디렉터리 상세 역할, 전체 라우트 맵, 코딩·스타일·테스트 컨벤션 |
| **데이터** | 데이터 모델 명세서 | [docs/DATA_MODEL.md](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/DATA_MODEL.md) | PostgreSQL 테이블·뷰(`customer_book_catalogue`) 명세, RLS 정책, CSV 파싱 규칙 |
| **흐름** | 기능 흐름 및 시나리오 | [docs/FLOWS_AND_SCENARIOS.md](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/FLOWS_AND_SCENARIOS.md) | 인증, 초성 검색, 전역 안내 방송, 입고 신청 및 CSV 업로드 시퀀스 다이어그램 |
| **이력** | 트러블슈팅 로그 | [docs/TROUBLESHOOTING.md](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/TROUBLESHOOTING.md) | 주요 기술 이슈 원인 분석, 성능 최적화 내역 및 재발 방지 규칙 |
| **결정** | 아키텍처 의사결정 기록 | [docs/adr/](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/adr/) | ADR-0001 ~ ADR-0010 주요 기술 및 도메인 의사결정 기록 |
| **거버넌스** | 에이전트 협업 규칙 | [AGENTS.md](file:///Users/jaehee/Desktop/projects/cartoonplus/AGENTS.md) | 개발 워크플로우, 이슈/트리아지/도메인 관리 및 문서 작성 원칙 |
