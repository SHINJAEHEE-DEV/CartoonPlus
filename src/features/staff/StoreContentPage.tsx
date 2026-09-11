import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  PRICE_PACKAGES as INITIAL_PRICE_PACKAGES,
  BEVERAGE_ITEMS as INITIAL_BEVERAGE_ITEMS,
  FOOD_ITEMS as INITIAL_FOOD_ITEMS,
  type PricePackage,
  type BeverageItem,
  type MenuItem,
} from '../customer/menuData';

export function StoreContentPage() {
  const [activeTab, setActiveTab] = useState<'packages' | 'beverages' | 'foods' | 'info'>('info');
  const [message, setMessage] = useState('');

  const [storeInfo, setStoreInfo] = useState(() => {
    const saved = localStorage.getItem('cp_store_info');
    return saved ? JSON.parse(saved) : {
      address: '서울특별시 관악구 관악로 155, 3층 (봉천동 856-5 대우디오슈페리움 1단지)',
      phone: '02-888-0852',
      hours: '매일 10:00 – 23:00 (연중무휴, 공휴일·명절 정상 영업)',
      parking: '건물 지하 주차장 이용 가능 (이용 시 카운터 문의)',
      directions: '지하철 2호선 서울대입구역 3번 출구에서 도보 1~2분 직진. 1층 빽다방·올리브영 건물 3층.'
    };
  });

  // 1. 요금제 상태
  const [packages, setPackages] = useState<PricePackage[]>(() => {
    const saved = localStorage.getItem('cp_price_packages');
    return saved ? JSON.parse(saved) : INITIAL_PRICE_PACKAGES;
  });

  // 2. 음료 메뉴 상태
  const [beverages, setBeverages] = useState<BeverageItem[]>(() => {
    const saved = localStorage.getItem('cp_beverage_items');
    return saved ? JSON.parse(saved) : INITIAL_BEVERAGE_ITEMS;
  });

  // 3. 음식/디저트/스낵 상태
  const [foods, setFoods] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cp_food_items');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [bevSubFilter, setBevSubFilter] = useState<string>('ALL');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Supabase 로드 시도
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!supabase) return;
      try {
        const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
        if (!store) return;
        const { data } = await supabase.from('store_content').select('content_key, content_value').eq('store_id', store.id);
        if (data) {
          for (const item of data) {
            if (item.content_key === 'price_packages' && Array.isArray(item.content_value?.packages)) {
              setPackages(item.content_value.packages);
            } else if (item.content_key === 'beverage_items' && Array.isArray(item.content_value?.beverages)) {
              setBeverages(item.content_value.beverages);
            } else if (item.content_key === 'food_items' && Array.isArray(item.content_value?.foods)) {
              setFoods(item.content_value.foods);
            } else if (item.content_key === 'store_info' && item.content_value) {
              setStoreInfo(item.content_value);
            }
          }
        }
      } catch {
        // Supabase 테이블 구조가 다를 경우 로컬 상태 유지
      }
    };
    void loadFromSupabase();
  }, []);

  // 저장 헬퍼
  const savePackagesToStorage = async (newPackages: PricePackage[]) => {
    setPackages(newPackages);
    localStorage.setItem('cp_price_packages', JSON.stringify(newPackages));
    if (supabase) {
      const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
      if (store) {
        await supabase.from('store_content').upsert(
          { store_id: store.id, content_key: 'price_packages', content_value: { packages: newPackages } },
          { onConflict: 'store_id,content_key' }
        );
      }
    }
  };

  const saveBeveragesToStorage = async (newBeverages: BeverageItem[]) => {
    setBeverages(newBeverages);
    localStorage.setItem('cp_beverage_items', JSON.stringify(newBeverages));
    if (supabase) {
      const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
      if (store) {
        await supabase.from('store_content').upsert(
          { store_id: store.id, content_key: 'beverage_items', content_value: { beverages: newBeverages } },
          { onConflict: 'store_id,content_key' }
        );
      }
    }
  };

  const saveFoodsToStorage = async (newFoods: MenuItem[]) => {
    setFoods(newFoods);
    localStorage.setItem('cp_food_items', JSON.stringify(newFoods));
    if (supabase) {
      const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
      if (store) {
        await supabase.from('store_content').upsert(
          { store_id: store.id, content_key: 'food_items', content_value: { foods: newFoods } },
          { onConflict: 'store_id,content_key' }
        );
      }
    }
  };

  const saveStoreInfoToStorage = async (newInfo: any) => {
    setStoreInfo(newInfo);
    localStorage.setItem('cp_store_info', JSON.stringify(newInfo));
    if (supabase) {
      const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
      if (store) {
        await supabase.from('store_content').upsert(
          { store_id: store.id, content_key: 'store_info', content_value: newInfo },
          { onConflict: 'store_id,content_key' }
        );
      }
    }
    setMessage('매장 정보를 저장했습니다.');
  };

  // --- 1. 요금제 핸들러 ---
  const handleAddPackage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name')).trim();
    const price = String(f.get('price')).trim();
    const note = String(f.get('note')).trim();
    const isPopular = f.get('isPopular') === 'on';

    if (!name || !price) return;

    const updated = [...packages, { name, price, note, isPopular }];
    void savePackagesToStorage(updated);
    setMessage(`'${name}' 요금제를 추가했습니다.`);
    e.currentTarget.reset();
  };

  const handleDeletePackage = (index: number) => {
    const updated = packages.filter((_, idx) => idx !== index);
    void savePackagesToStorage(updated);
    setMessage('요금제를 삭제했습니다.');
  };

  const handleTogglePopularPackage = (index: number) => {
    const updated = packages.map((pkg, idx) => (idx === index ? { ...pkg, isPopular: !pkg.isPopular } : pkg));
    void savePackagesToStorage(updated);
    setMessage('인기 요금제 뱃지 설정을 변경했습니다.');
  };

  // --- 2. 음료 핸들러 ---
  const handleAddBeverage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nameKo = String(f.get('nameKo')).trim();
    const nameEn = String(f.get('nameEn')).trim() || undefined;
    const temp = String(f.get('temp')) as 'HOT' | 'ICED' | 'BOTH';
    const subCategory = String(f.get('subCategory')) as BeverageItem['subCategory'];
    const packageDiff = Number(f.get('packageDiff')) || 0;
    const singlePrice = Number(f.get('singlePrice')) || 4000;

    if (!nameKo) return;

    const newItem: BeverageItem = {
      id: `bev-custom-${Date.now()}`,
      nameKo,
      nameEn,
      temp,
      subCategory,
      packageDiff,
      singlePrice,
      isSoldOut: false,
    };

    const updated = [newItem, ...beverages];
    void saveBeveragesToStorage(updated);
    setMessage(`'${nameKo}' 음료를 메뉴에 등록했습니다.`);
    e.currentTarget.reset();
  };

  const handleToggleSoldOutBeverage = (id: string) => {
    const updated = beverages.map((b) => (b.id === id ? { ...b, isSoldOut: !b.isSoldOut } : b));
    void saveBeveragesToStorage(updated);
    setMessage('음료 품절 상태를 변경했습니다.');
  };

  const handleDeleteBeverage = (id: string) => {
    const updated = beverages.filter((b) => b.id !== id);
    void saveBeveragesToStorage(updated);
    setMessage('음료 메뉴를 삭제했습니다.');
  };

  // --- 3. 음식/디저트 핸들러 ---
  const handleAddFood = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name')).trim();
    const price = Number(f.get('price')) || 4000;
    const category = String(f.get('category')) as 'meal' | 'dessert' | 'snack';
    const note = String(f.get('note')).trim() || undefined;
    const isPopular = f.get('isPopular') === 'on';

    if (!name) return;

    const categoryKoMap = {
      meal: '라면/음식',
      dessert: '젤라또/디저트',
      snack: '과자/음료',
    };

    const newItem: MenuItem = {
      id: `food-custom-${Date.now()}`,
      name,
      price,
      category,
      categoryKo: categoryKoMap[category],
      note,
      isPopular,
      isSoldOut: false,
    };

    const updated = [newItem, ...foods];
    void saveFoodsToStorage(updated);
    setMessage(`'${name}' 상품을 등록했습니다.`);
    e.currentTarget.reset();
  };

  const handleToggleSoldOutFood = (id: string) => {
    const updated = foods.map((item) => (item.id === id ? { ...item, isSoldOut: !item.isSoldOut } : item));
    void saveFoodsToStorage(updated);
    setMessage('상품 품절 상태를 변경했습니다.');
  };

  const handleDeleteFood = (id: string) => {
    const updated = foods.filter((item) => item.id !== id);
    void saveFoodsToStorage(updated);
    setMessage('상품을 삭제했습니다.');
  };

  // 필터링
  const filteredBeverages = beverages.filter((b) => {
    const matchesCategory = bevSubFilter === 'ALL' || b.subCategory === bevSubFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      b.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.nameEn && b.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredFoods = foods.filter((f) => {
    const matchesCategory = foodCategoryFilter === 'ALL' || f.category === foodCategoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.note && f.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="section-kicker">STORE CONTENT & PRICING</div>
          <h1 className="section-title">매장 요금제 및 메뉴 관리</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#6B6354', fontWeight: 600 }}>
            이용 요금제, 음료(단품가/패키지 차액), 식사·라면·젤라또·스낵 메뉴를 실시간으로 추가, 수정, 품절 처리합니다.
          </p>
        </div>

        {/* 상단 탭 스위처 */}
        <div style={{ display: 'flex', gap: '8px', background: '#FFF9EC', padding: '6px', borderRadius: '14px', border: '2.5px solid #1E1E1E', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveTab('info'); setSearchQuery(''); }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: activeTab === 'info' ? '#1E1E1E' : 'transparent',
              color: activeTab === 'info' ? '#FED943' : '#1E1E1E',
              fontWeight: 800,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            기본 정보 관리
          </button>
          <button
            onClick={() => { setActiveTab('packages'); setSearchQuery(''); }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '2px solid #1E1E1E',
              background: activeTab === 'packages' ? '#FED943' : '#FFFFFF',
              fontWeight: 900,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            💳 이용 요금제 ({packages.length})
          </button>
          <button
            onClick={() => { setActiveTab('beverages'); setSearchQuery(''); }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '2px solid #1E1E1E',
              background: activeTab === 'beverages' ? '#FED943' : '#FFFFFF',
              fontWeight: 900,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            음료 메뉴 ({beverages.length})
          </button>
          <button
            onClick={() => { setActiveTab('foods'); setSearchQuery(''); }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '2px solid #1E1E1E',
              background: activeTab === 'foods' ? '#FED943' : '#FFFFFF',
              fontWeight: 900,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            식사·디저트·스낵 ({foods.length})
          </button>
        </div>
      </div>

      {/* 알림 메시지 */}
      {message && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            background: '#FFF3C9',
            border: '2px solid #1E1E1E',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>📋 {message}</span>
          <button onClick={() => setMessage('')} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 900, cursor: 'pointer' }}>
            ✕
          </button>
        </div>
      )}

      {/* ========================================================
          탭 1: 이용 요금제 관리
      ======================================================== */}
      {activeTab === 'packages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* 새 요금제 추가 카드 */}
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1E1E1E',
              borderRadius: '22px',
              padding: '24px',
              boxShadow: '4px 4px 0 #1E1E1E',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 900, marginBottom: '14px' }}>+ 새 이용 요금제 추가</div>
            <form onSubmit={handleAddPackage} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>요금제 명칭</label>
                <input name="name" placeholder="예: 2시간 + 기본 음료" required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 700, fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>가격 표기</label>
                <input name="price" placeholder="예: 9,500원" required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 700, fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>안내 / 혜택 문구</label>
                <input name="note" placeholder="예: 기본 음료 포함 · 초과 10분당 600원" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 700, fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                  <input type="checkbox" name="isPopular" style={{ width: '18px', height: '18px' }} />
                  인기 뱃지 부여
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '11px 18px',
                    borderRadius: '10px',
                    background: '#FED943',
                    color: '#1E1E1E',
                    border: '2.5px solid #1E1E1E',
                    fontWeight: 900,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0 #1E1E1E',
                  }}
                >
                  요금제 등록 +
                </button>
              </div>
            </form>
          </div>

          {/* 현재 요금제 목록 그리드 */}
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1E1E1E',
              borderRadius: '22px',
              padding: '24px',
              boxShadow: '4px 4px 0 #1E1E1E',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 900 }}>📋 등록된 이용 요금제 ({packages.length}개)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {packages.map((pkg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '18px',
                    borderRadius: '16px',
                    border: '2.5px solid #1E1E1E',
                    background: pkg.isPopular ? '#FFF3C9' : '#FFFFFF',
                    boxShadow: '3px 3px 0 #1E1E1E',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#1E1E1E' }}>{pkg.name}</span>
                      {pkg.isPopular && (
                        <span style={{ padding: '2px 8px', borderRadius: '999px', background: '#FF4D4D', color: '#FFF', fontSize: '11px', fontWeight: 900 }}>
                          인기 BEST
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#E65100', marginBottom: '6px' }}>{pkg.price}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B6354', lineHeight: 1.4 }}>{pkg.note}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px dashed #D3CEC4' }}>
                    <button
                      onClick={() => handleTogglePopularPackage(idx)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: '#FFF',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      {pkg.isPopular ? '인기 해제' : '인기 지정'}
                    </button>
                    <button
                      onClick={() => handleDeletePackage(idx)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: '#FFF',
                        color: '#C92A2A',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          탭 2: 음료 메뉴 관리
      ======================================================== */}
      {activeTab === 'beverages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* 새 음료 추가 카드 */}
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1E1E1E',
              borderRadius: '22px',
              padding: '24px',
              boxShadow: '4px 4px 0 #1E1E1E',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 900, marginBottom: '14px' }}>+ 새 음료 메뉴 등록</div>
            <form onSubmit={handleAddBeverage} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>한글 음료명</label>
                <input name="nameKo" placeholder="예: 아이스 초코라떼" required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 700, fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>영문명 (옵션)</label>
                <input name="nameEn" placeholder="CHOCO LATTE" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 700, fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>카테고리</label>
                <select name="subCategory" defaultValue="라떼/음료" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 800, fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value="아이스티/티">아이스티/티</option>
                  <option value="라떼/음료">라떼/음료</option>
                  <option value="콤부차">콤부차</option>
                  <option value="에이드">에이드</option>
                  <option value="스무디/생과일">스무디/생과일</option>
                  <option value="쉐이크">쉐이크</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>온도</label>
                <select name="temp" defaultValue="ICED" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 800, fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value="ICED">ICED</option>
                  <option value="HOT">HOT</option>
                  <option value="BOTH">HOT & ICED</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>단품 가격 (원)</label>
                <input name="singlePrice" type="number" defaultValue={4000} step={100} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 800, fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>패키지 추가금 (원)</label>
                <select name="packageDiff" defaultValue={0} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 800, fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value={0}>+0원 (기본 제공)</option>
                  <option value={200}>+200원 (프리미엄 티)</option>
                  <option value={500}>+500원 (과일차/아샷추)</option>
                  <option value={1500}>+1,500원 (에이드)</option>
                  <option value={2000}>+2,000원 (스무디/쉐이크)</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '11px 18px',
                    borderRadius: '10px',
                    background: '#FED943',
                    color: '#1E1E1E',
                    border: '2.5px solid #1E1E1E',
                    fontWeight: 900,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0 #1E1E1E',
                  }}
                >
                  음료 등록 +
                </button>
              </div>
            </form>
          </div>

          {/* 음료 목록 & 필터 */}
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1E1E1E',
              borderRadius: '22px',
              padding: '24px',
              boxShadow: '4px 4px 0 #1E1E1E',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '18px', fontWeight: 900 }}>음료 메뉴 ({filteredBeverages.length}종)</div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="음료명 검색..."
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #1E1E1E', fontSize: '12px', fontWeight: 600 }}
                />

                {['ALL', '아이스티/티', '라떼/음료', '콤부차', '에이드', '스무디/생과일', '쉐이크'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setBevSubFilter(sub)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      border: '1.5px solid #1E1E1E',
                      background: bevSubFilter === sub ? '#FED943' : '#FFF',
                      fontWeight: 800,
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {filteredBeverages.map((bev) => (
                <div
                  key={bev.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '2px solid #1E1E1E',
                    background: bev.isSoldOut ? '#F5F3EF' : '#FFF9EC',
                    opacity: bev.isSoldOut ? 0.65 : 1,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 900, background: '#1E1E1E', color: '#FED943', padding: '2px 6px', borderRadius: '4px' }}>
                        {bev.subCategory} · {bev.temp}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: bev.packageDiff === 0 ? '#D6F5E3' : '#FFF3C9',
                          color: bev.packageDiff === 0 ? '#1A7A3E' : '#B25E00',
                          border: '1px solid #1E1E1E',
                        }}
                      >
                        패키지 {bev.packageDiff === 0 ? '+0원 (기본)' : `+${bev.packageDiff.toLocaleString()}원`}
                      </span>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#1E1E1E' }}>{bev.nameKo}</div>
                    {bev.nameEn && <div style={{ fontSize: '11px', fontWeight: 600, color: '#8A8175' }}>{bev.nameEn}</div>}
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#E65100', marginTop: '6px' }}>
                      단품 {bev.singlePrice.toLocaleString()}원
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #D3CEC4', marginTop: '10px' }}>
                    <button
                      onClick={() => handleToggleSoldOutBeverage(bev.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: bev.isSoldOut ? '#E0DCD3' : '#FED943',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '11px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      {bev.isSoldOut ? '품절 해제 ⟲' : '품절 처리'}
                    </button>
                    <button
                      onClick={() => handleDeleteBeverage(bev.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: '#FFF',
                        color: '#C92A2A',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          탭 3: 식사 / 디저트 / 스낵 관리
      ======================================================== */}
      {activeTab === 'foods' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* 새 음식 추가 카드 */}
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1E1E1E',
              borderRadius: '22px',
              padding: '24px',
              boxShadow: '4px 4px 0 #1E1E1E',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 900, marginBottom: '14px' }}>+ 새 식사/디저트/스낵 메뉴 등록</div>
            <form onSubmit={handleAddFood} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>상품명</label>
                <input name="name" placeholder="예: 라면 / 치킨 / 젤라또" required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 700, fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>카테고리</label>
                <select name="category" defaultValue="meal" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 800, fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value="meal">라면 / 식사류</option>
                  <option value="dessert">젤라또 / 디저트</option>
                  <option value="snack">과자 / 캔음료</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>판매 가격 (원)</label>
                <input name="price" type="number" defaultValue={4000} step={100} required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 800, fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>비고 / 혜택 문구</label>
                <input name="note" placeholder="예: 대파·숙주·계란 토핑 바 무료" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontWeight: 700, fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                  <input type="checkbox" name="isPopular" style={{ width: '18px', height: '18px' }} />
                  인기 뱃지
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '11px 18px',
                    borderRadius: '10px',
                    background: '#FED943',
                    color: '#1E1E1E',
                    border: '2.5px solid #1E1E1E',
                    fontWeight: 900,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0 #1E1E1E',
                  }}
                >
                  상품 등록 +
                </button>
              </div>
            </form>
          </div>

          {/* 목록 & 필터 */}
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1E1E1E',
              borderRadius: '22px',
              padding: '24px',
              boxShadow: '4px 4px 0 #1E1E1E',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '18px', fontWeight: 900 }}>식사·디저트·스낵 상품 ({filteredFoods.length}종)</div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="상품명 검색..."
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #1E1E1E', fontSize: '12px', fontWeight: 600 }}
                />

                {[
                  ['ALL', '전체'],
                  ['meal', '라면/음식'],
                  ['dessert', '젤라또/디저트'],
                  ['snack', '과자/음료'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFoodCategoryFilter(key)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      border: '1.5px solid #1E1E1E',
                      background: foodCategoryFilter === key ? '#FED943' : '#FFF',
                      fontWeight: 800,
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {filteredFoods.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '2px solid #1E1E1E',
                    background: item.isSoldOut ? '#F5F3EF' : '#FFF9EC',
                    opacity: item.isSoldOut ? 0.65 : 1,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 900, background: '#1E1E1E', color: '#FED943', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.categoryKo}
                      </span>
                      {item.isPopular && (
                        <span style={{ fontSize: '11px', fontWeight: 900, background: '#FF4D4D', color: '#FFF', padding: '2px 6px', borderRadius: '4px' }}>
                          인기 BEST
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#1E1E1E' }}>{item.name}</div>
                    {item.note && <div style={{ fontSize: '11px', fontWeight: 700, color: '#E65100', marginTop: '2px' }}>{item.note}</div>}
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#1E1E1E', marginTop: '6px' }}>
                      {item.price.toLocaleString()}원
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #D3CEC4', marginTop: '10px' }}>
                    <button
                      onClick={() => handleToggleSoldOutFood(item.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: item.isSoldOut ? '#E0DCD3' : '#FED943',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '11px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      {item.isSoldOut ? '품절 해제 ⟲' : '품절 처리'}
                    </button>
                    <button
                      onClick={() => handleDeleteFood(item.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: '#FFF',
                        color: '#C92A2A',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- INFO 탭 --- */}
      {activeTab === 'info' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#FFF', border: '3px solid #1E1E1E', borderRadius: '24px', padding: '24px', boxShadow: '5px 5px 0 #1E1E1E' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>📍 매장 기본 정보 설정</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void saveStoreInfoToStorage({
                  address: String(f.get('address')),
                  phone: String(f.get('phone')),
                  hours: String(f.get('hours')),
                  parking: String(f.get('parking')),
                  directions: String(f.get('directions')),
                });
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>영업시간</label>
                <input name="hours" defaultValue={storeInfo.hours} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '14px', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>주소</label>
                <input name="address" defaultValue={storeInfo.address} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '14px', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>오시는 길</label>
                <textarea name="directions" defaultValue={storeInfo.directions} rows={2} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '14px', fontWeight: 700, resize: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>주차 정보</label>
                <input name="parking" defaultValue={storeInfo.parking} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '14px', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>매장 연락처 (문의)</label>
                <input name="phone" defaultValue={storeInfo.phone} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '14px', fontWeight: 700 }} />
              </div>

              <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <button
                  type="submit"
                  style={{ padding: '12px 24px', background: '#FED943', border: '2px solid #1E1E1E', borderRadius: '10px', fontSize: '14px', fontWeight: 900, cursor: 'pointer' }}
                >
                  기본 정보 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

