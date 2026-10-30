import { useEffect, useState, type FormEvent, type ReactNode, type SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';
import { OFFICIAL_BRAND_ASSETS } from '../../lib/brandAssets';
import { getPublicStore } from '../../lib/storeContext';
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

const ArrowDownRight = (props: IconProps) => (
  <IconBase {...props}><path d="m7 7 10 10" /><path d="M17 7v10H7" /></IconBase>
);
const ArrowUpRight = (props: IconProps) => (
  <IconBase {...props}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></IconBase>
);
const MoveRight = (props: IconProps) => (
  <IconBase {...props}><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></IconBase>
);
const ChevronRight = (props: IconProps) => (
  <IconBase {...props}><path d="m9 18 6-6-6-6" /></IconBase>
);
const Check = (props: IconProps) => (
  <IconBase {...props}><path d="M20 6 9 17l-5-5" /></IconBase>
);
const X = (props: IconProps) => (
  <IconBase {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></IconBase>
);
const Menu = (props: IconProps) => (
  <IconBase {...props}><path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h16" /></IconBase>
);
const Star = (props: IconProps) => (
  <IconBase {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></IconBase>
);
const Clock3 = (props: IconProps) => (
  <IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16.5 12" /></IconBase>
);
const MapPin = (props: IconProps) => (
  <IconBase {...props}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></IconBase>
);
const LocateFixed = (props: IconProps) => (
  <IconBase {...props}><line x1="2" x2="5" y1="12" y2="12" /><line x1="19" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="5" /><line x1="12" x2="12" y1="19" y2="22" /><circle cx="12" cy="12" r="7" /></IconBase>
);
const Sparkles = (props: IconProps) => (
  <IconBase {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></IconBase>
);
const Send = (props: IconProps) => (
  <IconBase {...props}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></IconBase>
);
const MonitorPlay = (props: IconProps) => (
  <IconBase {...props}><rect width="20" height="14" x="2" y="3" rx="2" /><path d="M12 17v4" /><path d="M8 21h8" /><polygon points="10 7 15 10 10 13 10 7" /></IconBase>
);
const BookOpen = (props: IconProps) => (
  <IconBase {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></IconBase>
);
const Gamepad2 = (props: IconProps) => (
  <IconBase {...props}><line x1="6" x2="10" y1="11" y2="11" /><line x1="8" x2="8" y1="9" y2="13" /><line x1="15" x2="15.01" y1="12" y2="12" /><line x1="18" x2="18.01" y1="10" y2="10" /><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" /></IconBase>
);
const Utensils = (props: IconProps) => (
  <IconBase {...props}><path d="M18 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /></IconBase>
);
const Instagram = (props: IconProps) => (
  <IconBase {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></IconBase>
);
const Youtube = (props: IconProps) => (
  <IconBase {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><polygon points="10 15 15 12 10 9 10 15" /></IconBase>
);

type InquiryType = 'franchise' | 'general';

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

const experiences = [
  {
    number: '01',
    eyebrow: 'WATCH / RELAX',
    title: 'OTT\n시네마',
    description: '보고 싶었던 콘텐츠를 큰 화면으로, 내 속도에 맞춰 누워서 즐기는 프라이빗 시네마.',
    meta: 'NETFLIX · DISNEY+ · TVING · WATCHA',
    icon: MonitorPlay,
    image: '/assets/store_photos/hongdae/hongdae_02.jpg',
    className: 'experience-coral',
  },
  {
    number: '02',
    eyebrow: 'READ / DIVE IN',
    title: '3만 권\n도서 아카이브',
    description: '매주 업데이트되는 최신 인기 웹툰부터 클래식 명작 만화까지 방대한 컬렉션.',
    meta: '30,000+ BOOKS',
    icon: BookOpen,
    image: '/assets/store_photos/hongdae/hongdae_03.jpg',
    className: 'experience-blue',
  },
  {
    number: '03',
    eyebrow: 'PLAY / TOGETHER',
    title: '게임\n라운지',
    description: '닌텐도 스위치 대전부터 50여 종의 엄선된 보드게임과 퍼즐이 준비된 플레이 공간.',
    meta: 'CONSOLE · BOARD GAME',
    icon: Gamepad2,
    image: '/assets/store_photos/common/boardgame.jpg',
    className: 'experience-lime',
  },
  {
    number: '04',
    eyebrow: 'EAT / REFUEL',
    title: '셀프 토핑 키친\n& 카페',
    description: '계란·파·떡 무료 토핑 즉석 라면과 바리스타 커피, 시원한 음료와 간식 라인업.',
    meta: 'RAMEN · COFFEE · SNACK',
    icon: Utensils,
    image: '/assets/store_photos/common/ramen.png',
    className: 'experience-yellow',
  },
];

const stores: Store[] = [
  {
    name: '홍대점',
    slug: 'hongdae',
    english: 'HONGDAE 24H',
    number: '01',
    description: '24시간 잠들지 않는 홍대의 복합문화 플래그십.',
    details: ['24시간 연중무휴', '홍익몰 지하 1층 전층', '닌텐도 스위치 대규모 부스'],
    images: [
      '/assets/store_photos/hongdae-2.jpg',
      '/assets/store_photos/hongdae-1.jpg',
      '/assets/store_photos/hongdae-3.jpg',
    ],
    mapLabel: '홍익몰 B1',
  },
  {
    name: '서울대입구역점',
    slug: 'snu',
    english: 'SNU STATION',
    number: '02',
    description: '대형 서가와 조용한 독립 룸이 있는 편안한 아지트.',
    details: ['서울대입구역 2번 출구 도보 3분', '3만 권 대형 서가', '독립형 룸 & 힐링존'],
    images: [
      '/assets/brand/landing/snu-1.jpg',
      '/assets/brand/landing/snu-2.jpg',
      '/assets/brand/landing/snu-3.jpg',
    ],
    mapLabel: '2번 출구 3분',
  },
  {
    name: '잠실점',
    slug: 'jamsil',
    english: 'JAMSIL',
    number: '03',
    description: '도심 한가운데 둘만의 아늑한 페이지.',
    details: ['잠실새내역 인근', '넓고 쾌적한 2층 전층', '커플 특화 룸 & 디저트 카페'],
    images: [
      '/assets/store_photos/jamsil-2.jpg',
      '/assets/store_photos/jamsil-1.jpg',
      '/assets/store_photos/jamsil-3.jpg',
    ],
    mapLabel: '잠실새내역 인근',
  },
];

const network = [
  { name: '서울 거점', count: '10+', color: 'network-city' },
  { name: '경기·인천', count: '08', color: 'network-suburb' },
  { name: '주요 광역', count: '05', color: 'network-region' },
];

const interestOptions = ['가맹 상담', '일반 문의', '제휴 / 콜라보', '입점 / 기타'];

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
  const navigate = useNavigate();

  useReveal();

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--brand-scroll-progress', `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`);
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

  const jump = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <div className="brand-progress" aria-hidden="true"><span /></div>
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
          <img
            src={OFFICIAL_BRAND_ASSETS.logoRed}
            alt="카툰플러스 로고"
            className="brand-logo-img"
          />
        </a>

        <div className={`nav-panel ${menuOpen ? 'nav-panel-open' : ''}`}>
          <nav className="main-nav" aria-label="주요 메뉴">
            <button type="button" onClick={() => jump('experience')}>
              공간과 경험
            </button>
            <button type="button" onClick={() => jump('time')}>
              이용 안내
            </button>
            <button type="button" onClick={() => jump('stores')}>
              지점 찾기
            </button>
            <button type="button" onClick={() => navigate('/books')}>
              도서 검색
            </button>
            <button type="button" onClick={() => jump('franchise')}>
              가맹 안내
            </button>
          </nav>
          <button
            type="button"
            className="header-cta"
            onClick={() => setModal('franchise')}
          >
            가맹 상담 <ArrowUpRight size={15} />
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
      <main>
        {/* 1. Hero Section */}
        <section className="hero-section" id="top">
          <div className="hero-pattern" />
          <div className="hero-ticker" aria-hidden="true">
            <span>TAKE OFF YOUR SHOES · STAY AS LONG AS YOU LIKE · CARTOON PLUS · </span>
            <span>TAKE OFF YOUR SHOES · STAY AS LONG AS YOU LIKE · CARTOON PLUS · </span>
          </div>

          <div className="hero-copy" data-reveal>
            <p className="eyebrow">
              <span className="eyebrow-dot" /> COMFY CULTURE LOUNGE
            </p>
            <h1>
              만화, 게임, 그리고<br />
              <em>온전한 쉼</em>이 시작돼요.
            </h1>
            <p className="hero-description">
              신발을 벗는 순간 만나는 나만의 아늑한 아지트.<br />
              원하는 만큼 머무는 도심 속 복합문화 만화카페.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#experience">
                공간 둘러보기 <ArrowDownRight size={17} />
              </a>
              <button
                type="button"
                className="text-link"
                onClick={() => setModal('franchise')}
              >
                가맹 및 창업 상담 신청 <MoveRight size={17} />
              </button>
            </div>
          </div>

          <div className="hero-art" data-reveal>
            <div className="hero-sun" />
            <div className="hero-note note-one">
              <span>01</span> REST MODE<br />ACTIVATED
            </div>
            <div className="hero-note note-two">
              <Star size={13} fill="currentColor" /> NO SHOES, NO WORRIES
            </div>

            {/* Space Magazine Card */}
            <div className="character-card">
              <div className="character-card-top">
                <span>CARTOON PLUS ARCHIVE</span>
                <span>VOL. 2026</span>
              </div>
              <div className="character-card-img-wrap">
                <img
                  src="/assets/store_photos/hongdae-2.jpg"
                  alt="카툰플러스 서가 및 룸 인테리어"
                />
              </div>
              <div className="character-card-caption">
                <strong>
                  COMFY IS A<br />
                  <span>SUPERPOWER.</span>
                </strong>
                <small>
                  도심 속<br />
                  나만의 쉼표
                </small>
              </div>
            </div>

            <img className="hero-mascot" src="/assets/mascot/mascot_relaxing.png" alt="" aria-hidden="true" />
            <div className="hero-sticker">
              집 앞처럼<br />
              <strong>편안하게</strong>
            </div>
          </div>

          <div className="hero-scroll">
            <span>SCROLL TO EXPLORE</span>
            <span className="scroll-line" />
          </div>
        </section>

        {/* 2. 4 Experiences Section */}
        <section className="experience-section section-pad" id="experience">
          <SectionIntro
            index="01 / 04"
            label="ONE SPACE, UNLIMITED FREEDOM"
            title={
              <>
                여기선 취향이<br />
                <span>시간이 돼요.</span>
              </>
            }
            body="보고, 읽고, 놀고, 먹으며 각자의 속도로 쉬어 가는 공간. 카툰플러스에서 나만의 시간을 즐겨보세요."
          />

          <div className="experience-grid">
            {experiences.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  className={`experience-card ${item.className}`}
                  key={item.number}
                  data-reveal
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="card-top">
                    <span>{item.number}</span>
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <img className="experience-photo" src={item.image} alt="" loading="lazy" />
                  <div className="experience-card-copy">
                    <p className="card-eyebrow">{item.eyebrow}</p>
                    <h3>
                      {item.title.split('\n').map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="card-meta">
                    <span>{item.meta}</span>
                    <ArrowUpRight size={16} />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="experience-footnote" data-reveal>
            <span className="scribble-arrow">↗</span>
            <p>
              잠깐 들러도, 하루 종일 있어도<br />
              <strong>언제나 부담 없는 즐거움.</strong>
            </p>
            <img
              src="/assets/store_photos/common/ramen.png"
              alt="카툰플러스 즉석 라면"
              className="experience-footnote-img"
            />
          </div>
        </section>

        {/* 3. Time Section (Flexible Hours) */}
        <section className="time-section" id="time">
          <div className="time-marquee" aria-hidden="true">
            <span>YOUR TIME. YOUR WAY. YOUR CARTOON PLUS. &nbsp; </span>
            <span>YOUR TIME. YOUR WAY. YOUR CARTOON PLUS. &nbsp; </span>
          </div>

          <div className="time-inner section-pad">
            <div className="time-copy" data-reveal>
              <p className="eyebrow">
                <Clock3 size={15} /> FLEXIBLE STAY
              </p>
              <h2>
                오늘은<br />
                <em>얼마나</em> 머물까요?
              </h2>
              <p>
                1시간의 가벼운 쉼표부터<br />
                하루를 온전히 맡기는 종일 휴식까지.<br />
                부담 없는 합리적인 가격으로 누리는 자유.
              </p>
            </div>

            <div className="time-wheel" data-reveal>
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="wheel-center">
                <span>MY PACE</span>
                <strong>자유로운 이용</strong>
                <Clock3 size={20} />
              </div>

              <div className="wheel-label label-hour">
                <strong>1H</strong>
                <span>가벼운 쉼표</span>
              </div>
              <div className="wheel-label label-half">
                <strong>3H</strong>
                <span>여유로운 몰입</span>
              </div>
              <div className="wheel-label label-day">
                <strong>ALL-DAY</strong>
                <span>하루 종일 무제한</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Stores Showcase Section */}
        <StoresSection />

        {/* 5. Network Section */}
        <section className="network-section section-pad">
          <div className="network-top" data-reveal>
            <div>
              <p className="eyebrow">
                <LocateFixed size={15} /> CARTOON PLUS NETWORK
              </p>
              <h2>
                도심 곳곳에<br />
                <span>편안함을 심어요.</span>
              </h2>
            </div>
            <p className="network-intro">
              서울과 수도권, 그리고 주요 거점까지.<br />
              카툰플러스의 가맹 네트워크가<br />
              더 많은 이웃에게 닿고 있습니다.
            </p>
          </div>

          <div className="network-map" data-reveal>
            <div className="map-grid" />
            <div className="map-route route-one" />
            <div className="map-route route-two" />
            <div className="map-route route-three" />

            <span className="map-pin pin-seoul">
              <i />
              SEOUL
            </span>
            <span className="map-pin pin-incheon">
              <i />
              INCHEON
            </span>
            <span className="map-pin pin-gyeonggi">
              <i />
              GYEONGGI
            </span>
            <span className="map-pin pin-busan">
              <i />
              BUSAN
            </span>

            <div className="map-caption">
              <span>OPERATING NOW</span>
              <strong>
                서울 · 수도권<br />
                주요 거점
              </strong>
              <ArrowUpRight size={18} />
            </div>
          </div>

          <div className="network-stats" data-reveal>
            {network.map((item) => (
              <div className={`network-stat ${item.color}`} key={item.name}>
                <span className="stat-number">{item.count}</span>
                <span className="stat-name">{item.name}</span>
                <span className="stat-note">매장 운영 중</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Franchise & Business Section */}
        <section className="franchise-section section-pad" id="franchise">
          <div className="franchise-card" data-reveal>
            <div className="franchise-main">
              <p className="eyebrow">
                <Sparkles size={15} /> BE A PART OF THE STORY
              </p>
              <h2>
                당신의 동네에<br />
                <em>다음 안식처</em>를 열어요.
              </h2>
              <p>
                시간제 이용료, F&B 식음료, 부대시설이 결합된 검증된 복합 매출 모델.
                안정적인 운영 구조를 갖춘 카툰플러스와 함께 새로운 공간 비즈니스를 시작해보세요.
              </p>
              <button
                type="button"
                className="button button-light"
                onClick={() => setModal('franchise')}
              >
                가맹 상담 신청 <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="franchise-side">
              <img
                src="/assets/store_photos/contact-sheet.jpg"
                alt="카툰플러스 매장 인테리어 전경"
                className="franchise-side-img"
              />
              <div className="revenue-orbit">
                <div className="revenue-center">
                  PLUS<br />
                  <span>MODEL</span>
                </div>
                <span className="revenue-tag revenue-tag-one">TIME PASS</span>
                <span className="revenue-tag revenue-tag-two">F&amp;B</span>
                <span className="revenue-tag revenue-tag-three">PLAY</span>
              </div>
            </div>
          </div>

          <div className="contact-strip" data-reveal>
            <div>
              <p className="eyebrow">HAVE A QUESTION?</p>
              <h3>
                일반 문의 및 제휴도<br />
                <span>편하게 남겨주세요.</span>
              </h3>
            </div>
            <button
              type="button"
              className="round-arrow-button"
              aria-label="일반 제휴 문의"
              onClick={() => setModal('general')}
            >
              <ArrowUpRight size={22} />
            </button>
          </div>
        </section>
      </main>

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
              <a href="#experience">공간과 경험</a>
              <a href="#stores">지점 안내</a>
              <a href="/books">도서 검색</a>
            </div>
            <div>
              <span className="footer-label">CONTACT</span>
              <button type="button" onClick={() => setModal('franchise')}>
                가맹 상담
              </button>
              <button type="button" onClick={() => setModal('general')}>
                일반·제휴 문의
              </button>
            </div>
            <div>
              <span className="footer-label">CHANNELS</span>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram size={15} /> Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <Youtube size={15} /> Youtube
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

function SectionIntro({
  index,
  label,
  title,
  body,
}: {
  index: string;
  label: string;
  title: ReactNode;
  body: string;
}) {
  return (
    <div className="section-intro" data-reveal>
      <div className="section-index">
        <span>{index}</span>
        <span className="index-line" />
      </div>
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
        <p className="section-body">{body}</p>
      </div>
    </div>
  );
}

function StoresSection() {
  const [active, setActive] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const navigate = useNavigate();

  const store = stores[active];
  const storeInfo = getPublicStore(store.slug);

  const changeStore = (index: number) => {
    setActive(index);
    setActivePhoto(0);
  };

  return (
    <section className="stores-section section-pad" id="stores">
      <SectionIntro
        index="02 / 04"
        label="FIND YOUR COMFY CORNER"
        title={
          <>
            오늘의 쉼표는<br />
            <span>어느 지점인가요?</span>
          </>
        }
        body="동네마다 다른 매력을 가진 카툰플러스. 가까운 매장에서 나만의 아늑한 자리를 찾아보세요."
      />

      <div className="store-showcase" data-reveal>
        <div className="store-photo-main">
          <img
            src={store.images[activePhoto]}
            alt={`${store.name} 사진 ${activePhoto + 1}`}
          />
          <div className="photo-overlay">
            <span>{store.english}</span>
            <span>SPACE GALLERY / 2026</span>
          </div>
          <div className="photo-count">
            <span>0{activePhoto + 1}</span>
            <span>/ 03</span>
          </div>
        </div>

        <div className="store-info-panel">
          <div className="store-number">{store.number} / 03</div>
          <p className="card-eyebrow">CARTOON PLUS · {store.english}</p>
          <h3>카툰플러스 {store.name}</h3>
          <p className="store-tagline">{store.description}</p>
          <ul>
            {store.details.map((detail) => (
              <li key={detail}>
                <Check size={16} />
                {detail}
              </li>
            ))}
          </ul>
          {storeInfo && <div className="store-visit-info">
            <p>{storeInfo.address}</p>
            <p>{storeInfo.hours}</p>
            <a href={`https://map.naver.com/p/search/${encodeURIComponent(`카툰플러스 ${store.name}`)}`} target="_blank" rel="noopener noreferrer">지도에서 찾기 ↗</a>
          </div>}
          <div className="store-actions">
            <button
              type="button"
              className="button button-dark"
              onClick={() => navigate(`/stores/${store.slug}/books`)}
            >
              이 지점 도서 검색 <ArrowUpRight size={15} />
            </button>
            <span className="map-button">
              <MapPin size={15} /> {store.mapLabel}
            </span>
          </div>
        </div>

        <div className="store-thumbnails">
          {store.images.map((image, index) => (
            <button
              type="button"
              key={image}
              className={index === activePhoto ? 'active' : ''}
              aria-pressed={index === activePhoto}
              onClick={() => setActivePhoto(index)}
              aria-label={`${store.name} 사진 ${index + 1}`}
            >
              <img src={image} alt={`${store.name} 썸네일 ${index + 1}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="store-tabs" data-reveal>
        {stores.map((item, index) => (
          <button
            type="button"
            className={index === active ? 'active' : ''}
            aria-pressed={index === active}
            key={item.name}
            onClick={() => changeStore(index)}
          >
            <span>0{index + 1}</span>
            <strong>{item.name}</strong>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
    </section>
  );
}

function InquiryModal({ type, onClose }: ModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(
    type === 'franchise' ? '가맹 상담' : '일반 문의'
  );
  const title = type === 'franchise' ? '가맹 상담 신청' : '일반·제휴 문의';
  const description =
    type === 'franchise'
      ? '카툰플러스와 함께 열어갈 다음 공간에 대해 들려주세요.'
      : '궁금한 점이나 함께하고 싶은 아이디어를 남겨주세요.';

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      type,
      interest: selectedInterest,
      name: form.get('name'),
      phone: form.get('phone'),
      region: form.get('region'),
      schedule: form.get('schedule'),
      message: form.get('message'),
      createdAt: new Date().toISOString(),
    };

    try {
      const current = JSON.parse(
        localStorage.getItem('cartoonplus_inquiries') || '[]'
      );
      localStorage.setItem(
        'cartoonplus_inquiries',
        JSON.stringify([...current, payload])
      );
    } catch {
      // ignore
    }

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
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="문의 창 닫기"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="success-state">
            <div className="success-icon">
              <Check size={28} />
            </div>
            <p className="eyebrow">MESSAGE RECEIVED</p>
            <h2>정상 접수되었습니다</h2>
            <p>
              남겨주신 문의 내용을 확인한 후<br />
              담당자가 신속하게 연락드리겠습니다.
            </p>
            <button
              type="button"
              className="button button-dark"
              onClick={onClose}
            >
              확인 <ArrowUpRight size={15} />
            </button>
          </div>
        ) : (
          <>
            <div className="modal-heading">
              <p className="eyebrow">
                {type === 'franchise' ? 'FRANCHISE INQUIRY' : 'GENERAL INQUIRY'}
              </p>
              <h2 id="inquiry-title">{title}</h2>
              <p>{description}</p>
            </div>

            <form onSubmit={submit}>
              <div className="interest-pills">
                {interestOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={selectedInterest === option ? 'selected' : ''}
                    onClick={() => setSelectedInterest(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="form-grid">
                <label>
                  성명
                  <input name="name" required placeholder="성함을 입력하세요" />
                </label>
                <label>
                  연락처
                  <input
                    name="phone"
                    required
                    type="tel"
                    placeholder="010-0000-0000"
                  />
                </label>

                {type === 'franchise' && (
                  <>
                    <label>
                      희망 지역
                      <input
                        name="region"
                        required
                        placeholder="예: 서울 마포구, 경기 성남시"
                      />
                    </label>
                    <label>
                      오픈 희망 시기
                      <select name="schedule" defaultValue="">
                        <option value="" disabled>
                          희망 시기 선택
                        </option>
                        <option>3개월 이내</option>
                        <option>6개월 이내</option>
                        <option>1년 이내</option>
                        <option>미정 / 상담 후 결정</option>
                      </select>
                    </label>
                  </>
                )}
              </div>

              <label className="message-label">
                문의 내용
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="궁금하신 내용이나 상담 희망 사항을 자유롭게 적어주세요."
                />
              </label>

              <button
                className="button button-primary submit-button"
                type="submit"
              >
                문의 접수하기 <Send size={15} />
              </button>

              <p className="form-privacy">
                제출하신 정보는 가맹 상담 및 문의 응대 목적으로만 안전하게 사용됩니다.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
