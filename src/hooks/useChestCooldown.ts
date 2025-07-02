
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

interface ChestCooldown {
  id: string;
  walletAddress: string;
  nftId: string;
  lastOpenedAt: string;
  createdAt: string;
}

const COOLDOWN_HOURS = {
  Common: 6,
  Rare: 12,
  Legendary: 24
};

export const useChestCooldown = () => {
  const { address } = useAccount();
  const [cooldowns, setCooldowns] = useState<ChestCooldown[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCooldownStatus = (nftId: string, rarity: 'Common' | 'Rare' | 'Legendary') => {
    const cooldown = cooldowns.find(cd => cd.nftId === nftId);
    if (!cooldown) return { canOpen: true, remainingTime: 0 };

    const lastOpened = new Date(cooldown.lastOpenedAt);
    const cooldownHours = COOLDOWN_HOURS[rarity];
    const nextOpenTime = new Date(lastOpened.getTime() + cooldownHours * 60 * 60 * 1000);
    const now = new Date();
    
    const canOpen = now >= nextOpenTime;
    const remainingTime = canOpen ? 0 : Math.ceil((nextOpenTime.getTime() - now.getTime()) / (1000 * 60 * 60));

    return { canOpen, remainingTime };
  };

  const updateCooldown = async (nftId: string) => {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from('chest_cooldowns')
        .upsert({
          wallet_address: address,
          nft_id: nftId,
          last_opened_at: new Date().toISOString()
        }, {
          onConflict: 'wallet_address,nft_id'
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setCooldowns(prev => {
        const existing = prev.find(cd => cd.nftId === nftId);
        if (existing) {
          return prev.map(cd => 
            cd.nftId === nftId 
              ? { ...cd, lastOpenedAt: new Date().toISOString() }
              : cd
          );
        } else {
          return [...prev, {
            id: data.id,
            walletAddress: data.wallet_address,
            nftId: data.nft_id,
            lastOpenedAt: data.last_opened_at,
            createdAt: data.created_at
          }];
        }
      });
    } catch (error) {
      console.error('Error updating cooldown:', error);
    }
  };

  useEffect(() => {
    const loadCooldowns = async () => {
      if (!address) {
        setCooldowns([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('chest_cooldowns')
          .select('*')
          .eq('wallet_address', address);

        if (error) throw error;

        setCooldowns(data.map(cd => ({
          id: cd.id,
          walletAddress: cd.wallet_address,
          nftId: cd.nft_id,
          lastOpenedAt: cd.last_opened_at,
          createdAt: cd.created_at
        })));
      } catch (error) {
        console.error('Error loading cooldowns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCooldowns();
  }, [address]);

  return {
    cooldowns,
    isLoading,
    getCooldownStatus,
    updateCooldown
  };
};
