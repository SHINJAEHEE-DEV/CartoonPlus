import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StaffLoginModal({ isOpen, onClose }: StaffLoginModalProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('snu_staff');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      setError('');
      onClose();
      navigate('/admin');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다. (테스트 비밀번호: 1234)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-brand-charcoal rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-brand-charcoal text-brand-yellow text-xs font-black px-3 py-1 rounded-full">
            🔐 STAFF CONSOLE
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-brand-charcoal leading-none"
          >
            ✕
          </button>
        </div>

        <h3 className="text-xl font-black text-brand-charcoal tracking-tight">직원 콘솔 로그인</h3>
        <p className="text-xs text-brand-muted mt-1 mb-4">
          매장 카운터 포스/PC 전용 관리자 로그인입니다.
        </p>

        {error && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-extrabold text-brand-charcoal mb-1">직원 아이디 / 이름</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="snu_staff / jamsil_staff"
              className="w-full border-2 border-brand-charcoal rounded-xl px-3 py-2 text-sm font-bold text-brand-charcoal outline-hidden focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-brand-charcoal mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력 (기본: 1234)"
              className="w-full border-2 border-brand-charcoal rounded-xl px-3 py-2 text-sm font-bold text-brand-charcoal outline-hidden focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-charcoal hover:bg-black text-brand-yellow font-black text-sm py-3 rounded-xl border-2 border-brand-charcoal transition-all shadow-md active:scale-98"
            >
              로그인 후 콘솔 진입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
