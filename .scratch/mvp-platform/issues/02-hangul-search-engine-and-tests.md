# 02: Hangul Choseong & Whitespace-Agnostic Search Utility

**What to build:** Build the core search normalization module. Implement pure TypeScript functions for Unicode-based Hangul initial consonant extraction (`extractInitialConsonants`), whitespace & punctuation normalization (`normalizeTitle`), and flexible matching against book titles, authors, and publishers. Add comprehensive Vitest unit tests verifying exact match, spacing-free match, and initial consonant match.

**Blocked by:** 01: Project Foundation, Core Types, Mock Store & Theme

**Status:** ready-for-agent

- [ ] `normalizeTitle` strips whitespace, punctuation, and converts casing
- [ ] `extractInitialConsonants` correctly maps Korean syllables to Choseong (e.g., '체인소 맨' -> 'ㅊㅇㅅㅁ')
- [ ] Search matcher filters books by matching normalized query against title, author, and choseong
- [ ] Vitest test suite covering edge cases (mixed English/Korean, multiple spaces, special characters) passes with 100% success
