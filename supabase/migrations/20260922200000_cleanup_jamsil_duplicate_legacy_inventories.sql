-- Migration: Clean up legacy duplicate inventory records in Jamsil store
-- Removes un-enriched rows with author = '' created from early un-split CSV import

delete from public.book_inventories
where store_id = (select id from public.stores where slug = 'jamsil')
  and book_id in (
    select id from public.books where author = ''
  );

-- Delete orphaned books with empty author that are no longer referenced in any store inventory
delete from public.books
where author = ''
  and id not in (
    select distinct book_id from public.book_inventories
  );
