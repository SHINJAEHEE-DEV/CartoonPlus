-- A correction may merge only a duplicate inventory in the same Store.
create or replace function public.update_inventory_for_store(
  p_inventory_id uuid, p_title text, p_author text, p_category text,
  p_last_volume integer, p_shelf_location text, p_merge_duplicate boolean default false
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_store_id uuid; v_current_book_id uuid; v_existing_book_id uuid; v_duplicate_inventory_id uuid;
  v_clean_title text := btrim(coalesce(p_title, ''));
  v_clean_author text := btrim(coalesce(p_author, ''));
  v_clean_category text := btrim(coalesce(p_category, ''));
  v_clean_shelf text := btrim(coalesce(p_shelf_location, ''));
begin
  if v_clean_title = '' then raise exception 'title cannot be empty'; end if;
  if p_last_volume is not null and p_last_volume < 1 then raise exception 'last volume must be positive'; end if;

  select store_id, book_id into v_store_id, v_current_book_id
  from public.book_inventories where id = p_inventory_id for update;
  if v_store_id is null then raise exception 'inventory not found'; end if;
  if not public.can_manage_store(v_store_id) then raise exception 'store access denied'; end if;

  select id into v_existing_book_id from public.books
  where title = v_clean_title and author = v_clean_author;

  if v_existing_book_id is not null and v_existing_book_id <> v_current_book_id then
    select id into v_duplicate_inventory_id from public.book_inventories
    where store_id = v_store_id and book_id = v_existing_book_id for update;
    if v_duplicate_inventory_id is null then
      raise exception 'a different book already has this title and author';
    end if;
    if not p_merge_duplicate then raise exception 'duplicate inventory exists for this store'; end if;

    delete from public.book_inventories where id = v_duplicate_inventory_id;
    update public.books
    set category = case when v_clean_category = '' then category else v_clean_category end
    where id = v_existing_book_id;
    update public.book_inventories set book_id = v_existing_book_id where id = p_inventory_id;
  else
    update public.books
    set title = v_clean_title,
        author = v_clean_author,
        category = case when v_clean_category = '' then category else v_clean_category end,
        normalized_title = lower(regexp_replace(v_clean_title, '[[:space:][:punct:]]', '', 'g')),
        normalized_author = lower(regexp_replace(v_clean_author, '[[:space:][:punct:]]', '', 'g'))
    where id = v_current_book_id;
  end if;

  update public.book_inventories
  set volume_range = case when p_last_volume is null then '확인 중' else format('1~%s권', p_last_volume) end,
      last_volume = p_last_volume, shelf_location = v_clean_shelf, updated_at = now()
  where id = p_inventory_id;
  return p_inventory_id;
end;
$$;
