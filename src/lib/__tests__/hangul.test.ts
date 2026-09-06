import { describe, it, expect } from 'vitest';
import { extractInitialConsonants, normalizeTitle, matchQuery } from '../hangul';

describe('한글 초성 추출 및 정규화 알고리즘 (TDD)', () => {
  it('extractInitialConsonants: 한글 문자열에서 초성을 정확히 추출한다', () => {
    expect(extractInitialConsonants('체인소 맨')).toBe('ㅊㅇㅅㅁ');
    expect(extractInitialConsonants('귀멸의 칼날')).toBe('ㄱㅁㅇㅋㄴ');
    expect(extractInitialConsonants('주술회전 0')).toBe('ㅈㅅㅎㅈ0');
    expect(extractInitialConsonants('스파이 패밀리 (SPY x FAMILY)')).toBe('ㅅㅍㅇㅍㅁㄹspyxfamily');
  });

  it('normalizeTitle: 공백 및 특수문자를 제거하고 소문자로 정규화한다', () => {
    expect(normalizeTitle('체인소 맨!')).toBe('체인소맨');
    expect(normalizeTitle('귀멸의 칼날 (1-23권)')).toBe('귀멸의칼날123권');
    expect(normalizeTitle('One Piece [원피스]')).toBe('onepiece원피스');
  });

  it('matchQuery: 공백 차이에 관계없이 정확히 매칭된다 (체인소 맨 vs 체인소맨)', () => {
    expect(matchQuery('체인소 맨', '후지모토 타츠키', '체인소맨')).toBe(true);
    expect(matchQuery('체인소맨', '후지모토 타츠키', '체인소 맨')).toBe(true);
    expect(matchQuery('귀멸의 칼날', '고토게 코요하루', '귀멸')).toBe(true);
  });

  it('matchQuery: 초성 쿼리를 정확히 매칭한다', () => {
    expect(matchQuery('체인소 맨', '후지모토 타츠키', 'ㅊㅇㅅㅁ')).toBe(true);
    expect(matchQuery('귀멸의 칼날', '고토게 코요하루', 'ㄱㅁㅇㅋㄴ')).toBe(true);
    expect(matchQuery('주술회전', '아쿠타미 게게', 'ㅈㅅㅎㅈ')).toBe(true);
    expect(matchQuery('원피스', '오다 에이치로', 'ㅇㅍㅅ')).toBe(true);
  });

  it('matchQuery: 작가명 검색도 정상 동작한다', () => {
    expect(matchQuery('원피스', '오다 에이치로', '오다')).toBe(true);
    expect(matchQuery('원피스', '오다 에이치로', 'ㅇㄷ')).toBe(true);
  });
});
