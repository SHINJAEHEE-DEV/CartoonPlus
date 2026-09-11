Status: resolved
Type: task

# Ticket 02: SSG 빌드 스크립트 작성 및 Vite 연동

## 목적
SSR 프레임워크 없이 빌드 타임에 각 페이지별(라우트별) 고유한 HTML 파일을 찍어내어 검색엔진 크롤러가 올바른 메타데이터를 수집할 수 있도록 한다.

## 작업 내용
1. `scripts/generate-ssg.ts` (또는 `.js`) 스크립트 작성.
   - Vite가 `dist/index.html`을 빌드한 직후 실행됨.
   - 대상 라우트: `/books`, `/menu`, `/events`, `/games`, `/store`, `/new-arrivals`
   - 각 라우트에 대한 메타데이터 매핑(title, description, og:title 등) 정의
   - `dist/index.html`을 읽어와 대상 라우트 폴더(예: `dist/books`)를 만들고, `<title>` 및 `<meta>` 태그를 교체한 뒤 `dist/books/index.html`로 저장
2. `package.json`의 빌드 스크립트 수정
   - `"build": "tsc -b && vite build && node scripts/generate-ssg.js"` 형태로 연동
   - `"build:cloudflare"` 스크립트도 동일하게 반영

## 완료 기준
- `npm run build`를 실행하면 `dist/` 폴더 내에 `books/index.html`, `menu/index.html` 등의 파일이 정상적으로 생성됨.
- 생성된 각 `index.html` 파일을 열었을 때, 각 경로에 맞는 커스텀 제목과 메타 태그가 들어가 있음.
