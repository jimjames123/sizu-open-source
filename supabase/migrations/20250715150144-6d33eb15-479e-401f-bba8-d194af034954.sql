-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Users can upload payment proofs" ON storage.objects;

-- Create new policy for payment proof uploads
CREATE POLICY "Users can upload payment proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid() IS NOT NULL);

-- Ensure proper admin access to payment proofs
DROP POLICY IF EXISTS "Admins can view payment proofs" ON storage.objects;
CREATE POLICY "Admins can view payment proofs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-proofs' AND (SELECT public.is_admin()));