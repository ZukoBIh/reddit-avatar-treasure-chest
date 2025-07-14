import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LevelingConfig {
  baseXpRequirement: number;
  xpScalingFactor: number;
  maxLevel: number;
}

export const useLevelingSystem = () => {
  const [config, setConfig] = useState<LevelingConfig | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('leveling_config')
          .select('*')
          .single();

        if (error) throw error;

        setConfig({
          baseXpRequirement: data.base_xp_requirement,
          xpScalingFactor: data.xp_scaling_factor,
          maxLevel: data.max_level,
        });
      } catch (error) {
        console.error('Error loading leveling config:', error);
        // Fallback to default values
        setConfig({
          baseXpRequirement: 100,
          xpScalingFactor: 1.15,
          maxLevel: 100,
        });
      }
    };

    loadConfig();
  }, []);

  // Calculate XP required for a specific level
  const getXpRequiredForLevel = (level: number): number => {
    if (!config || level <= 1) return config?.baseXpRequirement || 100;
    
    return Math.floor(config.baseXpRequirement * Math.pow(config.xpScalingFactor, level - 1));
  };

  // Calculate total XP required to reach a level
  const getTotalXpForLevel = (level: number): number => {
    if (!config || level <= 1) return 0;
    
    let totalXp = 0;
    for (let i = 2; i <= level; i++) {
      totalXp += getXpRequiredForLevel(i);
    }
    return totalXp;
  };

  // Calculate current level from total XP
  const getLevelFromXp = (totalXp: number): number => {
    if (!config || totalXp <= 0) return 1;
    
    let level = 1;
    let xpNeeded = 0;
    
    while (level < config.maxLevel) {
      const nextLevelXp = getXpRequiredForLevel(level + 1);
      if (xpNeeded + nextLevelXp > totalXp) break;
      xpNeeded += nextLevelXp;
      level++;
    }
    
    return level;
  };

  // Get XP progress for current level
  const getXpProgress = (totalXp: number) => {
    if (!config) return { current: 0, needed: 100, level: 1 };
    
    const level = getLevelFromXp(totalXp);
    const totalXpForCurrentLevel = getTotalXpForLevel(level);
    const currentLevelXp = totalXp - totalXpForCurrentLevel;
    const neededForNextLevel = level < config.maxLevel ? getXpRequiredForLevel(level + 1) : 0;
    
    return {
      current: currentLevelXp,
      needed: neededForNextLevel,
      level,
    };
  };

  return {
    config,
    getXpRequiredForLevel,
    getTotalXpForLevel,
    getLevelFromXp,
    getXpProgress,
  };
};