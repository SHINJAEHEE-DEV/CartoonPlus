import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useBroadcastVoice, VOICE_STORAGE_KEY } from './useBroadcastVoice';

describe('useBroadcastVoice', () => {
  const originalSpeechSynthesis = window.speechSynthesis;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      value: originalSpeechSynthesis,
      writable: true,
    });
  });

  it('loads and filters Korean female voices and persists selected voice in localStorage', () => {
    const mockVoices = [
      { name: 'Microsoft SunHi Online (Natural) - Korean (Korea)', lang: 'ko-KR' },
      { name: 'Microsoft Heami - Korean (Korea)', lang: 'ko-KR' },
      { name: 'Microsoft InJoon - Korean (Korea)', lang: 'ko-KR' }, // male voice, should be filtered out
      { name: 'Google US English', lang: 'en-US' },
    ] as SpeechSynthesisVoice[];

    let voicesChangedHandler: (() => void) | null = null;

    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        getVoices: () => mockVoices,
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === 'voiceschanged') voicesChangedHandler = handler;
        }),
        removeEventListener: vi.fn(),
      },
      writable: true,
    });

    const { result } = renderHook(() => useBroadcastVoice());

    expect(result.current.voiceNames).toEqual([
      'Microsoft SunHi Online (Natural) - Korean (Korea)',
      'Microsoft Heami - Korean (Korea)',
    ]);
    expect(result.current.voiceName).toBe('Microsoft SunHi Online (Natural) - Korean (Korea)');

    // Select different voice
    act(() => {
      result.current.setVoiceName('Microsoft Heami - Korean (Korea)');
    });

    expect(result.current.voiceName).toBe('Microsoft Heami - Korean (Korea)');
    expect(localStorage.getItem(VOICE_STORAGE_KEY)).toBe('Microsoft Heami - Korean (Korea)');
  });

  it('restores saved voice from localStorage if available in voice list', () => {
    localStorage.setItem(VOICE_STORAGE_KEY, 'Microsoft Heami - Korean (Korea)');

    const mockVoices = [
      { name: 'Microsoft SunHi Online (Natural) - Korean (Korea)', lang: 'ko-KR' },
      { name: 'Microsoft Heami - Korean (Korea)', lang: 'ko-KR' },
    ] as SpeechSynthesisVoice[];

    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        getVoices: () => mockVoices,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
      writable: true,
    });

    const { result } = renderHook(() => useBroadcastVoice());

    expect(result.current.voiceName).toBe('Microsoft Heami - Korean (Korea)');
  });
});
