-- FemTech monitoring reports: aggregate, non-identifying project outcomes only.
create table if not exists public.femtech_reports (
 id uuid primary key default gen_random_uuid(),
 project_id uuid not null references public.projects(id) on delete cascade,
 reporting_period_start date not null,
 reporting_period_end date not null,
 target_beneficiaries integer not null check (target_beneficiaries >= 0),
 reached_beneficiaries integer not null check (reached_beneficiaries >= 0),
 outcomes text not null default '',
 barriers text not null default '',
 evidence_summary text not null default '',
 next_steps text not null default '',
 status text not null default 'draft' check (status in ('draft','submitted','under_review','verified','needs_revision')),
 reviewer_notes text,
 reviewed_by uuid references auth.users(id),
 reviewed_at timestamptz,
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint femtech_reporting_period_valid check (reporting_period_end >= reporting_period_start),
 constraint femtech_reports_unique_period unique (project_id, reporting_period_start, reporting_period_end)
);
create index if not exists femtech_reports_project_idx on public.femtech_reports(project_id);
alter table public.femtech_reports enable row level security;
create policy "Project owners read their FemTech reports" on public.femtech_reports for select to authenticated
 using (exists (select 1 from public.projects p where p.id=project_id and p.organization_id=auth.uid()));
create policy "Project owners create draft FemTech reports" on public.femtech_reports for insert to authenticated
 with check (created_by=auth.uid() and status='draft' and reviewer_notes is null and reviewed_by is null and reviewed_at is null and exists (select 1 from public.projects p where p.id=project_id and p.organization_id=auth.uid() and p.metadata @> '{"femtech":true}'::jsonb));
-- Owners can edit draft or revision-requested reports only, and cannot set verification fields.
create policy "Project owners update editable FemTech reports" on public.femtech_reports for update to authenticated
 using (status in ('draft','needs_revision') and created_by=auth.uid() and exists (select 1 from public.projects p where p.id=project_id and p.organization_id=auth.uid()))
 with check (status in ('draft','submitted') and created_by=auth.uid()
 and exists (select 1 from public.projects p where p.id=project_id and p.organization_id=auth.uid() and p.metadata @> '{"femtech":true}'::jsonb));
create policy "Admins read FemTech reports" on public.femtech_reports for select to authenticated using (public.is_admin());
create policy "Admins review submitted FemTech reports" on public.femtech_reports for update to authenticated
 using (public.is_admin() and status in ('submitted','under_review'))
 with check (public.is_admin() and status in ('under_review','verified','needs_revision'));
-- Enforce review-state and immutable ownership fields independently of RLS.
create or replace function public.femtech_report_guard() returns trigger language plpgsql set search_path=public as $$
begin
 if tg_op='UPDATE' then
  if new.project_id is distinct from old.project_id or new.created_by is distinct from old.created_by or new.created_at is distinct from old.created_at then
   raise exception 'Report ownership cannot be changed';
  end if;
  if public.is_admin() and old.status in ('submitted','under_review') then
   if new.project_id is distinct from old.project_id or new.created_by is distinct from old.created_by or
      new.reporting_period_start is distinct from old.reporting_period_start or new.reporting_period_end is distinct from old.reporting_period_end or
      new.target_beneficiaries is distinct from old.target_beneficiaries or new.reached_beneficiaries is distinct from old.reached_beneficiaries or
      new.outcomes is distinct from old.outcomes or new.barriers is distinct from old.barriers or
      new.evidence_summary is distinct from old.evidence_summary or new.next_steps is distinct from old.next_steps then
      raise exception 'Reviewers cannot change organization-reported outcomes';
   end if;
   if new.status not in ('under_review','verified','needs_revision') then raise exception 'Invalid review transition'; end if;
   if new.reviewed_by is distinct from auth.uid() then raise exception 'Reviewer must be current admin'; end if;
   if new.reviewed_at is null then raise exception 'Review timestamp required'; end if;
   new.updated_at=now();
   return new;
  end if;
  if old.status not in ('draft','needs_revision') then
   raise exception 'Report is locked for organization edits';
  end if;
  if new.status not in ('draft','submitted') then
   raise exception 'Invalid organization report status transition';
  end if;
  if new.reviewed_by is distinct from old.reviewed_by or new.reviewed_at is distinct from old.reviewed_at or new.reviewer_notes is distinct from old.reviewer_notes then
   raise exception 'Review details cannot be edited by organizations';
  end if;
  new.updated_at=now();
 end if;
 return new;
end $$;
drop trigger if exists femtech_report_guard_trigger on public.femtech_reports;
create trigger femtech_report_guard_trigger before update on public.femtech_reports for each row execute function public.femtech_report_guard();
