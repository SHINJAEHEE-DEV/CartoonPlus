import { EVENT_BANNERS } from './brandAssets';

export type EventStoreSlug = 'snu' | 'jamsil' | 'hongdae' | 'all';

export interface ManagedEvent {
  id: string;
  title: string;
  tag: string;
  target: string;
  detail: string;
  bannerType: 'weekday' | 'naver_ramen' | 'snu' | 'custom';
  customBannerUrl?: string;
  startDate?: string;
  endDate?: string;
  isAlwaysOn: boolean;
  isPublic: boolean;
  isFeatured?: boolean;
  createdAt: string;
  storeSlug?: EventStoreSlug;
}

export const STORAGE_KEY = 'cartoonplus_managed_events';

export const INITIAL_EVENTS: ManagedEvent[] = [
  {
    id: 'evt-1',
    title: '평일 종일 이용권 추가 혜택 이벤트',
    tag: '10월 말까지 한정',
    target: '평일 종일 이용권 결제 고객 전원',
    detail: '음료 포함 15,000원 특가 이용 + 젤라또(무료) 또는 라면(무료) 택 1 추가 증정',
    bannerType: 'weekday',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    isAlwaysOn: false,
    isPublic: true,
    isFeatured: false,
    storeSlug: 'all',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'evt-2',
    title: '네이버 영수증 포토 리뷰 — 라면 무료 쿠폰',
    tag: '상시 리뷰 쿠폰',
    target: '네이버 플레이스 영수증 인증 후 포토 리뷰 작성 고객 전원',
    detail: '즉석 한강 라면 무료 + 계란·대파·숙주·떡사리 4종 무제한 토핑 바 100% 무료 제공',
    bannerType: 'naver_ramen',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: true,
    storeSlug: 'all',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'evt-3',
    title: '맘맘(MomMom) 멤버십 제휴 — 젤라또 & 무제한 토핑 무료',
    tag: '네이버·멤버십 제휴',
    target: '맘맘(MomMom) 멤버십 QR 인증 고객 전원 (타 이벤트 중복 가능)',
    detail:
      '현장에서 맘맘 멤버십 QR 제시 시 프리미엄 젤라또 1개 무료 + 라면 토핑 바 무제한 무료 이용',
    bannerType: 'weekday',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: false,
    storeSlug: 'all',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'evt-4',
    title: '잠실 직관 티켓 인증 — 4,000원 음료 무료 증정',
    tag: '잠실점 단독 이벤트',
    target: '잠실 야구장 경기 또는 종합운동장 공연/콘서트 당일 티켓 소지 고객',
    detail:
      '당일 실물 또는 모바일 티켓 인증 시 카툰플러스 4,000원 상당 음료(아메리카노/아이스티 등) 무료 증정',
    bannerType: 'weekday',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: true,
    storeSlug: 'jamsil',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'evt-5',
    title: '2026 서울대학교 단과대학생회장연석회의 공식 제휴',
    tag: '서울대점 단독 제휴',
    target: '서울대학교 학부생 및 대학원생 전원 (학생증 제시)',
    detail: '패키지 요금제 10% 현장 즉시 할인 + 평일 종일권 결제 시 기본 음료 무료 업그레이드',
    bannerType: 'snu',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: true,
    storeSlug: 'snu',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export function getBannerImageUrl(type: ManagedEvent['bannerType'], customUrl?: string): string {
  if (type === 'weekday') return EVENT_BANNERS.weekday;
  if (type === 'naver_ramen') return EVENT_BANNERS.naverRamen;
  if (type === 'snu') return EVENT_BANNERS.snu;
  if (type === 'custom' && customUrl) return customUrl;
  return EVENT_BANNERS.placeholder;
}

export function isEventMatchingStore(event: ManagedEvent, storeSlug?: string): boolean {
  if (!storeSlug || storeSlug === 'all') return true;
  if (!event.storeSlug || event.storeSlug === 'all') {
    if (storeSlug !== 'snu' && event.bannerType === 'snu') return false;
    return true;
  }
  return event.storeSlug === storeSlug;
}

export function loadManagedEvents(storeSlug?: string): ManagedEvent[] {
  let allEvents: ManagedEvent[] = INITIAL_EVENTS;
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        allEvents = parsed
          .filter((event) => !event.archivedAt)
          .map(({ archivedAt: _archivedAt, ...event }) => event as ManagedEvent);
      }
    }
  } catch {
    // fallback
  }

  if (storeSlug && storeSlug !== 'all') {
    return allEvents.filter((ev) => isEventMatchingStore(ev, storeSlug));
  }
  return allEvents;
}

export function saveManagedEvents(events: ManagedEvent[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      window.dispatchEvent(new Event('events_updated'));
    }
  } catch {
    // storage error
  }
}

export async function syncEventsWithSupabase(storeId?: string): Promise<ManagedEvent[]> {
  const { supabase } = await import('./supabase');
  if (!supabase || !storeId) {
    return loadManagedEvents();
  }

  try {
    const { data, error } = await supabase
      .from('store_events')
      .select('id, title, content, start_date, end_date, is_public, is_always_on, created_at, store_id')
      .eq('store_id', storeId)
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return loadManagedEvents();
    }

    const remoteEvents: ManagedEvent[] = data.map((row) => ({
      id: row.id,
      title: row.title,
      tag: row.is_always_on ? '상시 혜택' : '이벤트',
      target: '카툰플러스 고객',
      detail: row.content,
      bannerType: row.title.includes('라면') ? 'naver_ramen' : row.title.includes('서울대') ? 'snu' : 'weekday',
      startDate: row.start_date || undefined,
      endDate: row.end_date || undefined,
      isAlwaysOn: Boolean(row.is_always_on),
      isPublic: Boolean(row.is_public),
      isFeatured: false,
      createdAt: row.created_at,
    }));

    return remoteEvents;
  } catch {
    return loadManagedEvents();
  }
}

export function getFeaturedEvent(
  storeSlugOrEvents?: string | ManagedEvent[],
  explicitEvents?: ManagedEvent[]
): ManagedEvent {
  let storeSlug: string | undefined;
  let list: ManagedEvent[];

  if (typeof storeSlugOrEvents === 'string') {
    storeSlug = storeSlugOrEvents;
    list = explicitEvents ?? loadManagedEvents();
  } else if (Array.isArray(storeSlugOrEvents)) {
    list = storeSlugOrEvents;
    storeSlug = undefined;
  } else {
    list = loadManagedEvents();
    storeSlug = undefined;
  }

  const today = new Date().toISOString().split('T')[0];

  const isEventActive = (ev: ManagedEvent) => {
    if (!ev.isPublic) return false;
    if (storeSlug && !isEventMatchingStore(ev, storeSlug)) return false;
    if (ev.isAlwaysOn) return true;
    if (ev.endDate && ev.endDate < today) return false;
    return true;
  };

  // 1. 해당 지점 전용 featured 우선 검색
  if (storeSlug && storeSlug !== 'all') {
    const storeSpecificFeatured = list.find(
      (ev) => ev.isFeatured && ev.storeSlug === storeSlug && isEventActive(ev)
    );
    if (storeSpecificFeatured) return storeSpecificFeatured;
  }

  // 2. 전체 중 featured 검색
  const featured = list.find((ev) => ev.isFeatured && isEventActive(ev));
  if (featured) return featured;

  // 3. 첫 번째 활성 이벤트
  const firstActive = list.find(isEventActive);
  if (firstActive) return firstActive;

  // 4. 공개 이벤트 중 fallback
  const firstPublic = list.find((ev) => ev.isPublic && (!storeSlug || isEventMatchingStore(ev, storeSlug)));
  return firstPublic || INITIAL_EVENTS[1] || INITIAL_EVENTS[0];
}
