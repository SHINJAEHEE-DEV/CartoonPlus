# 01: 운영용 Supabase·Cloudflare Pages 환경 준비

**What to build:** 서울대입구역점의 실제 운영 데이터와 직원 인증을 연결할 Supabase 프로젝트, 그리고 Cloudflare Pages 배포 환경을 준비한다. 기존 GitHub Pages는 전환 검증 기간에 유지한다. 이후 티켓이 안전하게 고객 공개 데이터와 승인된 직원 운영 데이터를 다룰 수 있는 출발점을 만든다.

**Blocked by:** None (can start immediately).

**Status:** ready-for-human

- [x] Cloudflare 계정 인증과 GitHub 저장소 연결 승인이 완료되어 있다.
- [x] Cloudflare 빌드에 Supabase URL·공개 publishable 키를 등록하고 서비스 역할 키는 포함하지 않는다.
- [ ] 최초 관리자 계정을 수동 생성할 운영 절차가 준비되어 있다.
- [x] https://cartoonplus.pages.dev 에서 배포된 앱을 열 수 있다.

## Comments


### 2026-09-11 Cloudflare 이전 검증

- 프로젝트: `cartoonplus`, 저장소: `SHINJAEHEE-DEV/CartoonPlus`, production: `main`.
- 첫 배포 커밋: `560d921`, Cloudflare 대시보드 성공 확인.
- 빌드 명령: `npm run build:cloudflare`, 출력: `dist`, Node: `22.16.0`.
- Supabase 공개 환경변수 등록 완료. 생성 화면은 Production·Preview 양쪽에 적용한다.
- HTTPS 홈, 도서 600건 조회, 공백 포함 검색(체인소 맨), 메뉴 직접 경로 및 새로고침, 직원 로그인 직접 경로 확인.
- 공개 재고 API 응답 `206`, 총 600건, 새 Pages origin에 대한 CORS 응답 확인.
- 실제 직원 계정 로그인·관리자 운영 권한 검증은 후속 인증 정상화 작업에서 사용자와 진행한다.
- 자동 재배포: 이 기록을 main에 반영한 뒤 대시보드에서 결과 확인 예정.
- 도메인 구매·연결은 대표 승인 후 마지막 작업. 기존 서비스 종료나 DNS 변경은 수행하지 않음.
