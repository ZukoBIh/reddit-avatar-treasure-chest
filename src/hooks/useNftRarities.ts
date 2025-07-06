import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

export const useNftRarities = () => {
  const { address } = useAccount();
  const [rarities, setRarities] = useState<Record<string, 'Common' | 'Rare' | 'Legendary'>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadRarities = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('nft_rarities')
        .select('*')
        .eq('wallet_address', address);

      if (error) throw error;

      const raritiesMap = data.reduce((acc, item) => {
        acc[item.nft_id] = item.rarity as 'Common' | 'Rare' | 'Legendary';
        return acc;
      }, {} as Record<string, 'Common' | 'Rare' | 'Legendary'>);

      setRarities(raritiesMap);
    } catch (error) {
      console.error('Error loading NFT rarities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRarity = async (nftId: string, rarity: 'Common' | 'Rare' | 'Legendary') => {
    if (!address) return;

    try {
      const { error } = await supabase
        .from('nft_rarities')
        .upsert({
          wallet_address: address,
          nft_id: nftId,
          rarity: rarity
        });

      if (error) throw error;

      setRarities(prev => ({ ...prev, [nftId]: rarity }));
    } catch (error) {
      console.error('Error updating NFT rarity:', error);
      throw error;
    }
  };

  const saveAllRarities = async (raritiesData: Record<string, 'Common' | 'Rare' | 'Legendary'>) => {
    if (!address) return;

    try {
      const upsertData = Object.entries(raritiesData).map(([nftId, rarity]) => ({
        wallet_address: address,
        nft_id: nftId,
        rarity: rarity
      }));

      const { error } = await supabase
        .from('nft_rarities')
        .upsert(upsertData);

      if (error) throw error;
      
      setRarities(raritiesData);
    } catch (error) {
      console.error('Error saving NFT rarities:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadRarities();
  }, [address]);

  return {
    rarities,
    isLoading,
    updateRarity,
    saveAllRarities,
    reloadRarities: loadRarities,
  };
};