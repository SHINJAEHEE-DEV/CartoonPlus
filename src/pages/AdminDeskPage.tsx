import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MockDataRepository } from '../lib/storage';
import { BookRequest, BookRequestStatus } from '../types/domain';

export default function AdminDeskPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'BCAST' | 'INV' | 'REQ' | 'BULK'>('BCAST');
  const [selectedStore, setSelectedStore] = useState<'snu' | 'jamsil'>(() => user?.storeId || 'snu');

  // TTS State
  const [customText, setCustomText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTitle, setPlayingTitle] = useState('');

  // Inventory Table State
  const [invSearch, setInvSearch] = useState('');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newBookForm, setNewBookForm] = useState({
    title: '',
    author: '',
    category: '코믹스',
    volumeRange: '1권~',
    shelfLocation: 'A-01 서가',
    note: '',
  });

  // Inline editing state: { [invId]: { shelfLocation, volumeRange } }
  const [editingInvId, setEditingInvId] = useState<string | null>(null);
  const [editShelf, setEditShelf] = useState('');
  const [editVol, setEditVol] = useState('');

  // Book Requests State
  const [reqFilter, setReqFilter] = useState<'ALL' | BookRequestStatus>('ALL');
  const [requests, setRequests] = useState<BookRequest[]>([]);

  // Bulk Upload State
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkReport, setBulkReport] = useState<{ total: number; success: number } | null>(null);

  // Sync state
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setRequests(MockDataRepository.getBookRequests(selectedStore));
  }, [selectedStore, refreshKey]);

  const presets = MockDataRepository.getBroadcastPresets();
  const currentStore = MockDataRepository.getStoreById(selectedStore);

  // 1. Audio Announcement (Web Speech TTS)
  const speakKorean = (text: string, title: string = '안내 방송') => {
    if (!('speechSynthesis' in window)) {
      alert('현재 브라우저가 Web Speech TTS를 지원하지 않습니다.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95; // Clear natural speed
    utterance.pitch = 1.0;

    // Try finding a natural Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find(v => v.lang.startsWith('ko'));
    if (koVoice) {
      utterance.voice = koVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setPlayingTitle(title);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setPlayingTitle('');
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setPlayingTitle('');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setPlayingTitle('');
  };

  // 2. Inventory Management
  const inventoryList = useMemo(() => {
    return MockDataRepository.getBookSearchResults(selectedStore, invSearch);
  }, [selectedStore, invSearch, refreshKey]);

  const handleStartEdit = (invId: string, shelf: string, vol: string) => {
    setEditingInvId(invId);
    setEditShelf(shelf);
    setEditVol(vol);
  };

  const handleSaveEdit = (invId: string) => {
    MockDataRepository.updateInventory(invId, {
      shelfLocation: editShelf,
      volumeRange: editVol,
    });
    setEditingInvId(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookForm.title.trim()) {
      alert('도서명을 입력해 주세요.');
      return;
    }

    MockDataRepository.addSingleBook(selectedStore, newBookForm);
    setIsAddBookModalOpen(false);
    setNewBookForm({
      title: '',
      author: '',
      category: '코믹스',
      volumeRange: '1권~',
      shelfLocation: 'A-01 서가',
      note: '',
    });
    setRefreshKey(prev => prev + 1);
    alert('신규 도서가 성공적으로 등록되었습니다!');
  };

  const handleDeleteInv = (invId: string, bookTitle: string) => {
    if (window.confirm(`'${bookTitle}' 도서 재고를 삭제하시겠습니까?`)) {
      MockDataRepository.removeInventory(invId);
      setRefreshKey(prev => prev + 1);
    }
  };

  // 3. Book Request Handling
  const handleRequestStatusChange = (reqId: string, status: BookRequestStatus, reqItem: BookRequest) => {
    const reply = window.prompt(
      `상태를 '${status}'(으)로 변경합니다. 관리자 메모/피드백을 입력하세요:`,
      reqItem.adminReply || ''
    );
    if (reply !== null) {
      MockDataRepository.updateBookRequestStatus(reqId, status, reply);
      setRefreshKey(prev => prev + 1);

      // If COMPLETED, prefill new book modal
      if (status === 'COMPLETED') {
        setNewBookForm({
          title: reqItem.title,
          author: reqItem.author || '',
          category: '코믹스',
          volumeRange: reqItem.volumeRange || '1권~',
          shelfLocation: 'A-01 서가',
          note: `손님 입고신청(${reqItem.userComment || ''}) 입고 완료`,
        });
        setIsAddBookModalOpen(true);
      }
    }
  };

  // 4. Bulk CSV Parser
  const handleBulkImport = () => {
    if (!bulkCsvText.trim()) {
      alert('CSV 내용을 입력해 주세요.');
      return;
    }

    const lines = bulkCsvText.trim().split('\n');
    let successCount = 0;

    for (const line of lines) {
      const parts = line.split(',').map(s => s.replace(/"/g, '').trim());
      if (parts.length >= 2 && parts[0] !== 'title' && parts[0] !== '도서명') {
        const title = parts[0];
        const shelf = parts[1] ? `${parts[1]}번 서가` : '카운터 문의';
        const genre = parts[2] || '코믹스';
        const author = parts[3] || '미상';

        MockDataRepository.addSingleBook(selectedStore, {
          title,
          author,
          category: genre,
          volumeRange: '1권~',
          shelfLocation: shelf,
        });
        successCount++;
      }
    }

    setBulkReport({ total: lines.length, success: successCount });
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="bg-brand-surface min-h-screen pb-16">
      {/* Top Console Bar */}
      <div className="bg-brand-charcoal text-white border-b-2 border-brand-charcoal">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <div className="font-black text-base text-brand-yellow">직원 관리 콘솔 (Staff Desk)</div>
              <div className="text-xs text-gray-400">
                로그인: <b className="text-white">{user?.username}</b> ({user?.role})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Store Switcher */}
            <div className="flex bg-white/10 p-1 rounded-xl border border-white/20">
              <button
                type="button"
                onClick={() => setSelectedStore('snu')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  selectedStore === 'snu'
                    ? 'bg-brand-yellow text-brand-charcoal'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                서울대입구역점
              </button>
              <button
                type="button"
                onClick={() => setSelectedStore('jamsil')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  selectedStore === 'jamsil'
                    ? 'bg-brand-yellow text-brand-charcoal'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                잠실점
              </button>
            </div>

            <button
              type="button"
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Nav Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('BCAST')}
            className={`py-3.5 px-4 rounded-2xl font-black text-sm border-2 border-brand-charcoal transition-all shadow-xs flex items-center justify-center gap-2 ${
              activeTab === 'BCAST'
                ? 'bg-brand-yellow text-brand-charcoal shadow-md scale-102'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📢 원클릭 안내 방송
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('INV')}
            className={`py-3.5 px-4 rounded-2xl font-black text-sm border-2 border-brand-charcoal transition-all shadow-xs flex items-center justify-center gap-2 ${
              activeTab === 'INV'
                ? 'bg-brand-yellow text-brand-charcoal shadow-md scale-102'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📚 도서 재고 관리 ({inventoryList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REQ')}
            className={`py-3.5 px-4 rounded-2xl font-black text-sm border-2 border-brand-charcoal transition-all shadow-xs flex items-center justify-center gap-2 ${
              activeTab === 'REQ'
                ? 'bg-brand-yellow text-brand-charcoal shadow-md scale-102'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📥 입고 신청 검토 ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('BULK')}
            className={`py-3.5 px-4 rounded-2xl font-black text-sm border-2 border-brand-charcoal transition-all shadow-xs flex items-center justify-center gap-2 ${
              activeTab === 'BULK'
                ? 'bg-brand-yellow text-brand-charcoal shadow-md scale-102'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 엑셀 일괄 업로드
          </button>
        </div>

        {/* TAB 1: 📢 TTS ANNOUNCEMENT CONSOLE */}
        {activeTab === 'BCAST' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Playback Audio Status Bar */}
            <div className="bg-brand-charcoal text-white rounded-3xl p-6 border-2 border-brand-charcoal shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${isPlaying ? 'bg-green-400 animate-ping' : 'bg-gray-500'}`} />
                <div>
                  <div className="text-xs font-bold text-gray-400">매장 스피커 송출 상태</div>
                  <div className="text-lg font-black text-brand-yellow">
                    {isPlaying ? `🔊 방송 송출 중: [${playingTitle}]` : '대기 상태 (준비 완료)'}
                  </div>
                </div>
              </div>
              {isPlaying && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="bg-red-500 hover:bg-red-600 text-white font-black text-xs px-5 py-2.5 rounded-xl border border-white/20"
                >
                  ⏹️ 방송 즉시 정지
                </button>
              )}
            </div>

            {/* 6 One-Click Presets Grid */}
            <div className="bg-white border-2 border-brand-charcoal rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-black text-brand-charcoal tracking-tight mb-2">
                ⚡ 원클릭 표준 안내 방송 프리셋
              </h3>
              <p className="text-xs text-brand-muted mb-6">
                버튼을 누르면 번역기 입력 없이 브라우저 내장 Web Speech TTS로 매장 스피커에 즉시 음성이 송출됩니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="bg-brand-surface border-2 border-brand-charcoal rounded-2xl p-5 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-base text-brand-charcoal">{preset.title}</span>
                        <span className="bg-brand-yellowSoft border border-brand-charcoal text-brand-charcoal text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          한국어 TTS
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        "{preset.messageText}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakKorean(preset.messageText, preset.title)}
                      className="w-full bg-brand-yellow hover:bg-brand-yellowHover text-brand-charcoal font-black text-xs py-3 rounded-xl border-2 border-brand-charcoal shadow-xs transition-all active:scale-98"
                    >
                      📢 즉시 방송하기
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Announcement Box */}
            <div className="bg-white border-2 border-brand-charcoal rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-black text-brand-charcoal tracking-tight mb-2">
                ✍️ 커스텀 공지 텍스트 즉시 방송
              </h3>
              <p className="text-xs text-brand-muted mb-4">
                손님 호출, 룸 안내 등 원하는 안내 멘트를 자유롭게 입력하고 즉시 스피커로 방송하세요.
              </p>

              <div className="space-y-3">
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="예: 3번 닌텐도 룸 손님, 카운터로 잠시 와주시기 바랍니다. 감사합니다."
                  rows={3}
                  className="w-full border-2 border-brand-charcoal rounded-2xl p-4 text-sm font-bold text-brand-charcoal outline-hidden focus:ring-2 focus:ring-brand-yellow"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-bold">{customText.length}자 입력됨</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customText.trim()) return alert('방송할 문장을 입력해 주세요.');
                      speakKorean(customText, '직원 커스텀 공지');
                    }}
                    className="bg-brand-charcoal hover:bg-black text-brand-yellow font-black text-sm px-6 py-3 rounded-xl border-2 border-brand-charcoal transition-all shadow-md active:scale-98"
                  >
                    📢 커스텀 텍스트 송출
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 📚 INVENTORY MANAGEMENT */}
        {activeTab === 'INV' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Action Bar */}
            <div className="bg-white border-2 border-brand-charcoal rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={invSearch}
                  onChange={(e) => setInvSearch(e.target.value)}
                  placeholder="도서명 또는 작가 검색..."
                  className="w-full border-2 border-brand-charcoal rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-black text-brand-charcoal">
                  총 {inventoryList.length}종 도서
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(true)}
                  className="bg-brand-charcoal hover:bg-black text-brand-yellow font-black text-xs px-4 py-2.5 rounded-xl border-2 border-brand-charcoal transition-all shadow-xs"
                >
                  + 신규 도서 등록
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border-2 border-brand-charcoal rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-surface border-b-2 border-brand-charcoal font-black text-brand-charcoal">
                    <tr>
                      <th className="p-3.5">도서명</th>
                      <th className="p-3.5">작가</th>
                      <th className="p-3.5">장르</th>
                      <th className="p-3.5">보유 권수</th>
                      <th className="p-3.5">서가 위치</th>
                      <th className="p-3.5 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inventoryList.slice(0, 100).map(({ book, inventory }) => {
                      const isEditing = editingInvId === inventory.id;

                      return (
                        <tr key={inventory.id} className="hover:bg-amber-50/50 transition-colors">
                          <td className="p-3.5 font-black text-brand-charcoal max-w-xs truncate">
                            {book.title}
                          </td>
                          <td className="p-3.5 text-gray-600 max-w-[120px] truncate">{book.author}</td>
                          <td className="p-3.5">
                            <span className="bg-gray-100 border border-gray-300 text-gray-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                              {book.category}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editVol}
                                onChange={(e) => setEditVol(e.target.value)}
                                className="w-24 border-2 border-brand-charcoal rounded-lg p-1 text-xs font-bold"
                              />
                            ) : (
                              <span className="font-extrabold text-amber-900 bg-brand-yellowSoft px-2 py-0.5 rounded-md border border-brand-yellow">
                                {inventory.volumeRange}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editShelf}
                                onChange={(e) => setEditShelf(e.target.value)}
                                className="w-28 border-2 border-brand-charcoal rounded-lg p-1 text-xs font-bold"
                              />
                            ) : (
                              <span className="bg-brand-yellow border border-brand-charcoal px-2 py-0.5 rounded-md font-black text-brand-charcoal">
                                📍 {inventory.shelfLocation}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(inventory.id)}
                                className="bg-green-600 text-white font-bold px-2.5 py-1 rounded-lg hover:bg-green-700"
                              >
                                저장
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartEdit(inventory.id, inventory.shelfLocation, inventory.volumeRange)}
                                className="bg-brand-surface hover:bg-gray-200 border border-brand-charcoal text-brand-charcoal font-bold px-2.5 py-1 rounded-lg"
                              >
                                수정
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteInv(inventory.id, book.title)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2 py-1 rounded-lg"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 📥 BOOK REQUESTS MANAGEMENT */}
        {activeTab === 'REQ' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {(['ALL', 'PENDING', 'ORDERED', 'COMPLETED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setReqFilter(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-brand-charcoal transition-all ${
                    reqFilter === st
                      ? 'bg-brand-charcoal text-brand-yellow'
                      : 'bg-white text-brand-charcoal hover:bg-gray-100'
                  }`}
                >
                  {st === 'ALL' && '전체 신청'}
                  {st === 'PENDING' && '접수/검토중 (PENDING)'}
                  {st === 'ORDERED' && '주문완료 (ORDERED)'}
                  {st === 'COMPLETED' && '입고완료 (COMPLETED)'}
                  {st === 'REJECTED' && '입고불가 (REJECTED)'}
                </button>
              ))}
            </div>

            {/* Request Cards */}
            <div className="space-y-3">
              {requests
                .filter(r => reqFilter === 'ALL' || r.status === reqFilter)
                .map((req) => (
                  <div
                    key={req.id}
                    className="bg-white border-2 border-brand-charcoal rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            req.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : req.status === 'ORDERED'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : req.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {req.status}
                        </span>
                        <h4 className="font-black text-base text-brand-charcoal">{req.title}</h4>
                      </div>
                      <div className="text-xs text-gray-600">
                        {req.author ? `작가: ${req.author}` : ''} {req.volumeRange ? `· 희망권수: ${req.volumeRange}` : ''}
                      </div>
                      {req.userComment && (
                        <div className="text-xs text-[#4A4534] bg-brand-surface p-2 rounded-lg mt-1">
                          손님 코멘트: "{req.userComment}"
                        </div>
                      )}
                      {req.adminReply && (
                        <div className="text-xs text-blue-700 font-bold mt-1">
                          ↳ 관리자 답변: {req.adminReply}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleRequestStatusChange(req.id, 'ORDERED', req)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-xl"
                      >
                        주문완료
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestStatusChange(req.id, 'COMPLETED', req)}
                        className="bg-green-600 hover:bg-green-700 text-white font-black text-xs px-3 py-2 rounded-xl"
                      >
                        입고완료 (도서등록)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestStatusChange(req.id, 'REJECTED', req)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs px-2.5 py-2 rounded-xl"
                      >
                        입고불가
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: 📊 BULK EXCEL UPLOAD */}
        {activeTab === 'BULK' && (
          <div className="bg-white border-2 border-brand-charcoal rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-black text-brand-charcoal tracking-tight mb-2">
                📊 대량 도서 엑셀 / CSV 일괄 등록
              </h3>
              <p className="text-xs text-brand-muted">
                엑셀이나 CSV 양식(`도서명, 서가번호, 장르, 작가`) 데이터를 붙여넣거나 업로드하여 수백 권의 도서를 단 1초 만에 등록합니다.
              </p>
            </div>

            <textarea
              value={bulkCsvText}
              onChange={(e) => setBulkCsvText(e.target.value)}
              placeholder={`"내일은 발명왕","6","아이, 교육","곰돌이"\n"신장판 꿈빛 파티시엘 6","2","순정","마쓰모토 나츠미"\n"나츠메 우인장 32","7","순정","유키 미도리카와"`}
              rows={8}
              className="w-full border-2 border-brand-charcoal rounded-2xl p-4 font-mono text-xs text-brand-charcoal outline-hidden focus:ring-2 focus:ring-brand-yellow"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setBulkCsvText(
                    `"체인소 맨 16","6","코믹스","후지모토 타츠키"\n"주술회전 27","6","코믹스","아쿠타미 게게"\n"최애의 아이 15","4","웹툰/코믹스","아카사카 아카"`
                  );
                }}
                className="text-xs font-bold text-amber-800 underline"
              >
                예시 데이터 채우기
              </button>

              <button
                type="button"
                onClick={handleBulkImport}
                className="bg-brand-charcoal hover:bg-black text-brand-yellow font-black text-sm px-6 py-3 rounded-xl border-2 border-brand-charcoal shadow-md"
              >
                📥 일괄 등록 실행하기
              </button>
            </div>

            {bulkReport && (
              <div className="p-4 bg-green-50 border-2 border-green-400 rounded-2xl text-xs font-extrabold text-green-900">
                ✅ 총 {bulkReport.total}개 행 중 {bulkReport.success}권의 도서가 {currentStore?.name} 재고로 등록되었습니다!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Single Book Add Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-brand-charcoal rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-black text-brand-charcoal tracking-tight mb-4">
              📚 신규 도서 등록 ({currentStore?.name})
            </h3>

            <form onSubmit={handleAddBook} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold mb-1">도서명 *</label>
                <input
                  type="text"
                  value={newBookForm.title}
                  onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                  placeholder="체인소 맨"
                  className="w-full border-2 border-brand-charcoal rounded-xl p-2 text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold mb-1">작가</label>
                  <input
                    type="text"
                    value={newBookForm.author}
                    onChange={(e) => setNewBookForm({ ...newBookForm, author: e.target.value })}
                    placeholder="후지모토 타츠키"
                    className="w-full border-2 border-brand-charcoal rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold mb-1">장르</label>
                  <select
                    value={newBookForm.category}
                    onChange={(e) => setNewBookForm({ ...newBookForm, category: e.target.value })}
                    className="w-full border-2 border-brand-charcoal rounded-xl p-2 text-xs font-bold bg-white"
                  >
                    <option value="코믹스">코믹스</option>
                    <option value="웹툰">웹툰</option>
                    <option value="순정">순정</option>
                    <option value="판타지">판타지</option>
                    <option value="스포츠">스포츠</option>
                    <option value="일상">일상</option>
                    <option value="마블DC">마블DC</option>
                    <option value="어린이/학습">어린이/학습</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold mb-1">보유 권수</label>
                  <input
                    type="text"
                    value={newBookForm.volumeRange}
                    onChange={(e) => setNewBookForm({ ...newBookForm, volumeRange: e.target.value })}
                    placeholder="1~16권"
                    className="w-full border-2 border-brand-charcoal rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold mb-1">서가 위치</label>
                  <input
                    type="text"
                    value={newBookForm.shelfLocation}
                    onChange={(e) => setNewBookForm({ ...newBookForm, shelfLocation: e.target.value })}
                    placeholder="6번 서가"
                    className="w-full border-2 border-brand-charcoal rounded-xl p-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="w-24 border-2 border-brand-charcoal rounded-xl py-2 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-charcoal text-brand-yellow font-black text-xs py-2 rounded-xl border-2 border-brand-charcoal"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
