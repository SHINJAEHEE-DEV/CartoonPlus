export type SearchableBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  volumeRange: string;
  shelfLocation: string;
};

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const INITIAL_CONSONANTS = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];
const INITIAL_CONSONANT_QUERY = /^[ㄱ-ㅎ]+$/;

export function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
}

export const STANDARD_BOOK_GENRES = [
  '웹툰',
  '액션/모험',
  '로맨스/로판',
  '판타지/무협',
  '일상/개그',
  '스릴러/추리/호러',
  '드라마/스포츠/SF',
  'BL/GL',
  '일반도서/소설',
  '코믹스/그래픽노블',
  '성인',
] as const;

export type StandardBookGenre = (typeof STANDARD_BOOK_GENRES)[number];

export function normalizeBookCategory(value: string): string {
  const normalized = value
    .trim()
    .replace(/\s*,\s*/gu, ',')
    .replace(/(^|,)sf(?=,|$)/giu, '$1SF');
  return normalized === 'SF,판타지' ? '판타지,SF' : normalized;
}

export function splitBookCategories(value: string): string[] {
  const normalized = normalizeBookCategory(value);
  if (!normalized) return [];
  return normalized
    .split(/[,·]/u)
    .map((category) => category.trim())
    .filter(Boolean);
}

/**
 * 한글 음절 문자열에서 초성만 단일 패스(O(L))로 추출함.
 * 기존 [...value].map().join() 방식을 대체하여 중간 배열 및 단일 문자 객체 할당을 제거함.
 */
export function toInitialConsonants(value: string): string {
  let result = '';
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code >= HANGUL_START && code <= HANGUL_END) {
      result += INITIAL_CONSONANTS[((code - HANGUL_START) / 588) | 0];
    } else {
      result += value[i];
    }
  }
  return result;
}

export type BookSearchIndexEntry = {
  rawTitle: string;
  rawAuthor: string;
  rawCategory: string;
  titleNorm: string;
  authorNorm: string;
  titleInitial: string;
  authorInitial: string;
  normalizedCategory: string;
  categories: readonly string[];
  categorySet: ReadonlySet<string>;
};

const bookIndexCache = new WeakMap<SearchableBook, BookSearchIndexEntry>();

/**
 * 도서 객체당 최초 1회만 검색(정규화·초성) 및 카테고리(정규화·분리·Set) 인덱스를 생성하여 WeakMap에 캐싱함.
 * 도서 객체 참조가 유지되는 동안 정규식 치환과 배열·Set 할당이 재실행되지 않음.
 */
export function getBookIndex(book: SearchableBook): BookSearchIndexEntry {
  const cached = bookIndexCache.get(book);
  if (
    cached &&
    cached.rawTitle === book.title &&
    cached.rawAuthor === book.author &&
    cached.rawCategory === book.category
  ) {
    return cached;
  }
  const titleNorm = normalizeSearchText(book.title);
  const authorNorm = normalizeSearchText(book.author);
  const normalizedCategory = normalizeBookCategory(book.category);
  const categories = normalizedCategory
    ? normalizedCategory
        .split(/[,·]/u)
        .map((category) => category.trim())
        .filter(Boolean)
    : [];
  const entry: BookSearchIndexEntry = {
    rawTitle: book.title,
    rawAuthor: book.author,
    rawCategory: book.category,
    titleNorm,
    authorNorm,
    titleInitial: toInitialConsonants(titleNorm),
    authorInitial: toInitialConsonants(authorNorm),
    normalizedCategory,
    categories,
    categorySet: new Set(categories),
  };
  bookIndexCache.set(book, entry);
  return entry;
}

export function searchBooks(books: SearchableBook[], query: string): SearchableBook[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const isInitialConsonantQuery = INITIAL_CONSONANT_QUERY.test(normalizedQuery);

  return books.filter((book) => {
    const idx = getBookIndex(book);

    if (isInitialConsonantQuery) {
      return (
        idx.titleInitial.includes(normalizedQuery) || idx.authorInitial.includes(normalizedQuery)
      );
    }

    return idx.titleNorm.includes(normalizedQuery) || idx.authorNorm.includes(normalizedQuery);
  });
}
