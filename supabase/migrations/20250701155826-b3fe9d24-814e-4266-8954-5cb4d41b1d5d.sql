
-- Create user profiles table to store XP, levels, and token balances
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  total_hroom INTEGER NOT NULL DEFAULT 0,
  total_spores INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - anyone can read profiles but only update their own
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view profiles (for leaderboards, etc.)
CREATE POLICY "Anyone can view user profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (true);

-- Policy to allow users to insert their own profile
CREATE POLICY "Users can create their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Policy to allow users to update profiles based on wallet address
CREATE POLICY "Users can update profiles" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
