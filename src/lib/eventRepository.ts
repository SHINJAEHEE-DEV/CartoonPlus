import { EVENT_BANNERS } from './brandAssets';

export type EventStoreSlug = 'snu' | 'jamsil' | 'hongdae' | 'all';

export interface ManagedEvent {
  id: string;
  title: string;
  tag: string;
  target: string;
  detail: string;
  bannerType:
    | 'weekday'
    | 'naver_ramen'
    | 'snu'
    | 'nanta'
    | 'peach_pit'
    | 'otamaker'
    | 'mommom'
    | 'custom';
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
    id: 'evt-nanta',
    title: '난타 홍대극장 X 카툰플러스 홍대점 특별 패키지',
    tag: '홍대점 제휴',
    target: '난타 홍대극장 관람객 및 카툰플러스 홍대점 이용 고객',
    detail:
      '난타 홍대극장 X 카툰플러스 홍대점 특별 패키지 판매 진행 중\n난타 티켓 + 카툰플러스 이용권 특별 할인 패키지\n예매 및 상세 안내: [난타 예매 링크](https://www.nanta.co.kr:452/index.php)',
    bannerType: 'nanta',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    isAlwaysOn: false,
    isPublic: true,
    isFeatured: true,
    storeSlug: 'hongdae',
    createdAt: '2026-09-30T00:00:00.000Z',
  },
  {
    id: 'evt-peach-pit',
    title: 'PEACH-PIT 25주년 기념 특별전 티켓 당첨 이벤트 (예정)',
    tag: '티켓 증정 이벤트',
    target: '매장 방문 후 인스타그램 인증 참여 고객 전원',
    detail:
      'PEACH-PIT 25주년 기념 특별전 (10.09 ~ 10.22)\n카툰플러스 매장 방문 후 인스타그램 인증 참여 시 추첨을 통해 특별전 티켓 증정\n진행 일정: 2026년 10월 9일 ~ 10월 22일 (예정)',
    bannerType: 'peach_pit',
    startDate: '2026-10-09',
    endDate: '2026-10-22',
    isAlwaysOn: false,
    isPublic: true,
    isFeatured: false,
    storeSlug: 'all',
    createdAt: '2026-09-30T00:00:00.000Z',
  },
  {
    id: 'evt-mommom',
    title: '맘맘(MomMom) 멤버십 제휴 — 젤라또 & 무제한 토핑 무료',
    tag: '네이버·멤버십 제휴',
    target: '맘맘(MomMom) 멤버십 QR 인증 고객 전원 (타 이벤트 중복 가능)',
    detail:
      '매장 방문하여 어플리케이션 내 멤버십 QR코드 제시 시 젤라또 1개 무료 + 라면 무제한 토핑 바 증정\n홍대점, 잠실점, 서울대입구역점, 사당점 동일 적용 (타 이벤트 중복 가능)\n지점별 상세: [홍대점](https://mom-mom.net/travel/places/68a4587babc6bae6ac20c968) · [잠실점](https://mom-mom.net/travel/places/69cf866dcdb5885d8f358d3e) · [서울대입구역점](https://mom-mom.net/travel/places/69fa986f2b26c07cbf7b1af2) · [사당점](https://mom-mom.net/travel/places/6a474e5d3484d9ce4290e5d8)',
    bannerType: 'mommom',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: false,
    storeSlug: 'all',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'evt-snu',
    title: '서울대학교 학생증 인증 — 아이스크림 무료 증정',
    tag: '서울대점 단독 제휴',
    target: '서울대학교 학생 방문 및 학생증 인증 고객 전원',
    detail:
      '서울대학교 학생 방문하여 학생증 인증 시 아이스크림 무료 증정 (~11.20)\n모바일 또는 실물 학생증 카운터 제시 시 즉시 제공\n단과대 연석회의 패키지 할인과 중복 혜택 가능',
    bannerType: 'snu',
    startDate: '2026-09-01',
    endDate: '2026-11-20',
    isAlwaysOn: false,
    isPublic: true,
    isFeatured: true,
    storeSlug: 'snu',
    createdAt: '2026-09-30T00:00:00.000Z',
  },
  {
    id: 'evt-otamaker',
    title: '오타메이커 보드게임 협업 — 플레이 & 리뷰 작성 이벤트 (예정)',
    tag: '보드게임 이벤트',
    target: '매장 내 오타메이커 보드게임 이용 및 리뷰 작성 고객',
    detail:
      '매장 내 오타메이커 보드게임 즐긴 후 리뷰 작성 시 특별 경품 증정\n오타메이커 보드게임 자유 플레이 체험\n리뷰 작성 후 카운터 인증 시 현장 경품 증정 (진행 예정)',
    bannerType: 'otamaker',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: false,
    storeSlug: 'all',
    createdAt: '2026-09-30T00:00:00.000Z',
  },
];

export function getBannerImageUrl(type: ManagedEvent['bannerType'], customUrl?: string): string {
  if (type === 'nanta') return EVENT_BANNERS.nanta;
  if (type === 'snu') return EVENT_BANNERS.snu;
  if (type === 'peach_pit') return EVENT_BANNERS.peachPit;
  if (type === 'otamaker') return EVENT_BANNERS.otamaker;
  if (type === 'mommom') return EVENT_BANNERS.mommom;
  if (type === 'weekday') return EVENT_BANNERS.weekday;
  if (type === 'naver_ramen') return EVENT_BANNERS.naverRamen;
  if (type === 'custom' && customUrl && customUrl.trim() !== '') return customUrl;
  if (customUrl && customUrl.trim() !== '' && !customUrl.includes('/mascot/')) return customUrl;
  return EVENT_BANNERS.placeholder;
}

export async function uploadEventImage(file: File): Promise<{ url?: string; error?: string }> {
  if (!file.type.startsWith('image/')) return { error: '이미지 파일만 업로드할 수 있습니다.' };
  if (file.size > 5 * 1024 * 1024) return { error: '이미지 파일 크기는 5MB 이하여야 합니다.' };
  const { supabase } = await import('./supabase');
  if (!supabase) return { error: '서버 연결을 확인할 수 없습니다.' };
  const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `events/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('event-images').upload(path, file, { upsert: false });
  if (error) return { error: error.message };
  return { url: supabase.storage.from('event-images').getPublicUrl(path).data.publicUrl };
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

export async function syncEventsWithSupabase(storeSlug?: EventStoreSlug): Promise<ManagedEvent[]> {
  const { supabase } = await import('./supabase');
  if (!supabase) {
    return loadManagedEvents(storeSlug);
  }

  try {
    let query = supabase
      .from('store_events')
      .select('id, title, content, start_date, end_date, image_url, is_public, is_always_on, is_featured, tag, target, banner_type, created_at, store_slug')
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (storeSlug && storeSlug !== 'all') {
      query = query.or(`store_slug.eq.${storeSlug},store_slug.is.null`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return loadManagedEvents(storeSlug);
    }

    const remoteEvents: ManagedEvent[] = data.map((row) => ({
      id: row.id,
      title: row.title,
      tag: row.tag || (row.is_always_on ? '상시 혜택' : '이벤트'),
      target: row.target || '카툰플러스 고객',
      detail: row.content,
      bannerType: row.banner_type || 'weekday',
      customBannerUrl: row.image_url || undefined,
      startDate: row.start_date || undefined,
      endDate: row.end_date || undefined,
      isAlwaysOn: Boolean(row.is_always_on),
      isPublic: Boolean(row.is_public),
      isFeatured: Boolean(row.is_featured),
      createdAt: row.created_at,
      storeSlug: row.store_slug || 'all',
    }));

    return remoteEvents;
  } catch {
    return loadManagedEvents();
  }
}

export async function saveEventToSupabase(
  event: ManagedEvent
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await import('./supabase');
  if (!supabase) return { success: false, error: '서버 연결을 확인할 수 없습니다.' };

  const today = new Date().toISOString().slice(0, 10);
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(event.id);

  let storeId: string | null = null;
  if (event.storeSlug && event.storeSlug !== 'all') {
    const { data, error } = await supabase.from('stores').select('id').eq('slug', event.storeSlug).maybeSingle();
    if (error || !data) return { success: false, error: error?.message ?? '지점 정보를 찾을 수 없습니다.' };
    storeId = data.id;
  }
  const payload: Record<string, unknown> = {
    store_id: storeId,
    store_slug: event.storeSlug === 'all' ? null : event.storeSlug,
    title: event.title.trim(),
    content: event.detail.trim(),
    start_date: event.isAlwaysOn ? today : event.startDate || today,
    end_date: event.isAlwaysOn ? '2099-12-31' : event.endDate || today,
    is_always_on: event.isAlwaysOn,
    is_public: event.isPublic,
    tag: event.tag.trim(),
    target: event.target.trim(),
    banner_type: event.bannerType,
    image_url: event.customBannerUrl || null,
    is_featured: Boolean(event.isFeatured),
    archived_at: null,
  };

  if (isUuid) {
    payload.id = event.id;
  }

  try {
    const { error } = await supabase
      .from('store_events')
      .upsert(payload, isUuid ? { onConflict: 'id' } : { onConflict: 'scope_key,title' });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Supabase save failed' };
  }
}

export async function deleteEventFromSupabase(
  id: string,
  imageUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await import('./supabase');
  if (!supabase) return { success: false, error: '서버 연결을 확인할 수 없습니다.' };

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  try {
    if (isUuid) {
      const { error } = await supabase.from('store_events').delete().eq('id', id);
      if (!error) {
        if (imageUrl) await deleteEventImage(imageUrl);
        return { success: true };
      }
    }
    return { success: false, error: '이벤트 식별자를 찾을 수 없습니다.' };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Supabase delete failed' };
  }
}

async function deleteEventImage(url: string): Promise<void> {
  const marker = '/storage/v1/object/public/event-images/';
  const path = url.includes(marker) ? url.split(marker)[1] : null;
  if (!path) return;
  const { supabase } = await import('./supabase');
  if (supabase) await supabase.storage.from('event-images').remove([path]);
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
