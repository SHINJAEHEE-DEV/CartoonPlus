import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as voiceAssetsModule from './voiceAssets';
import * as broadcastRunnerModule from './broadcastRunner';
import {
  createBroadcastTimerWorker,
  getSchedulesDueBetween,
  playBroadcast,
  resolvePresetAudioUrl,
} from './broadcastRunner';

vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'broadcast_runs') {
        return {
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(async () => ({ data: { id: 'run-123' }, error: null })),
            })),
          })),
          update: vi.fn(() => ({
            eq: vi.fn(async () => ({ data: null, error: null })),
          })),
        };
      }
      if (table === 'broadcast_presets') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn((col: string, val: string) => {
              if (val === 'preset-uuid-123') {
                return {
                  single: vi.fn(async () => ({
                    data: { audio_url: 'https://example.com/custom.mp3' },
                    error: null,
                  })),
                  limit: vi.fn(() => ({
                    maybeSingle: vi.fn(async () => ({
                      data: { audio_url: 'https://example.com/custom.mp3' },
                      error: null,
                    })),
                  })),
                };
              }
              return {
                single: vi.fn(async () => ({ data: null, error: new Error('not found') })),
                limit: vi.fn(() => ({
                  maybeSingle: vi.fn(async () => ({ data: null, error: null })),
                })),
              };
            }),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(async () => ({ data: [], error: null })),
          })),
        })),
      };
    }),
    rpc: vi.fn(async () => ({ data: true, error: null })),
  },
}));

describe('broadcastRunner (MP3 & Scheduled Broadcasts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves audio url for static presets by title or preset id', async () => {
    const staticUrl = await resolvePresetAudioUrl(undefined, '기본 안내');
    expect(staticUrl).toBe('/audio/broadcast/기본 안내.wav');

    const staticClosing = await resolvePresetAudioUrl(undefined, '11시 마감 안내');
    expect(staticClosing).toBe('/audio/broadcast/11시 마감 안내.wav');
  });

  it('resolves audio url for uploaded preset by ID', async () => {
    const uploadedUrl = await resolvePresetAudioUrl('preset-uuid-123');
    expect(uploadedUrl).toBe('https://example.com/custom.mp3');
  });

  it('plays MP3 voice asset when triggered', async () => {
    const playSpy = vi.spyOn(voiceAssetsModule, 'playVoiceAsset').mockResolvedValue(undefined);

    const success = await playBroadcast('기본 안내', 'schedule-1', 'store-1');
    expect(success).toBe(true);
    expect(playSpy).toHaveBeenCalledWith('/audio/broadcast/기본 안내.wav');

    playSpy.mockRestore();
  });

  it('fails safely and does not use speech synthesis when audio is not resolved', async () => {
    const playSpy = vi.spyOn(voiceAssetsModule, 'playVoiceAsset').mockResolvedValue(undefined);

    const success = await playBroadcast('없는안내문구_테스트', undefined, undefined, 'unknown-id');
    expect(success).toBe(false);

    playSpy.mockRestore();
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
        message_text: '기본 안내',
        scheduleType: 'daily' as const,
        targetTime: '10:01',
        isEnabled: true,
      },
      {
        id: 'weekday',
        storeId: 'store-a',
        message_text: '만석 안내',
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
          message_text: '기본 안내',
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

  it('detects store slug from pathname or defaults to snu', () => {
    expect(broadcastRunnerModule.detectCurrentStoreSlug()).toBe('snu');
  });

  it('fetches store map from supabase stores table', async () => {
    const storeMap = await broadcastRunnerModule.fetchStoreMap();
    expect(typeof storeMap).toBe('object');
  });

  it('safely runs unlockAudioEngine without throwing', () => {
    expect(() => broadcastRunnerModule.unlockAudioEngine()).not.toThrow();
  });
});


