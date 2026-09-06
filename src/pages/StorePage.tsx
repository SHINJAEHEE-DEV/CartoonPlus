import { MockDataRepository } from '../lib/storage';

export default function StorePage() {
  const stores = MockDataRepository.getAllStores();

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    alert('매장 주소가 클립보드에 복사되었습니다!\n' + addr);
  };

  return (
    <div className="bg-brand-surface min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <div>
          <div className="text-amber-700 font-extrabold text-xs tracking-widest uppercase">
            STORE LOCATIONS
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-charcoal mt-1 tracking-tight">
            카툰플러스 매장 안내
          </h1>
          <p className="text-xs md:text-sm text-brand-muted mt-1">
            서울대입구역점과 잠실점의 위치, 운영시간, 주차 및 편의시설을 안내해 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white border-2 border-brand-charcoal rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Map Preview Placeholder with Bouncing Pin */}
              <div className="h-44 bg-[#EEE6D3] bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px] flex items-center justify-center relative border-b-2 border-brand-charcoal">
                <div className="text-5xl animate-cp-bob-fast drop-shadow-sm select-none">📍</div>
                <span className="absolute bottom-2.5 right-2.5 bg-white border-1.5 border-brand-charcoal rounded-lg text-[10px] font-bold px-2 py-0.5 text-gray-500 shadow-xs">
                  카카오맵 실시간 연동
                </span>
              </div>

              <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-brand-yellow border-1.5 border-brand-charcoal rounded-full text-xs font-black px-3 py-1 text-brand-charcoal">
                      📍 {store.id === 'snu' ? '관악구 직영점' : '송파구 직영점'}
                    </span>
                    <span className="text-xs font-bold text-green-700">● 정상 영업중</span>
                  </div>

                  <h3 className="text-2xl font-black text-brand-charcoal tracking-tight mb-2">
                    {store.name}
                  </h3>

                <div className="space-y-3.5 my-5 text-xs md:text-sm">
                  {/* Address */}
                  <div>
                    <div className="text-gray-400 font-bold text-[11px] mb-0.5">매장 주소</div>
                    <div className="font-extrabold text-brand-charcoal">{store.address}</div>
                    <div className="text-amber-800 font-bold text-xs mt-0.5">{store.subwayInfo}</div>
                  </div>

                  {/* Hours */}
                  <div>
                    <div className="text-gray-400 font-bold text-[11px] mb-0.5">운영 시간</div>
                    <div className="font-extrabold text-brand-charcoal">{store.hours}</div>
                  </div>

                  {/* Phone */}
                  <div>
                    <div className="text-gray-400 font-bold text-[11px] mb-0.5">대표 전화</div>
                    <a
                      href={`tel:${store.phone}`}
                      className="font-black text-brand-charcoal hover:text-amber-800 text-sm inline-flex items-center gap-1"
                    >
                      📞 {store.phone} <span className="text-[11px] font-bold text-gray-400">(클릭 시 전화 연결)</span>
                    </a>
                  </div>

                  {/* Parking */}
                  <div>
                    <div className="text-gray-400 font-bold text-[11px] mb-0.5">주차 안내</div>
                    <div className="font-bold text-gray-700">{store.parking}</div>
                  </div>
                </div>

                {/* Facilities Badges */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-gray-400 font-bold text-[11px] mb-2">구비 편의시설</div>
                  <div className="flex flex-wrap gap-1.5">
                    {store.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="bg-brand-surface border border-gray-200 text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-lg"
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
              <div className="flex gap-2.5 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleCopyAddress(store.address)}
                  className="flex-1 bg-brand-surface hover:bg-gray-100 border-2 border-brand-charcoal text-brand-charcoal font-black text-xs py-3 rounded-xl transition-all"
                >
                  주소 복사
                </button>
                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-brand-charcoal hover:bg-black text-brand-yellow font-black text-xs py-3 rounded-xl text-center border-2 border-brand-charcoal transition-all shadow-xs"
                >
                  🗺️ 카카오맵 길찾기
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
