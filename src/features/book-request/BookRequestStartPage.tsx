import thinkingMascot from '../../assets/mascot_thinking.png';

type BookRequestStartPageProps = { title: string };

export function BookRequestStartPage({ title }: BookRequestStartPageProps) {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '36px 24px',
          background: '#ffffff',
          border: '3px solid #1E1E1E',
          borderRadius: '24px',
          boxShadow: '6px 6px 0 #1E1E1E',
          textAlign: 'center',
        }}
      >
        <img src={thinkingMascot} alt="" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
        <div>
          <div className="section-kicker">BOOK REQUEST</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', marginTop: '4px' }}>
            도서 입고 신청
          </h1>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#1E1E1E', marginTop: '12px' }}>
            <span style={{ color: '#8A6A00', fontWeight: 900 }}>“{title || '찾으시는 도서'}”</span> 입고를 신청하시겠습니까?
          </p>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6354', marginTop: '6px', lineHeight: 1.5 }}>
            개인정보는 수집하지 않으며, 남겨주신 도서 정보는 매장 담당자가 정기 입고 시 우선 검토합니다.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            className="primary-btn"
            href={`/book-request-form?title=${encodeURIComponent(title)}`}
          >
            신청서 작성하기 →
          </a>
          <a
            href="/books"
            className="secondary-btn"
            style={{ color: '#1E1E1E', borderColor: '#1E1E1E' }}
          >
            도서 검색으로 돌아가기
          </a>
        </div>
      </section>
    </div>
  );
}
