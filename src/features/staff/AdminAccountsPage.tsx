import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Account = {
  id: string;
  name: string;
  login_id: string;
  phone_last4: string;
  role: string;
  status: string;
};

export function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [message, setMessage] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  const load = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.rpc('list_staff_accounts');
    if (error) setMessage(error.message);
    else setAccounts((data ?? []) as Account[]);
  };

  useEffect(() => {
    if (supabase) void load();
  }, []);

  const update = async (id: string, status: string) => {
    if (!supabase) return;
    const { error } = await supabase.rpc('set_staff_account_status', { p_account_id: id, p_status: status });
    setMessage(error?.message ?? '계정 상태를 성공적으로 변경했습니다.');
    void load();
  };

  const reset = async (id: string, name: string) => {
    if (!supabase) return;
    const password = window.prompt(`[${name}] 직원의 새로운 임시 비밀번호를 입력하세요 (8자 이상).`);
    if (!password) return;
    if (password.length < 8) {
      setMessage('임시 비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    const { error } = await supabase.rpc('issue_temporary_password', { p_account_id: id, p_password: password });
    setMessage(error?.message ?? `[${name}] 직원에게 임시 비밀번호를 발급했습니다.`);
  };

  const approvedCount = accounts.filter((a) => a.status === 'approved').length;
  const pendingCount = accounts.filter((a) => a.status === 'pending').length;
  const deactivatedCount = accounts.filter((a) => a.status === 'deactivated').length;

  const filteredAccounts =
    filterRole === 'ALL'
      ? accounts
      : accounts.filter((a) => (filterRole === 'ADMIN' ? a.role === 'admin' : a.role === 'staff'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* 헤더 타이틀 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="section-kicker">ADMINISTRATION</div>
          <h1 className="section-title">직원 계정 관리</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#6B6354', fontWeight: 600 }}>
            서울대입구역점 카운터 및 매니저 계정의 가입 승인, 권한 설정, 비밀번호 재발급을 관리합니다.
          </p>
        </div>
        <button
          onClick={() => void load()}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            background: '#FFF9EC',
            border: '2px solid #1E1E1E',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '2px 2px 0 #1E1E1E',
          }}
        >
          새로고침 ⟳
        </button>
      </div>

      {/* 상태 메시지 배너 */}
      {message && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            background: '#FFF3C9',
            border: '2px solid #1E1E1E',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>🔔 {message}</span>
          <button
            onClick={() => setMessage('')}
            style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 900, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI 3종 상태 요약 */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card">
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>총 등록 계정</div>
          <div className="kpi-val">{accounts.length}명</div>
          <div className="kpi-note">전체 스태프 & 관리자</div>
        </div>

        <div className="kpi-card">
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>승인 및 활성 계정</div>
          <div className="kpi-val" style={{ color: '#1A7A3E' }}>{approvedCount}명</div>
          <div className="kpi-note">콘솔 접속 허용</div>
        </div>

        <div className="kpi-card">
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#8A8175' }}>승인 대기 / 비활성</div>
          <div className="kpi-val" style={{ color: pendingCount > 0 ? '#E65100' : '#8A8175' }}>
            {pendingCount}명 / {deactivatedCount}명
          </div>
          <div className="kpi-note">{pendingCount > 0 ? '승인 심사 필요' : '대기 계정 없음'}</div>
        </div>
      </div>

      {/* 직원 목록 테이블 카드 */}
      <div
        style={{
          background: '#ffffff',
          border: '3px solid #1E1E1E',
          borderRadius: '22px',
          padding: '24px',
          boxShadow: '4px 4px 0 #1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>👥 직원 명부 및 권한 관리</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilterRole('ALL')}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: '2px solid #1E1E1E',
                background: filterRole === 'ALL' ? '#FED943' : '#FFF',
                fontWeight: 900,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              전체 ({accounts.length})
            </button>
            <button
              onClick={() => setFilterRole('STAFF')}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: '2px solid #1E1E1E',
                background: filterRole === 'STAFF' ? '#FED943' : '#FFF',
                fontWeight: 900,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              스태프 ({accounts.filter((a) => a.role === 'staff').length})
            </button>
            <button
              onClick={() => setFilterRole('ADMIN')}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: '2px solid #1E1E1E',
                background: filterRole === 'ADMIN' ? '#FED943' : '#FFF',
                fontWeight: 900,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              관리자 ({accounts.filter((a) => a.role === 'admin').length})
            </button>
          </div>
        </div>

        {filteredAccounts.length === 0 ? (
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
            조회된 직원 계정이 없습니다.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAccounts.map((a) => {
              const isApproved = a.status === 'approved';
              const isDeactivated = a.status === 'deactivated';
              const isPending = a.status === 'pending';

              return (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '2.5px solid #1E1E1E',
                    background: isDeactivated ? '#F7F6F3' : '#FFFFFF',
                    opacity: isDeactivated ? 0.7 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: a.role === 'admin' ? '#1E1E1E' : '#FED943',
                        color: a.role === 'admin' ? '#FED943' : '#1E1E1E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '16px',
                        border: '2px solid #1E1E1E',
                      }}
                    >
                      {a.name.slice(0, 1)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '16px', color: '#1E1E1E' }}>{a.name}</strong>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: a.role === 'admin' ? '#1E1E1E' : '#FFF3C9',
                            color: a.role === 'admin' ? '#FED943' : '#1E1E1E',
                            fontSize: '11px',
                            fontWeight: 900,
                            border: '1px solid #1E1E1E',
                          }}
                        >
                          {a.role === 'admin' ? '👑 슈퍼관리자' : '스태프'}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: isApproved ? '#D6F5E3' : isPending ? '#FFF3C9' : '#FFE3E3',
                            color: isApproved ? '#1A7A3E' : isPending ? '#B25E00' : '#C92A2A',
                            fontSize: '11px',
                            fontWeight: 900,
                            border: '1px solid #1E1E1E',
                          }}
                        >
                          {isApproved ? '● 정상 승인' : isPending ? '⏳ 승인 대기' : '✖ 비활성'}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B6354', fontWeight: 600, marginTop: '3px' }}>
                        아이디: <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>{a.login_id}</span> · 전화번호 뒷자리: {a.phone_last4 || '미등록'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {!isApproved && (
                      <button
                        onClick={() => void update(a.id, 'approved')}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: '#D6F5E3',
                          color: '#1A7A3E',
                          border: '2px solid #1E1E1E',
                          fontWeight: 900,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ 가입 승인
                      </button>
                    )}

                    {isApproved && (
                      <button
                        onClick={() => void update(a.id, 'deactivated')}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: '#FFF',
                          color: '#C92A2A',
                          border: '2px solid #1E1E1E',
                          fontWeight: 900,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        비활성화
                      </button>
                    )}

                    <button
                      onClick={() => void reset(a.id, a.name)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '8px',
                        background: '#FFF9EC',
                        color: '#1E1E1E',
                        border: '2px solid #1E1E1E',
                        fontWeight: 900,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      🔑 임시 비밀번호
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

