import { useState, useEffect } from 'react';
import { MASCOT_ASSETS } from '../../lib/brandAssets';
import {
  PRICE_PACKAGES as INITIAL_PRICE_PACKAGES,
  BEVERAGE_ITEMS as INITIAL_BEVERAGE_ITEMS,
  FOOD_ITEMS as INITIAL_FOOD_ITEMS,
  BEVERAGE_CATEGORIES,
  normalizeBeverageCategory,
  BeverageItem,
  MenuItem,
  PricePackage,
} from './menuData';

import { usePageTitle } from '../../lib/usePageTitle';
import { supabase } from '../../lib/supabase';
import { usePublicStore } from '../../lib/storeContext';

type MenuTab = 'all' | 'beverage' | 'meal' | 'dessert' | 'snack';

function loadStoredMenu<T>(key: string, slug: string | undefined, fallback: T): T {
  try {
    const raw =
      localStorage.getItem(`cp_${key}_${slug || 'snu'}`) ||
      localStorage.getItem(`cp_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function MenuPage() {
  const { store } = usePublicStore();
  usePageTitle(store ? `${store.name} 메뉴 안내` : '메뉴 안내');
  const [activeTab, setActiveTab] = useState<MenuTab>('all');
  const [beverageSubFilter, setBeverageSubFilter] = useState<string>('전체');

  const [packages, setPackages] = useState<PricePackage[]>(() =>
    loadStoredMenu('price_packages', store?.slug, INITIAL_PRICE_PACKAGES)
  );

  const [beverages, setBeverages] = useState<BeverageItem[]>(() =>
    loadStoredMenu('beverage_items', store?.slug, INITIAL_BEVERAGE_ITEMS)
  );

  const [foods, setFoods] = useState<MenuItem[]>(() =>
    loadStoredMenu('food_items', store?.slug, INITIAL_FOOD_ITEMS)
  );

  useEffect(() => {
    const handleStorage = () => {
      setPackages(loadStoredMenu('price_packages', store?.slug, INITIAL_PRICE_PACKAGES));
      setBeverages(loadStoredMenu('beverage_items', store?.slug, INITIAL_BEVERAGE_ITEMS));
      setFoods(loadStoredMenu('food_items', store?.slug, INITIAL_FOOD_ITEMS));
    };
    window.addEventListener('storage', handleStorage);

    if (supabase) {
      const client = supabase;
      void client
        .from('stores')
        .select('id')
        .eq('slug', store?.slug || 'snu')
        .single()
        .then(({ data: targetStore }) => {
          if (targetStore) {
            void client
              .from('store_content')
              .select('content_key, content_value')
              .eq('store_id', targetStore.id)
              .then(({ data }) => {
                if (data && data.length > 0) {
                  for (const item of data) {
                    if (
                      item.content_key === 'price_packages' &&
                      Array.isArray(item.content_value?.packages)
                    ) {
                      setPackages(item.content_value.packages);
                    } else if (
                      item.content_key === 'beverage_items' &&
                      Array.isArray(item.content_value?.beverages)
                    ) {
                      setBeverages(item.content_value.beverages);
                    } else if (
                      item.content_key === 'food_items' &&
                      Array.isArray(item.content_value?.foods)
                    ) {
                      setFoods(item.content_value.foods);
                    }
                  }
                }
              });
          }
        });
    }

    return () => window.removeEventListener('storage', handleStorage);
  }, [store?.slug]);

  const mealItems = foods.filter((f) => f.category === 'meal');
  const dessertItems = foods.filter((f) => f.category === 'dessert');
  const snackItems = foods.filter((f) => f.category === 'snack');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <div className="section-kicker">PRICE & MENU</div>
        <h1 className="section-title">요금제 및 메뉴 안내</h1>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#6B6354',
            marginTop: '6px',
            lineHeight: 1.6,
          }}
        >
          매장 내 키오스크에서 현장 결제로 이용하실 수 있습니다. 패키지 요금제 이용 시 기본 음료가
          제공되며, 차액 결제로 모든 프리미엄 음료로 업그레이드 가능합니다.
        </p>
      </div>

      {/* 1. 요금제 안내 카드 그리드 */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#8A6A00',
                letterSpacing: '0.05em',
              }}
            >
              PACKAGE & TICKET
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>이용 요금제</h2>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B6354' }}>
            초과 10분당 600원
          </span>
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
                <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  {p.name}
                </div>
                <div
                  style={{ fontSize: '12px', fontWeight: 600, color: '#6B6354', marginTop: '4px' }}
                >
                  {p.note}
                </div>
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                  color: '#1E1E1E',
                }}
              >
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
            src={MASCOT_ASSETS.coffee}
            alt="라면 마스코트"
            style={{ width: '68px', height: '68px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: '#FED943',
              }}
            >
              ALWAYS ON · FREE TOPPING
            </div>
            <div
              style={{
                fontSize: '17px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                marginTop: '4px',
              }}
            >
              라면 주문 시 4종 토핑 무제한 무료
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#CFC7B4',
                marginTop: '6px',
                lineHeight: 1.5,
              }}
            >
              신라면·짜파게티·너구리 등 한강 라면 조리기 완비!{' '}
              <strong>계란 · 대파 · 숙주 · 떡사리</strong>를 원하는 만큼 무료로 넣어 드세요.
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
            src={MASCOT_ASSETS.relaxing}
            alt="음료 마스코트"
            style={{ width: '68px', height: '68px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: '#8A6A00',
              }}
            >
              BEVERAGE SYSTEM
            </div>
            <div
              style={{
                fontSize: '17px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                marginTop: '4px',
              }}
            >
              음료 단품 4,000원부터 · 패키지 차액 업그레이드
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B6354',
                marginTop: '6px',
                lineHeight: 1.5,
              }}
            >
              패키지 기본 음료는 무료 제공되며, <strong>+200원 ~ +2,000원</strong> 차액으로
              에이드·스무디·쉐이크까지 즐기실 수 있습니다.
            </div>
          </div>
        </div>
      </div>

      {/* 3. 메뉴 카테고리 탭 네비게이션 */}
      <section>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            borderBottom: '2px solid #E5E0D5',
            paddingBottom: '14px',
          }}
        >
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

        {/* --- [A. 음료 섹션: 8대 카테고리 실물 메뉴판 스타일] --- */}
        {(activeTab === 'all' || activeTab === 'beverage') && (
          <div style={{ marginTop: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '18px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A6A00' }}>
                  BEVERAGES MENU BOARD (8 CATEGORIES)
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 900, marginTop: '2px' }}>
                  음료 메뉴판
                </h3>
              </div>

              {/* 음료 8대 카테고리 필터 칩 */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setBeverageSubFilter('전체')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: beverageSubFilter === '전체' ? '2px solid #1E1E1E' : '1px solid #D1C9BC',
                    background: beverageSubFilter === '전체' ? '#FED943' : '#FFFFFF',
                    color: '#1E1E1E',
                    fontSize: '12px',
                    fontWeight: beverageSubFilter === '전체' ? 900 : 700,
                    cursor: 'pointer',
                  }}
                >
                  전체 ({beverages.length})
                </button>
                {BEVERAGE_CATEGORIES.map((cat) => {
                  const count = beverages.filter(
                    (b) => normalizeBeverageCategory(b.subCategory) === cat.key
                  ).length;
                  const isSelected = beverageSubFilter === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setBeverageSubFilter(cat.key)}
                      type="button"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        border: isSelected ? '2px solid #1E1E1E' : '1px solid #D1C9BC',
                        background: isSelected ? '#1E1E1E' : '#FFFFFF',
                        color: isSelected ? '#FED943' : '#1E1E1E',
                        fontSize: '12px',
                        fontWeight: isSelected ? 900 : 700,
                        cursor: 'pointer',
                      }}
                    >
                      {cat.nameEn} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 음료 8대 카테고리 그룹 렌더링 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {BEVERAGE_CATEGORIES.filter((cat) => {
                if (beverageSubFilter === '전체') return true;
                return cat.key === beverageSubFilter;
              }).map((cat) => {
                const categoryBeverages = beverages.filter(
                  (b) => normalizeBeverageCategory(b.subCategory) === cat.key
                );
                if (categoryBeverages.length === 0) return null;

                return (
                  <div
                    key={cat.key}
                    style={{
                      background: '#FFFFFF',
                      border: '2.5px solid #1E1E1E',
                      borderRadius: '20px',
                      padding: '20px 22px',
                      boxShadow: '4px 4px 0 #1E1E1E',
                    }}
                  >
                    {/* 카테고리 헤더 */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '2px solid #1E1E1E',
                        paddingBottom: '12px',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '18px',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            color: '#1E1E1E',
                          }}
                        >
                          {cat.nameEn}
                        </span>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#8A8175',
                          }}
                        >
                          · {cat.nameKo}
                        </span>
                      </div>
                      {cat.badgeLabel && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 900,
                            background: '#E1F5FE',
                            color: '#0288D1',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #B3E5FC',
                            textTransform: 'uppercase',
                          }}
                        >
                          {cat.badgeLabel} 전용
                        </span>
                      )}
                    </div>

                    {/* 음료 카드 그리드 */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '10px',
                      }}
                    >
                      {categoryBeverages.map((bev) => (
                        <BeverageCard key={bev.id} item={bev} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 실물 메뉴판 하단 마스코트 & 안내 푸터 */}
            <div
              style={{
                marginTop: '20px',
                background: '#FFF9EC',
                border: '2px solid #1E1E1E',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={MASCOT_ASSETS.logoCircle}
                  alt="카툰플러스 마스코트"
                  style={{ width: '44px', height: '44px', objectFit: 'contain' }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#1E1E1E' }}>
                    {store?.name || '카툰플러스'} 현장 키오스크 주문 안내
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B6354', marginTop: '2px' }}>
                    {store?.address || '서울 관악구 관악로 155, 3층'} · 연락처:{' '}
                    {store?.phone || '02-882-9588'}
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#8A6A00',
                  background: '#FFF0BA',
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}
              >
                전 음료 테이크아웃 가능
              </span>
            </div>
          </div>
        )}

        {/* --- [B. 라면 & 식사 섹션] --- */}
        {(activeTab === 'all' || activeTab === 'meal') && (
          <div style={{ marginTop: '36px' }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A6A00' }}>
                FOOD & MEALS
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>라면 & 식사류</h3>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
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
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A6A00' }}>
                DESSERT & ICE CREAM
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>
                젤라또 & 디저트
              </h3>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
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
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A6A00' }}>
                SNACK & DRINK
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>과자 & 캔음료</h3>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
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
    if (diff <= 500)
      return { bg: '#FFF8E1', text: '#F57F17', label: `패키지 +${diff.toLocaleString()}원` };
    return { bg: '#EDE7F6', text: '#512DA8', label: `패키지 +${diff.toLocaleString()}원` };
  };

  const badge = getDiffBadgeColor(item.packageDiff);

  return (
    <div
      style={{
        background: '#FAF8F5',
        border: '1.5px solid #1E1E1E',
        borderRadius: '12px',
        padding: '11px 13px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '8px',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              background: badge.bg,
              color: badge.text,
            }}
          >
            {badge.label}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              color: item.temp === 'HOT' ? '#D32F2F' : item.temp === 'ICED' ? '#1976D2' : '#6B6354',
              background: item.temp === 'HOT' ? '#FFEBEE' : item.temp === 'ICED' ? '#E3F2FD' : '#F0ECE1',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {item.temp === 'HOT' ? 'HOT' : item.temp === 'ICED' ? 'ICE' : 'HOT / ICE'}
          </span>
        </div>

        <div
          style={{ fontSize: '14px', fontWeight: 900, marginTop: '6px', letterSpacing: '-0.02em', color: '#1E1E1E' }}
        >
          {item.nameKo}
        </div>
        {item.nameEn && (
          <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A8175', marginTop: '1px' }}>
            {item.nameEn}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          borderTop: '1px dashed #DDD7CD',
          paddingTop: '6px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B6354' }}>단품 구매 시</span>
        <span style={{ fontSize: '15px', fontWeight: 900, color: '#1E1E1E' }}>
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
        <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.02em' }}>
          {item.name}
        </div>
        {item.note && (
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#E65100', marginTop: '3px' }}>
            {item.note}
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

