import { useEffect, useState } from 'react';

import { usePublicStore } from '../../lib/storeContext';
import { supabase } from '../../lib/supabase';
import { usePageTitle } from '../../lib/usePageTitle';

type StoreMenuItem = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  price: number | null;
  is_soldout: boolean;
};

export function StoreMenuPage() {
  const { store } = usePublicStore();
  usePageTitle(`${store.name} 메뉴`);
  const [items, setItems] = useState<StoreMenuItem[] | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) return setItems([]);
    void client
      .from('stores')
      .select('id')
      .eq('slug', store.slug)
      .single()
      .then(({ data: target }) => {
        if (!target) return setItems([]);
        void client
          .from('menu_items')
          .select('id,category,name,description,price,is_soldout')
          .eq('store_id', target.id)
          .order('sort_order')
          .then(({ data }) => setItems(data ?? []));
      });
  }, [store.slug]);

  if (items === null) return <p className="state-card">메뉴를 불러오는 중입니다.</p>;
  if (!items.length) return <p className="state-card">이 지점의 메뉴와 요금은 점검 중입니다.</p>;

  const sections = [
    ['rate', '이용 요금제'],
    ['food', '음식'],
    ['beverage', '음료'],
  ] as const;
  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div className="section-kicker">PRICE & MENU</div>
        <h1 className="section-title">{store.name} 메뉴 안내</h1>
        <p>현장 사진으로 확인된 메뉴와 요금만 안내합니다.</p>
      </div>
      {sections.map(([category, title]) => {
        const sectionItems = items.filter((item) => item.category === category);
        if (!sectionItems.length) return null;
        return (
          <section key={category}>
            <h2>{title}</h2>
            <div className="price-grid">
              {sectionItems.map((item) => (
                <article key={item.id} className="price-card">
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                  <b>{item.price === null ? '가격 확인 중' : `${item.price.toLocaleString()}원`}</b>
                  {item.is_soldout && <small>품절</small>}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
