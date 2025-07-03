
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RewardConfig {
  id: string;
  configType: string;
  baseXpMin: number;
  baseXpMax: number;
  tokenDropChance: number;
  tokenAmountMin: number;
  tokenAmountMax: number;
  levelUpHroom: number;
  levelUpSpore: number;
}

export const useRewardConfig = () => {
  const [config, setConfig] = useState<RewardConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reward_config')
        .select('*')
        .eq('config_type', 'default')
        .single();

      if (error) throw error;

      setConfig({
        id: data.id,
        configType: data.config_type,
        baseXpMin: data.base_xp_min,
        baseXpMax: data.base_xp_max,
        tokenDropChance: data.token_drop_chance,
        tokenAmountMin: data.token_amount_min,
        tokenAmountMax: data.token_amount_max,
        levelUpHroom: data.level_up_hroom,
        levelUpSpore: data.level_up_spore,
      });
    } catch (error) {
      console.error('Error loading reward config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<RewardConfig>) => {
    if (!config) return;

    try {
      const { error } = await supabase
        .from('reward_config')
        .update({
          base_xp_min: updates.baseXpMin ?? config.baseXpMin,
          base_xp_max: updates.baseXpMax ?? config.baseXpMax,
          token_drop_chance: updates.tokenDropChance ?? config.tokenDropChance,
          token_amount_min: updates.tokenAmountMin ?? config.tokenAmountMin,
          token_amount_max: updates.tokenAmountMax ?? config.tokenAmountMax,
          level_up_hroom: updates.levelUpHroom ?? config.levelUpHroom,
          level_up_spore: updates.levelUpSpore ?? config.levelUpSpore,
        })
        .eq('config_type', 'default');

      if (error) throw error;

      setConfig({ ...config, ...updates });
    } catch (error) {
      console.error('Error updating reward config:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    isLoading,
    updateConfig,
    reloadConfig: loadConfig,
  };
};
