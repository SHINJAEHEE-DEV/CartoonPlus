# Feature Specification: SEO (SSG & History API)

## 1. Goal
카툰플러스 고객 웹사이트의 검색엔진 최적화(SEO)를 달성하고 메신저(카카오톡 등) 공유 시 서브 페이지별 고유한 링크 프리뷰를 제공한다. 운영 비용 증가 없이 이를 달성하기 위해 History API 기반 라우팅과 정적 사이트 생성(SSG) 구조로 개편한다.

## 2. Scope
* 자체 해시 라우터(`window.location.hash`)를 `react-router-dom` 라이브러리로 마이그레이션
* Vite 빌드 파이프라인에 SSG(Static Site Generation) 빌드 로직 추가 (빌드 시 카테고리별 HTML 복제 및 메타 주입)
* `robots.txt` 및 `sitemap.xml` 생성 로직 도입
* 앱 런타임 내 탭 제목 동적 변경 기능 (`usePageTitle` Hook) 추가

## 3. Architecture & Technical Decisions
* **라우터 (Router)**: `react-router-dom` v7 도입 (HashRouter가 아닌 BrowserRouter 사용)
* **SEO & SSG 방식**: 
  * SSR 서버 없이 100% 정적 파일 배포를 유지 (운영 비용 0원 유지)
  * Vite의 빌드가 완료된 후 스크립트를 실행하여 `/books`, `/menu` 등의 폴더를 만들고, 원본 `index.html`의 `<title>`, `<meta>` 내용을 경로에 맞게 교체하여 저장.
  * 지원할 정적 경로: `/`, `/books`, `/menu`, `/events`, `/games`, `/store`, `/new-arrivals`
* **동적 탭 제목 (Runtime Title)**: 브라우저 환경에서 페이지 전환 시 `document.title` 갱신

## 4. Work Breakdown (Tickets)
* **Ticket 01**: `react-router-dom` 설치 및 기존 해시 라우팅 로직 마이그레이션 (`App.tsx` 구조 개편)
* **Ticket 02**: 빌드 시 동작하는 SSG 스크립트 작성 및 Vite 연동 (`scripts/generate-ssg.ts` 작성, 페이지별 메타데이터 매핑)
* **Ticket 03**: 앱 내 동적 타이틀 변경용 커스텀 Hook(`usePageTitle`) 구현 및 적용
* **Ticket 04**: `robots.txt` 및 `sitemap.xml` 생성 스크립트 작성 및 Cloudflare Pages 배포를 위한 `_routes.json` 설정 점검
