# SEO 아키텍처 및 기술 의사결정 보고서 (SEO Architecture & Decisions)

**문서 작성일:** 2026-09-14  
**대상 서비스:** 카툰플러스 (CartoonPlus) 서울대입구역점 웹 서비스  
**작성 목적:** 검색 엔진 최적화(SEO) 및 소셜 미리보기(Open Graph) 대응을 위해 진행된 엔지니어링 작업 내역 정리, 아키텍처 대안 비교, 최종 기술 선택 근거 및 운영 성과 기록 (포트폴리오 및 기술 문서용)

---

## 1. 배경 및 문제 정의 (Problem Statement)

### 1.1 기존 SPA의 한계

- **Hash 기반 라우팅의 한계 (`/#/books`, `/#/menu`)**:
  - 초기 버전은 GitHub Pages / Cloudflare Pages의 SPA 라우팅 호환을 위해 해시 라우터를 사용했습니다.
  - 검색엔진(Googlebot, Naver Yeti 등) 및 소셜 미디어 크롤러(카카오톡 스크랩봇, 페이스북 봇 등)는 URL의 Hash(`#`) 뒤 경로를 서버 요청이나 별도 페이지로 인식하지 못하고 항상 루트(`/`) 페이지만 수집합니다.
- **단일 메타태그(`index.html`)로 인한 OG(Open Graph) 공유 문제**:
  - 고객이 `/menu`나 `/books` 링크를 카카오톡이나 SNS에 공유해도 항상 메인 홈 제목과 동일한 설명이 노출되어 페이지별 맞춤 정보 제공이 불가능했습니다.
- **비용 및 운영 복잡성 제약**:
  - 카툰플러스는 **"월 고정 운영비 0원(Zero-Cost) 유지"**를 핵심 원칙으로 삼고 있습니다.
  - SSR(Next.js, Node.js 서버 등)을 도입하면 매달 서버 호스팅 비용과 런타임 장애 관리 부담이 발생합니다.

---

## 2. 해결 방안 및 기술 대안 비교 (Alternatives & Trade-offs)

SEO 및 소셜 공유 최적화를 위해 검토된 3가지 아키텍처 대안은 다음과 같습니다.

| 비교 항목                  | 대안 1: Next.js / Remix SSR 전환                        | 대안 2: Headless 브라우저 렌더러 (Prerender.io)                  | 대안 3: Post-Build Multi-Page SSG (최종 채택)                          |
| :------------------------- | :------------------------------------------------------ | :--------------------------------------------------------------- | :--------------------------------------------------------------------- |
| **방식**                   | Node.js / Serverless 서버가 요청마다 실시간 HTML 렌더링 | 별도 프록시 서버에서 크롤러 요청 시점에 Chromium으로 HTML 렌더링 | Vite 빌드 타임에 주요 라우트별 정적 HTML 생성 후 Cloudflare Pages 배포 |
| **인프라/운영 비용**       | 🔴 유료 (Node.js 서버/Vercel 요금 발생 위험)            | 🔴 유료 (Prerender 서비스 구독료 발생)                           | 🟢 **0원 (Cloudflare Pages 정적 호스팅 무료 티어 유지)**               |
| **개발/마이그레이션 공수** | 🔴 높음 (전체 코드베이스 프레임워크 재작성)             | 🟡 중간 (미들웨어 및 프록시 설정 필요)                           | 🟢 **낮음~중간 (기존 React 19 + Vite 스택 100% 유지)**                 |
| **크롤러/소셜 봇 대응**    | 🟢 완벽 지원 (실시간 메타태그 생성)                     | 🟢 지원 (캐시 주기 및 응답 지연 가능성)                          | 🟢 **완벽 지원 (사전 생성된 고유 HTML 파일 즉시 서빙)**                |
| **초기 로딩 속도 (TTFB)**  | 🟡 보통 (서버 연산 대기 시간 발생)                      | 🔴 느림 (봇 요청 시 렌더링 오버헤드)                             | 🟢 **가장 빠름 (글로벌 CDN 엣지에서 정적 캐시 즉시 반환)**             |
| **시스템 복잡도/유지보수** | 🔴 높음 (서버 에러, 콜드스타트 모니터링 필요)           | 🟡 중간 (외부 벤더 의존성)                                       | 🟢 **매우 낮음 (빌드 스크립트 1개로 자체 해결)**                       |

### 💡 최종 선택 근거 (Why Multi-Page SSG?)

1. **운영 비용 0원 유지**: Cloudflare Pages의 무료 글로벌 엣지 정적 호스팅을 그대로 유지하면서 서버리스/컨테이너 인프라 비용을 전혀 발생시키지 않습니다.
2. **오버엔지니어링 방지**: Next.js 등 대형 프레임워크로 전면 재작성하지 않고도, 기존 Vite + React SPA 구조 위에서 120줄가량의 가벼운 Post-Build 스크립트(`scripts/generate-ssg.js`)만으로 요구사항을 100% 충족했습니다.
3. **완벽한 소셜 및 검색엔진 호환**: 정적 파일 서버가 각 경로(`/books/index.html`, `/menu/index.html` 등)로 직접 고유한 `<title>`, `<meta description>`, Open Graph 태그를 반환하므로 모든 크롤러가 자바스크립트를 실행하기 전에도 정확한 메타 정보를 즉시 수집합니다.

---

## 3. 상세 구현 작업 내역 (Implementation Details)

### 3.1 라우터 아키텍처 전환 (`react-router-dom` History API)

- Hash 기반 라우팅(`window.location.hash`)에서 표준 **HTML5 History API (`BrowserRouter`)** 체계로 전면 전환.
- 깔끔한 URL 경로(`/books`, `/menu`, `/events` 등) 확보 및 정적 라우트 매핑 구조 완성.

### 3.2 빌드 타임 정적 HTML 생성 스크립트 (`scripts/generate-ssg.js`)

- Vite가 빌드한 원본 `dist/index.html`을 템플릿으로 사용하여, 설정된 라우트 목록에 대해 고유한 물리 파일들을 생성:
  - `/books/index.html`
  - `/menu/index.html`
  - `/events/index.html`
  - `/games/index.html`
  - `/store/index.html`
  - `/new-arrivals/index.html`
- 각 HTML 파일의 `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta name="twitter:*">`를 해당 페이지 목적에 맞게 교체 주입.

### 3.3 검색엔진 색인 자산 자동 생성

- **`sitemap.xml`**: 검색엔진이 모든 공개 엔트리포인트를 탐색할 수 있도록 표준 XML 사이트맵을 빌드 시 자동 생성.
- **`robots.txt`**: 관리자 및 직원 전용 경로(`/staff`)의 크롤링을 차단(`Disallow: /staff`)하고 사이트맵 위치 명시.
- **`_routes.json`**: Cloudflare Pages에서 정적 자산(CSS/JS/이미지)과 정적 HTML은 엣지에서 바로 제공하고, 기타 동적 경로는 SPA 라우터로 폴백되도록 라우팅 규칙 설정.

### 3.4 런타임 동적 타이틀 동기화 (`usePageTitle` 훅)

- 사용자가 SPA 내에서 페이지를 클릭하여 이동할 때 브라우저 탭의 제목이 즉시 변경되도록 `usePageTitle(title)` 훅을 개발하고 모든 고객 화면(`HomePage`, `BookSearchPage`, `MenuPage`, `PublicInfoPage`, `NewArrivalsPage`)에 적용.
- 브라우저 히스토리 탐색 및 북마크 시 일관된 사용자 경험(UX) 제공.

---

## 4. 적용 결과 및 기대 효과 (Outcomes)

1. **소셜 미리보기(OG) 최적화**: 카카오톡이나 인스타그램 등에 `/menu` 또는 `/events` 링크를 공유했을 때 해당 페이지의 전용 제목과 설명문이 깔끔한 카드 형태로 표시됨.
2. **검색 포털 색인성 확보**: 구글, 네이버 등 주요 포털 검색 결과에 홈 화면뿐만 아니라 도서 검색, 매장 메뉴, 이용 요금 페이지가 개별 검색 결과(Site Links)로 노출 가능해짐.
3. **무결성 및 CI/CD 자동화**: `package.json`의 `build` 및 `build:cloudflare` 스크립트에 `node scripts/generate-ssg.js`가 통합되어 변경 사항 푸시 시 자동으로 모든 SEO 자산이 갱신됨.
4. **인프라 비용 Zero**: 유료 백엔드 런타임 없이 완전 정적 호스팅(Cloudflare Pages) 환경에서 상용 수준의 SEO 품질 달성.

## 5. 다지점 전환 시 SEO 기준

다지점 전환은 ADR-0005의 `/stores/:slug` URL을 사용한다. 각 지점의 메뉴·이벤트·매장 안내는 해당 지점 URL에서만 노출하고, SSG 라우트·sitemap·canonical·Open Graph 메타데이터도 지점별로 생성한다. 지점 선택 구현 전에는 두 추가 지점 URL을 색인하거나 공개하지 않는다. 이 방식은 지점 콘텐츠가 섞여 색인되는 문제를 막고, 별도 서버 비용 없이 지점별 공유 링크를 제공한다.
