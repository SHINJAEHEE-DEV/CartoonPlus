export function validateInventoryCsv(csv: string): string | null {
  const [header, ...rows] = csv.trim().split(/\r?\n/);
  if (!header || !/title/i.test(header) || !/number/i.test(header)) return 'CSV에 title과 number 열이 필요합니다.';
  if (rows.some((row) => /^\s*(""|,)/.test(row))) return '도서명이 비어 있는 행이 있습니다.';
  return null;
}
