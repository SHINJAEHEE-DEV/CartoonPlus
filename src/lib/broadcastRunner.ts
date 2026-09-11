import { useEffect, useRef } from 'react';
import { speakKorean } from './broadcast';
import { isDue, type ScheduledBroadcast } from './broadcastSchedule';
import { supabase } from './supabase';

export const BROADCAST_PRESETS = [
  ['기본', '/audio/기본.mp3', '매장 이용 에티켓 및 기본 안내'],
  ['마감', '/audio/마감.mp3', '영업 마감 15분 전 퇴실 준비 안내'],
  ['만석', '/audio/만석.mp3', '만석 및 대기 번호표 접수 안내'],
  ['소음', '/audio/소음.mp3', '정숙 및 이어폰 착용 권장 안내'],
  ['신분증 검사', '/audio/신분증검사.mp3', '오후 10시 이후 청소년 퇴실/신분증 확인'],
  ['음료 픽업 요청', '/audio/음료픽업요청.mp3', '제조 완료 음료 카운터 수령 안내'],
] as const;

export type StoredSchedule = ScheduledBroadcast & {
  id: string;
  message_text: string;
};

export const NOTIFY_SCHEDULE_UPDATE_EVENT = 'cartoonplus_broadcast_schedules_updated';

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
      .select('id, message_text, schedule_type, target_time, target_days, target_date, is_enabled')
      .eq('is_enabled', true)
      .is('archived_at', null)
      .order('target_time');

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id,
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

async function recordBroadcastRun(message: string, scheduledId?: string): Promise<string | undefined> {
  if (!supabase) return undefined;
  try {
    const { data } = await supabase
      .from('broadcast_runs')
      .insert({
        scheduled_broadcast_id: scheduledId ?? null,
        message_text: message,
        status: 'pending',
      })
      .select('id')
      .single();
    return data?.id as string | undefined;
  } catch {
    return undefined;
  }
}

async function finishBroadcastRun(id: string | undefined, success: boolean): Promise<void> {
  if (!id || !supabase) return;
  try {
    await supabase
      .from('broadcast_runs')
      .update(success ? { status: 'success' } : { status: 'failure', error_message: '브라우저 음성 재생 실패' })
      .eq('id', id);
  } catch {
    // ignore
  }
}

export async function playBroadcast(message: string, scheduledId?: string): Promise<boolean> {
  const runId = await recordBroadcastRun(message, scheduledId);
  const matchedPreset = BROADCAST_PRESETS.find(([title]) => title === message);

  if (matchedPreset) {
    return new Promise((resolve) => {
      try {
        const audioPath = `${import.meta.env.BASE_URL}${matchedPreset[1].replace(/^\//, '')}`;
        const audio = new Audio(audioPath);
        audio.onended = () => {
          void finishBroadcastRun(runId, true);
          resolve(true);
        };
        audio.onerror = () => {
          void finishBroadcastRun(runId, false);
          resolve(false);
        };
        void audio.play().catch(() => {
          void finishBroadcastRun(runId, false);
          resolve(false);
        });
      } catch {
        void finishBroadcastRun(runId, false);
        resolve(false);
      }
    });
  }

  // TTS 재생
  try {
    await speakKorean(message);
    await finishBroadcastRun(runId, true);
    return true;
  } catch {
    await finishBroadcastRun(runId, false);
    return false;
  }
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

  const reloadSchedules = async () => {
    const data = await fetchActiveSchedules();
    schedulesRef.current = data;
  };

  useEffect(() => {
    void reloadSchedules();

    // 1. 스케줄 변경 이벤트 수신 시 즉시 갱신
    const handleUpdate = () => void reloadSchedules();
    window.addEventListener(NOTIFY_SCHEDULE_UPDATE_EVENT, handleUpdate);

    // 2. 30분마다 만약을 대비한 백업 재동기화
    const resyncInterval = setInterval(() => void reloadSchedules(), 30 * 60 * 1000);

    // 3. Web Worker 기반 정밀 백그라운드 타이머 (10초 주기)
    const stopWorker = createBroadcastTimerWorker(() => {
      const now = new Date();
      const currentMinuteKey = now.toISOString().slice(0, 16);

      for (const item of schedulesRef.current) {
        const executionKey = `${item.id}:${currentMinuteKey}`;
        if (executedKeysRef.current.has(executionKey)) continue;

        if (isDue(item, now)) {
          executedKeysRef.current.add(executionKey);
          void playBroadcast(item.message_text, item.id);
        }
      }
    });

    return () => {
      window.removeEventListener(NOTIFY_SCHEDULE_UPDATE_EVENT, handleUpdate);
      clearInterval(resyncInterval);
      stopWorker();
    };
  }, []);
}
