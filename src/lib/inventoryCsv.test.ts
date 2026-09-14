import { describe, expect, it } from 'vitest';

import { isHongdaeInventoryCsv, isJamsilInventoryCsv, parseBaselineInventory, parseHongdaeInventoryCsv, parseJamsilInventoryCsv } from './inventoryCsv';

describe('parseBaselineInventory', () => {
  it('uses number as a shelf number and separates a trailing volume from the title', () => {
    expect(parseBaselineInventory('"title","number","genre","author"\n"나츠메 우인장 32","7","순정","유키"')).toEqual([
      expect.objectContaining({
        title: '나츠메 우인장',
        volumeRange: '1~32권',
        shelfLocation: '책장 7번',
      }),
    ]);
  });
});

describe('parseHongdaeInventoryCsv', () => {
  it('splits the supplied Hongdae title separators and preserves shelf and genre', () => {
    expect(parseHongdaeInventoryCsv('"a_","a_1","a_2"\n"완벽한 허니문 2//용이 산다 2","27","웹툰"').books).toEqual([
      expect.objectContaining({ title: '완벽한 허니문', volumeRange: '1~2권', shelfLocation: '책장 27번', category: '웹툰' }),
      expect.objectContaining({ title: '용이 산다', volumeRange: '1~2권', shelfLocation: '책장 27번', category: '웹툰' }),
    ]);
  });

  it('accepts a single slash separator but only an exact Hongdae header', () => {
    expect(parseHongdaeInventoryCsv('"a_","a_1","a_2"\n"타임 인 조선 2/ 통: 유아독존 6","28","웹툰"').books).toHaveLength(2);
    expect(isHongdaeInventoryCsv('"a_","a_1"\n"도서","27"')).toBe(false);
  });
});

describe('parseInventoryCsv', () => {
  it('splits Jamsil shelf titles so every title can be imported separately', () => {
    expect(parseJamsilInventoryCsv('"a_","a___"\n"1","그녀도 여친 16 // 마토메 그로기 헤븐 6 // 이리 와. 7"').books).toEqual([
      expect.objectContaining({ title: '그녀도 여친', volumeRange: '1~16권', shelfLocation: '책장 1번' }),
      expect.objectContaining({ title: '마토메 그로기 헤븐', volumeRange: '1~6권', shelfLocation: '책장 1번' }),
      expect.objectContaining({ title: '이리 와.', volumeRange: '1~7권', shelfLocation: '책장 1번' }),
    ]);
  });

  it('ignores an empty Jamsil shelf row without discarding other shelf titles', () => {
    expect(parseJamsilInventoryCsv('"a_","a___"\n"12",""\n"12","눈부시도록 13"').books).toEqual([
      expect.objectContaining({ title: '눈부시도록', volumeRange: '1~13권', shelfLocation: '책장 12번' }),
    ]);
  });

  it('requires an exact Jamsil header and surfaces title-and-format ambiguity', () => {
    expect(isJamsilInventoryCsv('"a___"\n"그녀도 여친 16"')).toBe(false);
    expect(parseJamsilInventoryCsv('"a_","a___"\n"2","약사의 혼잣말 14 (소설)"')).toEqual({
      books: [],
      ambiguousTitles: ['약사의 혼잣말 14 (소설)'],
    });
  });
});
