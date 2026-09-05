# Domain Docs

코드베이스를 탐색할 때 엔지니어링 스킬이 이 저장소의 도메인 문서를 참조하는 방법입니다.

## 탐색 전 필독 문서

- 저장소 루트의 **`CONTEXT.md`**, 또는
- 저장소 루트에 **`CONTEXT-MAP.md`**가 있는 경우: 각 context별 `CONTEXT.md`를 가리킵니다. 작업 주제와 관련된 문서를 읽습니다.
- **`docs/adr/`**: 작업할 영역과 관련된 ADR을 읽습니다. Multi-context 저장소의 경우 `src/<context>/docs/adr/`에서 context 한정 의사결정도 확인합니다.

이 파일들 중 일부가 존재하지 않더라도 **아무런 언급 없이 그대로 진행**합니다. 문서가 없다고 지적하거나 미리 생성하도록 제안하지 마세요. `/domain-modeling` 스킬(`/grill-with-docs` 및 `/improve-codebase-architecture`를 통해 진입)은 용어나 의사결정이 실제로 확정될 때 이 문서들을 지연 생성(lazily create)합니다.

## 디렉터리 구조 (File structure)

단일 컨텍스트 (Single-context) 저장소 (대부분의 저장소):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

다중 컨텍스트 (Multi-context) 저장소 (루트에 `CONTEXT-MAP.md`가 존재):

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← 시스템 전반의 의사결정
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← 컨텍스트 한정 의사결정
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## 용어집(Glossary) 어휘 사용

출력 결과에서 도메인 개념을 명명할 때(이슈 제목, 리팩터링 제안, 가설, 테스트 이름 등), `CONTEXT.md`에 정의된 용어를 사용합니다. 용어집에서 명시적으로 피하는 유의어로 변경하지 마세요.

필요한 개념이 아직 용어집에 없다면 이는 중요한 신호입니다. 프로젝트에서 쓰지 않는 용어를 만들어내고 있거나(재검토 필요), 실제 도메인에 공백이 있는 것( `/domain-modeling` 대상)입니다.

## ADR 충돌 표시 (Flag ADR conflicts)

작업 결과가 기존 ADR과 충돌하는 경우, 묵인하고 덮어쓰지 말고 명시적으로 드러내야 합니다:

> _ADR-0007 (event-sourced orders)과 충돌하지만, 다음과 같은 이유로 재검토할 가치가 있습니다…_
