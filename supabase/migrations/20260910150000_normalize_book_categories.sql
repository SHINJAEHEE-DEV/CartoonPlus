create or replace function public.normalize_book_category(p_category text)
returns text language sql immutable as $$
  select case
    when regexp_replace(regexp_replace(trim(coalesce(p_category, '')), '\s*,\s*', ',', 'g'), '(^|,)sf(,|$)', '\1SF\2', 'gi') = 'SF,판타지' then '판타지,SF'
    else regexp_replace(regexp_replace(trim(coalesce(p_category, '')), '\s*,\s*', ',', 'g'), '(^|,)sf(,|$)', '\1SF\2', 'gi')
  end
$$;

update public.books
set category = public.normalize_book_category(category)
where category is distinct from public.normalize_book_category(category);

create or replace function public.normalize_book_category_before_write()
returns trigger language plpgsql as $$
begin
  new.category := public.normalize_book_category(new.category);
  return new;
end;
$$;

drop trigger if exists normalize_book_category_before_write on public.books;
create trigger normalize_book_category_before_write
before insert or update of category on public.books
for each row execute function public.normalize_book_category_before_write();
