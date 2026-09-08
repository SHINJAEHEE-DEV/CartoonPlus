import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import thinkingMascot from '../../../docs/assets/mascot/mascot_thinking.png';

export function BookRequestForm({ title = '' }: { title?: string }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    const { data: store } = await supabase!.from('stores').select('id').eq('slug', 'snu').single();
    const { error } = await supabase!.from('book_requests').insert({
      store_id: store?.id,
      title: String(form.get('title')),
      author: String(form.get('author')) || null,
      desired_volume: String(form.get('volume')) || null,
      customer_comment: String(form.get('comment')) || null,
    });
    setIsSubmitting(false);
    setMessage(error?.message ?? '도서 입고 신청이 정상 접수되었습니다. 직원이 확인 후 검토합니다!');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '28px',
          background: '#1E1E1E',
          borderRadius: '24px',
          color: '#FFF9EC',
          border: '3px solid #1E1E1E',
          boxShadow: '6px 6px 0 #FED943',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={thinkingMascot} alt="" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.03em' }}>도서 입고 신청</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#CFC7B4' }}>
              연락처와 개인정보는 수집하지 않으며, 도서 정보만 안전하게 전달됩니다.
            </div>
          </div>
        </div>

        <form onSubmit={submit} style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#FED943', marginBottom: '4px' }}>
              도서명 (필수)
            </label>
            <input
              name="title"
              defaultValue={title}
              placeholder="예: 원피스, 체인소맨"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '2px solid #5C5344',
                background: '#2A2A2A',
                color: '#FFF9EC',
                fontSize: '14px',
                fontWeight: 700,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#FED943', marginBottom: '4px' }}>
                작가 / 출판사 (선택)
              </label>
              <input
                name="author"
                placeholder="예: 오다 에이이치로"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '2px solid #5C5344',
                  background: '#2A2A2A',
                  color: '#FFF9EC',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#FED943', marginBottom: '4px' }}>
                희망 권수 (선택)
              </label>
              <input
                name="volume"
                placeholder="예: 1~10권, 최신권"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '2px solid #5C5344',
                  background: '#2A2A2A',
                  color: '#FFF9EC',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#FED943', marginBottom: '4px' }}>
              손님 한마디 (선택)
            </label>
            <textarea
              name="comment"
              rows={3}
              placeholder="직원에게 전하고 싶은 요청 사항이 있다면 적어주세요."
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '2px solid #5C5344',
                background: '#2A2A2A',
                color: '#FFF9EC',
                fontSize: '14px',
                fontWeight: 700,
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '6px',
              padding: '14px 24px',
              borderRadius: '999px',
              background: '#FED943',
              color: '#1E1E1E',
              fontSize: '14px',
              fontWeight: 900,
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? '접수 중...' : '도서 입고 신청 접수 →'}
          </button>
        </form>

        {message && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#FFF9EC',
              color: '#1E1E1E',
              fontWeight: 800,
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            {message}
          </div>
        )}
      </section>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <a href="/books" style={{ fontSize: '13px', fontWeight: 800, color: '#6B6354', textDecoration: 'underline' }}>
          ← 도서 검색으로 돌아가기
        </a>
      </div>
    </div>
  );
}
