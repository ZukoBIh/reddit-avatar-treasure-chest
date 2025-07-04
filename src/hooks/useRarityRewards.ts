import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RarityReward {
  id: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  baseXpMin: number;
  baseXpMax: number;
  tokenDropChance: number;
  tokenAmountMin: number;
  tokenAmountMax: number;
  levelUpHroom: number;
  levelUpSpore: number;
}

export const useRarityRewards = () => {
  const [rewards, setRewards] = useState<Record<string, RarityReward>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadRewards = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rarity_rewards')
        .select('*');

      if (error) throw error;

      const rewardsMap = data.reduce((acc, reward) => {
        acc[reward.rarity as 'Common' | 'Rare' | 'Legendary'] = {
          id: reward.id,
          rarity: reward.rarity as 'Common' | 'Rare' | 'Legendary',
          baseXpMin: reward.base_xp_min,
          baseXpMax: reward.base_xp_max,
          tokenDropChance: reward.token_drop_chance,
          tokenAmountMin: reward.token_amount_min,
          tokenAmountMax: reward.token_amount_max,
          levelUpHroom: reward.level_up_hroom,
          levelUpSpore: reward.level_up_spore,
        };
        return acc;
      }, {} as Record<string, RarityReward>);

      setRewards(rewardsMap);
    } catch (error) {
      console.error('Error loading rarity rewards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReward = async (rarity: 'Common' | 'Rare' | 'Legendary', updates: Partial<RarityReward>) => {
    try {
      const { error } = await supabase
        .from('rarity_rewards')
        .update({
          base_xp_min: updates.baseXpMin,
          base_xp_max: updates.baseXpMax,
          token_drop_chance: updates.tokenDropChance,
          token_amount_min: updates.tokenAmountMin,
          token_amount_max: updates.tokenAmountMax,
          level_up_hroom: updates.levelUpHroom,
          level_up_spore: updates.levelUpSpore,
        })
        .eq('rarity', rarity);

      if (error) throw error;

      setRewards(prev => ({
        ...prev,
        [rarity]: { ...prev[rarity], ...updates }
      }));
    } catch (error) {
      console.error('Error updating rarity reward:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  return {
    rewards,
    isLoading,
    updateReward,
    reloadRewards: loadRewards,
  };
};