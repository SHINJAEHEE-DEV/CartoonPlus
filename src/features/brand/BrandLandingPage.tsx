import { useState, useEffect } from 'react';
import { OFFICIAL_BRAND_ASSETS, STORE_PHOTOS_BY_SLUG } from '../../lib/brandAssets';
import { FranchiseInquiryModal } from './FranchiseInquiryModal';
import './brandLanding.css';

export function BrandLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form State for Inline Inquiry Box
  const [inlineForm, setInlineForm] = useState({
    name: '',
    phone: '',
    region: '서울',
    timing: '3개월 이내',
    message: '',
    agreed: true,
  });
  const [inlineSubmitted, setInlineSubmitted] = useState(false);
  const [inlineSubmitting, setInlineSubmitting] = useState(false);

  useEffect(() => {
    document.title = '카툰플러스 (CartoonPlus) 공식 사이트 | 프리미엄 복합문화 만화카페 & 가맹 안내';
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineForm.name.trim() || !inlineForm.phone.trim() || !inlineForm.agreed) return;

    setInlineSubmitting(true);
    try {
      const existing = JSON.parse(localStorage.getItem('cartoonplus_franchise_inquiries') || '[]');
      existing.push({
        ...inlineForm,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('cartoonplus_franchise_inquiries', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setInlineSubmitting(false);
      setInlineSubmitted(true);
    }, 350);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="brand-landing-page">
      {/* 1. Brand Header */}
      <header className="brand-header">
        <div className="brand-container brand-header-inner">
          <a
            href="/"
            className="brand-logo-wrap"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src={OFFICIAL_BRAND_ASSETS.logoRed}
              alt="카툰플러스 공식 브랜드 로고"
              className="brand-header-logo-img"
            />
          </a>

          <nav className="brand-nav" aria-label="브랜드 메인 네비게이션">
            <a
              href="#experience"
              className="brand-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('experience');
              }}
            >
              공간 경험
            </a>
            <a
              href="#stores"
              className="brand-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('stores');
              }}
            >
              지점 찾기
            </a>
            <a
              href="#franchise"
              className="brand-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('franchise');
              }}
            >
              가맹 안내
            </a>
            <a
              href="#inquiry"
              className="brand-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('inquiry');
              }}
            >
              창업 상담
            </a>
          </nav>

          <div className="brand-header-actions">
            <a href="/books" className="brand-btn-3d brand-btn-3d-outline">
              도서 검색 바로가기 ↗
            </a>
            <button
              type="button"
              className="brand-btn-3d brand-btn-3d-red"
              onClick={() => setIsModalOpen(true)}
            >
              가맹 상담 신청
            </button>
            <button
              type="button"
              className="brand-btn-3d brand-btn-3d-outline"
              style={{ display: 'none', padding: '8px 12px' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="모바일 메뉴"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '76px',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderBottom: '2px solid var(--brand-gray-200)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <a
              href="#experience"
              style={{ textDecoration: 'none', color: '#111827', fontWeight: 800, fontSize: '16px' }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('experience');
              }}
            >
              공간 경험
            </a>
            <a
              href="#stores"
              style={{ textDecoration: 'none', color: '#111827', fontWeight: 800, fontSize: '16px' }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('stores');
              }}
            >
              지점 찾기
            </a>
            <a
              href="#franchise"
              style={{ textDecoration: 'none', color: '#111827', fontWeight: 800, fontSize: '16px' }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('franchise');
              }}
            >
              가맹 안내
            </a>
            <a
              href="/books"
              style={{ textDecoration: 'none', color: 'var(--brand-red)', fontWeight: 800, fontSize: '16px' }}
            >
              도서 검색 바로가기 ↗
            </a>
          </div>
        )}
      </header>

      {/* 2. Hero Section (Duolingo Mascot Speech & Editorial Headline) */}
      <section className="brand-hero">
        <div className="brand-container brand-hero-inner">
          <div className="brand-hero-content">
            <div className="brand-hero-pill-badge">
              <span>★</span> 대한민국 프리미엄 복합문화 만화카페
            </div>
            <h1 className="brand-hero-title">
              만화, 게임, 그리고
              <br />
              <span className="brand-hero-title-red">제대로 쉬는 시간</span>
            </h1>
            <p className="brand-hero-desc">
              수만 권 서가, 프라이빗 암막 OTT 룸, 닌텐도 스위치·PS4 콘솔,
              100% 무료 바디프랜드 안마의자, 무제한 라면 바까지.
              온전히 나에게 집중하는 프리미엄 힐링 라운지 카툰플러스입니다.
            </p>
            <div className="brand-hero-actions">
              <button
                type="button"
                className="brand-btn-3d brand-btn-3d-red brand-hero-btn-main"
                onClick={() => scrollToSection('stores')}
              >
                가까운 지점 찾기 ↓
              </button>
              <button
                type="button"
                className="brand-btn-3d brand-btn-3d-yellow brand-hero-btn-main"
                onClick={() => setIsModalOpen(true)}
              >
                가맹 및 창업 상담 신청 →
              </button>
            </div>
          </div>

          <div className="brand-hero-mascot-area">
            <div className="brand-speech-bubble">
              카툰플러스에 온 걸 환영해! ☕✨
            </div>
            <img
              src={OFFICIAL_BRAND_ASSETS.toriBasic}
              alt="카툰플러스 시그니처 캐릭터 또리"
              className="brand-hero-tori-img"
            />
          </div>
        </div>
      </section>

      {/* 3. Marquee Ticker */}
      <div className="brand-marquee-bar" aria-hidden="true">
        <div className="brand-marquee-track">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} style={{ display: 'inline-flex' }}>
              <span className="brand-marquee-item">
                <span className="brand-marquee-dot">●</span> 50,000+권 만화 &amp; 인기 웹툰
              </span>
              <span className="brand-marquee-item">
                <span className="brand-marquee-dot">●</span> 프라이빗 암막 OTT 룸 (넷플릭스·티빙)
              </span>
              <span className="brand-marquee-item">
                <span className="brand-marquee-dot">●</span> 닌텐도 스위치 &amp; PS4 콘솔 및 보드게임
              </span>
              <span className="brand-marquee-item">
                <span className="brand-marquee-dot">●</span> 바디프랜드 전신 안마의자 100% 무료
              </span>
              <span className="brand-marquee-item">
                <span className="brand-marquee-dot">●</span> 무제한 토핑 즉석 한강 라면 바
              </span>
              <span className="brand-marquee-item">
                <span className="brand-marquee-dot">●</span> 홍대점 24시간 연중무휴 상시 운영
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Alternating Story Sections (Duolingo Style Rows with Tori Mascot) */}
      <section id="experience" className="brand-story-section">
        <div className="brand-container">
          <div className="brand-section-header">
            <span className="brand-section-tag">SPACES &amp; ENTERTAINMENT</span>
            <h2 className="brand-section-title">하루가 짧게 느껴지는 5대 공간 경험</h2>
            <p className="brand-section-desc">
              단순한 만화방을 넘어, 오감으로 누리는 프리미엄 문화 휴식 공간을 완성했습니다.
            </p>
          </div>

          {/* Row 1: Book Library (Tori Book) */}
          <div className="brand-story-row">
            <div className="brand-story-visual">
              <div className="brand-story-card-box">
                <img
                  src={OFFICIAL_BRAND_ASSETS.toriBook}
                  alt="책 읽는 캐릭터 또리"
                  className="brand-story-tori-character"
                />
              </div>
            </div>
            <div className="brand-story-content">
              <span className="brand-story-pill">수만 권 서가 &amp; 웹툰</span>
              <h3 className="brand-story-title">끝없이 펼쳐지는 만화의 세계</h3>
              <p className="brand-story-desc">
                최신 인기 웹툰 단행본부터 전설적인 명작 만화, 소설, 그래픽노블까지
                11개 표준 장르로 체계화된 서가 시스템을 갖추고 있습니다.
                매주 정기 신간 입고로 보고 싶었던 작품을 가장 먼저 만나보세요.
              </p>
              <div className="brand-story-perks">
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 주간 단위 인기 신간 자동 입고
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 초성 검색 지원으로 1초 만에 서가 위치 확인
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 원하는 도서 입고 신청 시스템 운영
                </div>
              </div>
              <a href="/books" className="brand-btn-3d brand-btn-3d-red">
                실시간 도서 검색하기 →
              </a>
            </div>
          </div>

          {/* Row 2: Private OTT Room (Reverse) */}
          <div className="brand-story-row brand-story-row-reverse">
            <div className="brand-story-visual">
              <div className="brand-story-card-box">
                <img
                  src={OFFICIAL_BRAND_ASSETS.toriRelax}
                  alt="휴식하는 캐릭터 또리"
                  className="brand-story-tori-character"
                />
              </div>
            </div>
            <div className="brand-story-content">
              <span className="brand-story-pill">암막 OTT 룸</span>
              <h3 className="brand-story-title">우리만의 프라이빗 영화관</h3>
              <p className="brand-story-desc">
                넷플릭스, 티빙, 디즈니+를 대형 스크린과 포근한 매트가 구비된 암막 굴방에서
                자유롭게 시청하세요. 외부 시선 걱정 없이 온전한 휴식을 누릴 수 있습니다.
              </p>
              <div className="brand-story-perks">
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> OTT 프리미엄 요금제 상시 지원 (무료)
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 대형 프로젝터 &amp; 고화질 모니터 완비
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 푹신한 매트와 프라이빗 암막 커튼 구조
                </div>
              </div>
              <button
                type="button"
                className="brand-btn-3d brand-btn-3d-yellow"
                onClick={() => scrollToSection('stores')}
              >
                지점별 룸 시설 보기 ↓
              </button>
            </div>
          </div>

          {/* Row 3: Gaming & Board Games (Tori Gaming) */}
          <div className="brand-story-row">
            <div className="brand-story-visual">
              <div className="brand-story-card-box">
                <img
                  src={OFFICIAL_BRAND_ASSETS.toriGaming}
                  alt="게임기 든 캐릭터 또리"
                  className="brand-story-tori-character"
                />
              </div>
            </div>
            <div className="brand-story-content">
              <span className="brand-story-pill">닌텐도 &amp; PS4 &amp; 보드게임</span>
              <h3 className="brand-story-title">친구, 연인과 함께하는 플레이</h3>
              <p className="brand-story-desc">
                마리오카트, 태고의 달인, 오버쿡드, 대난투 등 정품 닌텐도 스위치 팩과 PS4 타이틀,
                50여 종의 엄선된 보드게임이 준비되어 있습니다. 추가 비용 없이 무제한으로 즐기세요.
              </p>
              <div className="brand-story-perks">
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 인기 닌텐도 스위치 정품 타이틀 보유
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 1~4인 플레이 완벽 지원 콘솔 룸
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 스테디셀러 보드게임 50종 상시 비치
                </div>
              </div>
              <button
                type="button"
                className="brand-btn-3d brand-btn-3d-outline"
                onClick={() => scrollToSection('stores')}
              >
                구비 게임 목록 확인 →
              </button>
            </div>
          </div>

          {/* Row 4: 100% Free Massage Chair (Tori Pixel Relax - Reverse) */}
          <div className="brand-story-row brand-story-row-reverse">
            <div className="brand-story-visual">
              <div className="brand-story-card-box">
                <img
                  src={OFFICIAL_BRAND_ASSETS.toriPixelRelax}
                  alt="픽셀 휴식 또리"
                  className="brand-story-tori-character"
                />
              </div>
            </div>
            <div className="brand-story-content">
              <span className="brand-story-pill">바디프랜드 안마의자</span>
              <h3 className="brand-story-title">추가 요금 0원, 100% 무료 힐링 존</h3>
              <p className="brand-story-desc">
                타 브랜드처럼 코인을 넣거나 추가 요금을 낼 필요가 없습니다.
                매장 이용 고객이라면 누구나 최고급 바디프랜드 전신 안마의자를
                언제든 자유롭게 이용할 수 있습니다.
              </p>
              <div className="brand-story-perks">
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 바디프랜드 전신 안마의자 상시 무료 개방
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 지친 하루의 피로를 풀어주는 힐링 마사지
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 청결하게 관리되는 전용 일회용 덧신 제공
                </div>
              </div>
              <button
                type="button"
                className="brand-btn-3d brand-btn-3d-red"
                onClick={() => scrollToSection('stores')}
              >
                무료 힐링존 이용하기 →
              </button>
            </div>
          </div>

          {/* Row 5: Ramen & F&B Cafe (Tori Ramen) */}
          <div className="brand-story-row">
            <div className="brand-story-visual">
              <div className="brand-story-card-box">
                <img
                  src={OFFICIAL_BRAND_ASSETS.toriRamen}
                  alt="라면 먹는 캐릭터 또리"
                  className="brand-story-tori-character"
                />
              </div>
            </div>
            <div className="brand-story-content">
              <span className="brand-story-pill">한강 즉석 라면 &amp; 카페</span>
              <h3 className="brand-story-title">즉석 라면 셀프바와 맛있는 먹거리</h3>
              <p className="brand-story-desc">
                파, 떡, 어묵 등 풍성한 무제한 토핑을 곁들이는 즉석 한강 라면 조리기와
                바리스타급 커피, 스무디, 덮밥, 떡볶이 등 다채로운 F&amp;B 메뉴를
                합리적인 가격으로 즐기실 수 있습니다.
              </p>
              <div className="brand-story-perks">
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 자동 즉석 라면 조리 기계 &amp; 무제한 토핑
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 8대 표준 음료 (스페셜티 커피, 에이드, 스무디)
                </div>
                <div className="brand-story-perk-item">
                  <span className="brand-perk-icon">✓</span> 시간 + 음료 결합 실속 패키지 요금제
                </div>
              </div>
              <button
                type="button"
                className="brand-btn-3d brand-btn-3d-yellow"
                onClick={() => scrollToSection('stores')}
              >
                지점별 대표 메뉴 보기 →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Metrics & Numbers (Duolingo Quest Style) */}
      <section className="brand-metrics-section">
        <div className="brand-container">
          <div className="brand-metrics-grid">
            <div className="brand-metric-card">
              <div className="brand-metric-val">50,000+</div>
              <div className="brand-metric-title">보유 도서 및 웹툰</div>
              <div className="brand-metric-sub">주간 단위 신간 자동 입고</div>
            </div>
            <div className="brand-metric-card">
              <div className="brand-metric-val">100%</div>
              <div className="brand-metric-title">부대시설 무료 이용</div>
              <div className="brand-metric-sub">안마의자 · 게임팩 추가비 0원</div>
            </div>
            <div className="brand-metric-card">
              <div className="brand-metric-val">24H</div>
              <div className="brand-metric-title">연중무휴 매장 운영</div>
              <div className="brand-metric-sub">홍대점 24시간 연중무휴 상시 개방</div>
            </div>
            <div className="brand-metric-card">
              <div className="brand-metric-val">3개소</div>
              <div className="brand-metric-title">서울 핵심 거점 지점</div>
              <div className="brand-metric-sub">서울대입구 · 잠실 · 홍대 직영점</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Store Showcase Section */}
      <section id="stores" className="brand-stores-section">
        <div className="brand-container">
          <div className="brand-section-header">
            <span className="brand-section-tag">LOCATIONS</span>
            <h2 className="brand-section-title">가까운 카툰플러스 지점 찾기</h2>
            <p className="brand-section-desc">
              서울 주요 역세권에서 카툰플러스의 프리미엄 힐링 공간을 만나보세요.
            </p>
          </div>

          <div className="brand-stores-grid">
            {/* Store 1: SNU */}
            <div className="brand-store-card">
              <div className="brand-store-photo-wrap">
                <img
                  src={STORE_PHOTOS_BY_SLUG.snu.photo1}
                  alt="서울대입구역점 실물 사진"
                  className="brand-store-photo"
                />
                <span className="brand-store-badge">2호선 역세권 도보 1분</span>
              </div>
              <div className="brand-store-body">
                <h3 className="brand-store-name">서울대입구역점</h3>
                <ul className="brand-store-info-list">
                  <li>
                    <strong>위치</strong> 서울 관악구 관악로 164 대우디오슈페리움 2단지 B1
                  </li>
                  <li>
                    <strong>교통</strong> 2호선 서울대입구역 3번 출구 도보 1분
                  </li>
                  <li>
                    <strong>시간</strong> 매일 10:00 – 23:00 (연중무휴)
                  </li>
                  <li>
                    <strong>시설</strong> 암막 OTT룸 · 바디프랜드 안마의자 · 즉석 라면바
                  </li>
                </ul>
                <div className="brand-store-actions">
                  <a href="/stores/snu" className="brand-btn-3d brand-btn-3d-red">
                    도서 검색 &amp; 지점 방문 →
                  </a>
                  <a href="/stores/snu/menu" className="brand-btn-3d brand-btn-3d-outline">
                    메뉴
                  </a>
                </div>
              </div>
            </div>

            {/* Store 2: Jamsil */}
            <div className="brand-store-card">
              <div className="brand-store-photo-wrap">
                <img
                  src={STORE_PHOTOS_BY_SLUG.jamsil.photo1}
                  alt="잠실점 실물 사진"
                  className="brand-store-photo"
                />
                <span className="brand-store-badge">평일/주말 24시 연장영업</span>
              </div>
              <div className="brand-store-body">
                <h3 className="brand-store-name">잠실점</h3>
                <ul className="brand-store-info-list">
                  <li>
                    <strong>위치</strong> 서울 송파구 백제고분로9길 23 2층 (잠실동)
                  </li>
                  <li>
                    <strong>교통</strong> 2호선 잠실새내역 4번 출구 도보 5분
                  </li>
                  <li>
                    <strong>시간</strong> 평일/주말 24시 연장영업 운영
                  </li>
                  <li>
                    <strong>시설</strong> 닌텐도 스위치 실측 보유 · 프라이빗 룸 완비
                  </li>
                </ul>
                <div className="brand-store-actions">
                  <a href="/stores/jamsil" className="brand-btn-3d brand-btn-3d-red">
                    도서 검색 &amp; 지점 방문 →
                  </a>
                  <a href="/stores/jamsil/menu" className="brand-btn-3d brand-btn-3d-outline">
                    메뉴
                  </a>
                </div>
              </div>
            </div>

            {/* Store 3: Hongdae */}
            <div className="brand-store-card">
              <div className="brand-store-photo-wrap">
                <img
                  src={STORE_PHOTOS_BY_SLUG.hongdae.photo1}
                  alt="홍대점 실물 사진"
                  className="brand-store-photo"
                />
                <span className="brand-store-badge">24시간 연중무휴 상시개방</span>
              </div>
              <div className="brand-store-body">
                <h3 className="brand-store-name">홍대점</h3>
                <ul className="brand-store-info-list">
                  <li>
                    <strong>위치</strong> 서울 마포구 홍익로6길 10 유니온빌딩 4층
                  </li>
                  <li>
                    <strong>교통</strong> 2호선 홍대입구역 9번 출구 도보 5분
                  </li>
                  <li>
                    <strong>시간</strong> 24시간 연중무휴 (밤샘 이용 환영)
                  </li>
                  <li>
                    <strong>시설</strong> 감각적인 굴방 좌석 · 보드게임 존 · F&amp;B 카페
                  </li>
                </ul>
                <div className="brand-store-actions">
                  <a href="/stores/hongdae" className="brand-btn-3d brand-btn-3d-red">
                    도서 검색 &amp; 지점 방문 →
                  </a>
                  <a href="/stores/hongdae/menu" className="brand-btn-3d brand-btn-3d-outline">
                    메뉴
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Franchise & Business Section (B2B) */}
      <section id="franchise" className="brand-franchise-section">
        <div className="brand-container">
          <div className="brand-section-header">
            <span className="brand-section-tag">FRANCHISE &amp; PARTNERSHIP</span>
            <h2 className="brand-section-title">카툰플러스 창업 경쟁력</h2>
            <p className="brand-section-desc">
              고객 체류 시간과 객단가를 동시에 높이는 검증된 비즈니스 모델로 안정적인 수익을 만듭니다.
            </p>
          </div>

          <div className="brand-franchise-grid">
            <div className="brand-franchise-card">
              <div className="brand-franchise-icon">📈</div>
              <h3 className="brand-franchise-card-title">다중 매출 복합 수익</h3>
              <p className="brand-franchise-card-desc">
                시간제 이용 요금과 고마진 F&amp;B 카페테리아(한강라면, 스낵, 음료)의 복합 수익 구조로
                테이블 회전율에 얽매이지 않고 높은 객단가를 달성합니다.
              </p>
            </div>
            <div className="brand-franchise-card">
              <div className="brand-franchise-icon">⚡</div>
              <h3 className="brand-franchise-card-title">운영 자동화 시스템</h3>
              <p className="brand-franchise-card-desc">
                초성 도서 검색 솔루션, 키오스크 무인 결제, 자동 매장 안내방송 시스템을 적용하여
                최소한의 인력으로 쾌적한 매장 운영이 가능합니다.
              </p>
            </div>
            <div className="brand-franchise-card">
              <div className="brand-franchise-icon">🤝</div>
              <h3 className="brand-franchise-card-title">본사 밀착 슈퍼바이징</h3>
              <p className="brand-franchise-card-desc">
                상권 분석부터 점포 개발, 인테리어 설계, 점주 실무 교육, 오픈 후 신간 도서 자동 배송 및
                마케팅 프로모션까지 본사 전담팀이 함께합니다.
              </p>
            </div>
          </div>

          {/* Inline Franchise Inquiry Box */}
          <div id="inquiry" className="brand-inquiry-box">
            {inlineSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>☕✨</div>
                <h3 className="brand-inquiry-title">가맹 상담 신청이 접수되었습니다!</h3>
                <p className="brand-inquiry-desc" style={{ marginBottom: '24px' }}>
                  입력해 주신 연락처(<strong>{inlineForm.phone}</strong>)로 본사 가맹 담당자가
                  창업 가이드북 및 상권 분석 자료와 함께 빠르게 연락드리겠습니다.
                </p>
                <button
                  type="button"
                  className="brand-btn-3d brand-btn-3d-red"
                  style={{ margin: '0 auto' }}
                  onClick={() => setInlineSubmitted(false)}
                >
                  추가 문의 작성하기
                </button>
              </div>
            ) : (
              <>
                <div className="brand-inquiry-header">
                  <h3 className="brand-inquiry-title">가맹 및 창업 상담 신청</h3>
                  <p className="brand-inquiry-desc">
                    창업 희망 지역과 연락처를 남겨주시면 예상 창업 비용 및 수익 분석서를 무료로 안내해 드립니다.
                  </p>
                </div>

                <form onSubmit={handleInlineSubmit}>
                  <div className="brand-form-grid">
                    <div className="brand-form-group">
                      <label className="brand-form-label" htmlFor="inline-name">
                        성함 <span>*</span>
                      </label>
                      <input
                        id="inline-name"
                        type="text"
                        required
                        className="brand-form-input"
                        placeholder="홍길동"
                        value={inlineForm.name}
                        onChange={(e) => setInlineForm({ ...inlineForm, name: e.target.value })}
                      />
                    </div>

                    <div className="brand-form-group">
                      <label className="brand-form-label" htmlFor="inline-phone">
                        연락처 <span>*</span>
                      </label>
                      <input
                        id="inline-phone"
                        type="tel"
                        required
                        className="brand-form-input"
                        placeholder="010-0000-0000"
                        value={inlineForm.phone}
                        onChange={(e) => setInlineForm({ ...inlineForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="brand-form-group">
                      <label className="brand-form-label" htmlFor="inline-region">
                        창업 희망 지역
                      </label>
                      <select
                        id="inline-region"
                        className="brand-form-select"
                        value={inlineForm.region}
                        onChange={(e) => setInlineForm({ ...inlineForm, region: e.target.value })}
                      >
                        <option value="서울">서울</option>
                        <option value="경기/인천">경기 / 인천</option>
                        <option value="대전/충청">대전 / 충청</option>
                        <option value="부산/경남">부산 / 경남</option>
                        <option value="대구/경북">대구 / 경북</option>
                        <option value="광주/전라">광주 / 전라</option>
                        <option value="기타">기타 지역</option>
                      </select>
                    </div>

                    <div className="brand-form-group">
                      <label className="brand-form-label" htmlFor="inline-timing">
                        희망 창업 시기
                      </label>
                      <select
                        id="inline-timing"
                        className="brand-form-select"
                        value={inlineForm.timing}
                        onChange={(e) => setInlineForm({ ...inlineForm, timing: e.target.value })}
                      >
                        <option value="즉시">즉시 가능</option>
                        <option value="3개월 이내">3개월 이내</option>
                        <option value="6개월 이내">6개월 이내</option>
                        <option value="올해 하반기">올해 하반기</option>
                        <option value="시장조사 중">시장 조사 중</option>
                      </select>
                    </div>

                    <div className="brand-form-group brand-form-group-full">
                      <label className="brand-form-label" htmlFor="inline-message">
                        문의 사항 (선택)
                      </label>
                      <textarea
                        id="inline-message"
                        className="brand-form-textarea"
                        placeholder="희망 면적, 점포 유무, 창업 준비 자금 등 궁금하신 사항을 자유롭게 남겨주세요."
                        value={inlineForm.message}
                        onChange={(e) => setInlineForm({ ...inlineForm, message: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="brand-form-terms">
                    <label className="brand-checkbox-label">
                      <input
                        type="checkbox"
                        checked={inlineForm.agreed}
                        onChange={(e) => setInlineForm({ ...inlineForm, agreed: e.target.checked })}
                        required
                      />
                      <span>개인정보 수집 및 가맹 상담 안내를 위한 연락에 동의합니다. (필수)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="brand-btn-3d brand-btn-3d-red brand-form-submit-btn"
                    disabled={inlineSubmitting || !inlineForm.name || !inlineForm.phone || !inlineForm.agreed}
                  >
                    {inlineSubmitting ? '접수 처리 중...' : '가맹 상담 신청하기'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 8. Brand Footer */}
      <footer className="brand-footer">
        <div className="brand-container">
          <div className="brand-footer-top">
            <div>
              <div className="brand-footer-brand-title">
                <img
                  src={OFFICIAL_BRAND_ASSETS.logoBlackTori}
                  alt="카툰플러스 공식 로고"
                  className="brand-footer-logo-img"
                />
              </div>
              <p className="brand-footer-brand-desc">
                만화, 게임, 그리고 제대로 쉬는 시간.
                <br />
                복합 문화 휴식 공간 카툰플러스 공식 브랜드 사이트입니다.
              </p>
              <div style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.8' }}>
                <div>가맹 및 사업 제휴 문의: contact@cartoonplus.co.kr</div>
                <div>대표 상담 전화: 02-882-9600</div>
              </div>
            </div>

            <div>
              <div className="brand-footer-col-title">지점 바로가기</div>
              <ul className="brand-footer-links">
                <li>
                  <a href="/stores/snu">서울대입구역점 (도서 검색)</a>
                </li>
                <li>
                  <a href="/stores/jamsil">잠실점 (도서 검색)</a>
                </li>
                <li>
                  <a href="/stores/hongdae">홍대점 (도서 검색)</a>
                </li>
                <li>
                  <a href="/books">전체 도서 검색</a>
                </li>
              </ul>
            </div>

            <div>
              <div className="brand-footer-col-title">공간 및 서비스</div>
              <ul className="brand-footer-links">
                <li>
                  <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>공간 경험 안내</a>
                </li>
                <li>
                  <a href="#stores" onClick={(e) => { e.preventDefault(); scrollToSection('stores'); }}>가까운 지점 찾기</a>
                </li>
                <li>
                  <a href="#franchise" onClick={(e) => { e.preventDefault(); scrollToSection('franchise'); }}>가맹 및 창업 안내</a>
                </li>
                <li>
                  <a href="/staff">직원 콘솔 로그인</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="brand-footer-bottom">
            <div>© {new Date().getFullYear()} CartoonPlus. All rights reserved.</div>
            <div>프리미엄 복합문화 만화카페 카툰플러스</div>
          </div>
        </div>
      </footer>

      {/* Franchise Modal */}
      <FranchiseInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
