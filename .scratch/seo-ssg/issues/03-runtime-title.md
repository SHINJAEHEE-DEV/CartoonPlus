Status: open
Type: task

# Ticket 03: 클라이언트 런타임 동적 Title Hook 적용

## 목적
사용자가 브라우저에서 페이지를 이동할 때, 탭의 텍스트가 현재 보고 있는 페이지의 이름으로 부드럽게 변경되도록 지원한다. (예: `카툰플러스` -> `카툰플러스 | 메뉴 안내`)

## 작업 내용
1. `src/lib/usePageTitle.ts` 커스텀 훅 작성
   - `useEffect`를 사용하여 파라미터로 넘어온 title 값을 `document.title`에 할당.
2. 각 주요 페이지 컴포넌트(`BookSearchPage`, `MenuPage` 등) 상단에서 `usePageTitle('도서 검색')` 방식으로 호출
3. 카툰플러스의 컨벤션(예: `카툰플러스 | {페이지명}`)에 맞게 제목을 조합하는 유틸리티 고려

## 완료 기준
- 로컬 개발 서버(`npm run dev`)에서 네비게이션을 통해 여러 메뉴를 오갈 때 브라우저 탭의 제목이 즉시 올바르게 갱신됨.
