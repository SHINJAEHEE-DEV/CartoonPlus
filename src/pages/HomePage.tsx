import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MockDataRepository } from '../lib/storage';

interface HomePageProps {
  selectedStore: 'snu' | 'jamsil';
  onOpenBookRequest: (prefilledTitle?: string) => void;
}

export default function HomePage({ selectedStore, onOpenBookRequest }: HomePageProps) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const currentStore = MockDataRepository.getStoreById(selectedStore);

  const hotKeywords = ['체인소맨', '귀멸의 칼날', '원피스', '주술회전', '나츠메 우인장', '블루 록'];

  const stats = [
    { n: '30,000+', label: '보유 도서 및 웹툰' },
    { n: '4대', label: '프라이빗 힐링 룸' },
    { n: '100%', label: '공백 무시 · 초성 검색' },
    { n: '$0', label: '월 고정 운영비 무료' },
  ];

  const marqueeItems = [
    '🐾 만화카페 카툰플러스',
    '✨ 서울대입구역점 3번 출구 1분',
    '🌙 잠실점 주말 24시간 운영',
    '📚 3만 권 만화·웹툰 보유',
    '🎮 닌텐도·Xbox 전좌석 무료',
    '🛋️ 안마의자 힐링존',
    '☕ 프리미엄 F&B 카페 메뉴',
  ];

  const healingPoints = [
    {
      title: '3만 권 도서 & 웹툰',
      desc: '인기 신간부터 추억의 명작, 웹툰 단행본까지 방대한 컬렉션',
      img: '/assets/ffc90c88-703f-44f7-b99d-33f25d7780cb.png',
      delay: '0',
    },
    {
      title: '넷플릭스 프라이빗 룸',
      desc: '아늑한 독립 룸에서 대형 스크린으로 OTT 무제한 시청',
      img: '/assets/ace234b7-598d-45be-9063-f53428b39df4.png',
      delay: '60',
    },
    {
      title: '닌텐도 & Xbox 게임룸',
      desc: '마리오카트, 스매시브라더스, 스포츠 게임 완비',
      img: '/assets/5195e21d-d069-4a4c-9fb9-c14597f85dc4.png',
      delay: '120',
    },
    {
      title: '프리미엄 안마의자 룸',
      desc: '피로를 녹여주는 최고급 바디케어 안마의자 힐링 존',
      img: '/assets/c3620538-2587-4c90-bceb-53f73e82d1ed.jpg',
      delay: '180',
    },
  ];

  // Pick top 4 recent books for preview
  const newBooks = MockDataRepository.getBookSearchResults(selectedStore).slice(0, 4);

  const liveEvents = [
    {
      title: '영수증 포토리뷰 이벤트',
      period: '상시 진행',
      content: '네이버/카카오 영수증 포토리뷰 작성 시 즉석 음료 or 간식 무료 쿠폰 증정!',
    },
    {
      title: '이달의 인기 신간 대량 입고',
      period: '매주 업데이트',
      content: '블루 록, 괴수 8호, 최애의 아이 최신간이 서가에 입고되었습니다.',
    },
    {
      title: '평일 온종일 무제한 패키지',
      period: '평일 한정',
      content: '평일 하루 종일 시간 걱정 없이 22,000원에 무제한으로 만화 정주행!',
    },
  ];

  const gallery = [
    { src: '/assets/d57e58db-5b66-419a-a16c-17c736164a4c.jpg', cap: '프라이빗 넷플릭스 룸', sub: '아늑한 굴방 인테리어' },
    { src: '/assets/0e26d418-3966-4c35-b0e1-b3c1090af55c.jpg', cap: '닌텐도 스위치 게임존', sub: '1~4인 파티 플레이' },
    { src: '/assets/a2438a39-4ada-4f7b-8c76-a0807bc2d0a0.jpg', cap: '오픈 서가 라운지', sub: '3만 권 도서 보유' },
    { src: '/assets/ddda53c2-ebfb-4799-a149-4282bee460f4.jpg', cap: '프리미엄 안마의자 힐링존', sub: '피로회복 라운지' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleKeywordClick = (k: string) => {
    navigate(`/search?q=${encodeURIComponent(k)}`);
  };

  return (
    <div className="bg-brand-surface">
      {/* 1. Hero Banner */}
      <section className="bg-gradient-to-b from-brand-yellow via-brand-yellow to-brand-surface pt-10 pb-6 border-b-2 border-brand-charcoal overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Text & Search */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-brand-charcoal text-brand-yellow font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-xs">
              🐾 만화카페 카툰플러스 · {currentStore?.name}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-charcoal tracking-tight leading-[1.15]">
              만화부터 넷플릭스·닌텐도까지,<br />
              <span className="bg-gradient-to-r from-amber-200 to-yellow-200 px-2 rounded-lg inline-block mt-1">
                쉬는 게 제일 즐거워지는 곳
              </span>
            </h1>

            <p className="text-sm md:text-base text-[#4A4534] font-medium leading-relaxed">
              도심 속 가장 아늑한 만화 & 힐링 아지트.<br className="hidden sm:inline" />
              3만 권 도서, 넷플릭스 룸, 닌텐도·Xbox, 프리미엄 안마의자까지.
            </p>

            {/* Big Quick Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white border-2.5 border-brand-charcoal rounded-2xl p-2 flex items-center gap-2 shadow-lg max-w-xl"
            >
              <span className="text-xl pl-2">🔎</span>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="체인소맨 · ㄱㅁㅇㅋㄴ · 원피스"
                className="flex-1 text-sm md:text-base font-bold text-brand-charcoal bg-transparent outline-hidden min-w-0"
              />
              <button
                type="submit"
                className="bg-brand-charcoal hover:bg-black text-brand-yellow font-black text-sm md:text-base px-5 py-3 rounded-xl transition-all shadow-xs"
              >
                검색
              </button>
            </form>

            {/* Hot Search Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-[#5F5945] pt-1">
              <span className="text-brand-charcoal font-black">🔥 인기 검색어:</span>
              {hotKeywords.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleKeywordClick(k)}
                  className="bg-white hover:bg-brand-yellow border-1.5 border-brand-charcoal rounded-full px-3 py-1 font-extrabold text-brand-charcoal transition-all hover:-translate-y-0.5"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Right Floating Mascot Visual */}
          <div className="md:col-span-5 flex justify-center relative">
            <div className="absolute inset-0 bg-white/50 rounded-full blur-2xl transform scale-90"></div>
            <img
              src="/assets/f0a07651-1b46-4803-96ec-56060c5f69d0.png"
              alt="카툰플러스 힐링 마스코트"
              className="relative z-10 w-64 md:w-80 object-contain drop-shadow-xl animate-cp-float"
            />
          </div>
        </div>
      </section>

      {/* 2. Stats Bar */}
      <section className="bg-brand-charcoal text-white py-6 border-b-2 border-brand-charcoal">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="p-2">
              <div className="text-2xl md:text-3xl font-black text-brand-yellow">{s.n}</div>
              <div className="text-xs text-gray-300 font-bold mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Marquee Banner */}
      <section className="bg-[#FFD800] border-b-2 border-brand-charcoal py-2.5 overflow-hidden whitespace-nowrap flex select-none">
        <div className="flex shrink-0 gap-8 animate-cp-marquee font-black text-xs md:text-sm text-brand-charcoal pr-8">
          {marqueeItems.map((item, idx) => (
            <span key={idx} className="inline-block shrink-0">
              {item}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 gap-8 animate-cp-marquee font-black text-xs md:text-sm text-brand-charcoal pr-8" aria-hidden="true">
          {marqueeItems.map((item, idx) => (
            <span key={`dup-${idx}`} className="inline-block shrink-0">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* 4. 4대 힐링 포인트 */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <div className="text-amber-700 font-extrabold text-xs tracking-widest uppercase">
            HEALING POINTS
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-brand-charcoal mt-1 tracking-tight">
            카툰플러스 4대 힐링 포인트
          </h2>
          <p className="text-xs md:text-sm text-brand-muted mt-1">
            만화만 있는 만화카페가 아닙니다. 모든 엔터테인먼트를 한 공간에서!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {healingPoints.map((h, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-brand-charcoal rounded-2xl p-5 text-center shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-200"
            >
              <div className="w-20 h-20 mx-auto mb-3 bg-brand-yellow border-2 border-brand-charcoal rounded-full flex items-center justify-center overflow-hidden">
                <img src={h.img} alt={h.title} className="w-16 h-16 object-cover" />
              </div>
              <h3 className="font-black text-base text-brand-charcoal mb-1">{h.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 이번 주 신간 프리뷰 */}
      <section className="bg-white border-y-2 border-brand-charcoal py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-amber-700 font-extrabold text-xs tracking-widest uppercase">
                NEW ARRIVALS
              </div>
              <h2 className="text-2xl font-black text-brand-charcoal mt-1 tracking-tight">
                이번 주 신간 도서 <span className="text-base text-brand-muted font-bold">({currentStore?.name})</span>
              </h2>
            </div>
            <Link
              to="/search"
              className="text-xs font-black text-brand-charcoal border-b-2 border-brand-yellow hover:text-amber-800 transition-colors"
            >
              전체 도서 검색하기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {newBooks.map(({ book, inventory }) => (
              <div
                key={inventory.id}
                className="bg-brand-surface border-2 border-brand-charcoal rounded-2xl p-4 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-brand-charcoal text-brand-yellow text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {book.category}
                    </span>
                    <span className="text-[11px] font-extrabold text-gray-500">
                      {inventory.volumeRange}
                    </span>
                  </div>
                  <h4 className="font-black text-base text-brand-charcoal line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-gray-500 mb-3">{book.author}</p>
                </div>
                <div className="pt-2 border-t border-dashed border-gray-300 flex items-center justify-between">
                  <span className="bg-brand-yellow border-1.5 border-brand-charcoal text-brand-charcoal text-xs font-extrabold px-2 py-0.5 rounded-lg">
                    📍 {inventory.shelfLocation}
                  </span>
                  <Link
                    to={`/search?q=${encodeURIComponent(book.title)}`}
                    className="text-[11px] font-bold text-gray-600 hover:text-black"
                  >
                    상세보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 진행 중인 이벤트 */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-amber-700 font-extrabold text-xs tracking-widest uppercase">
              NOW ON EVENT
            </div>
            <h2 className="text-2xl font-black text-brand-charcoal mt-1 tracking-tight">
              진행 중인 매장 이벤트
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {liveEvents.map((e, idx) => (
            <div
              key={idx}
              className="bg-brand-yellow border-2 border-brand-charcoal rounded-2xl p-5 shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="bg-brand-charcoal text-brand-yellow text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  EVENT
                </span>
                <span className="text-xs font-black text-amber-950">{e.period}</span>
              </div>
              <h3 className="font-black text-lg text-brand-charcoal mb-1.5">{e.title}</h3>
              <p className="text-xs text-[#4A4534] font-medium leading-relaxed">{e.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. 매장 둘러보기 갤러리 */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="text-center mb-8">
          <div className="text-amber-700 font-extrabold text-xs tracking-widest uppercase">
            STORE TOUR
          </div>
          <h2 className="text-2xl font-black text-brand-charcoal mt-1 tracking-tight">
            매장 미리보기
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((g, idx) => (
            <div
              key={idx}
              className="border-2 border-brand-charcoal rounded-2xl overflow-hidden relative group shadow-sm h-48"
            >
              <img
                src={g.src}
                alt={g.cap}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                <div className="font-extrabold text-sm">{g.cap}</div>
                <div className="text-[11px] text-gray-300">{g.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. 도서 검색 CTA 배너 */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-brand-charcoal border-2 border-brand-charcoal rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src="/assets/9b6c63f7-8550-4612-92df-5dbcdff51ec3.png"
              alt="마스코트"
              className="w-20 md:w-24 animate-cp-bob shrink-0"
            />
            <div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mb-1">
                찾는 만화, 지금 바로 검색해보세요!
              </h3>
              <p className="text-xs md:text-sm text-gray-300">
                띄어쓰기·초성 상관없이 3초 안에 보유 권수와 서가 번호를 안내해 드립니다.
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onOpenBookRequest()}
              className="flex-1 md:flex-none bg-transparent hover:bg-white/10 text-white font-extrabold text-xs md:text-sm px-4 py-3 rounded-xl border border-white/40 transition-all"
            >
              📥 도서 입고 신청
            </button>
            <Link
              to="/search"
              className="flex-1 md:flex-none bg-brand-yellow hover:bg-brand-yellowHover text-brand-charcoal font-black text-xs md:text-sm px-6 py-3 rounded-xl transition-all shadow-md text-center animate-cp-pulse"
            >
              도서 검색하기 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
