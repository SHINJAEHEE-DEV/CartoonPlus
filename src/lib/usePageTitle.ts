import { useEffect } from 'react';

export function usePageTitle(title?: string | null) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | 카툰플러스 서울대입구역점`;
    } else {
      document.title = '카툰플러스 서울대입구역점 | 실시간 도서 검색 & 매장 안내';
    }
  }, [title]);
}
