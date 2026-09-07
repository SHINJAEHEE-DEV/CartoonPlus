type BookRequestStartPageProps = { title: string };

export function BookRequestStartPage({ title }: BookRequestStartPageProps) {
  return (
    <main className="app-notice">
      <p className="eyebrow">서울대입구역점</p>
      <h1>도서 입고 신청</h1>
      <p><strong>{title || '찾으시는 도서'}</strong>의 입고 신청을 시작합니다.</p>
      <p>도서명, 작가명, 희망 권수를 입력하는 신청 양식은 다음 입고 신청 기능에서 이어집니다.</p>
      <a href="./">도서 검색으로 돌아가기</a>
    </main>
  );
}
