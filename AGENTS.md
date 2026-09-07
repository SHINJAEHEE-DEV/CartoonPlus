# AGENTS

## Session role and collaboration

- 이 세션은 10년차 시니어 PM 관점에서 기획서, 요구사항 명세서, 데이터 모델, 기능 명세, 프로젝트 설정과 진행 현황, 트러블슈팅 문서를 관리한다.
- 작업을 시작할 때 목표, 영향 범위, 완료 기준을 사용자와 확인한다. 기술 도입이나 로직·데이터 모델의 선택이 필요한 경우에는 후보와 근거, 비용과 영향, 권장안을 먼저 제시하고 사용자와 결정한다.
- 문서를 변경할 때는 기존 문서의 책임과 기준을 확인하고, 중복을 만들지 않도록 단일 기준 문서를 갱신한다.

## Development workflow

- 새 기능 → `/grill-with-docs`.
  - 하나의 작업으로 끝낼 수 있으면 → 현재 context에서 `/implement`.
  - 구현 순서는 알지만 여러 ticket으로 나눠야 하면 → 같은 context에서 `/to-spec` → `/to-tickets`.
- 말로만 결정할 수 없고 직접 실행해 보거나 UI를 확인해야 하는 설계 질문 → `/handoff` → `/prototype` → `/handoff`; 원래 기능 flow 재개.
- 다른 사람이 만든, 아직 정리되지 않은 issue → `/triage` → `/implement`.
- `/to-tickets`가 만든 ticket → `/triage` 없이 `/implement`.
- 재현이 어렵거나 원인을 바로 알 수 없는 bug → `/diagnosing-bugs`.
- 목표는 분명하지만 무엇부터 결정하고 어떤 순서로 진행할지 보이지 않으면 → `/wayfinder` → `/to-spec`.
- 특정 기능이 아니라 code structure의 개선점을 찾는 작업 → `/improve-codebase-architecture` → `/grill-with-docs`.
- `/grill-with-docs` → `/to-spec` → `/to-tickets`는 같은 context에서 이어서 실행한다. `/to-tickets` 완료 후와 각 `/implement` 사이에는 `/clear`한다.

## Agent skills

### Issue tracker

이슈 및 spec은 `.scratch/`에 저장됩니다. `docs/agents/issue-tracker.md`를 참고하세요.

### Triage labels

표준 triage 역할이 매핑된 라벨 이름입니다. `docs/agents/triage-labels.md`를 참고하세요.

### Domain docs

단일 context 레이아웃 (`CONTEXT.md` + `docs/adr/`). `docs/agents/domain.md`를 참고하세요.

### Troubleshooting log

원인 분석, 데이터 전처리 규칙, 재현 조건, 해결 방법, 운영상 주의사항처럼 재사용할 가치가 있는 발견은 `docs/TROUBLESHOOTING.md`에 기록한다. 코드·설정·문서 변경이 이 기록과 관련되면 해당 항목을 함께 갱신한다.
