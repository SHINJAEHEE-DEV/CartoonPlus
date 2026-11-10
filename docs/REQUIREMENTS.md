# 카툰플러스 요구사항 명세서 (Requirements Specification)

본 문서는 카툰플러스의 기능(FR) 및 비기능(NFR) 요구사항과 실제 구현 상태를 추적 관리하는 단일 기준 문서임.

> **기준 스펙**: 브랜드 공식 랜딩(`/`) + 3개 직영 지점(`snu`, `jamsil`, `hongdae`) 고객 포털 및 직원 콘솔 (ADR-0001 ~ ADR-0010 반영 완료)  
> **최종 갱신일**: 2026-11-11

---

## 1. 요구사항 분류 및 구현 단계 정의

### 1.1 도메인 코드 체계

| 코드    | 도메인 명칭                | 관리 범위                                                                                   |
| :------ | :------------------------- | :------------------------------------------------------------------------------------------ |
| `AUTH`  | 직원·관리자 인증 및 권한   | 직원 가입 신청, 계정 승인/비활성화, 임시 비밀번호 발급, 세션 유지, 지점별 RLS 격리          |
| `BOOK`  | 도서 검색 및 카탈로그      | 공백 무시·초성 검색, 11대 장르 필터, 텍스트 전용 카드, 30일 신간 배지, SWR 캐싱             |
| `INV`   | 도서 재고 및 CSV 동기화    | 단건 재고 CRUD, 3개 지점 CSV 자동 감지·배치 Upsert, 소속 지점 한정 영구 삭제                |
| `BCAST` | 매장 안내 방송             | 6종 기본 음원 및 커스텀 업로드 프리셋, 비로그인 Web Worker 스케줄러, 7일 실행 로그          |
| `REQ`   | 도서 입고 신청             | 비회원 개인정보 미수집 신청, 4단계 처리 라이프사이클, 신규 재고 자동 등록 연계              |
| `STORE` | 브랜드 랜딩 및 매장 콘텐츠 | 공식 브랜드 랜딩(`/`), 지점별 포털 홈, 검증 게임 카탈로그, 이벤트 자동 만료, 메뉴·요금·안내 |
| `UI`    | 공통 UI 및 라우팅          | 반응형 레이아웃, 단일 `<Outlet />` 직원 콘솔, 레거시 경로 호환 리다이렉트                   |

### 1.2 단계별(Phase) 구축 상태

| Phase     | 단계명                    | 포함 범위                                                                                                                                                    | 상태 |
| :-------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :--: |
| **1단계** | MVP 구축                  | 초성·정규화 도서 검색, 비회원 입고 신청, 검증 게임·이벤트, 메뉴·요금제, 직원 승인제, CSV 가져오기, 안내 방송, \$0 서버리스 인프라                            | 완료 |
| **2단계** | 다지점 확장 & 브랜드 분리 | 3개 직영점(`snu`, `jamsil`, `hongdae`) URL 라우팅 및 권한 격리, 루트(`/`) 공식 브랜드 랜딩 개편, 비로그인 전역 방송 스케줄러(ADR-0010), 23개 라우트 SSG 생성 | 완료 |
| **3단계** | 매장 운영 고도화          | 매장 평면도(Floor Map) 서가 위치 핀포인트, 직원 디지털 근태 관리, 룸·좌석 실시간 현황                                                                        | 예정 |

---

## 2. 기능 요구사항 (Functional Requirements)

### 2.1 직원 및 관리자 인증 (`AUTH`)

| ID            | 요구사항명            | 상세 명세                                                                                                                                          | 우선순위 | 상태 | 관련 구현체                                                                                                         |
| :------------ | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | :--: | :------------------------------------------------------------------------------------------------------------------ |
| `FR-AUTH-001` | 직원 가입 신청        | • 이름, 소속 지점, 로그인 ID, 비밀번호, 휴대폰 뒷 4자리(`phone_last4`) 입력 신청 지원.<br/>• 이메일 미수집 원칙 적용 및 기본 상태 `pending` 부여.  |    상    |  ✅  | [StaffAccessPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/StaffAccessPage.tsx)     |
| `FR-AUTH-002` | 계정 승인 및 비활성화 | • 관리자(`admin`)가 가입 대기 계정을 승인(`approved`)하거나 기존 계정을 비활성화(`deactivated`)함.<br/>• 미승인·비활성 계정의 운영 콘솔 접근 차단. |    상    |  ✅  | [AdminAccountsPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/AdminAccountsPage.tsx) |
| `FR-AUTH-003` | 로그인 세션 관리      | • 로그인 ID를 내부 식별 이메일 포맷으로 변환하여 Supabase Auth 인증 수행.<br/>• 브라우저 재접속 시 세션 자동 복원 및 명시적 로그아웃 지원.         |    상    |  ✅  | [staffAuth.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/staffAuth.ts)                   |
| `FR-AUTH-004` | 임시 비밀번호 발급    | • 비밀번호 분실 직원에 대해 관리자가 보안 RPC를 통해 임시 비밀번호를 발급함.                                                                       |    상    |  ✅  | [AdminAccountsPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/AdminAccountsPage.tsx) |
| `FR-AUTH-005` | 최초 관리자 시드      | • 최초 관리자 계정은 Supabase 콘솔 및 초기 마이그레이션 시드로 1회 생성함.                                                                         |    상    |  ✅  | `supabase/migrations/`                                                                                              |
| `FR-AUTH-006` | RLS 접근 제어         | • 비인가 사용자 및 타 지점 스태프의 쓰기·수정·삭제 API 요청을 PostgreSQL RLS 레벨에서 거부함.                                                      |    상    |  ✅  | `supabase/migrations/`                                                                                              |
| `FR-AUTH-007` | 숨은 직원 진입        | • 고객 화면 내 직원 로그인 버튼 미노출.<br/>• 상단 로고 2초 롱탭(모바일) 또는 길게 클릭(PC) 시 `/staff`로 이동함.                                  |    상    |  ✅  | [AppShell.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/layout/AppShell.tsx)                  |
| `FR-AUTH-008` | 지점 범위 운영 권한   | • 일반 직원(`staff`)은 소속 지점(`store_id`) 데이터만 조회·수정함.<br/>• 관리자(`admin`)는 상단 지점 선택기로 전 지점을 전환하며 관리함.           |    상    |  ✅  | [StaffStoreContext.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/StaffStoreContext.tsx) |

### 2.2 도서 검색 및 카탈로그 (`BOOK`)

| ID            | 요구사항명                 | 상세 명세                                                                                                           | 우선순위 | 상태 | 관련 구현체                                                                                                                 |
| :------------ | :------------------------- | :------------------------------------------------------------------------------------------------------------------ | :------: | :--: | :-------------------------------------------------------------------------------------------------------------------------- |
| `FR-BOOK-001` | 공백 무시 정규화 검색      | • 검색어와 도서명·작가명의 공백 및 특수문자를 제거하여 비교함 (`체인소 맨` = `체인소맨`).                           |    상    |  ✅  | [bookSearch.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/bookSearch.ts)                                    |
| `FR-BOOK-002` | 한글 초성 검색             | • 한글 자음 검색어(예: `ㅊㅇㅅㅁ`) 입력 시 `WeakMap`에 사전 인덱싱된 초성 문자열과 매칭함.                          |    상    |  ✅  | [bookSearch.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/bookSearch.ts)                                    |
| `FR-BOOK-003` | 무효 쿼리 거부             | • 공백·특수문자만으로 구성된 유효하지 않은 검색어 입력 시 0건 결과를 반환함.                                        |    상    |  ✅  | [bookSearch.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/bookSearch.ts)                                    |
| `FR-BOOK-004` | 텍스트 전용 도서 카드      | • 표지 이미지 없이 도서명, 작가명, 11대 장르 배지, 보유 권수(`volume_range`), 서가 위치(`shelf_location`)를 표시함. |    상    |  ✅  | [BookSearchPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-search/BookSearchPage.tsx)         |
| `FR-BOOK-005` | 30일 신간 자동 분류        | • 재고 최초 등록일(`first_registered_at`) 기준 30일 이내 도서에 `[NEW]` 배지를 부여하고 신간 필터에 노출함.         |    상    |  ✅  | [catalogueRepository.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-search/catalogueRepository.ts) |
| `FR-BOOK-006` | 0건 결과 및 입고 신청 연계 | • 검색 결과 0건 시 오타 안내와 함께 비회원 도서 입고 신청 모달 호출 버튼을 즉시 노출함.                             |    상    |  ✅  | [BookSearchPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-search/BookSearchPage.tsx)         |

### 2.3 도서 재고 관리 및 CSV 동기화 (`INV`)

| ID           | 요구사항명                | 상세 명세                                                                                                                                                                                          | 우선순위 | 상태 | 관련 구현체                                                                                                                                                                                      |
| :----------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | :--: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FR-INV-001` | 도서 재고 단건 등록·수정  | • 도서명, 작가, 11대 표준 장르, 보유 권수, 서가 위치, 비고 메모의 등록 및 수정을 지원함.                                                                                                           |    상    |  ✅  | [InventoryPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/InventoryPage.tsx)                                                                                      |
| `FR-INV-002` | 지점별 CSV 배치 가져오기  | • 3개 지점(`snu`, `jamsil`, `hongdae`) CSV 포맷 및 인코딩(UTF-8/EUC-KR)을 자동 감지함.<br/>• 10건 단위 제한 동시성(`CONCURRENCY_LIMIT = 10`)으로 Upsert를 수행하며 기존 재고의 임의 삭제를 방지함. |    상    |  ✅  | [inventoryCsv.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/inventoryCsv.ts), [inventoryImport.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/inventoryImport.ts) |
| `FR-INV-003` | 소속 지점 재고 영구 삭제  | • 재고 삭제 시 소속 지점의 `book_inventory` 레코드만 영구 삭제하며 공통 도서 마스터(`books`) 및 타 지점 재고는 보존함.                                                                             |    상    |  ✅  | [InventoryPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/InventoryPage.tsx)                                                                                      |
| `FR-INV-004` | 타 지점 CSV 오업로드 방지 | • 업로드 파일명 내 지점 식별자가 현재 선택된 지점과 불일치할 경우 업로드를 차단함.                                                                                                                 |    상    |  ✅  | [InventoryPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/InventoryPage.tsx)                                                                                      |

### 2.4 매장 안내 방송 (`BCAST`)

| ID             | 요구사항명                   | 상세 명세                                                                                                                                                                                                                           | 우선순위 | 상태 | 관련 구현체                                                                                                 |
| :------------- | :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | :--: | :---------------------------------------------------------------------------------------------------------- |
| `FR-BCAST-001` | 기본 정적 음원 프리셋        | • 음료 픽업, 기본 정돈, 만석 안내, 소음 주의, 신분증 검사, 마감 안내 등 기본 MP3 프리셋 즉시 재생 및 숨김/복구 지원.                                                                                                                |    상    |  ✅  | [BroadcastPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/BroadcastPage.tsx) |
| `FR-BCAST-002` | 커스텀 음원 업로드 프리셋    | • 지점별 3MB 이하 오디오 파일을 Supabase Storage(`broadcast-audio`)에 업로드하여 프리셋으로 등록·삭제함.                                                                                                                            |    상    |  ✅  | [voiceAssets.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/voiceAssets.ts)                  |
| `FR-BCAST-003` | 예약 방송 스케줄 관리        | • 매일(`daily`), 요일별(`weekly`), 1회성(`once`) 반복 예약의 생성·편집·활성화 토글·삭제 지원.                                                                                                                                       |    상    |  ✅  | [BroadcastPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/BroadcastPage.tsx) |
| `FR-BCAST-004` | 실행 이력 7일 롤링 보존      | • 수동·예약 방송 실행 결과(`succeeded`, `failed`, `missed`)를 기록하고 7일 경과 레코드를 자동 정리함 ([ADR-0010](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/adr/0010-unauthenticated-broadcast-and-7day-retention.md)). |    상    |  ✅  | [broadcastRunner.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/broadcastRunner.ts)          |
| `FR-BCAST-005` | 순차 재생 및 즉시 중지       | • 수동·예약 방송 간 겹침 없이 순차 송출하며 재생 중 즉시 정지 버튼을 제공함.                                                                                                                                                        |    상    |  ✅  | [broadcastRunner.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/broadcastRunner.ts)          |
| `FR-BCAST-006` | Lease 기반 다중 탭 중복 방지 | • 카운터 PC 탭 간 30초 단위 Lease 락을 갱신하여 단일 탭에서만 방송을 송출함.                                                                                                                                                        |    상    |  ✅  | [broadcastRunner.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/broadcastRunner.ts)          |
| `FR-BCAST-007` | 비로그인 Web Worker 스케줄러 | • 카운터 PC 비로그인 상태에서도 인라인 Blob Web Worker(10초 무감속 틱)로 예약 방송을 정시 송출함 ([ADR-0010](file:///Users/jaehee/Desktop/projects/cartoonplus/docs/adr/0010-unauthenticated-broadcast-and-7day-retention.md)).     |    상    |  ✅  | [broadcastRunner.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/broadcastRunner.ts)          |

### 2.5 도서 입고 신청 (`REQ`)

| ID           | 요구사항명               | 상세 명세                                                                                                                                         | 우선순위 | 상태 | 관련 구현체                                                                                                              |
| :----------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :------: | :--: | :----------------------------------------------------------------------------------------------------------------------- |
| `FR-REQ-001` | 비회원 도서 입고 신청    | • 개인정보 미수집 원칙 하에 도서명(필수), 작가명, 희망 권수(`desired_volume`), 고객 코멘트(`customer_comment`)를 접수함.                          |    상    |  ✅  | [BookRequestModal.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-request/BookRequestModal.tsx) |
| `FR-REQ-002` | 4단계 상태 라이프사이클  | • `접수(received)` ➔ `주문 완료(ordered)` ➔ `입고 완료(completed)` / `입고 불가(unavailable)` 상태 전환 및 직원 메모(`staff_note`) 저장을 지원함. |    상    |  ✅  | [BookRequestsPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/BookRequestsPage.tsx)        |
| `FR-REQ-003` | 입고 완료 재고 등록 연계 | • `입고 완료` 처리 시 신청 도서 정보를 재고 등록 폼으로 전달하여 신규 재고 생성을 연계함.                                                         |    상    |  ✅  | [BookRequestsPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/BookRequestsPage.tsx)        |

### 2.6 브랜드 랜딩 및 매장 콘텐츠 (`STORE`)

| ID             | 요구사항명                  | 상세 명세                                                                                                                                                                  | 우선순위 | 상태 | 관련 구현체                                                                                                                                                                                                                                      |
| :------------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | :--: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FR-STORE-001` | 브랜드 랜딩 및 지점 홈 분리 | • 루트(`/`)는 공식 브랜드 랜딩(만화카페·중고만화책 쇼핑몰 `bookis.store`·3J 자동화·가맹 상담)을 노출하고, `/books` 및 `/stores/:storeSlug`는 지점별 도서 검색 홈을 노출함. |    상    |  ✅  | [BrandLandingPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/brand/BrandLandingPage.tsx)                                                                                                                                |
| `FR-STORE-002` | 검증 게임 카탈로그 노출     | • 현장 실물 검수가 완료된 지점의 게임 목록만 고객에게 노출하며, 미검증 지점은 '점검 중' 안내 화면을 표시함.                                                                |    상    |  ✅  | [PublicInfoPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/PublicInfoPage.tsx)                                                                                                                                 |
| `FR-STORE-003` | 매장 이벤트 및 자동 만료    | • 지점별 또는 전 지점(`all`) 공개 이벤트를 노출하고 종료일(`end_date`) 익일 고객 화면에서 자동 숨김 처리함.                                                                |    상    |  ✅  | [PublicInfoPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/PublicInfoPage.tsx)                                                                                                                                 |
| `FR-STORE-004` | 식음료 메뉴 및 요금제 안내  | • 요금제 패키지, 8대 분류 음료(HOT/ICE 가격 및 패키지 차액), 푸드 메뉴를 탭·필터 구조로 제공함.                                                                            |    상    |  ✅  | [MenuPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/MenuPage.tsx)                                                                                                                                             |
| `FR-STORE-005` | 매장 소개 및 이용 안내      | • 지점별 공간 소개(`/about`)와 도로명 주소, 영업시간, 전화번호, 주차 및 이용 수칙(`/store`)을 제공함.                                                                      |    상    |  ✅  | [StoreIntroductionPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/StoreIntroductionPage.tsx), [PublicInfoPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/customer/PublicInfoPage.tsx) |
| `FR-STORE-006` | 지점별 URL 컨텍스트 전환    | • `/stores/:storeSlug/*` URL 기반으로 지점 컨텍스트와 PWA 매니페스트를 동적 전환함.                                                                                        |    상    |  ✅  | [useDynamicManifest.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/useDynamicManifest.ts)                                                                                                                                         |

### 2.7 공통 UI 및 라우팅 (`UI`)

| ID          | 요구사항명                  | 상세 명세                                                                                                                      | 우선순위 | 상태 | 관련 구현체                                                                                        |
| :---------- | :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------- | :------: | :--: | :------------------------------------------------------------------------------------------------- |
| `FR-UI-001` | 반응형 공통 앱 셸           | • 모바일·태블릿·데스크톱 전 해상도에서 가로 스크롤 없는 레이아웃과 하단 고정 탭 바를 제공함.                                   |    상    |  ✅  | [AppShell.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/layout/AppShell.tsx) |
| `FR-UI-002` | 단일 레이아웃 직원 콘솔     | • `/staff/:storeSlug` 하위 라우트를 단일 `<ProtectedStaffRoute />`(`<Outlet />`)로 감싸 탭 전환 시 레이아웃 재마운트를 방지함. |    상    |  ✅  | [App.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/App.tsx)                           |
| `FR-UI-003` | 레거시 경로 호환 리다이렉트 | • `/search`, `/entertainment`, `/event`, `/store` 등 구버전 URL 접근 시 현행 표준 경로로 자동 리다이렉트함.                    |    중    |  ✅  | [App.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/App.tsx)                           |

---

## 3. 비기능 요구사항 (Non-Functional Requirements)

| ID             | 카테고리        | 요구사항명                       | 상세 기준 및 검증 지표                                                                                          |
| :------------- | :-------------- | :------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `NFR-COST-001` | 비용 최적화     | 월 고정 서버 운영비 \$0          | Cloudflare Pages + Supabase Free Tier 한도 내 운영으로 도메인 실비 제외 월 고정비 0원 유지.                     |
| `NFR-PERF-001` | 검색 성능       | 단일 프레임 도서 필터링          | 지점당 1.5만 권 데이터 기준 `WeakMap` 인덱싱 및 장르 `Set` 1차 필터링으로 입력 후 16ms 이내 결과 산출.          |
| `NFR-PERF-002` | 번들 최적화     | 엔트리 번들 경량화               | Rollup `manualChunks` 및 `React.lazy` 코드 스플리팅을 통해 초기 엔트리 JS 청크를 35 kB(gzip 12 kB) 이하로 유지. |
| `NFR-SEO-001`  | 검색엔진 최적화 | 다지점 정적 HTML 사전 생성       | 빌드 시 23개 공개 라우트(`/` + 기본 고객 경로 + 3개 지점 서브 경로)의 개별 HTML·OG·JSON-LD를 정적 생성함.       |
| `NFR-DES-001`  | 웹 접근성       | 모션 축소 및 포커스 지원         | `prefers-reduced-motion` 미디어 쿼리 지원 및 키보드 포커스 스타일, `aria-live` 알림 제공.                       |
| `NFR-SEC-001`  | 보안·개인정보   | 개인정보 미수집 및 RLS 강제      | 고객 입고 신청 시 개인정보 수집 배제, 모든 테이블 RLS 활성화 및 `SECURITY DEFINER` RPC 권한 검증 적용.          |
| `NFR-REL-001`  | 운영 연속성     | 오프라인 폴백 및 백그라운드 방송 | Supabase 장애 시 정적 JSON 카탈로그 폴백 제공, 백그라운드 탭 Throttling 영향 없는 Web Worker 방송 타이머 유지.  |
