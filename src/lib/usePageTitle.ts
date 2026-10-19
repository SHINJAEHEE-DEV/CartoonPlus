import { useEffect } from 'react';
import { usePublicStore } from './storeContext';

export function usePageTitle(title?: string | null, storeNameOverride?: string | null) {
  const { store, scoped } = usePublicStore();

  useEffect(() => {
    const currentName = storeNameOverride ?? (store ? store.name : null);
    if (title) {
      document.title = currentName
        ? `${title} | 카툰플러스 ${currentName}`
        : `${title} | 카툰플러스`;
    } else {
      document.title = currentName
        ? `카툰플러스 ${currentName} | 실시간 도서 검색 & 매장 안내`
        : '카툰플러스 (CartoonPlus) 공식 사이트';
    }
  }, [title, storeNameOverride, store, scoped]);
}
