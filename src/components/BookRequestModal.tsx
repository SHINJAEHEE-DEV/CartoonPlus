import { useState } from 'react';
import { MockDataRepository } from '../lib/storage';
import { getAssetUrl } from '../lib/assets';

interface BookRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStoreId?: 'snu' | 'jamsil';
  prefilledTitle?: string;
}

export default function BookRequestModal({
  isOpen,
  onClose,
  defaultStoreId = 'snu',
  prefilledTitle = '',
}: BookRequestModalProps) {
  const [storeId, setStoreId] = useState<'snu' | 'jamsil'>(defaultStoreId);
  const [title, setTitle] = useState(prefilledTitle);
  const [author, setAuthor] = useState('');
  const [volumeRange, setVolumeRange] = useState('');
  const [userComment, setUserComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('신청 도서명을 입력해 주세요.');
      return;
    }

    MockDataRepository.createBookRequest({
      storeId,
      title: title.trim(),
      author: author.trim() || undefined,
      volumeRange: volumeRange.trim() || undefined,
      userComment: userComment.trim() || undefined,
    });

    setIsSubmitted(true);
    setErrorMessage('');
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setTitle('');
    setAuthor('');
    setVolumeRange('');
    setUserComment('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-brand-charcoal rounded-3xl max-w-lg w-full p-7 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        {!isSubmitted ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-brand-yellow border-1.5 border-brand-charcoal rounded-full text-xs font-extrabold px-3 py-1">
                📥 BOOK REQUEST
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="text-2xl text-gray-500 hover:text-brand-charcoal transition-colors leading-none"
              >
                ✕
              </button>
            </div>
            <h3 className="text-2xl font-black text-brand-charcoal tracking-tight">희망도서 입고 신청</h3>
            <p className="text-xs md:text-sm text-brand-muted mt-1 mb-5">
              회원가입·로그인 없이 신청할 수 있습니다. 도서명만 필수입니다.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border-1.5 border-red-300 rounded-xl text-xs font-bold text-red-700">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Target Store */}
              <div>
                <label className="block text-xs font-extrabold text-brand-charcoal mb-1.5">희망 지점</label>
                <div className="grid grid-cols-2 bg-brand-surface border-2 border-brand-charcoal rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setStoreId('snu')}
                    className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                      storeId === 'snu'
                        ? 'bg-brand-yellow text-brand-charcoal shadow-xs'
                        : 'text-gray-500 hover:text-brand-charcoal'
                    }`}
                  >
                    📍 서울대입구역점
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoreId('jamsil')}
                    className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                      storeId === 'jamsil'
                        ? 'bg-brand-yellow text-brand-charcoal shadow-xs'
                        : 'text-gray-500 hover:text-brand-charcoal'
                    }`}
                  >
                    📍 잠실점
                  </button>
                </div>
              </div>

              {/* Book Title */}
              <div>
                <label className="block text-xs font-extrabold text-brand-charcoal mb-1.5">
                  신청 도서명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 블루 록, 단다단, 체인소 맨"
                  className="w-full border-2 border-brand-charcoal rounded-xl px-3.5 py-2.5 text-sm font-bold text-brand-charcoal bg-white outline-hidden focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              {/* Author & Volume */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-brand-charcoal mb-1.5">작가 / 출판사</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="카네시로 무네유키"
                    className="w-full border-2 border-brand-charcoal rounded-xl px-3.5 py-2.5 text-sm font-medium text-brand-charcoal bg-white outline-hidden focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-brand-charcoal mb-1.5">희망 권수</label>
                  <input
                    type="text"
                    value={volumeRange}
                    onChange={(e) => setVolumeRange(e.target.value)}
                    placeholder="1~28권, 최신권"
                    className="w-full border-2 border-brand-charcoal rounded-xl px-3.5 py-2.5 text-sm font-medium text-brand-charcoal bg-white outline-hidden focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs font-extrabold text-brand-charcoal mb-1.5">손님 한마디</label>
                <input
                  type="text"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="축구 만화가 보고 싶어요! 빠른 입고 부탁드립니다."
                  className="w-full border-2 border-brand-charcoal rounded-xl px-3.5 py-2.5 text-sm font-medium text-brand-charcoal bg-white outline-hidden focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-28 border-2 border-brand-charcoal bg-white hover:bg-gray-100 text-brand-charcoal font-extrabold text-sm py-3 rounded-xl transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-charcoal hover:bg-black text-brand-yellow font-black text-sm py-3 rounded-xl transition-all shadow-md active:scale-98"
                >
                  신청 접수하기
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Complete View */
          <div className="text-center py-4">
            <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center">
              <img
                src={getAssetUrl('/assets/9b6c63f7-8550-4612-92df-5dbcdff51ec3.png')}
                alt="접수 완료 마스코트"
                className="w-20 animate-cp-bob"
              />
            </div>
            <h3 className="text-2xl font-black text-brand-charcoal tracking-tight mb-2">신청이 접수되었습니다!</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-sm mx-auto mb-4">
              직원이 검토 후 <strong>주문완료 → 입고완료</strong> 순으로 처리합니다.<br />
              입고 완료 시 도서 검색에서 서가 위치가 즉시 노출됩니다.
            </p>
            <div className="bg-brand-surface border-2 border-brand-charcoal rounded-xl py-2.5 px-4 text-xs font-extrabold text-brand-charcoal mb-5 inline-block">
              현재 상태: <span className="text-amber-600">접수/검토중 (PENDING)</span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-brand-yellow hover:bg-brand-yellowHover text-brand-charcoal font-black text-sm py-3 rounded-xl border-2 border-brand-charcoal transition-all shadow-md"
            >
              확인 닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
