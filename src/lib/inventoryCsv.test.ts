import { describe, expect, it } from 'vitest';

import { isJamsilInventoryCsv, parseBaselineInventory, parseJamsilInventoryCsv } from './inventoryCsv';

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
