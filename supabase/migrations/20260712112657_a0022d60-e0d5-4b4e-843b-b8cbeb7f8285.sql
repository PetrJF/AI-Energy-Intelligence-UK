-- Role enum
create type public.app_role as enum ('admin', 'user');

-- user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

-- Security definer role check
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Users can see their own roles
create policy "Users can view own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

-- Only admins can manage roles
create policy "Admins can manage roles"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Admin read access to leads (contains newsletter, tool, consultancy submissions)
create policy "Admins can view all leads"
on public.leads for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Admin read access to saved_reports (report requests)
create policy "Admins can view all saved reports"
on public.saved_reports for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Admin read access to activity log
create policy "Admins can view all activity"
on public.activity_log for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));