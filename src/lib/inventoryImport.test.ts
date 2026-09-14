import { describe, expect, it } from 'vitest';

import { validateInventoryCsv } from './inventoryImport';

describe('validateInventoryCsv', () => {
  it('accepts the supplied Jamsil shelf CSV header', () => {
    expect(validateInventoryCsv('"a_","a___"\n"1","그녀도 여친 16"')).toBeNull();
  });

  it('rejects invalid CSV headers and blank titles in the standard format', () => {
    expect(validateInventoryCsv('title,author\n책,작가')).toBe(
      'CSV에 title과 number 열이 필요합니다.'
    );
    expect(validateInventoryCsv('title,number\n,7')).toBe('도서명이 비어 있는 행이 있습니다.');
  });
});
