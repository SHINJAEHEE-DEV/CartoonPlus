Status: resolved
Type: task

# Ticket 01: 라우터 라이브러리 교체 (Hash -> History API)

## 목적
현재 `App.tsx`에 자체 구현된 `window.location.hash` 기반의 라우팅 시스템을 제거하고, `react-router-dom`의 `BrowserRouter` 체계로 전환하여 안정적인 History API 라우팅 환경을 구성한다.

## 작업 내용
1. `npm install react-router-dom` 설치
2. `App.tsx` 리팩터링
   - 기존의 `window.location.hash` 감지 로직(popstate, hashchange)과 자체 링크 가로채기(followInternalLink) 삭제
   - `<BrowserRouter>`, `<Routes>`, `<Route>` 컴포넌트를 사용해 라우팅 선언
   - `/staff/*` 관련 중첩 라우트 및 권한 체크(useEffect) 로직을 React Router의 Protected Route 패턴이나 `useLocation`, `useNavigate` 훅 등을 활용해 적절히 이관
3. 기존 앱에서 `window.location.hash = ...`로 이동하던 부분을 찾아 `useNavigate` 또는 `<Link>` 컴포넌트로 변경
4. 기존 앱의 내부 링크(`<a>` 태그 href)를 `react-router-dom`의 `<Link>` 컴포넌트로 변경 (필요 시)

## 완료 기준
- 앱을 실행했을 때 브라우저 주소창에 `#` 없이 `/books`, `/menu` 형태로 경로가 나타남.
- 네비게이션과 권한 체크(직원 페이지 접근)가 기존과 동일하게 동작함.
- `npm run test` 통과 확인
