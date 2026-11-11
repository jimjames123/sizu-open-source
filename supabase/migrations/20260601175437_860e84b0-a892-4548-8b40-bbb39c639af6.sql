
-- 1) Remove open payment-proofs storage policies
DROP POLICY IF EXISTS "Anyone can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view payment proofs" ON storage.objects;

-- 2) Tighten project-images update/delete to folder-owner only
DROP POLICY IF EXISTS "Allow authenticated users to delete project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update project-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete files in project-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update files in project-images" ON storage.objects;

CREATE POLICY "Owners can update their project images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images'
  AND auth.uid() = ((storage.foldername(name))[1])::uuid
);

CREATE POLICY "Owners can delete their project images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images'
  AND auth.uid() = ((storage.foldername(name))[1])::uuid
);

-- Admins keep full control over project images
CREATE POLICY "Admins can update any project image"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admins can delete any project image"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND public.is_admin());

-- 3) Restrict subscriptions INSERT to authenticated users for their own org
DROP POLICY IF EXISTS "System can insert subscriptions" ON public.subscriptions;

CREATE POLICY "Users can submit own org subscription"
ON public.subscriptions FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    OR organization_id = auth.uid()
    OR public.is_admin()
  )
);

-- 4) Fix mutable search_path on existing functions
ALTER FUNCTION public.can_create_projects(uuid) SET search_path = public;
ALTER FUNCTION public.is_admin_by_email(text) SET search_path = public;
ALTER FUNCTION public.check_admin_tables_exist() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.create_subscription_on_approval() SET search_path = public;
ALTER FUNCTION public.create_subscription_on_payment_approval() SET search_path = public;
