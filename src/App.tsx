import { useState } from 'react';
import { MockDataRepository } from './lib/storage';

export default function App() {
  const [selectedStore, setSelectedStore] = useState<'snu' | 'jamsil'>(() => MockDataRepository.getSelectedStore());
  const stores = MockDataRepository.getAllStores();
  const books = MockDataRepository.getBooks();
  const currentStore = MockDataRepository.getStoreById(selectedStore);

  const handleStoreChange = (storeId: 'snu' | 'jamsil') => {
    setSelectedStore(storeId);
    MockDataRepository.setSelectedStore(storeId);
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header Preview */}
      <header className="bg-white border-b border-brand-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐶</span>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-brand-charcoal">
                CARTOON<span className="text-amber-500">PLUS</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-brand-yellowLight text-brand-charcoal font-semibold border border-brand-yellow/30">
                Cafe Lounge
              </span>
            </div>
          </div>

          {/* Store Selector */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreChange(store.id as 'snu' | 'jamsil')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStore === store.id
                    ? 'bg-brand-yellow text-brand-charcoal shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                📍 {store.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-brand-yellow/30 rounded-3xl p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-bold text-amber-700 border border-amber-200 mb-3 shadow-xs">
                ✨ {currentStore?.name} 도서 검색 플랫폼 가동 중
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal tracking-tight leading-tight">
                만화부터 넷플릭스·닌텐도까지,<br />
                <span className="text-amber-600">쉬는 게 제일 즐거워지는 곳</span>
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                총 <strong className="text-brand-charcoal">{books.length}종</strong>의 도서 메타데이터와 실시간 서가 위치를 탐색하세요.
              </p>
            </div>
            <div className="text-6xl animate-bounce">🐶 📚</div>
          </div>
        </div>
      </main>
    </div>
  );
}
