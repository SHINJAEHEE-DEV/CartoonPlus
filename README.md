# CartoonPlus

만화카페 고객의 도서 탐색과 매장 직원의 운영 업무를 지원하는 React 웹 애플리케이션입니다.

## 공개 저장소 범위

이 저장소에는 애플리케이션 코드, 데이터 모델, 요구사항, 기술 의사결정과 공개 가능한 개발 문서만 포함합니다. 실제 재고 CSV, 매장 사진·음원, 내부 운영 문서, 성능 원본과 환경 변수는 포함하지 않습니다.

## 기술 구성

- React 19, TypeScript, Vite, React Router
- Supabase: 운영 데이터, 인증, Row Level Security
- Cloudflare Pages: 정적 배포와 SSG
- Vitest, Testing Library: 핵심 로직과 화면 흐름 검증

## 시작하기

```bash
npm install
npm run dev
```

실제 운영 데이터를 사용하려면 로컬 `.env.local`에 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_PUBLISHABLE_KEY`를 설정합니다. 이 파일은 Git에 올리지 않습니다.

## 검증과 빌드

```bash
npm test
npm run build:cloudflare
```

## 문서

- [제품 요구사항](docs/PRD.md)
- [요구사항 명세](docs/REQUIREMENTS.md)
- [시스템 아키텍처 및 인프라](docs/ARCHITECTURE.md)
- [디렉터리 구조 및 파일별 역할](docs/CODEBASE_STRUCTURE.md)
- [주요 기능 실행 흐름 및 시나리오](docs/FLOWS_AND_SCENARIOS.md)
- [데이터 모델](docs/DATA_MODEL.md)
- [기술 의사결정](docs/TECHNOLOGY_DECISIONS.md)
- [도메인 용어](CONTEXT.md)

## 운영 주의사항

현재 공개 고객 카탈로그와 CSV 가져오기는 서울대입구역점 기준으로 구현되어 있습니다. 다지점 공개·업로드는 URL 지점 선택과 지점 범위 권한을 구현·검증한 뒤에 진행합니다. 자세한 결정은 [ADR-0005](docs/adr/0005-store-scoped-routing-and-access.md)를 참고하세요.
