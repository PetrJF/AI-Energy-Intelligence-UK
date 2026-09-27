-- Public pages never query these tables directly: reads go through server code
-- that selects an explicit, safe column list. Removing the open read rules makes
-- it impossible for internal notes to be read by a visitor.
drop policy if exists "Public can view published projects" on public.dc_projects;
drop policy if exists "published grid evidence readable" on public.grid_evidence;

revoke all on public.dc_projects from anon;
revoke all on public.grid_evidence from anon;
revoke all on public.dc_projects from public;
revoke all on public.grid_evidence from public;

grant all on public.dc_projects to service_role;
grant all on public.grid_evidence to service_role;
grant select, insert, update, delete on public.dc_projects to authenticated;
grant select, insert, update, delete on public.grid_evidence to authenticated;