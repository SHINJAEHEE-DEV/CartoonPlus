import { useState, useMemo } from 'react';
import { MockDataRepository } from '../lib/storage';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MEAL' | 'SNACK' | 'BEV'>('ALL');
  const allMenus = MockDataRepository.getMenus();

  const pricingPlans = allMenus.filter(m => m.category === 'PACKAGE');

  const foodMenus = useMemo(() => {
    return allMenus.filter(m => {
      if (m.category === 'PACKAGE') return false;
      if (activeCategory === 'ALL') return true;
      return m.category === activeCategory;
    });
  }, [allMenus, activeCategory]);

  const rules = [
    '기본 이용 시간 초과 시 10분당 500원이 자동 부과됩니다.',
    '패키지 기본 음료는 아이스 아메리카노 or 복숭아/레몬 아이스티 중 택1 (차액 결제 시 타 음료 변경 가능)',
    '쾌적한 매장 환경 유지를 위해 외부 음식물 반입 및 취식을 금지합니다.',
    '이용 요금은 후불 결제이며, 퇴실 시 카운터에 카드를 반납해 주세요.',
  ];

  return (
    <div className="bg-brand-surface min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        {/* 1. Pricing Section */}
        <section>
          <div>
            <div className="text-amber-700 font-extrabold text-xs tracking-widest uppercase">
              PRICING
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-brand-charcoal mt-1 tracking-tight mb-6">
              카툰플러스 이용 요금제
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white border-2 border-brand-charcoal rounded-2xl p-5 shadow-sm hover:-translate-y-1 transition-all relative flex flex-col justify-between ${
                  plan.isBest ? 'ring-2 ring-brand-yellow ring-offset-2' : ''
                }`}
              >
                {plan.isBest && (
                  <span className="absolute -top-3 right-4 bg-brand-charcoal text-brand-yellow text-[10px] font-black px-2.5 py-0.5 rounded-full border border-brand-yellow">
                    ★ 인기 1위
                  </span>
                )}
                <div>
                  <h3 className="font-black text-base text-brand-charcoal mb-2">{plan.name}</h3>
                  <div className="text-2xl font-black text-brand-charcoal tracking-tight">
                    ₩{plan.price.toLocaleString()}
                  </div>
                </div>
                <p className="text-xs text-brand-muted mt-3 pt-3 border-t border-gray-100">
                  {plan.description}
                </p>
              </div>
            ))}
          </div>

          {/* Rules Bar */}
          <div className="mt-6 bg-brand-charcoal text-white rounded-2xl p-5 space-y-1.5 shadow-md">
            {rules.map((rule, idx) => (
              <div key={idx} className="text-xs text-gray-300 font-medium flex items-start gap-2">
                <span className="text-brand-yellow font-bold">·</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. F&B Menu Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-amber-700 font-extrabold text-xs tracking-widest uppercase">
                F&B MENU
              </div>
              <h2 className="text-2xl font-black text-brand-charcoal mt-1 tracking-tight">
                스낵 & 음료 메뉴판
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className={`px-4 py-2 rounded-full text-xs font-black border-2 border-brand-charcoal transition-all ${
                  activeCategory === 'ALL'
                    ? 'bg-brand-charcoal text-brand-yellow shadow-xs'
                    : 'bg-white text-brand-charcoal hover:bg-gray-100'
                }`}
              >
                전체 메뉴
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('MEAL')}
                className={`px-4 py-2 rounded-full text-xs font-black border-2 border-brand-charcoal transition-all ${
                  activeCategory === 'MEAL'
                    ? 'bg-brand-charcoal text-brand-yellow shadow-xs'
                    : 'bg-white text-brand-charcoal hover:bg-gray-100'
                }`}
              >
                🍜 식사 / 라면
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('SNACK')}
                className={`px-4 py-2 rounded-full text-xs font-black border-2 border-brand-charcoal transition-all ${
                  activeCategory === 'SNACK'
                    ? 'bg-brand-charcoal text-brand-yellow shadow-xs'
                    : 'bg-white text-brand-charcoal hover:bg-gray-100'
                }`}
              >
                🍟 스낵 / 디저트
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('BEV')}
                className={`px-4 py-2 rounded-full text-xs font-black border-2 border-brand-charcoal transition-all ${
                  activeCategory === 'BEV'
                    ? 'bg-brand-charcoal text-brand-yellow shadow-xs'
                    : 'bg-white text-brand-charcoal hover:bg-gray-100'
                }`}
              >
                ☕ 커피 / 음료
              </button>
            </div>
          </div>

          {/* Menu Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodMenus.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-brand-charcoal rounded-2xl p-4 md:p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-black text-base text-brand-charcoal truncate">{item.name}</h4>
                    {item.isBest && (
                      <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                        BEST
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted truncate">{item.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-black text-brand-charcoal">
                    ₩{item.price.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">카운터 주문</span>
                </div>
              </div>
            ))}
          </div>

          {/* Self Bar Notice Banner with Mascot */}
          <div className="mt-10 bg-white border-2 border-brand-charcoal rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5 shadow-md">
            <img
              src="/assets/ffc90c88-703f-44f7-b99d-33f25d7780cb.png"
              alt="셀프바 안내"
              className="w-20 md:w-24 animate-cp-bob-fast shrink-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-base font-black text-brand-charcoal">
                커피 · 소프트콘은 셀프바에서 무제한
              </h3>
              <p className="text-xs md:text-sm text-[#4A4534] mt-1 leading-relaxed">
                라면과 덮밥은 주문 후 카운터에서 수령하며, 조리 완료 시 매장 안내 방송으로 알려드립니다.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="bg-brand-yellow border-1.5 border-brand-charcoal rounded-full px-3.5 py-1.5 text-xs font-black text-brand-charcoal">
                선불 결제
              </span>
              <span className="border-1.5 border-brand-charcoal rounded-full px-3.5 py-1.5 text-xs font-black text-brand-charcoal bg-brand-surface">
                후불 결제
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
