import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Counts = { requests: number; broadcasts: number; inventory: number };

export function DashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!supabase) { setCounts({ requests: 0, broadcasts: 0, inventory: 0 }); return; }
    const today = new Date().toISOString().slice(0, 10);
    const weekday = ['SUN','MON','TUE','WED','THU','FRI','SAT'][new Date().getDay()];
    void Promise.all([
      supabase.from('book_requests').select('*', { count: 'exact', head: true }).eq('status', 'received'),
      supabase.from('scheduled_broadcasts').select('schedule_type,target_date,target_days').eq('is_enabled', true).is('archived_at', null),
      supabase.from('book_inventories').select('*', { count: 'exact', head: true }),
    ]).then(([requests, broadcasts, inventory]) => {
      if (requests.error || broadcasts.error || inventory.error) { setError(true); return; }
      const todayBroadcasts = (broadcasts.data ?? []).filter(item => item.schedule_type === 'daily' || item.schedule_type === 'once' && item.target_date === today || item.schedule_type === 'weekdays' && item.target_days?.includes(weekday)).length;
      setCounts({ requests: requests.count ?? 0, broadcasts: todayBroadcasts, inventory: inventory.count ?? 0 });
    });
  }, []);
  return <section className="dashboard-page"><p className="section-kicker">OPERATIONS</p><h1>오늘의 매장 운영</h1><p className="page-lede">처리할 업무를 확인하고 바로 시작하세요.</p>{error ? <p className="state-card">운영 데이터를 불러오지 못했습니다.</p> : <div className="dashboard-grid"><a href="/staff/requests"><strong>도서 입고 신청</strong><span>{counts === null ? '불러오는 중' : `${counts.requests}건 처리 대기`}</span></a><a href="/staff/broadcast"><strong>오늘의 예약 방송</strong><span>{counts === null ? '불러오는 중' : `${counts.broadcasts}건 활성 예약`}</span></a><a href="/staff/inventory"><strong>등록 재고</strong><span>{counts === null ? '불러오는 중' : `${counts.inventory}건 관리 중`}</span></a></div>}</section>;
}
