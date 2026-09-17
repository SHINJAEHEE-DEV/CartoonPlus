-- Migration: Clean up stale legacy inventory rows and books
delete from public.book_inventories
where store_id = (select id from public.stores where slug = 'snu')
  and id in (
    'b7b854bb-d034-49e6-b19a-6f1dc6a41e8a',
    'a95814f4-a3b7-40f9-8f5d-5d397a5be0dd',
    '8a953671-0cf4-48b3-8a78-a81b35850251',
    'c1aa3bb0-21b4-4185-b029-f4e79b94f822',
    'b48a1d66-1cf6-4a9d-a717-cba807974c27',
    '49dd4ea0-24a3-4d31-86b8-0a0244b52ba0',
    '22d5636d-608c-4001-925f-d9df7d41f4aa',
    '0e9e2eff-8e7e-4d2e-8a9b-1895f79cf00f'
  );

delete from public.books
where id not in (select book_id from public.book_inventories);
