import { describe, expect, it, vi } from 'vitest';
import { MAX_UPLOAD_PRESETS_PER_STORE, MAX_VOICE_ASSET_BYTES, canRegisterUploadedPreset, playVoiceAsset, validateVoiceAssetUpload } from './voiceAssets';

describe('voice asset public API', () => {
  it('plays a stored MP3 URL through HTML Audio', async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('Audio', vi.fn(() => ({
      play,
      pause: vi.fn(),
      addEventListener: vi.fn((event, listener) => {
        if (event === 'ended') queueMicrotask(listener);
      }),
      removeEventListener: vi.fn(),
    })));

    await expect(playVoiceAsset('https://example.test/announcement.mp3')).resolves.toBeUndefined();
    expect(Audio).toHaveBeenCalledWith('https://example.test/announcement.mp3');
    expect(play).toHaveBeenCalledOnce();
  });

  it('accepts only MP3 files up to 3MB', () => {
    expect(validateVoiceAssetUpload(new File(['audio'], 'notice.mp3', { type: 'audio/mpeg' }))).toBeNull();
    expect(validateVoiceAssetUpload(new File(['audio'], 'notice.wav', { type: 'audio/wav' }))).toMatch(/MP3/);
    expect(validateVoiceAssetUpload(new File([new Uint8Array(MAX_VOICE_ASSET_BYTES + 1)], 'large.mp3', { type: 'audio/mpeg' }))).toMatch(/3MB/);
  });

  it('allows a tenth uploaded preset but blocks an eleventh', () => {
    expect(MAX_UPLOAD_PRESETS_PER_STORE).toBe(10);
    expect(canRegisterUploadedPreset(9)).toBe(true);
    expect(canRegisterUploadedPreset(10)).toBe(false);
  });
});
