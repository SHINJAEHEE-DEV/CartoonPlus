import { normalizeBookCategory, type SearchableBook } from './bookSearch';

type InventoryCsvRow = {
  title: string;
  number: string;
  genre: string;
  author: string;
};

type JamsilShelfRow = {
  shelfNumber: string;
  shelfTitles: string;
};

export type StoreInventoryImport = {
  books: SearchableBook[];
  ambiguousTitles: string[];
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

function getCsvRows(csv: string): { columns: string[]; lines: string[] } {
  const [header, ...lines] = csv.trim().split(/\r?\n/);
  return { columns: header ? parseCsvLine(header) : [], lines };
}

export function isJamsilInventoryCsv(csv: string): boolean {
  const { columns } = getCsvRows(csv);
  return columns.length === 2 && columns[0] === 'a_' && columns[1] === 'a___';
}

export function isHongdaeInventoryCsv(csv: string): boolean {
  const { columns } = getCsvRows(csv);
  return (
    columns.length === 3 && columns[0] === 'a_' && columns[1] === 'a_1' && columns[2] === 'a_2'
  );
}

function isAmbiguousJamsilTitle(title: string): boolean {
  return /\s\d+\s+\([^)]*\)\s*$/u.test(title.trim());
}

export function parseJamsilInventoryCsv(csv: string): StoreInventoryImport {
  const { columns, lines } = getCsvRows(csv);
  if (columns.length !== 2 || columns[0] !== 'a_' || columns[1] !== 'a___') {
    return { books: [], ambiguousTitles: [] };
  }

  const books: SearchableBook[] = [];
  const ambiguousTitles: string[] = [];

  lines.forEach((line, rowIndex) => {
    const [shelfNumber = '', shelfTitles = ''] = parseCsvLine(line) as [string, string];
    const row: JamsilShelfRow = {
      shelfNumber: shelfNumber.trim(),
      shelfTitles: shelfTitles.trim(),
    };
    if (!row.shelfNumber || !row.shelfTitles) return;

    row.shelfTitles.split('//').forEach((rawTitle, titleIndex) => {
      const title = rawTitle.trim();
      if (!title) return;
      if (isAmbiguousJamsilTitle(title)) {
        ambiguousTitles.push(title);
        return;
      }
      const book = splitTitleAndLastVolume(title);
      books.push({
        id: `jamsil-${rowIndex}-${titleIndex}-${book.title}`,
        title: book.title,
        author: '',
        category: '',
        volumeRange: book.volumeRange,
        shelfLocation: `책장 ${row.shelfNumber}번`,
      });
    });
  });

  return { books, ambiguousTitles };
}

export function parseHongdaeInventoryCsv(csv: string): StoreInventoryImport {
  const { columns, lines } = getCsvRows(csv);
  if (columns.length !== 3 || columns[0] !== 'a_' || columns[1] !== 'a_1' || columns[2] !== 'a_2') {
    return { books: [], ambiguousTitles: [] };
  }

  const books: SearchableBook[] = [];
  const ambiguousTitles: string[] = [];
  lines.forEach((line, rowIndex) => {
    const [titleList = '', shelfNumber = '', category = ''] = parseCsvLine(line) as [
      string,
      string,
      string,
    ];
    if (!titleList.trim() || !shelfNumber.trim()) return;

    titleList.split(/\s*\/\/\s*|(?<=\d)\s*\/(?=\s*[^\d\s])/u).forEach((rawTitle, titleIndex) => {
      const title = rawTitle.trim();
      if (!title) return;
      const book = splitTitleAndLastVolume(title);
      books.push({
        id: `hongdae-${rowIndex}-${titleIndex}-${book.title}`,
        title: book.title,
        author: '',
        category: normalizeBookCategory(category),
        volumeRange: book.volumeRange,
        shelfLocation: `책장 ${shelfNumber.trim()}번`,
      });
    });
  });
  return { books, ambiguousTitles };
}

export function parseBaselineInventory(csv: string): SearchableBook[] {
  const { columns, lines } = getCsvRows(csv);
  if (!columns.length) return [];

  const isCleanedFormat = columns.includes('도서명') && columns.includes('기존서가');

  return lines.flatMap((line, index) => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(
      columns.map((column, columnIndex) => [column, values[columnIndex] ?? ''])
    );

    if (isCleanedFormat) {
      const title = row['도서명']?.trim() ?? '';
      const shelf = row['기존서가']?.trim() ?? '';
      if (!title || !shelf) return [];
      const volumeRange = row['보유권수']?.trim() ?? '';
      const author = row['작가']?.trim() ?? '';
      const genre = row['목표장르']?.trim() ?? row['기존장르']?.trim() ?? '';
      return [
        {
          id: `baseline-${index}-${title}`,
          title,
          author,
          category: normalizeBookCategory(genre),
          volumeRange: volumeRange || '확인 중',
          shelfLocation: `책장 ${shelf}번`,
        },
      ];
    }

    const legacyRow = row as InventoryCsvRow;
    if (!legacyRow.title?.trim() || !legacyRow.number?.trim()) return [];
    const book = splitTitleAndLastVolume(legacyRow.title);
    return [
      {
        id: `baseline-${index}-${book.title}`,
        title: book.title,
        author: legacyRow.author?.trim() ?? '',
        category: normalizeBookCategory(legacyRow.genre ?? ''),
        volumeRange: book.volumeRange,
        shelfLocation: `책장 ${legacyRow.number.trim()}번`,
      },
    ];
  });
}

