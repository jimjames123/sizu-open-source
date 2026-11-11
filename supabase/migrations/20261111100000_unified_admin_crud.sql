-- Uniform administrator CRUD on SIZU application tables.
-- Every authenticated account recognized by public.is_admin() receives the same access.
-- Existing ordinary-user RLS policies remain in place.
do $$
declare t text;
begin
 foreach t in array array[
  'admin_settings','business_adverts','collaboration_feedback','duplicate_feedback',
  'events','femtech_reports','opportunities','organizations','page_views',
  'payment_requests','policy_briefs','profiles','projects','subscriptions','vital_info'
 ] loop
  execute format('create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
   'Unified admin CRUD', t);
 end loop;
end $$;
-- Database trigger guards on FemTech reports still prevent changing immutable
-- ownership fields and previously reviewed results; verification remains auditable.
