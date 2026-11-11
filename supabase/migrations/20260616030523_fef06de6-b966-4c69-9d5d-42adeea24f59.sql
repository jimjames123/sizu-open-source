
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  user_id UUID,
  session_id TEXT NOT NULL,
  user_agent TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_session ON public.page_views (session_id);
CREATE INDEX idx_page_views_path ON public.page_views (path);

GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone may insert a page view (tracking pixel-style)
CREATE POLICY "Anyone can record a page view"
  ON public.page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read traffic data
CREATE POLICY "Admins can read all page views"
  ON public.page_views FOR SELECT
  TO authenticated
  USING (public.is_admin());
