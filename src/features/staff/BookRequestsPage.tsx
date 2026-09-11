import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Pagination } from '../common/Pagination';

interface BookRequestItem {
  id: string;
  title: string;
  author: string | null;
  desired_volume: string | null;
  user_comment?: string | null;
  status: string;
  created_at?: string;
}

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  received: { label: '접수 대기', bg: '#FFF3C9', text: '#8A6A00' },
  ordered: { label: '주문 완료', bg: '#E3F2FD', text: '#1976D2' },
  completed: { label: '입고 완료', bg: '#E8F5E9', text: '#2E7D32' },
  unavailable: { label: '입고 불가', bg: '#FFEBEE', text: '#D32F2F' },
};

const PAGE_SIZE = 10;

export function BookRequestsPage() {
  const [items, setItems] = useState<BookRequestItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');

  const load = async () => {
    if (!supabase) return;
    let query = supabase
      .from('book_requests')
      .select('id,title,author,desired_volume,user_comment,status,created_at')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) setMessage(error.message);
    else setItems(data ?? []);
  };

  useEffect(() => {
    void load();
    setCurrentPage(1);
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('book_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage(error.message);
    else {
      setMessage('신청 상태를 변경했습니다.');
      await load();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, currentPage]);

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#8A6A00', letterSpacing: '0.08em' }}>STAFF REQUESTS</span>
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginTop: '2px' }}>고객 도서 입고 신청 관리</h1>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354', marginTop: '4px' }}>
          고객이 검색 결과 미보유 상태에서 신청한 희망 도서 목록을 검토하고 처리 상태를 업데이트합니다.
        </p>
      </div>

      {message && (
        <div style={{ padding: '12px 18px', background: '#FFF3C9', border: '2px solid #1E1E1E', borderRadius: '14px', fontSize: '13px', fontWeight: 800 }}>
          🔔 {message}
        </div>
      )}

      {/* 상태 필터 탭 */}
      <section
        style={{
          background: '#FFFFFF',
          border: '3px solid #1E1E1E',
          borderRadius: '24px',
          padding: '20px 24px',
          boxShadow: '5px 5px 0 #1E1E1E',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '999px',
            border: '2px solid #1E1E1E',
            background: statusFilter === 'all' ? '#1E1E1E' : '#FFFFFF',
            color: statusFilter === 'all' ? '#FED943' : '#1E1E1E',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          전체 보기
        </button>
        {Object.entries(STATUS_LABELS).map(([key, info]) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: '2px solid #1E1E1E',
              background: statusFilter === key ? '#1E1E1E' : '#FFFFFF',
              color: statusFilter === key ? '#FED943' : '#1E1E1E',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            {info.label}
          </button>
        ))}
      </section>

      {/* 목록 리스트 */}
      <section
        style={{
          background: '#FFFFFF',
          border: '3px solid #1E1E1E',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '5px 5px 0 #1E1E1E',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900 }}>
            신청 내역 ({items.length}건)
          </h2>
        </div>

        {items.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paginatedItems.map((item) => {
                const badge = STATUS_LABELS[item.status] || { label: item.status, bg: '#ECEFF1', text: '#546E7A' };
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: '#FFFDF5',
                      border: '2px solid #1E1E1E',
                      borderRadius: '14px',
                      gap: '14px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: badge.bg,
                            color: badge.text,
                            fontSize: '11px',
                            fontWeight: 900,
                            border: '1px solid #1E1E1E',
                          }}
                        >
                          {badge.label}
                        </span>
                        <strong style={{ fontSize: '16px' }}>{item.title}</strong>
                        {item.author && <span style={{ fontSize: '12px', color: '#6B6354' }}>({item.author})</span>}
                      </div>
                      {item.desired_volume && (
                        <div style={{ fontSize: '12px', color: '#8A6A00', fontWeight: 700, marginTop: '4px' }}>
                          희망 권수: {item.desired_volume}
                        </div>
                      )}
                      {item.user_comment && (
                        <div style={{ fontSize: '12px', color: '#6B6354', marginTop: '2px' }}>
                          💬 {item.user_comment}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <select
                        value={item.status}
                        onChange={(e) => void updateStatus(item.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '2px solid #1E1E1E',
                          background: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, val]) => (
                          <option key={k} value={k}>
                            {val.label}
                          </option>
                        ))}
                      </select>

                      {item.status === 'completed' && (
                        <a
                          href={`/staff/inventory?title=${encodeURIComponent(item.title)}`}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: '#1E1E1E',
                            color: '#FED943',
                            fontSize: '12px',
                            fontWeight: 800,
                            textDecoration: 'none',
                          }}
                        >
                          재고 등록 바로가기 →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={items.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#6B6354', fontWeight: 700 }}>
            해당 상태의 도서 신청 내역이 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}
