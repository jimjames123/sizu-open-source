-- Tighten profiles table RLS to prevent unauthorized reads
-- 1) Remove overly permissive policy that allowed all authenticated users to read all profiles
DROP POLICY IF EXISTS "Allow authenticated users to view all profiles" ON public.profiles;

-- 2) Ensure RLS is enabled (idempotent safeguard)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3) Allow only profile owners to read their own profile (kept if already exists)
--    Note: This CREATE will fail if it already exists, so we guard it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);
  END IF;
END $$;

-- 4) Add admin-only read access for operational needs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (is_admin());
  END IF;
END $$;
