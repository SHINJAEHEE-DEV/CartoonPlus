import { FormEvent, useEffect, useRef, useState } from 'react';
import { type ScheduledBroadcast } from '../../lib/broadcastSchedule';
import { supabase } from '../../lib/supabase';
import { notifyScheduleUpdated } from '../../lib/broadcastRunner';
import { useSelectedStaffStoreId } from './StaffStoreContext';
import {
  DEFAULT_STATIC_PRESETS,
  MAX_UPLOAD_PRESETS_PER_STORE,
  type BroadcastPresetItem,
  canRegisterUploadedPreset,
  deleteVoiceAssetFromStorage,
  playVoiceAsset,
  stopVoiceAsset,
  uploadVoiceAsset,
  validateVoiceAssetUpload,
} from '../../lib/voiceAssets';

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
  const storeId = useSelectedStaffStoreId();
  const [staticPresets, setStaticPresets] = useState<BroadcastPresetItem[]>([...DEFAULT_STATIC_PRESETS]);
  const [uploadedPresets, setUploadedPresets] = useState<BroadcastPresetItem[]>([]);
  const [status, setStatus] = useState<'대기' | '재생 중' | '성공' | '실패'>('대기');
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  // 예약 방송 스케줄 상태
  const [schedules, setSchedules] = useState<StoredSchedule[]>([]);
  const [schedule, setSchedule] = useState<ScheduleForm>(emptySchedule);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [scheduleStatus, setScheduleStatus] = useState('');
  const [missedRuns, setMissedRuns] = useState<MissedRun[]>([]);

  // 모달 상태: 업로드 & 제목 수정
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [editTitleModal, setEditTitleModal] = useState<{ id?: string; title: string; source_type: 'static' | 'upload' } | null>(null);
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  const scheduleFormRef = useRef<HTMLFormElement>(null);
  const scheduleTypeSelectRef = useRef<HTMLSelectElement>(null);

  const recordRun = async (message: string, scheduledId?: string) => {
    if (!supabase || !storeId) return;
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
        .update(status === 'failure' ? { status, error_message: 'MP3 방송 재생 실패' } : { status })
        .eq('id', id);
    }
  };

  const play = async (preset: BroadcastPresetItem, scheduledId?: string) => {
    if (!preset.audio_url) {
      setScheduleStatus('재생할 MP3 오디오가 없습니다.');
      return;
    }
    setStatus('재생 중');
    setCurrentPlaying(preset.title);
    const runId = await recordRun(preset.title, scheduledId);
    try {
      await playVoiceAsset(preset.audio_url);
      await finishRun(runId, 'success');
      setStatus('성공');
      setCurrentPlaying(null);
    } catch (error) {
      await finishRun(runId, 'failure');
      setStatus('실패');
      setCurrentPlaying(null);
      setScheduleStatus(`방송 재생 실패: ${formatError(error)}`);
    }
  };

  const handleStopBroadcast = () => {
    stopVoiceAsset();
    setStatus('대기');
    setCurrentPlaying(null);
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
    if (!supabase || !storeId) return;
    const { data, error } = await supabase
      .from('broadcast_presets')
      .select('id, store_id, title, message_text, audio_url, source_type, hidden_at')
      .or(`store_id.eq.${storeId},source_type.eq.static`)
      .order('created_at', { ascending: true });

    if (error) {
      setScheduleStatus(`프리셋을 불러오지 못했습니다: ${error.message}`);
      return;
    }

    const dbPresets = (data ?? []) as BroadcastPresetItem[];
    const mergedStatic: BroadcastPresetItem[] = DEFAULT_STATIC_PRESETS.map((def) => {
      const found = dbPresets.find((p) => p.source_type === 'static' && p.title === def.title);
      if (found) {
        return {
          ...def,
          id: found.id,
          hidden_at: found.hidden_at,
          audio_url: found.audio_url || def.audio_url,
        };
      }
      return def;
    });

    const uploaded: BroadcastPresetItem[] = dbPresets.filter(
      (p) => p.source_type === 'upload' && p.store_id === storeId
    );

    setStaticPresets(mergedStatic);
    setUploadedPresets(uploaded);
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

  const toggleStaticPresetHidden = async (preset: BroadcastPresetItem) => {
    if (!supabase || !storeId) return;
    const nextHiddenAt = preset.hidden_at ? null : new Date().toISOString();
    try {
      if (preset.id) {
        const { error } = await supabase
          .from('broadcast_presets')
          .update({ hidden_at: nextHiddenAt })
          .eq('id', preset.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('broadcast_presets').insert({
          store_id: storeId,
          title: preset.title,
          message_text: preset.message_text,
          audio_url: preset.audio_url,
          source_type: 'static',
          hidden_at: nextHiddenAt,
        });
        if (error) throw error;
      }
      setScheduleStatus(nextHiddenAt ? `'${preset.title}' 프리셋을 숨겼습니다.` : `'${preset.title}' 프리셋을 복구했습니다.`);
      await loadPresets();
    } catch (err) {
      setScheduleStatus(`프리셋 숨김/복구 실패: ${formatError(err)}`);
    }
  };

  const handleUploadPreset = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadFile) {
      setUploadError('프리셋 제목과 MP3 파일을 모두 지정해 주세요.');
      return;
    }
    if (!storeId) {
      setUploadError('지점 정보를 찾을 수 없습니다.');
      return;
    }
    if (!canRegisterUploadedPreset(uploadedPresets.length)) {
      setUploadError(`지점별 활성 업로드 프리셋은 최대 ${MAX_UPLOAD_PRESETS_PER_STORE}개까지 등록할 수 있습니다.`);
      return;
    }
    const validationError = validateVoiceAssetUpload(uploadFile);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      if (!supabase) throw new Error('Supabase 클라이언트를 찾을 수 없습니다.');
      const { url } = await uploadVoiceAsset(storeId, uploadFile);
      const { error } = await supabase.from('broadcast_presets').insert({
        store_id: storeId,
        title: uploadTitle.trim(),
        audio_url: url,
        source_type: 'upload',
      });
      if (error) throw error;

      setScheduleStatus(`'${uploadTitle.trim()}' MP3 프리셋이 성공적으로 등록되었습니다.`);
      setUploadModalOpen(false);
      setUploadTitle('');
      setUploadFile(null);
      await loadPresets();
    } catch (err) {
      setUploadError(`업로드 실패: ${formatError(err)}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveTitle = async (e: FormEvent) => {
    e.preventDefault();
    if (!editTitleModal || !supabase || isSavingTitle) return;
    const nextTitle = editTitleModal.title.trim();
    if (!nextTitle) return;

    setIsSavingTitle(true);
    try {
      if (editTitleModal.id) {
        const { error } = await supabase
          .from('broadcast_presets')
          .update({ title: nextTitle })
          .eq('id', editTitleModal.id);
        if (error) throw error;
      }
      setScheduleStatus('프리셋 제목을 수정했습니다.');
      setEditTitleModal(null);
      await loadPresets();
    } catch (err) {
      setScheduleStatus(`제목 수정 실패: ${formatError(err)}`);
    } finally {
      setIsSavingTitle(false);
    }
  };

  const deleteUploadedPreset = async (preset: BroadcastPresetItem) => {
    if (!supabase || !preset.id) return;
    if (!window.confirm(`'${preset.title}' 업로드 프리셋과 MP3 원본 파일, 연결된 예약 방송을 모두 삭제할까요?`)) {
      return;
    }
    try {
      if (preset.audio_url) {
        await deleteVoiceAssetFromStorage(preset.audio_url);
      }
      await supabase.from('scheduled_broadcasts').delete().eq('broadcast_preset_id', preset.id);
      const { error } = await supabase.from('broadcast_presets').delete().eq('id', preset.id);
      if (error) throw error;

      setScheduleStatus(`'${preset.title}' 프리셋과 Storage 원본을 삭제했습니다.`);
      await loadPresets();
      await loadSchedules();
      notifyScheduleUpdated();
    } catch (err) {
      setScheduleStatus(`프리셋 삭제 실패: ${formatError(err)}`);
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
      broadcast_preset_id: schedule.presetId || null,
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

  const allAvailablePresets = [
    ...staticPresets.filter((p) => !p.hidden_at),
    ...uploadedPresets.filter((p) => !p.hidden_at),
  ];

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
                onClick={handleStopBroadcast}
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
                ? `송출 중: ${currentPlaying ?? 'MP3 음성'}`
                : `방송 상태: ${status}`}
            </div>
          </div>
        </div>

        {/* 가이드 바 */}
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
            <span style={{ color: 'var(--color-yellow, #FED943)' }}>💡</span> 카운터 PC 탭을 열어 두시면 백그라운드에서도 고품질 MP3 예약 방송이 자동 송출됩니다.
          </div>
        </div>
      </div>

      {/* 2. 안내 방송 프리셋 관리 (정적 기본 + 지점 업로드) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 2-1. 정적 기본 안내 방송 */}
        <div className="staff-section-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
                📻 기본 정적 안내 방송 (6종)
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted, #6B6354)', fontWeight: 600 }}>
                표준 검수된 기본 안내 음성을 즉시 송출하거나 필요에 따라 숨김 처리할 수 있습니다.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '12px',
            }}
          >
            {staticPresets.map((preset) => {
              const isPlayingThis = currentPlaying === preset.title;
              const isHidden = Boolean(preset.hidden_at);
              return (
                <div
                  key={preset.title}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '14px 16px',
                    background: isHidden
                      ? '#F0EDE6'
                      : isPlayingThis
                      ? 'var(--color-yellow-light, #FFF3C9)'
                      : 'var(--color-panel-cream, #FFF9EC)',
                    border: isPlayingThis ? '2.5px solid #E65100' : '2px solid var(--color-border, #1E1E1E)',
                    borderRadius: '16px',
                    opacity: isHidden ? 0.6 : 1,
                    boxShadow: isPlayingThis ? '3px 3px 0 #E65100' : '3px 3px 0 var(--color-border, #1E1E1E)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
                        {preset.title}
                      </span>
                      <button
                        type="button"
                        className="btn-neo-sub"
                        aria-label={`${preset.title} 프리셋 ${isHidden ? '복구' : '숨김'}`}
                        onClick={() => void toggleStaticPresetHidden(preset)}
                      >
                        {isHidden ? '복구' : '숨김'}
                      </button>
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
                      {preset.message_text}
                    </p>
                  </div>

                  {!isHidden && (
                    <button
                      type="button"
                      aria-label={`${preset.title} 안내 즉시 방송`}
                      onClick={() => void play(preset)}
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
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-2. 지점 업로드 안내 방송 (최대 10개) */}
        <div className="staff-section-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '17px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
                  🎙️ 지점 업로드 안내 방송
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill, 999px)',
                    background: uploadedPresets.length >= MAX_UPLOAD_PRESETS_PER_STORE ? '#FFA8A8' : '#FFF3C9',
                    border: '1.5px solid var(--color-border, #1E1E1E)',
                  }}
                >
                  {uploadedPresets.length} / {MAX_UPLOAD_PRESETS_PER_STORE}개
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted, #6B6354)', fontWeight: 600 }}>
                매장에서 직접 제작한 MP3 안내 음성을 등록하고 송출합니다. (3MB 이하 MP3)
              </div>
            </div>

            <button
              type="button"
              disabled={!canRegisterUploadedPreset(uploadedPresets.length)}
              onClick={() => {
                setUploadError(null);
                setUploadTitle('');
                setUploadFile(null);
                setUploadModalOpen(true);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: canRegisterUploadedPreset(uploadedPresets.length) ? 'var(--color-yellow, #FED943)' : '#E0DCD3',
                border: '2px solid var(--color-border, #1E1E1E)',
                fontSize: '12.5px',
                fontWeight: 900,
                color: 'var(--color-dark, #1E1E1E)',
                cursor: canRegisterUploadedPreset(uploadedPresets.length) ? 'pointer' : 'not-allowed',
                boxShadow: canRegisterUploadedPreset(uploadedPresets.length) ? '2px 2px 0 var(--color-border, #1E1E1E)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              + 새 MP3 프리셋 업로드
            </button>
          </div>

          {uploadedPresets.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#8A8175', fontSize: '13px', fontWeight: 600 }}>
              등록된 지점 업로드 프리셋이 없습니다. (+ 새 MP3 프리셋 업로드 버튼을 눌러 등록하세요.)
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {uploadedPresets.map((preset) => {
                const isPlayingThis = currentPlaying === preset.title;
                return (
                  <div
                    key={preset.id ?? preset.title}
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
                          {preset.title}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            className="btn-neo-sub"
                            aria-label={`${preset.title} 제목 수정`}
                            onClick={() => setEditTitleModal({ id: preset.id, title: preset.title, source_type: 'upload' })}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            className="btn-neo-sub btn-neo-sub-danger"
                            aria-label={`${preset.title} 삭제`}
                            onClick={() => void deleteUploadedPreset(preset)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#8A8175', fontWeight: 700 }}>
                        📁 사용자 업로드 MP3
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label={`${preset.title} 안내 즉시 방송`}
                      onClick={() => void play(preset)}
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
          )}
        </div>
      </div>

      {/* 3. 예약 방송 스케줄러 & 등록 폼 */}
      <div className="staff-section-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
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

        {/* 스케줄 등록/수정 폼 */}
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
              <label htmlFor="schedule-preset-select" style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
                방송 프리셋 선택
              </label>
              <select
                id="schedule-preset-select"
                aria-label="방송 프리셋 선택"
                value={schedule.presetId}
                onChange={(event) => {
                  const selectedId = event.target.value;
                  const selected = allAvailablePresets.find((p) => p.id === selectedId || p.title === selectedId);
                  setSchedule({
                    ...schedule,
                    presetId: selectedId,
                    message: selected?.title ?? schedule.message,
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  background: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 700,
                }}
              >
                <option value="">프리셋을 선택하세요</option>
                {allAvailablePresets.map((p) => (
                  <option key={p.id ?? p.title} value={p.id ?? p.title}>
                    [{p.source_type === 'static' ? '기본' : '업로드'}] {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="schedule-type-select" style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
                반복 방식
              </label>
              <select
                id="schedule-type-select"
                aria-label="반복 방식"
                ref={scheduleTypeSelectRef}
                value={schedule.type}
                onChange={(event) =>
                  setSchedule({
                    ...schedule,
                    type: event.target.value as ScheduledBroadcast['scheduleType'],
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  background: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 700,
                }}
              >
                <option value="daily">매일 반복</option>
                <option value="weekdays">특정 요일 반복</option>
                <option value="once">지정일 1회 송출</option>
              </select>
            </div>

            <div>
              <label htmlFor="schedule-time-input" style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
                송출 시간
              </label>
              <input
                id="schedule-time-input"
                aria-label="송출 시간"
                type="time"
                required
                value={schedule.time}
                onChange={(event) => setSchedule({ ...schedule, time: event.target.value })}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  background: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 700,
                }}
              />
            </div>
          </div>

          {schedule.type === 'weekdays' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '8px' }}>
                송출 요일 선택
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Object.entries(dayLabels).map(([key, label]) => {
                  const isChecked = schedule.weekdays.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        const nextDays = isChecked
                          ? schedule.weekdays.filter((d) => d !== key)
                          : [...schedule.weekdays, key];
                        setSchedule({ ...schedule, weekdays: nextDays });
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '2px solid var(--color-border, #1E1E1E)',
                        background: isChecked ? 'var(--color-yellow, #FED943)' : '#FFFFFF',
                        fontWeight: 900,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {label}요일
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {schedule.type === 'once' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
                송출 일자
              </label>
              <input
                type="date"
                required
                value={schedule.date}
                onChange={(event) => setSchedule({ ...schedule, date: event.target.value })}
                style={{
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  background: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 700,
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="submit"
              disabled={!schedule.message.trim()}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: schedule.message.trim() ? 'var(--color-yellow, #FED943)' : '#E0DCD3',
                border: '2px solid var(--color-border, #1E1E1E)',
                fontWeight: 900,
                fontSize: '13px',
                cursor: schedule.message.trim() ? 'pointer' : 'not-allowed',
                boxShadow: schedule.message.trim() ? '2px 2px 0 var(--color-border, #1E1E1E)' : 'none',
              }}
            >
              {editingScheduleId ? '수정 완료' : '스케줄 저장'}
            </button>
          </div>
        </form>

        {/* 등록된 스케줄 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
            등록된 자동 방송 목록 ({schedules.length}건)
          </div>
          {schedules.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#8A8175', fontSize: '13px' }}>
              등록된 예약 방송이 없습니다.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {schedules.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--color-border, #1E1E1E)',
                    background: item.isEnabled ? '#FFFFFF' : '#F5F2EB',
                    opacity: item.isEnabled ? 1 : 0.6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-dark, #1E1E1E)' }}>
                      ⏰ {item.targetTime}
                    </span>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--color-dark, #1E1E1E)' }}>
                        {item.message_text}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#8A8175', fontWeight: 600 }}>
                        {item.scheduleType === 'daily' && '매일 반복'}
                        {item.scheduleType === 'weekdays' && `매주 (${item.targetDays?.map((d) => dayLabels[d] || d).join(', ')})`}
                        {item.scheduleType === 'once' && `지정일: ${item.targetDate}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      className="btn-neo-sub"
                      onClick={() => void toggleSchedule(item)}
                    >
                      {item.isEnabled ? '켜짐' : '꺼짐'}
                    </button>
                    <button
                      type="button"
                      className="btn-neo-sub"
                      onClick={() => handleEditScheduleClick(item)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="btn-neo-sub btn-neo-sub-danger"
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

      {/* 4. 최근 미실행 기록 */}
      <div
        className="staff-section-card"
        style={{
          background: missedRuns.length > 0 ? '#FFF5F5' : '#FAF8F5',
          border: `2px solid ${missedRuns.length > 0 ? '#FFA8A8' : 'var(--color-border, #1E1E1E)'}`,
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

      {/* 5. 새 MP3 프리셋 업로드 모달 */}
      {uploadModalOpen && (
        <div
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isUploading) setUploadModalOpen(false);
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
            aria-labelledby="upload-modal-title"
            onSubmit={(e) => void handleUploadPreset(e)}
            style={{
              width: 'min(100%, 540px)',
              padding: '28px',
              background: '#FFFDF7',
              border: '3px solid var(--color-border, #1E1E1E)',
              borderRadius: '20px',
              boxShadow: '7px 7px 0 var(--color-border, #1E1E1E)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 id="upload-modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: 900 }}>
                새 MP3 방송 프리셋 등록
              </h2>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                disabled={isUploading}
                style={{
                  width: '32px',
                  height: '32px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  borderRadius: '50%',
                  background: '#FFF',
                  cursor: 'pointer',
                  fontWeight: 900,
                }}
              >
                ×
              </button>
            </div>

            {uploadError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#FFE3E3', color: '#C92A2A', fontSize: '13px', fontWeight: 700 }}>
                {uploadError}
              </div>
            )}

            <div>
              <label htmlFor="upload-preset-title" style={{ display: 'block', fontSize: '13px', fontWeight: 900, marginBottom: '6px' }}>
                프리셋 제목
              </label>
              <input
                id="upload-preset-title"
                required
                maxLength={40}
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="예: 주말 특별 이벤트 안내"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  background: '#FFF',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              />
            </div>

            <div>
              <label htmlFor="upload-preset-file" style={{ display: 'block', fontSize: '13px', fontWeight: 900, marginBottom: '6px' }}>
                MP3 음성 파일 (최대 3MB)
              </label>
              <input
                id="upload-preset-file"
                type="file"
                required
                accept=".mp3,audio/mpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setUploadFile(file);
                }}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  background: '#FFF',
                  fontSize: '13px',
                }}
              />
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8A8175' }}>
                * 업로드된 음성 파일은 Supabase Storage에 보관되며 모든 카운터 PC에서 재생됩니다.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                disabled={isUploading}
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
                disabled={isUploading}
                style={{
                  padding: '10px 20px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  borderRadius: '10px',
                  background: 'var(--color-yellow, #FED943)',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  boxShadow: '2px 2px 0 var(--color-border, #1E1E1E)',
                }}
              >
                {isUploading ? '업로드 중...' : '업로드 및 저장'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. 프리셋 제목 수정 모달 */}
      {editTitleModal && (
        <div
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSavingTitle) setEditTitleModal(null);
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
            aria-labelledby="edit-title-modal-title"
            onSubmit={(e) => void handleSaveTitle(e)}
            style={{
              width: 'min(100%, 480px)',
              padding: '24px',
              background: '#FFFDF7',
              border: '3px solid var(--color-border, #1E1E1E)',
              borderRadius: '20px',
              boxShadow: '7px 7px 0 var(--color-border, #1E1E1E)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h2 id="edit-title-modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>
              프리셋 제목 수정
            </h2>

            <div>
              <label htmlFor="edit-preset-title" style={{ display: 'block', fontSize: '13px', fontWeight: 900, marginBottom: '6px' }}>
                프리셋 제목
              </label>
              <input
                id="edit-preset-title"
                required
                maxLength={40}
                value={editTitleModal.title}
                onChange={(e) => setEditTitleModal({ ...editTitleModal, title: e.target.value })}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  background: '#FFF',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              />
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8A8175' }}>
                * 음성 MP3 파일은 교체되지 않으며 제목만 수정됩니다.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setEditTitleModal(null)}
                disabled={isSavingTitle}
                style={{
                  padding: '9px 16px',
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
                disabled={isSavingTitle}
                style={{
                  padding: '9px 20px',
                  border: '2px solid var(--color-border, #1E1E1E)',
                  borderRadius: '10px',
                  background: 'var(--color-yellow, #FED943)',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: isSavingTitle ? 'not-allowed' : 'pointer',
                  boxShadow: '2px 2px 0 var(--color-border, #1E1E1E)',
                }}
              >
                {isSavingTitle ? '저장 중...' : '제목 변경'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
