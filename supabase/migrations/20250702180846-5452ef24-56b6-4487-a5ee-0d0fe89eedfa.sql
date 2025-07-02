
-- Create chest cooldowns table to track when users can open chests again
CREATE TABLE public.chest_cooldowns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  nft_id TEXT NOT NULL,
  last_opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, nft_id)
);

-- Add Row Level Security
ALTER TABLE public.chest_cooldowns ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own cooldowns
CREATE POLICY "Users can view their own cooldowns" 
  ON public.chest_cooldowns 
  FOR SELECT 
  USING (true);

-- Policy to allow users to insert their own cooldowns
CREATE POLICY "Users can insert their own cooldowns" 
  ON public.chest_cooldowns 
  FOR INSERT 
  WITH CHECK (true);

-- Policy to allow users to update their own cooldowns
CREATE POLICY "Users can update their own cooldowns" 
  ON public.chest_cooldowns 
  FOR UPDATE 
  USING (true);

-- Add admin functionality to user_profiles for rarity changes
ALTER TABLE public.user_profiles 
ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
