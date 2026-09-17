import { FormEvent, useEffect, useRef, useState } from 'react';
import { isKoreanSpeechCancellation, speakKorean, stopKoreanSpeech } from '../../lib/broadcast';
import { type ScheduledBroadcast } from '../../lib/broadcastSchedule';
import { supabase } from '../../lib/supabase';
import { notifyScheduleUpdated } from '../../lib/broadcastRunner';
import { useSelectedStaffStoreId } from './StaffStoreContext';
import { useBroadcastVoice } from './useBroadcastVoice';

type BroadcastPresetPreview = readonly [string, string, string, string?];

const initialPresets: BroadcastPresetPreview[] = [
  ['기본', '매장 이용 후 퇴실 시 사용하신 담요, 만화책, 식기 등을 모두 반납해 주시고 쓰레기는 쓰레기통에 버려 주시기 바랍니다.', '매장 이용 에티켓 및 기본 안내'],
  ['마감', '안내 말씀드립니다. 저희 매장 이용 시간은 11시까지입니다. 10시 50분부터 마감 준비를 하오니 사용하신 담요, 만화책, 식기 등을 반납하고 자리 정돈 부탁드립니다.', '영업 마감 15분 전 퇴실 준비 안내'],
  ['만석', '현재 만석으로 자리 이동이 제한됩니다. 퇴실 시 사용하신 담요, 만화책, 식기 등을 반납하고 자리 정돈 부탁드립니다.', '만석 및 자리 정돈 안내'],
  ['소음', '모든 고객님이 편안하게 이용하실 수 있도록 큰 소리는 삼가 주시고 자리 정돈 부탁드립니다.', '정숙 및 이어폰 착용 권장 안내'],
  ['신분증 검사', '잠시 후 10시부터 신분증 확인을 진행합니다. 계속 이용하실 고객님께서는 실물 신분증을 미리 준비해 주시기 바랍니다.', '오후 10시 이후 신분증 확인 안내'],
  ['음료 픽업 요청', '주문하신 음료가 카운터에 준비되어 있습니다. 카카오톡 알림을 확인해 주시기 바랍니다.', '제조 완료 음료 카운터 수령 안내'],
];

const QUICK_TTS_TEMPLATES = [
  { label: '☕ 음료 픽업', text: '주문하신 음료가 준비되었습니다. 카운터에서 수령해 주시기 바랍니다.' },
  { label: '🍜 라면 조리완료', text: '주문하신 라면이 나왔습니다. 카운터에서 수령해 주시기 바랍니다.' },
  { label: '📚 도서 반납 안내', text: '이용을 마치신 고객님께서는 다 읽으신 도서를 반납대로 반납해 주시기 바랍니다.' },
  { label: '🤫 정숙 권장', text: '모든 고객님의 쾌적한 이용을 위해 통화 및 대화는 작은 목소리로 부탁드립니다.' },
  { label: '⏰ 마감 15분전', text: '잠시 후 영업이 종료됩니다. 퇴실 준비와 자리 정돈을 부탁드립니다.' },
];

const STATUS_THEME: Record<
  '대기' | '재생 중' | '성공' | '실패',
  { pillBg: string; pillColor: string; dotBg: string; dotPulse: boolean }
> = {
  '대기': { pillBg: '#333333', pillColor: '#FFFFFF', dotBg: '#8A8175', dotPulse: false },
  '재생 중': { pillBg: 'var(--color-yellow, #FED943)', pillColor: '#1E1E1E', dotBg: '#E65100', dotPulse: true },
  '성공': { pillBg: '#2FA14B', pillColor: '#FFFFFF', dotBg: '#A3E635', dotPulse: false },
  '실패': { pillBg: '#E03131', pillColor: '#FFFFFF', dotBg: '#FFA8A8', dotPulse: false },
};

type StoredSchedule = ScheduledBroadcast & { id: string; message_text: string; presetId?: string };
type MissedRun = { id: string; message_text: string; triggered_at: string };
type PresetEditor = {
  id?: string;
  title: string;
  message: string;
  linkedScheduleCount: number;
};
type ScheduleForm = {
  message: string;
  presetId: string;
  type: ScheduledBroadcast['scheduleType'];
  time: string;
  date: string;
  weekdays: string[];
};

const emptySchedule: ScheduleForm = {
  message: '',
  presetId: '',
  type: 'daily',
  time: '09:00',
  date: '',
  weekdays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
};

const dayLabels: Record<string, string> = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};

function formatError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function BroadcastPage() {
  const [presets, setPresets] = useState(initialPresets);
  const storeId = useSelectedStaffStoreId();
  const { voiceName, voiceNames, setVoiceName } = useBroadcastVoice();
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'대기' | '재생 중' | '성공' | '실패'>('대기');
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<StoredSchedule[]>([]);
  const [schedule, setSchedule] = useState<ScheduleForm>(emptySchedule);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [scheduleStatus, setScheduleStatus] = useState('');
  const [missedRuns, setMissedRuns] = useState<MissedRun[]>([]);
  const [presetEditor, setPresetEditor] = useState<PresetEditor | null>(null);
  const [isSavingPreset, setIsSavingPreset] = useState(false);

  const scheduleFormRef = useRef<HTMLFormElement>(null);
  const scheduleTypeSelectRef = useRef<HTMLSelectElement>(null);

  const recordRun = async (message: string, scheduledId?: string) => {
    if (!supabase) return;
    if (!storeId) return;
    const { data } = await supabase
      .from('broadcast_runs')
      .insert({
        scheduled_broadcast_id: scheduledId ?? null,
        store_id: storeId,
        message_text: message,
        status: 'pending',
      })
      .select('id')
      .single();
    return data?.id as string | undefined;
  };

  const finishRun = async (id: string | undefined, status: 'success' | 'failure' | 'cancelled') => {
    if (id && supabase) {
      await supabase
        .from('broadcast_runs')
        .update(status === 'failure' ? { status, error_message: '브라우저 음성 재생 실패' } : { status })
        .eq('id', id);
    }
  };

  const play = async (value: string, scheduledId?: string) => {
    setStatus('재생 중');
    setCurrentPlaying(value);
    const runId = await recordRun(value, scheduledId);
    try {
      await speakKorean(value, voiceName || undefined);
      await finishRun(runId, 'success');
      setStatus('성공');
      setCurrentPlaying(null);
    } catch (error) {
      const cancelled = isKoreanSpeechCancellation(error);
      await finishRun(runId, cancelled ? 'cancelled' : 'failure');
      setStatus(cancelled ? '대기' : '실패');
      setCurrentPlaying(null);
    }
  };

  const loadSchedules = async (targetStoreId = storeId) => {
    if (!supabase || !targetStoreId) return;
    const { data, error } = await supabase
      .from('scheduled_broadcasts')
      .select('id, message_text, broadcast_preset_id, schedule_type, target_time, target_days, target_date, is_enabled')
      .eq('store_id', targetStoreId)
      .order('target_time');
    if (error) {
      setScheduleStatus(`예약을 불러오지 못했습니다: ${error.message}`);
      return;
    }
    setSchedules(
      (data ?? []).map((item) => ({
        id: item.id,
        message_text: item.message_text,
        presetId: item.broadcast_preset_id ?? undefined,
        scheduleType: item.schedule_type,
        targetTime: item.target_time.slice(0, 5),
        targetDays: item.target_days ?? [],
        targetDate: item.target_date ?? undefined,
        isEnabled: item.is_enabled,
      })) as StoredSchedule[]
    );
  };

  const loadPresets = async () => {
    if (!supabase) return;
    if (!storeId) return;
    const { data, error } = await supabase
      .from('broadcast_presets')
      .select('id, title, message_text')
      .eq('store_id', storeId)
      .order('created_at');
    if (error) {
      setScheduleStatus(`프리셋을 불러오지 못했습니다: ${error.message}`);
      return;
    }
    if (data?.length) {
      setPresets(data.map((preset) => [preset.title, preset.message_text, '편집 가능한 TTS 프리셋', preset.id] as const));
    }
  };

  const loadMissedRuns = async (targetStoreId = storeId) => {
    if (!supabase || !targetStoreId) return;
    const { data, error } = await supabase
      .from('broadcast_runs')
      .select('id, message_text, triggered_at')
      .eq('store_id', targetStoreId)
      .eq('status', 'missed')
      .order('triggered_at', { ascending: false })
      .limit(10);
    if (error) {
      setScheduleStatus(`미실행 기록을 불러오지 못했습니다: ${error.message}`);
    } else {
      setMissedRuns((data ?? []) as MissedRun[]);
    }
  };

  const countLinkedSchedules = async (presetId?: string): Promise<number> => {
    if (!supabase || !presetId) return 0;
    const { count } = await supabase
      .from('scheduled_broadcasts')
      .select('id', { count: 'exact', head: true })
      .eq('broadcast_preset_id', presetId);
    return count ?? 0;
  };

  const openPresetEditor = async (preset?: BroadcastPresetPreview) => {
    const [title = '', message = '', , id] = preset ?? [];
    setPresetEditor({ title, message, id, linkedScheduleCount: 0 });
    if (id) {
      const linkedScheduleCount = await countLinkedSchedules(id);
      setPresetEditor((current) => (current?.id === id ? { ...current, linkedScheduleCount } : current));
    }
  };

  const savePreset = async () => {
    if (!presetEditor || !supabase || isSavingPreset) return;
    const title = presetEditor.title.trim();
    const message = presetEditor.message.trim();
    if (!title || !message) {
      setScheduleStatus('프리셋 제목과 방송 문구를 입력해 주세요.');
      return;
    }
    if (!storeId) return;
    setIsSavingPreset(true);
    try {
      if (presetEditor.id) {
        const { error: presetErr } = await supabase
          .from('broadcast_presets')
          .update({ title, message_text: message })
          .eq('id', presetEditor.id);
        if (presetErr) throw presetErr;

        // 연결된 예약 방송 문구도 함께 동기화
        await supabase
          .from('scheduled_broadcasts')
          .update({ message_text: message })
          .eq('broadcast_preset_id', presetEditor.id);
      } else {
        const { error: insertErr } = await supabase
          .from('broadcast_presets')
          .insert({ store_id: storeId, title, message_text: message });
        if (insertErr) throw insertErr;
      }

      setScheduleStatus('프리셋을 저장했습니다.');
      await loadPresets();
      await loadSchedules();
      notifyScheduleUpdated();
      setPresetEditor(null);
    } catch (err) {
      setScheduleStatus(`프리셋을 저장하지 못했습니다: ${formatError(err)}`);
    } finally {
      setIsSavingPreset(false);
    }
  };

  const deletePreset = async (title: string, presetId?: string) => {
    if (!supabase) return;
    const linkedScheduleCount = await countLinkedSchedules(presetId);
    if (!window.confirm(`'${title}' 프리셋과 연결 예약 ${linkedScheduleCount}건을 삭제할까요?`)) return;
    if (!storeId) return;
    try {
      if (presetId) {
        // 연결된 예약 방송 먼저 명시적 삭제 (FK 안전 보장)
        await supabase.from('scheduled_broadcasts').delete().eq('broadcast_preset_id', presetId);
        const { error } = await supabase.from('broadcast_presets').delete().eq('id', presetId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('broadcast_presets').delete().eq('store_id', storeId).eq('title', title);
        if (error) throw error;
        // DB에 없던 로컬 fallback 프리셋인 경우 클라이언트 state에서도 필터링
        setPresets((prev) => prev.filter(([t]) => t !== title));
      }
      setScheduleStatus('프리셋과 연결 예약을 삭제했습니다.');
      await loadPresets();
      await loadSchedules();
      notifyScheduleUpdated();
    } catch (err) {
      setScheduleStatus(`프리셋을 삭제하지 못했습니다: ${formatError(err)}`);
    }
  };

  useEffect(() => {
    const setup = async () => {
      if (!storeId) return;
      await loadSchedules(storeId);
      await loadPresets();
      await loadMissedRuns(storeId);
    };
    void setup();
  }, [storeId]);

  useEffect(() => {
    if (!storeId) return;
    const interval = window.setInterval(() => void loadMissedRuns(), 30_000);
    return () => window.clearInterval(interval);
  }, [storeId]);

  const saveSchedule = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setScheduleStatus('Supabase 연결 설정이 필요합니다.');
      return;
    }
    setScheduleStatus('저장 중...');
    if (!storeId) {
      setScheduleStatus('지점 정보를 불러오는 중입니다.');
      return;
    }
    const values = {
      store_id: storeId,
      message_text: schedule.message.trim(),
      broadcast_preset_id:
        presets.find((preset) => preset[3] === schedule.presetId)?.[1] === schedule.message.trim()
          ? schedule.presetId
          : null,
      schedule_type: schedule.type,
      target_time: schedule.time,
      target_days: schedule.type === 'weekdays' ? schedule.weekdays : null,
      target_date: schedule.type === 'once' ? schedule.date : null,
      is_enabled: editingScheduleId
        ? schedules.find((item) => item.id === editingScheduleId)?.isEnabled ?? true
        : true,
    };
    const { error } = editingScheduleId
      ? await supabase.from('scheduled_broadcasts').update(values).eq('id', editingScheduleId)
      : await supabase.from('scheduled_broadcasts').insert(values);
    if (error) {
      setScheduleStatus(`저장하지 못했습니다: ${error.message}`);
      return;
    }
    setSchedule(emptySchedule);
    setEditingScheduleId(null);
    setScheduleStatus(editingScheduleId ? '예약 방송을 수정했습니다.' : '예약 방송을 저장했습니다.');
    await loadSchedules();
    notifyScheduleUpdated();
  };

  const toggleSchedule = async (item: StoredSchedule) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('scheduled_broadcasts')
      .update({ is_enabled: !item.isEnabled })
      .eq('id', item.id);
    if (error) {
      setScheduleStatus(`변경하지 못했습니다: ${error.message}`);
      return;
    }
    await loadSchedules();
    notifyScheduleUpdated();
  };

  const archiveSchedule = async (item: StoredSchedule) => {
    if (!supabase) return;
    const { error } = await supabase.from('scheduled_broadcasts').delete().eq('id', item.id);
    setScheduleStatus(
      error ? `예약을 삭제하지 못했습니다: ${error.message}` : '예약을 삭제했습니다.'
    );
    if (!error) {
      await loadSchedules();
      notifyScheduleUpdated();
    }
  };

  const resetScheduleEditing = () => {
    setSchedule(emptySchedule);
    setEditingScheduleId(null);
  };

  const handleEditScheduleClick = (item: StoredSchedule) => {
    setSchedule({
      message: item.message_text,
      presetId: item.presetId ?? '',
      type: item.scheduleType,
      time: item.targetTime,
      date: item.targetDate ?? '',
      weekdays: item.targetDays ?? [],
    });
    setEditingScheduleId(item.id);
    scheduleFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    scheduleTypeSelectRef.current?.focus();
  };

  const currentTheme = STATUS_THEME[status];

  return (
    <div className="staff-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. 상단 마스터 헤더 & 실시간 컨트롤 */}
      <div
        className="staff-section-card"
        style={{
          background: 'var(--color-dark, #1E1E1E)',
          color: '#FFF9EC',
          boxShadow: '5px 5px 0 var(--color-yellow, #FED943)',
          border: '3px solid var(--color-border, #1E1E1E)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.15em',
                color: 'var(--color-yellow, #FED943)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              STORE BROADCAST CONSOLE
            </div>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>📢 매장 안내 방송</span>
            </h1>
          </div>

          {/* 실시간 상태 뱃지 & 비상 중지 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {status === '재생 중' && (
              <button
                type="button"
                aria-label="방송 긴급 중지"
                onClick={() => {
                  stopKoreanSpeech();
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-pill, 999px)',
                  background: '#E03131',
                  border: '2px solid #FFFFFF',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 12px rgba(224, 49, 49, 0.6)',
                }}
              >
                <span>⏹ 방송 긴급 중지</span>
              </button>
            )}

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill, 999px)',
                background: currentTheme.pillBg,
                border: '2px solid rgba(255, 255, 255, 0.2)',
                fontWeight: 900,
                fontSize: '13px',
                color: currentTheme.pillColor,
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: currentTheme.dotBg,
                  display: 'inline-block',
                  animation: currentTheme.dotPulse ? 'pulse-dot 1s infinite' : 'none',
                }}
              />
              {status === '재생 중'
                ? `송출 중: ${currentPlaying?.slice(0, 24) ?? '음성'}${currentPlaying && currentPlaying.length > 24 ? '…' : ''}`
                : `방송 상태: ${status}`}
            </div>
          </div>
        </div>

        {/* 컨트롤 옵션 & 가이드 바 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #333333',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#CFC7B4' }}>
              🎙️ 송출 음성:
            </span>
            <select
              aria-label="한국어 음성 선택"
              value={voiceName}
              onChange={(event) => setVoiceName(event.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#2A2A2A',
                border: '1.5px solid #444444',
                color: '#FFF9EC',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <option value="">이 PC 기본 한국어 음성 (여성 우선)</option>
              {voiceNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              fontSize: '12.5px',
              color: '#A79E8B',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ color: 'var(--color-yellow, #FED943)' }}>💡</span> 카운터 PC 탭을 열어 두시면 백그라운드에서도 정시 예약 방송이 자동 송출됩니다.
          </div>
        </div>
      </div>

      {/* 2열 그리드: 자주 쓰는 원클릭 프리셋 & 실시간 커스텀 TTS */}
      <div className="home-split">
        {/* 2-1. 자주 쓰는 원클릭 정규 안내 방송 */}
        <div
          className="staff-section-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
                📻 원클릭 정규 안내 방송
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted, #6B6354)', fontWeight: 600 }}>
                매장에서 자주 사용하는 안내 멘트를 즉시 송출합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() => void openPresetEditor()}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                background: 'var(--color-yellow, #FED943)',
                border: '2px solid var(--color-border, #1E1E1E)',
                fontSize: '12px',
                fontWeight: 900,
                color: 'var(--color-dark, #1E1E1E)',
                cursor: 'pointer',
                boxShadow: '2px 2px 0 var(--color-border, #1E1E1E)',
                transition: 'all 0.15s ease',
              }}
            >
              + 새 프리셋 추가
            </button>
          </div>

          {/* 프리셋 카드 그리드 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {presets.map(([title, message, desc, id]) => {
              const isPlayingThis = currentPlaying === message;
              return (
                <div
                  key={title}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '14px 16px',
                    background: isPlayingThis ? 'var(--color-yellow-light, #FFF3C9)' : 'var(--color-panel-cream, #FFF9EC)',
                    border: isPlayingThis ? '2.5px solid #E65100' : '2px solid var(--color-border, #1E1E1E)',
                    borderRadius: '16px',
                    boxShadow: isPlayingThis ? '3px 3px 0 #E65100' : '3px 3px 0 var(--color-border, #1E1E1E)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 900,
                          color: 'var(--color-dark, #1E1E1E)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {title}
                      </span>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="btn-neo-sub"
                          aria-label={`${title} 프리셋 수정`}
                          onClick={() => void openPresetEditor([title, message, desc, id])}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="btn-neo-sub btn-neo-sub-danger"
                          aria-label={`${title} 프리셋 삭제`}
                          onClick={() => void deletePreset(title, id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-muted, #6B6354)',
                        fontWeight: 600,
                        lineHeight: 1.4,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {desc || message}
                    </p>
                  </div>

                  {/* 즉시 방송 버튼 */}
                  <button
                    type="button"
                    aria-label={`${title} 안내 즉시 방송`}
                    onClick={() => void play(message)}
                    disabled={status === '재생 중'}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      background: isPlayingThis ? 'var(--color-dark, #1E1E1E)' : 'var(--color-yellow, #FED943)',
                      color: isPlayingThis ? 'var(--color-yellow, #FED943)' : 'var(--color-dark, #1E1E1E)',
                      border: '2px solid var(--color-border, #1E1E1E)',
                      fontWeight: 900,
                      fontSize: '13px',
                      cursor: status === '재생 중' ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: isPlayingThis ? 'none' : '2px 2px 0 var(--color-border, #1E1E1E)',
                    }}
                  >
                    <span>{isPlayingThis ? '🔊 송출 중...' : '▶ 즉시 방송'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-2. 실시간 커스텀 TTS 방송 */}
        <div
          className="staff-section-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
                🎤 실시간 커스텀 TTS 방송
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted, #6B6354)', fontWeight: 600 }}>
                상황에 맞는 멘트를 직접 입력하여 즉시 매장에 방송합니다.
              </div>
            </div>
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--color-yellow-light, #FFF3C9)',
                border: '1.5px solid var(--color-border, #1E1E1E)',
                fontSize: '11px',
                fontWeight: 900,
              }}
            >
              한국어 음성 합성
            </span>
          </div>

          {/* 퀵 템플릿 상용구 칩 */}
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--color-text-subtle, #8A8175)', marginBottom: '6px' }}>
              ⚡ 빠른 템플릿 선택
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {QUICK_TTS_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.label}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => setText(tmpl.text)}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* 텍스트 입력창 */}
          <textarea
            aria-label="즉시 방송할 멘트 입력"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="매장에 즉시 방송할 멘트를 입력하세요. (예: 12번 테이블 주문하신 라면 나왔습니다.)"
            rows={4}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: '2px solid var(--color-border, #1E1E1E)',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'inherit',
              lineHeight: 1.5,
              resize: 'vertical',
              boxSizing: 'border-box',
              background: '#FFFFFF',
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.04)',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle, #8A8175)' }}>
              {text.length}자 입력됨
            </span>
            <button
              type="button"
              aria-label="매장 전체 즉시 송출"
              onClick={() => void play(text)}
              disabled={!text.trim() || status === '재생 중'}
              style={{
                padding: '11px 24px',
                borderRadius: '12px',
                background: text.trim() ? 'var(--color-yellow, #FED943)' : '#E0DCD3',
                color: 'var(--color-dark, #1E1E1E)',
                border: '2.5px solid var(--color-border, #1E1E1E)',
                fontWeight: 900,
                fontSize: '14px',
                cursor: text.trim() && status !== '재생 중' ? 'pointer' : 'not-allowed',
                boxShadow: text.trim() ? '3px 3px 0 var(--color-border, #1E1E1E)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              매장 전체 즉시 송출 🔊
            </button>
          </div>
        </div>
      </div>

      {/* 3. 예약 방송 스케줄러 & 등록 폼 */}
      <div
        className="staff-section-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
              ⏰ 자동 예약 방송 스케줄러
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted, #6B6354)', fontWeight: 600, marginTop: '2px' }}>
              매일 반복되거나 특정 요일/날짜에 송출할 방송 일정을 등록하고 관리합니다.
            </div>
          </div>
          {scheduleStatus && (
            <span
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill, 999px)',
                background: 'var(--color-yellow-light, #FFF3C9)',
                border: '2px solid var(--color-border, #1E1E1E)',
                fontSize: '12px',
                fontWeight: 800,
                boxShadow: '2px 2px 0 var(--color-border, #1E1E1E)',
              }}
            >
              {scheduleStatus}
            </span>
          )}
        </div>

        {/* 스케줄 등록/수정 폼 (ADR-0008 staff-form-grid 적용) */}
        <form
          ref={scheduleFormRef}
          onSubmit={(event) => void saveSchedule(event)}
          style={{
            background: editingScheduleId ? 'var(--color-yellow-light, #FFF3C9)' : 'var(--color-panel-cream, #FFF9EC)',
            border: '2.5px solid var(--color-border, #1E1E1E)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '3px 3px 0 var(--color-border, #1E1E1E)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
              {editingScheduleId ? '✏️ 예약 방송 스케줄 수정' : '➕ 새 스케줄 등록'}
            </div>
            {editingScheduleId && (
              <button
                type="button"
                className="btn-neo-sub"
                onClick={resetScheduleEditing}
              >
                수정 취소
              </button>
            )}
          </div>

          <div className="staff-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
                반복 방식
              </label>
              <select
                ref={scheduleTypeSelectRef}
                value={schedule.type}
                onChange={(event) =>
                  setSchedule({ ...schedule, type: event.target.value as typeof schedule.type })
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  fontWeight: 800,
                  fontSize: '13px',
                  background: '#FFFFFF',
                }}
              >
                <option value="daily">매일 반복</option>
                <option value="weekdays">특정 요일 반복</option>
                <option value="once">지정일 1회</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
                송출 시간
              </label>
              <input
                required
                type="time"
                value={schedule.time}
                onChange={(event) => setSchedule({ ...schedule, time: event.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  fontWeight: 800,
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  background: '#FFFFFF',
                }}
              />
            </div>

            {schedule.type === 'once' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
                  지정 일자
                </label>
                <input
                  required
                  type="date"
                  value={schedule.date}
                  onChange={(event) => setSchedule({ ...schedule, date: event.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '2px solid var(--color-border, #1E1E1E)',
                    fontWeight: 800,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    background: '#FFFFFF',
                  }}
                />
              </div>
            )}
          </div>

          {schedule.type === 'weekdays' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '8px' }}>
                반복 요일 선택
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => {
                  const checked = schedule.weekdays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() =>
                        setSchedule({
                          ...schedule,
                          weekdays: checked
                            ? schedule.weekdays.filter((v) => v !== day)
                            : [...schedule.weekdays, day],
                        })
                      }
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-pill, 999px)',
                        border: '2px solid var(--color-border, #1E1E1E)',
                        background: checked ? 'var(--color-yellow, #FED943)' : '#FFFFFF',
                        fontWeight: 900,
                        fontSize: '12px',
                        cursor: 'pointer',
                        boxShadow: checked ? '2px 2px 0 var(--color-border, #1E1E1E)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {dayLabels[day]}요일
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
              방송 문구 (프리셋 선택 또는 직접 입력)
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                aria-label="프리셋 선택"
                value={schedule.presetId}
                onChange={(event) => {
                  const preset = presets.find(([, , , id]) => id === event.target.value);
                  if (preset) setSchedule({ ...schedule, presetId: event.target.value, message: preset[1] });
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  fontWeight: 800,
                  fontSize: '13px',
                  background: '#FFFFFF',
                  minWidth: '140px',
                }}
              >
                <option value="">프리셋 선택</option>
                {presets.map(([title, , , id]) => (
                  <option key={id ?? title} value={id ?? ''}>
                    {title}
                  </option>
                ))}
              </select>

              <input
                required
                value={schedule.message}
                onChange={(event) => setSchedule({ ...schedule, message: event.target.value })}
                placeholder="예: 마감 안내 또는 매장 내 정숙 부탁드립니다."
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  fontWeight: 600,
                  fontSize: '13px',
                  background: '#FFFFFF',
                }}
              />

              <button
                type="submit"
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  background: 'var(--color-dark, #1E1E1E)',
                  color: 'var(--color-yellow, #FED943)',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0 var(--color-yellow, #FED943)',
                  whiteSpace: 'nowrap',
                }}
              >
                {editingScheduleId ? '스케줄 수정 완료' : '스케줄 등록 +'}
              </button>
            </div>
          </div>
        </form>

        {/* 저장된 예약 목록 타임라인 (ADR-0008 staff-item-row 적용) */}
        <div>
          <div style={{ fontSize: '15px', fontWeight: 900, marginBottom: '12px', color: 'var(--color-dark, #1E1E1E)' }}>
            📋 등록된 방송 스케줄 ({schedules.length}건)
          </div>

          {schedules.length === 0 ? (
            <div
              style={{
                padding: '36px',
                background: '#FAF9F6',
                border: '2px dashed #D3CEC4',
                borderRadius: '16px',
                textAlign: 'center',
                color: 'var(--color-text-subtle, #8A8175)',
                fontWeight: 700,
                fontSize: '13.5px',
              }}
            >
              ⏰ 등록된 예약 방송 스케줄이 없습니다. 상단 폼에서 첫 스케줄을 등록해 보세요!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {schedules.map((item) => (
                <div
                  key={item.id}
                  className="staff-item-row"
                  style={{
                    background: item.isEnabled ? '#FFFFFF' : '#F5F3EF',
                    border: '2px solid var(--color-border, #1E1E1E)',
                    opacity: item.isEnabled ? 1 : 0.7,
                    boxShadow: item.isEnabled ? '3px 3px 0 var(--color-border, #1E1E1E)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1, minWidth: '220px' }}>
                    {/* 시간 뱃지 */}
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'var(--color-dark, #1E1E1E)',
                        color: 'var(--color-yellow, #FED943)',
                        fontSize: '14px',
                        fontWeight: 900,
                        fontFamily: 'monospace',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.targetTime}
                    </div>

                    {/* 반복 유형 뱃지 */}
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'var(--color-yellow-light, #FFF3C9)',
                        border: '1.5px solid var(--color-border, #1E1E1E)',
                        fontSize: '11.5px',
                        fontWeight: 900,
                      }}
                    >
                      {item.scheduleType === 'daily'
                        ? '매일'
                        : item.scheduleType === 'weekdays'
                          ? item.targetDays?.map((d) => dayLabels[d]).join(', ')
                          : item.targetDate}
                    </span>

                    {/* 문구 */}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-dark, #1E1E1E)', wordBreak: 'break-all' }}>
                      {item.message_text}
                    </span>
                  </div>

                  {/* 조작 버튼 그룹 */}
                  <div className="staff-item-row-actions">
                    <button
                      type="button"
                      className="btn-neo-sub"
                      aria-label={`${item.message_text} 예약 스케줄 수정`}
                      onClick={() => handleEditScheduleClick(item)}
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      aria-label={`${item.message_text} 예약 스케줄 ${item.isEnabled ? '비활성화' : '활성화'}`}
                      onClick={() => void toggleSchedule(item)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: item.isEnabled ? '#D6F5E3' : '#E0DCD3',
                        color: item.isEnabled ? '#1A7A3E' : 'var(--color-text-muted, #6B6354)',
                        border: '1.5px solid var(--color-border, #1E1E1E)',
                        fontSize: '12px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      {item.isEnabled ? 'ON 활성' : 'OFF 비활성'}
                    </button>

                    <button
                      type="button"
                      className="btn-neo-sub btn-neo-sub-danger"
                      aria-label={`${item.message_text} 예약 스케줄 삭제`}
                      onClick={() => void archiveSchedule(item)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. 미실행 예약 방송 알림 로그 */}
      <div
        style={{
          background: missedRuns.length > 0 ? '#FFF4F4' : '#FAFAFA',
          border: missedRuns.length > 0 ? '2px solid #E03131' : '2px solid #E5E0D5',
          borderRadius: '16px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px' }}>{missedRuns.length > 0 ? '⚠️' : '✅'}</span>
          <strong style={{ fontSize: '14px', color: missedRuns.length > 0 ? '#C92A2A' : 'var(--color-dark, #1E1E1E)' }}>
            미실행 예약 방송 기록
          </strong>
        </div>

        {missedRuns.length === 0 ? (
          <p style={{ margin: '8px 0 0 0', fontSize: '12.5px', color: 'var(--color-text-muted, #6B6354)', fontWeight: 600 }}>
            최근 미실행된 예약 방송이 없습니다. 모든 스케줄이 정상 작동 중입니다.
          </p>
        ) : (
          <ul style={{ margin: '10px 0 0', paddingLeft: '20px', fontSize: '13px', color: '#C92A2A', lineHeight: 1.6 }}>
            {missedRuns.map((run) => (
              <li key={run.id}>
                <strong>{new Date(run.triggered_at).toLocaleString('ko-KR')}</strong> · {run.message_text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 5. 프리셋 생성/수정 모달 */}
      {presetEditor && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSavingPreset) setPresetEditor(null);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
            background: 'rgba(30, 30, 30, 0.65)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="preset-editor-title"
            onSubmit={(event) => {
              event.preventDefault();
              void savePreset();
            }}
            style={{
              width: 'min(100%, 620px)',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              padding: '28px',
              background: '#FFFDF7',
              border: '3px solid var(--color-border, #1E1E1E)',
              borderRadius: '20px',
              boxShadow: '7px 7px 0 var(--color-border, #1E1E1E)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#7A5C00', marginBottom: '4px' }}>
                  TTS 안내 방송
                </div>
                <h2 id="preset-editor-title" style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
                  {presetEditor.id ? '안내 방송 프리셋 수정' : '새 안내 방송 프리셋'}
                </h2>
              </div>
              <button
                type="button"
                aria-label="프리셋 편집 닫기"
                onClick={() => setPresetEditor(null)}
                disabled={isSavingPreset}
                style={{
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  border: '2px solid var(--color-border, #1E1E1E)',
                  borderRadius: '50%',
                  background: '#FFF',
                  fontSize: '20px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <p style={{ margin: '12px 0 20px', color: '#625B50', fontSize: '13px', lineHeight: 1.55 }}>
              저장한 문구는 이 지점의 TTS 방송과 예약 방송에서 바로 사용할 수 있습니다.
            </p>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 900, marginBottom: '7px' }}>
              프리셋 이름
              <input
                autoFocus
                required
                maxLength={40}
                value={presetEditor.title}
                onChange={(event) => setPresetEditor({ ...presetEditor, title: event.target.value })}
                placeholder="예: 영업 마감 안내"
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  marginTop: '7px',
                  padding: '12px 14px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  borderRadius: '10px',
                  background: '#FFF',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              />
            </label>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 900, marginTop: '18px', marginBottom: '7px' }}>
              방송 문구
              <textarea
                required
                maxLength={1000}
                rows={6}
                value={presetEditor.message}
                onChange={(event) => setPresetEditor({ ...presetEditor, message: event.target.value })}
                placeholder="고객에게 들려줄 안내 문구를 입력하세요."
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  marginTop: '7px',
                  padding: '12px 14px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  borderRadius: '10px',
                  background: '#FFF',
                  resize: 'vertical',
                  fontSize: '14px',
                  lineHeight: 1.55,
                }}
              />
            </label>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '7px',
                color: 'var(--color-text-subtle, #8A8175)',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <span>문장이 길면 자연스러운 호흡을 위해 쉼표와 마침표를 넣어 주세요.</span>
              <span>{presetEditor.message.length} / 1000자</span>
            </div>

            {presetEditor.id && presetEditor.linkedScheduleCount > 0 && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '12px 14px',
                  border: '1.5px solid #D79000',
                  borderRadius: '10px',
                  background: 'var(--color-yellow-light, #FFF3C9)',
                  color: '#5A4300',
                  fontSize: '13px',
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                연결된 예약 방송 {presetEditor.linkedScheduleCount}건의 문구도 저장 즉시 함께 변경됩니다.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => void play(presetEditor.message)}
                disabled={!presetEditor.message.trim() || status === '재생 중' || isSavingPreset}
                style={{
                  padding: '10px 16px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  borderRadius: '10px',
                  background: '#FFF',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {status === '재생 중' ? '🔊 재생 중…' : '🔊 음성 미리 듣기'}
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPresetEditor(null)}
                  disabled={isSavingPreset}
                  style={{
                    padding: '10px 16px',
                    border: '2px solid var(--color-border, #1E1E1E)',
                    borderRadius: '10px',
                    background: '#FFF',
                    fontWeight: 900,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSavingPreset}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid var(--color-border, #1E1E1E)',
                    borderRadius: '10px',
                    background: 'var(--color-yellow, #FED943)',
                    fontWeight: 900,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0 var(--color-border, #1E1E1E)',
                  }}
                >
                  {isSavingPreset ? '저장 중…' : '프리셋 저장'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


