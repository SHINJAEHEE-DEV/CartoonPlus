Status: resolved
Type: task

# Ticket 04: sitemap, robots.txt 및 Cloudflare 라우팅 점검

## 목적
검색 엔진 크롤러가 사이트 지도를 파악하고, 허용된 경로만 스크랩하도록 안내 문서를 제공한다. 아울러 Cloudflare Pages 환경에서 History API 라우팅을 지원하기 위해 폴백 라우팅이 올바르게 동작하는지 점검한다.

## 작업 내용
1. 빌드 과정에서 `sitemap.xml`과 `robots.txt`를 생성하는 로직 추가 (또는 `public/` 폴더에 정적 파일로 생성 후 커밋)
   - `sitemap.xml`에는 대상 라우트들(`/`, `/books`, `/menu`, `/events`, `/games`, `/store`, `/new-arrivals`)을 모두 포함.
   - `robots.txt`에는 `/staff` 경로는 크롤링 금지(Disallow) 처리하고, 나머지는 허용(Allow) 처리하며 `Sitemap` 경로를 명시.
2. Cloudflare 배포 환경에서 SPA History 폴백이 잘 작동하도록 설정 점검 (기본적으로 CF Pages는 대응하는 파일이 없으면 `index.html`을 반환하므로 잘 동작하지만, 경우에 따라 `_routes.json`이나 `_redirects` 파일이 필요할 수 있음. 확인 후 필요시 `public/_redirects`에 `/* /index.html 200` 추가)

## 완료 기준
- `npm run build` 결과물(`dist/`)에 `sitemap.xml`과 `robots.txt`가 포함되어 있음.
- `robots.txt`에 `/staff` 경로 제외 규칙이 명시되어 있음.
