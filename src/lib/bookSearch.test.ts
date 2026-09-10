import { describe, expect, it } from 'vitest';

import { normalizeBookCategory, searchBooks, splitBookCategories, type SearchableBook } from './bookSearch';

const books: SearchableBook[] = [
  {
    id: 'chainsaw-man',
    title: '체인소 맨',
    author: '후지모토 타츠키',
    category: '소년',
    volumeRange: '1~21권',
    shelfLocation: 'A-01',
  },
  {
    id: 'natsume',
    title: '나츠메 우인장',
    author: '미도리카와 유키',
    category: '순정',
    volumeRange: '1~32권',
    shelfLocation: 'B-03',
  },
];

describe('searchBooks', () => {
  it('finds a partial title while ignoring whitespace and punctuation', () => {
    expect(searchBooks(books, '체인소맨')).toEqual([books[0]]);
    expect(searchBooks(books, '체인소-맨')).toEqual([books[0]]);
  });

  it('finds a partial author name', () => {
    expect(searchBooks(books, '미도리카와')).toEqual([books[1]]);
  });

  it('finds Korean initial consonants only for all-consonant queries', () => {
    expect(searchBooks(books, 'ㅊㅇㅅㅁ')).toEqual([books[0]]);
  });

  it('does not return unrelated books for empty, punctuation-only, or unmatched consonant queries', () => {
    expect(searchBooks(books, '')).toEqual([]);
    expect(searchBooks(books, ' --- ')).toEqual([]);
    expect(searchBooks(books, 'ㅉㅉ')).toEqual([]);
  });
});

describe('normalizeBookCategory', () => {
  it('merges spacing and case-only SF variants without merging distinct genres', () => {
    expect(normalizeBookCategory(' 아이, 판타지 ')).toBe('아이,판타지');
    expect(normalizeBookCategory('Sf')).toBe('SF');
    expect(normalizeBookCategory('sf, 판타지')).toBe('판타지,SF');
    expect(splitBookCategories('판타지,SF')).toEqual(['판타지', 'SF']);
  });
});
