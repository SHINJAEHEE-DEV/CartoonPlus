import { useEffect, useRef, useState, type ReactNode, type SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';
import { MASCOT_ASSETS, OFFICIAL_BRAND_ASSETS } from '../../lib/brandAssets';
import './brandLanding.css';

// Lightweight inline SVG icons to prevent external dependency bloat
function IconBase({
  children,
  size = 18,
  strokeWidth = 2,
  ...props
}: {
  size?: number | string;
  strokeWidth?: number | string;
  children: ReactNode;
} & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

const ArrowUpRight = (props: IconProps) => (
  <IconBase {...props}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></IconBase>
);
const X = (props: IconProps) => (
  <IconBase {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></IconBase>
);
const Menu = (props: IconProps) => (
  <IconBase {...props}><path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h16" /></IconBase>
);
const Instagram = (props: IconProps) => (
  <IconBase {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></IconBase>
);

type InquiryType = 'franchise' | 'partnership' | 'store';

const HERO_CAFE_IMAGES = [
  '/assets/brand/hero_cafe_1.jpeg',
  '/assets/brand/hero_cafe_2.jpeg',
  '/assets/brand/hero_cafe_3.jpeg',
];

const HERO_BOOK_IMAGES = [
  '/assets/brand/hero_book_1.jpg',
  '/assets/brand/hero_book_2.jpg',
];

const CAFE_EXPERIENCES = [
  {
    id: 'read',
    keyword: 'READ',
    title: '45,000권 만화 · 웹툰 아카이브',
    desc: '홍대점 기준 45,000여 권의 최신 인기작과 스테디셀러 명작 만화 컬렉션 완비.',
    badge: 'READ · 45,000+ BOOKS',
    image: '/assets/brand/exp_cafe_manga.jpg',
  },
  {
    id: 'watch',
    keyword: 'WATCH',
    title: '전 좌석 스마트 모니터 & OTT',
    desc: '넷플릭스, 디즈니+, 티빙 등 인기 OTT 콘텐츠를 아늑한 프라이빗 룸에서 감상.',
    badge: 'WATCH · PRIVATE OTT',
    image: '/assets/brand/exp_cafe_ott.jpg',
  },
  {
    id: 'play',
    keyword: 'PLAY',
    title: '닌텐도 스위치 & 보드게임 50종+',
    desc: '마리오 카트, 파티 게임 등 인기 콘솔 타이틀과 50여 종의 보드게임 무료 대여.',
    badge: 'PLAY · NINTENDO & BOARDGAME',
    image: '/assets/brand/exp_cafe_play.jpg',
  },
  {
    id: 'eat',
    keyword: 'EAT',
    title: '즉석 라면 조리기 & 카페테리아',
    desc: '한강식 즉석 라면과 볶음밥, 간식, 바리스타 커피 및 시그니처 에이드 라인업.',
    badge: 'EAT · K-RAMEN & CAFE',
    image: '/assets/brand/exp_cafe_eat.jpg',
  },
  {
    id: 'relax',
    keyword: 'RELAX',
    title: '프라이빗 소굴방 · 리클라이너 · 힐링존',
    desc: '아늑한 토굴방과 빈백 리클라이너, 전신 안마의자에서 온전한 휴식을 누리는 공간.',
    badge: 'RELAX · COZY CAVE & HEALING',
    image: '/assets/brand/exp_cafe_relax.jpg',
  },
];

const BOOKSTORE_EXPERIENCES = [
  {
    id: 'shelf',
    keyword: '홍대 직영 매장',
    title: '홍대 플래그십 오프라인 판매점',
    desc: '홍대 매장에서 직접 운영하는 오프라인 중고만화 판매점으로, 실물 도서를 직접 확인하고 현장 구매할 수 있습니다.',
    badge: '홍대 오프라인 판매점',
    image: '/assets/brand/exp_book_shelf.jpg',
  },
  {
    id: 'collection',
    keyword: '135,000권 보유',
    title: '135,000권 단행본 · 완결 세트',
    desc: '절판 명작과 인기 단행본부터 최신 완결 세트까지 총 135,000여 권 규모의 중고만화 컬렉션을 취급합니다.',
    badge: '총 135,000권 규모',
    image: '/assets/brand/exp_book_collection.jpg',
  },
  {
    id: 'quality',
    keyword: '실물 품질 검수',
    title: '철저한 권별 실물 상태 검수',
    desc: '매장 전문 인력이 권별 변색, 오염, 파손 여부를 직접 확인하고 세트 구성과 보관 상태를 관리합니다.',
    badge: '권별 실물 상태 검수',
    image: '/assets/brand/exp_book_quality.jpg?v=2',
  },
  {
    id: 'sync',
    keyword: '현장 · 온라인 연동',
    title: '현장 구매 & 온라인 실시간 연동',
    desc: '홍대 오프라인 판매점 현장 구매와 온라인 쇼핑몰(bookis.store)의 재고와 가격이 동일하게 연동됩니다.',
    badge: '온·오프라인 동일 연동',
    image: '/assets/brand/exp_book_store.jpg',
  },
];

type ModalProps = {
  type: InquiryType;
  onClose: () => void;
};

type Store = {
  name: string;
  slug: string;
  english: string;
  number: string;
  description: string;
  details: string[];
  images: string[];
  mapLabel: string;
};

const stores: Store[] = [
  {
    name: '홍대점',
    slug: 'hongdae',
    english: 'HONGDAE 24H',
    number: '01',
    description: '45,000권 도서와 닌텐도 20대를 보유한 24시간 플래그십.',
    details: ['홍대점 한정 45,000권 도서', '24시간 연중무휴 운영', '닌텐도 스위치 20대 완비', '개인 프라이빗 룸'],
    images: HERO_CAFE_IMAGES,
    mapLabel: '홍익몰 B1',
  },
  {
    name: '서울대입구역점',
    slug: 'snu',
    english: 'SNU STATION',
    number: '02',
    description: '대형 서가와 조용한 독립 룸이 있는 편안한 아지트.',
    details: ['서울대입구역 2번 출구 관악로 164', '대형 서가 & 독립 힐링존', '매일 10:00~24:00 운영'],
    images: [
      '/assets/brand_new/서울대입구/KakaoTalk_Photo_2026-11-02-14-24-25 001.jpeg',
      '/assets/brand_new/서울대입구/KakaoTalk_Photo_2026-11-02-14-24-25 002.jpeg',
      '/assets/brand_new/서울대입구/KakaoTalk_Photo_2026-11-02-14-24-26 009.jpeg',
    ],
    mapLabel: '관악로 164',
  },
  {
    name: '잠실점',
    slug: 'jamsil',
    english: 'JAMSIL',
    number: '03',
    description: '도심 속에서 둘이 함께 쉬어 가는 아늑한 공간.',
    details: ['잠실새내역 4번 출구 인근', '넓고 쾌적한 2층 전층', '리클라이너 소파 & 보드게임'],
    images: [
      '/assets/brand_new/잠실/KakaoTalk_Photo_2026-11-02-14-23-49 001.jpeg',
      '/assets/brand_new/잠실/KakaoTalk_Photo_2026-11-02-14-23-49 002.jpeg',
      '/assets/brand_new/잠실/KakaoTalk_Photo_2026-11-02-14-23-50 009.jpeg',
    ],
    mapLabel: '잠실새내역 4번출구',
  },
  {
    name: '사당점',
    slug: 'sadang',
    english: 'SADANG',
    number: '04',
    description: '편안한 리클라이너 좌석과 체류형 쉼터.',
    details: ['사당역 5번 출구 인근', '아늑한 서가 및 체류 공간', '매일 10:00~24:00 운영'],
    images: [
      '/assets/brand_new/사당/KakaoTalk_Photo_2026-11-02-14-24-41 001.jpeg',
      '/assets/brand_new/사당/KakaoTalk_Photo_2026-11-02-14-24-41 002.jpeg',
      '/assets/brand_new/사당/KakaoTalk_Photo_2026-11-02-14-24-41 003.jpeg',
    ],
    mapLabel: '사당역 5번출구',
  },
];

const pageSections = [
  { id: 'top', label: '처음' },
  { id: 'three-j', label: '3J 철학' },
  { id: 'experience', label: '두 가지 경험' },
  { id: 'stores', label: '지점 & 도서 취급' },
  { id: 'loop', label: '매장 현황' },
  { id: 'franchise', label: '가맹 안내' },
  { id: 'vision', label: 'GLOBAL 2035' },
];

function useReveal() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

export function BrandLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<InquiryType | null>(null);
  const [activeSection, setActiveSection] = useState('top');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [heroCafeBgIndex, setHeroCafeBgIndex] = useState(0);
  const [heroBookBgIndex, setHeroBookBgIndex] = useState(0);
  const [cafeExpIndex, setCafeExpIndex] = useState(0);
  const [bookExpIndex, setBookExpIndex] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  useReveal();

  // 만화카페(좌측) 배경 이미지 3장 자동 순환 (4.5초 간격 크로스페이드)
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroCafeBgIndex((prev) => (prev + 1) % HERO_CAFE_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // 중고만화책(우측) 배경 이미지 2장 자동 순환 (5.0초 간격 크로스페이드)
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroBookBgIndex((prev) => (prev + 1) % HERO_BOOK_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 3번째 섹션: 만화카페 5대 경험 키워드 자동 슬라이드 (3.8초 간격)
  useEffect(() => {
    const timer = setInterval(() => {
      setCafeExpIndex((prev) => (prev + 1) % CAFE_EXPERIENCES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // 3번째 섹션: 중고만화책방 4대 특징 자동 슬라이드 (4.2초 간격)
  useEffect(() => {
    const timer = setInterval(() => {
      setBookExpIndex((prev) => (prev + 1) % BOOKSTORE_EXPERIENCES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      if (window.innerWidth <= 820) {
        if (mainRef.current) {
          const { scrollLeft, clientWidth } = mainRef.current;
          if (clientWidth > 0) {
            const idx = Math.min(
              pageSections.length - 1,
              Math.max(0, Math.round(scrollLeft / clientWidth))
            );
            setCurrentSlideIndex(idx);
            setActiveSection(pageSections[idx]?.id ?? 'top');
          }
        }
        return;
      }
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--brand-scroll-progress', `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`);
      const marker = window.scrollY + window.innerHeight * 0.38;
      const current = [...pageSections].reverse().find(({ id }) => {
        const section = document.getElementById(id);
        return section && section.offsetTop <= marker;
      });
      if (current) {
        setActiveSection(current.id);
        const idx = pageSections.findIndex((s) => s.id === current.id);
        if (idx !== -1) setCurrentSlideIndex(idx);
      }
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      document.documentElement.style.removeProperty('--brand-scroll-progress');
    };
  }, []);

  useEffect(() => {
    document.title = '카툰플러스 (CARTOON PLUS) 공식 브랜드 사이트 | 복합문화 만화카페 & 가맹 안내';
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      // ignore
    }
  }, []);

  const handleMainScroll = () => {
    if (!mainRef.current) return;
    const { scrollLeft, clientWidth } = mainRef.current;
    if (clientWidth > 0) {
      const idx = Math.min(
        pageSections.length - 1,
        Math.max(0, Math.round(scrollLeft / clientWidth))
      );
      setCurrentSlideIndex(idx);
      const sec = pageSections[idx];
      if (sec) {
        setActiveSection(sec.id);
      }
    }
  };

  const jumpToSlide = (idx: number) => {
    if (idx < 0 || idx >= pageSections.length) return;
    setCurrentSlideIndex(idx);
    setActiveSection(pageSections[idx].id);
    if (window.innerWidth <= 820 && mainRef.current) {
      mainRef.current.scrollTo({
        left: idx * mainRef.current.clientWidth,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    } else {
      const sec = pageSections[idx];
      if (sec) {
        document.getElementById(sec.id)?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      }
    }
  };

  // 마누스 zip 구현 원형: 휠 스크롤 시 실시간 뷰포트 위치(getBoundingClientRect) 기반 섹션 점프
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (window.innerWidth <= 820 || modal !== null || Math.abs(event.deltaY) < 20) return;
      if ((event.target as HTMLElement)?.closest('a, button, input, select, textarea')) return;

      const sectionElements = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
      if (sectionElements.length === 0) return;

      const current = sectionElements.findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= -window.innerHeight * 0.35 && rect.top <= window.innerHeight * 0.35;
      });
      if (current === -1) return;

      const next = event.deltaY > 0 ? Math.min(current + 1, sectionElements.length - 1) : Math.max(current - 1, 0);
      if (next === current) return;

      event.preventDefault();
      const targetSec = sectionElements[next];
      if (targetSec) {
        targetSec.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
        const key = targetSec.getAttribute('data-section');
        if (key) {
          setActiveSection(key);
          const idx = pageSections.findIndex((s) => s.id === key);
          if (idx !== -1) setCurrentSlideIndex(idx);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth <= 820 || modal !== null) return;
      const sectionElements = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
      if (sectionElements.length === 0) return;
      const current = sectionElements.findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= -window.innerHeight * 0.35 && rect.top <= window.innerHeight * 0.35;
      });
      if (current === -1) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (current < sectionElements.length - 1) {
          e.preventDefault();
          sectionElements[current + 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (current > 0) {
          e.preventDefault();
          sectionElements[current - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modal]);

  // 마누스 zip 구현 원형: IntersectionObserver를 통한 활성 섹션 및 우측 레일 동기화
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const sectionElements = document.querySelectorAll<HTMLElement>('[data-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const key = entry.target.getAttribute('data-section');
          if (key) {
            setActiveSection(key);
            const idx = pageSections.findIndex((s) => s.id === key);
            if (idx !== -1) setCurrentSlideIndex(idx);
          }
        });
      },
      { threshold: 0.25 }
    );
    sectionElements.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const jump = (id: string) => {
    setMenuOpen(false);
    const idx = pageSections.findIndex((s) => s.id === id);
    if (idx !== -1) {
      jumpToSlide(idx);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  };

  return (
    <div className="app-shell">
      <nav className="brand-progress" aria-label="페이지 섹션 이동">
        <span className="brand-progress-track" aria-hidden="true"><span /></span>
        {pageSections.map((section) => (
          <button key={section.id} type="button" className={activeSection === section.id ? 'active' : ''}
            aria-label={section.label} aria-current={activeSection === section.id ? 'location' : undefined}
            onClick={() => jump(section.id)}>
            <span className="brand-progress-label">{section.label}</span><span className="brand-progress-dot" />
          </button>
        ))}
      </nav>
      {/* Header */}
      <header className="site-header">
        <a
          href="/"
          className="brand-lockup"
          onClick={(e) => {
            e.preventDefault();
            try {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch {
              // ignore
            }
          }}
          aria-label="CARTOON PLUS 홈"
        >
          <span className="header-wordmark">
            CARTOON<em>+</em>
          </span>
        </a>

        <div className={`nav-panel ${menuOpen ? 'nav-panel-open' : ''}`}>
          <nav className="main-nav" aria-label="주요 메뉴">
            <button type="button" onClick={() => jump('three-j')}>
              3J 철학
            </button>
            <button type="button" onClick={() => jump('experience')}>
              두 가지 경험
            </button>
            <button type="button" onClick={() => jump('stores')}>
              지점 안내
            </button>
            <button type="button" onClick={() => jump('network')}>
              도서 유통
            </button>
            <button type="button" onClick={() => jump('vision')}>
              GLOBAL 2035
            </button>
          </nav>
          <button
            type="button"
            className="header-cta"
            onClick={() => setModal('franchise')}
            aria-label="가맹 및 창업 상담 신청"
          >
            가맹 및 창업 상담 신청 <ArrowUpRight size={15} />
          </button>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="landing-main" onScroll={handleMainScroll}>
        {/* 1. Hero Section (50:50 Dual Track) */}
        <section className="hero-split-section" id="top" data-section="top">
          {/* Left: 만화카페 (오프라인) */}
          <article className="hero-half hero-half-cafe">
            {/* Background Slideshow (홍대점 실제 매장 사진 3장 + 연한 검은색 오버레이) */}
            <div className="hero-cafe-bg-slider" aria-hidden="true">
              {HERO_CAFE_IMAGES.map((imgSrc, idx) => (
                <div
                  key={imgSrc}
                  className={`hero-cafe-bg-slide ${idx === heroCafeBgIndex ? 'is-active' : ''}`}
                  style={{ backgroundImage: `url("${imgSrc}")` }}
                />
              ))}
              <div className="hero-cafe-bg-overlay" />
            </div>

            <div className="hero-content-wrap">
              <p className="hero-half-eyebrow">01 / OFFLINE SPACE</p>
              <div className="hero-heading-block">
                <div className="hero-keyword-wrap">
                  <span className="hero-keyword-badge hero-keyword-cafe">만화카페</span>
                </div>
                <h1>
                  만화 그 이상의 <em>즐거움</em>,<br />
                  공간의 가치를 더하다.
                </h1>
              </div>
              <p className="hero-half-lede">
                신발을 벗고 머무는 아늑한 아지트.<br />
                지점별 안내를 확인하고 나에게 맞는 쉼의 공간을 찾아보세요.
              </p>
              <div className="hero-half-meta">
                <span className="hero-meta-label">홍대점 기준</span>
                <b className="hero-meta-value">최대 45,000권</b>
              </div>
              <button
                type="button"
                className="hero-action-btn hero-action-btn-cafe"
                onClick={() => jump('stores')}
              >
                만화카페 둘러보기 <span>↓</span>
              </button>
            </div>
          </article>

          {/* Right: 중고만화책 쇼핑몰 (온라인) */}
          <article className="hero-half hero-half-book">
            {/* Background Slideshow (슬램덩크 / 원피스 일러스트 + 톤다운 오버레이) */}
            <div className="hero-book-bg-slider" aria-hidden="true">
              {HERO_BOOK_IMAGES.map((imgSrc, idx) => (
                <div
                  key={imgSrc}
                  className={`hero-book-bg-slide ${idx === heroBookBgIndex ? 'is-active' : ''}`}
                  style={{ backgroundImage: `url("${imgSrc}")` }}
                />
              ))}
              <div className="hero-book-bg-overlay" />
            </div>

            <div className="hero-content-wrap">
              <p className="hero-half-eyebrow">02 / ONLINE DISCOVERY</p>
              <div className="hero-heading-block">
                <div className="hero-keyword-wrap">
                  <span className="hero-keyword-badge hero-keyword-book">중고만화책 쇼핑몰</span>
                </div>
                <h1>
                  당신의 인생 만화를<br />
                  <em>다시 만나다.</em>
                </h1>
              </div>
              <p className="hero-half-lede">
                직접 보유 도서와 위탁 도서 네트워크를 바탕으로,<br />
                다시 읽고 싶은 작품을 온라인에서 찾아보세요.
              </p>
              <div className="hero-half-meta">
                <span className="hero-meta-label">전체 보유 네트워크</span>
                <b className="hero-meta-value">총 135,000권</b>
              </div>
              <a
                className="hero-action-btn hero-action-btn-book"
                href="https://bookis.store/cartoon"
                target="_blank"
                rel="noreferrer"
              >
                중고만화책 쇼핑하기 <span>↗</span>
              </a>
            </div>
          </article>

          {/* Center Badge (새로운 또리 이미지: 책 읽는 또리) */}
          <div className="hero-center-badge" aria-label="책 읽는 또리 마스코트">
            <img src="/assets/mascot/mascot_reading.png" alt="책 읽는 또리" />
          </div>
        </section>

        {/* 2. 3J Philosophy Section (Full Width Common) */}
        <section className="threej-section" id="three-j" data-section="three-j">
          <div className="threej-inner">
            <div className="threej-header" data-reveal>
              <p className="eyebrow">03 / THE 3J PHILOSOPHY</p>
              <h2>
                좋은 경험은<br />
                <span>자유와 자율</span>에서 시작됩니다.
              </h2>
              <p>두 핵심 사업에 공통으로 적용되는 카툰플러스의 운영 방향입니다.</p>
            </div>

            <div className="threej-grid" data-reveal>
              <article className="j-card j-card-yellow" data-reveal data-reveal-delay="1">
                <div className="j-card-top">
                  <span className="j-card-num">01 / FREEDOM</span>
                  <span className="j-card-symbol">↗</span>
                </div>
                <h3>고객에게<br />자유를</h3>
                <p>
                  편리한 매장 이용 안내와 방해 없는 체류 환경.<br />
                  누구의 눈치도 보지 않고 온전히 머무는 복합문화공간을 만듭니다.
                </p>
              </article>

              <article className="j-card j-card-red" data-reveal data-reveal-delay="2">
                <div className="j-card-top">
                  <span className="j-card-num">02 / AUTONOMY</span>
                  <span className="j-card-symbol">↗</span>
                </div>
                <h3>직원에게<br />자율을</h3>
                <p>
                  주도적인 서비스 개선과 쾌적한 근무 환경.<br />
                  직원이 편안해야 방문하는 고객도 편안하게 머물 수 있습니다.
                </p>
              </article>

              <article className="j-card j-card-white" data-reveal data-reveal-delay="3">
                <div className="j-card-top">
                  <span className="j-card-num">03 / AUTOMATION</span>
                  <span className="j-card-symbol">⚙</span>
                </div>
                <h3>
                  시스템은<br />
                  자동으로
                </h3>
                <p>
                  키오스크 &amp; 출입 관리 시스템 연동<br />
                  도서 검색 및 통합 재고 운영 자동화
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 3. Two Experiences (50:50 Dual Track) */}
        <section className="split-section-5050" id="experience" data-section="experience">
          {/* Left: 만화카페 (5대 핵심 경험 키워드 슬라이더) */}
          <div className="split-col-left">
            <div className="split-heading-block" data-reveal>
              <p className="eyebrow">04 / OFFLINE SPACE — 5 KEYWORDS</p>
              <h2>
                공간을 즐기는<br />
                <em>5가지 키워드</em>
              </h2>
              <p className="split-desc">
                읽는 속도도, 머무는 방식도 자유롭게. READ · WATCH · PLAY · EAT · RELAX 5가지 키워드로 완성되는 복합 문화 공간.
              </p>
            </div>

            <div className="exp-preview-card" data-reveal>
              {/* 5가지 키워드 탭 바 */}
              <div className="exp-keyword-tabs" role="tablist" aria-label="만화카페 주요 경험 5선">
                {CAFE_EXPERIENCES.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === cafeExpIndex}
                    className={`exp-keyword-tab ${idx === cafeExpIndex ? 'is-active' : ''}`}
                    onClick={() => setCafeExpIndex(idx)}
                  >
                    {item.keyword}
                  </button>
                ))}
              </div>

              {/* 이미지 슬라이드 쇼 */}
              <div className="exp-img-wrap">
                {CAFE_EXPERIENCES.map((item, idx) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className={`exp-slide-img ${idx === cafeExpIndex ? 'is-active' : ''}`}
                  />
                ))}
                <span className="exp-img-badge">{CAFE_EXPERIENCES[cafeExpIndex].badge}</span>
              </div>

              {/* 설명 본문 */}
              <div className="exp-card-body">
                <h3>{CAFE_EXPERIENCES[cafeExpIndex].title}</h3>
                <p>{CAFE_EXPERIENCES[cafeExpIndex].desc}</p>
                <div className="exp-dots-indicator" aria-hidden="true">
                  {CAFE_EXPERIENCES.map((_, idx) => (
                    <span
                      key={idx}
                      className={`exp-dot ${idx === cafeExpIndex ? 'is-active' : ''}`}
                      onClick={() => setCafeExpIndex(idx)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="hero-action-btn hero-action-btn-cafe"
                  onClick={() => jump('stores')}
                >
                  지점 안내 보기 <span>↓</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: 중고만화책방 (홍대점 직영 오프라인 서점 슬라이더) */}
          <div className="split-col-right">
            <div className="split-heading-block" data-reveal>
              <p className="eyebrow">04 / HONGDAE OFFLINE BOOKSTORE</p>
              <h2>
                홍대 오프라인<br />
                <em>중고만화책 판매점</em>
              </h2>
              <p className="split-desc">
                홍대 플래그십 매장에서 직접 운영하는 오프라인 중고만화 전문 판매점입니다. 실물 상태를 직접 확인하고 현장에서 바로 소장하세요.
              </p>
            </div>

            <div className="exp-preview-card" data-reveal>
              {/* 4가지 특징 탭 바 */}
              <div className="exp-keyword-tabs" role="tablist" aria-label="중고만화책방 특징">
                {BOOKSTORE_EXPERIENCES.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === bookExpIndex}
                    className={`exp-keyword-tab ${idx === bookExpIndex ? 'is-active' : ''}`}
                    onClick={() => setBookExpIndex(idx)}
                  >
                    {item.keyword}
                  </button>
                ))}
              </div>

              {/* 이미지 슬라이드 쇼 */}
              <div className="exp-img-wrap">
                {BOOKSTORE_EXPERIENCES.map((item, idx) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className={`exp-slide-img ${idx === bookExpIndex ? 'is-active' : ''}`}
                  />
                ))}
                <span className="exp-img-badge">{BOOKSTORE_EXPERIENCES[bookExpIndex].badge}</span>
              </div>

              {/* 설명 본문 */}
              <div className="exp-card-body">
                <h3>{BOOKSTORE_EXPERIENCES[bookExpIndex].title}</h3>
                <p>{BOOKSTORE_EXPERIENCES[bookExpIndex].desc}</p>
                <div className="exp-dots-indicator" aria-hidden="true">
                  {BOOKSTORE_EXPERIENCES.map((_, idx) => (
                    <span
                      key={idx}
                      className={`exp-dot ${idx === bookExpIndex ? 'is-active' : ''}`}
                      onClick={() => setBookExpIndex(idx)}
                    />
                  ))}
                </div>
                <a
                  className="hero-action-btn hero-action-btn-book"
                  href="https://bookis.store/cartoon"
                  target="_blank"
                  rel="noreferrer"
                >
                  중고만화책 쇼핑하기 <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Details & Distribution (50:50 Dual Track) */}
        <section className="split-section-5050" id="stores" data-section="stores">
          {/* Left: Store Showcase */}
          <div className="split-col-left white-bg">
            <div className="split-heading-block" data-reveal>
              <p className="eyebrow">05 / STORE NETWORK</p>
              <h2>
                지점별 <em>공간 안내</em>
              </h2>
              <p className="split-desc">
                홍대 24시간 플래그십부터 서울대입구·잠실·사당까지, 각 지점의 실제 시설과 도서를 확인하세요.
              </p>
            </div>

            {/* Store Showcase Widget */}
            <StoresShowcaseWidget />
          </div>

          {/* Right: Book Numbers & 4-Step Pipeline & Validation */}
          <div className="split-col-right">
            <div className="split-heading-block" data-reveal>
              <p className="eyebrow">05 / ONLINE DISTRIBUTION</p>
              <h2>
                투명한 도서 유통과<br />
                <em>4단계 검수 구조</em>
              </h2>
              <p className="split-desc">
                단일 실물 동시 판매 방지와 상태 검수를 엄격히 관리합니다.
              </p>
            </div>

            {/* Numbers Box */}
            <div className="commerce-numbers-box" data-reveal>
              <div className="comm-num-row">
                <span>직접 보유 도서</span>
                <strong>35,000권</strong>
              </div>
              <div className="comm-num-row">
                <span>위탁 도서 네트워크</span>
                <strong>100,000권</strong>
              </div>
              <div className="comm-num-row total-row">
                <span>총 취급 예정 수량</span>
                <strong>135,000권</strong>
              </div>
              <div className="comm-num-warning">
                ※ ‘135,000권 전량 판매 중’이 아니며 권수 기준 총 취급 예정 규모입니다.<br />
                권수(20권)와 상품수(세트 1개)를 엄격히 구분하며, 위탁 도서는 상태에 따라 구매가 불가할 수 있습니다.
              </div>
            </div>

            {/* 4-Step Pipeline */}
            <div className="pipeline-steps" data-reveal>
              <div className="pipeline-step-item">
                <span className="pipeline-step-num">STEP 01</span>
                <span className="pipeline-step-title">취급 예정 (계약 및 목록 준비 단계)</span>
                <span className="pipeline-step-status">결제 비활성</span>
              </div>
              <div className="pipeline-step-item">
                <span className="pipeline-step-num">STEP 02</span>
                <span className="pipeline-step-title">재고 확인 및 검수 (위탁처 실물 확인 중)</span>
                <span className="pipeline-step-status">구매 대기</span>
              </div>
              <div className="pipeline-step-item active">
                <span className="pipeline-step-num">STEP 03</span>
                <span className="pipeline-step-title">판매 승인 완료 (실물 수량 및 상태 검수 완료)</span>
                <span className="pipeline-step-status">구매 가능</span>
              </div>
              <div className="pipeline-step-item">
                <span className="pipeline-step-num">STEP 04</span>
                <span className="pipeline-step-title">주문 확보 / 결제 대기 (임시 확보 시간 적용)</span>
                <span className="pipeline-step-status">동시판매 차단</span>
              </div>
            </div>

            {/* External Links */}
            <div className="partner-links-row" data-reveal>
              <a
                className="hero-action-btn hero-action-btn-book"
                href="https://bookis.store/cartoon"
                target="_blank"
                rel="noreferrer"
              >
                중고만화책 쇼핑몰 바로가기 <span>↗</span>
              </a>
              <a
                className="hero-action-btn hero-action-btn-book"
                href="https://www.daangn.com/kr/business-post/uqq46fy3y5u4/"
                target="_blank"
                rel="noreferrer"
                style={{ background: '#FFFFFF', color: '#111111' }}
              >
                당근 비즈니스 소개글 보기 <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* 5. Safety DNA & Connected Loop (50:50 Dual Track) */}
        <section className="split-section-5050" id="loop" data-section="loop">
          {/* Left: 여성 안전 DNA 캠페인 (우측 5단계 루프와 동일한 가로형 스택 구조) */}
          <div className="split-col-left">
            <div className="split-heading-block" data-reveal>
              <p className="eyebrow">&lt;Campaign&gt; DNA of Women&apos;s Safety</p>
              <h2>
                카툰플러스 캠페인.<br />
                <em>여성 안심 구역</em> 🛡️
              </h2>
              <p className="split-desc">
                여성 안심을 최우선으로 하는 여성 안심 구역 지정 매장입니다.
              </p>
            </div>

            <div className="loop-steps-vertical" data-reveal>
              {/* 상단: 또리 이미지 + 캠페인 지정 안내 */}
              <div className="loop-step-card safety-ttori-card">
                <img
                  src={MASCOT_ASSETS.reading}
                  alt="카툰플러스 마스코트 또리"
                  loading="lazy"
                  decoding="async"
                  className="safety-ttori-img"
                />
                <div className="loop-step-content">
                  <strong>여성 안심 구역 지정 (DNA of women&apos;s safety)</strong>
                  <span>여성 안심 최우선 카페 · 전 매장 3대 안전 시스템 상시 운영</span>
                </div>
              </div>

              {/* 1. 긴급 대응 체계 */}
              <div className="loop-step-card">
                <span className="loop-step-idx">01</span>
                <div className="loop-step-content">
                  <strong>긴급 대응 체계</strong>
                  <span>경찰 112 즉시 신고 · 에스원 5분 이내 출동 · 관리소 24시간 순찰</span>
                </div>
              </div>

              {/* 2. 보안 장비 운영 */}
              <div className="loop-step-card">
                <span className="loop-step-idx">02</span>
                <div className="loop-step-content">
                  <strong>보안 장비 운영</strong>
                  <span>매장 전역 CCTV 상시 작동 · 출입구 AI 자동 감시 카메라 설치·운영</span>
                </div>
              </div>

              {/* 3. 심야시간(22시 이후) 출입 규정 */}
              <div className="loop-step-card accent">
                <span className="loop-step-idx">03</span>
                <div className="loop-step-content">
                  <strong>심야시간(22시 이후) 출입 규정</strong>
                  <span>전원 신분증 검사 · 미성년 및 미지참 성인 입장 불가 · 불응 시 경찰 통보</span>
                </div>
              </div>

              {/* 하단: 안심 서약 및 매장 문의 버튼 */}
              <div className="loop-step-card safety-action-row">
                <div className="loop-step-content">
                  <strong>고객 안전·안심 수호 약속</strong>
                  <span>언제나 고객님의 안전과 안심을 지켜드리겠습니다.</span>
                </div>
                <button
                  type="button"
                  className="safety-dna-pill-btn"
                  onClick={() => setModal('store')}
                >
                  매장에 문의하기 📞
                </button>
              </div>
            </div>
          </div>

          {/* Right: 5-Step Connected Loop */}
          <div className="split-col-right white-bg">
            <div className="split-heading-block" data-reveal>
              <p className="eyebrow">06 / CONNECTED LOOP</p>
              <h2>
                오프라인과 온라인이<br />
                <em>연결되는 선순환</em>
              </h2>
              <p className="split-desc">
                체험이 소장으로, 소장이 다음 방문으로 자연스럽게 이어집니다.
              </p>
            </div>

            <div className="loop-steps-vertical" data-reveal>
              <div className="loop-step-card">
                <span className="loop-step-idx">01</span>
                <div className="loop-step-content">
                  <strong>지역 검색 유입</strong>
                  <span>네이버 플레이스 및 지도 검색을 통한 매장 발견</span>
                </div>
              </div>
              <div className="loop-step-card">
                <span className="loop-step-idx">02</span>
                <div className="loop-step-content">
                  <strong>매장 방문 &amp; 체류</strong>
                  <span>신발을 벗고 머무는 오프라인 공간 체험</span>
                </div>
              </div>
              <div className="loop-step-card accent">
                <span className="loop-step-idx">03</span>
                <div className="loop-step-content">
                  <strong>인생 작품 발견</strong>
                  <span>홍대점 45,000권 속에서 취향 저격 만화 발견</span>
                </div>
              </div>
              <div className="loop-step-card">
                <span className="loop-step-idx">04</span>
                <div className="loop-step-content">
                  <strong>온라인 쇼핑몰 소장</strong>
                  <span>135,000권 중고/경매 네트워크로 평생 소장</span>
                </div>
              </div>
              <div className="loop-step-card">
                <span className="loop-step-idx">05</span>
                <div className="loop-step-content">
                  <strong>재방문 &amp; 재구매</strong>
                  <span>카툰플러스 생태계 지속적인 락인(Lock-in)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Franchise & Partnership (50:50 Dual Track) */}
        <section className="split-section-5050" id="franchise" data-section="franchise">
          {/* Left: 가맹문의 */}
          <div className="split-col-left">
            <div className="inquiry-split-box" data-reveal>
              <div className="inquiry-box-top">
                <p className="eyebrow">07 / FRANCHISE INQUIRY</p>
                <span className="inquiry-type-badge">신규 출점 · 업종 전환</span>
              </div>
              <h3>
                카툰플러스의 다음 공간을<br />
                함께 만들어갈 가맹 파트너
              </h3>
              <p>
                체류형 복합문화 만화카페와 135,000권 도서 유통 네트워크를 결합한 공간 비즈니스 모델을 제안합니다. 상권 분석부터 공간 설계, 도서 큐레이션까지 전 과정을 함께합니다.
              </p>

              <div className="inquiry-tag-chips">
                <span>#무인키오스크연동</span>
                <span>#도서큐레이션세팅</span>
                <span>#상권맞춤설계</span>
                <span>#온오프통합재고</span>
              </div>

              <ul className="inquiry-benefit-list">
                <li>
                  <strong>3J 자율·자동화 운영 시스템</strong>
                  <span>키오스크·출입 통제·도서 검색 자동화로 매장 운영 피로도 절감</span>
                </li>
                <li>
                  <strong>검증된 대형 서가 &amp; 콘텐츠 세팅</strong>
                  <span>본사 도서 네트워크를 통한 초기 서가 구성 및 신간·인기작 지속 공급</span>
                </li>
                <li>
                  <strong>상권별 맞춤형 공간 기획</strong>
                  <span>24시간 플래그십부터 대학가·역세권 특화 매장까지 상권별 최적 설계</span>
                </li>
              </ul>

              <div className="inquiry-meta-strip">
                <span>상담 안내</span>
                <b>희망 지역 · 예산 맞춤형 1:1 창업 브리핑</b>
              </div>
              <button
                type="button"
                className="hero-action-btn hero-action-btn-cafe"
                onClick={() => setModal('franchise')}
                style={{ marginTop: 'auto' }}
              >
                가맹 및 창업 상담 신청 <span>→</span>
              </button>
            </div>
          </div>

          {/* Right: 제휴문의 */}
          <div className="split-col-right white-bg">
            <div className="inquiry-split-box yellow-card" data-reveal>
              <div className="inquiry-box-top">
                <p className="eyebrow">08 / PARTNERSHIP</p>
                <span className="inquiry-type-badge badge-dark">IP · 유통 · 브랜드 협업</span>
              </div>
              <h3>
                콘텐츠와 공간의 가치를 넓히는<br />
                비즈니스 제휴 파트너십
              </h3>
              <p>
                웹툰·출판 IP 오프라인 프로모션부터 중고 도서 대량 유통·위탁, 식음료·디바이스 브랜드 체험존까지 카툰플러스 온·오프라인 인프라와 시너지를 낼 제안을 기다립니다.
              </p>

              <div className="inquiry-tag-chips chips-dark">
                <span>#웹툰·출판IP콜라보</span>
                <span>#도서대량유통·위탁</span>
                <span>#브랜드팝업·체험존</span>
                <span>#공간대관·촬영</span>
              </div>

              <ul className="inquiry-benefit-list list-on-yellow">
                <li>
                  <strong>콘텐츠 IP &amp; 출판 프로모션</strong>
                  <span>신작 단행본 특별 서가, 웹툰 굿즈 팝업, 팬 이벤트 등 오프라인 접점 제공</span>
                </li>
                <li>
                  <strong>도서 유통 · 위탁 · 대량 매입 협력</strong>
                  <span>총판·서점·개인 소장가와의 위탁 판매 네트워크 및 4단계 검수 유통 연동</span>
                </li>
                <li>
                  <strong>F&amp;B · 보드게임 · 디바이스 브랜드 제휴</strong>
                  <span>체류 시간 동안 자연스럽게 제품을 경험하는 매장 내 브랜드 체험존 운영</span>
                </li>
              </ul>

              <div className="inquiry-meta-strip">
                <span>제휴 범위</span>
                <b>전국 오프라인 지점 &amp; 온라인 북커머스 동시 연계</b>
              </div>
              <button
                type="button"
                className="hero-action-btn hero-action-btn-cafe"
                onClick={() => setModal('partnership')}
                style={{ marginTop: 'auto' }}
              >
                제휴 및 협업 문의 <span>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* 7. GLOBAL 2035 & Vision */}
        <section className="global-section" id="vision" data-section="vision">
          {/* 회전하는 3D 지구 네트워크 배경 */}
          <GlobeNetworkBackground />

          <div className="global-container" data-reveal>
            <p className="eyebrow">09 / GLOBAL 2035</p>
            <h2>
              Beyond Comics,<br />
              <span>Beyond Borders.</span>
            </h2>
            <p className="global-lede">
              카툰플러스와 카툰뱅을 중심으로 글로벌 콘텐츠 및 공간 비즈니스의 다음 장면을 준비합니다.
            </p>

            <div className="global-pillars-grid">
              <div className="global-pillar-item">
                <span className="global-pillar-idx">01</span>
                <strong>콘텐츠 확장</strong>
                <p>만화를 중심으로 한 새로운 발견과 문화적 향유의 접점을 글로벌로 확대합니다.</p>
              </div>
              <div className="global-pillar-item">
                <span className="global-pillar-idx">02</span>
                <strong>공간 확장</strong>
                <p>도심 속 편안한 체류와 교류가 공존하는 복합문화 공간의 표준을 수립합니다.</p>
              </div>
              <div className="global-pillar-item">
                <span className="global-pillar-idx">03</span>
                <strong>AI 추천 · 수요 예측</strong>
                <p><strong>[계획]</strong> 도서 큐레이션 및 공급망 최적화를 위한 시스템을 연구 개발 중입니다.</p>
              </div>
            </div>

            <p className="global-notice">
              ※ 확정되지 않은 진출 국가, 매장 수, 투자 금액은 일절 기재하지 않으며 계획 단계의 내용만을 공지합니다.
            </p>
          </div>
        </section>
      </main>

      {/* Mobile Horizontal Slide Bar */}
      <div className="mobile-slide-bar" aria-label="모바일 섹션 이동">
        <button
          type="button"
          onClick={() => jumpToSlide(currentSlideIndex - 1)}
          disabled={currentSlideIndex === 0}
          aria-label="이전 섹션"
        >
          ‹
        </button>
        <span className="mobile-slide-indicator">
          <strong>{currentSlideIndex + 1}</strong> / {pageSections.length}
          <small>{pageSections[currentSlideIndex]?.label}</small>
        </span>
        <button
          type="button"
          onClick={() => jumpToSlide(currentSlideIndex + 1)}
          disabled={currentSlideIndex === pageSections.length - 1}
          aria-label="다음 섹션"
        >
          ›
        </button>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-lockup">
              <img
                src={OFFICIAL_BRAND_ASSETS.logoRed}
                alt="카툰플러스 로고"
                className="brand-logo-img"
              />
            </div>
            <p>
              원하는 만큼, 편안하게.<br />
              도심 속 복합문화 만화카페.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <span className="footer-label">EXPLORE</span>
              <a
                href="#three-j"
                onClick={(e) => {
                  e.preventDefault();
                  jump('three-j');
                }}
              >
                3J 철학
              </a>
              <a
                href="#experience"
                onClick={(e) => {
                  e.preventDefault();
                  jump('experience');
                }}
              >
                공간과 경험
              </a>
              <a
                href="#stores"
                onClick={(e) => {
                  e.preventDefault();
                  jump('stores');
                }}
              >
                지점 안내
              </a>
              <a href="/books">매장 도서 검색</a>
            </div>
            <div>
              <span className="footer-label">CONTACT</span>
              <button type="button" onClick={() => setModal('franchise')}>
                가맹 상담
              </button>
              <button type="button" onClick={() => setModal('partnership')}>
                제휴·협업 문의
              </button>
              <button type="button" onClick={() => setModal('store')}>
                매장 이용 문의
              </button>
            </div>
            <div>
              <span className="footer-label">CHANNELS</span>
              <a href="https://www.instagram.com/cartoonplus_cafe/" target="_blank" rel="noopener noreferrer">
                <Instagram size={15} /> Instagram
              </a>
              <a href="https://bookis.store/cartoon" target="_blank" rel="noopener noreferrer">
                중고만화책 쇼핑몰 ↗
              </a>
              <a href="https://www.daangn.com/kr/business-post/uqq46fy3y5u4/" target="_blank" rel="noopener noreferrer">
                당근 비즈니스 ↗
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 CARTOON PLUS. ALL RIGHTS RESERVED.</span>
          <span>CRAFTED FOR YOUR RELAXATION.</span>
        </div>
      </footer>

      {/* Inquiry Modal */}
      {modal && <InquiryModal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

function StoresShowcaseWidget() {
  const [active, setActive] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const navigate = useNavigate();

  const store = stores[active];

  const changeStore = (index: number) => {
    setActive(index);
    setActivePhoto(0);
  };

  return (
    <div className="store-gallery-card" data-reveal>
      <div className="store-filter-bar">
        {stores.map((item, index) => (
          <button
            type="button"
            key={item.name}
            className={`store-filter-btn ${index === active ? 'active' : ''}`}
            onClick={() => changeStore(index)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="store-gallery-photo-wrap">
        <img
          className="store-gallery-photo"
          src={store.images[activePhoto] || store.images[0]}
          alt={`${store.name} 실제 사진 ${activePhoto + 1}`}
          loading="lazy"
          decoding="async"
        />
        <div className="store-gallery-counter">
          {activePhoto + 1} / {store.images.length}
        </div>
      </div>

      <div className="store-gallery-info">
        <div>
          <strong className="store-gallery-title">카툰플러스 {store.name}</strong>
          <p className="store-gallery-desc">
            {store.description}
          </p>
          <ul className="store-gallery-details">
            {store.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="store-gallery-footer">
        <div className="store-thumb-list">
          {store.images.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => setActivePhoto(idx)}
              aria-label={`${store.name} 사진 ${idx + 1}`}
              className={`store-thumb-btn ${idx === activePhoto ? 'is-active' : ''}`}
            >
              <img src={img} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="hero-action-btn hero-action-btn-cafe store-search-btn"
          onClick={() => navigate(`/stores/${store.slug}/books`)}
        >
          이 지점 도서 검색 <span>↗</span>
        </button>
      </div>
    </div>
  );
}

function GlobeNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      ctx = null;
    }
    if (!ctx) return;

    let animId = 0;
    let angleY = 0;
    const tiltX = 0.34;

    // 피보나치 구면 격자로 3D 지구 표면 네트워크 노드 생성
    const nodeCount = 96;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      return {
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.cos(phi),
        z: Math.sin(theta) * Math.sin(phi),
        isHub: i % 8 === 0,
      };
    });

    // 인접 노드 간 네트워크 연결선 사전 계산
    const edges: [number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 0.45) {
          edges.push([i, j]);
        }
      }
    }

    let lastW = 0;
    let lastH = 0;

    const rotatePoint = (px: number, py: number, pz: number, ay: number) => {
      // Y축 회전
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      const x1 = px * cosY - pz * sinY;
      const z1 = px * sinY + pz * cosY;
      // X축 기울기
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const y2 = py * cosX - z1 * sinX;
      const z2 = py * sinX + z1 * cosX;
      return { x: x1, y: y2, z: z2 };
    };

    const renderFrame = () => {
      if (!ctx) return;
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || canvas.clientWidth || 960;
      const h = parent?.clientHeight || canvas.clientHeight || 640;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // 매 프레임 실제 컨테이너 크기와 캔버스 버퍼 동기화 (찌그러짐 방지)
      if (Math.abs(w - lastW) > 0.5 || Math.abs(h - lastH) > 0.5) {
        lastW = w;
        lastH = h;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      // 섹션 상하좌우 안에서 잘리지 않고 온전한 구(Sphere) 형태로 보이는 반경
      const radius = Math.min(w * 0.42, h * 0.41);

      // 1. 지구본 외부 대기 후광 + 내부 구면 볼륨 그라데이션
      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.65, cx, cy, radius * 1.28);
      outerGlow.addColorStop(0, 'rgba(255, 212, 0, 0.14)');
      outerGlow.addColorStop(0.5, 'rgba(229, 57, 53, 0.10)');
      outerGlow.addColorStop(1, 'rgba(17, 17, 17, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.28, 0, Math.PI * 2);
      ctx.fill();

      const sphereBody = ctx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.25,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      sphereBody.addColorStop(0, 'rgba(30, 41, 68, 0.45)');
      sphereBody.addColorStop(0.72, 'rgba(17, 24, 39, 0.55)');
      sphereBody.addColorStop(1, 'rgba(255, 212, 0, 0.22)');
      ctx.fillStyle = sphereBody;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 2. 선명한 지구 외곽 구면 테두리 (Rim)
      ctx.strokeStyle = 'rgba(255, 212, 0, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 3. 외부 기울어진 궤도 링 (지구 중심 및 반경에 비례)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.24);
      ctx.scale(1, 0.34);
      ctx.strokeStyle = 'rgba(255, 212, 0, 0.38)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 4. 위도(Parallels) & 경도(Meridians) 3D 와이어프레임 회전 그리드
      const latLevels = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];
      for (const latY of latLevels) {
        const ringR = Math.sqrt(1 - latY * latY);
        ctx.beginPath();
        for (let step = 0; step <= 60; step++) {
          const a = (step / 60) * Math.PI * 2;
          const p = rotatePoint(Math.cos(a) * ringR, latY, Math.sin(a) * ringR, angleY);
          const sx = cx + p.x * radius;
          const sy = cy + p.y * radius;
          if (step === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = latY === 0 ? 'rgba(255, 212, 0, 0.32)' : 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = latY === 0 ? 1.3 : 1;
        ctx.stroke();
      }

      for (let m = 0; m < 8; m++) {
        const lonAngle = (m / 8) * Math.PI;
        ctx.beginPath();
        for (let step = 0; step <= 60; step++) {
          const b = (step / 60) * Math.PI * 2;
          const px = Math.cos(b) * Math.cos(lonAngle);
          const py = Math.sin(b);
          const pz = Math.cos(b) * Math.sin(lonAngle);
          const p = rotatePoint(px, py, pz, angleY);
          const sx = cx + p.x * radius;
          const sy = cy + p.y * radius;
          if (step === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = 'rgba(255, 212, 0, 0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 5. 노드 3D 투영 계산
      const projected = nodes.map((n) => {
        const p = rotatePoint(n.x, n.y, n.z, angleY);
        return {
          sx: cx + p.x * radius,
          sy: cy + p.y * radius,
          z: p.z,
          isHub: n.isHub,
        };
      });

      // 6. 노드 간 네트워크 엣지 렌더링
      for (const [i, j] of edges) {
        const a = projected[i];
        const b = projected[j];
        const avgZ = (a.z + b.z) * 0.5;
        if (avgZ < -0.45) continue;
        const alpha = Math.max(0.08, (avgZ + 0.6) * 0.42);
        ctx.strokeStyle = a.isHub || b.isHub
          ? `rgba(255, 212, 0, ${Math.min(0.85, alpha * 1.35)})`
          : `rgba(255, 255, 255, ${Math.min(0.65, alpha)})`;
        ctx.lineWidth = a.isHub || b.isHub ? 1.4 : 0.95;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // 7. 노드 포인트 렌더링
      for (const pt of projected) {
        const depthAlpha = Math.max(0.18, (pt.z + 1) * 0.5);
        const nodeRadius = pt.isHub ? (pt.z > 0 ? 4.8 : 2.8) : (pt.z > 0 ? 2.6 : 1.5);
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, nodeRadius, 0, Math.PI * 2);
        if (pt.isHub) {
          ctx.fillStyle = pt.z > 0
            ? `rgba(255, 212, 0, ${Math.min(1, depthAlpha * 1.25)})`
            : `rgba(229, 57, 53, ${depthAlpha * 0.75})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, depthAlpha * 0.9)})`;
        }
        ctx.fill();

        if (pt.isHub && pt.z > 0.1) {
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, nodeRadius + 5.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 212, 0, ${depthAlpha * 0.55})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }

      angleY += 0.004;
      if (isVisible) {
        animId = window.requestAnimationFrame(renderFrame);
      } else {
        animId = 0;
      }
    };

    let isVisible = true;
    renderFrame();

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animId = window.requestAnimationFrame(renderFrame);
          } else if (!isVisible && animId) {
            window.cancelAnimationFrame(animId);
            animId = 0;
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    }

    return () => {
      if (observer) observer.disconnect();
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="global-globe-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="global-globe-canvas" />
    </div>
  );
}

const INQUIRY_CONFIG: Record<
  InquiryType,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    submitLabel: string;
    categories: string[];
  }
> = {
  franchise: {
    eyebrow: '07 / FRANCHISE INQUIRY',
    title: '가맹 상담 신청',
    subtitle: '희망하시는 창업 지역과 예산 규모를 남겨주시면 담당자가 맞춤형 개설 안내를 도와드립니다.',
    submitLabel: '가맹 상담 신청하기 →',
    categories: ['신규 가맹 창업', '기존 매장 업종 전환', '복합 매장(카페+서점)', '상권 · 점포 입지 상담'],
  },
  partnership: {
    eyebrow: '08 / PARTNERSHIP INQUIRY',
    title: '제휴 및 협업 문의',
    subtitle: '콘텐츠 IP, 도서 유통·위탁, 브랜드 프로모션 등 카툰플러스와 함께할 제안을 남겨주세요.',
    submitLabel: '제휴 제안 접수하기 →',
    categories: ['웹툰 · 출판 IP 콜라보', '도서 대량 유통 · 위탁', '브랜드 팝업 · 체험존', '공간 대관 · 촬영 협조'],
  },
  store: {
    eyebrow: '06 / STORE & SAFETY HELP',
    title: '매장 이용 및 안심 문의',
    subtitle: '매장 이용 중 불편 사항이나 비대면 도움 요청, 분실물·단체 이용 문의를 남겨주세요.',
    submitLabel: '매장 문의 접수하기 →',
    categories: ['여성 안심 · 현장 도움 요청', '매장 시설 · 이용 문의', '분실물 확인 요청', '단체 방문 · 예약 문의'],
  },
};

function InquiryModal({ type, onClose }: ModalProps) {
  const config = INQUIRY_CONFIG[type];
  const [selectedCategory, setSelectedCategory] = useState(config.categories[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
        <button type="button" className="modal-close" onClick={onClose} aria-label="문의 창 닫기">
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-heading">
              <p className="eyebrow">{config.eyebrow}</p>
              <h2 id="inquiry-title">{config.title}</h2>
              <p>{config.subtitle}</p>
            </div>

            <div className="interest-pills" role="group" aria-label="문의 세부 유형 선택">
              {config.categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={selectedCategory === cat ? 'selected' : ''}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <form className="inquiry-modal-form" onSubmit={handleSubmit}>
              {type === 'franchise' && (
                <div className="form-grid">
                  <label>
                    신청자 성함 *
                    <input type="text" name="name" placeholder="홍길동" required />
                  </label>
                  <label>
                    연락처 *
                    <input type="tel" name="phone" placeholder="010-0000-0000" required />
                  </label>
                  <label>
                    희망 창업 지역 *
                    <input type="text" name="region" placeholder="예: 서울 마포구 / 경기 분당" required />
                  </label>
                  <label>
                    예상 투자 예산
                    <select name="budget" defaultValue="2억~3억">
                      <option value="1억~2억">1억 ~ 2억 원</option>
                      <option value="2억~3억">2억 ~ 3억 원</option>
                      <option value="3억이상">3억 원 이상</option>
                      <option value="상담후결정">상담 후 결정</option>
                    </select>
                  </label>
                  <label>
                    점포 보유 여부
                    <select name="property" defaultValue="탐색중">
                      <option value="탐색중">희망 상권 내 점포 탐색 중</option>
                      <option value="후보지있음">입지 후보지 보유 (계약 전)</option>
                      <option value="점포보유">자가 또는 임차 점포 보유</option>
                    </select>
                  </label>
                  <label>
                    이메일 (선택)
                    <input type="email" name="email" placeholder="example@email.com" />
                  </label>
                </div>
              )}

              {type === 'partnership' && (
                <div className="form-grid">
                  <label>
                    기업 · 기관명 *
                    <input type="text" name="company" placeholder="(주)카툰파트너스 / 개인 소장가" required />
                  </label>
                  <label>
                    담당자 성함 · 직책 *
                    <input type="text" name="contactName" placeholder="김담당 팀장" required />
                  </label>
                  <label>
                    연락처 *
                    <input type="tel" name="phone" placeholder="010-0000-0000" required />
                  </label>
                  <label>
                    이메일 *
                    <input type="email" name="email" placeholder="partner@company.com" required />
                  </label>
                  <label className="form-col-full">
                    제안 제목 *
                    <input
                      type="text"
                      name="subject"
                      placeholder="예: 신작 웹툰 단행본 특별 서가 및 팝업 프로모션 제안"
                      required
                    />
                  </label>
                </div>
              )}

              {type === 'store' && (
                <div className="form-grid">
                  <label>
                    방문 지점 선택 *
                    <select name="store" defaultValue="홍대점">
                      <option value="홍대점">홍대점 (24시간 플래그십)</option>
                      <option value="서울대입구역점">서울대입구역점</option>
                      <option value="잠실점">잠실점</option>
                      <option value="사당점">사당점</option>
                    </select>
                  </label>
                  <label>
                    좌석 번호 또는 방문 일시
                    <input type="text" name="seatOrTime" placeholder="예: 토굴방 12번 / 오늘 19시" />
                  </label>
                  <label>
                    성함 (또는 닉네임) *
                    <input type="text" name="name" placeholder="성함 또는 닉네임" required />
                  </label>
                  <label>
                    회신 받을 연락처 *
                    <input type="tel" name="phone" placeholder="010-0000-0000" required />
                  </label>
                </div>
              )}

              <label className="message-label">
                {type === 'franchise'
                  ? '상세 문의 내용 (희망 평수, 창업 시기 등)'
                  : type === 'partnership'
                    ? '제휴 제안 상세 내용 *'
                    : '문의 및 요청 상세 내용 *'}
                <textarea
                  name="message"
                  rows={4}
                  placeholder={
                    type === 'franchise'
                      ? '희망하시는 오픈 시기나 궁금하신 점을 자유롭게 남겨주세요.'
                      : type === 'partnership'
                        ? '제안 배경, 협업 방식, 희망 일정 등을 작성해 주세요.'
                        : '도움이 필요하신 내용이나 매장 이용 문의 사항을 작성해 주세요.'
                  }
                  required={type !== 'franchise'}
                />
              </label>

              <label className="modal-consent-row">
                <input type="checkbox" name="consent" required />
                <span>문의 응대 및 상담 진행을 위한 개인정보 수집·이용에 동의합니다. (필수)</span>
              </label>

              <button type="submit" className="hero-action-btn hero-action-btn-cafe submit-button">
                {config.submitLabel}
              </button>

              <p className="form-privacy">
                빠른 실시간 응대가 필요하신 경우{' '}
                <a
                  href="https://www.instagram.com/cartoonplus_cafe/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  공식 인스타그램(@cartoonplus_cafe)
                </a>{' '}
                DM으로도 문의하실 수 있습니다.
              </p>
            </form>
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon" aria-hidden="true">✓</div>
            <p className="eyebrow">{config.eyebrow}</p>
            <h2>문의가 정상 접수되었습니다</h2>
            <p>
              선택하신 <strong>[{selectedCategory}]</strong> 항목으로 내용이 전달되었습니다.<br />
              담당자 확인 후 기재해 주신 연락처로 신속히 안내드리겠습니다.
            </p>
            <div className="modal-success-actions">
              <a
                href="https://www.instagram.com/cartoonplus_cafe/"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-action-btn hero-action-btn-book"
              >
                공식 인스타그램 바로가기 <span>↗</span>
              </a>
              <button
                type="button"
                className="hero-action-btn hero-action-btn-cafe"
                onClick={onClose}
              >
                창 닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
