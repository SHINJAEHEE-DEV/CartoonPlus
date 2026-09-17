import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest';
import {
  getFeaturedEvent,
  loadManagedEvents,
  isEventMatchingStore,
  type ManagedEvent,
} from './eventRepository';

const testEvents: ManagedEvent[] = [
  {
    id: 'evt-1',
    title: '평일 종일권 이벤트',
    tag: '한정 이벤트',
    target: '전 고객',
    detail: '15,000원 특가',
    bannerType: 'weekday',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    isAlwaysOn: false,
    isPublic: true,
    isFeatured: true,
    storeSlug: 'all',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'evt-2',
    title: '서울대 제휴',
    tag: '상시 제휴',
    target: '서울대생',
    detail: '10% 할인',
    bannerType: 'snu',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: true,
    storeSlug: 'snu',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'evt-3',
    title: '잠실 직관 티켓 이벤트',
    tag: '잠실 단독',
    target: '잠실 야구팬',
    detail: '음료 증정',
    bannerType: 'weekday',
    isAlwaysOn: true,
    isPublic: true,
    isFeatured: true,
    storeSlug: 'jamsil',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('eventRepository', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-15T00:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('returns the active featured event when present', () => {
    const featured = getFeaturedEvent(testEvents);
    expect(featured.id).toBe('evt-1');
    expect(featured.title).toBe('평일 종일권 이벤트');
  });

  it('falls back to the next public event when featured event is expired or private', () => {
    const expiredEvents: ManagedEvent[] = [
      {
        ...testEvents[0],
        endDate: '2020-01-01', // expired
      },
      testEvents[1],
    ];
    const featured = getFeaturedEvent(expiredEvents);
    expect(featured.id).toBe('evt-2');
  });

  it('matches events correctly for storeSlug', () => {
    expect(isEventMatchingStore(testEvents[0], 'snu')).toBe(true); // all
    expect(isEventMatchingStore(testEvents[0], 'jamsil')).toBe(true); // all
    expect(isEventMatchingStore(testEvents[1], 'snu')).toBe(true); // snu
    expect(isEventMatchingStore(testEvents[1], 'jamsil')).toBe(false); // snu on jamsil
    expect(isEventMatchingStore(testEvents[2], 'jamsil')).toBe(true); // jamsil
    expect(isEventMatchingStore(testEvents[2], 'hongdae')).toBe(false); // jamsil on hongdae
  });

  it('resolves store-specific featured event when storeSlug is given', () => {
    const snuFeatured = getFeaturedEvent('snu', testEvents);
    expect(snuFeatured.id).toBe('evt-2');
    expect(snuFeatured.title).toBe('서울대 제휴');

    const jamsilFeatured = getFeaturedEvent('jamsil', testEvents);
    expect(jamsilFeatured.id).toBe('evt-3');
    expect(jamsilFeatured.title).toBe('잠실 직관 티켓 이벤트');
  });
});

