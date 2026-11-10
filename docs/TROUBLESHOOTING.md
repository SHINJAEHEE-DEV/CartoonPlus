# 카툰플러스 개발 및 트러블슈팅 기록 (Troubleshooting & Dev Notes)

본 문서는 카툰플러스 개발 및 다지점 운영 과정에서 발생한 주요 기술 이슈의 원인 분석, 재현 조건, 해결 아키텍처, 데이터 전처리 규칙 및 운영상 주의사항을 관리하는 기준 문서임.

---

## 1. 주요 트러블슈팅 요약 매트릭스 (Issue Summary Matrix)

| 일자         | 영역          | 문제 현상 (Symptom)                                                                | 핵심 원인 (Root Cause)                                                                                 | 해결 조치 (Resolution)                                                                                                                                                                                                                     |  상태   |
| :----------- | :------------ | :--------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: |
| `2026-11-11` | 성능 / 번들   | 대규모 도서 검색 지연, 직원 탭 이동 시 4단 직렬 Waterfall, CSV 업로드 지연         | 매 키 입력마다 정규식 장르 분할 반복, 하위 라우트별 `ProtectedStaffRoute` 재마운트, 단건 직렬 RPC 호출 | `WeakMap` 사전 인덱싱 + 장르 `Set`($O(1)$), 단일 `<Outlet />` 레이아웃 + UUID 캐시 + `Promise.all`, CSV 10건 배치 병렬화, Rollup 청크 분리                                                                                                 | ✅ 완료 |
| `2026-10-19` | 라우팅 / 인증 | 잠실점 고객 페이지에서 로고 롱탭 시 서울대입구역점 관리자 화면으로 이동            | `onStaffEntry` 지점 전달 누락 및 `admin` 계정의 DB 기본 지점(`snu`) 강제 리다이렉트                    | `CustomerRoute`에서 현재 `store.slug`를 로컬 스토리지에 기록 후 `/staff/:slug/dashboard`로 직접 이동하도록 수정                                                                                                                            | ✅ 완료 |
| `2026-10-19` | 안내 방송     | 홍대점 매장에서 잠실점 안내 방송 송출 및 도서 검색 PC와 방송 PC 간 Lease 경합      | `/staff/broadcast`에 지점 URL 스코프 부재 및 매장 내 비방송용 PC의 자동 스케줄러 가동                  | 기기별 명시적 수신기 등록 토글(`cartoonplus_broadcast_receiver_enabled`) 도입 및 `/staff/:storeSlug/*` URL 스코핑 적용                                                                                                                     | ✅ 완료 |
| `2026-10-18` | 안내 방송     | 모바일/태블릿 접속 시 터치 제스처로 인해 매장 안내 방송이 모바일 기기에서 재생됨   | `useGlobalBroadcastScheduler`가 모바일 브라우저에서도 동일하게 구동됨                                  | `isMobileDevice()` User-Agent 판별 헬퍼를 추가하여 모바일 기기에서는 스케줄러 및 Web Worker 기동 즉시 차단                                                                                                                                 | ✅ 완료 |
| `2026-10-14` | DB / 재고     | 도서명 수정 저장 시 `books_title_author_idx` 고유 키 충돌 에러 노출                | `update_inventory_for_store` RPC가 타 지점과 공유 중인 `books` 마스터 행을 직접 `UPDATE`함             | 대상 `(title, author)` 존재 시 안전 재지정(Re-point)·병합하고 공유 도서는 신규 마스터로 분리하는 마이그레이션 적용 및 에러 메시지 한국어화                                                                                                 | ✅ 완료 |
| `2026-10-13` | 안내 방송     | 홍대점 예약 방송 비활성화 후에도 밤 11시 마감 방송이 계속 재생됨                   | `detectCurrentStoreSlug`의 로컬 스토리지 키 불일치로 `'snu'` 폴백 발생 및 다중 탭 캐시 미동기화        | `cartoonplus_staff_store` / `cartoonplus_customer_store` 키 우선 참조 및 `BroadcastChannel` 기반 다중 탭 즉시 동기화 적용                                                                                                                  | ✅ 완료 |
| `2026-09-28` | DB / 재고     | 신규 도서 등록 시 `ON CONFLICT` 제약조건 부재 SQL 에러 발생                        | 이전 마이그레이션에서 `books (title, author)` 고유 제약조건이 삭제됨                                   | `books_title_author_idx` 고유 인덱스 복구 및 `upsert_inventory_for_store` RPC 내 방어적 조회 후 분기 로직 적용                                                                                                                             | ✅ 완료 |
| `2026-09-28` | CSV 파서      | 홍대점 1~2글자 단문 도서명에 오매칭 작가 할당 및 단일 슬래시(`/`) 도서 미분리      | `key.includes(normTitle)` 부분 매칭 버그 및 단일 슬래시 구분자 정규식 미비                             | 최소 3글자 이상 매칭 제약 적용 및 `splitHongdaeTitles` 정규식 고도화 (`1/2`, `Fate/stay` 보존 및 구분자 분리)                                                                                                                              | ✅ 완료 |
| `2026-09-22` | DB / 조회     | 잠실점 도서가 1,000권까지만 표시되고 신규 등록 도서가 검색되지 않음                | Supabase PostgREST 기본 단일 응답 상한(`max-rows = 1000`)에 의해 앞쪽 1,000건만 조회됨                 | `catalogueRepository.ts` 및 `InventoryPage.tsx`에 `.range(page * 1000, ...)` 기반 1,000건 단위 순차 청크 로드 적용                                                                                                                         | ✅ 완료 |
| `2026-09-22` | DB / 재고     | 기존 도서 제목 정정 시 기존 재고가 남고 새 재고 레코드가 중복 생성됨               | 수정 저장 시에도 제목·작가 기준 `upsert_inventory_for_store`를 호출함                                  | 재고 ID를 기준으로 갱신하는 `update_inventory_for_store` 전용 RPC 분리 적용                                                                                                                                                                | ✅ 완료 |
| `2026-09-18` | 안내 방송     | 카운터 PC 비로그인 상태에서 예약 방송 미송출 및 `broadcast_runs` 무한 누적         | 스케줄러가 로그인 라우트 내부에만 마운트되어 있었고 익명 RLS 권한이 차단됨                             | 전역 `<GlobalBroadcastService />` 승격, 익명 Lease/실행 기록 RLS 허용 및 7일 경과 로그 자동 정리 트리거 적용 ([ADR-0010](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/adr/0010-unauthenticated-broadcast-and-7day-retention.md)) | ✅ 완료 |
| `2026-09-18` | 안내 방송     | 정적 기본 프리셋으로 스케줄 저장 시 `invalid input syntax for type uuid` 에러 발생 | 기본 프리셋이 DB에 시드되지 않아 드롭다운 `value`로 한글 제목이 전송됨                                 | 6종 기본 정적 프리셋 DB 시드 마이그레이션 적용 및 `isValidUuid` 검증 추가                                                                                                                                                                  | ✅ 완료 |
| `2026-09-16` | 배포 / 라우팅 | Cloudflare Pages에서 `/staff` 직접 접근 및 새로고침 시 404 반복                    | 루트 `public/404.html` 리다이렉트 스크립트가 Cloudflare 기본 SPA Fallback을 가로막음                   | 레거시 `public/404.html` 제거 및 Cloudflare Pages 표준 SPA Fallback 활성화                                                                                                                                                                 | ✅ 완료 |
| `2026-09-11` | 안내 방송     | 백그라운드 탭 전환 시 `setInterval` 지연으로 정시 방송 누락 및 DB 폴링 과부하      | 브라우저 비활성 탭 타이머 스로틀링(1분 이상 지연) 및 15초 주기 REST API 폴링                           | 인라인 Blob Web Worker(10초 무감속 틱) + 인메모리 스케줄 캐시 + 이벤트 드리븐 갱신 구조 도입                                                                                                                                               | ✅ 완료 |

---

## 2. 영역별 상세 분석 및 해결 아키텍처

### 2.1 검색·네트워크·번들링 종합 성능 최적화 (2026-11-11)

- **증상 및 병목**:
  1. [BookSearchPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-search/BookSearchPage.tsx)에서 검색어 입력 시마다 전체 도서 $N$권에 대해 `splitBookCategories` 정규식 분할과 문자열 정규화를 매번 재수행함.
  2. [src/App.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/App.tsx)에서 `/staff/:storeSlug/*` 하위 8개 라우트가 각각 개별 `<ProtectedStaffRoute>`를 마운트하여 탭 이동 시마다 `auth.getUser()` ➔ `staff_accounts` ➔ `stores` 조회가 직렬(Waterfall)로 재실행됨.
  3. [InventoryPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/InventoryPage.tsx)에서 제목 자동완성 매칭 시 $O(N)$ 배열 탐색과 수천 개 `<datalist>` 옵션을 매번 렌더링하고, CSV 업로드 시 행마다 직렬 RPC를 호출함.
- **해결 조치**:
  1. **검색 사전 인덱싱 (`bookSearch.ts`)**: `WeakMap<SearchableBook, IndexedBookFields>`에 정규화 제목·작가·출판사, 초성 문자열, 표준 장르 `Set`을 통합 캐싱하고, `BookSearchPage`의 `useMemo`를 1단계(장르 `Set.has` $O(1)$ 필터)와 2단계(단일 패스 검색어 매칭)로 분리함.
  2. **네트워크 워터폴 제거 (`App.tsx`, `StaffStoreContext.tsx`, `BroadcastPage.tsx`)**: 직원 콘솔 라우트를 단일 `<ProtectedStaffRoute />`(`<Outlet />`) 부모 라우트로 통합하고, `resolveStoreIdBySlug` 인메모리 캐시 및 `Promise.all` 병렬 조회를 적용함. 또한 고객 도서 카탈로그에 SWR 메모리 캐시(`catalogueMemoryCache`)를 적용함.
  3. **재고 자동완성 및 CSV 배치 최적화 (`InventoryPage.tsx`, `inventoryImport.ts`)**: 도서 제목-객체 `Map`($O(1)$ 조회)과 상위 50건 자동완성 슬라이싱을 적용하고, CSV 가져오기에 `CONCURRENCY_LIMIT = 10` 배치 병렬 워커를 도입함.
  4. **빌드 청크 분리 및 웹폰트 비동기 로딩 (`vite.config.ts`, `index.html`)**: Rollup `manualChunks`(`vendor-react`, `supabase`, `brand-landing`, `customer-pages`) 분리로 초기 엔트리 JS를 31.76 kB(gzip 10.67 kB)로 경량화하고, CSS `@import` 렌더 블로킹 폰트를 `<link rel="preload" as="style">` 비동기 방식으로 전환함.

### 2.2 지점별 안내 방송 격리 및 백그라운드 Web Worker 스케줄러 (2026-09-11 ~ 2026-10-19)

- **증상 및 재현 조건**:
  - 카운터 PC에서 창을 최소화하거나 다른 탭을 열면 브라우저의 백그라운드 탭 `setInterval` 스로틀링으로 인해 정시 방송(`21:45`, `22:45` 등)이 누락됨.
  - 매장 내 도서 검색 전용 PC나 모바일 기기에서 스케줄러가 중복 실행되어 방송 경합이 발생하거나, 관리자 지점 전환 이력으로 인해 타 지점 방송이 송출됨.
- **해결 아키텍처 ([src/lib/broadcastRunner.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/broadcastRunner.ts))**:
  1. **인라인 Blob Web Worker 타이머**: 브라우저 메인 스레드 스로틀링 영향을 받지 않는 Web Worker 스레드에서 10초 주기로 정밀 틱을 발생시킴.
  2. **기기 단위 명시적 수신기 등록 (`cartoonplus_broadcast_receiver_enabled`)**: 기본값으로 모든 단말의 자동 방송 송출을 비활성화(`OFF`)하고, 실제 앰프 스피커가 연결된 카운터 PC에서만 `[이 PC를 방송 송출 기기로 등록]` 토글을 활성화하도록 통제함.
  3. **모바일 및 비지점 경로 차단**: `isMobileDevice()` 감지 시 또는 루트 브랜드 랜딩(`/`) 경로에서는 스케줄러를 즉시 조기 종료(Early Return)함.
  4. **다중 탭 동기화 및 7일 롤링 이력**: `BroadcastChannel('cartoonplus_broadcast_channel')`로 동일 브라우저 내 탭 간 스케줄 변경을 즉시 전파하고, `broadcast_runs` 테이블은 트리거를 통해 최근 7일 기록만 보존함.

### 2.3 다지점 도서 마스터 공유 및 재고 수정 고유 키 충돌 방지 (2026-09-22 ~ 2026-10-14)

- **증상 및 재현 조건**:
  - 직원 재고 화면에서 도서명을 수정할 때 이미 타 지점 또는 동일 지점에 존재하는 `(title, author)` 조합으로 변경하면 `duplicate key value violates unique constraint "books_title_author_idx"` DB 오류가 발생함.
- **원인 분석**:
  - `books` 테이블은 전 지점이 공유하는 도서 마스터이고 `book_inventories`는 지점별 재고임. 기존 `update_inventory_for_store` RPC가 `books` 행을 직접 `UPDATE`하여 기존 마스터 행과 고유 인덱스가 충돌하거나 타 지점 도서명까지 변경되는 부작용이 있었음.
- **해결 조치**:
  1. 수정 대상 `(title, author)`가 이미 `books`에 존재하면 현재 지점 재고(`book_inventories.book_id`)를 해당 마스터 ID로 재지정(Re-point)하고 동일 지점 내 중복 재고는 병합 처리함.
  2. 수정 대상이 신규 `(title, author)`인 경우, 타 지점 재고가 현재 `book_id`를 참조 중이면 신규 `books` 레코드를 분리 생성하고 단독 참조 시에만 제자리 갱신(In-place Update)을 수행함.
  3. [InventoryPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/InventoryPage.tsx)의 `formatDatabaseError()`를 통해 모든 DB 제약조건 오류를 한국어 안내 문구로 변환하여 표시함.

### 2.4 PostgREST 1,000건 응답 상한 우회 및 대량 카탈로그 로드 (2026-09-22)

- **증상**: 잠실점(2,672종), 홍대점(1,881종) 등 1,000권 초과 지점에서 도서 목록이 1,000권까지만 표시되고 `ㅂ`~`ㅎ` 구간 도서가 검색되지 않음.
- **원인**: Supabase PostgREST 서버의 기본 단일 쿼리 응답 상한(`max-rows = 1000`)으로 인해 `.range()` 없이 조회 시 1,000행에서 절단됨.
- **해결 조치**: [catalogueRepository.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-search/catalogueRepository.ts) 및 [InventoryPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/InventoryPage.tsx)에서 `PAGE_SIZE = 1000` 단위의 `while` 루프와 `.range(from, to)` 페이지네이션을 적용하여 지점 전체 도서를 누락 없이 로드함.

---

## 3. 지점별 원본 CSV 데이터 전처리 및 정합성 규칙

### 3.1 지점별 원본 포맷 차이 및 파싱 규칙 ([src/lib/inventoryCsv.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/inventoryCsv.ts))

| 구분                       | 원본 컬럼 구조                                           | 전처리 및 정규화 규칙                                                                                                                                                                                |
| :------------------------- | :------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **서울대입구역점 (`snu`)** | `title, number, genre, author` (Caspio 포맷)             | • `title` 후미 숫자(`/(.+?)\s+(\d+)$/`)를 추출하여 도서명과 권수(`1~N권`)로 분리함.<br/>• `number` 값을 `책장 N번` 또는 구역 서가명으로 변환함.                                                      |
| **잠실점 (`jamsil`)**      | `a_` (서가 번호), `a___` (`//` 구분 도서 묶음)           | • `a___` 문자열을 `//` 기준으로 분할하여 개별 도서 후보로 추출함.<br/>• 후미 공백+정수를 권수(`1~N권`)로 분리하고 모호한 괄호 표기는 수동 검토 대상으로 분리함.                                      |
| **홍대점 (`hongdae`)**     | `a_` (복합 구분자 도서 묶음), `a_1` (서가), `a_2` (장르) | • `//` 및 권수 뒤 단일 `/`를 구분자로 처리하되, 제목 고유 슬래시(`1/2`, `Fate/stay` 등)와 선두/후미 슬래시는 정규식으로 보호·정제함.<br/>• 원본 28개 세부 분류를 서비스 **11대 표준 장르**로 매핑함. |

### 3.2 운영 데이터 정합성 유지 원칙

1. **11대 표준 장르 단일화 (`STANDARD_BOOK_GENRES`)**:
   - `웹툰`, `액션/모험`, `로맨스/로판`, `판타지/무협`, `일상/개그`, `스릴러/추리/호러`, `드라마/스포츠/SF`, `BL/GL`, `일반도서/소설`, `코믹스/그래픽노블`, `성인` 외 비표준 장르 태그 유입을 방지하며, 장르명 내부의 슬래시(`/`)는 분할하지 않고 보존함.
2. **점진적 서가 동기화 원칙**:
   - 매장 내 실물 도서 재배치 진행 중에는 현장 혼선을 막기 위해 메타데이터(도서명, 작가, 표준 장르, 권수)만 우선 동기화하고, 실물 이동이 완료된 구역(예: A구역 웹툰)부터 단계적으로 `shelf_location`을 갱신함.
