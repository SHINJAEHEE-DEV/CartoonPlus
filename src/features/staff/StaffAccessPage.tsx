import { useState } from 'react';
import { applyForStaff, signInStaff } from './staffAuth';
import mascotLogo from '../../assets/mascot_logo_circle.png';

export function StaffAccessPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    const form = new FormData(event.currentTarget);
    try {
      if (mode === 'signup') {
        await applyForStaff({
          name: String(form.get('name')),
          loginId: String(form.get('loginId')),
          password: String(form.get('password')),
          phoneLast4: String(form.get('phoneLast4')),
        });
        setMessage('가입 신청이 정상 접수되었습니다. 관리자 승인 후 로그인하실 수 있습니다.');
        setIsError(false);
      } else {
        await signInStaff(String(form.get('loginId')), String(form.get('password')));
        window.location.hash = '/staff/dashboard';
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '처리에 실패했습니다.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'grid',
        placeItems: 'center',
        padding: '24px 16px',
        backgroundColor: '#F3EFE5',
      }}
    >
      <div
        style={{
          width: '100%',
          boxSizing: 'border-box',
          minWidth: 0,
          maxWidth: '440px',
          background: '#ffffff',
          border: '3px solid #1E1E1E',
          borderRadius: '24px',
          boxShadow: '7px 7px 0 #1E1E1E',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
        }}
      >
        {/* 상단 브랜딩 & 로고 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#FED943',
              border: '2.5px solid #1E1E1E',
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
              boxShadow: '3px 3px 0 #1E1E1E',
            }}
          >
            <img src={mascotLogo} alt="카툰플러스" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.03em', color: '#1E1E1E' }}>
              STAFF CONSOLE
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#8A8175' }}>
              카툰플러스 서울대입구역점 · 직원 전용
            </div>
          </div>
        </div>

        {/* 탭 토글 (로그인 / 가입 신청) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
            padding: '5px',
            background: '#FFF9EC',
            border: '2px solid #1E1E1E',
            borderRadius: '999px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setMessage('');
            }}
            style={{
              padding: '9px 0',
              borderRadius: '999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              background: mode === 'login' ? '#1E1E1E' : 'transparent',
              color: mode === 'login' ? '#FED943' : '#6B6354',
              transition: 'all 0.15s ease',
            }}
          >
            직원 로그인
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setMessage('');
            }}
            style={{
              padding: '9px 0',
              borderRadius: '999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              background: mode === 'signup' ? '#1E1E1E' : 'transparent',
              color: mode === 'signup' ? '#FED943' : '#6B6354',
              transition: 'all 0.15s ease',
            }}
          >
            가입 신청
          </button>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1E1E1E', marginBottom: '6px' }}>
                이름
              </label>
              <input
                name="name"
                placeholder="실명을 입력해 주세요"
                required={mode === 'signup'}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 16px',
                  border: '2px solid #1E1E1E',
                  borderRadius: '14px',
                  background: '#FFF9EC',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1E1E1E', marginBottom: '6px' }}>
              로그인 아이디
            </label>
            <input
              name="loginId"
              placeholder="아이디 입력"
              required
              autoCapitalize="none"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '13px 16px',
                border: '2px solid #1E1E1E',
                borderRadius: '14px',
                background: '#FFF9EC',
                fontSize: '14px',
                fontWeight: 700,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1E1E1E', marginBottom: '6px' }}>
              비밀번호
            </label>
            <input
              name="password"
              type="password"
              placeholder="비밀번호 (8자 이상)"
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '13px 16px',
                border: '2px solid #1E1E1E',
                borderRadius: '14px',
                background: '#FFF9EC',
                fontSize: '14px',
                fontWeight: 700,
                outline: 'none',
              }}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1E1E1E', marginBottom: '6px' }}>
                전화번호 끝 4자리
              </label>
              <input
                name="phoneLast4"
                placeholder="예: 0852"
                maxLength={4}
                required={mode === 'signup'}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 16px',
                  border: '2px solid #1E1E1E',
                  borderRadius: '14px',
                  background: '#FFF9EC',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>
          )}

          {message && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: isError ? '#FFF0F0' : '#EAF7EE',
                border: `2px solid ${isError ? '#E03E3E' : '#2FA14B'}`,
                color: isError ? '#C92A2A' : '#1E7E34',
                fontSize: '13px',
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '6px',
              padding: '14px 20px',
              borderRadius: '14px',
              background: '#1E1E1E',
              color: '#FED943',
              fontSize: '15px',
              fontWeight: 900,
              border: '2px solid #1E1E1E',
              boxShadow: '3px 3px 0 #8A8175',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isSubmitting ? '처리 중...' : mode === 'login' ? '직원 로그인 →' : '가입 신청 접수 →'}
          </button>
        </form>

        {/* 하단 링크 */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #EDE6D6', paddingTop: '16px' }}>
          <a
            href="/"
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: '#6B6354',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← 고객 홈 화면으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
