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

export function StaffStoreSelector({
  variant = 'sidebar',
}: {
  variant?: 'sidebar' | 'header';
} = {}) {
  const context = useContext(StaffStoreContext);
  const [isOpen, setIsOpen] = useState(false);
  if (!context?.isAdmin) return null;
  const { selectedStoreSlug, selectStore } = context;
  const currentStore =
    publicStoreList.find((s) => s.slug === selectedStoreSlug) ?? publicStoreList[0];

  const isHeader = variant === 'header';

  return (
    <div style={{ position: 'relative', width: isHeader ? 'auto' : '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="관리 지점 선택"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          width: isHeader ? 'auto' : '100%',
          padding: isHeader ? '7px 12px' : '8px 12px',
          minHeight: isHeader ? '38px' : 'auto',
          background: isHeader ? '#FFF9EC' : '#2A2A2A',
          border: isHeader ? '2px solid #1E1E1E' : '1.5px solid #4A4438',
          borderRadius: isHeader ? '999px' : '10px',
          color: isHeader ? '#1E1E1E' : '#FFF9EC',
          fontSize: isHeader ? '12px' : '12px',
          fontWeight: 900,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.15s ease',
          boxShadow: isHeader ? '2px 2px 0 #1E1E1E' : 'none',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: isHeader ? '#8A6A00' : '#FED943', fontSize: '11px', fontWeight: 900 }}>
            {isHeader ? '지점' : '관리 지점'}
          </span>
          <span>{currentStore.name}</span>
        </span>
        <svg
          style={{
            width: '10px',
            height: '10px',
            color: isHeader ? '#1E1E1E' : '#FED943',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
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
              inset: 0,
              zIndex: 1050,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            role="menu"
            aria-label="관리 지점 선택"
            style={{
              position: isHeader ? 'fixed' : 'absolute',
              top: isHeader ? 'auto' : 'calc(100% + 6px)',
              bottom: isHeader ? '16px' : 'auto',
              left: isHeader ? '16px' : 0,
              right: isHeader ? '16px' : 'auto',
              width: isHeader ? 'auto' : '100%',
              maxWidth: isHeader ? '400px' : 'none',
              margin: isHeader ? '0 auto' : 0,
              zIndex: 1100,
              background: '#FFFFFF',
              border: '3px solid #1E1E1E',
              borderRadius: '18px',
              boxShadow: '6px 6px 0 #1E1E1E',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div
              style={{
                padding: '4px 8px 8px',
                fontSize: '12px',
                fontWeight: 900,
                color: '#8A6A00',
                letterSpacing: '0.05em',
                borderBottom: '1.5px solid #F0ECE1',
                marginBottom: '2px',
              }}
            >
              🏢 관리 대상 지점 선택
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
                    padding: '12px 14px',
                    minHeight: '44px',
                    borderRadius: '12px',
                    border: isCurrent ? '2px solid #1E1E1E' : '1.5px solid transparent',
                    background: isCurrent ? '#1E1E1E' : '#FFFDF5',
                    color: isCurrent ? '#FED943' : '#1E1E1E',
                    fontSize: '14px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{store.name}</span>
                  {isCurrent && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        background: '#FED943',
                        color: '#1E1E1E',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      현재 선택
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
