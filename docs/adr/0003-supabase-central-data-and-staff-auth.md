---
status: accepted
---

# Supabase로 운영 데이터와 직원 인증을 중앙 관리한다

카툰플러스는 Cloudflare Pages에서 도메인 비용 외 개발·시범 운영의 월 고정비 0원을 유지한다. 여러 고객·직원 기기에서 도서 재고, 입고 신청, 게임, 이벤트, 예약 방송과 직원 계정을 같은 데이터로 관리해야 하므로 Supabase의 PostgreSQL, Auth, Storage, Row Level Security를 채택한다. 고객은 선택 지점의 공개 정보만 읽고, 승인된 일반 직원은 소속 지점 운영 정보를 관리하며, 관리자는 전체 지점과 직원 계정 승인·비활성화를 관리한다. 지점 URL과 권한 경계는 ADR-0005를 따른다.
