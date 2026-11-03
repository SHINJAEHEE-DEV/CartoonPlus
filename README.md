# CartoonPlus (카툰플러스)

만화카페 고객 도서 탐색 및 매장 직원 현장 운영 지원 반응형 웹 애플리케이션.  
월 고정 운영비 $0(도메인 실비 제외)를 지향하며, Cloudflare Pages 및 Supabase 기반 서버리스 아키텍처로 운영.

현재 **서울대입구역점(`snu`)**, **잠실점(`jamsil`)**, **홍대점(`hongdae`)** 3개 직영 지점의 다지점 운영 전면 지원.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript 5.9, Vite 7, React Router 7
- **Database & Auth & Storage**: Supabase (PostgreSQL 15+, Row Level Security, Auth, Storage)
- **Deployment & SEO**: Cloudflare Pages (정적 호스팅), Puppeteer-core 기반 SSG 정적 사전 렌더링
- **Testing & Quality**: Vitest, Testing Library (React/User-Event), Prettier, Husky, lint-staged

---

## 📋 사전 필수 요구사항 (Prerequisites)

- **Node.js**: `v20.10.0` 이상 (LTS 권장)
- **npm**: `v10.0.0` 이상
- **Supabase 환경**: Supabase 프로젝트 URL 및 Anon/Publishable API Key 확보

---

## 🚀 로컬 환경 셋업 (Local Setup)

### 1. 저장소 클론 및 의존성 설치

```bash
git clone https://github.com/SHINJAEHEE-DEV/CartoonPlus.git
cd cartoonplus
npm install
```

> `npm install` 수행 시 Husky pre-commit 훅 자동 등록.

### 2. 환경 변수 설정 (`.env.local`)

프로젝트 루트에 `.env.local` 파일 생성 후 Supabase 연동 정보 기입.

```env
# Supabase 프로젝트 URL
VITE_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase 공개 API 키 (Publishable/Anon Key - RLS 기반 접근 제어)
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

> **주의**: `.env.local`은 보안 정보로 Git 형상 관리 대상에서 제외 (`.gitignore` 적용).

### 3. 로컬 개발 서버 구동

```bash
npm run dev
```

- 브라우저 접속: `http://localhost:5173`

---

## 🧪 검증 및 코드 품질 관리 (Verification)

커밋 및 PR 제출 전 필수 정적 검사 및 테스트 수행.

```bash
# 1. 전체 단위 및 통합 테스트 실행 (23개 스위트, 119개 테스트)
npm test

# 2. TDD 실시간 감시 모드
npm run test:watch

# 3. TypeScript 정적 타입 검사 (noEmit)
npm run typecheck

# 4. Prettier 포맷팅 검증
npm run format:check

# 5. Prettier 포맷팅 자동 적용
npm run format
```

---

## 📦 빌드 및 배포 절차 (Build & Deploy)

### 로컬 프로덕션 빌드 & SSG 생성

```bash
# TypeScript 컴파일 -> Vite 번들링 -> Puppeteer 20개 라우트 정적 HTML 생성
npm run build
```

### Cloudflare Pages 배포 설정

- **Framework preset**: `None` (또는 `Vite`)
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `dist`
- **Environment variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## 🔑 주요 시스템 기능 및 운영 정책

1. **초성 및 공백 무시 도서 검색 (`/books`, `/stores/:slug/books`)**:
   - 한글 초성(`ㅊㅇㅅㅁ`) 및 공백 제거 정규화로 검색 정확도 보장 (`체인소 맨` = `체인소맨`).
   - 입고 후 30일 이내 도서 신간(`[NEW]`) 자동 노출.
2. **비회원 도서 입고 신청 (`/book-request`)**:
   - 고객 개인정보(연락처 등) 미수집 원칙, 도서 정보만으로 간편 신청 지원.
   - 접수(`received`) ➔ 주문완료(`ordered`) ➔ 입고완료(`completed`) ➔ 신규 재고 자동 등록 연계.
3. **숨은 직원 진입 (Hidden Staff Access)**:
   - 고객 화면 내 로그인 버튼 미노출.
   - 상단 로고 **2초 롱탭(모바일) 또는 길게 클릭(PC)** 시 직원 화면(`/staff`) 진입.
4. **지점별 권한 격리 (Store Context & RLS)**:
   - 일반 직원(`staff`): 소속 지점의 재고/방송/이벤트/메뉴 한정 관리.
   - 최고 관리자(`admin`): 전 지점 관리 및 직원 계정 승인/비활성화/임시 비밀번호 발급.
5. **무중단 전역 안내 방송 스케줄러 (`GlobalBroadcastService`)**:
   - 카운터 PC 비로그인 상태에서도 웹 브라우저 실행 시 예약 방송 자동 송출 ([ADR-0010](docs/adr/0010-unauthenticated-broadcast-and-7day-retention.md)).
   - 매장 오픈 시 카운터 브라우저 최초 1회 클릭을 통한 Web Audio 엔진 활성화(Unlock) 필수.

---

## 📚 표준 문서 체계 (Standard Documentation)

| 문서명                       | 파일 경로                                                  | 주요 내용                                            |
| :--------------------------- | :--------------------------------------------------------- | :--------------------------------------------------- |
| **제품 요구사항 정의서**     | [docs/PRD.md](docs/PRD.md)                                 | 비즈니스 목표, As-Is/To-Be, 사용자 사이클, 기능 명세 |
| **요구사항 명세서**          | [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)               | 기능(FR)/비기능(NFR) 요구사항 추적 매트릭스          |
| **시스템 아키텍처**          | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)               | 인프라 구조, 보안 정책, 캐싱 및 SSG 파이프라인       |
| **코드베이스 구조 & 컨벤션** | [docs/CODEBASE_STRUCTURE.md](docs/CODEBASE_STRUCTURE.md)   | 디렉터리 역할, 네이밍 룰, 코딩 컨벤션, 라우트 맵     |
| **데이터 모델 명세서**       | [docs/DATA_MODEL.md](docs/DATA_MODEL.md)                   | DB ERD, 테이블 명세, RLS 정책, CSV 파싱 규칙         |
| **기능 흐름 및 시나리오**    | [docs/FLOWS_AND_SCENARIOS.md](docs/FLOWS_AND_SCENARIOS.md) | 고객/직원 주요 사용자 흐름 시퀀스 다이어그램         |
| **트러블슈팅 가이드**        | [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)         | 오디오 자동재생, CSV 인코딩, 배포 이슈 해결 로그     |
| **아키텍처 의사결정 기록**   | [docs/adr/](docs/adr/)                                     | ADR-0001 ~ ADR-0010 기술 의사결정 기록               |
| **도메인 용어집**            | [CONTEXT.md](CONTEXT.md)                                   | 프로젝트 표준 도메인 용어 정의                       |

---

## 🗄️ 데이터베이스 마이그레이션 관리

DB 스키마의 물리적 기준은 `supabase/migrations/` 디렉터리임.

- 스키마 및 RLS 변경 시 타임스탬프 기반 신규 마이그레이션 파일 추가 원칙.
- 배포 완료된 기존 마이그레이션 파일의 직접 수정 금지.
- Supabase CLI 사용 시 `npx supabase db push` 또는 `npx supabase migration new <name>` 활용.
