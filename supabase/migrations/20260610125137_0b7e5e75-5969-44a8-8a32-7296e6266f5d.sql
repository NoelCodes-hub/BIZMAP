
-- 1) business_stories: restrict INSERT to authenticated users
DROP POLICY IF EXISTS "Anyone can create stories" ON public.business_stories;
CREATE POLICY "Authenticated users can create stories"
ON public.business_stories
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 2) live_business_metrics: restrict writes to admins only
DROP POLICY IF EXISTS "Anyone can modify metrics" ON public.live_business_metrics;
DROP POLICY IF EXISTS "Anyone can update metrics" ON public.live_business_metrics;

CREATE POLICY "Admins can insert metrics"
ON public.live_business_metrics
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update metrics"
ON public.live_business_metrics
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete metrics"
ON public.live_business_metrics
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) Remove live_business_metrics from Realtime publication to address
-- unrestricted Realtime topic subscriptions (we cannot modify realtime schema).
ALTER PUBLICATION supabase_realtime DROP TABLE public.live_business_metrics;

-- 4) Lock down SECURITY DEFINER functions from being executed via the public API.
-- has_role and get_user_role are used in RLS policies, so keep EXECUTE for
-- authenticated only. handle_new_user is a trigger function and should not be
-- callable from the API at all.
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_user_role(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;
