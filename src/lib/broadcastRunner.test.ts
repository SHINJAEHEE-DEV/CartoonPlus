import { describe, expect, it, vi } from 'vitest';
import { createBroadcastTimerWorker, getKoreanFemaleVoices } from './broadcastRunner';

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
});
