-- Remove the legacy admin_settings table that is no longer used
-- The application now uses Supabase Auth + user_roles for authentication
DROP TABLE IF EXISTS public.admin_settings;