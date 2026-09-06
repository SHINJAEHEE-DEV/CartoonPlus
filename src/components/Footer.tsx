import { Link } from 'react-router-dom';
import { getAssetUrl } from '../lib/assets';

export default function Footer() {
  return (
    <footer className="bg-brand-darkBg text-gray-400 border-t-2 border-brand-charcoal pt-12 pb-14">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={getAssetUrl('/assets/06bbb21d-ce2f-4057-a658-dd61a9fa14be.png')}
              alt="카툰플러스 로고"
              className="h-10 w-10 rounded-full border border-gray-600"
            />
            <span className="font-black text-xl text-white tracking-tight">
              CARTOON<span className="text-brand-yellow">PLUS</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md">
            도심 속 가장 아늑한 복합 문화 힐링 라운지, 만화카페 카툰플러스.<br />
            서울대입구역점 & 잠실점 도서/엔터테인먼트 스마트 검색 시스템.<br />
            운영비 0원($0)으로 만든 고성능 반응형 플랫폼입니다.
          </p>
          <div className="mt-4 text-[11px] text-gray-500">
            © 2026 CartoonPlus Cafe. All rights reserved.
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div>
          <h4 className="text-white text-xs font-black tracking-wider uppercase mb-3">서비스 바로가기</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/search" className="hover:text-brand-yellow transition-colors">
                📚 스마트 도서 검색
              </Link>
            </li>
            <li>
              <Link to="/entertainment" className="hover:text-brand-yellow transition-colors">
                🎮 닌텐도·Xbox·보드게임
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-brand-yellow transition-colors">
                ☕ 메뉴판 & 이용 요금제
              </Link>
            </li>
            <li>
              <Link to="/store" className="hover:text-brand-yellow transition-colors">
                📍 매장 위치 & 편의시설
              </Link>
            </li>
          </ul>
        </div>

        {/* Store Contacts */}
        <div>
          <h4 className="text-white text-xs font-black tracking-wider uppercase mb-3">지점 안내 및 연락처</h4>
          <div className="space-y-3 text-xs">
            <div>
              <div className="font-bold text-white">서울대입구역점</div>
              <div className="text-gray-400 text-[11px]">관악로 155 3층 (3번 출구 1분)</div>
              <a href="tel:02-888-1234" className="text-brand-yellow font-extrabold hover:underline">
                📞 02-888-1234
              </a>
            </div>
            <div>
              <div className="font-bold text-white">잠실점</div>
              <div className="text-gray-400 text-[11px]">백제고분로9길 23 2층 (잠실새내역 4번 출구)</div>
              <a href="tel:02-412-5678" className="text-brand-yellow font-extrabold hover:underline">
                📞 02-412-5678
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
