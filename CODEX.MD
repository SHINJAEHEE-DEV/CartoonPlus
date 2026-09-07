# Codex 작업 지침

- 모든 대화, 설명, 피드백 및 주요 문서는 한국어로 작성한다.
- 작업 흐름은 `AGENTS.md`를 따른다. 새 기능은 `/grill-with-docs`부터 시작하고, 불명확한 버그는 `/diagnosing-bugs`로 조사한다.
- 설계·구조화에는 `domain-modeling`, `codebase-design`, `improve-codebase-architecture`를, 구현·테스트에는 `tdd`, `prototype`, `implement`를 사용한다.
- 요구사항과 이슈는 `to-spec`, `to-tickets`, `triage`로 관리하고, 검증에는 `code-review`, `diagnosing-bugs`, 의사결정 검증에는 `grilling`, `grill-me`를 사용한다.

## 프로젝트 컨텍스트

- 현재 출시 기준은 `.scratch/snu-operational-launch/spec.md`다. 서울대입구역점만 다음 주 일요일에 GitHub Pages로 전환하며, 도메인 비용 외 월 고정 운영비는 0원이다.
- 도메인 용어와 운영 정책은 `CONTEXT.md`를 따른다. 코드·문서·테스트에서 `Store`, `Book`, `BookInventory`, `BookRequest` 등 정의된 용어를 사용한다.
- 기술 선택과 변경 불가 결정은 `docs/adr/`와 `docs/TECHNOLOGY_DECISIONS.md`를 먼저 확인한다. 고객·직원 화면은 React/Vite/TypeScript, 운영 데이터·직원 인증은 Supabase를 사용한다.
- 기존 `docs/PRD.md`, `docs/REQUIREMENTS.md`, `docs/SERVICE_PLAN.md`, `docs/DATA_MODEL.md`는 과거 기획 참고 자료다. 현재 명세와 충돌하면 현재 명세를 우선한다.

## 이슈와 구현 상태

- 현재 spec과 구현 티켓은 `.scratch/snu-operational-launch/`에 있다. 형식과 상태 규칙은 `docs/agents/issue-tracker.md`, triage 라벨은 `docs/agents/triage-labels.md`를 따른다.
- 구현 전 관련 티켓을 읽고 `Blocked by`, 상태, 완료 기준을 확인한다. 구현 후에는 실제 상태와 티켓의 체크리스트를 함께 갱신한다.
- 고객 화면은 홈, 도서 검색, 게임, 이벤트, 매장 안내, 메뉴·요금을 제공한다. 직원 화면은 재고, 도서 입고 신청, 게임·이벤트, 방송을 다룬다. 고객 공개 읽기, 승인된 직원 운영, 관리자 계정 관리의 권한 경계를 보존한다.

## 품질 기준

- 사용자에게 노출되는 문구는 자연스러운 한국어로 작성하고, 모바일 고객 화면과 데스크톱 POS 화면을 모두 확인한다.
- 검색, 권수/서가 입력, Caspio CSV 가져오기, 승인된 직원 인증, 예약 방송은 현재 명세의 사용자 흐름을 기준으로 검증한다.
- 변경 전후 빌드와 관련 테스트를 실행한다. 현재 명세와 코드가 충돌하면 구현을 멈추고 차이를 보고한다.
