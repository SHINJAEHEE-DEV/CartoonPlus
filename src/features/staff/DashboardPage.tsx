import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Counts = {
  requests: number;
  broadcasts: number;
  recentInventory: string[];
};

export function DashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setCounts({ requests: 0, broadcasts: 0, recentInventory: [] });
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()];
    void Promise.all([
      supabase.from('book_requests').select('*', { count: 'exact', head: true }).eq('status', 'received'),
      supabase.from('scheduled_broadcasts').select('schedule_type,target_date,target_days').eq('is_enabled', true).is('archived_at', null),
      supabase.from('book_inventories').select('updated_at,books(title)').is('archived_at', null).order('updated_at', { ascending: false }).limit(4),
    ]).then(([requests, broadcasts, inventory]) => {
      if (requests.error || broadcasts.error || inventory.error) {
        setError(true);
        return;
      }
      const todayBroadcasts = (broadcasts.data ?? []).filter(
        (item) =>
          item.schedule_type === 'daily' ||
          (item.schedule_type === 'once' && item.target_date === today) ||
          (item.schedule_type === 'weekdays' && item.target_days?.includes(weekday))
      ).length;
      setCounts({
        requests: requests.count ?? 0,
        broadcasts: todayBroadcasts,
        recentInventory: (inventory.data ?? []).map((item) => item.books?.[0]?.title ?? '도서 정보'),
      });
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 타이틀 및 동기화 상태 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="section-kicker">STAFF OPERATIONS</div>
          <h1 className="section-title">운영 대시보드</h1>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#8A8175' }}>
          서울대입구역점 · 카운터 전용 콘솔
        </div>
      </div>

      {error ? (
        <div className="state-card" style={{ padding: '20px', background: '#FFF9EC', border: '2.5px solid #1E1E1E', borderRadius: '18px' }}>
          운영 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      ) : (
        <>
          {/* KPI 4종 카드 그리드 */}
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="kpi-card">
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>처리 대기 신청</div>
              <div className="kpi-val">{counts === null ? '...' : `${counts.requests}건`}</div>
              <div className="kpi-note">미확인 고객 요청</div>
            </div>

            <div className="kpi-card">
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>오늘의 예약 방송</div>
              <div className="kpi-val">{counts === null ? '...' : `${counts.broadcasts}건`}</div>
              <div className="kpi-note">자동 송출 활성화</div>
            </div>

            <div className="kpi-card">
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>최근 갱신 도서</div>
              <div className="kpi-val">{counts === null ? '...' : `${counts.recentInventory.length}종`}</div>
              <div className="kpi-note">서가 재고 변동</div>
            </div>

            <div className="kpi-card">
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>매장 운영 모드</div>
              <div className="kpi-val" style={{ color: '#2FA14B', fontSize: '24px', paddingTop: '6px' }}>정상 운영</div>
              <div className="kpi-note" style={{ color: '#5C5344' }}>10:00 – 23:00</div>
            </div>
          </div>

          {/* 2열 바로가기 카드 */}
          <div className="home-split">
            {/* 도서 입고 신청 카드 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '22px',
                background: '#ffffff',
                border: '3px solid #1E1E1E',
                borderRadius: '22px',
                boxShadow: '5px 5px 0 #1E1E1E',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 900 }}>도서 입고 신청 관리</div>
                <a
                  href="/staff/requests"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: '#FFF3C9',
                    border: '2px solid #1E1E1E',
                    fontSize: '12px',
                    fontWeight: 800,
                  }}
                >
                  전체 보기 →
                </a>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354', lineHeight: 1.5 }}>
                손님이 남겨주신 희망 도서를 확인하고 입고 검토 상태(신청 접수/입고 완료/보류)를 업데이트하세요.
              </p>
            </div>

            {/* 방송 콘솔 다크 카드 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '22px',
                background: '#1E1E1E',
                borderRadius: '22px',
                color: '#FFF9EC',
                border: '3px solid #1E1E1E',
                boxShadow: '5px 5px 0 #FED943',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 900 }}>매장 안내 방송 콘솔</div>
                <a
                  href="/staff/broadcast"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: '#FED943',
                    color: '#1E1E1E',
                    fontSize: '12px',
                    fontWeight: 900,
                  }}
                >
                  방송 콘솔 →
                </a>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#CFC7B4', lineHeight: 1.5 }}>
                마감 30분 전, 음료 픽업, 만석 안내 등 원클릭 프리셋 방송 및 즉시 커스텀 TTS를 송출할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 최근 재고 작업 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '22px',
              background: '#ffffff',
              border: '3px solid #1E1E1E',
              borderRadius: '22px',
              boxShadow: '5px 5px 0 #1E1E1E',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 900 }}>최근 변경된 도서</div>
            {counts?.recentInventory && counts.recentInventory.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {counts.recentInventory.map((title, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      background: '#FFF9EC',
                      border: '1.5px solid #1E1E1E',
                      fontSize: '13px',
                      fontWeight: 800,
                    }}
                  >
                    📖 {title}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: '#8A8175', fontWeight: 600 }}>최근 변경된 도서 내역이 없습니다.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
