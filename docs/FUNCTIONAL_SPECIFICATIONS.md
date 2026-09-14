# 기능 명세 색인

기능 요구사항의 단일 기준은 `docs/REQUIREMENTS.md`다. 이 문서는 기능별 흐름, 구현 위치, 운영 문서를 연결한다. 상세 작업 명세는 `.scratch/<feature>/spec.md`에 둔다.

| 기능        | 사용자 흐름                                            | 요구사항                                    | 구현·운영 기준                            |
| ----------- | ------------------------------------------------------ | ------------------------------------------- | ----------------------------------------- |
| 도서 검색   | 고객 검색 → 권수·서가 확인 → 없으면 신청               | `FR-BOOK-*`                                 | `src/features/book-search`, `DATA_MODEL`  |
| 재고·CSV    | 직원 로그인 → CSV 검증 → 업로드 → 중복 확인            | `FR-INV-*`                                  | `STAFF_SITE_MANUAL`, `OPERATIONS_ROLLOUT` |
| 직원 계정   | 가입 신청 → 관리자 승인 → 운영 화면 이용               | `FR-AUTH-*`                                 | `staff_accounts`, RLS                     |
| 도서 신청   | 고객 신청 → 직원 상태 변경 → 입고 후 재고 등록         | `FR-REQ-*`                                  | `book_requests`                           |
| 매장 콘텐츠 | 직원 검증 → 고객 공개                                  | `FR-STORE-*`                                | `store_content`, 게임·이벤트·메뉴         |
| 방송        | 직원 즉시/예약 설정 → 카운터 브라우저 실행 → 기록 확인 | `FR-BCAST-*`                                | `scheduled_broadcasts`, `broadcast_runs`  |
| 다지점 전환 | URL 지점 선택 → 지점별 조회·쓰기 → 지점 범위 권한 확인 | `FR-STORE-008`, `FR-INV-004`, `FR-AUTH-008` | ADR-0005, `DATA_MODEL`                    |

새 기능은 요구사항 ID, 고객/직원 플로우, 데이터 영향, 권한, 완료 기준을 먼저 `REQUIREMENTS.md`와 해당 `.scratch` 명세에 기록한다. 되돌리기 어려운 기술 선택만 ADR로 남긴다.
