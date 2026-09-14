import type { SearchableBook } from '../../lib/bookSearch';
import { supabase } from '../../lib/supabase';
import { isNewArrival } from '../../lib/newArrival';
import type { StoreSlug } from '../../lib/storeContext';

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

export async function loadPublicCatalogue(storeSlug: StoreSlug = 'snu'): Promise<SearchableBook[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('customer_book_catalogue')
      .select('inventory_id,title,author,category,volume_range,shelf_location')
      .eq('store_slug', storeSlug)
      .order('title');

    if (!error && data && data.length > 0) return data.map(toSearchableBook);
  }

  return [];
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
