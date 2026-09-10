import { normalizeBookCategory, type SearchableBook } from './bookSearch';

type InventoryCsvRow = {
  title: string;
  number: string;
  genre: string;
  author: string;
};

function splitTitleAndLastVolume(value: string): { title: string; volumeRange: string } {
  const trimmed = value.trim();
  const match = /^(.*\S)\s+(\d+)$/u.exec(trimmed);
  if (!match) return { title: trimmed, volumeRange: '' };
  return { title: match[1], volumeRange: `1~${match[2]}권` };
}

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
    const book = splitTitleAndLastVolume(row.title);
    return [{
      id: `baseline-${index}-${book.title}`,
      title: book.title,
      author: row.author?.trim() ?? '',
      category: normalizeBookCategory(row.genre ?? ''),
      volumeRange: book.volumeRange,
      shelfLocation: `책장 ${row.number.trim()}번`,
    }];
  });
}
