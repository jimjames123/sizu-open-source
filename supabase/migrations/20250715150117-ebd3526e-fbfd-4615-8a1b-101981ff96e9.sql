-- Check if payment-proofs bucket exists and create if not
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for payment-proofs bucket
CREATE POLICY "Admins can view payment proofs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-proofs' AND (SELECT public.is_admin()));

CREATE POLICY "Users can upload payment proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid() IS NOT NULL);

-- Also ensure the bucket allows proper access
UPDATE storage.buckets 
SET public = false 
WHERE id = 'payment-proofs';