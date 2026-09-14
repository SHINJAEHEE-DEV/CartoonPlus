import { createContext, useContext } from 'react';

export type StoreSlug = 'snu' | 'jamsil' | 'hongdae';

export type PublicStore = {
  slug: StoreSlug;
  name: string;
  phone?: string;
  address?: string;
  hours?: string;
};

const publicStores: Record<StoreSlug, PublicStore> = {
  snu: {
    slug: 'snu',
    name: '서울대입구역점',
    phone: '02-888-0852',
    address: '서울특별시 관악구 관악로 155, 3층 (봉천동 대우디오슈페리움 1단지)',
    hours: '매일 10:00 – 23:00 · 연중무휴 정상 영업',
  },
  jamsil: {
    slug: 'jamsil',
    name: '잠실점',
    phone: '02-423-9588',
    address: '서울특별시 송파구 백제고분로9길 23, 2층 (잠실동)',
    hours: '월~목 10:00–23:00 / 금 10:00–24:00 / 토 24시간 / 일 00:00–23:00',
  },
  hongdae: {
    slug: 'hongdae',
    name: '홍대점',
    phone: '02-337-6588',
    address: '서울특별시 마포구 양화로16길 29 (서교동) 홍익몰 지하 1층',
    hours: '24시간 영업 · 연중무휴 정상 영업',
  },
};

export const defaultPublicStore = publicStores.snu;
export const publicStoreList = Object.values(publicStores);

export function getPublicStore(slug: string | undefined): PublicStore | undefined {
  if (!slug || !(slug in publicStores)) return undefined;
  return publicStores[slug as StoreSlug];
}

export function storePath(store: PublicStore, path = ''): string {
  return `/stores/${store.slug}${path}`;
}

export type CustomerStoreContext = {
  store: PublicStore;
  scoped: boolean;
};

export const StoreContext = createContext<CustomerStoreContext>({
  store: defaultPublicStore,
  scoped: false,
});

export function usePublicStore(): CustomerStoreContext {
  return useContext(StoreContext);
}
