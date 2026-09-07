import type { SearchableBook } from './bookSearch';

type InventoryCsvRow = {
  title: string;
  number: string;
  genre: string;
  author: string;
};

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += character;
    }
  }
  values.push(value);
  return values;
}

export function parseBaselineInventory(csv: string): SearchableBook[] {
  const [header, ...lines] = csv.trim().split(/\r?\n/);
  if (!header) return [];

  const columns = parseCsvLine(header);
  return lines.flatMap((line, index) => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(columns.map((column, columnIndex) => [column, values[columnIndex] ?? ''])) as InventoryCsvRow;
    if (!row.title?.trim() || !row.number?.trim()) return [];
    return [{
      id: `baseline-${index}-${row.title}`,
      title: row.title.trim(),
      author: row.author?.trim() ?? '',
      category: row.genre?.trim() ?? '',
      volumeRange: `${row.number.trim()}권`,
      shelfLocation: '',
    }];
  });
}
