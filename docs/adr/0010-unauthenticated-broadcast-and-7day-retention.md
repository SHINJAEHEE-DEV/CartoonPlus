# ADR 0010: 비로그인 상태 매장 안내 방송 송출 지원 및 방송 실행 이력 7일 보존 주기 결정

- **상태**: 승인됨 (Accepted)
- **결정일**: 2026-09-18
- **결정자**: Jaehee Shin (Lead Product Manager & Engineer)

---

## 1. 배경 및 문제 상황 (Context & Problem Statement)

1. **카운터 PC 비로그인 운영 환경**:
   - 실물 매장 카운터 PC에서는 직원이 매번 로그인 상태를 유지하기 어렵거나, 고객용 검색 화면(홈/도서검색)을 전체 화면으로 띄워두고 운영하는 경우가 빈번함.
   - 기존 구현에서는 `<GlobalBroadcastService />`가 `<ProtectedStaffRoute>`(로그인 필수 라우트) 내부에만 마운트되어 있고, DB의 `claim_broadcast_playback_lease` RPC 및 `broadcast_runs` RLS 정책이 승인된 직원(`authenticated`) 전용으로 차단되어 있어 **비로그인 상태에서는 예약 방송이 전혀 송출되지 않는 치명적 문제**가 발생함.
2. **지점별 단일 스피커 PC 환경**:
   - 현재 각 오프라인 매장(서울대입구역점, 잠실점, 홍대점)의 앰프/스피커와 연결된 카운터 PC는 지점당 1대로 고정되어 있음.
   - 따라서 복잡한 기기별 토글 없이, 해당 지점의 웹페이지(예: `/stores/snu`, `/stores/jamsil` 또는 기본 지점)를 열어둔 카운터 PC 브라우저에서 자연스럽게 자동 방송이 송출되어야 함.
3. **방송 실행 이력(`broadcast_runs`) 무한 누적 및 용량 관리**:
   - 10초 틱 및 스케줄러 실행 시 생성되는 `pending`, `success`, `failure`, `missed` 감사 로그가 지속 누적되어 DB 용량을 점유함.
   - 운영상 최근 7일간의 기록만 감사/트러블슈팅 목적으로 필요하며, 기존 누적 데이터 정리 및 7일 롤링 자동 삭제 정책이 필요함.

---

## 2. 결정 사항 (Decisions & Architecture)

### 1) 비로그인 전역 안내 방송 스케줄러 지원
- `<GlobalBroadcastService />`를 `App.tsx`의 최상위 `<BrowserRouter>` 레벨로 이동하여, **비로그인 고객/매장 화면에서도 상시 무중단 구동**.
- **방송 대상 지점 식별**:
  - URL 경로에 지점이 지정된 경우(예: `/stores/snu/*`, `/stores/jamsil/*` 등) 해당 지점의 스케줄을 우선 로드.
  - 루트 경로(`/`) 및 비지점 경로에서는 브라우저의 최근 선택 지점(로컬 스토리지 `cartoonplus_selected_store`, 기본값: 서울대입구역점 `snu`)을 기준으로 동작.
- **DB RLS 및 RPC 익명 권한 확장**:
  - `scheduled_broadcasts`, `broadcast_presets` 테이블의 공개 읽기(`anon` SELECT) 허용.
  - `claim_broadcast_playback_lease` RPC 및 `broadcast_runs` INSERT/UPDATE를 익명(`anon`) 사용자에게도 안전하게 허용하여 비로그인 브라우저에서도 Lease 획득 및 실행 결과 로깅 지원.

### 2) 방송 실행 이력 7일 롤링 보존 및 기존 데이터 전면 정리
- **기존 누적 데이터 즉시 비움**: 마이그레이션을 통해 기존 `broadcast_runs` 테이블의 누적 레코드를 전면 정리(TRUNCATE).
- **7일 경과 기록 자동 일괄 삭제**:
  - 신규 실행 기록 삽입 시 또는 스케줄러 동작 시 `triggered_at < NOW() - INTERVAL '7 days'`인 과거 레코드를 자동으로 삭제하는 PostgreSQL 트리거/함수 적용.
  - 항상 최근 7일 치의 실행 기록만 유지하여 DB를 가볍고 쾌적하게 유지.

---

## 3. 결과 및 영향 (Consequences)

- **긍정적 영향**:
  - 카운터 직원이 로그인 여부에 신경 쓸 필요 없이, 카운터 PC에 웹페이지만 켜두면 매일/정시 안내 방송이 100% 신뢰성 있게 자동 송출됨.
  - 불필요한 과거 로그가 영구 삭제되고 7일 롤링 보존되어 Supabase DB 용량 및 쿼리 속도 최적화.
- **운영 시 주의사항**:
  - 브라우저 Autoplay 정책 방지를 위해 매장 오픈 시 카운터 PC 브라우저에서 최초 1회 화면 클릭(오디오 엔진 언락) 필요.
