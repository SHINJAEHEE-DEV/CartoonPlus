import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_STATIC_PRESETS,
  MAX_UPLOAD_PRESETS_PER_STORE,
  MAX_VOICE_ASSET_BYTES,
  canRegisterUploadedPreset,
  deleteVoiceAssetFromStorage,
  playVoiceAsset,
  stopVoiceAsset,
  uploadVoiceAsset,
  validateVoiceAssetUpload,
} from './voiceAssets';


describe('voice asset public API', () => {
  it('provides default static presets with static audio URLs', () => {
    expect(DEFAULT_STATIC_PRESETS.length).toBe(6);
    expect(DEFAULT_STATIC_PRESETS.every((p) => p.source_type === 'static')).toBe(true);
    expect(
      DEFAULT_STATIC_PRESETS.every(
        (p) => typeof p.audio_url === 'string' && (p.audio_url.endsWith('.wav') || p.audio_url.endsWith('.mp3'))
      )
    ).toBe(true);
    expect(DEFAULT_STATIC_PRESETS.map((p) => p.title)).toEqual([
      '기본 안내',
      '11시 마감 안내',
      '만석 안내',
      '소음 안내',
      '신분증 검사 안내',
      '음료 픽업 요청 안내',
    ]);
  });

  it('plays a stored MP3 URL through HTML Audio without browser speech synthesis', async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const mockSpeechSynthesis = { speak: vi.fn(), cancel: vi.fn() };
    vi.stubGlobal('speechSynthesis', mockSpeechSynthesis);
    vi.stubGlobal(
      'Audio',
      vi.fn(() => ({
        play,
        pause: vi.fn(),
        addEventListener: vi.fn((event, listener) => {
          if (event === 'ended') queueMicrotask(listener);
        }),
        removeEventListener: vi.fn(),
      }))
    );

    await expect(playVoiceAsset('https://example.test/announcement.mp3')).resolves.toBeUndefined();
    expect(Audio).toHaveBeenCalledWith('https://example.test/announcement.mp3');
    expect(play).toHaveBeenCalledOnce();
    expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
  });

  it('rejects with an error when audio playback fails', async () => {
    const play = vi.fn().mockRejectedValue(new Error('play error'));
    vi.stubGlobal(
      'Audio',
      vi.fn(() => ({
        play,
        pause: vi.fn(),
        addEventListener: vi.fn((event, listener) => {
          if (event === 'error') queueMicrotask(listener);
        }),
        removeEventListener: vi.fn(),
      }))
    );

    await expect(playVoiceAsset('https://example.test/invalid.mp3')).rejects.toThrow('MP3 방송 재생에 실패했습니다.');
  });

  it('accepts only MP3 files up to 3MB', () => {
    expect(validateVoiceAssetUpload(new File(['audio'], 'notice.mp3', { type: 'audio/mpeg' }))).toBeNull();
    expect(validateVoiceAssetUpload(new File(['audio'], 'notice.wav', { type: 'audio/wav' }))).toMatch(/MP3/);
    expect(
      validateVoiceAssetUpload(
        new File([new Uint8Array(MAX_VOICE_ASSET_BYTES + 1)], 'large.mp3', { type: 'audio/mpeg' })
      )
    ).toMatch(/3MB/);
  });

  it('allows a tenth uploaded preset but blocks an eleventh', () => {
    expect(MAX_UPLOAD_PRESETS_PER_STORE).toBe(10);
    expect(canRegisterUploadedPreset(9)).toBe(true);
    expect(canRegisterUploadedPreset(10)).toBe(false);
  });

  it('uploads valid MP3 file to storage and returns public URL', async () => {
    const mockUpload = vi.fn().mockResolvedValue({ data: { path: 'store-1/test.mp3' }, error: null });
    const mockGetPublicUrl = vi.fn().mockReturnValue({
      data: { publicUrl: 'https://storage.example.test/broadcast-audio/store-1/test.mp3' },
    });
    const mockStorageClient = {
      from: vi.fn().mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      }),
    };

    const file = new File(['dummy-mp3-content'], 'test.mp3', { type: 'audio/mpeg' });
    const result = await uploadVoiceAsset('store-1', file, mockStorageClient as any);

    expect(mockStorageClient.from).toHaveBeenCalledWith('broadcast-audio');
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^store-1\/\d+-test\.mp3$/),
      file,
      expect.objectContaining({ contentType: 'audio/mpeg', upsert: false })
    );
    expect(result.url).toBe('https://storage.example.test/broadcast-audio/store-1/test.mp3');
  });

  it('stops current playing voice asset', async () => {
    const pause = vi.fn();
    vi.stubGlobal(
      'Audio',
      vi.fn(() => ({
        play: vi.fn().mockResolvedValue(undefined),
        pause,
        currentTime: 10,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );

    const playPromise = playVoiceAsset('https://example.test/first.mp3');
    stopVoiceAsset();
    expect(pause).toHaveBeenCalled();
  });

  it('deletes voice asset from storage', async () => {
    const mockRemove = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockStorageClient = {
      from: vi.fn().mockReturnValue({
        remove: mockRemove,
      }),
    };

    await deleteVoiceAssetFromStorage(
      'https://storage.example.test/broadcast-audio/store-1/123-notice.mp3',
      mockStorageClient as any
    );

    expect(mockStorageClient.from).toHaveBeenCalledWith('broadcast-audio');
    expect(mockRemove).toHaveBeenCalledWith(['store-1/123-notice.mp3']);
  });
});


