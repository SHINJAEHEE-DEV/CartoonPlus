-- Migration: Fix ON CONFLICT issue in upsert_inventory_for_store, clean duplicate books, and restore unique index

-- 1. Deduplicate any duplicate books in public.books before creating unique index
do $$
declare
  r record;
  v_kept_id uuid;
  v_dup_id uuid;
begin
  -- For every duplicate (title, author) group in books
  for r in (
    select title, author, array_agg(id order by created_at asc, id asc) as id_list
    from public.books
    group by title, author
    having count(*) > 1
  ) loop
    v_kept_id := r.id_list[1];

    for i in 2..array_length(r.id_list, 1) loop
      v_dup_id := r.id_list[i];

      -- Re-point book_inventories that do not conflict in the same store
      update public.book_inventories
      set book_id = v_kept_id
      where book_id = v_dup_id
        and store_id not in (
          select store_id from public.book_inventories where book_id = v_kept_id
        );

      -- Delete remaining conflicting duplicate book_inventories
      delete from public.book_inventories where book_id = v_dup_id;

      -- Delete the duplicate book record
      delete from public.books where id = v_dup_id;
    end loop;
  end loop;
end;
$$;

-- 2. Restore unique index on public.books (title, author) to guarantee data integrity
create unique index if not exists books_title_author_idx on public.books (title, author);

-- 3. Update upsert_inventory_for_store to safely find or create book without relying solely on ON CONFLICT
create or replace function public.upsert_inventory_for_store(
  p_store_id uuid,
  p_title text,
  p_author text,
  p_category text,
  p_last_volume integer,
  p_shelf_location text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_book_id uuid;
  v_inventory_id uuid;
  v_clean_title text := btrim(coalesce(p_title, ''));
  v_clean_author text := btrim(coalesce(p_author, ''));
  v_clean_category text := btrim(coalesce(p_category, ''));
  v_clean_shelf text := btrim(coalesce(p_shelf_location, ''));
  v_norm_title text;
  v_norm_author text;
begin
  if v_clean_title = '' then
    raise exception 'title cannot be empty';
  end if;

  if p_last_volume is not null and p_last_volume < 1 then
    raise exception 'last volume must be positive';
  end if;

  if not public.can_manage_store(p_store_id) then
    raise exception 'store access denied';
  end if;

  v_norm_title := lower(regexp_replace(v_clean_title, '[[:space:][:punct:]]', '', 'g'));
  v_norm_author := lower(regexp_replace(v_clean_author, '[[:space:][:punct:]]', '', 'g'));

  -- Find existing book by exact title and author
  select id into v_book_id
  from public.books
  where title = v_clean_title and author = v_clean_author
  order by created_at asc
  limit 1;

  if v_book_id is not null then
    update public.books
    set category = case when v_clean_category <> '' then v_clean_category else category end,
        normalized_title = v_norm_title,
        normalized_author = v_norm_author
    where id = v_book_id;
  else
    insert into public.books (
      title,
      author,
      category,
      normalized_title,
      normalized_author,
      initial_consonants
    )
    values (
      v_clean_title,
      v_clean_author,
      v_clean_category,
      v_norm_title,
      v_norm_author,
      ''
    )
    returning id into v_book_id;
  end if;

  -- Upsert inventory for this store
  insert into public.book_inventories (
    store_id,
    book_id,
    volume_range,
    last_volume,
    shelf_location,
    updated_at
  )
  values (
    p_store_id,
    v_book_id,
    case when p_last_volume is null then '확인 중' else format('1~%s권', p_last_volume) end,
    p_last_volume,
    v_clean_shelf,
    now()
  )
  on conflict (store_id, book_id) do update
  set volume_range = case when excluded.last_volume is null then excluded.volume_range else format('1~%s권', excluded.last_volume) end,
      last_volume = excluded.last_volume,
      shelf_location = excluded.shelf_location,
      updated_at = now()
  returning id into v_inventory_id;

  return v_inventory_id;
end;
$$;

-- Grant execution permissions
grant execute on function public.upsert_inventory_for_store(uuid, text, text, text, integer, text) to authenticated;
