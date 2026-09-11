import { useState, useEffect } from 'react';
import coffeeMascot from '../../assets/mascot_coffee.png';
import relaxingMascot from '../../assets/mascot_relaxing.png';
import {
  PRICE_PACKAGES as INITIAL_PRICE_PACKAGES,
  BEVERAGE_ITEMS as INITIAL_BEVERAGE_ITEMS,
  FOOD_ITEMS as INITIAL_FOOD_ITEMS,
  BeverageItem,
  MenuItem,
  PricePackage,
} from './menuData';

import { usePageTitle } from '../../lib/usePageTitle';

type MenuTab = 'all' | 'beverage' | 'meal' | 'dessert' | 'snack';

export function MenuPage() {
  usePageTitle('메뉴 안내');
  const [activeTab, setActiveTab] = useState<MenuTab>('all');
  const [beverageSubFilter, setBeverageSubFilter] = useState<string>('전체');

  const [packages, setPackages] = useState<PricePackage[]>(() => {
    const saved = localStorage.getItem('cp_price_packages');
    return saved ? JSON.parse(saved) : INITIAL_PRICE_PACKAGES;
  });

  const [beverages, setBeverages] = useState<BeverageItem[]>(() => {
    const saved = localStorage.getItem('cp_beverage_items');
    return saved ? JSON.parse(saved) : INITIAL_BEVERAGE_ITEMS;
  });

  const [foods, setFoods] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cp_food_items');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  useEffect(() => {
    const handleStorage = () => {
      const p = localStorage.getItem('cp_price_packages');
      if (p) setPackages(JSON.parse(p));
      const b = localStorage.getItem('cp_beverage_items');
      if (b) setBeverages(JSON.parse(b));
      const f = localStorage.getItem('cp_food_items');
      if (f) setFoods(JSON.parse(f));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const subCategories = ['전체', '아이스티/티', '콤부차', '라떼/음료', '에이드', '스무디/생과일', '쉐이크'];

  const filteredBeverages = beverages.filter((b) => {
    if (beverageSubFilter === '전체') return true;
    return b.subCategory === beverageSubFilter;
  });

  const mealItems = foods.filter((f) => f.category === 'meal');
  const dessertItems = foods.filter((f) => f.category === 'dessert');
  const snackItems = foods.filter((f) => f.category === 'snack');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <div className="section-kicker">PRICE & MENU</div>
        <h1 className="section-title">요금제 및 메뉴 안내</h1>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B6354', marginTop: '6px', lineHeight: 1.6 }}>
          매장 내 키오스크에서 현장 결제로 이용하실 수 있습니다. 패키지 요금제 이용 시 기본 음료가 제공되며, 차액 결제로 모든 프리미엄 음료로 업그레이드 가능합니다.
        </p>
      </div>

      {/* 1. 요금제 안내 카드 그리드 */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#8A6A00', letterSpacing: '0.05em' }}>PACKAGE & TICKET</span>
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>이용 요금제</h2>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B6354' }}>초과 10분당 600원</span>
        </div>

        <div className="price-grid">
          {packages.map((p) => (
            <div
              key={p.name}
              className="price-card"
              style={{
                position: 'relative',
                border: p.isPopular ? '2.5px solid #1E1E1E' : '2px solid #1E1E1E',
                background: p.isPopular ? '#FFFDF5' : '#FFFFFF',
              }}
            >
              {p.isPopular && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-11px',
                    right: '16px',
                    background: '#FED943',
                    border: '1.5px solid #1E1E1E',
                    borderRadius: '999px',
                    padding: '2px 10px',
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#1E1E1E',
                  }}
                >
                  BEST 인기
                </span>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '-0.02em' }}>{p.name}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B6354', marginTop: '4px' }}>
                  {p.note}
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, whiteSpace: 'nowrap', color: '#1E1E1E' }}>
                {p.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 주요 매장 혜택 배너 (2분할) */}
      <div className="home-split">
        {/* 라면 무제한 토핑 바 배너 */}
        <div className="banner-card-dark">
          <img
            src={coffeeMascot}
            alt="라면 마스코트"
            style={{ width: '68px', height: '68px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', color: '#FED943' }}>
              ALWAYS ON · FREE TOPPING
            </div>
            <div style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '-0.02em', marginTop: '4px' }}>
              즉석 라면 무제한 무료 토핑 바
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#CFC7B4', marginTop: '6px', lineHeight: 1.5 }}>
              라면(4,000원) 주문 시 <strong>대파, 숙주나물, 떡사리, 계란</strong>을 무제한 무료로 제공합니다.
            </div>
          </div>
        </div>

        {/* 음료 정책 안내 배너 */}
        <div
          style={{
            background: '#F7F4EB',
            border: '2px solid #1E1E1E',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <img
            src={relaxingMascot}
            alt="음료 마스코트"
            style={{ width: '68px', height: '68px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.05em', color: '#8A6A00' }}>
              BEVERAGE SYSTEM
            </div>
            <div style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '-0.02em', marginTop: '4px' }}>
              음료 단품 4,000원 · 패키지 차액 업그레이드
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B6354', marginTop: '6px', lineHeight: 1.5 }}>
              패키지 기본 음료는 무료 제공되며, <strong>+200원 ~ +2,000원</strong> 차액으로 에이드·스무디·쉐이크까지 즐기실 수 있습니다.
            </div>
          </div>
        </div>
      </div>

      {/* 3. 메뉴 카테고리 탭 네비게이션 */}
      <section>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '2px solid #E5E0D5', paddingBottom: '14px' }}>
          {[
            { key: 'all', label: '전체 메뉴 보기' },
            { key: 'beverage', label: `음료 & 카페 (${beverages.length})` },
            { key: 'meal', label: `라면 & 식사 (${mealItems.length})` },
            { key: 'dessert', label: `젤라또 & 디저트 (${dessertItems.length})` },
            { key: 'snack', label: `과자 & 스낵 (${snackItems.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as MenuTab)}
              type="button"
              style={{
                padding: '10px 18px',
                borderRadius: '999px',
                border: '2px solid #1E1E1E',
                background: activeTab === tab.key ? '#1E1E1E' : '#FFFFFF',
                color: activeTab === tab.key ? '#FED943' : '#1E1E1E',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- [A. 음료 섹션] --- */}
        {(activeTab === 'all' || activeTab === 'beverage') && (
          <div style={{ marginTop: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A6A00' }}>BEVERAGES & CAFE</div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>음료 라인업</h3>
              </div>

              {/* 음료 서브 필터 칩 */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {subCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setBeverageSubFilter(sub)}
                    type="button"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      border: beverageSubFilter === sub ? '1.5px solid #1E1E1E' : '1px solid #D1C9BC',
                      background: beverageSubFilter === sub ? '#FED943' : '#FFFFFF',
                      color: '#1E1E1E',
                      fontSize: '12px',
                      fontWeight: beverageSubFilter === sub ? 800 : 600,
                      cursor: 'pointer',
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {filteredBeverages.map((bev) => (
                <BeverageCard key={bev.id} item={bev} />
              ))}
            </div>
          </div>
        )}

        {/* --- [B. 라면 & 식사 섹션] --- */}
        {(activeTab === 'all' || activeTab === 'meal') && (
          <div style={{ marginTop: '36px' }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A6A00' }}>FOOD & MEALS</div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>라면 & 식사류</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {mealItems.map((meal) => (
                <FoodCard key={meal.id} item={meal} />
              ))}
            </div>
          </div>
        )}

        {/* --- [C. 젤라또 & 디저트 섹션] --- */}
        {(activeTab === 'all' || activeTab === 'dessert') && (
          <div style={{ marginTop: '36px' }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A6A00' }}>DESSERT & ICE CREAM</div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>젤라또 & 디저트</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {dessertItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* --- [D. 과자 & 스낵 섹션] --- */}
        {(activeTab === 'all' || activeTab === 'snack') && (
          <div style={{ marginTop: '36px' }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A6A00' }}>SNACK & DRINK</div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>과자 & 캔음료</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {snackItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function BeverageCard({ item }: { item: BeverageItem }) {
  const getDiffBadgeColor = (diff: number) => {
    if (diff === 0) return { bg: '#E8F5E9', text: '#2E7D32', label: '패키지 기본 (+0원)' };
    if (diff <= 500) return { bg: '#FFF8E1', text: '#F57F17', label: `패키지 +${diff.toLocaleString()}원` };
    return { bg: '#EDE7F6', text: '#512DA8', label: `패키지 +${diff.toLocaleString()}원` };
  };

  const badge = getDiffBadgeColor(item.packageDiff);

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '2px solid #1E1E1E',
        borderRadius: '14px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '10px',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '6px',
              background: badge.bg,
              color: badge.text,
            }}
          >
            {badge.label}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: item.temp === 'HOT' ? '#D32F2F' : item.temp === 'ICED' ? '#1976D2' : '#6B6354',
            }}
          >
            {item.temp === 'HOT' ? 'HOT 전용' : item.temp === 'ICED' ? 'ICE 전용' : 'HOT / ICE'}
          </span>
        </div>

        <div style={{ fontSize: '15px', fontWeight: 900, marginTop: '8px', letterSpacing: '-0.02em' }}>
          {item.nameKo}
        </div>
        {item.nameEn && (
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#8A8175', marginTop: '2px' }}>
            {item.nameEn}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1px dashed #E5E0D5', paddingTop: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B6354' }}>단품 구매 시</span>
        <span style={{ fontSize: '16px', fontWeight: 900, color: '#1E1E1E' }}>
          {item.singlePrice.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}

function FoodCard({ item }: { item: MenuItem }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: item.isPopular ? '2px solid #1E1E1E' : '1.5px solid #1E1E1E',
        borderRadius: '14px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      {item.isPopular && (
        <span
          style={{
            position: 'absolute',
            top: '-9px',
            right: '12px',
            background: '#FED943',
            border: '1.5px solid #1E1E1E',
            borderRadius: '999px',
            padding: '1px 8px',
            fontSize: '10px',
            fontWeight: 900,
          }}
        >
          BEST
        </span>
      )}
      <div>
        <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.02em' }}>{item.name}</div>
        {item.note && (
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#E65100', marginTop: '3px' }}>
            ✨ {item.note}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <span style={{ fontSize: '17px', fontWeight: 900, color: '#1E1E1E' }}>
          {item.price.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
