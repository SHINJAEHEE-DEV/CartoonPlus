import { 
  Store, Book, BookInventory, BookRequest, EntertainmentItem, MenuItem, BroadcastPreset, BookSearchResult 
} from '../types/domain';
import { 
  INITIAL_STORES, INITIAL_BOOKS, INITIAL_INVENTORIES, 
  INITIAL_ENTERTAINMENT, INITIAL_MENUS, INITIAL_BROADCAST_PRESETS, INITIAL_BOOK_REQUESTS 
} from '../data/seedData';
import { extractInitialConsonants, normalizeTitle, matchQuery } from './hangul';

const STORAGE_KEYS = {
  SELECTED_STORE: 'cp_selected_store',
  BOOKS: 'cp_books_v1',
  INVENTORIES: 'cp_inventories_v1',
  BOOK_REQUESTS: 'cp_book_requests_v1',
  BROADCAST_PRESETS: 'cp_broadcast_presets_v1',
};

// Safe localStorage helper
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save to localStorage (${key}):`, err);
  }
}

export class MockDataRepository {
  // 1. Store
  static getSelectedStore(): 'snu' | 'jamsil' {
    return getLocalItem<'snu' | 'jamsil'>(STORAGE_KEYS.SELECTED_STORE, 'snu');
  }

  static setSelectedStore(storeId: 'snu' | 'jamsil'): void {
    setLocalItem(STORAGE_KEYS.SELECTED_STORE, storeId);
  }

  static getAllStores(): Store[] {
    return INITIAL_STORES;
  }

  static getStoreById(storeId: string): Store | undefined {
    return INITIAL_STORES.find(s => s.id === storeId);
  }

  // 2. Books & Inventory
  static getBooks(): Book[] {
    return getLocalItem<Book[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
  }

  static getInventories(): BookInventory[] {
    return getLocalItem<BookInventory[]>(STORAGE_KEYS.INVENTORIES, INITIAL_INVENTORIES);
  }

  static getBookSearchResults(storeId: 'snu' | 'jamsil', query: string = '', category: string = '전체'): BookSearchResult[] {
    const books = this.getBooks();
    const inventories = this.getInventories().filter(inv => inv.storeId === storeId);
    const bookMap = new Map(books.map(b => [b.id, b]));

    const results: BookSearchResult[] = [];

    for (const inv of inventories) {
      const book = bookMap.get(inv.bookId);
      if (!book || book.isDeleted) continue;

      // Category filter
      if (category !== '전체' && !book.category.includes(category)) {
        continue;
      }

      // Query filter (Whitespace-agnostic + Choseong)
      if (query.trim()) {
        const matches = matchQuery(book.title, book.author, query);
        if (!matches) continue;
      }

      results.push({ book, inventory: inv });
    }

    return results;
  }

  static addSingleBook(
    storeId: 'snu' | 'jamsil', 
    data: { title: string; author: string; category: string; volumeRange: string; shelfLocation: string; note?: string }
  ): { book: Book; inventory: BookInventory } {
    const books = this.getBooks();
    const inventories = this.getInventories();

    const norm = normalizeTitle(data.title);
    let book = books.find(b => b.normalizedTitle === norm);

    if (!book) {
      book = {
        id: `b-custom-${Date.now()}`,
        title: data.title,
        normalizedTitle: norm,
        initialConsonants: extractInitialConsonants(data.title),
        author: data.author || '미상',
        category: data.category || '코믹스',
        createdAt: new Date().toISOString(),
      };
      books.unshift(book);
      setLocalItem(STORAGE_KEYS.BOOKS, books);
    }

    let inv = inventories.find(i => i.storeId === storeId && i.bookId === book!.id);
    if (inv) {
      inv.volumeRange = data.volumeRange;
      inv.shelfLocation = data.shelfLocation;
      inv.note = data.note;
      inv.updatedAt = new Date().toISOString();
    } else {
      inv = {
        id: `inv-custom-${Date.now()}`,
        storeId,
        bookId: book.id,
        volumeRange: data.volumeRange,
        shelfLocation: data.shelfLocation,
        note: data.note,
        updatedAt: new Date().toISOString(),
      };
      inventories.unshift(inv);
    }

    setLocalItem(STORAGE_KEYS.INVENTORIES, inventories);
    return { book, inventory: inv };
  }

  static updateInventory(invId: string, updates: Partial<Pick<BookInventory, 'volumeRange' | 'shelfLocation' | 'note'>>): BookInventory | null {
    const inventories = this.getInventories();
    const target = inventories.find(i => i.id === invId);
    if (!target) return null;

    Object.assign(target, updates, { updatedAt: new Date().toISOString() });
    setLocalItem(STORAGE_KEYS.INVENTORIES, inventories);
    return target;
  }

  static removeInventory(invId: string): boolean {
    const inventories = this.getInventories();
    const filtered = inventories.filter(i => i.id !== invId);
    if (filtered.length !== inventories.length) {
      setLocalItem(STORAGE_KEYS.INVENTORIES, filtered);
      return true;
    }
    return false;
  }

  // 3. Book Requests
  static getBookRequests(storeId?: 'snu' | 'jamsil'): BookRequest[] {
    const requests = getLocalItem<BookRequest[]>(STORAGE_KEYS.BOOK_REQUESTS, INITIAL_BOOK_REQUESTS);
    if (storeId) {
      return requests.filter(r => r.storeId === storeId);
    }
    return requests;
  }

  static createBookRequest(data: Omit<BookRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): BookRequest {
    const requests = this.getBookRequests();
    const newRequest: BookRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    requests.unshift(newRequest);
    setLocalItem(STORAGE_KEYS.BOOK_REQUESTS, requests);
    return newRequest;
  }

  static updateBookRequestStatus(
    reqId: string, 
    status: BookRequest['status'], 
    adminReply?: string
  ): BookRequest | null {
    const requests = this.getBookRequests();
    const target = requests.find(r => r.id === reqId);
    if (!target) return null;

    target.status = status;
    if (adminReply !== undefined) {
      target.adminReply = adminReply;
    }
    target.updatedAt = new Date().toISOString();

    setLocalItem(STORAGE_KEYS.BOOK_REQUESTS, requests);
    return target;
  }

  // 4. Entertainment & Menu
  static getEntertainment(): EntertainmentItem[] {
    return INITIAL_ENTERTAINMENT;
  }

  static getMenus(): MenuItem[] {
    return INITIAL_MENUS;
  }

  // 5. Broadcast Presets
  static getBroadcastPresets(): BroadcastPreset[] {
    return getLocalItem<BroadcastPreset[]>(STORAGE_KEYS.BROADCAST_PRESETS, INITIAL_BROADCAST_PRESETS);
  }
}
