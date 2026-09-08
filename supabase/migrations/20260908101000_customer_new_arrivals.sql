create or replace view public.customer_book_catalogue
with (security_invoker = true) as
select inventories.id as inventory_id, stores.slug as store_slug, books.title, books.author, books.category,
  inventories.volume_range, inventories.shelf_location, inventories.first_registered_at
from public.book_inventories as inventories
join public.books on books.id = inventories.book_id
join public.stores on stores.id = inventories.store_id
where inventories.archived_at is null and books.archived_at is null;
