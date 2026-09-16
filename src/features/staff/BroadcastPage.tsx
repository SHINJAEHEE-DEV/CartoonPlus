import { FormEvent, useEffect, useState } from 'react';
import { speakKorean, stopKoreanSpeech } from '../../lib/broadcast';
import { type ScheduledBroadcast } from '../../lib/broadcastSchedule';
import { supabase } from '../../lib/supabase';
import { getKoreanFemaleVoices, notifyScheduleUpdated } from '../../lib/broadcastRunner';

type BroadcastPresetPreview = readonly [string, string, string, string?];

const initialPresets: BroadcastPresetPreview[] = [
  ['기본', '매장 이용 후 퇴실 시 사용하신 담요, 만화책, 식기 등을 모두 반납해 주시고 쓰레기는 쓰레기통에 버려 주시기 바랍니다.', '매장 이용 에티켓 및 기본 안내'],
  ['마감', '안내 말씀드립니다. 저희 매장 이용 시간은 11시까지입니다. 10시 50분부터 마감 준비를 하오니 사용하신 담요, 만화책, 식기 등을 반납하고 자리 정돈 부탁드립니다.', '영업 마감 15분 전 퇴실 준비 안내'],
  ['만석', '현재 만석으로 자리 이동이 제한됩니다. 퇴실 시 사용하신 담요, 만화책, 식기 등을 반납하고 자리 정돈 부탁드립니다.', '만석 및 자리 정돈 안내'],
  ['소음', '모든 고객님이 편안하게 이용하실 수 있도록 큰 소리는 삼가 주시고 자리 정돈 부탁드립니다.', '정숙 및 이어폰 착용 권장 안내'],
  ['신분증 검사', '잠시 후 10시부터 신분증 확인을 진행합니다. 계속 이용하실 고객님께서는 실물 신분증을 미리 준비해 주시기 바랍니다.', '오후 10시 이후 신분증 확인 안내'],
  ['음료 픽업 요청', '주문하신 음료가 카운터에 준비되어 있습니다. 카카오톡 알림을 확인해 주시기 바랍니다.', '제조 완료 음료 카운터 수령 안내'],
];

type StoredSchedule = ScheduledBroadcast & { id: string; message_text: string };
type FailedRun = { id: string; message_text: string; triggered_at: string };
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

export function BroadcastPage() {
  const [presets, setPresets] = useState(initialPresets);
  const [text, setText] = useState('');
  const [voiceNames, setVoiceNames] = useState<string[]>([]);
  const [voiceName, setVoiceName] = useState('');
  const [status, setStatus] = useState<'대기' | '재생 중' | '성공' | '실패'>('대기');
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<StoredSchedule[]>([]);
  const [schedule, setSchedule] = useState<ScheduleForm>(emptySchedule);
  const [scheduleStatus, setScheduleStatus] = useState('');
  const [failedRuns, setFailedRuns] = useState<FailedRun[]>([]);

  const recordRun = async (message: string, scheduledId?: string) => {
    if (!supabase) return;
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
  };

  const finishRun = async (id: string | undefined, success: boolean) => {
    if (id && supabase) {
      await supabase
        .from('broadcast_runs')
        .update(
          success
            ? { status: 'success' }
            : { status: 'failure', error_message: '브라우저 음성 재생 실패' }
        )
        .eq('id', id);
    }
  };

  const loadFailedRuns = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('broadcast_runs')
      .select('id, message_text, triggered_at')
      .eq('status', 'failure')
      .order('triggered_at', { ascending: false })
      .limit(10);
    setFailedRuns((data ?? []) as FailedRun[]);
  };

  const play = async (value: string, scheduledId?: string) => {
    setStatus('재생 중');
    setCurrentPlaying(value);
    const runId = await recordRun(value, scheduledId);
    try {
      await speakKorean(value, voiceName || undefined);
      await finishRun(runId, true);
      setStatus('성공');
      setCurrentPlaying(null);
      await loadFailedRuns();
    } catch {
      await finishRun(runId, false);
      setStatus('실패');
      setCurrentPlaying(null);
      await loadFailedRuns();
    }
  };

  const loadSchedules = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('scheduled_broadcasts')
      .select('id, message_text, schedule_type, target_time, target_days, target_date, is_enabled')
      .order('target_time');
    if (error) {
      setScheduleStatus(`예약을 불러오지 못했습니다: ${error.message}`);
      return;
    }
    setSchedules(
      (data ?? []).map((item) => ({
        id: item.id,
        message_text: item.message_text,
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
    const { data } = await supabase
      .from('broadcast_presets')
      .select('id, title, message_text')
      .eq('store_id', (await supabase.from('stores').select('id').eq('slug', 'snu').single()).data?.id ?? '')
      .order('created_at');
    if (data?.length) {
      setPresets(data.map((preset) => [preset.title, preset.message_text, '편집 가능한 TTS 프리셋', preset.id] as const));
    }
  };

  const editPreset = async (title: string, message: string) => {
    const nextTitle = window.prompt('프리셋 제목', title)?.trim();
    const nextMessage = window.prompt('방송 문구', message)?.trim();
    if (!nextTitle || !nextMessage || !supabase) return;
    const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
    if (!store) return;
    const { error } = await supabase
      .from('broadcast_presets')
      .update({ title: nextTitle, message_text: nextMessage })
      .eq('store_id', store.id)
      .eq('title', title);
    setScheduleStatus(error ? `프리셋을 수정하지 못했습니다: ${error.message}` : '프리셋을 수정했습니다.');
    if (!error) await loadPresets();
  };

  const deletePreset = async (title: string) => {
    if (!supabase || !window.confirm(`'${title}' 프리셋과 연결 예약을 삭제할까요?`)) return;
    const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
    if (!store) return;
    const { error } = await supabase
      .from('broadcast_presets')
      .delete()
      .eq('store_id', store.id)
      .eq('title', title);
    setScheduleStatus(error ? `프리셋을 삭제하지 못했습니다: ${error.message}` : '프리셋과 연결 예약을 삭제했습니다.');
    if (!error) {
      await loadPresets();
      await loadSchedules();
      notifyScheduleUpdated();
    }
  };

  const createPreset = async () => {
    if (!supabase) return;
    const title = window.prompt('새 프리셋 제목')?.trim();
    const message = window.prompt('방송 문구')?.trim();
    if (!title || !message) return;
    const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
    if (!store) return;
    const { error } = await supabase
      .from('broadcast_presets')
      .insert({ store_id: store.id, title, message_text: message });
    setScheduleStatus(error ? `프리셋을 추가하지 못했습니다: ${error.message}` : '프리셋을 추가했습니다.');
    if (!error) await loadPresets();
  };

  useEffect(() => {
    const setup = async () => {
      await loadSchedules();
      await loadPresets();
      void loadFailedRuns();
    };
    void setup();
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const refreshVoices = () => {
      const names = getKoreanFemaleVoices(window.speechSynthesis.getVoices()).map((voice) => voice.name);
      setVoiceNames(names);
      setVoiceName((current) => current || names[0] || '');
    };
    refreshVoices();
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices);
  }, []);

  const saveSchedule = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setScheduleStatus('Supabase 연결 설정이 필요합니다.');
      return;
    }
    setScheduleStatus('저장 중...');
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', 'snu')
      .single();
    if (storeError || !store) {
      setScheduleStatus('서울대입구역점 정보를 찾을 수 없습니다.');
      return;
    }
    const { error } = await supabase.from('scheduled_broadcasts').insert({
      store_id: store.id,
      message_text: schedule.message.trim(),
      broadcast_preset_id: schedule.presetId || null,
      schedule_type: schedule.type,
      target_time: schedule.time,
      target_days: schedule.type === 'weekdays' ? schedule.weekdays : null,
      target_date: schedule.type === 'once' ? schedule.date : null,
      is_enabled: true,
    });
    if (error) {
      setScheduleStatus(`저장하지 못했습니다: ${error.message}`);
      return;
    }
    setSchedule(emptySchedule);
    setScheduleStatus('예약 방송을 저장했습니다.');
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

  const changeTime = async (item: StoredSchedule, targetTime: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('scheduled_broadcasts')
      .update({ target_time: targetTime })
      .eq('id', item.id);
    setScheduleStatus(
      error ? `시간을 변경하지 못했습니다: ${error.message}` : '예약 시간을 변경했습니다.'
    );
    if (!error) {
      await loadSchedules();
      notifyScheduleUpdated();
    }
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

  const statusBg =
    status === '재생 중'
      ? '#FED943'
      : status === '성공'
        ? '#D6F5E3'
        : status === '실패'
          ? '#FFD4D4'
          : '#FFF9EC';
  const statusColor =
    status === '재생 중'
      ? '#1E1E1E'
      : status === '성공'
        ? '#1A7A3E'
        : status === '실패'
          ? '#C92A2A'
          : '#6B6354';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 헤더 및 실시간 상태 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div className="section-kicker">STORE BROADCAST CONSOLE</div>
          <h1 className="section-title">매장 안내 방송</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#6B6354', fontWeight: 600 }}>
            PC 브라우저를 열어 두면 등록된 스케줄에 맞춰 매장 스피커로 자동 송출됩니다.
          </p>
          <label style={{ display: 'block', marginTop: '10px', fontSize: '13px', fontWeight: 800 }}>
            여성 한국어 음성
            <select value={voiceName} onChange={(event) => setVoiceName(event.target.value)} style={{ marginLeft: '8px' }}>
              <option value="">이 PC 기본 한국어 음성 사용</option>
              {voiceNames.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {status === '재생 중' && (
            <button
              type="button"
              onClick={() => {
                stopKoreanSpeech();
                setStatus('대기');
                setCurrentPlaying(null);
              }}
            >
              방송 중지
            </button>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: statusBg,
              border: '2px solid #1E1E1E',
              fontWeight: 800,
              fontSize: '13px',
              color: statusColor,
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: status === '재생 중' ? '#E65100' : statusColor,
                display: 'inline-block',
              }}
            />
            {status === '재생 중'
              ? `송출 중: ${currentPlaying ?? '음성'}`
              : `방송 시스템 상태: ${status}`}
          </div>
        </div>
      </div>

      {/* 안내 팁 박스 */}
      <div
        style={{
          background: '#FFF3C9',
          border: '2.5px solid #1E1E1E',
          borderRadius: '16px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '3px 3px 0 #1E1E1E',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#3D3528', lineHeight: 1.5 }}>
          <strong>운영 가이드:</strong> 카운터 PC에서 브라우저 볼륨을 매장 앰프에 맞추고 탭을 유지해
          주세요. 백그라운드 탭에서도 15초 주기로 스케줄을 감지하여 자동 송출합니다.
        </div>
      </div>

      {/* 2열 그리드: 자주 쓰는 녹음 방송 & 직접 TTS 송출 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
        }}
      >
        {/* 1. 자주 쓰는 원클릭 녹음 방송 */}
        <div
          style={{
            background: '#ffffff',
            border: '3px solid #1E1E1E',
            borderRadius: '22px',
            padding: '24px',
            boxShadow: '4px 4px 0 #1E1E1E',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 900 }}>📻 원클릭 정규 안내 방송</div>
            <button type="button" onClick={() => void createPreset()}>+ 프리셋 추가</button>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>
              편집 가능한 TTS 프리셋
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
            }}
          >
            {presets.map(([title, message, desc]) => (
              <div
                key={title}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '14px',
                  background: '#FFF9EC',
                  border: '2px solid #1E1E1E',
                  borderRadius: '14px',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  opacity: status === '재생 중' ? 0.6 : 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#1E1E1E' }}>
                    {title}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" onClick={() => void play(message)} disabled={status === '재생 중'}>재생</button>
                    <button type="button" onClick={() => void editPreset(title, message)}>수정</button>
                    <button type="button" onClick={() => void deletePreset(title)}>삭제</button>
                  </div>
                </div>
                <span
                  style={{ fontSize: '11px', color: '#8A8175', fontWeight: 600, lineHeight: 1.3 }}
                >
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 직접 TTS 입력 방송 */}
        <div
          style={{
            background: '#ffffff',
            border: '3px solid #1E1E1E',
            borderRadius: '22px',
            padding: '24px',
            boxShadow: '4px 4px 0 #1E1E1E',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 900 }}>실시간 커스텀 TTS 방송</div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>
              한국어 음성 합성
            </span>
          </div>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="매장에 즉시 방송할 멘트를 입력하세요. (예: 12번 테이블 주문하신 라면 나왔습니다.)"
            rows={4}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: '2px solid #1E1E1E',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              background: '#FAFAFA',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#8A8175' }}>
              {text.length}자 입력됨
            </span>
            <button
              onClick={() => void play(text)}
              disabled={!text.trim() || status === '재생 중'}
              style={{
                padding: '10px 22px',
                borderRadius: '12px',
                background: text.trim() ? '#FED943' : '#E0DCD3',
                color: '#1E1E1E',
                border: '2.5px solid #1E1E1E',
                fontWeight: 900,
                fontSize: '14px',
                cursor: text.trim() && status !== '재생 중' ? 'pointer' : 'not-allowed',
                boxShadow: text.trim() ? '3px 3px 0 #1E1E1E' : 'none',
              }}
            >
              매장 전체 즉시 송출
            </button>
          </div>
        </div>
      </div>

      {/* 3. 예약 방송 스케줄러 & 등록 폼 */}
      <div
        style={{
          background: '#ffffff',
          border: '3px solid #1E1E1E',
          borderRadius: '22px',
          padding: '24px',
          boxShadow: '4px 4px 0 #1E1E1E',
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
            <div style={{ fontSize: '18px', fontWeight: 900 }}>⏰ 자동 예약 방송 스케줄러</div>
            <div style={{ fontSize: '13px', color: '#6B6354', fontWeight: 600, marginTop: '2px' }}>
              매일 반복되거나 특정 요일/날짜에 송출할 방송 일정을 등록하고 관리합니다.
            </div>
          </div>
          {scheduleStatus && (
            <span
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                background: '#FFF3C9',
                border: '2px solid #1E1E1E',
                fontSize: '12px',
                fontWeight: 800,
              }}
            >
              {scheduleStatus}
            </span>
          )}
        </div>

        {/* 신규 예약 등록 폼 */}
        <form
          onSubmit={(event) => void saveSchedule(event)}
          style={{
            background: '#FFF9EC',
            border: '2.5px solid #1E1E1E',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 900, color: '#1E1E1E' }}>
            + 새 스케줄 등록
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <div>
              <label
                style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}
              >
                반복 방식
              </label>
              <select
                value={schedule.type}
                onChange={(event) =>
                  setSchedule({ ...schedule, type: event.target.value as typeof schedule.type })
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '2px solid #1E1E1E',
                  fontWeight: 800,
                  fontSize: '13px',
                }}
              >
                <option value="daily">매일 반복</option>
                <option value="weekdays">특정 요일 반복</option>
                <option value="once">지정일 1회</option>
              </select>
            </div>

            <div>
              <label
                style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}
              >
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
                  border: '2px solid #1E1E1E',
                  fontWeight: 800,
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {schedule.type === 'once' && (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 800,
                    marginBottom: '4px',
                  }}
                >
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
                    border: '2px solid #1E1E1E',
                    fontWeight: 800,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
          </div>

          {schedule.type === 'weekdays' && (
            <div>
              <label
                style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}
              >
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
                        borderRadius: '999px',
                        border: '2px solid #1E1E1E',
                        background: checked ? '#FED943' : '#FFFFFF',
                        fontWeight: 900,
                        fontSize: '12px',
                        cursor: 'pointer',
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
            <label
              style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}
            >
              방송 문구 (프리셋 이름 또는 TTS 전문)
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                aria-label="프리셋 선택"
                value={schedule.presetId}
                onChange={(event) => {
                  const preset = presets.find(([, , , id]) => id === event.target.value);
                  if (preset) setSchedule({ ...schedule, presetId: event.target.value, message: preset[1] });
                }}
              >
                <option value="">프리셋 선택</option>
                {presets.map(([title, , , id]) => <option key={id ?? title} value={id ?? ''}>{title}</option>)}
              </select>
              <input
                required
                value={schedule.message}
                onChange={(event) => setSchedule({ ...schedule, message: event.target.value })}
                placeholder="예: 마감 (프리셋) 또는 매장 내 정숙 부탁드립니다."
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '2px solid #1E1E1E',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: '#1E1E1E',
                  color: '#FED943',
                  border: '2px solid #1E1E1E',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                스케줄 등록 +
              </button>
            </div>
          </div>
        </form>

        {/* 저장된 예약 목록 타임라인 */}
        <div>
          <div style={{ fontSize: '15px', fontWeight: 900, marginBottom: '12px' }}>
            등록된 방송 스케줄 ({schedules.length}건)
          </div>

          {schedules.length === 0 ? (
            <div
              style={{
                padding: '24px',
                background: '#FAF9F6',
                border: '2px dashed #D3CEC4',
                borderRadius: '14px',
                textAlign: 'center',
                color: '#8A8175',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              등록된 예약 방송 스케줄이 없습니다.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {schedules.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    padding: '14px 18px',
                    background: item.isEnabled ? '#FFFFFF' : '#F5F3EF',
                    border: '2px solid #1E1E1E',
                    borderRadius: '14px',
                    opacity: item.isEnabled ? 1 : 0.65,
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}
                  >
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: '#1E1E1E',
                        color: '#FED943',
                        fontSize: '13px',
                        fontWeight: 900,
                        fontFamily: 'monospace',
                      }}
                    >
                      {item.targetTime}
                    </div>

                    <input
                      aria-label={`${item.message_text} 예약 시간`}
                      type="time"
                      defaultValue={item.targetTime}
                      onBlur={(event) => void changeTime(item, event.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '12px',
                        fontWeight: 800,
                      }}
                    />

                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#FFF3C9',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '11px',
                        fontWeight: 900,
                      }}
                    >
                      {item.scheduleType === 'daily'
                        ? '매일'
                        : item.scheduleType === 'weekdays'
                          ? item.targetDays?.map((d) => dayLabels[d]).join(', ')
                          : item.targetDate}
                    </span>

                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E1E1E' }}>
                      {item.message_text}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => void toggleSchedule(item)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: item.isEnabled ? '#D6F5E3' : '#E0DCD3',
                        color: item.isEnabled ? '#1A7A3E' : '#6B6354',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '12px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      {item.isEnabled ? '활성 (ON)' : '비활성 (OFF)'}
                    </button>
                    <button
                      onClick={() => void archiveSchedule(item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#FFF',
                        color: '#C92A2A',
                        border: '1.5px solid #1E1E1E',
                        fontSize: '12px',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
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

      {/* 4. 실패 이력 & 재시도 큐 */}
      <div
        style={{
          background: '#ffffff',
          border: '3px solid #1E1E1E',
          borderRadius: '22px',
          padding: '24px',
          boxShadow: '4px 4px 0 #1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 900 }}>최근 송출 실패 로그 (최근 10건)</div>
          <button
            onClick={() => void loadFailedRuns()}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1.5px solid #1E1E1E',
              background: '#FFF9EC',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            새로고침 ⟳
          </button>
        </div>

        {failedRuns.length === 0 ? (
          <div style={{ fontSize: '13px', color: '#1A7A3E', fontWeight: 700 }}>
            최근 실패한 방송 기록이 없습니다. 정상 운영 중입니다.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {failedRuns.map((run) => (
              <div
                key={run.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#FFF4F4',
                  border: '1.5px solid #E03131',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#C92A2A',
                      fontWeight: 800,
                      marginRight: '8px',
                    }}
                  >
                    [실패]
                  </span>
                  <strong style={{ fontSize: '13px', color: '#1E1E1E' }}>{run.message_text}</strong>
                  <span style={{ fontSize: '11px', color: '#8A8175', marginLeft: '10px' }}>
                    {new Date(run.triggered_at).toLocaleTimeString('ko-KR')}
                  </span>
                </div>
                <button
                  onClick={() => void play(run.message_text)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: '#FED943',
                    border: '1.5px solid #1E1E1E',
                    fontSize: '11px',
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  재시도 ↺
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
