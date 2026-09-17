import { useEffect, useRef } from 'react';
import { isKoreanSpeechCancellation, speakKorean } from './broadcast';
import { isDue, type ScheduledBroadcast } from './broadcastSchedule';
import { supabase } from './supabase';

const WINDOWS_FEMALE_VOICE_NAMES = ['SunHi', 'Heami'];
export type BroadcastRunStatus = 'pending' | 'success' | 'failure' | 'missed' | 'cancelled';

/** Returns the supported Windows female Korean voices that this browser can actually use. */
export function getKoreanFemaleVoices(
  voices: readonly SpeechSynthesisVoice[]
): SpeechSynthesisVoice[] {
  return voices.filter(
    (voice) =>
      voice.lang.toLowerCase() === 'ko-kr' &&
      WINDOWS_FEMALE_VOICE_NAMES.some((name) => voice.name.toLowerCase().includes(name.toLowerCase()))
  );
}

export type StoredSchedule = ScheduledBroadcast & {
  id: string;
  storeId: string;
  message_text: string;
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
let playbackQueue = Promise.resolve();

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
      .select('id, store_id, message_text, schedule_type, target_time, target_days, target_date, is_enabled')
      .eq('is_enabled', true)
      .order('target_time');

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id,
      storeId: item.store_id,
      message_text: item.message_text,
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

async function recordBroadcastRun(
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

async function finishBroadcastRun(
  id: string | undefined,
  status: Extract<BroadcastRunStatus, 'success' | 'failure' | 'cancelled'>
): Promise<void> {
  if (!id || !supabase) return;
  try {
    await supabase
      .from('broadcast_runs')
      .update(status === 'failure' ? { status, error_message: '브라우저 음성 재생 실패' } : { status })
      .eq('id', id);
  } catch {
    // ignore
  }
}

export async function playBroadcast(
  message: string,
  scheduledId?: string,
  storeId?: string
): Promise<boolean> {
  const run = async () => {
    const runId = await recordBroadcastRun(message, scheduledId, 'pending', storeId);
    try {
      await speakKorean(message);
      await finishBroadcastRun(runId, 'success');
      return true;
    } catch (error) {
      await finishBroadcastRun(runId, isKoreanSpeechCancellation(error) ? 'cancelled' : 'failure');
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

      const previousCheck = lastCheckedAtRef.current;
      if (previousCheck && now.getTime() - previousCheck.getTime() > 70_000) {
        for (const item of getSchedulesDueBetween(schedulesRef.current, previousCheck, now)) {
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

      for (const item of schedulesRef.current) {
        const executionKey = `${item.id}:${currentMinuteKey}`;
        if (executedKeysRef.current.has(executionKey)) continue;

        if (isDue(item, now)) {
          if (await claimPlaybackLease(item.storeId, playbackTabIdRef.current)) {
            executedKeysRef.current.add(executionKey);
            void playBroadcast(item.message_text, item.id, item.storeId);
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
