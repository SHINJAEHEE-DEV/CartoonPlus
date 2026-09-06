import { useState, useMemo } from 'react';
import { MockDataRepository } from '../lib/storage';
import { getAssetUrl } from '../lib/assets';

export default function EntertainmentPage() {
  const [activeTab, setActiveTab] = useState<'NINTENDO' | 'XBOX' | 'BOARD_GAME'>('NINTENDO');
  const allItems = MockDataRepository.getEntertainment();

  const filteredItems = useMemo(() => {
    return allItems.filter(item => item.type === activeTab);
  }, [allItems, activeTab]);

  return (
    <div className="bg-brand-surface min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-brand-charcoal text-white py-14 overflow-hidden border-b-2 border-brand-charcoal">
        <img
          src={getAssetUrl('/assets/0e26d418-3966-4c35-b0e1-b3c1090af55c.jpg')}
          alt="게임룸 배경"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-brand-yellow font-extrabold text-xs tracking-widest uppercase mb-1">
            ENTERTAINMENT
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            만화만 보고 가긴 아쉬우니까
          </h1>
          <p className="text-sm md:text-base text-gray-300">
            닌텐도 스위치 · Xbox Series X · 인기 보드게임 60종 이상, 전 좌석 무료 이용
          </p>
        </div>
      </section>

      {/* Main Catalog */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('NINTENDO')}
            className={`px-5 py-3 rounded-2xl text-sm font-black border-2 border-brand-charcoal transition-all shadow-xs ${
              activeTab === 'NINTENDO'
                ? 'bg-brand-charcoal text-brand-yellow'
                : 'bg-white text-brand-charcoal hover:bg-gray-100'
            }`}
          >
            🎮 닌텐도 스위치
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('XBOX')}
            className={`px-5 py-3 rounded-2xl text-sm font-black border-2 border-brand-charcoal transition-all shadow-xs ${
              activeTab === 'XBOX'
                ? 'bg-brand-charcoal text-brand-yellow'
                : 'bg-white text-brand-charcoal hover:bg-gray-100'
            }`}
          >
            🟢 Xbox Series X
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('BOARD_GAME')}
            className={`px-5 py-3 rounded-2xl text-sm font-black border-2 border-brand-charcoal transition-all shadow-xs ${
              activeTab === 'BOARD_GAME'
                ? 'bg-brand-charcoal text-brand-yellow'
                : 'bg-white text-brand-charcoal hover:bg-gray-100'
            }`}
          >
            🎲 인기 보드게임
          </button>
        </div>

        {/* Item Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-brand-charcoal rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-brand-yellow border-1.5 border-brand-charcoal rounded-full text-[11px] font-black px-2.5 py-0.5 text-brand-charcoal">
                    {item.players}
                  </span>
                  <span className="text-xs font-bold text-brand-muted">
                    {item.genre} {item.difficulty ? `· ${item.difficulty}` : ''}
                  </span>
                </div>
                <h3 className="font-black text-lg text-brand-charcoal leading-snug mb-3">
                  {item.title}
                </h3>
              </div>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold text-green-700">
                <span>● 매장 구비 중</span>
                <span className="text-gray-400 font-medium text-[11px]">컨트롤러 카운터 수령</span>
              </div>
            </div>
          ))}
        </div>

        {/* Notice Banner */}
        <div className="mt-10 bg-brand-yellow border-2 border-brand-charcoal rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5 shadow-md">
          <img
            src={getAssetUrl('/assets/d09e6004-5fe6-405b-a0af-411afc1330f7.png')}
            alt="게임룸 안내"
            className="w-20 md:w-24 animate-cp-bob shrink-0"
          />
          <div>
            <h3 className="text-lg font-black text-brand-charcoal mb-1">
              게임 룸은 선착순으로 자유롭게 이용 가능합니다
            </h3>
            <p className="text-xs md:text-sm text-[#4A4534] leading-relaxed">
              닌텐도 룸 3실 · Xbox 룸 2실이 운영 중입니다. 이용 시 카운터에 말씀해주시면 게임 팩과 무선 컨트롤러를 바로 대여해 드립니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
