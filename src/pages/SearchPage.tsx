import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MockDataRepository } from '../lib/storage';
import { normalizeTitle } from '../lib/hangul';

interface SearchPageProps {
  selectedStore: 'snu' | 'jamsil';
  onOpenBookRequest: (prefilledTitle?: string) => void;
}

export default function SearchPage({ selectedStore, onOpenBookRequest }: SearchPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('전체');
  const [sortBy, setSortBy] = useState<'latest' | 'title' | 'volume'>('title');

  const genres = ['전체', '웹툰', '코믹스', '순정', '판타지', '스포츠', '일상', '마블DC', '어린이/학습'];
  const currentStore = MockDataRepository.getStoreById(selectedStore);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const results = useMemo(() => {
    let items = MockDataRepository.getBookSearchResults(selectedStore, query, selectedGenre);

    // Sorting
    if (sortBy === 'title') {
      items.sort((a, b) => a.book.title.localeCompare(b.book.title, 'ko'));
    } else if (sortBy === 'volume') {
      items.sort((a, b) => b.inventory.volumeRange.localeCompare(a.inventory.volumeRange, 'ko'));
    } else if (sortBy === 'latest') {
      items.sort((a, b) => (b.inventory.updatedAt || '').localeCompare(a.inventory.updatedAt || ''));
    }

    return items;
  }, [selectedStore, query, selectedGenre, sortBy]);

  const normalizedQueryTag = query.trim() ? normalizeTitle(query.trim()) : '';

  return (
    <div className="bg-brand-surface min-h-screen">
      {/* Search Header Banner */}
      <section className="bg-white border-b-2 border-brand-charcoal py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-black text-brand-charcoal tracking-tight">
            스마트 도서 검색
          </h1>
          <p className="text-xs md:text-sm text-brand-muted mt-1 mb-5">
            공백 무시 · 초성 검색 지원 — <strong className="text-brand-charcoal">체인소맨</strong> = <strong className="text-brand-charcoal">체인소 맨</strong> = <strong className="text-brand-charcoal">ㅊㅇㅅㅁ</strong>
          </p>

          {/* Search Box */}
          <div className="border-2.5 border-brand-charcoal rounded-2xl p-2 md:p-3 flex items-center gap-2.5 bg-brand-surface shadow-md">
            <span className="text-xl pl-2">🔎</span>
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="도서명, 작가명, 한글 초성 (예: 체인소맨, ㄱㅁㅇㅋㄴ, 오다 에이치로)"
              className="flex-1 text-base md:text-lg font-bold text-brand-charcoal bg-transparent outline-hidden min-w-0"
              autoFocus
            />
            {normalizedQueryTag && (
              <span className="hidden sm:inline-block text-xs font-black bg-brand-yellowSoft border border-brand-charcoal rounded-lg px-2.5 py-1 text-amber-950">
                정규화 → {normalizedQueryTag}
              </span>
            )}
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                className="text-gray-400 hover:text-black font-bold text-sm px-2"
              >
                ✕
              </button>
            )}
          </div>

          {/* Genre Filters & Sort Options */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5">
            {/* Genre Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {genres.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all border-2 border-brand-charcoal ${
                    selectedGenre === g
                      ? 'bg-brand-charcoal text-brand-yellow shadow-xs'
                      : 'bg-white text-brand-charcoal hover:bg-gray-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 shrink-0">
              <span>정렬:</span>
              <button
                type="button"
                onClick={() => setSortBy('title')}
                className={`transition-colors ${sortBy === 'title' ? 'text-brand-charcoal font-black underline' : 'hover:text-black'}`}
              >
                가나다순
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setSortBy('latest')}
                className={`transition-colors ${sortBy === 'latest' ? 'text-brand-charcoal font-black underline' : 'hover:text-black'}`}
              >
                최신순
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setSortBy('volume')}
                className={`transition-colors ${sortBy === 'volume' ? 'text-brand-charcoal font-black underline' : 'hover:text-black'}`}
              >
                권수순
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Area */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm md:text-base text-brand-charcoal">
              검색 결과 <span className="text-amber-700 font-extrabold">{results.length}</span>건
            </span>
            <span className="text-xs font-bold text-brand-muted">
              ({currentStore?.name})
            </span>
          </div>
          <span className="text-xs text-brand-muted hidden sm:inline">
            표지 없는 텍스트 카드 · 권수와 서가 위치 중심
          </span>
        </div>

        {/* Book Cards Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(({ book, inventory }) => (
              <div
                key={inventory.id}
                className="bg-white border-2 border-brand-charcoal rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-brand-charcoal text-brand-yellow text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {book.category}
                    </span>
                    <span className="border border-brand-charcoal text-brand-charcoal text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      보유중
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-brand-charcoal tracking-tight mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-brand-muted mb-4 font-medium">
                    {book.author} {book.publisher ? `· ${book.publisher}` : ''}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-brand-yellowSoft border border-brand-charcoal text-brand-charcoal text-xs font-extrabold px-3 py-1.5 rounded-xl">
                      보유: {inventory.volumeRange}
                    </span>
                    <span className="bg-brand-yellow border-2 border-brand-charcoal text-brand-charcoal text-xs font-black px-3 py-1.5 rounded-xl shadow-xs">
                      📍 {inventory.shelfLocation}
                    </span>
                  </div>
                  {inventory.note && (
                    <div className="text-[11px] text-red-600 font-bold mt-2">
                      ⚠️ {inventory.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search Results State */
          <div className="bg-white border-2 border-dashed border-brand-charcoal rounded-3xl p-8 md:p-12 text-center my-6">
            <img
              src="/assets/ef0d4add-14d7-4466-9c5b-94a62f2b8d5b.png"
              alt="검색 결과 없음"
              className="w-24 h-24 mx-auto mb-4 animate-cp-wiggle"
            />
            <h3 className="text-xl font-black text-brand-charcoal tracking-tight mb-2">
              '{query}' 검색 결과가 없습니다
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
              띄어쓰기를 바꾸거나 초성(예: ㅊㅇㅅㅁ)으로 다시 검색해 보세요.<br />
              매장에 없는 도서는 로그인 없이 <strong>간편하게 입고 신청</strong>하실 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => onOpenBookRequest(query)}
              className="bg-brand-charcoal hover:bg-black text-brand-yellow font-black text-sm px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-98"
            >
              📥 희망도서 입고 신청하기
            </button>
          </div>
        )}

        {/* Bottom Helper Box */}
        <div className="mt-8 bg-white border-2 dashed border-brand-charcoal rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💡</span>
            <div>
              <div className="font-black text-sm text-brand-charcoal">찾으시는 책이 매장에 없으신가요?</div>
              <div className="text-xs text-brand-muted">손님이 신청해주시면 직원이 검토 후 신속히 발주합니다.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenBookRequest(query)}
            className="w-full sm:w-auto bg-brand-yellow hover:bg-brand-yellowHover text-brand-charcoal font-black text-xs md:text-sm px-5 py-3 rounded-xl border-2 border-brand-charcoal transition-all shadow-xs shrink-0"
          >
            📥 도서 입고 신청
          </button>
        </div>
      </section>
    </div>
  );
}
