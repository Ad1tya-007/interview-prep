-- Add email column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';

COMMENT ON COLUMN public.users.email IS 'Email address of the user.'; 