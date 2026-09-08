import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type MenuItem = { id: string; name: string; description: string | null; price: number | null; category: string; is_soldout: boolean };
export function MenuPage(){
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(()=>{ if (!supabase) { setItems([]); return; } void supabase.from('menu_items').select('id,name,description,price,category,is_soldout').order('sort_order').then(({data,error})=>{if(error)setError(true);else setItems((data ?? []) as MenuItem[])}); },[]);
  return <section className="content-page"><p className="section-kicker">FOOD & PRICE</p><h1>메뉴·요금</h1><p className="page-lede">판매 메뉴와 이용 요금은 매장 운영 정보가 확인된 항목만 안내합니다.</p>{error?<p className="state-card">메뉴 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>:items === null ? <p className="state-card">메뉴 정보를 불러오는 중입니다.</p> : items.length === 0 ? <p className="state-card">현재 공개된 메뉴·요금 정보가 없습니다. 자세한 내용은 매장 카운터에 문의해 주세요.</p> : <ul className="content-grid">{items.map(item=><li key={item.id} className="info-card"><p className="card-tag">{item.category}</p><h2>{item.name}</h2>{item.description&&<p>{item.description}</p>}<strong>{item.is_soldout ? '품절' : item.price == null ? '카운터 문의' : `${item.price.toLocaleString()}원`}</strong></li>)}</ul>}</section>;
}
