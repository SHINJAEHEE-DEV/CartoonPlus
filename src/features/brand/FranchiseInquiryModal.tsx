import { useState } from 'react';

interface InquiryFormData {
  name: string;
  phone: string;
  region: string;
  timing: string;
  budget: string;
  message: string;
  agreed: boolean;
}

interface FranchiseInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FranchiseInquiryModal({ isOpen, onClose }: FranchiseInquiryModalProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    phone: '',
    region: '서울',
    timing: '3개월 이내',
    budget: '1억~1억5천',
    message: '',
    agreed: true,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.agreed) return;

    setIsSubmitting(true);
    // 모의 접수 및 로컬스토리지 백업
    try {
      const existing = JSON.parse(localStorage.getItem('cartoonplus_franchise_inquiries') || '[]');
      existing.push({
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('cartoonplus_franchise_inquiries', JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="brand-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="brand-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="brand-modal-close"
          onClick={onClose}
          type="button"
          aria-label="닫기"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="brand-form-success">
            <div className="brand-form-success-icon">☕✨</div>
            <h3 className="brand-form-success-title">가맹 상담 신청이 완료되었습니다</h3>
            <p className="brand-form-success-desc">
              담당자가 접수 내용을 검토한 후 입력하신 연락처(<strong>{formData.phone}</strong>)로
              빠른 시일 내에 연락드리겠습니다.
            </p>
            <button
              type="button"
              className="brand-btn-3d brand-btn-3d-red"
              style={{ margin: '0 auto', display: 'flex' }}
              onClick={handleReset}
            >
              확인
            </button>
          </div>
        ) : (
          <>
            <div className="brand-inquiry-header">
              <h2 className="brand-inquiry-title">가맹 및 창업 상담 신청</h2>
              <p className="brand-inquiry-desc">
                카툰플러스 본사 전문가가 최적의 상권과 예상 수익을 정밀 분석해 드립니다.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="brand-form-grid">
                <div className="brand-form-group">
                  <label className="brand-form-label" htmlFor="modal-name">
                    성함 <span>*</span>
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    className="brand-form-input"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="brand-form-group">
                  <label className="brand-form-label" htmlFor="modal-phone">
                    연락처 <span>*</span>
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    className="brand-form-input"
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="brand-form-group">
                  <label className="brand-form-label" htmlFor="modal-region">
                    창업 희망 지역
                  </label>
                  <select
                    id="modal-region"
                    className="brand-form-select"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  >
                    <option value="서울">서울</option>
                    <option value="경기/인천">경기 / 인천</option>
                    <option value="대전/충청">대전 / 충청</option>
                    <option value="부산/경남">부산 / 경남</option>
                    <option value="대구/경북">대구 / 경북</option>
                    <option value="광주/전라">광주 / 전라</option>
                    <option value="기타">기타 지역</option>
                  </select>
                </div>

                <div className="brand-form-group">
                  <label className="brand-form-label" htmlFor="modal-timing">
                    희망 창업 시기
                  </label>
                  <select
                    id="modal-timing"
                    className="brand-form-select"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                  >
                    <option value="즉시">즉시 가능</option>
                    <option value="3개월 이내">3개월 이내</option>
                    <option value="6개월 이내">6개월 이내</option>
                    <option value="상반기/하반기">올해 하반기</option>
                    <option value="미정/시장조사">시장 조사 중</option>
                  </select>
                </div>

                <div className="brand-form-group brand-form-group-full">
                  <label className="brand-form-label" htmlFor="modal-message">
                    문의 내용 (선택)
                  </label>
                  <textarea
                    id="modal-message"
                    className="brand-form-textarea"
                    placeholder="희망 면적, 점포 보유 여부, 궁금하신 사항을 자유롭게 남겨주세요."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              <div className="brand-form-terms">
                <label className="brand-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    required
                  />
                  <span>개인정보 수집 및 가맹 상담 안내를 위한 연락에 동의합니다. (필수)</span>
                </label>
              </div>

              <button
                type="submit"
                className="brand-btn-3d brand-btn-3d-red brand-form-submit-btn"
                disabled={isSubmitting || !formData.name || !formData.phone || !formData.agreed}
              >
                {isSubmitting ? '신청 처리 중...' : '가맹 상담 신청 완료하기'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
