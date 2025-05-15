-- Add avatar_url column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';

COMMENT ON COLUMN public.users.avatar_url IS 'URL to the user''s avatar image. For Google auth, this is from user_metadata.avatar_url. For OTP signup, default empty string.'; 