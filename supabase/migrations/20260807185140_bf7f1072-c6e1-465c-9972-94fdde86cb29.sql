CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  funder_name text NOT NULL,
  opportunity_type text NOT NULL DEFAULT 'Grant',
  sector text NOT NULL DEFAULT 'General',
  region text,
  sdg text,
  amount_min numeric,
  amount_max numeric,
  currency text NOT NULL DEFAULT 'USD',
  eligibility text,
  description text,
  application_link text NOT NULL,
  deadline date,
  status text NOT NULL DEFAULT 'live',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.opportunities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view live opportunities"
ON public.opportunities FOR SELECT
USING (
  (status = 'live' AND (deadline IS NULL OR deadline >= CURRENT_DATE))
  OR public.is_admin()
);

CREATE POLICY "Admins can insert opportunities"
ON public.opportunities FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update opportunities"
ON public.opportunities FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete opportunities"
ON public.opportunities FOR DELETE
USING (public.is_admin());

CREATE TRIGGER update_opportunities_updated_at
BEFORE UPDATE ON public.opportunities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();