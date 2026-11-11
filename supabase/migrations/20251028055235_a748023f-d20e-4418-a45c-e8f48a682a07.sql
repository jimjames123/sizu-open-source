-- Create function to update timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create business_adverts table for marketplace
CREATE TABLE public.business_adverts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  business_category TEXT NOT NULL,
  flyer_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_adverts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active business adverts
CREATE POLICY "Allow public read access to active business adverts"
ON public.business_adverts
FOR SELECT
USING (is_active = true AND now() BETWEEN start_date AND end_date);

-- Admin users can manage all business adverts
CREATE POLICY "Admin users can manage all business adverts"
ON public.business_adverts
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_business_adverts_updated_at
BEFORE UPDATE ON public.business_adverts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();