create policy "staff reads all SNU inventory"
on public.book_inventories
for select
using (public.is_approved_staff());
