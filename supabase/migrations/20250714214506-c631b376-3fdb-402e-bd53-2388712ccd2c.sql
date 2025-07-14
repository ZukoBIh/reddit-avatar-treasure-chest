-- Add index on wallet_address for faster updates
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address ON public.user_profiles(wallet_address);

-- Add index on wallet_address for chest_cooldowns (used in the chest opening flow)
CREATE INDEX IF NOT EXISTS idx_chest_cooldowns_wallet_address_nft_id ON public.chest_cooldowns(wallet_address, nft_id);

-- Add index on wallet_address for user_achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_wallet_address ON public.user_achievements(wallet_address);

-- Add index on wallet_address for nft_rarities
CREATE INDEX IF NOT EXISTS idx_nft_rarities_wallet_address ON public.nft_rarities(wallet_address);