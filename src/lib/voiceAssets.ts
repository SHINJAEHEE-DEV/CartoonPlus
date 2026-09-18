import { supabase } from './supabase';

export const MAX_UPLOAD_PRESETS_PER_STORE = 10;
export const MAX_VOICE_ASSET_BYTES = 3 * 1024 * 1024;
export const VOICE_ASSET_BUCKET = 'broadcast-audio';

export interface BroadcastPresetItem {
  id?: string;
  store_id?: string | null;
  title: string;
  message_text?: string | null;
  audio_url: string;
  source_type: 'static' | 'upload';
  hidden_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_STATIC_PRESETS: readonly BroadcastPresetItem[] = [
  {
    title: '기본 안내',
    message_text: `카툰플러스를 이용해주시는 고객님들께 잠시 안내 말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 쓰레기는 쓰레기통에 버려주시길 바랍니다.
다시 한번 안내말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 쓰레기는 쓰레기통에 버려주시길 바랍니다.
감사합니다.`,
    audio_url: '/audio/broadcast/기본 안내.wav',
    source_type: 'static',
  },
  {
    title: '11시 마감 안내',
    message_text: `안내말씀 드립니다.
저희매장 이용시간은 11시까지입니다.
10시 50분부터 마감 준비를 하오니 참고 부탁드립니다.
퇴실하실 떄에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 사용하신 방 자리 정돈 부탁드립니다.
다시 한번 안내말씀 드립니다.
저희매장 이용시간은 11시까지입니다.
10시 50분부터 마감 준비를 하오니 참고 부탁드립니다.
퇴실하실 떄에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 사용하신 방 자리 정돈 부탁드립니다.
감사합니다.`,
    audio_url: '/audio/broadcast/11시 마감 안내.wav',
    source_type: 'static',
  },
  {
    title: '만석 안내',
    message_text: `카툰플러스를 이용해주시는 고객님들께 잠시 안내 말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 자리 정돈 부탁드립니다.
또한, 현재 만석이므로 자리 이동이 제한된다는 점 안내드립니다.
다시 한번 안내말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 자리 정돈 부탁드립니다.
또한, 현재 만석이므로 자리 이동이 제한된다는 점 안내드립니다.
감사합니다.`,
    audio_url: '/audio/broadcast/만석 안내.wav',
    source_type: 'static',
  },
  {
    title: '소음 안내',
    message_text: `카툰플러스를 이용해주시는 고객님들께 잠시 안내 말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 자리 정돈 부탁드립니다.
또한, 모든 고객님들이 편안하게 이용하실 수 있도록, 큰 소리는 삼가 주시길 부탁드립니다.
다시 한번 안내말씀 드립니다. 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 자리 정돈 부탁드립니다.
또한, 모든 고객님들이 편안하게 이용하실 수 있도록, 큰 소리는 삼가 주시길 부탁드립니다.
감사합니다.`,
    audio_url: '/audio/broadcast/소음 안내.wav',
    source_type: 'static',
  },
  {
    title: '신분증 검사 안내',
    message_text: `카툰플러스를 이용해주시는 고객님들께 잠시 안내 말씀 드립니다.
잠시 후 10시부터 신분증 확인을 진행 할 예정입니다.
매장을 계속 이용하실 고객님께서는, 실물 신분증을 미리 꺼내어 준비하여주시길 바랍니다.
신분증이 없으실 경우 이용이 불가 합니다.
또한, 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 쓰레기는 쓰레기통에 버려주시길 바랍니다.
다시 한번 안내말씀 드립니다.
잠시 후 10시부터 신분증 확인을 진행 할 예정입니다.
매장을 계속 이용하실 고객님께서는, 실물 신분증을 미리 꺼내어 준비하여주시길 바랍니다.
신분증이 없으실 경우 이용이 불가 합니다.
또한, 매장 이용 후 퇴실 시에는 사용하신 담요, 만화책, 식기 등 모두 반납해주시고 쓰레기는 쓰레기통에 버려주시길 바랍니다.
감사합니다.`,
    audio_url: '/audio/broadcast/신분증 검사 안내.wav',
    source_type: 'static',
  },
  {
    title: '음료 픽업 요청 안내',
    message_text: `주문하신 음료가 카운터에 준비되어있습니다.
카카오톡 알림 확인 부탁드립니다.`,
    audio_url: '/audio/broadcast/음료 픽업 요청 안내.wav',
    source_type: 'static',
  },
];


export function canRegisterUploadedPreset(activeUploadedPresetCount: number): boolean {
  return activeUploadedPresetCount < MAX_UPLOAD_PRESETS_PER_STORE;
}

const SUPPORTED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.webm', '.flac', '.opus', '.wma'];

export function validateVoiceAssetUpload(file: File): string | null {
  const fileName = file.name.toLowerCase();
  const hasAudioExtension = SUPPORTED_AUDIO_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  const isAudioType = file.type.startsWith('audio/') || hasAudioExtension;

  if (!isAudioType) return '음성(오디오) 파일만 업로드할 수 있습니다. (MP3, WAV, M4A, OGG 등)';
  if (file.size > MAX_VOICE_ASSET_BYTES) return '음성 파일은 3MB 이하여야 합니다.';
  return null;
}

export async function uploadVoiceAsset(
  storeId: string,
  file: File,
  storageClient = supabase?.storage
): Promise<{ url: string; path: string }> {
  const validationError = validateVoiceAssetUpload(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (!storageClient) {
    throw new Error('Supabase Storage 클라이언트를 찾을 수 없습니다.');
  }

  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${storeId}/${Date.now()}-${safeFileName}`;
  const contentType = file.type || 'audio/mpeg';

  const { data, error } = await storageClient.from(VOICE_ASSET_BUCKET).upload(filePath, file, {
    contentType,
    upsert: false,
  });

  if (error || !data) {
    throw new Error(`음성 파일 업로드에 실패했습니다: ${error?.message ?? '알 수 없는 오류'}`);
  }

  const { data: publicData } = storageClient.from(VOICE_ASSET_BUCKET).getPublicUrl(data.path);
  return {
    url: publicData.publicUrl,
    path: data.path,
  };
}

let currentAudio: HTMLAudioElement | null = null;

export function stopVoiceAsset(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function playVoiceAsset(url: string): Promise<void> {
  stopVoiceAsset();
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    currentAudio = audio;
    const cleanup = () => {
      if (currentAudio === audio) currentAudio = null;
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

export async function deleteVoiceAssetFromStorage(
  filePathOrUrl: string,
  storageClient = supabase?.storage
): Promise<void> {
  if (!storageClient) return;
  let path = filePathOrUrl;
  if (filePathOrUrl.includes(VOICE_ASSET_BUCKET)) {
    const parts = filePathOrUrl.split(`${VOICE_ASSET_BUCKET}/`);
    if (parts[1]) path = parts[1];
  }
  const { error } = await storageClient.from(VOICE_ASSET_BUCKET).remove([path]);
  if (error) {
    throw new Error(`스토리지 음성 파일 삭제에 실패했습니다: ${error.message}`);
  }
}
