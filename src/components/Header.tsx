import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StaffLoginModal from './StaffLoginModal';
import { getAssetUrl } from '../lib/assets';

interface HeaderProps {
  selectedStore: 'snu' | 'jamsil';
  onStoreChange: (storeId: 'snu' | 'jamsil') => void;
}

export default function Header({ selectedStore, onStoreChange }: HeaderProps) {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/search', label: '도서검색' },
    { path: '/entertainment', label: '즐길거리' },
    { path: '/menu', label: '메뉴·요금' },
    { path: '/store', label: '매장안내' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-yellow border-b-2 border-brand-charcoal shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src={getAssetUrl('/assets/06bbb21d-ce2f-4057-a658-dd61a9fa14be.png')}
              alt="카툰플러스"
              className="h-11 w-11 rounded-full border-1.5 border-brand-charcoal shadow-xs"
            />
            <div className="flex flex-col">
              <span className="font-black text-lg md:text-xl tracking-tight text-brand-charcoal leading-none">
                CARTOON<span className="text-amber-800">PLUS</span>
              </span>
              <span className="text-[10px] font-extrabold text-amber-950 tracking-wider">
                CAFE LOUNGE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    isActive
                      ? 'bg-brand-charcoal text-brand-yellow shadow-xs'
                      : 'text-amber-950 hover:bg-black/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Area: Store Selector & Staff Login */}
          <div className="flex items-center gap-2">
            {/* Store Switcher Pill */}
            <div className="flex bg-white border-2 border-brand-charcoal rounded-full p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => onStoreChange('snu')}
                className={`px-2.5 md:px-3 py-1 rounded-full text-xs font-black transition-all ${
                  selectedStore === 'snu'
                    ? 'bg-brand-yellow text-brand-charcoal shadow-xs'
                    : 'text-gray-500 hover:text-brand-charcoal'
                }`}
              >
                📍 서울대입구
              </button>
              <button
                type="button"
                onClick={() => onStoreChange('jamsil')}
                className={`px-2.5 md:px-3 py-1 rounded-full text-xs font-black transition-all ${
                  selectedStore === 'jamsil'
                    ? 'bg-brand-yellow text-brand-charcoal shadow-xs'
                    : 'text-gray-500 hover:text-brand-charcoal'
                }`}
              >
                📍 잠실점
              </button>
            </div>

            {/* Staff Desk Button */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  to="/admin"
                  className="bg-brand-charcoal hover:bg-black text-brand-yellow text-xs font-black px-3.5 py-2 rounded-xl border-1.5 border-brand-charcoal transition-all shadow-xs"
                >
                  ⚙️ 콘솔 ({user?.username})
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-bold text-gray-700 hover:text-black px-2 py-1"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden sm:inline-block bg-brand-charcoal hover:bg-black text-white text-xs font-black px-3.5 py-2 rounded-xl border-1.5 border-brand-charcoal transition-all shadow-xs"
              >
                직원 콘솔
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border-2 border-brand-charcoal bg-white text-brand-charcoal"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-yellow border-t-2 border-brand-charcoal px-4 py-3 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-center py-2.5 rounded-xl text-xs font-black transition-all ${
                      isActive
                        ? 'bg-brand-charcoal text-brand-yellow'
                        : 'bg-white/80 text-brand-charcoal border border-brand-charcoal/20'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 border-t border-brand-charcoal/20 flex justify-between items-center">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-brand-charcoal text-brand-yellow text-xs font-black px-3 py-1.5 rounded-lg"
                  >
                    ⚙️ 직원 콘솔 이동
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-amber-950 underline"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full bg-brand-charcoal text-white text-xs font-black py-2 rounded-xl text-center"
                >
                  🔐 직원 콘솔 로그인
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Staff Login Modal */}
      <StaffLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
