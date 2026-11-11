-- SIZU publication review: DEVELOPMENT DRAFT ONLY.
-- Do not apply to the production Supabase database until RLS policies,
-- Edge Functions, existing-publication backfill and admin role checks are reviewed.
-- Project progress (projects.status) is intentionally untouched.
BEGIN;
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS review_status text,
  ADD COLUMN IF NOT EXISTS review_feedback text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid;
ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_review_status_check;
ALTER TABLE public.projects
  ADD CONSTRAINT projects_review_status_check
  CHECK (review_status IN ('pending_review','approved','changes_requested','rejected'));
-- Existing projects stay NULL until explicitly classified; do not hide them accidentally.
-- New project default is deliberately NOT enabled until public read policies and
-- all insertion paths have been updated together.
CREATE TABLE IF NOT EXISTS public.project_review_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL,
  previous_status text,
  new_status text NOT NULL CHECK (new_status IN ('pending_review','approved','changes_requested','rejected')),
  feedback text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_review_events ENABLE ROW LEVEL SECURITY;
-- No client policies yet: deny by default until verified admin-only access
-- is implemented using the project's actual authorization model.
COMMIT;
