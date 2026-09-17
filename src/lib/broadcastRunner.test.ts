import { describe, expect, it, vi } from 'vitest';
import {
  createBroadcastTimerWorker,
  getKoreanFemaleVoices,
  getSchedulesDueBetween,
} from './broadcastRunner';

describe('broadcastRunner', () => {
  it('offers only Korean female voices exposed by the browser', () => {
    expect(
      getKoreanFemaleVoices([
        { name: 'Microsoft SunHi', lang: 'ko-KR' },
        { name: 'Microsoft Heami', lang: 'ko-KR' },
        { name: 'Microsoft InJoon', lang: 'ko-KR' },
        { name: 'Eddy', lang: 'ko-KR' },
        { name: 'Samantha', lang: 'en-US' },
      ] as SpeechSynthesisVoice[]).map((voice) => voice.name)
    ).toEqual(['Microsoft SunHi', 'Microsoft Heami']);
  });

  it('starts and cleans up a timer worker or fallback interval', () => {
    const onTick = vi.fn();
    const cleanup = createBroadcastTimerWorker(onTick);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('identifies reservations missed between delayed scheduler checks', () => {
    const schedules = [
      {
        id: 'daily',
        storeId: 'store-a',
        message_text: '매일 방송',
        scheduleType: 'daily' as const,
        targetTime: '10:01',
        isEnabled: true,
      },
      {
        id: 'weekday',
        storeId: 'store-a',
        message_text: '월요일 방송',
        scheduleType: 'weekdays' as const,
        targetTime: '10:02',
        targetDays: ['MON'],
        isEnabled: true,
      },
    ];

    expect(
      getSchedulesDueBetween(
        schedules,
        new Date('2026-09-14T10:00:15'),
        new Date('2026-09-14T10:03:02')
      ).map((item) => item.id)
    ).toEqual(['daily', 'weekday']);
  });

  it('keeps each missed occurrence of one schedule distinct', () => {
    const due = getSchedulesDueBetween(
      [
        {
          id: 'daily',
          storeId: 'store-a',
          message_text: '매일 방송',
          scheduleType: 'daily',
          targetTime: '10:00',
          isEnabled: true,
        },
      ],
      new Date('2026-09-14T09:59:00'),
      new Date('2026-09-16T10:01:00')
    );

    expect(due.map((item) => item.dueAt.toISOString())).toEqual([
      '2026-09-14T01:00:00.000Z',
      '2026-09-15T01:00:00.000Z',
      '2026-09-16T01:00:00.000Z',
    ]);
  });
});
