# Issue tracker: 로컬 마크다운 (Local Markdown)

이 저장소의 이슈와 spec은 `.scratch/` 디렉터리에 마크다운 파일로 저장됩니다.

## 규칙 (Conventions)

- 기능별 단일 디렉터리: `.scratch/<feature-slug>/`
- 명세서 파일: `.scratch/<feature-slug>/spec.md`
- 구현 이슈는 티켓당 하나의 파일로 관리: `.scratch/<feature-slug>/issues/<NN>-<slug>.md` (`01`부터 번호 매김, 절대 하나의 통합 티켓 파일로 합치지 않음)
- triage 상태는 각 이슈 파일 상단 부근에 `Status:` 라인으로 기록 (역할 문자열은 `triage-labels.md` 참고)
- 코멘트 및 대화 이력은 파일 하단의 `## Comments` 섹션 아래에 추가

## 스킬에서 "publish to the issue tracker"를 지시할 때

`.scratch/<feature-slug>/` 아래에 새 파일을 생성합니다 (필요한 경우 디렉터리 생성).

## 스킬에서 "fetch the relevant ticket"을 지시할 때

참조된 경로의 파일을 읽습니다. 사용자는 일반적으로 경로 또는 이슈 번호를 직접 전달합니다.

## Wayfinding 작업 (Wayfinding operations)

`/wayfinder`에서 사용됩니다. **map** 파일과 티켓당 하나의 **child** 파일로 구성됩니다.

- **Map**: `.scratch/<effort>/map.md` (Notes / Decisions-so-far / Fog 본문).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md` (`01`부터 번호 매김, 본문에 질문 포함). `Type:` 라인에 티켓 유형(`research`/`prototype`/`grilling`/`task`)을 기록하고, `Status:` 라인에 `claimed`/`resolved`를 기록.
- **Blocking**: 상단 부근에 `Blocked by: NN, NN` 라인. 여기에 나열된 모든 파일이 `resolved` 상태가 되면 해당 티켓의 차단이 해제됨.
- **Frontier**: `.scratch/<effort>/issues/`에서 열려 있고(open), 차단되지 않았으며(unblocked), 할당되지 않은(unclaimed) 파일을 탐색; 번호가 낮은 순서 우선.
- **Claim**: 작업 시작 전 `Status: claimed`로 설정하고 저장.
- **Resolve**: `## Answer` 섹션 아래에 답변을 추가하고 `Status: resolved`로 설정한 후, `map.md`의 Decisions-so-far에 context 포인터(핵심 요약 + 링크)를 추가.
