import { useEffect, useState } from 'react';
import relaxingMascot from '../../assets/mascot_relaxing.png';
import readingMascot from '../../assets/mascot_reading.png';
import ottMascot from '../../assets/mascot_ott.png';
import gamingMascot from '../../assets/mascot_gaming.png';
import massageMascot from '../../assets/mascot_massage.png';
import storePhoto1 from '../../assets/store_photo_043.jpg';
import storePhoto2 from '../../assets/store_photo_049.jpg';
import storePhoto3 from '../../assets/store_photo_03.jpg';
import { loadNewArrivals } from '../book-search/catalogueRepository';
import type { SearchableBook } from '../../lib/bookSearch';
import { getFeaturedEvent, getBannerImageUrl, type ManagedEvent } from '../../lib/eventRepository';

// 도서검색과 게임만 링크 이동, OTT룸과 안마의자는 정보 제공
const ENJOY_POINTS = [
  {
    icon: readingMascot,
    title: '만화 · 웹툰',
    desc: '수만 권 규모 서가와 매주 들어오는 신간을 검색으로 바로 찾기',
    cta: '도서 검색 →',
    href: '/books',
  },
  {
    icon: ottMascot,
    title: 'OTT 룸',
    desc: '넷플릭스·티빙·디즈니+를 대형 스크린 암막 굴방에서 편안하게 시청',
    cta: '상시 무료 이용',
    href: null,
  },
  {
    icon: gamingMascot,
    title: '게임 · 보드게임',
    desc: '실물 확인된 스위치·PS4 타이틀과 보드게임 자유 이용',
    cta: '즐길거리 →',
    href: '/games',
  },
  {
    icon: massageMascot,
    title: '무료 안마의자',
    desc: '매장 이용 고객 누구나 100% 무료로 언제든 쓰는 바디프랜드 힐링 존',
    cta: '100% 무료 힐링',
    href: null,
  },
];

const POPULAR_PRICES = [
  { name: '기본 1시간', price: '3,600원', note: '음료 미포함' },
  { name: '2시간 + 기본 음료', price: '9,500원', note: '가장 인기 있는 패키지' },
  { name: '평일 종일권', price: '20,000원', note: '하루 종일 무제한 힐링' },
];

import { usePageTitle } from '../../lib/usePageTitle';

export function HomePage() {
  usePageTitle();
  const [newBooks, setNewBooks] = useState<SearchableBook[]>([]);
  const [featured, setFeatured] = useState<ManagedEvent>(() => getFeaturedEvent());

  useEffect(() => {
    void loadNewArrivals().then((books) => setNewBooks(books.slice(0, 3)));
    const syncFeatured = () => setFeatured(getFeaturedEvent());
    window.addEventListener('events_updated', syncFeatured);
    window.addEventListener('storage', syncFeatured);
    return () => {
      window.removeEventListener('events_updated', syncFeatured);
      window.removeEventListener('storage', syncFeatured);
    };
  }, []);

  return (
    <>
      {/* 1. Hero 섹션 */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-badge">서울대입구역 3번 출구 도보 1분</span>
          <h1>만화, 게임, 그리고<br />제대로 쉬는 시간</h1>
          <p className="hero-desc">
            수만 권의 만화와 OTT 룸, 닌텐도 스위치, 보드게임, 무료 안마의자, 즉석 라면 셀프바까지.
            하루를 통째로 쉬어 갈 수 있는 복합 힐링 공간입니다.
          </p>
          <div className="hero-actions">
            <a className="primary-btn" href="/books">
              도서 검색하기 <span>→</span>
            </a>
            <a className="secondary-btn" href="/store">
              오시는 길
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-val">10:00–23:00</div>
              <div className="hero-stat-lbl">연중무휴 영업</div>
            </div>
            <div>
              <div className="hero-stat-val">3,600원</div>
              <div className="hero-stat-lbl">기본 1시간부터</div>
            </div>
          </div>
        </div>
        <div className="hero-art">
          <img src={relaxingMascot} alt="쉬고 있는 카툰플러스 마스코트" />
        </div>
      </section>

      {/* 2. 네 가지 방식으로 쉬어 가세요 (도서검색, 게임만 이동 / OTT, 안마의자는 정보 제공) */}
      <section>
        <div className="section-header">
          <div>
            <div className="section-kicker">WHAT TO ENJOY</div>
            <h2 className="section-title">네 가지 방식으로 쉬어 가세요</h2>
          </div>
        </div>
        <div className="feature-grid">
          {ENJOY_POINTS.map((item) => (
            <div key={item.title} className="feature-card">
              <div className="feature-icon-wrap">
                <img src={item.icon} alt={item.title} />
              </div>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
              {item.href ? (
                <a
                  href={item.href}
                  style={{
                    color: '#8A6A00',
                    fontSize: '13px',
                    fontWeight: 900,
                    marginTop: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {item.cta}
                </a>
              ) : (
                <span
                  style={{
                    color: '#8A8175',
                    fontSize: '12px',
                    fontWeight: 800,
                    marginTop: 'auto',
                  }}
                >
                  {item.cta}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. 최근 30일 신규 입고 */}
      <section>
        <div className="section-header">
          <div>
            <div className="section-kicker">NEW ARRIVALS</div>
            <h2 className="section-title">최근 30일 신규 입고</h2>
          </div>
          <a href="/new-arrivals" className="view-all-btn">
            전체 보기 →
          </a>
        </div>
        {newBooks.length > 0 ? (
          <div className="new-arrivals-grid">
            {newBooks.map((book) => (
              <div key={book.id} className="new-book-card">
                <div className="book-badges">
                  <span className="badge-new">NEW</span>
                  <span className="badge-genre">{book.category || '기타'}</span>
                </div>
                <div className="new-book-title">{book.title}</div>
                <div className="new-book-author">{book.author || '작가 정보 없음'}</div>
                <div className="new-book-meta">
                  <span>{book.volumeRange}</span>
                  <span style={{ color: '#8A8175' }}>·</span>
                  <span className="new-book-shelf">{book.shelfLocation || '서가 확인 중'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-search-box">
            <p style={{ fontWeight: 700, color: '#6B6354' }}>새로 입고된 도서를 준비하고 있습니다.</p>
          </div>
        )}
      </section>

      {/* 4. 요금 안내 & 서울대학교 공식 제휴 (2분할) */}
      <section className="home-split">
        {/* 요금 안내 */}
        <div className="panel-price">
          <div className="section-kicker" style={{ color: '#1E1E1E' }}>PRICE</div>
          <h3 className="section-title-sm">가장 많이 고르는 요금제</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {POPULAR_PRICES.map((p) => (
              <div key={p.name} className="price-item-row">
                <div>
                  <div className="price-item-name">{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#6B6354', marginTop: '2px' }}>{p.note}</div>
                </div>
                <div className="price-item-val">{p.price}</div>
              </div>
            ))}
          </div>
          <a
            href="/menu"
            style={{
              alignSelf: 'flex-start',
              marginTop: 'auto',
              padding: '11px 18px',
              borderRadius: '999px',
              background: '#1E1E1E',
              color: '#FED943',
              fontSize: '13px',
              fontWeight: 800,
            }}
          >
            전체 요금 · 메뉴 보기 →
          </a>
        </div>

        {/* 대표 이벤트 / 제휴 안내 */}
        <div className="panel-partnership">
          <div className="partnership-left">
            <div>
              <div className="section-kicker" style={{ color: '#FED943' }}>{featured.tag || 'FEATURED EVENT'}</div>
              <h3 className="partnership-title">
                {featured.title}
              </h3>
              <div className="partnership-bullets">
                {featured.detail.split(/[+\n·]/).map((s) => s.trim()).filter(Boolean).map((bullet, idx) => (
                  <div key={idx} className="partnership-bullet">· {bullet}</div>
                ))}
              </div>
            </div>
            <a
              href="/#events"
              className="partnership-btn"
            >
              이벤트 혜택 자세히 →
            </a>
          </div>
          <div className="partnership-right">
            <img
              src={getBannerImageUrl(featured.bannerType, featured.customBannerUrl)}
              alt={featured.title}
            />
          </div>
        </div>
      </section>

      {/* 5. 매장 둘러보기 */}
      <section>
        <div className="section-header">
          <div>
            <div className="section-kicker">STORE TOUR</div>
            <h2 className="section-title">매장 둘러보기</h2>
          </div>
          <a href="/store" className="view-all-btn">
            매장 안내 →
          </a>
        </div>
        <div className="photo-grid">
          <div className="photo-card">
            <img src={storePhoto1} alt="카툰플러스 서울대입구역점 내부 서가 전경" />
          </div>
          <div className="photo-card">
            <img src={storePhoto2} alt="복층 아늑한 토굴방 및 힐링 좌석" />
          </div>
          <div className="photo-card">
            <img src={storePhoto3} alt="은은한 조명의 편안한 독서 공간" />
          </div>
        </div>
      </section>
    </>
  );
}
