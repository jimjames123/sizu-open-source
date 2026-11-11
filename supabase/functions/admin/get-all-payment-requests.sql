
-- Add this to your SQL migrations
CREATE OR REPLACE FUNCTION public.get_all_payment_requests()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  requesting_user_email TEXT;
  is_admin BOOLEAN;
BEGIN
  -- Get the email of the requesting user using auth.uid() instead of directly querying auth.users
  SELECT email INTO requesting_user_email FROM auth.users WHERE id = auth.uid();
  
  -- Check if the user is an admin using admin_settings table
  SELECT EXISTS (
    SELECT 1 FROM public.admin_settings WHERE admin_email = requesting_user_email
  ) INTO is_admin;
  
  -- If not an admin, return empty result
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;
  
  -- Return all payment requests with organization names
  RETURN QUERY
  SELECT 
    json_build_object(
      'id', pr.id,
      'organization_id', pr.organization_id,
      'amount', pr.amount,
      'payment_date', pr.payment_date,
      'status', pr.status,
      'created_at', pr.created_at,
      'updated_at', pr.updated_at,
      'payment_proof', pr.payment_proof,
      'admin_notes', pr.admin_notes,
      'rejection_reason', pr.rejection_reason,
      'expires_at', pr.expires_at,
      'profiles', json_build_object(
        'organization_name', p.organization_name
      )
    )
  FROM 
    public.payment_requests pr
    LEFT JOIN public.profiles p ON pr.organization_id = p.id
  ORDER BY 
    pr.created_at DESC;
END;
$$;
