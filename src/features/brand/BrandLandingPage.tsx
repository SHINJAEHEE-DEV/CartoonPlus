import { useEffect, useState, type ReactNode, type SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';
import { MASCOT_ASSETS } from '../../lib/brandAssets';
import './brandLanding.css';

const storeUrl = 'https://bookis.store/cartoon';

// ==========================================================================
// Lightweight Inline SVG Icons (Zero external dependency bloat)
// ==========================================================================
function IconBase({
  children,
  size = 20,
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

const ArrowDown = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </IconBase>
);
const ArrowRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </IconBase>
);
const ArrowUpRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </IconBase>
);
const Armchair = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
    <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
    <path d="M5 18v2" />
    <path d="M19 18v2" />
  </IconBase>
);
const BarChart3 = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </IconBase>
);
const BellRing = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </IconBase>
);
const BookOpen = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </IconBase>
);
const Camera = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </IconBase>
);
const Check = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 6 9 17l-5-5" />
  </IconBase>
);
const ChevronRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m9 18 6-6-6-6" />
  </IconBase>
);
const ChevronDown = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m6 9 6 6 6-6" />
  </IconBase>
);
const HelpCircle = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </IconBase>
);
const Clock3 = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16.5 12" />
  </IconBase>
);
const Gamepad2 = (props: IconProps) => (
  <IconBase {...props}>
    <line x1="6" x2="10" y1="12" y2="12" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="15" x2="15.01" y1="13" y2="13" />
    <line x1="18" x2="18.01" y1="11" y2="11" />
    <rect width="20" height="12" x="2" y="6" rx="6" />
  </IconBase>
);
const LayoutGrid = (props: IconProps) => (
  <IconBase {...props}>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </IconBase>
);
const MapPin = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </IconBase>
);
const Menu = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 12h16" />
    <path d="M4 6h16" />
    <path d="M4 18h16" />
  </IconBase>
);
const MonitorPlay = (props: IconProps) => (
  <IconBase {...props}>
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <polygon points="10 8 15 11 10 14 10 8" fill="currentColor" stroke="none" />
    <line x1="12" x2="12" y1="17" y2="21" />
    <line x1="8" x2="16" y1="21" y2="21" />
  </IconBase>
);
const Radio = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="2" />
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
  </IconBase>
);
const ScanLine = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="7" x2="17" y1="12" y2="12" />
  </IconBase>
);
const Search = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </IconBase>
);
const Send = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </IconBase>
);
const Phone = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </IconBase>
);
const CreditCard = (props: IconProps) => (
  <IconBase {...props}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </IconBase>
);
const ShieldCheck = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 13c0 5-8 9-8 9s-8-4-8-9V5l8-3 8 3Z" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
);
const ShoppingCart = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </IconBase>
);
const Sparkles = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </IconBase>
);
const Utensils = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
    <path d="M12 2v20" />
    <path d="M18 2v20" />
    <path d="M6 2v20" />
    <path d="M4 2v5a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2" />
  </IconBase>
);
const UsersRound = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M18 21a8 8 0 0 0-16 0" />
    <circle cx="10" cy="8" r="5" />
    <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
  </IconBase>
);
const X = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </IconBase>
);

// ==========================================================================
// Data Structures with Real Photos & Mascots
// ==========================================================================
const experiences = [
  {
    number: '01',
    label: 'READ',
    title: '읽는 재미',
    description: '45,000권 단행본·웹툰을 한 자리에서 만나요.',
    icon: BookOpen,
    accent: 'yellow',
    photo: '/assets/brand/exp_cafe_manga.jpg',
  },
  {
    number: '02',
    label: 'WATCH',
    title: '보는 재미',
    description: '스마트 모니터와 프라이빗 OTT 룸으로 이어지는 시간.',
    icon: MonitorPlay,
    accent: 'yellow',
    photo: '/assets/brand/exp_cafe_ott.jpg',
  },
  {
    number: '03',
    label: 'PLAY',
    title: '노는 재미',
    description: '닌텐도 스위치와 보드게임 50종, 오늘의 승부.',
    icon: Gamepad2,
    accent: 'yellow',
    photo: '/assets/brand/exp_cafe_play.jpg',
  },
  {
    number: '04',
    label: 'EAT',
    title: '먹는 재미',
    description: '즉석 한강라면과 시그니처 카페테리아 메뉴.',
    icon: Utensils,
    accent: 'yellow',
    photo: '/assets/brand/exp_cafe_eat.jpg',
  },
  {
    number: '05',
    label: 'RELAX',
    title: '쉬는 재미',
    description: '토굴방, 리클라이너 빈백, 안마의자로 푹 쉬어요.',
    icon: Armchair,
    accent: 'yellow',
    photo: '/assets/brand/exp_cafe_relax.jpg',
  },
];

const flagshipStore = {
  name: '홍대점',
  slug: 'hongdae',
  type: 'FLAGSHIP & 24H',
  hours: '24시간 연중무휴 상시 운영',
  address: '서울 마포구 양화로16길 29, 지하1층 전층(홍익몰)',
  note: '카툰플러스 본점 플래그십 스토어 & 오프라인 도서 판매점',
  color: 'yellow',
  photo: '/assets/store_photos/hongdae/hongdae_01.jpg',
  bubble: '24H',
  hasBookSearch: true,
};

const branchStores = [
  {
    name: '서울대입구역점',
    slug: 'snu',
    type: 'DAILY 10:00–23:00',
    hours: '매일 10:00 ~ 23:00',
    address: '서울 관악구 관악로 155, 3층 (봉천동 대우디오슈페리움 1단지)',
    note: '역세권 프리미엄 만화카페 라운지',
    color: 'blue',
    hasBookSearch: true,
  },
  {
    name: '잠실점',
    slug: 'jamsil',
    type: 'WEEKEND 24H',
    hours: '월~목 10:00~23:00 / 금 10:00~일 23:00 (주말 24H)',
    address: '서울 송파구 백제고분로9길 23 (운관빌딩 2층, 잠실새내역 4번 출구)',
    note: '주말 무중단 24시간 프라이빗 힐링 공간',
    color: 'pink',
    hasBookSearch: true,
  },
  {
    name: '사당역점',
    slug: 'sadang',
    type: 'DAILY 11:00–23:00',
    hours: '매일 11:00 ~ 23:00',
    address: '서울 관악구 과천대로 941, 6층 (남현동, 사당역 5번 출구 앞)',
    note: '사당역 초역세권 힐링 만화카페',
    color: 'yellow',
    hasBookSearch: false,
  },
];

const roadmap = [
  '1:1 상담',
  '상권 및 입지 실사',
  '가맹 계약',
  '도서 세팅 및 인테리어 관리',
  '오픈 및 마케팅 지원',
];

const pageSections = [
  { id: 'top', label: '처음' },
  { id: 'experience', label: '만화카페' },
  { id: 'archive', label: '중고만화책 쇼핑몰' },
  { id: 'stores', label: '지점 안내' },
  { id: 'loop', label: '매장 현황' }, // keep for test backward compatibility
  { id: 'business', label: '가맹 안내' },
  { id: 'inquiry', label: '상담 문의' },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  light?: boolean;
}) {
  return (
    <div className={`section-heading reveal ${light ? 'section-heading-light' : ''}`}>
      <div className="eyebrow">
        <span className="eyebrow-dot" />
        {eyebrow}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

type InquiryModalType = 'franchise' | 'partnership' | 'store';

export function BrandLandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFloat, setShowFloat] = useState(false);
  const [inquiryType, setInquiryType] = useState<'franchise' | 'partnership'>('franchise');
  const [submitted, setSubmitted] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [modal, setModal] = useState<InquiryModalType | null>(null);
  const [is3JOpen, setIs3JOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowFloat(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            const secId = entry.target.getAttribute('data-section') || entry.target.id;
            if (secId) setActiveSection(secId);
          }
        });
      },
      { threshold: 0.12 }
    );
    document
      .querySelectorAll('.reveal, [data-section]')
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const prefersReduced =
        typeof window !== 'undefined' && typeof window.matchMedia === 'function'
          ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
          : false;
      element.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'smooth' });
    }
  };

  const submitInquiry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacy) return;
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div className="site-shell">
      {/* 0. Topbar GNB */}
      <header className="topbar">
        <div className="topbar-inner">
          <a className="wordmark" href="#top" aria-label="카툰플러스 홈">
            <img
              src="/assets/mascot/mascot_face.png"
              alt="또리 마스코트"
              className="wordmark-mascot"
            />
            <img src="/assets/brand/logo_red.png" alt="CARTOON+" className="wordmark-logo-img" />
          </a>

          <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label="주요 메뉴">
            <button type="button" onClick={() => scrollTo('experience')}>
              1.만화카페
            </button>
            <button type="button" onClick={() => scrollTo('archive')}>
              2.중고만화책 쇼핑몰
            </button>
            <button type="button" onClick={() => scrollTo('stores')}>
              지점 안내
            </button>
            <button type="button" onClick={() => scrollTo('business')}>
              가맹/제휴
            </button>
          </nav>

          <button
            type="button"
            className="nav-cta"
            onClick={() => scrollTo('inquiry')}
            aria-label="가맹·제휴 상담"
          >
            가맹·제휴 상담 <ArrowUpRight size={16} />
          </button>

          <button
            type="button"
            className="mobile-menu-button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Side Rail Progress Dots (for quick access and backwards compatibility) */}
      <nav className="brand-progress" aria-label="페이지 섹션 이동">
        <span className="brand-progress-track" aria-hidden="true">
          <span />
        </span>
        {pageSections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={activeSection === section.id ? 'active' : ''}
            aria-label={section.label}
            aria-current={activeSection === section.id ? 'location' : undefined}
            onClick={() => scrollTo(section.id)}
          >
            <span className="brand-progress-label">{section.label}</span>
            <span className="brand-progress-dot" />
          </button>
        ))}
      </nav>

      <main id="top">
        {/* 1. Hero Section (Vibrant Yellow Canvas #FFD400) */}
        <section className="hero-section" data-section="top">
          <div className="hero-grid-pattern" />
          <div className="hero-inner container">
            {/* Mega Trio Buttons (글 없이 버튼 3개로 히어로 전면 꽉 채움) */}
            <div className="hero-mega-wrap reveal">
              <h1 className="sr-only">카툰플러스 공식 브랜드 웹사이트</h1>

              <div className="hero-mega-trio">
                {/* 1. 만화카페 */}
                <button
                  type="button"
                  className="hero-mega-card mega-card-dark"
                  onClick={() => scrollTo('experience')}
                  aria-label="1. 만화카페 바로가기"
                >
                  <div className="mega-card-content">
                    <span className="mega-card-num">1.</span>
                    <span className="mega-card-title">만화카페</span>
                  </div>
                  <div className="mega-card-badge-wrap">
                    <span className="mega-card-arrow-circle">
                      <ArrowDown size={24} />
                    </span>
                  </div>
                </button>

                {/* 2. 중고만화책 쇼핑몰 */}
                <a
                  className="hero-mega-card mega-card-dark"
                  href={storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="2. 중고만화책 쇼핑몰 바로가기"
                >
                  <div className="mega-card-content">
                    <span className="mega-card-num">2.</span>
                    <span className="mega-card-title">중고만화책 쇼핑몰</span>
                  </div>
                  <div className="mega-card-badge-wrap">
                    <span className="mega-card-arrow-circle">
                      <ArrowUpRight size={24} />
                    </span>
                  </div>
                </a>

                {/* 3. 한옥 카페 (준비중) */}
                <button
                  type="button"
                  className="hero-mega-card mega-card-ghost is-preparing"
                  onClick={() => alert('한옥카페는 오픈 준비 중입니다. 조금만 기다려주세요!')}
                  aria-label="3. 한옥 카페 (준비중)"
                  title="한옥카페 오픈 준비 중"
                >
                  <div className="mega-card-content">
                    <span className="mega-card-num">3.</span>
                    <span className="mega-card-title">한옥 카페</span>
                    <span className="mega-prep-text">준비중</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Hero Art - Clean Mascot with brand badges (No oval background frame) */}
            <div className="brand-hero-art hero-art-clean reveal">
              <div className="hero-mascot-card">
                <div className="hero-mascot-speech">
                  <span className="speech-badge">WELCOME TO CARTOON+</span>
                  <p>
                    어릴 적 가슴 뛰던 인생만화,
                    <br />
                    <strong>카툰플러스</strong>에서 다시 만나요!
                  </p>
                </div>
                <div className="hero-mascot-stage">
                  <img
                    src={MASCOT_ASSETS.reading}
                    alt="책 읽는 또리 마스코트"
                    className="hero-clean-mascot"
                    loading="eager"
                  />
                </div>
              </div>

              <div className="art-sun">
                SINCE
                <br />
                <strong>2018</strong>
              </div>
              <div className="art-label">
                COMIC
                <br />
                MULTIPLEX
              </div>

              <div className="art-note">
                <BookOpen size={16} /> 45,000권 단행본·웹툰
              </div>
            </div>
          </div>
          <div className="hero-scroll">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={15} />
          </div>
        </section>

        {/* 2. Used Comic Bookstore Zone (#FFFFFF) */}
        <section className="archive-section section-pad" id="archive" data-section="archive">
          <div className="container">
            <SectionHeading
              eyebrow="USED COMIC BOOK STORE · 온라인 & 오프라인 스토어"
              title={
                <>
                  중고만화책 쇼핑몰
                  <br />
                  <span className="highlight-text">인생만화, 여기서 다시 찾다</span>
                </>
              }
              description="어릴 적 가슴 뛰던 인생만화와 서점에서 사라진 절판 명작을 다시 소장해보세요. 전권 누락 없는 정직한 실물 검수와 실시간 온·오프라인 재고 연동으로 전해드립니다."
            />
            <div className="archive-layout">
              <div className="archive-intro reveal">
                <div className="archive-number">
                  135<span>,000+</span>
                </div>
                <div className="archive-breakdown-badge">
                  매장 사입 <strong>35,000권</strong> + 위탁 판매 <strong>100,000권</strong>
                </div>
                <p>
                  어릴 적 보았던 인생만화의 감동 그대로.
                  <br />
                  카툰플러스에서 추억의 명작을 다시 소장하세요.
                </p>

                {/* Real Book Archive Photo Frame */}
                <div className="archive-photo-frame">
                  <img
                    src="/assets/brand/exp_book_shelf.jpg"
                    alt="카툰플러스 135,000권 도서 아카이브 서가 실물 사진"
                    className="archive-real-photo"
                  />
                </div>

                <div className="mini-stamp">
                  <ScanLine size={19} /> REAL BOOK
                  <br />
                  VERIFIED
                </div>
              </div>

              <div className="metric-grid">
                <article className="metric-card reveal">
                  <div className="metric-icon yellow-icon">
                    <BookOpen />
                  </div>
                  <div>
                    <span className="metric-kicker">135,000+ VOLUMES</span>
                    <h3>국내 최대급 중고만화책 아카이브</h3>
                    <p>
                      <strong>매장 사입 35,000권 + 위탁 판매 100,000권</strong>
                      <br />총 <strong>135,000+ 권</strong>의 방대한 컬렉션
                    </p>
                  </div>
                  <ArrowRight className="card-arrow" />
                </article>

                <article className="metric-card reveal">
                  <div className="metric-icon coral-icon">
                    <Check />
                  </div>
                  <div>
                    <span className="metric-kicker">HONEST VERIFICATION</span>
                    <h3>전권 누락 없는 정직한 실물 검수</h3>
                    <p>
                      과장된 화학 공정 대신, <strong>권수 누락 확인</strong>과<br />
                      <strong>외관·내지 상태 전수 점검</strong>으로 정직하게 판매합니다.
                    </p>
                  </div>
                  <ArrowRight className="card-arrow" />
                </article>

                <article className="metric-card metric-card-wide reveal">
                  <div className="metric-icon blue-icon">
                    <BarChart3 />
                  </div>
                  <div>
                    <span className="metric-kicker">LIVE INVENTORY</span>
                    <h3>실시간 온라인·매장 재고 연동</h3>
                    <p>
                      bookis.store 온라인 쇼핑몰과 홍대 직영 매장 재고가 실시간 동기화되어 찾던 책을
                      바로 확인하고 안전하게 구매할 수 있습니다.
                    </p>
                  </div>
                  <span className="live-badge">
                    <i /> LIVE STOCK
                  </span>
                </article>
              </div>
            </div>

            <div className="action-bar reveal">
              <div>
                <span className="action-label">COMICS YOU CHERISHED</span>
                <strong>인생만화 소장의 기쁨을 지금 누려보세요</strong>
              </div>
              <div className="action-buttons">
                <a className="button button-dark" href={storeUrl} target="_blank" rel="noreferrer">
                  중고만화책 쇼핑몰 바로가기 (bookis.store) <ArrowUpRight size={17} />
                </a>
                <button
                  type="button"
                  className="button button-text"
                  onClick={() => scrollTo('stores')}
                >
                  홍대 직영 오프라인 매장 안내 <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Cafe Experience & Women-Safe Zone (#FFFDF0) */}
        <section
          className="experience-section section-pad"
          id="experience"
          data-section="experience"
        >
          <div className="container">
            <SectionHeading
              eyebrow="CAFE EXPERIENCE"
              title={
                <>
                  만화 그 이상의 즐거움,
                  <br />
                  <span className="pink-underline">하루가 달라지는 곳</span>
                </>
              }
              description="읽고, 보고, 놀고, 먹고, 쉬는 다섯 가지 방식의 카툰플러스."
            />
            <div className="experience-grid">
              {experiences.map(
                ({ number, label, title, description, icon: Icon, accent, photo }) => (
                  <article className={`experience-card ${accent} reveal`} key={label}>
                    <div className="experience-top">
                      <span className="experience-number">{number}</span>
                      <Icon size={23} />
                    </div>
                    {/* Real Photo Thumbnail */}
                    <div className="experience-photo-wrap">
                      <img src={photo} alt={title} className="experience-thumb-img" />
                    </div>
                    <span className="experience-label">{label}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <span className="experience-line" />
                  </article>
                )
              )}
            </div>

            {/* Women's Safety Zone - Prominent Highlight Band */}
            <div className="safety-band safety-band-prominent reveal" id="loop" data-section="loop">
              <div className="safety-header-banner">
                <span className="safety-badge">
                  <ShieldCheck size={16} /> WOMEN&apos;S SAFETY ZONE · 여성 안심 케어 매장
                </span>
                <span className="safety-accent-chip">24시간 안전 귀가 · 전용 편의 시설 완비</span>
              </div>

              <div className="safety-inner-grid">
                <div className="safety-content">
                  <h3>
                    혼자여도, 늦은 밤이어도
                    <br />
                    <em>안심하고 머무는 공간</em>
                  </h3>
                  <p>
                    카툰플러스는 여성 고객분들이 시간 제약 없이 안심하고 온전히 몰입할 수 있도록,
                    공간 조도부터 실시간 보안 관제와 전용 편의 시설까지 설계의 기본부터 다르게
                    만들었습니다.
                  </p>
                  <div className="safety-action-row">
                    <button
                      type="button"
                      className="safety-modal-btn"
                      onClick={() => setModal('store')}
                    >
                      여성 안심 매장 편의 시설 문의 📞
                    </button>
                    <span className="safety-note-text">
                      지점별 파우더룸 및 보안 시스템 즉시 안내
                    </span>
                  </div>
                </div>

                <div className="safety-points">
                  <div className="safety-point-item">
                    <div className="point-icon-wrap">
                      <Clock3 size={22} />
                    </div>
                    <strong>
                      24h 밝은
                      <br />
                      개방형 조도
                    </strong>
                    <span className="point-desc">300Lux+ 와이드 오픈 라이팅</span>
                  </div>
                  <div className="safety-point-item">
                    <div className="point-icon-wrap">
                      <MapPin size={22} />
                    </div>
                    <strong>
                      안심 귀가
                      <br />
                      역세권 입지
                    </strong>
                    <span className="point-desc">지하철역 출구 도보 1~3분 거리</span>
                  </div>
                  <div className="safety-point-item">
                    <div className="point-icon-wrap">
                      <Camera size={22} />
                    </div>
                    <strong>
                      사각지대 없는
                      <br />
                      CCTV 관제
                    </strong>
                    <span className="point-desc">매장 전 구역 24시간 실시간 모니터링</span>
                  </div>
                  <div className="safety-point-item">
                    <div className="point-icon-wrap">
                      <Sparkles size={22} />
                    </div>
                    <strong>
                      쾌적한 전용
                      <br />
                      파우더룸
                    </strong>
                    <span className="point-desc">여성 전용 편의 시설 &amp; 도어락</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Compact Store Locator (#FFFFFF) - Flagship Card + Branch List */}
        <section className="stores-section section-pad" id="stores" data-section="stores">
          <div className="container">
            <SectionHeading
              eyebrow="FIND YOUR CARTOONPLUS"
              title={
                <>
                  가장 가까운 곳에서
                  <br />
                  <span className="highlight-text">취향을 만나세요</span>
                </>
              }
              description="지점마다 다른 분위기, 변하지 않는 카툰플러스의 환대."
            />
            <div className="store-showcase-grid">
              {/* Left: Flagship Store Card (Hongdae) */}
              <article className="store-card store-card-flagship yellow reveal">
                <div className="store-card-top">
                  <span className="store-index">01</span>
                  <span className="store-type">{flagshipStore.type}</span>
                </div>
                <div className="store-visual">
                  <img
                    src={flagshipStore.photo}
                    alt={`${flagshipStore.name} 실제 매장 사진`}
                    className="store-real-photo"
                  />
                  <div className="store-pattern" />
                  <span className="store-bubble">{flagshipStore.bubble}</span>
                </div>
                <div className="store-info">
                  <div className="store-title-row">
                    <h3>{flagshipStore.name}</h3>
                    <span className="flagship-badge">본점 플래그십</span>
                  </div>
                  <p className="store-note">{flagshipStore.note}</p>
                  <div className="store-meta">
                    <span>
                      <Clock3 size={15} /> {flagshipStore.hours}
                    </span>
                    <span>
                      <MapPin size={15} /> {flagshipStore.address}
                    </span>
                  </div>
                  <div className="store-action-row">
                    <button
                      type="button"
                      className="branch-search-btn flagship-search-btn"
                      onClick={() => navigate(`/stores/${flagshipStore.slug}/books`)}
                    >
                      지점 도서 검색 바로가기 <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </article>

              {/* Right: Branch Stores List */}
              <div className="store-branch-panel reveal">
                <div className="branch-panel-head">
                  <span className="panel-kicker">NETWORK STORES</span>
                  <h3>카툰플러스 지점 안내</h3>
                  <p>전국 주요 역세권에서 카툰플러스를 만나보세요.</p>
                </div>

                <div className="branch-items-list">
                  {branchStores.map((branch, idx) => (
                    <article className="branch-item-card" key={branch.name}>
                      <div className="branch-item-header">
                        <div className="branch-title-group">
                          <span className="branch-idx">0{idx + 2}</span>
                          <h4>{branch.name}</h4>
                        </div>
                        <span className="branch-type-pill">{branch.type}</span>
                      </div>
                      <div className="branch-item-body">
                        <div className="branch-meta-row">
                          <MapPin size={14} className="meta-icon" />
                          <span>{branch.address}</span>
                        </div>
                        <div className="branch-meta-row">
                          <Clock3 size={14} className="meta-icon" />
                          <span>{branch.hours}</span>
                        </div>
                      </div>
                      {branch.hasBookSearch ? (
                        <div className="branch-item-action">
                          <button
                            type="button"
                            className="branch-search-btn"
                            onClick={() => navigate(`/stores/${branch.slug}/books`)}
                          >
                            지점 도서 검색 바로가기 <ArrowUpRight size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="branch-item-action branch-item-action-counter">
                          <span className="branch-counter-note">현장 카운터 도서 검색 지원</span>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Franchise Business Model & 3J Automation (#FFFDE8) */}
        <section className="business-section section-pad" id="business" data-section="business">
          <div className="container">
            <SectionHeading
              eyebrow="FRANCHISE BUSINESS MODEL"
              title={
                <>
                  공간 비즈니스를
                  <br />
                  <span className="highlight-text">더 똑똑하게</span> 만드는 방법
                </>
              }
              description="도서 물류 인프라와 3J 자동화 운영 솔루션의 결합."
            />
            <div className="automation-panel reveal">
              <div className="automation-copy">
                <span className="panel-kicker">CARTOONPLUS 3J AUTOMATION</span>
                <h3>
                  좋은 공간은
                  <br />
                  <em>운영에서 완성됩니다.</em>
                </h3>
                <p>
                  카툰플러스만의 도서 유통 노하우와 자동화 솔루션이 만나는 지점. 적은 인원으로도 더
                  나은 경험을 만듭니다.
                </p>
                <button type="button" className="inline-link" onClick={() => setModal('franchise')}>
                  가맹 및 창업 상담 신청 <ArrowRight size={17} />
                </button>
              </div>
              <div className="automation-diagram">
                <div className="diagram-track" />
                <div className="diagram-node node-yellow">
                  <span>01</span>
                  <LayoutGrid />
                  <strong>
                    SELF
                    <br />
                    KIOSK
                  </strong>
                </div>
                <div className="diagram-node node-coral">
                  <span>02</span>
                  <Radio />
                  <strong>
                    AUTO TTS
                    <br />
                    BROADCAST
                  </strong>
                </div>
                <div className="diagram-node node-blue">
                  <span>03</span>
                  <Search />
                  <strong>
                    INVENTORY
                    <br />
                    SEARCH
                  </strong>
                </div>
                <div className="diagram-node node-green">
                  <span>04</span>
                  <UsersRound />
                  <strong>
                    1-PERSON
                    <br />
                    EFFICIENCY
                  </strong>
                </div>
                <div className="diagram-caption">
                  <BellRing size={16} /> 반복 업무는 줄이고, 고객과의 시간은 늘리고
                </div>
              </div>
            </div>

            {/* 3J Accordion (Expandable explanation for '3J란?') */}
            <div className="three-j-accordion reveal">
              <button
                type="button"
                className={`three-j-toggle ${is3JOpen ? 'open' : ''}`}
                onClick={() => setIs3JOpen((prev) => !prev)}
                aria-expanded={is3JOpen}
              >
                <div className="three-j-toggle-left">
                  <span className="three-j-badge">FAQ</span>
                  <strong>3J 자동화 시스템이란 무엇인가요?</strong>
                  <span className="three-j-sub">열어서 자세한 운영 원리와 구성 살펴보기</span>
                </div>
                <div className="three-j-toggle-right">
                  <span className="toggle-label">{is3JOpen ? '접기' : '자세히 보기'}</span>
                  <ChevronDown className={`chevron-icon ${is3JOpen ? 'rotate' : ''}`} size={18} />
                </div>
              </button>

              {is3JOpen && (
                <div className="three-j-content">
                  <div className="three-j-cards">
                    <div className="three-j-card">
                      <div className="three-j-icon-row">
                        <span className="three-j-emoji" role="img" aria-label="비둘기">
                          🕊️
                        </span>
                        <span className="three-j-step">01 · FREEDOM</span>
                      </div>
                      <h4>고객에게 자유를</h4>
                      <ul className="three-j-list">
                        <li>
                          <Check size={14} className="three-j-check-icon" />
                          <span>편리한 매장 이용 안내</span>
                        </li>
                        <li>
                          <Check size={14} className="three-j-check-icon" />
                          <span>방해 없는 체류형 멀티플렉스 공간</span>
                        </li>
                      </ul>
                    </div>
                    <div className="three-j-card">
                      <div className="three-j-icon-row">
                        <span className="three-j-emoji" role="img" aria-label="손 든 사람">
                          🙋
                        </span>
                        <span className="three-j-step">02 · AUTONOMY</span>
                      </div>
                      <h4>직원에게 자율을</h4>
                      <ul className="three-j-list">
                        <li>
                          <Check size={14} className="three-j-check-icon" />
                          <span>주도적인 서비스 개선</span>
                        </li>
                        <li>
                          <Check size={14} className="three-j-check-icon" />
                          <span>직원이 편해야 고객도 편안해요</span>
                        </li>
                      </ul>
                    </div>
                    <div className="three-j-card">
                      <div className="three-j-icon-row">
                        <span className="three-j-emoji" role="img" aria-label="톱니바퀴">
                          ⚙️
                        </span>
                        <span className="three-j-step">03 · AUTOMATION</span>
                      </div>
                      <h4>시스템은 자동으로</h4>
                      <ul className="three-j-list">
                        <li>
                          <Check size={14} className="three-j-check-icon" />
                          <span>키오스크 &amp; 출입 관리 연동</span>
                        </li>
                        <li>
                          <Check size={14} className="three-j-check-icon" />
                          <span>도서 검색 및 운영 자동화</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="three-j-footer-note">
                    <HelpCircle size={17} />
                    <span>
                      <strong>3J 운영 철학</strong>: 고객의 체류 자유, 직원의 업무 자율, 시스템의
                      자동화가 어우러져 1인 점주도 여유롭고 안정적인 매장 운영을 실현합니다.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="roadmap-wrap reveal">
              <div className="roadmap-header">
                <span className="panel-kicker">FRANCHISE ROADMAP</span>
                <strong>카툰플러스 5단계 창업 성공 로드맵</strong>
              </div>
              <div className="roadmap">
                {roadmap.map((step, index) => (
                  <div className="roadmap-step" key={step}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step}</strong>
                    {index < roadmap.length - 1 && <ChevronRight className="roadmap-arrow" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Business Partnership Zone (#FFFFFF) */}
        <section className="partnership-section section-pad" data-section="partnership">
          <div className="container">
            <div className="partnership-heading reveal">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  BUSINESS PARTNERSHIP
                </div>
                <h2>
                  이야기가 있는 브랜드라면,
                  <br />
                  <span className="pink-underline">함께 만들 수 있습니다.</span>
                </h2>
              </div>
              <p>
                카툰플러스의 공간과 13만 5천 권의 아카이브를
                <br className="desktop-break" />
                새로운 경험의 무대로 활용해보세요.
              </p>
            </div>
            <div className="partnership-grid">
              <article className="partner-card reveal" onClick={() => setModal('partnership')}>
                <span className="partner-number">01</span>
                <div className="partner-icon">
                  <Sparkles />
                </div>
                <h3>
                  웹툰·출판 IP
                  <br />
                  오프라인 팝업
                </h3>
                <p>
                  작품의 세계관을 현실로 옮기는
                  <br />
                  기획 서가와 체험 공간
                </p>
                <button
                  type="button"
                  className="partner-arrow"
                  aria-label="제휴 및 협업 문의"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal('partnership');
                  }}
                >
                  <ArrowUpRight size={18} />
                </button>
              </article>

              <article className="partner-card reveal" onClick={() => setModal('partnership')}>
                <span className="partner-number">02</span>
                <div className="partner-icon">
                  <BookOpen />
                </div>
                <h3>
                  도서 대량 위탁 및<br />
                  매입 유통 제휴
                </h3>
                <p>
                  책의 다음 독자를 만나는
                  <br />
                  가장 빠르고 정확한 유통
                </p>
                <button
                  type="button"
                  className="partner-arrow"
                  aria-label="제휴 및 협업 문의"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal('partnership');
                  }}
                >
                  <ArrowUpRight size={18} />
                </button>
              </article>

              <article className="partner-card reveal" onClick={() => setModal('partnership')}>
                <span className="partner-number">03</span>
                <div className="partner-icon">
                  <Utensils />
                </div>
                <h3>
                  F&amp;B 및 브랜드
                  <br />
                  체험존 공간 협업
                </h3>
                <p>
                  머무는 시간을 더 풍성하게 하는
                  <br />
                  새로운 브랜드 콜라보레이션
                </p>
                <button
                  type="button"
                  className="partner-arrow"
                  aria-label="제휴 및 협업 문의"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal('partnership');
                  }}
                >
                  <ArrowUpRight size={18} />
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* 7. Global Vision & Trust Banner (#FFD400) */}
        <section className="vision-section" data-section="vision">
          <div className="vision-noise" />
          <div className="container">
            <div className="vision-top">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                OUR NEXT CHAPTER
              </span>
              <span className="vision-side">SEOUL → GLOBAL → EVERYWHERE</span>
            </div>
            <h2>
              대한민국을 넘어 세계로
              <br />
              <em>확장되는 만화 멀티플렉스 플랫폼</em>
            </h2>
            <div className="trust-grid">
              <div>
                <strong>
                  4<span>+</span>
                </strong>
                <span>전국 직영·가맹 지점 수</span>
              </div>
              <div>
                <strong>
                  135K<span>+</span>
                </strong>
                <span>누적 도서 취급량</span>
              </div>
              <div>
                <strong>98.4%</strong>
                <span>고객 만족도</span>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Integrated Inline Inquiry Form */}
        <section className="inquiry-section section-pad" id="inquiry" data-section="inquiry">
          <div className="container">
            <div className="inquiry-card reveal">
              <div className="inquiry-intro">
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  LET&apos;S TALK
                </div>
                <h2>
                  다음 이야기를
                  <br />
                  <span className="highlight-text">함께 시작해요.</span>
                </h2>
                <p>
                  가맹부터 브랜드 협업까지,
                  <br />
                  궁금한 점을 남겨주시면 빠르게 연락드릴게요.
                </p>
                <div className="inquiry-contact">
                  <span>PARTNERSHIP DESK</span>
                  <strong>010-4884-6588</strong>
                  <a href="mailto:5646588@naver.com">
                    5646588@naver.com <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

              <div className="form-area">
                <div className="form-tabs" role="tablist">
                  <button
                    type="button"
                    className={inquiryType === 'franchise' ? 'active' : ''}
                    onClick={() => {
                      setInquiryType('franchise');
                      setSubmitted(false);
                    }}
                    role="tab"
                    aria-selected={inquiryType === 'franchise'}
                  >
                    가맹 및 창업 상담
                  </button>
                  <button
                    type="button"
                    className={inquiryType === 'partnership' ? 'active' : ''}
                    onClick={() => {
                      setInquiryType('partnership');
                      setSubmitted(false);
                    }}
                    role="tab"
                    aria-selected={inquiryType === 'partnership'}
                  >
                    비즈니스 및 IP 제휴
                  </button>
                </div>

                {submitted ? (
                  <div className="success-state">
                    <span>
                      <Check size={28} />
                    </span>
                    <h3>상담 신청이 정상 접수되었습니다</h3>
                    <p>
                      카툰플러스 파트너십 데스크가 확인 후<br />
                      빠르게 연락드리겠습니다.
                    </p>
                    <button
                      type="button"
                      className="button button-dark"
                      onClick={() => setSubmitted(false)}
                    >
                      새 문의 남기기 <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitInquiry}>
                    <div className="form-grid">
                      <label>
                        {inquiryType === 'franchise' ? '성함 *' : '담당자명 *'}
                        <input
                          name="name"
                          required
                          placeholder={inquiryType === 'franchise' ? '홍길동' : '김담당 팀장'}
                        />
                      </label>
                      {inquiryType === 'franchise' ? (
                        <>
                          <label>
                            연락처 *
                            <input name="contact" required placeholder="010-0000-0000" />
                          </label>
                          <label>
                            희망 지역 *
                            <input
                              name="location"
                              required
                              placeholder="예: 서울 마포구 / 경기 성남시"
                            />
                          </label>
                          <label>
                            예상 창업 예산
                            <select name="budget" defaultValue="1억–2억">
                              <option value="1억 미만">1억 미만</option>
                              <option value="1억–2억">1억 ~ 2억 원</option>
                              <option value="2억 이상">2억 원 이상</option>
                              <option value="상담 후 결정">상담 후 결정</option>
                            </select>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            회사 / 브랜드명 *
                            <input name="company" required placeholder="(주)콘텐츠파트너스" />
                          </label>
                          <label>
                            연락처 *
                            <input name="contact" required placeholder="010-0000-0000" />
                          </label>
                          <label>
                            이메일 *
                            <input
                              name="email"
                              type="email"
                              required
                              placeholder="partner@company.com"
                            />
                          </label>
                          <label>
                            제휴 구분 *
                            <select name="category" defaultValue="웹툰·출판 IP">
                              <option value="웹툰·출판 IP">웹툰 · 출판 IP 콜라보</option>
                              <option value="도서 유통">도서 대량 유통 · 위탁</option>
                              <option value="F&B·브랜드 체험존">F&amp;B · 브랜드 체험존</option>
                              <option value="기타">공간 대관 및 기타 제휴</option>
                            </select>
                          </label>
                        </>
                      )}
                    </div>
                    {inquiryType === 'partnership' && (
                      <label className="full-label">
                        제안 제목 *
                        <input
                          name="subject"
                          required
                          placeholder="예: 신작 웹툰 단행본 특별 서가 및 팝업 프로모션 제안"
                        />
                      </label>
                    )}
                    <label className="full-label">
                      문의 내용 *
                      <textarea
                        name="message"
                        required
                        placeholder={
                          inquiryType === 'franchise'
                            ? '궁금한 점이나 희망하시는 오픈 시기를 자유롭게 적어주세요.'
                            : '제안 배경, 협업 방식, 희망 일정 등을 구체적으로 작성해 주세요.'
                        }
                        rows={4}
                      />
                    </label>
                    <label className="privacy-check">
                      <input
                        type="checkbox"
                        checked={privacy}
                        onChange={(event) => setPrivacy(event.target.checked)}
                      />
                      <span className="fake-check">
                        <Check size={12} />
                      </span>
                      <span>
                        개인정보 수집 및 이용에 동의합니다 (필수){' '}
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              '카툰플러스 상담 접수 및 안내를 위해 최소한의 개인정보를 수집하며, 목적 달성 후 안전하게 파기합니다.'
                            )
                          }
                        >
                          [전문보기]
                        </button>
                      </span>
                    </label>
                    <button className="submit-button" type="submit" disabled={!privacy}>
                      상담 신청하기 <Send size={17} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Cheonghae-style Structured Service Footer */}
      <footer className="footer" id="footer" data-section="footer">
        <div className="container">
          {/* Service Cards (입금계좌, 고객센터, 근무시간) */}
          <div className="footer-service-grid">
            {/* 1. 입금계좌안내 */}
            <div className="service-card bank-card">
              <div className="service-card-header">
                <CreditCard size={17} className="service-icon" />
                <h3>입금계좌안내</h3>
              </div>
              <div className="account-holder">
                예금주 : <strong>이재선 (카툰플러스)</strong>
              </div>
              <div className="bank-list">
                <div className="bank-item">
                  <span className="bank-name">KB국민은행</span>
                  <span className="bank-num">468001-01-153232</span>
                </div>
              </div>
            </div>

            {/* 2. 카툰플러스 고객센터 */}
            <div className="service-card cs-card">
              <div className="service-card-header">
                <Phone size={17} className="service-icon" />
                <h3>카툰플러스 고객센터</h3>
              </div>
              <div className="cs-table">
                <div className="cs-row">
                  <span className="cs-label">평일</span>
                  <a href="tel:010-4884-6588" className="cs-val cs-highlight">
                    010-4884-6588
                  </a>
                </div>
                <div className="cs-row">
                  <span className="cs-label">근무 외 시간</span>
                  <a href="tel:010-4884-6588" className="cs-val cs-highlight">
                    010-4884-6588
                  </a>
                </div>
              </div>
            </div>

            {/* 3. 근무시간 */}
            <div className="service-card hours-card">
              <div className="service-card-header">
                <Clock3 size={17} className="service-icon" />
                <h3>근무시간</h3>
              </div>
              <div className="cs-table">
                <div className="cs-row">
                  <span className="cs-label">고객센터 운영</span>
                  <span className="cs-val cs-highlight">연중무휴</span>
                </div>
                <div className="cs-row">
                  <span className="cs-label">상담시간</span>
                  <span className="cs-val">09:30 ~ 18:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Menu Links */}
          <div className="footer-nav-strip">
            <a href="#top">회사소개</a>
            <span className="sep">|</span>
            <a href="#inquiry">개인정보처리방침</a>
            <span className="sep">|</span>
            <a href="#inquiry">이용약관</a>
            <span className="sep">|</span>
            <a href="#archive">중고만화책 쇼핑몰</a>
            <span className="sep">|</span>
            <a href="#stores">지점 안내</a>
            <span className="sep">|</span>
            <a href="#inquiry">가맹·제휴 상담</a>
          </div>

          {/* Business Legal Information */}
          <div className="footer-legal-wrap">
            <p className="legal-line">
              <span>
                <strong>회사명</strong> 카툰플러스
              </span>
              <span className="bar">/</span>
              <span>
                <strong>주소</strong> 서울특별시 마포구 양화로16길 29, 지하1층 전층(홍익몰)
              </span>
            </p>
            <p className="legal-line">
              <span>
                <strong>사업자 등록번호</strong> 750-68-00236
              </span>
              <span className="bar">/</span>
              <span>
                <strong>대표</strong> 이재선
              </span>
              <span className="bar">/</span>
              <span>
                <strong>전화</strong> 010-4884-6588
              </span>
            </p>
            <p className="legal-line">
              <span>
                <strong>통신판매업신고번호</strong> 제 2026-서울마포-2738 호
              </span>
              <span className="bar">/</span>
              <span>
                <strong>개인정보 보호책임자</strong> 이재선
              </span>
              <span className="bar">/</span>
              <span>
                <strong>이메일</strong> 5646588@naver.com
              </span>
              <a
                href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=7506800236"
                target="_blank"
                rel="noreferrer"
                className="ftc-link"
              >
                [사업자정보확인]
              </a>
            </p>
            <p className="footer-copy">
              Copyright © 2018-2026 카툰플러스 (CartoonPlus). All Rights Reserved.
            </p>
          </div>

          {/* Trust & Escrow Badge Row */}
          <div className="footer-badge-row">
            <div className="trust-badge">
              <span className="badge-pill ftc">공정거래위원회</span>
              <span className="badge-sub">표준약관 준수사업자</span>
            </div>
            <div className="trust-badge">
              <span className="badge-pill ssl">SSL SECURE</span>
              <span className="badge-sub">256-bit 데이터 암호화 안전 접속</span>
            </div>
            <div className="trust-badge escrow">
              <span className="badge-pill escrow-pill">안전거래확인</span>
              <span className="escrow-text">
                고객님은 안전거래를 위해 현금 등으로 결제 시 안전거래(에스크로) 서비스를 이용하실 수
                있습니다.
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Store Action Button */}
      {showFloat && (
        <a
          className="floating-store show"
          href={storeUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="중고만화책 쇼핑몰 바로가기"
        >
          <ShoppingCart size={18} /> 중고만화책 쇼핑몰 바로가기 <ArrowUpRight size={15} />
        </a>
      )}

      {/* Inquiry Modal Dialog (for quick modal tests & direct inquiries) */}
      {modal && <InquiryModal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

// Config for InquiryModal
const INQUIRY_MODAL_CONFIG: Record<
  InquiryModalType,
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
    subtitle:
      '희망하시는 창업 지역과 예산 규모를 남겨주시면 담당자가 맞춤형 개설 안내를 도와드립니다.',
    submitLabel: '가맹 상담 신청하기 →',
    categories: [
      '신규 가맹 창업',
      '기존 매장 업종 전환',
      '복합 매장(카페+서점)',
      '상권 · 점포 입지 상담',
    ],
  },
  partnership: {
    eyebrow: '08 / PARTNERSHIP INQUIRY',
    title: '제휴 및 협업 문의',
    subtitle:
      '콘텐츠 IP, 도서 유통·위탁, 브랜드 프로모션 등 카툰플러스와 함께할 제안을 남겨주세요.',
    submitLabel: '제휴 제안 접수하기 →',
    categories: [
      '웹툰 · 출판 IP 콜라보',
      '도서 대량 유통 · 위탁',
      '브랜드 팝업 · 체험존',
      '공간 대관 · 촬영 협조',
    ],
  },
  store: {
    eyebrow: '06 / STORE & SAFETY HELP',
    title: '매장 이용 및 안심 문의',
    subtitle: '매장 이용 중 불편 사항이나 비대면 도움 요청, 분실물·단체 이용 문의를 남겨주세요.',
    submitLabel: '매장 문의 접수하기 →',
    categories: [
      '여성 안심 · 현장 도움 요청',
      '매장 시설 · 이용 문의',
      '분실물 확인 요청',
      '단체 방문 · 예약 문의',
    ],
  },
};

function InquiryModal({ type, onClose }: { type: InquiryModalType; onClose: () => void }) {
  const config = INQUIRY_MODAL_CONFIG[type];
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
      <div
        className="inquiry-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
      >
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
                <div className="modal-form-grid">
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
                    <input
                      type="text"
                      name="region"
                      placeholder="예: 서울 마포구 / 경기 분당"
                      required
                    />
                  </label>
                  <label>
                    예상 투자 예산
                    <select name="budget" defaultValue="1억–2억">
                      <option value="1억 미만">1억 미만</option>
                      <option value="1억–2억">1억 ~ 2억 원</option>
                      <option value="2억 이상">2억 원 이상</option>
                      <option value="상담 후 결정">상담 후 결정</option>
                    </select>
                  </label>
                </div>
              )}

              {type === 'partnership' && (
                <div className="modal-form-grid">
                  <label>
                    기업 · 기관명 *
                    <input type="text" name="company" placeholder="(주)카툰파트너스" required />
                  </label>
                  <label>
                    담당자 성함 *
                    <input type="text" name="contactName" placeholder="김담당 팀장" required />
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
                <div className="modal-form-grid">
                  <label>
                    방문 지점 선택 *
                    <select name="store" defaultValue="홍대점">
                      <option value="홍대점">홍대점 (24시간 플래그십)</option>
                      <option value="서울대입구역점">서울대입구역점</option>
                      <option value="잠실점">잠실점</option>
                    </select>
                  </label>
                  <label>
                    성함 (또는 닉네임) *
                    <input type="text" name="name" placeholder="성함 또는 닉네임" required />
                  </label>
                </div>
              )}

              <label className="modal-message-label">
                상세 문의 내용 *
                <textarea
                  name="message"
                  rows={4}
                  placeholder="궁금하신 내용이나 제안 사항을 적어주세요."
                  required
                />
              </label>

              <label className="modal-consent-row">
                <input type="checkbox" name="consent" required />
                <span>개인정보 수집·이용에 동의합니다. (필수)</span>
              </label>

              <button type="submit" className="modal-submit-button">
                {config.submitLabel}
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success-state">
            <div className="modal-success-icon" aria-hidden="true">
              ✓
            </div>
            <h2>문의가 정상 접수되었습니다</h2>
            <p>담당자 확인 후 신속히 안내드리겠습니다.</p>
            <button type="button" className="button button-dark" onClick={onClose}>
              창 닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
