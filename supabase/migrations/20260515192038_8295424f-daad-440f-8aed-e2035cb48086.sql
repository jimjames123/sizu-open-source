CREATE TABLE public.vital_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL CHECK (char_length(summary) <= 300),
  source_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Business Registration','Tax & Compliance','Grants & Finance','Legal','Agriculture','Health')),
  web_link TEXT NOT NULL,
  valid_until DATE,
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live','expired')),
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vital_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view live vital info"
ON public.vital_info FOR SELECT
USING (status = 'live' OR public.is_admin());

CREATE POLICY "Admins can insert vital info"
ON public.vital_info FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update vital info"
ON public.vital_info FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete vital info"
ON public.vital_info FOR DELETE
USING (public.is_admin());

CREATE INDEX idx_vital_info_status_category ON public.vital_info(status, category);