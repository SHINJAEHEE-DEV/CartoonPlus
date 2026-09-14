import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { publicStoreList, type StoreSlug } from '../../lib/storeContext';
import { supabase } from '../../lib/supabase';

type StaffStoreContextValue = { selectedStoreSlug: StoreSlug; selectStore: (slug: StoreSlug) => void; isAdmin: boolean };
const StaffStoreContext = createContext<StaffStoreContextValue | null>(null);

export function StaffStoreProvider({ isAdmin, defaultStoreSlug, children }: { isAdmin: boolean; defaultStoreSlug: StoreSlug; children: ReactNode }) {
  const [selectedStoreSlug, setSelectedStoreSlug] = useState(defaultStoreSlug);
  const value = useMemo(() => ({ selectedStoreSlug, isAdmin, selectStore: (slug: StoreSlug) => { if (isAdmin) setSelectedStoreSlug(slug); } }), [isAdmin, selectedStoreSlug]);
  return <StaffStoreContext value={value}>{children}</StaffStoreContext>;
}

export function useStaffStore() {
  const context = useContext(StaffStoreContext);
  if (!context) throw new Error('StaffStoreProvider is required');
  return context;
}

export function useSelectedStaffStoreId() {
  const { selectedStoreSlug } = useStaffStore();
  const [storeId, setStoreId] = useState<string | null>(null);
  useEffect(() => {
    if (!supabase) return setStoreId(null);
    void supabase.from('stores').select('id').eq('slug', selectedStoreSlug).single().then(({ data }) => setStoreId(data?.id ?? null));
  }, [selectedStoreSlug]);
  return storeId;
}

export function StaffStoreSelector() {
  const context = useContext(StaffStoreContext);
  if (!context?.isAdmin) return null;
  const { selectedStoreSlug, selectStore } = context;
  return <label style={{ color: '#FFF9EC', fontSize: '12px', fontWeight: 800 }}>관리 지점 <select value={selectedStoreSlug} onChange={(event) => selectStore(event.target.value as StoreSlug)}>{publicStoreList.map((store) => <option key={store.slug} value={store.slug}>{store.name}</option>)}</select></label>;
}
