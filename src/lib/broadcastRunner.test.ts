import { describe, expect, it, vi } from 'vitest';
import { BROADCAST_PRESETS, createBroadcastTimerWorker } from './broadcastRunner';

describe('broadcastRunner', () => {
  it('contains valid predefined audio presets', () => {
    expect(BROADCAST_PRESETS.length).toBeGreaterThanOrEqual(6);
    expect(BROADCAST_PRESETS.some(([title]) => title === '기본')).toBe(true);
    expect(BROADCAST_PRESETS.some(([title]) => title === '마감')).toBe(true);
  });

  it('starts and cleans up a timer worker or fallback interval', () => {
    const onTick = vi.fn();
    const cleanup = createBroadcastTimerWorker(onTick);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });
});
