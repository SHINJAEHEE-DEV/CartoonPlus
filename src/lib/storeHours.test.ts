import { describe, expect, it } from 'vitest';
import { isStoreOpen } from './storeHours';

describe('isStoreOpen', () => {
  describe('hongdae (24 hours)', () => {
    it('is always open regardless of time or day', () => {
      // Monday 03:00
      expect(isStoreOpen('hongdae', new Date('2026-09-21T03:00:00'))).toBe(true);
      // Saturday 23:59
      expect(isStoreOpen('hongdae', new Date('2026-09-26T23:59:00'))).toBe(true);
    });
  });

  describe('snu (Daily 10:00 ~ 23:00)', () => {
    it('is open between 10:00 and 22:59', () => {
      expect(isStoreOpen('snu', new Date('2026-09-21T10:00:00'))).toBe(true);
      expect(isStoreOpen('snu', new Date('2026-09-21T15:30:00'))).toBe(true);
      expect(isStoreOpen('snu', new Date('2026-09-21T22:59:00'))).toBe(true);
    });

    it('is closed outside 10:00 ~ 23:00', () => {
      expect(isStoreOpen('snu', new Date('2026-09-21T09:59:00'))).toBe(false);
      expect(isStoreOpen('snu', new Date('2026-09-21T23:00:00'))).toBe(false);
      expect(isStoreOpen('snu', new Date('2026-09-21T02:00:00'))).toBe(false);
    });
  });

  describe('jamsil (Weekend 24h: Fri 10:00 ~ Sun 23:00, Mon-Thu 10:00~23:00)', () => {
    // 2026-09-18 is Friday, 2026-09-19 is Saturday, 2026-09-20 is Sunday, 2026-09-21 is Monday

    it('is open on Friday from 10:00 onwards', () => {
      expect(isStoreOpen('jamsil', new Date('2026-09-18T09:59:00'))).toBe(false);
      expect(isStoreOpen('jamsil', new Date('2026-09-18T10:00:00'))).toBe(true);
      expect(isStoreOpen('jamsil', new Date('2026-09-18T23:30:00'))).toBe(true);
    });

    it('is continuously open all day Saturday including dawn/night', () => {
      expect(isStoreOpen('jamsil', new Date('2026-09-19T00:30:00'))).toBe(true); // Sat dawn
      expect(isStoreOpen('jamsil', new Date('2026-09-19T04:00:00'))).toBe(true); // Sat dawn
      expect(isStoreOpen('jamsil', new Date('2026-09-19T14:00:00'))).toBe(true); // Sat day
      expect(isStoreOpen('jamsil', new Date('2026-09-19T23:59:00'))).toBe(true); // Sat night
    });

    it('is open Sunday dawn and day until 23:00', () => {
      expect(isStoreOpen('jamsil', new Date('2026-09-20T03:00:00'))).toBe(true); // Sun dawn
      expect(isStoreOpen('jamsil', new Date('2026-09-20T12:00:00'))).toBe(true); // Sun day
      expect(isStoreOpen('jamsil', new Date('2026-09-20T22:59:00'))).toBe(true); // Sun before close
      expect(isStoreOpen('jamsil', new Date('2026-09-20T23:00:00'))).toBe(false); // Sun close
      expect(isStoreOpen('jamsil', new Date('2026-09-20T23:30:00'))).toBe(false); // Sun late night
    });

    it('is standard 10:00~23:00 on Monday through Thursday', () => {
      expect(isStoreOpen('jamsil', new Date('2026-09-21T03:00:00'))).toBe(false); // Mon dawn
      expect(isStoreOpen('jamsil', new Date('2026-09-21T10:00:00'))).toBe(true); // Mon open
      expect(isStoreOpen('jamsil', new Date('2026-09-21T23:00:00'))).toBe(false); // Mon close
    });
  });
});
