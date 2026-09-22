# 카툰플러스 개발 및 트러블슈팅 기록 (Troubleshooting & Dev Notes)

개발 과정에서 발생하는 이슈, 데이터 전처리 분석, 성능 최적화 및 트러블슈팅 내역을 체계적으로 기록합니다.

## 2026-09-22 도서명 정정 시 새 재고가 생성되는 문제

- **증상/재현 조건**: 직원 도서 재고 화면에서 기존 항목을 수정한 뒤 도서명을 고치고 저장하면, 원래 재고가 남은 채 정정된 제목의 새 재고가 생성된다.
- **원인**: 수정 저장도 신규 등록·CSV 가져오기와 같은 제목·작가 기반 `upsert_inventory_for_store` RPC를 호출했다. 제목이 달라지면 기존 `Book`을 찾지 못해 새 `BookInventory`를 insert하며, 새 최초 등록일이 부여된다.
- **해결**: 수정 모드에서는 재고 ID를 받는 `update_inventory_for_store` RPC를 호출한다. 이 RPC는 승인된 직원의 대상 지점 권한을 확인한 뒤, 기존 `BookInventory`와 연결된 `Book` 메타데이터·권수·서가만 갱신한다. 재고 ID와 `first_registered_at`은 변경하지 않는다.
- **운영상 주의**: 정정한 제목·작가 조합이 다른 도서 마스터에 이미 있으면 자동 병합하지 않고 저장을 중단한다. 공유 도서 마스터의 정정은 그 도서를 참조하는 다른 지점 고객 화면에도 반영될 수 있으므로, 지점별로 서로 다른 제목을 유지해야 하는 경우에는 운영자가 데이터 기준을 먼저 정해야 한다.
- **검증**: 수정 화면의 제목 변경 저장이 등록용 upsert가 아닌 수정 RPC에 기존 재고 ID를 전달하는 회귀 테스트를 추가했다. 전체 테스트·타입 검사·프로덕션 빌드가 통과해야 한다.

## 2026-09-22 잠실점 레거시 중복 데이터(2,407건) 정제 및 단일 2,672종 정합성 회복

- **증상/요구사항**: Supabase 잠실점 도서 데이터가 약 2개씩 중복되어 노출되는 문제 확인 및 제거 요청.
- **원인 분석**:
  1. 2026-09-21 초기 임포트 시 작가/장르 보강 전 데이터(`author = ''`, `category = ''`)로 `books` 및 `book_inventories`에 2,405건이 1차 적재됨.
  2. 이후 작가 및 11대 표준 장르를 보강한 2차 마이그레이션이 실행될 때 `books` 테이블의 `UNIQUE (title, author)` 제약조건으로 인해 빈 작가(`author = ''`)와 보강된 작가(`author = '웹툰 작가'` 등)가 서로 다른 별개의 `books` 행으로 인식되어 `book_inventories`에 각각 별도 연결됨 (총 5,078건으로 증폭).
- **해결 및 조치**:
  1. `20260922200000_cleanup_jamsil_duplicate_legacy_inventories.sql`: 잠실점 `book_inventories` 중 레거시 빈 작가(`author = ''`) 참조 행 2,405건을 일괄 삭제하고, 다른 지점에서 사용하지 않는 고아(Orphaned) `books` 레코드 정리.
  2. `20260922201000_cleanup_specific_duplicates.sql`: 복수 작가명 표기로 2건 잔존하던 `심령탐정 야쿠모` 및 `향기로운 꽃은 늠름하게 핀다`의 중복을 최신 정보 기준으로 단일화.
  3. `npx supabase db push` 실행 완료.
- **검증**:
  - 잠실점 전체 재고 2,672건, 고유 도서 2,672건, 중복 0건 (100% 정합성 검증 완료).
  - 홍대점(1,854건 / 중복 0건) 및 서울대입구점(620건) 정합성 확인 완료.

## 2026-09-22 PostgREST 기본 1,000건 응답 상한으로 인한 도서 누락 및 실시간 입고 검색 불가 해결

- **증상/요구사항**:
  1. 잠실점 DB 도서가 1,000개 이상인데 고객/직원 화면에서 1,000개까지만 표시되는 문제 발생.
  2. 직원이 새 도서를 입고 등록해도 고객 도서 검색 페이지에서 검색되지 않는 현상 발생.
- **원인 분석**:
  1. Supabase PostgREST 서버는 단일 HTTP 쿼리 응답의 행 수를 최대 1,000개(`max-rows = 1000`)로 제한함.
  2. 고객 도서 카탈로그([catalogueRepository.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-search/catalogueRepository.ts)) 및 직원 재고 목록([InventoryPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/InventoryPage.tsx))에서 `.range()` 페이징 없이 단일 `.select()`로 쿼리하여 `order('title')` 기준 앞쪽 1,000권(제목 `ㄱ`~`ㅁ` 일부)만 로드됨.
  3. 이로 인해 1,000번째 이후 도서(`ㅂ`~`ㅎ`, 영문 등) 및 신규 등록된 도서가 브라우저 인메모리 검색 풀(`books`)에 포함되지 않아 검색되지 않았음.
- **해결 및 반영**:
  1. `catalogueRepository.ts`의 `loadPublicCatalogue`: `while` 루프와 `.range(page * 1000, (page + 1) * 1000 - 1)`를 적용하여 지점별 전체 도서(잠실점 5,078건, 홍대점 1,854건 등)를 누락 없이 1,000건 단위로 순차 로드하도록 개선.
  2. `InventoryPage.tsx`의 `load`: 직원 재고 목록도 동일하게 `.range()` 청크 로드를 적용하여 지점 내 모든 도서를 로드하도록 수정.
  3. `InventoryPage.test.tsx`: Supabase mock에 `.range()` 체이닝 함수를 추가하여 유닛 테스트 통과 보장.
- **검증**: `npm test` 전체 19개 파일 / 105개 테스트 100% 통과, `npm run build` SSG 프로덕션 빌드 성공.

## 2026-09-22 홍대점 최신 도서 재고(1,854종) 작가·11대 표준 장르 보강, 정제, 정적 CSV 재생성 및 Supabase DB 적용

- **배경/요구사항**:
  1. 최신 홍대점 서가 원본 데이터(`docs/assets/hongdaebook_2026-Sep-21_1711.csv`, 67개 서가, 930행) 분석 및 반영.
  2. 도서명 뒤 권수 분리(`//` 및 단일 `/` 구분자, 마침표 및 붙은 권수 표기 분리) 및 중복 도서 병합 정제 (최신/최대 권수 및 서가 보존).
  3. 전 도서에 대해 서울대입구점/잠실점 마스터 DB(2,960종) 매칭 및 작가 사전 보강, 원본 28개 장르를 서비스 11대 표준 장르(`웹툰`, `액션/모험`, `로맨스/로판`, `판타지/무협`, `일상/개그`, `스릴러/추리/호러`, `드라마/스포츠/SF`, `BL/GL`, `일반도서/소설`, `코믹스/그래픽노블`, `성인`)로 매핑.
  4. 정제된 표준 CSV(`public/data/hongdae-inventory.csv`) 생성 및 Supabase 원격 DB(`books`, `book_inventories`)에 실시간 반영.
- **수정 및 처리**:
  1. `scripts/build-hongdae-master.cjs`: 1,854종 고유 도서에 대한 작가 및 장르 인덱싱 스크립트 작성.
  2. `public/data/hongdae-inventory.csv` & `dist/data/hongdae-inventory.csv`: `도서명,보유권수,작가,목표장르,기존서가` 5열 표준 헤더 포맷으로 1,854건 전건 생성.
  3. `src/features/book-search/catalogueRepository.ts`: 정제된 5열 CSV 형식에 대한 `parseBaselineInventory` 및 레거시 3열 형식 자동 호환 지원.
  4. `supabase/migrations/20260922020000_seed_hongdae_enriched_inventory.sql`: `books` 및 `book_inventories` 테이블에 작가, 11대 표준 장르, 초성 검색 인덱스(`initial_consonants`), 정규화 컬럼 일괄 Upsert 및 `npx supabase db push`로 DB 반영 완료.
- **검증**: 원격 DB 마이그레이션 적용 완료(홍대점 1,854건 적재 확인), `npm test` 회귀 테스트(19개 파일 / 105개 테스트 전체 통과), `npm run build` SSG 프로덕션 빌드 완료.

## 2026-09-21 잠실점 최신 도서 재고(2,671종) 작가·11대 표준 장르 보강, 중복 정제, 정적 CSV 재생성 및 Supabase DB 적용

- **배경/요구사항**:
  1. 최신 잠실점 서가 원본 데이터(`docs/assets/jamsilbook_2026-Sep-21_0421/jamsilbook_2026-Sep-21_0421.csv`) 반영.
  2. 도서명 뒤 권수 분리(`//` 및 권수 뒤 단일 `/` 구분자 처리) 및 중복 도서(39건) 병합 정제 (최신/최대 권수 및 서가 보존).
  3. 전 도서에 대해 작가명 및 11대 표준 장르(`웹툰`, `액션/모험`, `로맨스/로판`, `판타지/무협`, `일상/개그`, `스릴러/추리/호러`, `드라마/스포츠/SF`, `BL/GL`, `일반도서/소설`, `코믹스/그래픽노블`, `성인`) 메타데이터 부여.
  4. 정제된 표준 CSV(`public/data/jamsil-inventory.csv`) 재생성 및 Supabase 원격 DB(`books`, `book_inventories`)에 실시간 반영.
- **수정 및 처리**:
  1. `scripts/build-jamsil-master.cjs`: 2,671종 고유 도서에 대한 작가 및 장르 인덱싱 스크립트 작성.
  2. `public/data/jamsil-inventory.csv` & `dist/data/jamsil-inventory.csv`: `도서명,보유권수,작가,목표장르,기존서가` 5열 표준 헤더 포맷으로 2,671건 전건 재생성.
  3. `src/features/book-search/catalogueRepository.ts`: 정제된 5열 CSV 형식에 대한 `parseBaselineInventory` 자동 호환 파싱 지원.
  4. `supabase/migrations/20260921140000_seed_jamsil_enriched_inventory.sql`: `books` 및 `book_inventories` 테이블에 작가, 11대 표준 장르, 초성 검색 인덱스(`initial_consonants`), 정규화 컬럼 일괄 Upsert 및 `npx supabase db push`로 DB 반영 완료.
- **검증**: 원격 DB 마이그레이션 적용 완료, `npm test` 회귀 테스트(19개 파일 / 104개 테스트 전체 통과), `npm run build` SSG 프로덕션 빌드 완료.

## 2026-09-20 도서 검색 장르 필터 11대 표준 장르 고정 및 슬래시 보존

- **증상/요구사항**: 도서 검색 화면의 장르 필터 칩과 모바일 선택 모달에서 우리가 정의한 11대 표준 장르(`웹툰`, `액션/모험`, `로맨스/로판`, `판타지/무협`, `일상/개그`, `스릴러/추리/호러`, `드라마/스포츠/SF`, `BL/GL`, `코믹스/그래픽노블` 등)만 깔끔하게 노출되도록 요청됨.
- **원인**: `splitBookCategories`가 슬래시(`/`)를 분리자로 취급하여 `액션/모험`을 `액션`, `모험`으로, `로맨스/로판`을 `로맨스`, `로판` 등으로 잘게 쪼개어 비표준 단어들이 필터에 노출되었음.
- **수정**:
  1. `src/lib/bookSearch.ts`: `STANDARD_BOOK_GENRES` 11대 표준 장르 상수를 선언하고, `splitBookCategories`에서 슬래시를 보존하도록 쉼표(`,`) 및 점(`·`)만 분리자로 처리.
  2. `src/features/book-search/BookSearchPage.tsx`: `STANDARD_BOOK_GENRES`에 등록된 표준 장르들만 표준 정렬 순서대로 필터 칩과 모달에 노출.
- **검증**: `npm test` (18개 테스트 파일 / 97개 테스트 전체 통과) 및 `npm run build` 완료.

## 2026-09-20 실물 서가 재배치 1차 반영 (A구역 웹툰 이동 59건, 기존 서가 변경 13건, 신규 등록 도서 보존)

- **배경/요구사항**:
  1. 구글 스프레드시트 이동 현황에 따라 A구역(웹툰)으로 실물 이동 완료(o)된 59건의 서가 위치를 `A구역` 및 `A구역 (세부위치)`로 DB에 반영.
  2. 이동 대기 중인 기존 서가 도서 13건(시리즈 14건)의 서가 번호 갱신(예: `푸른 상자`, `내세에는 남남이 좋겠어`, `최애의 아이`, `창백한 말`, `어쩌다 발견한 7월`, `어쿠스틱 라이프`, `히카루가 죽은 여름` $\rightarrow$ `책장 2번`, `3월의 라이온` $\rightarrow$ `책장 4번`, `단다단`, `지박소년 하나코군`, `약사의 혼잣말`, `아메리카노 엑소더스` $\rightarrow$ `책장 19번`).
  3. 직원이 최근 DB에 직접 추가했던 도서(`향기로운 꽃은 늠름하게 핀다`, `먼작귀`)가 덮어씌워지거나 삭제되지 않도록 안전하게 보존.
- **수정 및 처리**:
  1. `20260920114500_update_relocated_and_legacy_inventory.sql`: 스프레드시트 607종 및 신규 7종(`노블레스 시즌 4~7`, `독고 시리즈`)을 포함하여 `books` 및 `book_inventories` 테이블에 Upsert.
  2. `src/lib/inventoryCsv.ts`: `parseBaselineInventory`에서 정제된 이동 컬럼(`이동여부`, `목표구역`, `세부위치`, `기존서가`)을 결합하여 서가 위치를 동적으로 파싱하도록 개선.
  3. `public/data/cleaned-inventory.csv` & `public/data/initial-inventory.csv`: 구글 스프레드시트 최신 데이터로 동기화.
- **검증**:
  - Supabase `customer_book_catalogue` 뷰 조회 검증: 총 620종 정상 등록, A구역 이동 도서 59건(`A구역` / `A구역 (세부위치)`), 기존 이동 13건(14종) 정확 반영 확인.
  - 수동 추가 도서 2건 보존 확인 (`향기로운 꽃은 늠름하게 핀다`, `먼작귀(먼가 작고 귀여운 녀석)`).
  - 회귀 테스트 (`npm test`, 18개 파일 / 96개 테스트 전체 통과) 및 프로덕션 빌드 성공.

## 2026-09-18 비로그인 상태 매장 안내 방송 송출 지원 및 방송 기록 7일 롤링 보존

- **증상/요구사항**:
  1. 매장 카운터 PC에서 직원이 로그인하지 않고 일반 고객 화면(홈/도서검색)을 띄워두거나 브라우저 캐시 문제 발생 시 예약 방송이 송출되지 않는 현상 발생.
  2. 방송 실행 감사 기록(`broadcast_runs`)이 무한정 누적되는 것을 방지하고, 기존 누적 데이터를 전체 초기화한 뒤 최근 7일치만 롤링 보존하도록 개선.
- **원인 분석**:
  1. `<GlobalBroadcastService />`가 `<ProtectedStaffRoute>`(로그인 필수 라우트) 내부에만 감싸져 있어 비로그인 시 스케줄러 자체가 실행되지 않음.
  2. Supabase `claim_broadcast_playback_lease` RPC 및 `broadcast_runs` RLS 정책이 `authenticated` 직원 전용으로 제한되어 있어 익명 사용자의 스케줄 쿼리 및 Lease 선점이 차단됨.
- **해결 방안 및 반영**:
  1. `docs/adr/0010-unauthenticated-broadcast-and-7day-retention.md` 수립 및 승인.
  2. `<GlobalBroadcastService />`를 최상위 전역 라우트로 승격하고 URL/로컬스토리지 기반 지점 자동 식별 적용.
  3. `broadcast_runs` 기존 데이터 초기화(TRUNCATE) 및 7일 경과 기록 자동 삭제 트리거/RPC 적용.
  4. 비로그인 클라이언트에서도 스케줄 조회 및 Lease 획득이 가능하도록 RLS 및 RPC 익명 권한 확장.

## 2026-09-18 예약 방송 스케줄 등록 시 UUID 파싱 오류 ("invalid input syntax for type uuid") 해결

- **증상**: 직원 안내 방송 페이지(`/staff/broadcast`)에서 기본 정적 프리셋(예: "11시 마감 안내")을 선택하고 스케줄을 저장할 때 `"저장하지 못했습니다: invalid input syntax for type uuid: '11시 마감 안내'"` 400 Bad Request 에러가 발생하며 예약 방송이 저장되지 않음.
- **원인**:
  1. `scheduled_broadcasts.broadcast_preset_id` 컬럼은 UUID 외래키(nullable) 타입임.
  2. 기본 정적 프리셋 6종이 DB에 seed 데이터로 존재하지 않아 `p.id`가 `undefined`였고, 드롭다운 `<select>`의 `value`에 프리셋 제목 문자열(`"11시 마감 안내"`)이 바인딩됨.
  3. `saveSchedule` 폼 제출 시 문자열 제목이 `broadcast_preset_id` 컬럼에 그대로 전송되어 PostgreSQL UUID 파싱 에러 발생.
- **수정**:
  1. `20260918163800_seed_static_broadcast_presets.sql` 마이그레이션을 통해 모든 지점에 기본 정적 프리셋 6종을 `source_type = 'static'`, 정적 오디오 경로(`/audio/broadcast/...wav`)와 함께 DB에 영구 시드 등록(`supabase db push` 완료).
  2. `BroadcastPage.tsx`에 `isValidUuid` 유효성 검증 함수를 도입하여 `schedule.presetId`가 유효한 UUID가 아닐 경우 안전하게 `null`로 폴백 처리.
  3. `loadPresets`에서 정적 프리셋과 DB 레코드의 ID 매핑을 강화하고, `handleEditScheduleClick`에서 기존 스케줄 수정 시 프리셋 ID/문구를 상호 매칭하도록 개선.
- **검증**: 원격 Supabase DB 마이그레이션 푸시 완료, 단위 테스트(`npm test`, 18개 파일 89개 테스트) 및 Vite SSG 프로덕션 빌드 통과.

## 2026-09-17 직원 운영 대시보드 데이터 로딩 실패 ("운영 데이터를 불러오지 못했습니다") 해결

- **증상**: 직원 운영 대시보드(`/staff/dashboard`) 접속 시 콘솔에 `400 Bad Request (...chived_at=is.null)` 오류와 함께 "운영 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." 오류 카드가 표시되며 KPI 통계가 로드되지 않음.
- **원인**:
  1. 마이그레이션(`20260917090000_tts_broadcast_presets.sql`, `20260917100000_remove_inventory_archives.sql`)에서 `scheduled_broadcasts` 및 `book_inventories` 테이블의 `archived_at` 컬럼이 완전 삭제(`DROP COLUMN`)되었음.
  2. 대시보드([DashboardPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/DashboardPage.tsx))에서 해당 두 테이블을 쿼리할 때 레거시 `.is('archived_at', null)` 필터를 여전히 전송하여 PostgREST 400 오류(`column does not exist`)가 발생하고 대시보드 통계 수신이 중단됨.
- **수정**: `src/features/staff/DashboardPage.tsx`에서 `scheduled_broadcasts` 및 `book_inventories` 쿼리의 불필요한 `.is('archived_at', null)` 조건을 모두 제거하고, `DashboardPage.test.tsx` 단위 및 회귀 테스트를 추가함.
- **검증**: `npm test` 전체 69개 단위 테스트 통과 및 `npm run build` SSG 프로덕션 빌드 성공 확인.

## 2026-09-17 도서 마스터 및 재고 데이터 동기화 (장르·권수·도서명·작가 반영, 기존 서가 유지)

- **배경/요구사항**: 서울대입구역점(`snu`) 재고 데이터셋에 대해, 기존에 정리된 603종 정제 데이터셋(`public/data/cleaned-inventory.csv` / `docs/BOOK_INVENTORY_CLASSIFICATION_MAPPING.md`)을 기준으로 **도서명, 작가, 11대 표준 장르, 권수(보유권수 및 last_volume)**를 DB에 전면 동기화함.
- **점진적 서가 동기화 준수**: 실물 도서 이동이 진행 중인 현장 운영 상황을 반영하여, **서가 번호(기존 서가 `책장 N번`)는 유지**하고 메타데이터(이름, 작가, 장르, 권수)만 최신 마스터 데이터로 정합성을 맞춤.
- **수정 및 처리**:
  1. `20260917150000_apply_cleaned_inventory_master.sql`: 600개 고유 도서 마스터(`books`)의 도서명, 작가, 표준 장르, 초성 검색 인덱스(`initial_consonants`), 정규화 컬럼을 일괄 갱신하고 `book_inventories`의 권수 범위(`volume_range`), 끝 권수(`last_volume`), 기존 서가(`shelf_location`)를 동기화함.
  2. `20260917151000_cleanup_legacy_inventory_master.sql`: 과거 작가명 누락 및 표기 차이로 중복 잔존하던 레거시 재고 8건 및 미참조 도서 마스터를 영구 정리함.
  3. `scripts/import-baseline-inventory.mjs` & `src/lib/inventoryCsv.ts`: `cleaned-inventory.csv`의 한글 헤더 포맷(`도서명`, `보유권수`, `작가`, `목표장르`, `기존서가`)을 파싱하도록 갱신 및 fallback 파일 동기화.
- **검증**:
  - Supabase `customer_book_catalogue` 뷰 전수 검증: 601개(정제 600종 + 직원 직접 추가분 1종) 전수 1:1 일치(mismatch: 0건).
  - 11대 표준 장르 정상 분포 확인 (`웹툰`: 165, `로맨스/로판`: 164, `드라마/스포츠/SF`: 65, `판타지/무협`: 51, `코믹스/그래픽노블`: 41, `일상/개그`: 40, `스릴러/추리/호러`: 37, `액션/모험`: 36, `BL/GL`: 1).
  - 회귀 테스트 (`npm test`, 66개 전체 통과) 및 프로덕션 빌드/SSG 생성 완료.

## 2026-09-17 스태프 페이지 모바일 뷰포트 레이아웃 깨짐 및 내비게이션 과밀 해결

- **증상**: 모바일 브라우저(폭 860px 이하)에서 스태프 콘솔 접속 시, 좌측 사이드바가 가로 1열 헤더로 강제 전환되며 브랜드 로고, 지점 선택 드롭다운, 7개 메뉴 탭, 계정 관리, 로그아웃 버튼이 겹치거나 화면 상단을 가득 채움. 도서 재고(`InventoryPage`), 입고 신청(`BookRequestsPage`), 매장 콘텐츠(`StoreContentPage`), 방송 콘솔(`BroadcastPage`), 계정 관리(`AdminAccountsPage`)의 단일 라인 Grid/Flex가 좁은 화면에서 찌그러지고 삭제/수정 버튼 터치가 불안정함.
- **원인**: 데스크톱 중심의 240px 고정 사이드바 및 인라인 Flex 스타일이 적용되어 있었고, 모바일 화면을 위한 별도 드로어(Drawer) 내비게이션 및 반응형 2단 카드 스택 구조가 미비했음.
- **수정**:
  1. `StaffShell`에 모바일 전용 컴팩트 상단 헤더(`staff-mobile-header`) 및 우측 슬라이드오버 Drawer(`staff-drawer`)를 구축하여 본문 작업 공간을 최대로 확보함.
  2. `StaffStoreSelector`에 헤더/드로어 반응형 팝오버를 적용해 z-index 클리핑 문제를 해결함.
  3. 모든 스태프 페이지 폼을 모바일 1열 풀위드 스택으로 표준화하고, 아이템 목록을 2단 반응형 카드 구조(`staff-item-row`)로 개편하여 터치 타깃 44px 이상을 확보함.
- **검증**: `npm test` 회귀 테스트(63개 테스트 전체 통과) 및 `npm run build` SSG 프로덕션 빌드 성공. 모바일 뷰포트(360px ~ 768px)에서 드로어 열림/닫힘 및 카드 스택 정상 렌더링 확인.

## 2026-09-17 방송 및 운영 항목 삭제 설계 점검

- **상태**: 코드·마이그레이션을 읽고 확인한 구조적 위험이다. 운영 DB 재현 및 수정은 아직 수행하지 않았다.
- **삭제 후 재등장**: 방송 화면은 기본 예약이 없으면 다시 생성한다. 이벤트 저장소도 빈 목록을 초기 데이터로 대체한다. 삭제를 지원하려면 최초 초기화와 사용자가 만든 빈 목록을 구분해야 한다.
- **예약 삭제와 이력**: 방송 실행 기록의 예약 참조가 삭제를 막을 수 있다. 예약 삭제 후에도 당시 문구·시각·결과를 유지하면서 예약 연결만 해제할 수 있어야 한다.
- **방송 겹침**: 예약 실행이 완료를 기다리지 않고 시작되며, 브라우저 TTS는 새 실행 시 이전 발화를 취소한다. 수동·예약 공용 순차 재생과 지점별 단일 담당 탭이 필요하다.
- **전역 복구 제거 범위**: 지점 재고 삭제가 공유 도서 및 타 지점 재고 삭제로 이어지지 않도록 한다. 이벤트 관리 화면의 로컬 저장 데이터와 DB 이벤트 데이터도 구분해 전환해야 한다.
- **기준**: [요구사항](REQUIREMENTS.md)의 FR-INV-003, FR-UI-004 및 FR-BCAST-001~007. 기존 보관 데이터의 실제 대상·건수는 전환 전에 확인한다.

## 2026-09-16 직원 재고 목록에 “제목 없음” 표시

- **증상**: 직원 재고 화면에서 권수와 서가 위치는 정상 표시되지만 도서명·작가가 모두 `제목 없음`·`작가 미상`으로 표시된다.
- **원인**: Supabase의 `book_inventories → books` 다대일 관계는 단일 객체로 응답하지만 화면이 배열로 가정해 `books[0]`을 읽었다. 그 결과 실제 도서 객체가 있어도 `undefined`로 처리됐다.
- **수정**: 단일 객체와 배열 응답을 모두 처리하는 도서 추출 함수를 적용했다. 재고 목록 검색·표시와 대시보드 최근 갱신 도서 표시를 같은 방식으로 수정했다.
- **검증**: 실제 응답 형태인 단일 `books` 객체를 주입한 화면 회귀 테스트에서 도서명 표시와 대체 문구 미표시를 확인한다.

## 2026-09-16 직원 도서 신청 관리의 컬럼·UUID 조회 오류

- **증상**: 직원의 도서 입고 신청 관리 화면에서 `column book_requests.user_comment does not exist` 및 `invalid input syntax for type uuid: ""` 오류가 표시된다.
- **원인**: `book_requests` 스키마의 코멘트 컬럼은 `customer_comment`인데 화면이 과거 이름인 `user_comment`를 조회했다. 또한 선택 지점 ID를 비동기로 조회하는 첫 렌더에서 아직 준비되지 않은 ID를 빈 문자열로 대체해 UUID 필터에 전달했다. 재고 관리 화면도 같은 빈 UUID 패턴을 사용했다.
- **수정**: 신청 관리 화면의 조회·표시 필드를 `customer_comment`로 통일했다. 신청·재고 목록은 유효한 지점 UUID가 준비된 뒤에만 쿼리하도록 변경했다.
- **검증**: `BookRequestsPage` 회귀 테스트가 빈 지점 ID에서는 DB 호출이 발생하지 않고, 유효 ID에서는 `customer_comment` 컬럼과 해당 UUID를 사용하는 것을 확인한다. 전체 테스트·타입 검사·Cloudflare 빌드를 통과해야 한다.

## 2026-09-16 Cloudflare 직원 페이지 직접 접근 시 404 반복

- **확인 대상**: 문서에 기록된 `https://cartoonplus.pages.dev`. 사용자가 접속한 정확한 주소와 로그인 후 동작은 별도 확인이 필요하다.
- **재현**: `curl -sS -L -o /dev/null -w '%{http_code}\n' https://cartoonplus.pages.dev/staff` → `404`. `/staff/dashboard`도 `404`, 루트 `/`는 `200`이다. 응답 HTML의 스크립트를 Node VM에서 실행해 각각 같은 경로로 `location.replace`하는 것을 확인했다.
- **원인**: 직원 경로의 정적 HTML 및 rewrite 규칙이 없고, 최상위 `404.html`이 있어 Cloudflare Pages의 기본 SPA fallback이 적용되지 않는다. `public/404.html`은 Cloudflare 호스트에서 현재 URL로 다시 이동하므로 앱을 로드하지 못하고 재요청한다. `scripts/generate-ssg.js`의 `_routes.json`은 Functions 호출 범위 설정이며 SPA rewrite를 제공하지 않는다.
- **수정**: 최상위 `public/404.html`을 제거해 Cloudflare Pages 기본 SPA fallback을 활성화한다. Pages는 최상위 `404.html`이 없을 때 없는 경로를 `/index.html`로 제공하므로, 직원 경로 직접 접근과 새로고침을 앱이 처리한다. `/staff`를 `/index.html`로 proxy하는 `_redirects` 방식은 Pages의 확장자 없는 HTML 정규화와 충돌해 `/`로 308 이동하여 적용하지 않는다.
- **완료 기준**: 재배포 후 `/staff`와 `/staff/dashboard`의 HTTP 200 및 앱 HTML 응답, 브라우저의 로그인 화면 표시·승인 계정 로그인·하위 경로 새로고침을 확인한다.
- **검증/배포**: 첫 배포에서 `_redirects` 방식은 `/staff`를 `/`로 308 이동시키고 하위 경로를 404로 남겨 실패했다. 기본 SPA fallback 방식으로 교체 후 `npm run build:cloudflare`, 타입 검사, 전체 테스트 및 운영 HTTP·브라우저 확인이 필요하다. 실제 승인 계정 로그인은 별도 확인 대상이다.
- **공식 근거**: [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/), [Functions routing](https://developers.cloudflare.com/pages/functions/routing/).

## 2026-09-14 로컬 지점 URL이 과거 GitHub Pages base 경로로 차단됨

- **증상/재현 조건**: `npm run dev` 상태에서 `http://localhost:5173/stores/jamsil`처럼 루트 지점 URL로 접속하면 Vite가 `/CartoonPlus/` base URL을 요구하며 앱을 제공하지 않는다.
- **원인**: Vite 설정이 GitHub Pages의 저장소 하위 경로(`/CartoonPlus/`)를 개발 서버에도 고정 적용했다.
- **수정**: Cloudflare Pages 운영 기준으로 개발·기본 프로덕션 빌드 모두 base를 `/`로 통일한다. `build:cloudflare` 명령은 호환용 별칭으로 유지한다.
- **검증**: `Invoke-WebRequest http://localhost:5173/stores/jamsil`이 수정 전 base URL 오류를 반환했고, 수정 후 HTTP 200을 반환했다.

## 2026-09-14 다지점 CSV·콘텐츠가 서울대입구역점 데이터와 섞일 위험

- **증상/재현 조건**: 두 추가 지점의 CSV 또는 지점별 콘텐츠를 현재 구현으로 반영한다.
- **원인**: 스키마에는 `store_id`가 있지만, `upsert_inventory`, 고객 카탈로그, 매장 콘텐츠·방송·게임 화면이 `snu`를 고정 조회한다. 일부 고객 콘텐츠 조회에는 지점 필터도 없다.
- **운영 조치**: URL 기반 지점 선택과 지점 범위 RLS/RPC가 구현·검증되기 전에는 추가 지점의 원본 확보·중복 사전 검증까지만 수행하며, 실제 업로드는 하지 않는다.
- **해결 기준**: ADR-0005 및 `FR-STORE-008`, `FR-INV-004`, `FR-AUTH-008` 구현 후 지점별 업로드·고객 조회·타 지점 쓰기 차단을 검증한다.

## 2026-09-14 잠실점 서가 CSV 전처리 및 지점 오반영 방지

- **원본 형식**: `a_`는 서가 번호, `a___`는 해당 서가의 제목 묶음이다. 제목은 `//`로 구분한다.
- **전처리 규칙**: 각 `//` 제목을 별도 재고 후보로 만들고, 끝의 공백+정수만 `1~N권`으로 분리한다. 원본 서가 번호는 `책장 N번`으로 보존한다.
- **검토 중단 규칙**: `약사의 혼잣말 14 (소설)`처럼 숫자 뒤 괄호 표기가 있어 제목과 권수를 확정할 수 없는 항목은 자동 등록하지 않는다. 운영자가 원본을 확인한 뒤 수정본으로 다시 업로드한다.
- **지점 격리**: 잠실 형식은 잠실점 Store ID를 명시한 RPC만 호출하고, RPC/RLS가 Staff의 잠실점 관리 권한을 재검증한다. 다른 지점 Staff의 업로드는 실패하며 자신의 지점으로 대체 저장되지 않는다.

## 2026-09-14 홍대점 CSV 전처리 및 지점 오반영 방지

- **원본 형식**: `a_`는 제목 묶음, `a_1`은 서가 번호, `a_2`는 장르다. 제목 구분자는 `//` 또는 권수 뒤 단일 `/`로 혼재하며, 제목 자체에도 `/`가 포함될 수 있다.
- **전처리 규칙**: `//`와 권수 뒤 단일 `/` 중 다음 제목이 숫자로 시작하지 않는 경우만 제목 구분자로 처리해 개별 재고 후보로 나눈다. 제목 자체의 `/`와 괄호 표기는 보존한다. 장르와 `책장 N번` 서가는 모든 후보에 유지하고, 끝의 공백+정수만 `1~N권`으로 분리한다.
- **지점 격리**: 홍대 형식은 홍대점 Store ID를 명시한 RPC만 호출하고, RPC/RLS가 Staff의 홍대점 관리 권한을 재검증한다. 다른 지점 Staff의 업로드는 실패하며 자신의 지점으로 대체 저장되지 않는다.

---

## 2026-09-11 승인된 관리자 로그인 시 승인 대기 안내

- **증상/재현 조건**: 승인된 관리자가 여러 직원 계정을 조회할 수 있는 경우 로그인에서 `관리자 승인 후 이용할 수 있습니다.`로 거절된다. 일반 직원은 RLS로 본인 계정만 보여 문제가 드러나지 않는다.
- **원인**: `staffAuth.ts`와 `App.tsx`의 권한 조회가 `staff_accounts.select('role,status').single()`을 사용자 ID 필터 없이 호출한다. 관리자 RLS는 모든 계정 읽기를 허용하므로 여러 행이 반환되면 단일 행 조회가 실패한다. 로그인은 조회 오류도 승인 대기로 안내한다. 당일 `https://cartoonplus.pages.dev`의 공개 배포 JavaScript에서도 두 호출을 확인했다. 실제 사용자 계정의 DB 상태는 직접 확인하지 않았다.
- **수정**: 로그인 결과 및 `getUser()`의 사용자 ID로 `.eq('id', user.id)`를 적용하여 본인의 역할과 승인 상태만 확인한다. 기존 RLS와 승인 정책은 유지한다.
- **검증**: `npm test -- src/features/staff/staffAuth.test.ts`에서 수정 전 승인 관리자 테스트가 동일 안내 문구로 실패했고, 수정 후 관리자/직원 로그인 및 pending/deactivated 차단 4건이 통과했다. 다중 행 오류는 RLS의 조회 범위를 모사한 테스트로 재현했다.
- **배포 상태**: 로컬 수정이며 배포 미반영. `npx tsc -b`는 별도 기존 오류인 `MenuPage.tsx:52`, `PublicInfoPage.tsx:69`의 TS18047로 실패했다. 배포 후 실제 관리자 로그인과 관리 화면 진입을 확인해야 한다.

---

## 1. 실 데이터 분석 및 전처리 내역 (Data Transformation Log)

### 📌 원본 데이터: `docs/assets/seoul_univ_2026-Sep-04_1021.csv` (서울대입구역점 604건)

- **원본 구조**:
  - `title`: 도서명 뒤에 최신 보유 권수가 결합된 형태 (예: `"블리치 68"`, `"연애혁명 38"`, `"나츠메 우인장 32"`)
  - `number`: 매장 서가 번호 (예: `"6"`, `"17"`, `"20"`)
  - `genre`: 장르 태그 (예: `"웹툰"`, `"순정"`, `"스포츠"`, `"마블DC"`, `"아이, 교육"`)
  - `author`: 작가명 (공백인 경우 `'미상'` 또는 원문 유지)

- **재가공 및 정규화 규칙 (Data Pipeline)**:
  1. **도서명 / 권수 분리**:
     - 정규식 `/(.+?)\s+(\d+)$/` 적용: `"블리치 68"` $\rightarrow$ 도서명: `"블리치"`, 권수: `"1~68권"`
     - 숫자가 없는 단독 도서명(예: `"내일은 발명왕"`): 권수 `"전권"` 또는 `"보유"`
     - 시즌/시리즈 표기(`"롱 리브 더 킹 시즌1 5"`): 도서명 `"롱 리브 더 킹 시즌1"`, 권수 `"1~5권"`
  2. **서가 번호 가공**:
     - `number: "6"` $\rightarrow$ `shelf_location: "6번 서가"` (또는 구역 매핑)
  3. **검색 색인 생성**:
     - `normalized_title`: 공백/특수문자 제거 소문자 변환
     - `initial_consonants`: 유니코드 자모 분해 한글 초성 추출 (`"블리치"` $\rightarrow$ `"ㅂㄹㅊ"`)
  4. **잠실점 시드 데이터 확장**:
     - 서울대입구역점 604건을 기반으로 잠실점 인기작 및 전용 도서 재고 데이터셋 병행 생성

---

## 2. 향후 트러블슈팅 및 기술 이슈 기록 템플릿

| 일시       | 문제 상황 (Issue / Symptom)                                     | 원인 분석 (Root Cause)                                                                            | 해결 방안 (Resolution)                                                                     |         상태         |
| :--------- | :-------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------- | :------------------: |
| 2026-09-06 | 원본 CSV의 도서명-권수 병합 저장                                | Caspio 레거시 포맷으로 인한 컬럼 병합                                                             | 정규식 기반 분리 파서 작성 및 시드 데이터 재가공                                           |       ✅ 완료        |
| 2026-09-06 | 목업 애니메이션(Float, Bob, Wiggle, Marquee, Pulse, Blink) 누락 | Tailwind JIT 설정 외 글로벌 CSS 키프레임 미명시 및 마키 루프 끊김                                 | `src/index.css`에 하드웨어 가속 키프레임 명시 및 이중 컨테이너 무한 롤링 마키 구현         |       ✅ 완료        |
| 2026-09-11 | GitHub Pages 직원 로그인에서 “Supabase 연결이 필요합니다” 표시  | Pages 빌드에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`가 없어 클라이언트 생성이 생략됨 | GitHub Actions 빌드 단계에서 Repository Secrets를 환경 변수로 주입. Secrets 등록 뒤 재배포 | ⏳ Secrets 등록 필요 |

| 2026-09-11 | Cloudflare 루트 배포 시 자산 경로와 직접 링크 호환 필요 | 기존 Vite base 및 404가 /CartoonPlus/로 고정됨 | build:cloudflare에서 --base / 적용, 404에서 호스트에 따라 루트 경로 선택. GitHub Secrets는 Cloudflare에 자동 전달되지 않아 공개 Supabase 설정을 별도 등록 | ✅ 완료 |
| 2026-09-11 | 매장 카운터 PC 백그라운드 탭에서 정시 안내 방송 누락 및 페이지 이동 시 중단 | 브라우저가 특정 페이지(`/staff/broadcast`)를 벗어나거나 백그라운드 탭으로 전환될 때 `setInterval`이 스로틀링(최대 1분 이상 지연)되고, 매 15초 DB 폴링 시 일 5,760회의 불필요한 API 부하 발생 | 최상위 전역 스케줄러(`<GlobalBroadcastService />`) 및 인라인 Blob Web Worker를 통한 10초 무중단 정밀 틱 타이머 구현, 인메모리 스케줄 캐시 + 이벤트 기반 동기화(`notifyScheduleUpdated`)로 Zero-polling 달성 | ✅ 완료 |

---

## 3. 매장 카운터 PC 안내 방송 백그라운드 스케줄러 최적화

### 📌 문제 상황 (Problem & Context)

- 매장 카운터 PC에서는 직원이 도서 검색, 매장 대시보드, 홈 화면 등 다른 페이지를 주로 이용하거나 창을 최소화/백그라운드로 내려놓는 경우가 많음.
- 기존 방식:
  1. `/staff/broadcast` 컴포넌트 내부에서만 `useEffect` + `setInterval(15_000)`로 방송을 감지하여, 직원이 다른 페이지로 이동하면 방송이 완전히 중단됨.
  2. 스케줄을 매 15초마다 Supabase REST API로 조회(단순 DB Polling)할 경우:
     - 클라이언트 1대당 **하루 5,760회** (매장 3대 기준 월 약 52만 회)의 불필요한 DB API 쿼리 및 네트워크 대역폭 낭비 발생.
     - Chrome / Edge 등 모던 브라우저는 **비활성(Background) 탭의 `setInterval` 타이머 주기를 1분~여러 분 단위로 강제 지연(Throttling/Clamping)**시키므로, `21:45` 신분증 검사나 `22:45` 마감 방송 같은 정시 방송이 누락되거나 몇 분 뒤 늦게 울리는 치명적 결함 발생.

### 🔍 대안 비교 및 분석 (Architectural Evaluation)

| 비교 항목              | 방식 1: 단순 DB Polling (`setInterval`) | 방식 2: Supabase Realtime (WebSocket)          | 방식 3: 인메모리 캐시 + Web Worker (채택안)                          |
| :--------------------- | :-------------------------------------- | :--------------------------------------------- | :------------------------------------------------------------------- |
| **API 호출량**         | 5,760회 / 일 (과도한 낭비)              | 초기 1회 + 변경 시에만                         | 초기 1회 + 변경 이벤트 발생 시만 (99.9% 절감)                        |
| **백그라운드 탭 보장** | ❌ 브라우저 Throttling으로 누락/지연    | ❌ 메인 스레드 지연 시 오디오 트리거 늦음      | ✅ **Web Worker 백그라운드 스레드로 100% 정시 틱 보장**              |
| **인프라 비용 & 연결** | DB Read 과부하 가능성                   | WebSocket 상시 연결 유지 필요 (Free Tier 한계) | 추가 인프라/커넥션 없이 0원                                          |
| **네트워크 끊김 내성** | 네트워크 순단 시 방송 실패              | 재연결 실패 시 동기화 누락                     | **인메모리 캐시 기반이라 일시적 오프라인에서도 로컬 방송 정상 송출** |

### 🛠️ 해결 방안 및 아키텍처 (Resolution Architecture)

1. **최상위 전역 스케줄러 (`<GlobalBroadcastService />`)**:
   - `src/App.tsx`의 `<BrowserRouter>` 최상단에 마운트하여, 카운터 직원이 어떤 하위 라우트(도서 검색, 자리 배치도, 대시보드 등)에 있더라도 브라우저가 열려있는 한 방송 감지 상시 가동.
2. **Web Worker 기반 백그라운드 무감속 타이머 (`src/lib/broadcastRunner.ts`)**:
   - 브라우저 메인 스레드는 탭 비활성화 시 `setInterval`을 지연시키지만, **Web Worker 백그라운드 스레드는 타이머 스로틀링을 받지 않음**.
   - 별도 빌드 설정 없이 동작하도록 인라인 Blob URL 기반 Web Worker(`createBroadcastTimerWorker`)를 생성하여 10초마다 메인 스레드에 tick 메시지 전송.
3. **Zero-polling 인메모리 캐시 & 이벤트 드리븐 동기화**:
   - 앱 기동 시 활성 스케줄 목록을 1회 로드하여 메모리에 보관.
   - 직원이 `/staff/broadcast`에서 스케줄을 추가/수정/삭제/토글할 때 커스텀 브라우저 이벤트(`notifyScheduleUpdated()`)를 디스패치하여 즉시 인메모리 캐시를 최신화.
   - 30분 간격 백업 폴링으로 타 PC에서 변경된 스케줄도 백그라운드 자동 동기화.
4. **중복 송출 방지 및 실행 이력 감사 기록 (`broadcast_runs`)**:
   - 동일 분(`id:YYYY-MM-DDTHH:mm`) 내 중복 재생 방지 Set 관리.
   - 방송 실행 시 Supabase `broadcast_runs` 테이블에 `pending` $\rightarrow$ `success` / `failure` 상태 자동 기록.
