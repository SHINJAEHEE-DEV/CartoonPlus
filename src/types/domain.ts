/**
 * 카툰플러스 (CartoonPlus Cafe) 도메인 인터페이스 정의
 */

export interface Store {
  id: 'snu' | 'jamsil';
  name: string;
  address: string;
  subwayInfo: string;
  phone: string;
  hours: string;
  parking: string;
  isActive: boolean;
  mapUrl: string;
  facilities: string[];
}

export interface Book {
  id: string;
  title: string;
  normalizedTitle: string;
  initialConsonants: string;
  author: string;
  publisher?: string;
  category: '웹툰' | '코믹스' | '순정' | '액션/판타지' | '소설/라노벨' | '스포츠' | '일상' | '마블DC' | '어린이/학습' | string;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface BookInventory {
  id: string;
  storeId: 'snu' | 'jamsil';
  bookId: string;
  volumeRange: string;      // e.g. "1~68권", "전권", "1~16권"
  shelfLocation: string;    // e.g. "6번 서가", "A-03 서가"
  note?: string;
  updatedAt: string;
}

// 조인된 도서 검색 결과 뷰 모델
export interface BookSearchResult {
  book: Book;
  inventory: BookInventory;
}

export type BookRequestStatus = 'PENDING' | 'ORDERED' | 'COMPLETED' | 'REJECTED';

export interface BookRequest {
  id: string;
  storeId: 'snu' | 'jamsil';
  title: string;
  author?: string;
  volumeRange?: string;
  userComment?: string;
  status: BookRequestStatus;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntertainmentItem {
  id: string;
  storeId: 'snu' | 'jamsil' | 'ALL';
  type: 'NINTENDO' | 'XBOX' | 'BOARD_GAME';
  title: string;
  genre: string;
  players: string;
  difficulty?: '초급' | '중급' | '고급';
  isAvailable: boolean;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  storeId: 'snu' | 'jamsil' | 'ALL';
  category: 'MEAL' | 'SNACK' | 'BEV' | 'PACKAGE';
  name: string;
  description?: string;
  price: number;
  isBest?: boolean;
  isSoldOut?: boolean;
  sortOrder: number;
}

export interface BroadcastPreset {
  id: string;
  storeId?: 'snu' | 'jamsil' | 'ALL';
  presetKey: string;
  title: string;
  messageText: string;
  sortOrder: number;
}

export interface AdminUser {
  id: string;
  storeId: 'snu' | 'jamsil';
  username: string;
  role: 'ADMIN' | 'STAFF';
}
