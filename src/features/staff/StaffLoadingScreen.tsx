import { MASCOT_ASSETS } from '../../lib/brandAssets';

export function StaffLoadingScreen({
  message = '직원 권한을 확인하는 중입니다.',
  subMessage = '잠시만 기다려 주세요...',
}: {
  message?: string;
  subMessage?: string;
}) {
  return (
    <div className="staff-loading-wrapper">
      <div className="staff-loading-card">
        <div className="staff-loading-logo-box">
          <img
            src={MASCOT_ASSETS.logoCircle}
            alt="카툰플러스 로고"
            className="staff-loading-mascot"
          />
        </div>

        <div className="staff-loading-content">
          <span className="staff-loading-badge">직원 콘솔</span>
          <h2 className="staff-loading-title">{message}</h2>
          <p className="staff-loading-subtitle">{subMessage}</p>
        </div>

        <div className="staff-loading-bar-track" role="progressbar" aria-label="로딩 중">
          <div className="staff-loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}
