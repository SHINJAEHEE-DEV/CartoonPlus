import { useEffect, useRef } from 'react';
import { DEFAULT_STATIC_PRESETS, playVoiceAsset } from './voiceAssets';
import { isDue, type ScheduledBroadcast } from './broadcastSchedule';
import { supabase } from './supabase';

export type BroadcastRunStatus = 'pending' | 'success' | 'failure' | 'missed' | 'cancelled';

export type StoredSchedule = ScheduledBroadcast & {
  id: string;
  storeId: string;
  message_text: string;
  broadcast_preset_id?: string | null;
};

/** Returns schedules due in fully elapsed minutes after the previous scheduler check. */
export function getSchedulesDueBetween(
  schedules: readonly StoredSchedule[],
  previousCheck: Date,
  currentCheck: Date
): Array<StoredSchedule & { dueAt: Date }> {
  const due: Array<StoredSchedule & { dueAt: Date }> = [];
  const cursor = new Date(previousCheck);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const currentMinute = new Date(currentCheck);
  currentMinute.setSeconds(0, 0);

  while (cursor < currentMinute) {
    for (const schedule of schedules) {
      if (isDue(schedule, cursor)) due.push({ ...schedule, dueAt: new Date(cursor) });
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return due;
}

export const NOTIFY_SCHEDULE_UPDATE_EVENT = 'cartoonplus_broadcast_schedules_updated';
const LAST_BROADCAST_CHECK_KEY = 'cartoonplus_last_broadcast_check';
const SELECTED_STORE_KEY = 'cartoonplus_selected_store';
let playbackQueue = Promise.resolve();
let isAudioUnlocked = false;

/**
 * 사용자 첫 제스처(클릭/터치) 시 브라우저 오디오 재생 차단(Autoplay)을 무음으로 언락
 */
export function unlockAudioEngine(): void {
  if (isAudioUnlocked || typeof window === 'undefined') return;
  try {
    const audio = new Audio();
    // 0.01초 무음 WAV data URL
    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    audio.volume = 0.001;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => {
        isAudioUnlocked = true;
      }).catch(() => {
        // ignore
      });
    } else {
      isAudioUnlocked = true;
    }
  } catch {
    // ignore
  }
}

if (typeof window !== 'undefined') {
  const unlockEvents = ['click', 'touchstart', 'keydown'];
  const handleUserGesture = () => {
    unlockAudioEngine();
    unlockEvents.forEach((evt) => window.removeEventListener(evt, handleUserGesture));
  };
  unlockEvents.forEach((evt) => window.addEventListener(evt, handleUserGesture, { once: true, passive: true }));
}

let cachedStoreMap: Record<string, string> | null = null;

export async function fetchStoreMap(): Promise<Record<string, string>> {
  if (cachedStoreMap) return cachedStoreMap;
  if (!supabase) return {};
  try {
    const { data } = await supabase.from('stores').select('id, slug');
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((s) => {
        map[s.slug] = s.id;
      });
      cachedStoreMap = map;
      return map;
    }
  } catch {
    // ignore
  }
  return {};
}

export function detectCurrentStoreSlug(): string {
  if (typeof window === 'undefined') return 'snu';
  const pathname = window.location.pathname;
  const match = pathname.match(/\/stores\/([^/?#]+)/);
  if (match?.[1]) return match[1];

  try {
    const saved = window.localStorage ? window.localStorage.getItem(SELECTED_STORE_KEY) : null;
    if (saved) return saved;
  } catch {
    // ignore
  }
  return 'snu';
}

function createPlaybackTabId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `broadcast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function claimPlaybackLease(storeId: string, tabId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc('claim_broadcast_playback_lease', {
    p_store_id: storeId,
    p_tab_id: tabId,
  });
  return !error && data === true;
}

export function notifyScheduleUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(NOTIFY_SCHEDULE_UPDATE_EVENT));
  }
}

export async function fetchActiveSchedules(): Promise<StoredSchedule[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('scheduled_broadcasts')
      .select('id, store_id, message_text, broadcast_preset_id, schedule_type, target_time, target_days, target_date, is_enabled')
      .eq('is_enabled', true)
      .order('target_time');

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id,
      storeId: item.store_id,
      message_text: item.message_text,
      broadcast_preset_id: item.broadcast_preset_id,
      scheduleType: item.schedule_type,
      targetTime: item.target_time.slice(0, 5),
      targetDays: item.target_days ?? [],
      targetDate: item.target_date ?? undefined,
      isEnabled: item.is_enabled,
    })) as StoredSchedule[];
  } catch {
    return [];
  }
}

export async function resolvePresetAudioUrl(
  presetId?: string | null,
  messageText?: string,
  storeId?: string
): Promise<string | null> {
  // 1. 정적 프리셋 ID 확인 (static-...)
  if (presetId?.startsWith('static-')) {
    const staticPreset = DEFAULT_STATIC_PRESETS.find((p) => p.id === presetId);
    if (staticPreset) return staticPreset.audio_url;
  }

  // 2. DB 업로드 프리셋 ID 조회
  if (presetId && supabase) {
    const { data } = await supabase
      .from('broadcast_presets')
      .select('audio_url')
      .eq('id', presetId)
      .single();
    if (data?.audio_url) return data.audio_url;
  }

  // 3. Fallback: messageText나 title로 매칭
  if (messageText) {
    const staticMatch = DEFAULT_STATIC_PRESETS.find(
      (p) => p.title === messageText || p.message_text === messageText
    );
    if (staticMatch) return staticMatch.audio_url;

    if (supabase) {
      let query = supabase.from('broadcast_presets').select('audio_url').eq('title', messageText);
      if (storeId) {
        query = query.eq('store_id', storeId);
      }
      const { data } = await query.limit(1).maybeSingle();
      if (data?.audio_url) return data.audio_url;
    }
  }

  return null;
}

export async function recordBroadcastRun(
  message: string,
  scheduledId?: string,
  status: Extract<BroadcastRunStatus, 'pending' | 'missed'> = 'pending',
  storeId?: string,
  triggeredAt?: Date
): Promise<string | undefined> {
  if (!supabase) return undefined;
  try {
    const { data } = await supabase
      .from('broadcast_runs')
      .insert({
        scheduled_broadcast_id: scheduledId ?? null,
        store_id: storeId ?? null,
        message_text: message,
        status,
        ...(triggeredAt ? { triggered_at: triggeredAt.toISOString() } : {}),
      })
      .select('id')
      .single();
    return data?.id as string | undefined;
  } catch {
    return undefined;
  }
}

export async function finishBroadcastRun(
  id: string | undefined,
  status: Extract<BroadcastRunStatus, 'success' | 'failure' | 'cancelled'>
): Promise<void> {
  if (!id || !supabase) return;
  try {
    await supabase
      .from('broadcast_runs')
      .update(status === 'failure' ? { status, error_message: '오디오 파일 재생 실패' } : { status })
      .eq('id', id);
  } catch {
    // ignore
  }
}

export async function playBroadcast(
  message: string,
  scheduledId?: string,
  storeId?: string,
  presetId?: string | null,
  directAudioUrl?: string | null
): Promise<boolean> {
  const run = async () => {
    const runId = await recordBroadcastRun(message, scheduledId, 'pending', storeId);
    try {
      const audioUrl = directAudioUrl ?? (await resolvePresetAudioUrl(presetId, message, storeId));
      if (!audioUrl) {
        await finishBroadcastRun(runId, 'failure');
        return false;
      }
      await playVoiceAsset(audioUrl);
      await finishBroadcastRun(runId, 'success');
      return true;
    } catch {
      await finishBroadcastRun(runId, 'failure');
      return false;
    }
  };

  const queued = playbackQueue.then(run, run);
  playbackQueue = queued.then(
    () => undefined,
    () => undefined
  );
  return queued;
}

/**
 * 브라우저 백그라운드 탭에서도 throttling 없이 10초마다 시각을 체크하는 인라인 Web Worker
 */
export function createBroadcastTimerWorker(onTick: () => void): () => void {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    const timer = setInterval(onTick, 10000);
    return () => clearInterval(timer);
  }

  try {
    const workerScript = [
      'var timer = setInterval(function() { postMessage("tick"); }, 10000);',
      'onmessage = function(e) { if (e.data === "stop") { clearInterval(timer); } };',
    ].join('\n');
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
      if (e.data === 'tick') {
        onTick();
      }
    };

    return () => {
      worker.postMessage('stop');
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  } catch {
    const timer = setInterval(onTick, 10000);
    return () => clearInterval(timer);
  }
}

/**
 * App.tsx 최상위에서 상시 구동되는 전역 예약 방송 스케줄러 훅
 */
export function useGlobalBroadcastScheduler(): void {
  const schedulesRef = useRef<StoredSchedule[]>([]);
  const executedKeysRef = useRef<Set<string>>(new Set());
  const lastCheckedAtRef = useRef<Date | null>(null);
  const playbackTabIdRef = useRef(createPlaybackTabId());
  const tickInFlightRef = useRef(false);

  const reloadSchedules = async () => {
    const data = await fetchActiveSchedules();
    schedulesRef.current = data;
  };

  useEffect(() => {
    try {
      const storedCheck = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(LAST_BROADCAST_CHECK_KEY) : null;
      if (storedCheck) {
        const parsed = new Date(storedCheck);
        if (!Number.isNaN(parsed.getTime())) lastCheckedAtRef.current = parsed;
      }
    } catch {
      // Ignore storage errors in restricted/test environments
    }
    void reloadSchedules();

    // 1. 스케줄 변경 이벤트 수신 시 즉시 갱신
    const handleUpdate = () => void reloadSchedules();
    window.addEventListener(NOTIFY_SCHEDULE_UPDATE_EVENT, handleUpdate);

    // 2. 30분마다 만약을 대비한 백업 재동기화
    const resyncInterval = setInterval(() => void reloadSchedules(), 30 * 60 * 1000);

    // 3. Web Worker 기반 정밀 백그라운드 타이머 (10초 주기)
    const tick = async () => {
      if (tickInFlightRef.current) return;
      tickInFlightRef.current = true;
      try {
        const now = new Date();
        const currentMinuteKey = now.toISOString().slice(0, 16);

        const storeMap = await fetchStoreMap();
        const currentSlug = detectCurrentStoreSlug();
        const currentStoreId = storeMap[currentSlug];

        // 현재 지점에 해당하는 스케줄만 실행 (지점 정보가 있으면 필터링, 없으면 전체)
        const relevantSchedules = currentStoreId
          ? schedulesRef.current.filter((s) => !s.storeId || s.storeId === currentStoreId)
          : schedulesRef.current;

        const previousCheck = lastCheckedAtRef.current;
        if (previousCheck && now.getTime() - previousCheck.getTime() > 70_000) {
          for (const item of getSchedulesDueBetween(relevantSchedules, previousCheck, now)) {
            const executionKey = `${item.id}:${item.dueAt.toISOString().slice(0, 16)}`;
            if (!executedKeysRef.current.has(executionKey)) {
              if (await claimPlaybackLease(item.storeId, playbackTabIdRef.current)) {
                executedKeysRef.current.add(executionKey);
                void recordBroadcastRun(item.message_text, item.id, 'missed', item.storeId, item.dueAt);
              }
            }
          }
        }
        lastCheckedAtRef.current = now;
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(LAST_BROADCAST_CHECK_KEY, now.toISOString());
          }
        } catch {
          // Ignore storage errors in restricted/test environments
        }

        for (const item of relevantSchedules) {
          const executionKey = `${item.id}:${currentMinuteKey}`;
          if (executedKeysRef.current.has(executionKey)) continue;

          if (isDue(item, now)) {
            if (await claimPlaybackLease(item.storeId, playbackTabIdRef.current)) {
              executedKeysRef.current.add(executionKey);
              void playBroadcast(item.message_text, item.id, item.storeId, item.broadcast_preset_id);
            }
          }
        }
      } finally {
        tickInFlightRef.current = false;
      }
    };
    const stopWorker = createBroadcastTimerWorker(() => void tick());

    return () => {
      window.removeEventListener(NOTIFY_SCHEDULE_UPDATE_EVENT, handleUpdate);
      clearInterval(resyncInterval);
      stopWorker();
    };
  }, []);
}
