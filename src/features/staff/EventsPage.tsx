import { useEffect, useState, useMemo } from 'react';
import {
  loadManagedEvents,
  saveManagedEvents,
  getBannerImageUrl,
  type ManagedEvent,
  type EventStoreSlug,
} from '../../lib/eventRepository';
import { useStaffStore } from './StaffStoreContext';
import { publicStoreList } from '../../lib/storeContext';

const STORE_NAME_MAP: Record<EventStoreSlug, string> = {
  all: '전 지점 공통',
  snu: '서울대입구역점',
  jamsil: '잠실점',
  hongdae: '홍대점',
};

export function EventsPage() {
  const { selectedStoreSlug } = useStaffStore();
  const currentStore =
    publicStoreList.find((s) => s.slug === selectedStoreSlug) ?? publicStoreList[0];

  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [listStoreFilter, setListStoreFilter] = useState<string>('ALL');

  // 폼 상태
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('한정 이벤트');
  const [target, setTarget] = useState('');
  const [detail, setDetail] = useState('');
  const [bannerType, setBannerType] = useState<'weekday' | 'naver_ramen' | 'snu' | 'custom'>(
    'weekday'
  );
  const [customBannerUrl, setCustomBannerUrl] = useState('');
  const [isAlwaysOn, setIsAlwaysOn] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [storeSlug, setStoreSlug] = useState<EventStoreSlug>(selectedStoreSlug);

  // 로드
  useEffect(() => {
    setEvents(loadManagedEvents());
  }, []);

  // 지점 컨텍스트 변경 시 폼 디폴트도 동기화 (수정 중이 아닐 때)
  useEffect(() => {
    if (!isEditing) {
      setStoreSlug(selectedStoreSlug);
    }
  }, [selectedStoreSlug, isEditing]);

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
    setStoreSlug(selectedStoreSlug);
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
    setStoreSlug(item.storeSlug || 'all');
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
            storeSlug,
          };
        }
        // 동일 지점(또는 all) 내에서 Featured 중복 해제
        if (isFeatured && (ev.storeSlug === storeSlug || (!ev.storeSlug && storeSlug === 'all'))) {
          return { ...ev, isFeatured: false };
        }
        return ev;
      });
      setMessage('이벤트가 성공적으로 수정되었습니다.');
    } else {
      if (isFeatured) {
        updatedEvents = updatedEvents.map((ev) => {
          if (ev.storeSlug === storeSlug || (!ev.storeSlug && storeSlug === 'all')) {
            return { ...ev, isFeatured: false };
          }
          return ev;
        });
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
        storeSlug,
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
    const updated = events.map((ev) => (ev.id === id ? { ...ev, isPublic: !ev.isPublic } : ev));
    setEvents(updated);
    saveManagedEvents(updated);
    setMessage('공개 상태가 변경되었습니다.');
    setTimeout(() => setMessage(''), 3000);
  };

  // 홈 메인 대표 이벤트로 지정 (해당 이벤트의 대상 지점 기준)
  const handleSetFeatured = (targetItem: ManagedEvent) => {
    const targetStore = targetItem.storeSlug || 'all';
    const updated = events.map((ev) => {
      if (ev.id === targetItem.id) {
        return { ...ev, isFeatured: true };
      }
      if (ev.storeSlug === targetStore || (!ev.storeSlug && targetStore === 'all')) {
        return { ...ev, isFeatured: false };
      }
      return ev;
    });
    setEvents(updated);
    saveManagedEvents(updated);
    setMessage(
      `'${targetItem.title}'이(가) [${STORE_NAME_MAP[targetStore]}] 대표 이벤트로 설정되었습니다.`
    );
    setTimeout(() => setMessage(''), 3000);
  };

  // 이벤트 복사 (종료된 이벤트를 새 초안으로 복제)
  const handleCopy = (source: ManagedEvent) => {
    const copy: ManagedEvent = {
      ...source,
      id: 'evt-' + Date.now(),
      title: source.title + ' (사본)',
      isPublic: false,
      isFeatured: false,
      startDate: '',
      endDate: '',
      storeSlug: selectedStoreSlug,
      createdAt: new Date().toISOString(),
    };
    const updated = [copy, ...events];
    setEvents(updated);
    saveManagedEvents(updated);
    setMessage(`'${source.title}' 이벤트를 복사했습니다. [${currentStore.name}] 비공개 초안으로 생성되었습니다.`);
    setTimeout(() => setMessage(''), 4000);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (listStoreFilter === 'ALL') return true;
      if (listStoreFilter === 'CURRENT') {
        return ev.storeSlug === selectedStoreSlug || !ev.storeSlug || ev.storeSlug === 'all';
      }
      if (listStoreFilter === 'COMMON') {
        return !ev.storeSlug || ev.storeSlug === 'all';
      }
      return ev.storeSlug === listStoreFilter;
    });
  }, [events, listStoreFilter, selectedStoreSlug]);

  const customerEventsUrl =
    selectedStoreSlug === 'snu' ? '/#events' : `/stores/${selectedStoreSlug}/events`;
  const customerHomeUrl =
    selectedStoreSlug === 'snu' ? '/#' : `/stores/${selectedStoreSlug}`;

  return (
    <main
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <span
            style={{ fontSize: '12px', fontWeight: 900, color: '#8A6A00', letterSpacing: '0.08em' }}
          >
            STAFF CONSOLE · {currentStore.name}
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 900, marginTop: '2px' }}>
            이벤트 & 프로모션 관리
          </h1>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354', marginTop: '4px' }}>
            지점별 단독 행사 및 전 지점 공통 이벤트를 분리 등록하고, 매장별 대표 추천 이벤트를 설정합니다.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href={customerHomeUrl}
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
            {currentStore.name} 홈 화면 ↗
          </a>
          <a
            href={customerEventsUrl}
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
            {currentStore.name} 이벤트 페이지 ↗
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
          {message}
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 900 }}>
            {isEditing ? '이벤트 수정' : '새 이벤트 등록'}
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

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* 지점 적용 범위 선택 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
              background: '#FFFDF5',
              padding: '14px',
              borderRadius: '14px',
              border: '2px solid #1E1E1E',
            }}
          >
            <div>
              <label
                style={{ display: 'block', fontSize: '12px', fontWeight: 900, marginBottom: '6px', color: '#8A6A00' }}
              >
                🏢 적용 대상 매장 *
              </label>
              <select
                value={storeSlug}
                onChange={(e) => setStoreSlug(e.target.value as EventStoreSlug)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '2px solid #1E1E1E',
                  fontSize: '14px',
                  fontWeight: 900,
                  background: '#FFFFFF',
                  outline: 'none',
                }}
              >
                <option value="all">🌐 전 지점 공통 이벤트</option>
                <option value="snu">🏢 서울대입구역점 단독</option>
                <option value="jamsil">🏢 잠실점 단독</option>
                <option value="hongdae">🏢 홍대점 단독</option>
              </select>
            </div>

            <div>
              <label
                style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}
              >
                구분 뱃지 태그
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="예: 10월 말까지 한정 / 상시 리뷰 쿠폰 / 잠실점 단독"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '2px solid #1E1E1E',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            <div>
              <label
                style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}
              >
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
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label
                style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}
              >
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
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            <div>
              <label
                style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}
              >
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
                  boxSizing: 'border-box',
                }}
              >
                <option value="weekday">평일 종일권 (15,000원 + 젤라또/라면 무료)</option>
                <option value="naver_ramen">네이버 영수증 리뷰 (라면무료+토핑무료 쿠폰)</option>
                <option value="snu">2026 서울대학교 공식 제휴 배너 (서울대점 전용)</option>
                <option value="custom">직접 이미지 URL 입력</option>
              </select>
            </div>

            {bannerType === 'custom' && (
              <div>
                <label
                  style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}
                >
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
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label
              style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}
            >
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
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 기간 설정 & 공개/Featured 여부 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              padding: '12px 16px',
              background: '#F8F6F0',
              borderRadius: '14px',
              border: '1.5px solid #E6DFCF',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 800,
              }}
            >
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
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '2px solid #1E1E1E',
                    fontSize: '13px',
                  }}
                />
                <span style={{ fontWeight: 800 }}>~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '2px solid #1E1E1E',
                    fontSize: '13px',
                  }}
                />
              </div>
            )}

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 800,
              }}
            >
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              고객 화면에 공개
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 900,
                color: '#8A6A00',
                marginLeft: 'auto',
              }}
            >
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#1E1E1E' }}
              />
              홈페이지 메인 대표 카드로 노출 (Featured)
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

      {/* 등록된 이벤트 목록 및 지점 필터 */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 900 }}>
            등록된 이벤트 목록 ({filteredEvents.length}건 / 전체 {events.length}건)
          </h2>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              ['ALL', '전체 보기'],
              ['CURRENT', `${currentStore.name} 노출 항목`],
              ['COMMON', '전지점 공통만'],
              ['snu', '서울대점 단독'],
              ['jamsil', '잠실점 단독'],
              ['hongdae', '홍대점 단독'],
            ].map(([key, label]) => {
              const active = listStoreFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setListStoreFilter(key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: '1.5px solid #1E1E1E',
                    background: active ? '#FED943' : '#FFFFFF',
                    color: '#1E1E1E',
                    fontWeight: 900,
                    fontSize: '12px',
                    cursor: 'pointer',
                    boxShadow: active ? '2px 2px 0 #1E1E1E' : 'none',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredEvents.length === 0 ? (
            <div
              style={{
                padding: '36px',
                textAlign: 'center',
                color: '#8A8175',
                background: '#FAF9F6',
                border: '2px dashed #D3CEC4',
                borderRadius: '16px',
                fontWeight: 700,
              }}
            >
              선택한 필터 조건에 해당하는 이벤트가 없습니다.
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const targetStoreKey = ev.storeSlug || 'all';
              const targetStoreLabel = STORE_NAME_MAP[targetStoreKey] || '전 지점 공통';

              return (
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
                    boxShadow: ev.isFeatured
                      ? '0 0 0 2px #1E1E1E, 4px 4px 0 #1E1E1E'
                      : '3px 3px 0 #1E1E1E',
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
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
                    >
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: targetStoreKey === 'all' ? '#E3F2FD' : '#FFF3C9',
                          color: targetStoreKey === 'all' ? '#1565C0' : '#8A6A00',
                          fontSize: '11px',
                          fontWeight: 900,
                          border: '1px solid #1E1E1E',
                        }}
                      >
                        {targetStoreKey === 'all' ? '🌐 ' : '🏢 '}
                        {targetStoreLabel}
                      </span>

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
                          홈 메인 대표
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
                          background: '#F3EFE5',
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

                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 900,
                        marginTop: '6px',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {ev.title}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#6B6354',
                        marginTop: '4px',
                        lineHeight: 1.4,
                      }}
                    >
                      {ev.detail}
                    </div>
                    {ev.target && (
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#8A6A00',
                          marginTop: '4px',
                        }}
                      >
                        대상: {ev.target}
                      </div>
                    )}
                  </div>

                  {/* 관리 액션 버튼들 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    {!ev.isFeatured && (
                      <button
                        type="button"
                        onClick={() => handleSetFeatured(ev)}
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
                        홈 메인 지정
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
                    <button
                      type="button"
                      onClick={() => handleCopy(ev)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #1E1E1E',
                        background: '#FFF9EC',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      복사
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

