import weekdayPassBanner from '../assets/event_weekday_pass.svg';
import naverRamenBanner from '../assets/event_naver_ramen_coupon.svg';
import snuBanner from '../assets/snu_partnership_banner.png';

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
  archivedAt?: string | null;
  createdAt: string;
}

export const STORAGE_KEY = 'cartoonplus_managed_events';

export const INITIAL_EVENTS: ManagedEvent[] = [
  {
    id: 'evt-1',
    title: '평일 종일 이용권 추가 혜택 이벤트',
    tag: '10월 말까지 한정',
    target: '평일 종일 이용권 결제 고객',
    detail: '음료 포함 15,000원 특가 이용 + 젤라또(무료) 또는 라면(무료) 택 1 추가 증정',
    bannerType: 'weekday',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    isAlwaysOn: false,
    isPublic: true,
    isFeatured: false,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'evt-2',
    title: '네이버 영수증 포토 리뷰 — 라면무료 쿠폰',
    tag: '상시 리뷰 쿠폰',
    target: '네이버 플레이스 영수증 인증 후 포토 리뷰 작성 고객 전원',
    detail: '라면 무료 + 대파·숙주·떡사리·계란 무제한 토핑 바 무료(공짜) 쿠폰 즉시 적용',
    bannerType: 'naver_ramen',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: false,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'evt-3',
    title: '2026 서울대학교 단과대학생회장연석회의 공식 제휴',
    tag: '상시 제휴',
    target: '서울대학교 학부생 및 대학원생 전원',
    detail: '패키지 요금제 10% 현장 즉시 할인 + 평일 종일권 결제 시 기본 음료 무료 업그레이드',
    bannerType: 'snu',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export function getBannerImageUrl(type: ManagedEvent['bannerType'], customUrl?: string): string {
  if (type === 'weekday') return weekdayPassBanner;
  if (type === 'naver_ramen') return naverRamenBanner;
  if (type === 'snu') return snuBanner;
  return customUrl || weekdayPassBanner;
}

export function loadManagedEvents(): ManagedEvent[] {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_EVENTS;
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

export function getFeaturedEvent(events?: ManagedEvent[]): ManagedEvent {
  const list = events ?? loadManagedEvents();
  const today = new Date().toISOString().split('T')[0];

  const isEventActive = (ev: ManagedEvent) => {
    if (!ev.isPublic || ev.archivedAt) return false;
    if (ev.isAlwaysOn) return true;
    if (ev.endDate && ev.endDate < today) return false;
    return true;
  };

  const featured = list.find((ev) => ev.isFeatured && isEventActive(ev));
  if (featured) return featured;

  const firstActive = list.find(isEventActive);
  if (firstActive) return firstActive;

  return list.find((ev) => ev.isPublic && !ev.archivedAt) || INITIAL_EVENTS[2];
}
