-- Feedback tables for AI suggestions (active learning store)
CREATE TABLE public.duplicate_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  similar_project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  similarity_score numeric,
  verdict text NOT NULL CHECK (verdict IN ('confirmed','denied','review')),
  reasons jsonb,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.duplicate_feedback TO authenticated;
GRANT ALL ON public.duplicate_feedback TO service_role;
ALTER TABLE public.duplicate_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage duplicate feedback" ON public.duplicate_feedback
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.collaboration_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  suggested_org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  suggested_project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  match_score numeric,
  verdict text NOT NULL CHECK (verdict IN ('accepted','rejected','pending')),
  rationale jsonb,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collaboration_feedback TO authenticated;
GRANT ALL ON public.collaboration_feedback TO service_role;
ALTER TABLE public.collaboration_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage collab feedback" ON public.collaboration_feedback
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.policy_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  region text,
  sector text,
  content_markdown text NOT NULL,
  content_json jsonb,
  generated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.policy_briefs TO authenticated;
GRANT ALL ON public.policy_briefs TO service_role;
ALTER TABLE public.policy_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage policy briefs" ON public.policy_briefs
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Anyone can read policy briefs" ON public.policy_briefs
  FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.policy_briefs TO anon;