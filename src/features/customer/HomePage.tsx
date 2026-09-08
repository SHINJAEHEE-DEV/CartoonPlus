import relaxingMascot from '../../../docs/assets/mascot/mascot_relaxing.png';
import readingMascot from '../../../docs/assets/mascot/mascot_reading.png';
import gamingMascot from '../../../docs/assets/mascot/mascot_gaming.png';
import coffeeMascot from '../../../docs/assets/mascot/mascot_coffee.png';
import thinkingMascot from '../../../docs/assets/mascot/mascot_thinking.png';
import { useEffect, useState } from 'react';
import { loadNewArrivals } from '../book-search/catalogueRepository';
import type { SearchableBook } from '../../lib/bookSearch';

export function HomePage(){
  const [newBooks, setNewBooks] = useState<SearchableBook[]>([]);
  useEffect(() => { void loadNewArrivals().then((books) => setNewBooks(books.slice(0, 3))); }, []);
  return <>
    <style>{'.feature-grid a{position:relative;overflow:hidden}.feature-art{width:55px;height:55px;padding:5px;border:2px solid #1e1e1e;border-radius:15px;background:#fff3c9;object-fit:contain}.feature-grid a:nth-child(2) .feature-art{background:#fed943}.feature-grid a:nth-child(3) .feature-art{background:#fff}.feature-grid a:nth-child(4) .feature-art{background:#f7ddd8}'}</style>
    <section className="hero"><div><p className="hero-badge">서울대입구역점</p><h1>만화, 게임, 그리고<br/>제대로 쉬는 시간</h1><p>수만 권의 만화와 게임, 편안한 좌석에서 하루를 쉬어 가세요.</p><div className="hero-actions"><a className="primary-action" href="/books">도서 검색하기 <span>→</span></a><a className="secondary-action" href="/store">매장 안내</a></div></div><div className="hero-mascot"><img src={relaxingMascot} alt="휴식 중인 카툰플러스 마스코트"/></div></section>
    <section className="feature-section"><p className="section-kicker">WHAT TO ENJOY</p><h2>네 가지 방식으로<br/>쉬어 가세요.</h2><div className="feature-grid"><a href="/books"><img className="feature-art" src={readingMascot} alt=""/><b>01</b><strong>도서 검색</strong><span>서가 위치와 보유 권수를 확인해요.</span><em>도서 찾기 →</em></a><a href="/games"><img className="feature-art" src={gamingMascot} alt=""/><b>02</b><strong>즐길거리</strong><span>검증된 게임 목록을 안내해요.</span><em>게임 보기 →</em></a><a href="/menu"><img className="feature-art" src={coffeeMascot} alt=""/><b>03</b><strong>메뉴·요금</strong><span>확인된 이용 정보를 확인해요.</span><em>메뉴 보기 →</em></a><a href="/store"><img className="feature-art" src={thinkingMascot} alt=""/><b>04</b><strong>매장 안내</strong><span>오시는 길과 이용 가이드를 봐요.</span><em>매장 보기 →</em></a></div></section>
    <section className="new-arrivals"><div className="section-heading"><div><p className="section-kicker">NEW ARRIVALS</p><h2>최근 30일 신규 입고</h2></div><a href="/new-arrivals">전체 보기 →</a></div>{newBooks.length ? <div className="new-book-grid">{newBooks.map(book => <article key={book.id}><div><b>NEW</b><span>{book.category || '미분류'}</span></div><h3>{book.title}</h3><p>{book.author || '작가 정보 없음'}</p><small>{book.volumeRange} · {book.shelfLocation || '서가 확인 중'}</small></article>)}</div> : <p className="empty-inline">새로 등록된 도서를 준비하고 있습니다.</p>}</section>
    <section className="home-pairs"><a className="home-panel price-panel" href="/menu"><p>MENU & PRICE</p><h2>이용 요금과<br/>메뉴를 확인하세요</h2><span>전체 요금·메뉴 보기 →</span></a><a className="home-panel dark-panel" href="/events"><p>EVENTS</p><h2>매장 이벤트와<br/>공지사항</h2><span>이벤트·공지 보기 →</span></a></section>
  </>;
}
