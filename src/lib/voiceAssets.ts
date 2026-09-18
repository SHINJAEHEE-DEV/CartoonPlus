export const MAX_UPLOAD_PRESETS_PER_STORE = 10;
export const MAX_VOICE_ASSET_BYTES = 3 * 1024 * 1024;

export function canRegisterUploadedPreset(activeUploadedPresetCount: number): boolean {
  return activeUploadedPresetCount < MAX_UPLOAD_PRESETS_PER_STORE;
}

export function validateVoiceAssetUpload(file: File): string | null {
  const isMp3 = file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3');
  if (!isMp3) return 'MP3 파일만 업로드할 수 있습니다.';
  if (file.size > MAX_VOICE_ASSET_BYTES) return 'MP3 파일은 3MB 이하여야 합니다.';
  return null;
}

export function playVoiceAsset(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    const cleanup = () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
    const onEnded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('MP3 방송 재생에 실패했습니다.'));
    };

    audio.addEventListener('ended', onEnded, { once: true });
    audio.addEventListener('error', onError, { once: true });
    void audio.play().catch(onError);
  });
}
