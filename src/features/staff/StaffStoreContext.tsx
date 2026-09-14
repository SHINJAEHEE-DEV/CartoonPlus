import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { publicStoreList, type StoreSlug } from '../../lib/storeContext';
import { supabase } from '../../lib/supabase';

type StaffStoreContextValue = {
  selectedStoreSlug: StoreSlug;
  selectStore: (slug: StoreSlug) => void;
  isAdmin: boolean;
};
const StaffStoreContext = createContext<StaffStoreContextValue | null>(null);

export function StaffStoreProvider({
  isAdmin,
  defaultStoreSlug,
  children,
}: {
  isAdmin: boolean;
  defaultStoreSlug: StoreSlug;
  children: ReactNode;
}) {
  const [selectedStoreSlug, setSelectedStoreSlug] = useState(defaultStoreSlug);
  const value = useMemo(
    () => ({
      selectedStoreSlug,
      isAdmin,
      selectStore: (slug: StoreSlug) => {
        if (isAdmin) setSelectedStoreSlug(slug);
      },
    }),
    [isAdmin, selectedStoreSlug]
  );
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
    void supabase
      .from('stores')
      .select('id')
      .eq('slug', selectedStoreSlug)
      .single()
      .then(({ data }) => setStoreId(data?.id ?? null));
  }, [selectedStoreSlug]);
  return storeId;
}

export function StaffStoreSelector() {
  const context = useContext(StaffStoreContext);
  const [isOpen, setIsOpen] = useState(false);
  if (!context?.isAdmin) return null;
  const { selectedStoreSlug, selectStore } = context;
  const currentStore =
    publicStoreList.find((s) => s.slug === selectedStoreSlug) ?? publicStoreList[0];

  return (
    <div style={{ position: 'relative', width: '100%', marginTop: '4px' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '8px 12px',
          background: '#2A2A2A',
          border: '1.5px solid #4A4438',
          borderRadius: '10px',
          color: '#FFF9EC',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.15s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#FED943', fontSize: '10px', fontWeight: 900 }}>관리 지점</span>
          <span>{currentStore.name}</span>
        </span>
        <svg
          style={{
            width: '10px',
            height: '10px',
            color: '#FED943',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 45,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            role="menu"
            aria-label="관리 지점 선택"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              zIndex: 50,
              background: '#FFFFFF',
              border: '2px solid #1E1E1E',
              borderRadius: '12px',
              boxShadow: '3px 3px 0 #1E1E1E',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 900,
                color: '#8A6A00',
                letterSpacing: '0.05em',
              }}
            >
              지점 전환
            </div>
            {publicStoreList.map((store) => {
              const isCurrent = store.slug === selectedStoreSlug;
              return (
                <button
                  key={store.slug}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    selectStore(store.slug);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isCurrent ? '#1E1E1E' : 'transparent',
                    color: isCurrent ? '#FED943' : '#1E1E1E',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{store.name}</span>
                  {isCurrent && <span style={{ fontSize: '10px', fontWeight: 900 }}>선택됨</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
