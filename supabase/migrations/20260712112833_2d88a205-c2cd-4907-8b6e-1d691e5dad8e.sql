-- Grant admin to specific email on signup / confirmation
create or replace function public.grant_admin_for_known_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = 'peterjohnflynn_uk@yahoo.co.uk' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_grant_known_admin
after insert on auth.users
for each row execute function public.grant_admin_for_known_email();

-- Also grant now if the user already exists
insert into public.user_roles (user_id, role)
select id, 'admin'::app_role from auth.users
where lower(email) = 'peterjohnflynn_uk@yahoo.co.uk'
on conflict (user_id, role) do nothing;