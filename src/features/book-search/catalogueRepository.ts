import type { SearchableBook } from '../../lib/bookSearch';
import { supabase } from '../../lib/supabase';
import { isNewArrival } from '../../lib/newArrival';
import type { StoreSlug } from '../../lib/storeContext';
import {
  isHongdaeInventoryCsv,
  isJamsilInventoryCsv,
  parseBaselineInventory,
  parseHongdaeInventoryCsv,
  parseJamsilInventoryCsv,
} from '../../lib/inventoryCsv';

type CatalogueRow = {
  inventory_id: string;
  title: string;
  author: string | null;
  category: string | null;
  volume_range: string;
  shelf_location: string | null;
  first_registered_at?: string;
};

export function subscribeToPublicCatalogueUpdates(onUpdate: () => void): () => void {
  if (!supabase) return () => undefined;
  const client = supabase;

  const channel = client
    .channel('customer-book-catalogue')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'book_inventories' }, onUpdate)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, onUpdate)
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

function toSearchableBook(row: CatalogueRow): SearchableBook {
  return {
    id: row.inventory_id,
    title: row.title,
    author: row.author ?? '',
    category: row.category ?? '',
    volumeRange: row.volume_range,
    shelfLocation: row.shelf_location ?? '',
  };
}

async function loadBaselineCsv(storeSlug: StoreSlug): Promise<SearchableBook[]> {
  try {
    const csvFileName =
      storeSlug === 'jamsil'
        ? 'jamsil-inventory.csv'
        : storeSlug === 'hongdae'
          ? 'hongdae-inventory.csv'
          : 'initial-inventory.csv';

    const response = await fetch(`${import.meta.env.BASE_URL}data/${csvFileName}`);
    if (!response.ok) return [];
    const text = await response.text();
    if (storeSlug === 'jamsil') {
      if (isJamsilInventoryCsv(text)) {
        return parseJamsilInventoryCsv(text).books;
      }
      return parseBaselineInventory(text);
    }
    if (storeSlug === 'hongdae') {
      if (isHongdaeInventoryCsv(text)) {
        return parseHongdaeInventoryCsv(text).books;
      }
      return parseBaselineInventory(text);
    }
    return parseBaselineInventory(text);
  } catch {
    return [];
  }
}

export async function loadPublicCatalogue(storeSlug: StoreSlug = 'snu'): Promise<SearchableBook[]> {
  if (supabase) {
    const CHUNK_SIZE = 1000;
    const allRows: CatalogueRow[] = [];
    let page = 0;

    while (true) {
      const { data, error } = await supabase
        .from('customer_book_catalogue')
        .select('inventory_id,title,author,category,volume_range,shelf_location')
        .eq('store_slug', storeSlug)
        .order('title')
        .range(page * CHUNK_SIZE, (page + 1) * CHUNK_SIZE - 1);

      if (error) {
        if (allRows.length === 0) return loadBaselineCsv(storeSlug);
        break;
      }

      if (!data || data.length === 0) break;
      allRows.push(...data);
      if (data.length < CHUNK_SIZE) break;
      page += 1;
    }

    return allRows.map(toSearchableBook);
  }

  return loadBaselineCsv(storeSlug);
}

export async function loadNewArrivals(storeSlug: StoreSlug = 'snu'): Promise<SearchableBook[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('customer_book_catalogue')
    .select('inventory_id,title,author,category,volume_range,shelf_location,first_registered_at')
    .eq('store_slug', storeSlug)
    .order('first_registered_at', { ascending: false });
  if (error || !data) return [];
  return data
    .filter((row) => row.first_registered_at && isNewArrival(row.first_registered_at))
    .map(toSearchableBook);
}
