import type { SearchableBook } from '../../lib/bookSearch';
import { supabase } from '../../lib/supabase';
import { parseBaselineInventory } from '../../lib/inventoryCsv';
import { isNewArrival } from '../../lib/newArrival';

type CatalogueRow = {
  inventory_id: string;
  title: string;
  author: string | null;
  category: string | null;
  volume_range: string;
  shelf_location: string | null;
  first_registered_at?: string;
};

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

async function loadBaselineCsv(): Promise<SearchableBook[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/initial-inventory.csv`);
  if (!response.ok) throw new Error('initial inventory unavailable');
  return parseBaselineInventory(await response.text());
}

export async function loadPublicCatalogue(): Promise<SearchableBook[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('customer_book_catalogue')
      .select('inventory_id,title,author,category,volume_range,shelf_location')
      .eq('store_slug', 'snu')
      .order('title');

    if (!error && data && data.length > 0) return data.map(toSearchableBook);
  }

  return loadBaselineCsv();
}

export async function loadNewArrivals(): Promise<SearchableBook[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('customer_book_catalogue')
    .select('inventory_id,title,author,category,volume_range,shelf_location,first_registered_at')
    .eq('store_slug', 'snu')
    .order('first_registered_at', { ascending: false });
  if (error || !data) return [];
  return data.filter((row) => row.first_registered_at && isNewArrival(row.first_registered_at)).map(toSearchableBook);
}
