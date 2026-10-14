-- Fix update_inventory_for_store to safely link or create books without unique constraint conflicts
create or replace function public.update_inventory_for_store(
  p_inventory_id uuid,
  p_title text,
  p_author text,
  p_category text,
  p_last_volume integer,
  p_shelf_location text,
  p_merge_duplicate boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_store_id uuid;
  v_current_book_id uuid;
  v_target_book_id uuid;
  v_duplicate_inv_id uuid;
  v_duplicate_book_id uuid;
  v_other_refs_count integer;
  v_title text := btrim(coalesce(p_title, ''));
  v_author text := btrim(coalesce(p_author, ''));
  v_category text := btrim(coalesce(p_category, ''));
  v_shelf text := btrim(coalesce(p_shelf_location, ''));
  v_norm_title text;
  v_norm_author text;
begin
  if v_title = '' then
    raise exception '도서명을 입력해 주세요.';
  end if;
  if p_last_volume is null or p_last_volume < 1 then
    raise exception '마지막 권수는 1 이상의 숫자로 입력해 주세요.';
  end if;

  -- 1. Verify current inventory and store management permission
  select store_id, book_id into v_store_id, v_current_book_id
  from public.book_inventories
  where id = p_inventory_id
  for update;

  if v_store_id is null then
    raise exception '수정할 재고 정보를 찾을 수 없습니다.';
  end if;

  if not public.can_manage_store(v_store_id) then
    raise exception '해당 지점의 재고 관리 권한이 없습니다.';
  end if;

  v_norm_title := lower(regexp_replace(v_title, '[[:space:][:punct:]]', '', 'g'));
  v_norm_author := lower(regexp_replace(v_author, '[[:space:][:punct:]]', '', 'g'));

  -- 2. Find if a book with target (title, author) already exists in books master
  select id into v_target_book_id
  from public.books
  where title = v_title and author = v_author
  order by created_at asc
  limit 1;

  if v_target_book_id is not null then
    -- A book with this (title, author) already exists.
    -- Check if THIS STORE already has an inventory for this target book (excluding current inventory)
    select inventory.id, inventory.book_id into v_duplicate_inv_id, v_duplicate_book_id
    from public.book_inventories inventory
    where inventory.store_id = v_store_id
      and inventory.id <> p_inventory_id
      and inventory.book_id = v_target_book_id
    limit 1
    for update;

    if v_duplicate_inv_id is not null then
      -- Duplicate inventory already exists in the same store
      if not p_merge_duplicate then
        raise exception '같은 지점에 동일한 도서 재고가 이미 존재합니다.';
      end if;

      -- Merge into the existing inventory
      update public.books
      set category = case when v_category <> '' then v_category else category end,
          normalized_title = v_norm_title,
          normalized_author = v_norm_author
      where id = v_target_book_id;

      update public.book_inventories
      set volume_range = format('1~%s권', p_last_volume),
          last_volume = p_last_volume,
          shelf_location = v_shelf,
          note = coalesce(note, ''),
          updated_at = now()
      where id = v_duplicate_inv_id;

      -- Remove the old inventory that was merged
      delete from public.book_inventories where id = p_inventory_id;

      -- Clean up old book if orphaned
      select count(*) into v_other_refs_count
      from public.book_inventories
      where book_id = v_current_book_id;

      if v_other_refs_count = 0 and v_current_book_id <> v_target_book_id then
        delete from public.books where id = v_current_book_id;
      end if;

      return v_duplicate_inv_id;
    else
      -- Target book exists, but current store doesn't have an inventory for it yet.
      -- Re-point current inventory to the target book!
      update public.books
      set category = case when v_category <> '' then v_category else category end,
          normalized_title = v_norm_title,
          normalized_author = v_norm_author
      where id = v_target_book_id;

      update public.book_inventories
      set book_id = v_target_book_id,
          volume_range = format('1~%s권', p_last_volume),
          last_volume = p_last_volume,
          shelf_location = v_shelf,
          updated_at = now()
      where id = p_inventory_id;

      -- Clean up old book if orphaned
      select count(*) into v_other_refs_count
      from public.book_inventories
      where book_id = v_current_book_id;

      if v_other_refs_count = 0 and v_current_book_id <> v_target_book_id then
        delete from public.books where id = v_current_book_id;
      end if;

      return p_inventory_id;
    end if;
  else
    -- Target book does NOT exist in books master.
    -- Check how many inventories reference the current book.
    select count(*) into v_other_refs_count
    from public.book_inventories
    where book_id = v_current_book_id and id <> p_inventory_id;

    if v_other_refs_count = 0 then
      -- Safe to update the existing book in-place
      update public.books
      set title = v_title,
          author = v_author,
          category = case when v_category <> '' then v_category else category end,
          normalized_title = v_norm_title,
          normalized_author = v_norm_author
      where id = v_current_book_id;

      update public.book_inventories
      set volume_range = format('1~%s권', p_last_volume),
          last_volume = p_last_volume,
          shelf_location = v_shelf,
          updated_at = now()
      where id = p_inventory_id;

      return p_inventory_id;
    else
      -- Other inventories (possibly other stores) reference current book.
      -- Insert a new book to isolate changes and repoint current inventory.
      insert into public.books (
        title,
        author,
        category,
        normalized_title,
        normalized_author,
        initial_consonants
      )
      values (
        v_title,
        v_author,
        v_category,
        v_norm_title,
        v_norm_author,
        ''
      )
      returning id into v_target_book_id;

      update public.book_inventories
      set book_id = v_target_book_id,
          volume_range = format('1~%s권', p_last_volume),
          last_volume = p_last_volume,
          shelf_location = v_shelf,
          updated_at = now()
      where id = p_inventory_id;

      return p_inventory_id;
    end if;
  end if;
end;
$$;
