import { describe, expect, it } from 'vitest';

import { parseBaselineInventory } from './inventoryCsv';

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
