create or replace function public.set_staff_account_status(p_account_id uuid, p_status text)
returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.is_admin() then raise exception 'admin required'; end if;
 if p_status not in ('approved','deactivated') then raise exception 'invalid status'; end if;
 update staff_accounts set status=p_status, approved_at=case when p_status='approved' then now() else approved_at end where id=p_account_id;
end $$;
grant execute on function public.set_staff_account_status(uuid,text) to authenticated;

create or replace function public.list_staff_accounts()
returns table(id uuid,name text,login_id text,phone_last4 text,role text,status text,created_at timestamptz)
language sql stable security definer set search_path=public as $$
 select id,name,login_id,phone_last4,role,status,created_at from staff_accounts where public.is_admin() order by created_at desc;
$$;
grant execute on function public.list_staff_accounts() to authenticated;

create or replace function public.issue_temporary_password(p_account_id uuid, p_password text)
returns void language plpgsql security definer set search_path=public,extensions as $$
begin
 if not public.is_admin() then raise exception 'admin required'; end if;
 if length(p_password) < 8 then raise exception 'password must be at least 8 characters'; end if;
 update auth.users set encrypted_password=crypt(p_password, gen_salt('bf')) where id=p_account_id;
end $$;
grant execute on function public.issue_temporary_password(uuid,text) to authenticated;
