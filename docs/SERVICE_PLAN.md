# 카툰플러스 (CartoonPlus Cafe) 서비스 기획 안내

> 📌 **안내**: 카툰플러스의 모든 제품 및 서비스 기획 내용은 **단일 기준 문서(Single Source of Truth)**인 **[PRD.md](./PRD.md)**로 통합되어 일원화 관리됩니다.

최신 기획 및 제품 요구사항 정의는 아래 문서를 참고해 주시기 바랍니다:

- 📄 [**카툰플러스 제품 요구사항 정의서 (PRD.md)**](./PRD.md)
- 📝 [**요구사항 명세서 (REQUIREMENTS.md)**](./REQUIREMENTS.md)
- 🗄️ [**데이터 모델링 (DATA_MODEL.md)**](./DATA_MODEL.md)
- 🏛️ [**기술 결정 내역 (TECHNOLOGY_DECISIONS.md)**](./TECHNOLOGY_DECISIONS.md)
- 🧩 [**기능 명세 색인**](./FUNCTIONAL_SPECIFICATIONS.md)

다지점 전환의 기준은 ADR-0005 및 ADR-0006을 따릅니다. 현재 서울대입구역점(`snu`), 잠실점(`jamsil`), 홍대점(`hongdae`) 3개 지점의 URL 기반 지점 선택(`/stores/:slug`), 도서 재고 CSV 임포트, 메뉴/이벤트/게임 격리, SSG 정적 사전 생성이 전면 구현 및 검증되어 정상 운영 중입니다.
