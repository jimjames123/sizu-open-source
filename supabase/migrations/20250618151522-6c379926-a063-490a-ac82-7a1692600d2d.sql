
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their uploads" ON storage.objects;

-- Create more permissive policies for project-images bucket
CREATE POLICY "Allow authenticated users to upload to project-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update project-images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete project-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');
