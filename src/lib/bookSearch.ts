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
  return normalizeBookCategory(value)
    .split(/[,·]/u)
    .map((category) => category.trim())
    .filter(Boolean);
}


export function toInitialConsonants(value: string): string {
  return [...value]
    .map((character) => {
      const code = character.charCodeAt(0);
      if (code < HANGUL_START || code > HANGUL_END) return character;
      return INITIAL_CONSONANTS[Math.floor((code - HANGUL_START) / 588)];
    })
    .join('');
}

export function searchBooks(books: SearchableBook[], query: string): SearchableBook[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const isInitialConsonantQuery = INITIAL_CONSONANT_QUERY.test(normalizedQuery);

  return books.filter((book) => {
    const title = normalizeSearchText(book.title);
    const author = normalizeSearchText(book.author);

    if (isInitialConsonantQuery) {
      return (
        toInitialConsonants(title).includes(normalizedQuery) ||
        toInitialConsonants(author).includes(normalizedQuery)
      );
    }

    return title.includes(normalizedQuery) || author.includes(normalizedQuery);
  });
}
