import { useState, useEffect } from 'react';
import { MASCOT_ASSETS } from '../../lib/brandAssets';
import type { StoreSlug } from '../../lib/storeContext';
import { submitBookRequest } from './bookRequestRepository';

export type BookRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  storeSlug?: StoreSlug;
};

export function BookRequestModal({
  isOpen,
  onClose,
  initialTitle = '',
  storeSlug = 'snu',
}: BookRequestModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState('');
  const [volume, setVolume] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // initialTitle이 변경될 때 상태 동기화
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setIsSuccess(false);
      setErrorMessage('');
    }
  }, [isOpen, initialTitle]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const res = await submitBookRequest(storeSlug, {
      title,
      author,
      desiredVolume: volume,
      customerComment: comment,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setTitle('');
      setAuthor('');
      setVolume('');
      setComment('');
    } else {
      setErrorMessage(res.error ?? '신청 중 오류가 발생했습니다.');
    }
  };


  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="book-request-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-request-modal-title"
    >
      <div className="book-request-modal-card">
        {/* 상단 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="book-request-modal-close"
          aria-label="모달 닫기"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isSuccess ? (
          /* 성공 완료 상태 */
          <div className="book-request-success-view">
            <img
              src={MASCOT_ASSETS.reading}
              alt="책 읽는 마스코트"
              className="book-request-success-mascot"
            />
            <div className="book-request-success-badge">REQUEST RECEIVED!</div>
            <h2 id="book-request-modal-title" className="book-request-success-title">
              도서 입고 신청이 접수되었습니다!
            </h2>
            <p className="book-request-success-desc">
              남겨주신 도서 정보는 매장 담당자가 정기 도서 입고 시 최우선으로 검토합니다.
              <br />
              개인정보는 수집하지 않으며, 입고 상황은 카운터 또는 신간 알림에서 확인하실 수 있습니다.
            </p>
            <div className="book-request-success-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
              >
                확인 완료
              </button>
            </div>
          </div>
        ) : (
          /* 신청 폼 */
          <div>
            <div className="book-request-modal-header">
              <img
                src={MASCOT_ASSETS.thinking}
                alt=""
                className="book-request-modal-mascot"
              />
              <div>
                <div className="section-kicker">BOOK REQUEST</div>
                <h2 id="book-request-modal-title" className="book-request-modal-title">
                  도서 입고 신청
                </h2>
                <p className="book-request-modal-subtitle">
                  찾으시는 도서가 없으신가요? 1분만에 간편하게 신청해 주세요!
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="book-request-modal-form">
              <div className="book-request-field">
                <label htmlFor="req-title" className="book-request-label">
                  도서명 <span style={{ color: '#E03E3E' }}>*</span>
                </label>
                <input
                  id="req-title"
                  type="text"
                  required
                  placeholder="예: 원피스, 주술회전, 나의 히어로 아카데미아"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="book-request-input"
                  autoFocus
                />
              </div>

              <div className="book-request-grid-2">
                <div className="book-request-field">
                  <label htmlFor="req-author" className="book-request-label">
                    작가 / 출판사 (선택)
                  </label>
                  <input
                    id="req-author"
                    type="text"
                    placeholder="예: 오다 에이이치로 / 대원씨아이"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="book-request-input"
                  />
                </div>

                <div className="book-request-field">
                  <label htmlFor="req-volume" className="book-request-label">
                    희망 권수 (선택)
                  </label>
                  <input
                    id="req-volume"
                    type="text"
                    placeholder="예: 1~10권, 최신간, 완결까지"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="book-request-input"
                  />
                </div>
              </div>

              <div className="book-request-field">
                <label htmlFor="req-comment" className="book-request-label">
                  손님 한마디 (선택)
                </label>
                <textarea
                  id="req-comment"
                  rows={2}
                  placeholder="예: 친구랑 같이 보고 싶어요! 전권 입고 부탁드려요."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="book-request-textarea"
                />
              </div>

              <div className="book-request-notice">
                🔒 연락처 등 개인정보는 일절 수집하지 않으며, 도서 정보만 안전하게 전달됩니다.
              </div>

              {errorMessage && (
                <div className="book-request-error-alert" role="alert">
                  {errorMessage}
                </div>
              )}

              <div className="book-request-footer">
                <button
                  type="button"
                  onClick={onClose}
                  className="secondary-btn"
                  style={{ flex: '1', padding: '12px' }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="primary-btn"
                  style={{ flex: '2', padding: '12px 20px' }}
                >
                  {isSubmitting ? '신청 접수 중...' : '입고 신청 완료 →'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
