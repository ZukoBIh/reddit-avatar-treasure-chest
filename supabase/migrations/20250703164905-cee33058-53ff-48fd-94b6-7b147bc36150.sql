
-- Update the user profile to make the specified wallet address an admin
UPDATE user_profiles 
SET is_admin = true 
WHERE wallet_address = '0xB7a458AF8eD4D14fB9F89284Ad26eCd4C02AFa12';

-- If the profile doesn't exist yet, insert it as an admin
INSERT INTO user_profiles (wallet_address, is_admin, level, current_xp, total_hroom, total_spores)
VALUES ('0xB7a458AF8eD4D14fB9F89284Ad26eCd4C02AFa12', true, 1, 0, 0, 0)
ON CONFLICT (wallet_address) 
DO UPDATE SET is_admin = true;
