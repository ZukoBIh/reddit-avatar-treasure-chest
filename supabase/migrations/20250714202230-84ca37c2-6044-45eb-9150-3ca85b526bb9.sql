-- Fix RLS policies for nft_rarities table to work with wallet connections
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own NFT rarities" ON public.nft_rarities;
DROP POLICY IF EXISTS "Users can create their own NFT rarities" ON public.nft_rarities;
DROP POLICY IF EXISTS "Users can update their own NFT rarities" ON public.nft_rarities;
DROP POLICY IF EXISTS "Users can delete their own NFT rarities" ON public.nft_rarities;

-- Create new policies that allow public access since we're using wallet connections
CREATE POLICY "Anyone can view NFT rarities" 
ON public.nft_rarities 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create NFT rarities" 
ON public.nft_rarities 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update NFT rarities" 
ON public.nft_rarities 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete NFT rarities" 
ON public.nft_rarities 
FOR DELETE 
USING (true);