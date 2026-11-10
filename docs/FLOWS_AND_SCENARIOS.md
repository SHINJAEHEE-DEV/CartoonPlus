# 주요 기능 실행 흐름 및 시나리오 (Flows & Scenarios)

본 문서는 카툰플러스(CartoonPlus)의 핵심 비즈니스 흐름과 클라이언트·서버 간 실행 시퀀스를 다이어그램 및 개조식 명세로 정의한 기준 문서임.

---

## 1. 직원 가입 신청 및 관리자 승인 흐름 (Staff Auth Flow)

매장 직원은 개인 이메일 대신 로그인 아이디(`login_id`)를 사용하며, 최고 관리자(`admin`)의 승인을 거친 후 소속 지점 콘솔에 접근함.

### 1.1 시퀀스 다이어그램

```mermaid
sequenceDiagram
    autonumber
    actor Staff as 매장 직원
    actor Admin as 최고 관리자
    participant Web as 프론트엔드 (StaffAccessPage)
    participant Auth as Supabase Auth
    participant DB as PostgreSQL (staff_accounts)

    Staff->>Web: 이름, 소속 지점(storeSlug), 로그인ID, 비밀번호, 휴대폰 뒷 4자리 입력
    Web->>Auth: signUp(email: '{loginId}@cartoonplus.internal', password)
    Auth-->>Web: Auth 계정 생성 완료 (user.id 반환)
    Web->>DB: RPC apply_for_staff_account(name, login_id, phone_last4, store_slug)
    DB-->>Web: status='pending' 및 store_id 매핑 등록 완료
    Web-->>Staff: "가입 신청 완료 (관리자 승인 대기)" 안내 표시

    Note over Admin,DB: 최고 관리자 승인 단계
    Admin->>Web: /staff/:storeSlug/accounts 접속
    Web->>DB: SELECT * FROM staff_accounts ORDER BY created_at DESC
    DB-->>Web: 전체 직원 계정 목록 반환
    Admin->>Web: 대기 계정 승인 클릭 (지점 확인 및 role='staff' 부여)
    Web->>DB: UPDATE staff_accounts SET status='approved', role='staff', store_id=...
    DB-->>Web: 승인 반영 완료

    Note over Staff,DB: 승인 후 로그인 및 라우팅 단계
    Staff->>Web: 로그인 시도 (signInStaff)
    Web->>Auth: signInWithPassword(내부 이메일, 비밀번호)
    Auth-->>Web: 세션 발급 완료
    Web->>DB: SELECT role, status, store_id FROM staff_accounts WHERE id = user.id
    DB-->>Web: status='approved' 및 소속 storeSlug 확인
    Web-->>Staff: /staff/:storeSlug/dashboard로 이동
```

### 1.2 예외 및 보안 처리 규칙

- `status`가 `'pending'` 또는 `'deactivated'`인 계정이 로그인을 시도할 경우, [src/features/staff/staffAuth.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/staff/staffAuth.ts)에서 즉시 `supabase.auth.signOut()`을 호출하여 세션을 파기하고 접근 거부 안내를 표시함.
- 일반 직원(`role === 'staff'`)이 URL을 직접 조작하여 타 지점 경로(`/staff/other-slug/*`)에 접근할 경우, [src/App.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/App.tsx)의 `ProtectedStaffRoute`에서 본인 소속 지점 경로로 강제 리다이렉트함.

---

## 2. 한글 초성 및 공백 무시 도서 검색 흐름 (Book Search Flow)

지점당 수천~수만 권의 도서 데이터를 키 입력마다 지연 없이 필터링하기 위해 [src/lib/bookSearch.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/bookSearch.ts)의 `WeakMap` 사전 인덱싱과 [src/features/book-search/BookSearchPage.tsx](file:///Users/jaehee/Desktop/projects/cartoonplus/src/features/book-search/BookSearchPage.tsx)의 2단계 분리형 `useMemo` 파이프라인을 적용함.

### 2.1 검색 파이프라인 다이어그램

```mermaid
flowchart TD
    A["지점 도서 카탈로그 로드 (loadPublicCatalogue)<br/>• SWR 메모리 캐시 우선 반환 + 백그라운드 재검증"] --> B["WeakMap 사전 인덱싱 (getBookIndex)<br/>• 정규화 제목/작가/출판사<br/>• 한글 초성 문자열<br/>• 11대 표준 장르 Set"]
    B --> C["1단계: 장르 필터링 useMemo (genreFilteredBooks)<br/>• 전체('all') 선택 시 원본 배열 참조 유지<br/>• 특정 장르 선택 시 categoriesSet.has(genre) O(1) 판별"]
    C --> D["2단계: 검색어 정규화 및 초성 여부 1회 계산<br/>• normalizeSearchText(query)<br/>• isInitialConsonantQuery(normalizedQuery)"]
    D --> E{"초성 전용 검색어인가?<br/>(/^[ㄱ-ㅎ]+$/)"}
    E -->|"Yes (초성 검색)"| F["사전 계산된 titleInitials / authorInitials<br/>부분 일치(includes) 매칭"]
    E -->|"No (일반/공백무시 검색)"| G["사전 계산된 normalizedTitle / normalizedAuthor /<br/>normalizedPublisher 부분 일치 매칭"]
    F --> H["페이지네이션 슬라이싱 (PAGE_SIZE = 18)"]
    G --> H
    H --> I["텍스트 전용 도서 카드 렌더링<br/>(도서명, 작가, 장르 배지, 30일 NEW 배지, 권수, 서가 위치)"]
```

### 2.2 핵심 알고리즘 명세 (`bookSearch.ts`)

- **유니코드 한글 초성 추출**: 한글 음절 범위(`0xAC00` ~ `0xD7A3`)에 대해 `Math.floor((code - 0xAC00) / 588)` 공식으로 19개 초성 인덱스를 $O(L)$에 추출함.
- **공백 및 특수문자 제거 정규화**: `text.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '')`를 적용하여 띄어쓰기나 문장부호 차이를 무시함.
- **무효 쿼리 거부**: 정규화 결과가 빈 문자열이면서 원본 입력이 공백/특수문자뿐인 경우 `false`를 반환하여 불필요한 전체 목록 노출을 차단함.

---

## 3. 매장 자동 안내 방송 및 스케줄러 흐름 (Broadcast Flow)

매장 앰프 스피커에 연결된 카운터 PC에서 비로그인 상태 및 백그라운드 탭 환경에서도 정시에 안내 방송을 송출하기 위해 [src/lib/broadcastRunner.ts](file:///Users/jaehee/Desktop/projects/cartoonplus/src/lib/broadcastRunner.ts) 기반 아키텍처를 구동함.

### 3.1 자동 방송 실행 흐름도

```mermaid
flowchart TD
    Init["앱 기동 (GlobalBroadcastService)"] --> Guard{"실행 조건 검증<br/>1) 루트('/') 경로가 아닌가?<br/>2) 모바일 기기가 아닌가?<br/>3) 방송 수신기(receiver) 활성화 단말인가?"}
    Guard -->|"조건 불충족"| Stop["스케줄러 비활성 (Early Return)"]
    Guard -->|"조건 충족"| Worker["인라인 Blob Web Worker 기동<br/>(백그라운드 탭 감속 없는 10초 주기 tick)"]
    Worker --> Cache["활성 스케줄 조회 (60초 TTL 인메모리 캐시)<br/>• BroadcastChannel / 커스텀 이벤트 발생 시 즉시 갱신"]
    Cache --> Check{"현재 시각(HH:mm) 및 요일이<br/>예약 조건(isDue)과 일치하는가?"}
    Check -->|"No"| Worker
    Check -->|"Yes"| Dedup{"동일 분(id:YYYY-MM-DDTHH:mm)<br/>기송출 여부 및 30초 Lease 락 획득 성공?"}
    Dedup -->|"실패 / 이미 송출"| Worker
    Dedup -->|"Lease 획득 성공"| Play["HTMLAudioElement 음원 재생<br/>(정적 MP3 또는 Supabase Storage 업로드 음원)"]
    Play --> Log["broadcast_runs 실행 이력 기록 (success / failure)<br/>및 7일 경과 오래된 이력 자동 정리"]
    Log --> Worker
```

### 3.2 다중 단말 간섭 방지 및 동기화 규칙

1. **명시적 수신기 등록 (`cartoonplus_broadcast_receiver_enabled`)**: 매장 내 도서 검색용 PC나 태블릿에서 안내 방송이 울리는 것을 방지하기 위해, 카운터 앰프 PC에서만 수신기 토글을 `ON`으로 설정함.
2. **다중 탭 즉시 동기화 (`BroadcastChannel`)**: 직원이 관리 화면(`/staff/:storeSlug/broadcast`)에서 예약을 추가·수정·비활성화하면 `BroadcastChannel('cartoonplus_broadcast_channel')`을 통해 동일 브라우저의 모든 탭 캐시를 즉시 무효화함.

---

## 4. 도서 입고 신청 및 재고 등록 연계 흐름 (Book Request & CSV Import Flow)

### 4.1 비회원 도서 입고 신청 상태 다이어그램

```mermaid
stateDiagram-v2
    [*] --> received : 고객 비회원 신청 제출 (BookRequestModal / BookRequestForm)
    received --> ordered : 직원 검토 후 발주 진행 (status='ordered')
    received --> unavailable : 절판 / 취급 불가 판정 (status='unavailable')
    ordered --> completed : 매장 도서 도착 및 검수 완료 (status='completed')
    completed --> Inventory_Registered : 원클릭 신규 재고 등록 연계 (30일간 NEW 배지 노출)
```

### 4.2 지점별 CSV 배치 재고 동기화 흐름 (`inventoryImport.ts`)

1. **지점 식별 검증**: 업로드한 CSV 파일명에 포함된 지점 식별자와 현재 선택된 지점(`storeSlug`)이 일치하는지 사전 검증하여 타 지점 오업로드를 차단함.
2. **인코딩 및 포맷 자동 파싱**: UTF-8 및 EUC-KR/CP949 인코딩을 자동 감지하고 지점별 헤더 규격(`snu`, `jamsil`, `hongdae`, 표준 5열)을 파싱함.
3. **10건 단위 배치 병렬 Upsert**: `CONCURRENCY_LIMIT = 10` 워커 풀을 통해 `upsert_inventory_for_store` RPC를 병렬 호출하여 대량 재고 동기화 시간을 단축함.
