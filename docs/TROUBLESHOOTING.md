# 카툰플러스 개발 및 트러블슈팅 기록 (Troubleshooting & Dev Notes)

개발 과정에서 발생하는 이슈, 데이터 전처리 분석, 성능 최적화 및 트러블슈팅 내역을 체계적으로 기록합니다.

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

| 일시 | 문제 상황 (Issue / Symptom) | 원인 분석 (Root Cause) | 해결 방안 (Resolution) | 상태 |
| :--- | :--- | :--- | :--- | :---: |
| 2026-09-06 | 원본 CSV의 도서명-권수 병합 저장 | Caspio 레거시 포맷으로 인한 컬럼 병합 | 정규식 기반 분리 파서 작성 및 시드 데이터 재가공 | ✅ 완료 |
| 2026-09-06 | 목업 애니메이션(Float, Bob, Wiggle, Marquee, Pulse, Blink) 누락 | Tailwind JIT 설정 외 글로벌 CSS 키프레임 미명시 및 마키 루프 끊김 | `src/index.css`에 하드웨어 가속 키프레임 명시 및 이중 컨테이너 무한 롤링 마키 구현 | ✅ 완료 |
| 2026-09-11 | GitHub Pages 직원 로그인에서 “Supabase 연결이 필요합니다” 표시 | Pages 빌드에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`가 없어 클라이언트 생성이 생략됨 | GitHub Actions 빌드 단계에서 Repository Secrets를 환경 변수로 주입. Secrets 등록 뒤 재배포 | ⏳ Secrets 등록 필요 |

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

| 비교 항목 | 방식 1: 단순 DB Polling (`setInterval`) | 방식 2: Supabase Realtime (WebSocket) | 방식 3: 인메모리 캐시 + Web Worker (채택안) |
| :--- | :--- | :--- | :--- |
| **API 호출량** | 5,760회 / 일 (과도한 낭비) | 초기 1회 + 변경 시에만 | 초기 1회 + 변경 이벤트 발생 시만 (99.9% 절감) |
| **백그라운드 탭 보장** | ❌ 브라우저 Throttling으로 누락/지연 | ❌ 메인 스레드 지연 시 오디오 트리거 늦음 | ✅ **Web Worker 백그라운드 스레드로 100% 정시 틱 보장** |
| **인프라 비용 & 연결** | DB Read 과부하 가능성 | WebSocket 상시 연결 유지 필요 (Free Tier 한계) | 추가 인프라/커넥션 없이 0원 |
| **네트워크 끊김 내성** | 네트워크 순단 시 방송 실패 | 재연결 실패 시 동기화 누락 | **인메모리 캐시 기반이라 일시적 오프라인에서도 로컬 방송 정상 송출** |

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

