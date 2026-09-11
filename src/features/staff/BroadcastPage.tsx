import { FormEvent, useEffect, useState } from 'react';
import { speakKorean } from '../../lib/broadcast';
import { type ScheduledBroadcast } from '../../lib/broadcastSchedule';
import { supabase } from '../../lib/supabase';
import { notifyScheduleUpdated } from '../../lib/broadcastRunner';

const presets = [
  ['기본', '/audio/기본.mp3', '매장 이용 에티켓 및 기본 안내'],
  ['마감', '/audio/마감.mp3', '영업 마감 15분 전 퇴실 준비 안내'],
  ['만석', '/audio/만석.mp3', '만석 및 대기 번호표 접수 안내'],
  ['소음', '/audio/소음.mp3', '정숙 및 이어폰 착용 권장 안내'],
  ['신분증 검사', '/audio/신분증검사.mp3', '오후 10시 이후 청소년 퇴실/신분증 확인'],
  ['음료 픽업 요청', '/audio/음료픽업요청.mp3', '제조 완료 음료 카운터 수령 안내'],
] as const;

const timedPresets = [
  { message_text: '기본', target_time: '14:00' },
  { message_text: '신분증 검사', target_time: '21:45' },
  { message_text: '마감', target_time: '22:45' },
];

type StoredSchedule = ScheduledBroadcast & { id: string; message_text: string };
type FailedRun = { id: string; message_text: string; triggered_at: string };
type ScheduleForm = { message: string; type: ScheduledBroadcast['scheduleType']; time: string; date: string; weekdays: string[] };

const emptySchedule: ScheduleForm = {
  message: '',
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
  const [text, setText] = useState('');
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
      .insert({ scheduled_broadcast_id: scheduledId ?? null, message_text: message, status: 'pending' })
      .select('id')
      .single();
    return data?.id as string | undefined;
  };

  const finishRun = async (id: string | undefined, success: boolean) => {
    if (id && supabase) {
      await supabase
        .from('broadcast_runs')
        .update(success ? { status: 'success' } : { status: 'failure', error_message: '브라우저 음성 재생 실패' })
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
      await speakKorean(value);
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

  const playAudio = async (src: string, title: string, scheduledId?: string) => {
    setStatus('재생 중');
    setCurrentPlaying(title);
    const runId = await recordRun(title, scheduledId);
    try {
      const audio = new Audio(`${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`);
      await audio.play();
      audio.onended = () => {
        void finishRun(runId, true);
        setStatus('성공');
        setCurrentPlaying(null);
      };
      audio.onerror = () => {
        void finishRun(runId, false);
        void loadFailedRuns();
        setStatus('실패');
        setCurrentPlaying(null);
      };
    } catch {
      await finishRun(runId, false);
      await loadFailedRuns();
      setStatus('실패');
      setCurrentPlaying(null);
    }
  };

  const loadSchedules = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('scheduled_broadcasts')
      .select('id, message_text, schedule_type, target_time, target_days, target_date, is_enabled')
      .is('archived_at', null)
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

  useEffect(() => {
    const setup = async () => {
      if (!supabase) return;
      const { data: store } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
      const { data: existing } = await supabase.from('scheduled_broadcasts').select('message_text');
      const missing = timedPresets.filter((p) => !(existing ?? []).some((item) => item.message_text === p.message_text));
      if (store && missing.length) {
        await supabase
          .from('scheduled_broadcasts')
          .insert(missing.map((item) => ({ ...item, store_id: store.id, schedule_type: 'daily', is_enabled: true })));
        notifyScheduleUpdated();
      }
      await loadSchedules();
      void loadFailedRuns();
    };
    void setup();
  }, []);

  const saveSchedule = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setScheduleStatus('Supabase 연결 설정이 필요합니다.');
      return;
    }
    setScheduleStatus('저장 중...');
    const { data: store, error: storeError } = await supabase.from('stores').select('id').eq('slug', 'snu').single();
    if (storeError || !store) {
      setScheduleStatus('서울대입구역점 정보를 찾을 수 없습니다.');
      return;
    }
    const { error } = await supabase.from('scheduled_broadcasts').insert({
      store_id: store.id,
      message_text: schedule.message.trim(),
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
    const { error } = await supabase.from('scheduled_broadcasts').update({ is_enabled: !item.isEnabled }).eq('id', item.id);
    if (error) {
      setScheduleStatus(`변경하지 못했습니다: ${error.message}`);
      return;
    }
    await loadSchedules();
    notifyScheduleUpdated();
  };

  const changeTime = async (item: StoredSchedule, targetTime: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('scheduled_broadcasts').update({ target_time: targetTime }).eq('id', item.id);
    setScheduleStatus(error ? `시간을 변경하지 못했습니다: ${error.message}` : '예약 시간을 변경했습니다.');
    if (!error) {
      await loadSchedules();
      notifyScheduleUpdated();
    }
  };

  const archiveSchedule = async (item: StoredSchedule) => {
    if (!supabase) return;
    const { error } = await supabase.from('scheduled_broadcasts').delete().eq('id', item.id);
    setScheduleStatus(error ? `예약을 삭제하지 못했습니다: ${error.message}` : '예약을 삭제했습니다.');
    if (!error) {
      await loadSchedules();
      notifyScheduleUpdated();
    }
  };

  const statusBg =
    status === '재생 중' ? '#FED943' : status === '성공' ? '#D6F5E3' : status === '실패' ? '#FFD4D4' : '#FFF9EC';
  const statusColor =
    status === '재생 중' ? '#1E1E1E' : status === '성공' ? '#1A7A3E' : status === '실패' ? '#C92A2A' : '#6B6354';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 헤더 및 실시간 상태 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="section-kicker">STORE BROADCAST CONSOLE</div>
          <h1 className="section-title">매장 안내 방송</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#6B6354', fontWeight: 600 }}>
            PC 브라우저를 열어 두면 등록된 스케줄에 맞춰 매장 스피커로 자동 송출됩니다.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            {status === '재생 중' ? `송출 중: ${currentPlaying ?? '음성'}` : `방송 시스템 상태: ${status}`}
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
        <span style={{ fontSize: '20px' }}>📢</span>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#3D3528', lineHeight: 1.5 }}>
          <strong>운영 가이드:</strong> 카운터 PC에서 브라우저 볼륨을 매장 앰프에 맞추고 탭을 유지해 주세요. 백그라운드 탭에서도 15초 주기로 스케줄을 감지하여 자동 송출합니다.
        </div>
      </div>

      {/* 2열 그리드: 자주 쓰는 녹음 방송 & 직접 TTS 송출 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
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
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>6종 오디오 프리셋</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {presets.map(([title, src, desc]) => (
              <button
                key={src}
                onClick={() => void playAudio(src, title)}
                disabled={status === '재생 중'}
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
                  cursor: status === '재생 중' ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  opacity: status === '재생 중' ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#1E1E1E' }}>{title}</span>
                  <span style={{ fontSize: '14px' }}>🔊</span>
                </div>
                <span style={{ fontSize: '11px', color: '#8A8175', fontWeight: 600, lineHeight: 1.3 }}>{desc}</span>
              </button>
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
            <div style={{ fontSize: '18px', fontWeight: 900 }}>🎙️ 실시간 커스텀 TTS 방송</div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>한국어 음성 합성</span>
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
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#8A8175' }}>{text.length}자 입력됨</span>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
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
          <div style={{ fontSize: '14px', fontWeight: 900, color: '#1E1E1E' }}>+ 새 스케줄 등록</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>반복 방식</label>
              <select
                value={schedule.type}
                onChange={(event) => setSchedule({ ...schedule, type: event.target.value as typeof schedule.type })}
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>송출 시간</label>
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>지정 일자</label>
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>반복 요일 선택</label>
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
                          weekdays: checked ? schedule.weekdays.filter((v) => v !== day) : [...schedule.weekdays, day],
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
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>
              방송 문구 (프리셋 이름 또는 TTS 전문)
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
            📋 등록된 방송 스케줄 ({schedules.length}건)
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
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

                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E1E1E' }}>{item.message_text}</span>
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
          <div style={{ fontSize: '16px', fontWeight: 900 }}>⚠️ 최근 송출 실패 로그 (최근 10건)</div>
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
                  <span style={{ fontSize: '11px', color: '#C92A2A', fontWeight: 800, marginRight: '8px' }}>[실패]</span>
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

