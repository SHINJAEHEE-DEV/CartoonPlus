import { describe, expect, it } from 'vitest';
import { isDue } from './broadcastSchedule';

describe('isDue', () => {
  const now = new Date('2026-09-08T14:00:00');

  it('runs a daily schedule at its configured time', () => {
    expect(isDue({ scheduleType: 'daily', targetTime: '14:00', isEnabled: true }, now)).toBe(true);
  });

  it('runs only on a selected weekday', () => {
    expect(isDue({ scheduleType: 'weekdays', targetTime: '14:00', targetDays: ['TUE'], isEnabled: true }, now)).toBe(true);
    expect(isDue({ scheduleType: 'weekdays', targetTime: '14:00', targetDays: ['MON'], isEnabled: true }, now)).toBe(false);
  });

  it('runs a one-time schedule only on its date', () => {
    expect(isDue({ scheduleType: 'once', targetTime: '14:00', targetDate: '2026-09-08', isEnabled: true }, now)).toBe(true);
    expect(isDue({ scheduleType: 'once', targetTime: '14:00', targetDate: '2026-09-09', isEnabled: true }, now)).toBe(false);
  });

  it('uses the local calendar date for one-time schedules', () => {
    const beforeMidnightUtc = new Date('2026-09-08T00:30:00+09:00');
    expect(isDue({ scheduleType: 'once', targetTime: '00:30', targetDate: '2026-09-08', isEnabled: true }, beforeMidnightUtc)).toBe(true);
  });

  it('does not run a disabled schedule', () => {
    expect(isDue({ scheduleType: 'daily', targetTime: '14:00', isEnabled: false }, now)).toBe(false);
  });
});
