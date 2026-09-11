import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest';
import { getFeaturedEvent, type ManagedEvent } from './eventRepository';

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
    isFeatured: false,
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
});
