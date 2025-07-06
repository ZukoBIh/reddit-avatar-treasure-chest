-- Create table to store NFT rarity overrides
CREATE TABLE public.nft_rarities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  nft_id TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Rare', 'Legendary')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, nft_id)
);

-- Enable Row Level Security
ALTER TABLE public.nft_rarities ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own NFT rarities" 
ON public.nft_rarities 
FOR SELECT 
USING (auth.uid()::text = wallet_address OR wallet_address = auth.uid()::text);

CREATE POLICY "Users can create their own NFT rarities" 
ON public.nft_rarities 
FOR INSERT 
WITH CHECK (auth.uid()::text = wallet_address OR wallet_address = auth.uid()::text);

CREATE POLICY "Users can update their own NFT rarities" 
ON public.nft_rarities 
FOR UPDATE 
USING (auth.uid()::text = wallet_address OR wallet_address = auth.uid()::text);

CREATE POLICY "Users can delete their own NFT rarities" 
ON public.nft_rarities 
FOR DELETE 
USING (auth.uid()::text = wallet_address OR wallet_address = auth.uid()::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_nft_rarities_updated_at
BEFORE UPDATE ON public.nft_rarities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();