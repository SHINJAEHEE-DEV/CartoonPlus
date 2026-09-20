import type { StoreSlug } from './storeContext';

/**
 * 지점별 요일/시각에 따른 실시간 영업 상태(영업 중 여부)를 판별합니다.
 *
 * - 홍대점: 24시간 연중무휴 상시 영업
 * - 잠실점:
 *   - 금요일 10:00 ~ 일요일 23:00 (주말 무중단 24시간 연속 영업)
 *   - 월~목요일: 10:00 ~ 23:00
 * - 서울대입구역점: 매일 10:00 ~ 23:00
 */
export function isStoreOpen(storeSlug: StoreSlug, now: Date = new Date()): boolean {
  if (storeSlug === 'hongdae') {
    return true;
  }

  const day = now.getDay(); // 0: 일, 1: 월, 2: 화, 3: 수, 4: 목, 5: 금, 6: 토
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (storeSlug === 'jamsil') {
    // 금요일 오전 10:00부터 시작
    if (day === 5) {
      return minutes >= 10 * 60;
    }
    // 토요일은 24시간 전일 영업
    if (day === 6) {
      return true;
    }
    // 일요일은 자정부터 밤 23:00까지 영업
    if (day === 0) {
      return minutes < 23 * 60;
    }
    // 월~목요일은 10:00 ~ 23:00
    return minutes >= 10 * 60 && minutes < 23 * 60;
  }

  // 서울대입구역점 (snu) 및 기본 매장: 매일 10:00 ~ 23:00
  return minutes >= 10 * 60 && minutes < 23 * 60;
}
