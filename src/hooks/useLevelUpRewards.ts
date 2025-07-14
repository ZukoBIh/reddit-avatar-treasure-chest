import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LevelReward {
  id: string;
  rewardType: 'hroom' | 'spore' | 'both';
  hroomAmount: number;
  sporeAmount: number;
  weight: number;
  minLevel: number;
  maxLevel: number;
  isActive: boolean;
}

export const useLevelUpRewards = () => {
  const [rewardsPool, setRewardsPool] = useState<LevelReward[]>([]);

  useEffect(() => {
    const loadRewardsPool = async () => {
      try {
        const { data, error } = await supabase
          .from('level_rewards_pool')
          .select('*')
          .eq('is_active', true)
          .order('weight', { ascending: false });

        if (error) throw error;

        setRewardsPool(data.map(reward => ({
          id: reward.id,
          rewardType: reward.reward_type as 'hroom' | 'spore' | 'both',
          hroomAmount: reward.hroom_amount,
          sporeAmount: reward.spore_amount,
          weight: reward.weight,
          minLevel: reward.min_level,
          maxLevel: reward.max_level,
          isActive: reward.is_active,
        })));
      } catch (error) {
        console.error('Error loading rewards pool:', error);
      }
    };

    loadRewardsPool();
  }, []);

  // Get available rewards for a specific level
  const getAvailableRewards = (level: number): LevelReward[] => {
    return rewardsPool.filter(
      reward => level >= reward.minLevel && level <= reward.maxLevel
    );
  };

  // Select a random reward based on weights
  const selectRandomReward = (level: number): LevelReward | null => {
    const availableRewards = getAvailableRewards(level);
    if (availableRewards.length === 0) return null;

    // Calculate total weight
    const totalWeight = availableRewards.reduce((sum, reward) => sum + reward.weight, 0);
    
    // Generate random number between 0 and totalWeight
    let random = Math.random() * totalWeight;
    
    // Select reward based on weight
    for (const reward of availableRewards) {
      random -= reward.weight;
      if (random <= 0) {
        return reward;
      }
    }
    
    // Fallback to first reward
    return availableRewards[0];
  };

  // Get reward amounts for level up
  const getLevelUpRewards = (newLevel: number, levelsGained: number = 1) => {
    let totalHroom = 0;
    let totalSpores = 0;
    
    // Roll for rewards for each level gained
    for (let i = 0; i < levelsGained; i++) {
      const reward = selectRandomReward(newLevel - i);
      if (reward) {
        totalHroom += reward.hroomAmount;
        totalSpores += reward.sporeAmount;
      }
    }
    
    return { hroom: totalHroom, spores: totalSpores };
  };

  return {
    rewardsPool,
    getAvailableRewards,
    selectRandomReward,
    getLevelUpRewards,
  };
};