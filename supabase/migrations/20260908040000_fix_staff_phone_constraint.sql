alter table public.staff_accounts
  drop constraint if exists staff_accounts_phone_last4_check;

alter table public.staff_accounts
  add constraint staff_accounts_phone_last4_check
  check (phone_last4 ~ '^[0-9]{4}$');
