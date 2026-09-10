import coffeeMascot from '../../assets/mascot_coffee.png';

const PRICES = [
  { name: '기본 1시간', price: '3,600원', note: '음료 미포함 · 초과 10분당 추가 요금' },
  { name: '1시간 + 기본 음료', price: '6,000원', note: '아메리카노 / 아이스티 / 캔음료 택 1' },
  { name: '2시간 + 기본 음료', price: '9,500원', note: '기본 음료 포함 · 최고 인기' },
  { name: '3시간 + 기본 음료', price: '12,500원', note: '기본 음료 포함' },
  { name: '5시간 + 기본 음료', price: '18,000원', note: '기본 음료 포함' },
  { name: '평일 종일권', price: '20,000원', note: '평일 한정 하루 종일 무제한 이용' },
];

const FNB_ITEMS = [
  '아메리카노',
  '카페라떼 · 바닐라라떼',
  '에이드 · 스무디',
  '캔음료 · 아이스티',
  '김치볶음밥 · 치킨마요',
  '핫도그 · 소떡소떡',
  '과자 · 스낵류',
  '한강 즉석 라면',
];

export function MenuPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div className="section-kicker">PRICE & MENU</div>
        <h1 className="section-title">메뉴 · 요금</h1>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B6354', marginTop: '6px' }}>
          이용 요금은 키오스크 현장 결제 기준입니다. 기본 음료 외 메뉴는 차액 결제로 업그레이드할 수 있습니다.
        </p>
      </div>

      {/* 요금제 카드 그리드 */}
      <div className="price-grid">
        {PRICES.map((p) => (
          <div key={p.name} className="price-card">
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '-0.02em' }}>{p.name}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B6354', marginTop: '4px' }}>
                {p.note}
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, whiteSpace: 'nowrap' }}>{p.price}</div>
          </div>
        ))}
      </div>

      {/* F&B 식음료 + 한강 라면 무제한 토핑 바 (2열 그리드) */}
      <div className="home-split">
        {/* F&B */}
        <div className="fnb-box">
          <div style={{ fontSize: '16px', fontWeight: 900 }}>식음료 (F&B)</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FNB_ITEMS.map((f) => (
              <span
                key={f}
                style={{
                  padding: '9px 14px',
                  borderRadius: '999px',
                  background: '#ffffff',
                  border: '2px solid #1E1E1E',
                  fontSize: '13px',
                  fontWeight: 800,
                }}
              >
                {f}
              </span>
            ))}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B6354', marginTop: '4px' }}>
            메뉴 가격은 매장 셀프바 전용 키오스크에서 확인 후 별도 결제합니다.
          </div>
        </div>

        {/* 한강 라면 다크 카드 */}
        <div className="banner-card-dark">
          <img
            src={coffeeMascot}
            alt="라면/커피 마스코트"
            style={{ width: '72px', height: '72px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', color: '#FED943' }}>
              ALWAYS ON
            </div>
            <div style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '-0.02em', marginTop: '4px' }}>
              한강 즉석 라면 무제한 무료 토핑 바
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#CFC7B4', marginTop: '6px', lineHeight: 1.5 }}>
              라면 주문 시 대파, 숙주나물, 떡사리, 계란을 무제한 무료로 제공합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
