/**
 * 유니코드 기반 한글 초성 추출 및 공백/특수문자 정규화 모듈
 * 외부 의존성(0kb) 없이 유니코드 자모 분해 공식 사용
 */

const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * 한글 문자열에서 초성을 추출합니다.
 * 예: "체인소 맨" -> "ㅊㅇㅅㅁ", "귀멸의 칼날" -> "ㄱㅁㅇㅋㄴ"
 */
export function extractInitialConsonants(text: string): string {
  if (!text) return '';
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    // 한글 음절 유니코드 범위: 0xAC00 (44032) ~ 0xD7A3 (55203)
    if (code >= 44032 && code <= 55203) {
      const choseongIndex = Math.floor((code - 44032) / 588);
      result += CHOSEONG[choseongIndex];
    } else if (code >= 12593 && code <= 12622) {
      // 이미 자음/초성인 경우 (ㄱ ~ ㅎ)
      result += text[i];
    } else if (/[a-zA-Z0-9]/.test(text[i])) {
      // 영문 및 숫자는 그대로 유지 (대소문자 정규화)
      result += text[i].toLowerCase();
    }
  }

  return result;
}

/**
 * 검색 및 색인용 정규화 문자열을 생성합니다.
 * 공백, 특수문자, 괄호 등을 모두 제거하고 소문자로 변환합니다.
 * 예: "체인소 맨 (Chainsaw Man)!" -> "체인소맨chainsawman"
 */
export function normalizeTitle(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^가-힣a-zA-Z0-9]/g, '');
}

/**
 * 검색어(query)가 대상 문자열(title, author 등)과 매칭되는지 다각도로 검사합니다.
 * 1. 정규화 부분 일치 (공백 무시)
 * 2. 초성 일치 (검색어가 초성인 경우: "ㅊㅇㅅㅁ")
 */
export function matchQuery(targetTitle: string, targetAuthor: string, query: string): boolean {
  if (!query || !query.trim()) return true;

  const rawQuery = query.trim();
  const normalizedQuery = normalizeTitle(rawQuery);
  const isChoseongQuery = /^[ㄱ-ㅎ]+$/.test(rawQuery.replace(/\s+/g, ''));

  // 1. 공백 무시 정규화 매칭
  const normalizedTitle = normalizeTitle(targetTitle);
  const normalizedAuthor = normalizeTitle(targetAuthor);

  if (normalizedTitle.includes(normalizedQuery) || normalizedAuthor.includes(normalizedQuery)) {
    return true;
  }

  // 2. 한글 초성 매칭
  if (isChoseongQuery) {
    const queryChoseong = rawQuery.replace(/\s+/g, '');
    const titleChoseong = extractInitialConsonants(targetTitle);
    const authorChoseong = extractInitialConsonants(targetAuthor);

    if (titleChoseong.includes(queryChoseong) || authorChoseong.includes(queryChoseong)) {
      return true;
    }
  }

  return false;
}
