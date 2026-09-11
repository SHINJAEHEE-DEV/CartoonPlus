import { useEffect, useState } from 'react';
import {
  loadManagedEvents,
  saveManagedEvents,
  getBannerImageUrl,
  type ManagedEvent,
} from '../../lib/eventRepository';

export function EventsPage() {
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // 폼 상태
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('한정 이벤트');
  const [target, setTarget] = useState('');
  const [detail, setDetail] = useState('');
  const [bannerType, setBannerType] = useState<'weekday' | 'naver_ramen' | 'snu' | 'custom'>('weekday');
  const [customBannerUrl, setCustomBannerUrl] = useState('');
  const [isAlwaysOn, setIsAlwaysOn] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // 로드
  useEffect(() => {
    setEvents(loadManagedEvents());
  }, []);

  const resetForm = () => {
    setTitle('');
    setTag('한정 이벤트');
    setTarget('');
    setDetail('');
    setBannerType('weekday');
    setCustomBannerUrl('');
    setIsAlwaysOn(true);
    setStartDate('');
    setEndDate('');
    setIsPublic(true);
    setIsFeatured(false);
    setIsEditing(null);
  };

  const handleEdit = (item: ManagedEvent) => {
    setIsEditing(item.id);
    setTitle(item.title);
    setTag(item.tag);
    setTarget(item.target);
    setDetail(item.detail);
    setBannerType(item.bannerType);
    setCustomBannerUrl(item.customBannerUrl || '');
    setIsAlwaysOn(item.isAlwaysOn);
    setStartDate(item.startDate || '');
    setEndDate(item.endDate || '');
    setIsPublic(item.isPublic);
    setIsFeatured(Boolean(item.isFeatured));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !detail.trim()) {
      setMessage('제목과 상세 내용을 입력해 주세요.');
      return;
    }

    let updatedEvents = [...events];

    if (isEditing) {
      updatedEvents = updatedEvents.map((ev) => {
        if (ev.id === isEditing) {
          return {
            ...ev,
            title,
            tag,
            target,
            detail,
            bannerType,
            customBannerUrl,
            isAlwaysOn,
            startDate: isAlwaysOn ? undefined : startDate,
            endDate: isAlwaysOn ? undefined : endDate,
            isPublic,
            isFeatured,
          };
        }
        // 만약 현재 수정 중인 이벤트를 Featured로 설정하면 다른 이벤트는 featured 해제
        return isFeatured ? { ...ev, isFeatured: false } : ev;
      });
      setMessage('이벤트가 성공적으로 수정되었습니다.');
    } else {
      if (isFeatured) {
        updatedEvents = updatedEvents.map((ev) => ({ ...ev, isFeatured: false }));
      }
      const newEvent: ManagedEvent = {
        id: 'evt-' + Date.now(),
        title,
        tag,
        target,
        detail,
        bannerType,
        customBannerUrl,
        isAlwaysOn,
        startDate: isAlwaysOn ? undefined : startDate,
        endDate: isAlwaysOn ? undefined : endDate,
        isPublic,
        isFeatured,
        createdAt: new Date().toISOString(),
      };
      updatedEvents = [newEvent, ...updatedEvents];
      setMessage('새로운 이벤트가 등록되었습니다.');
    }

    setEvents(updatedEvents);
    saveManagedEvents(updatedEvents);
    resetForm();
    setTimeout(() => setMessage(''), 4000);
  };

  // 삭제 (Delete)
  const handleDelete = (id: string, eventTitle: string) => {
    if (window.confirm("'" + eventTitle + "' 이벤트를 정말로 삭제하시겠습니까?")) {
      const filtered = events.filter((ev) => ev.id !== id);
      setEvents(filtered);
      saveManagedEvents(filtered);
      setMessage('이벤트가 삭제되었습니다.');
      if (isEditing === id) resetForm();
      setTimeout(() => setMessage(''), 4000);
    }
  };

  // 공개/비공개 토글
  const handleTogglePublic = (id: string) => {
    const updated = events.map((ev) =>
      ev.id === id ? { ...ev, isPublic: !ev.isPublic } : ev
    );
    setEvents(updated);
    saveManagedEvents(updated);
    setMessage('공개 상태가 변경되었습니다.');
    setTimeout(() => setMessage(''), 3000);
  };

  // 홈 메인 대표 이벤트로 지정
  const handleSetFeatured = (id: string) => {
    const updated = events.map((ev) => ({
      ...ev,
      isFeatured: ev.id === id,
    }));
    setEvents(updated);
    saveManagedEvents(updated);
    setMessage('홈페이지 메인 추천 이벤트로 설정되었습니다.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#8A6A00', letterSpacing: '0.08em' }}>STAFF CONSOLE</span>
          <h1 style={{ fontSize: '26px', fontWeight: 900, marginTop: '2px' }}>이벤트 & 프로모션 관리</h1>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354', marginTop: '4px' }}>
            매장 이벤트 및 제휴 배너를 등록·수정하고, 홈페이지 메인에 띄울 대표 이벤트를 클릭 한 번으로 지정합니다.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="/#"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '10px 16px',
              borderRadius: '999px',
              background: '#1E1E1E',
              color: '#FED943',
              fontSize: '13px',
              fontWeight: 900,
              textDecoration: 'none',
            }}
          >
            홈 화면 확인 ↗
          </a>
          <a
            href="/#events"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '10px 16px',
              borderRadius: '999px',
              background: '#FED943',
              border: '2px solid #1E1E1E',
              color: '#1E1E1E',
              fontSize: '13px',
              fontWeight: 900,
              textDecoration: 'none',
            }}
          >
            고객 이벤트 페이지 ↗
          </a>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 18px',
            background: '#FFF3C9',
            border: '2px solid #1E1E1E',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#1E1E1E',
          }}
        >
          🔔 {message}
        </div>
      )}

      {/* 이벤트 등록 / 수정 폼 */}
      <section
        style={{
          background: '#FFFFFF',
          border: '3px solid #1E1E1E',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '5px 5px 0 #1E1E1E',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900 }}>
            {isEditing ? '✏️ 이벤트 수정' : '➕ 새 이벤트 등록'}
          </h2>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                border: '1.5px solid #1E1E1E',
                background: '#F3EFE5',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              취소하고 새로 등록
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                이벤트 제목 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 평일 종일 이용권 추가 혜택 이벤트"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '2px solid #1E1E1E',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                구분 뱃지 태그
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="예: 10월 말까지 한정 / 상시 리뷰 쿠폰 / 상시 제휴"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '2px solid #1E1E1E',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                대상 고객
              </label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="예: 평일 종일 이용권 결제 고객"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '2px solid #1E1E1E',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                배너 이미지 프리셋 선택
              </label>
              <select
                value={bannerType}
                onChange={(e) => setBannerType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '2px solid #1E1E1E',
                  fontSize: '14px',
                  fontWeight: 700,
                  background: '#FFFFFF',
                  outline: 'none',
                }}
              >
                <option value="weekday">평일 종일권 (15,000원 + 젤라또/라면 무료)</option>
                <option value="naver_ramen">네이버 영수증 리뷰 (라면무료+토핑무료 쿠폰)</option>
                <option value="snu">2026 서울대학교 공식 제휴 배너</option>
                <option value="custom">직접 이미지 URL 입력</option>
              </select>
            </div>
          </div>

          {bannerType === 'custom' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                배너 이미지 URL
              </label>
              <input
                type="url"
                value={customBannerUrl}
                onChange={(e) => setCustomBannerUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '2px solid #1E1E1E',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
              상세 내용 및 혜택 * (줄바꿈 또는 '+' 기호로 항목 구분 가능)
            </label>
            <textarea
              rows={3}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="예: 패키지 요금제 10% 현장 즉시 할인 + 평일 종일권 결제 시 기본 음료 무료 업그레이드"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '2px solid #1E1E1E',
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: 1.5,
                outline: 'none',
              }}
            />
          </div>

          {/* 기간 설정 & 공개/Featured 여부 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', padding: '12px 16px', background: '#F8F6F0', borderRadius: '14px', border: '1.5px solid #E6DFCF' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 800 }}>
              <input
                type="checkbox"
                checked={isAlwaysOn}
                onChange={(e) => setIsAlwaysOn(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              상시 진행 (종료일 없음)
            </label>

            {!isAlwaysOn && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '13px' }}
                />
                <span style={{ fontWeight: 800 }}>~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #1E1E1E', fontSize: '13px' }}
                />
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 800 }}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              고객 화면에 공개
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 900, color: '#8A6A00', marginLeft: 'auto' }}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#1E1E1E' }}
              />
              ⭐️ 홈페이지 메인 대표 카드로 노출 (Featured)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="submit"
              style={{
                padding: '12px 28px',
                borderRadius: '999px',
                background: '#1E1E1E',
                color: '#FED943',
                fontSize: '14px',
                fontWeight: 900,
                border: '2px solid #1E1E1E',
                cursor: 'pointer',
              }}
            >
              {isEditing ? '이벤트 수정 저장' : '이벤트 등록 완료'}
            </button>
          </div>
        </form>
      </section>

      {/* 등록된 이벤트 목록 */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900 }}>
            📋 등록된 이벤트 목록 ({events.length}건)
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {events.map((ev) => (
            <div
              key={ev.id}
              style={{
                background: '#FFFFFF',
                border: ev.isFeatured ? '3px solid #FED943' : '2.5px solid #1E1E1E',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                gap: '18px',
                alignItems: 'center',
                boxShadow: ev.isFeatured ? '0 0 0 2px #1E1E1E, 4px 4px 0 #1E1E1E' : '3px 3px 0 #1E1E1E',
                opacity: ev.isPublic ? 1 : 0.6,
                position: 'relative',
              }}
            >
              {/* 썸네일 미리보기 */}
              <div
                style={{
                  width: '120px',
                  height: '80px',
                  borderRadius: '12px',
                  border: '1.5px solid #1E1E1E',
                  overflow: 'hidden',
                  background: '#F3EFE5',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                }}
              >
                <img
                  src={getBannerImageUrl(ev.bannerType, ev.customBannerUrl)}
                  alt={ev.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* 내용 정보 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {ev.isFeatured && (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        background: '#1E1E1E',
                        color: '#FED943',
                        fontSize: '11px',
                        fontWeight: 900,
                        border: '1px solid #1E1E1E',
                      }}
                    >
                      ⭐️ 홈 메인 노출 중
                    </span>
                  )}
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: ev.isPublic ? '#E8F5E9' : '#ECEFF1',
                      color: ev.isPublic ? '#2E7D32' : '#546E7A',
                      fontSize: '11px',
                      fontWeight: 900,
                      border: '1px solid #1E1E1E',
                    }}
                  >
                    {ev.isPublic ? '공개 중' : '비공개(숨김)'}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#FFF3C9',
                      fontSize: '11px',
                      fontWeight: 800,
                      border: '1px solid #1E1E1E',
                    }}
                  >
                    {ev.tag}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#8A8175' }}>
                    {ev.isAlwaysOn ? '상시 진행' : `${ev.startDate} ~ ${ev.endDate}`}
                  </span>
                </div>

                <div style={{ fontSize: '16px', fontWeight: 900, marginTop: '6px', letterSpacing: '-0.02em' }}>
                  {ev.title}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B6354', marginTop: '4px', lineHeight: 1.4 }}>
                  {ev.detail}
                </div>
                {ev.target && (
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#8A6A00', marginTop: '4px' }}>
                    대상: {ev.target}
                  </div>
                )}
              </div>

              {/* 관리 액션 버튼들 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                {!ev.isFeatured && (
                  <button
                    type="button"
                    onClick={() => handleSetFeatured(ev.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #8A6A00',
                      background: '#FFF9EC',
                      color: '#8A6A00',
                      fontSize: '12px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ⭐️ 홈 메인 지정
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleTogglePublic(ev.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #1E1E1E',
                    background: ev.isPublic ? '#F3EFE5' : '#1E1E1E',
                    color: ev.isPublic ? '#1E1E1E' : '#FED943',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ev.isPublic ? '숨기기 (OFF)' : '공개하기 (ON)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(ev)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #1E1E1E',
                    background: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(ev.id, ev.title)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #D32F2F',
                    background: '#FFEBEE',
                    color: '#D32F2F',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
