import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  achievement_key: string;
  title: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  reward_spores: number;
  reward_hroom: number;
  is_active: boolean;
}

interface UserAchievement {
  id: string;
  achievement_key: string;
  progress: number;
  is_completed: boolean;
  completed_at: string | null;
  achievement?: Achievement;
}

export const useAchievements = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAchievements = async () => {
    setIsLoading(true);
    try {
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('requirement_value', { ascending: true });

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);

      if (address) {
        const { data: userAchievementsData, error: userError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('wallet_address', address);

        if (userError) throw userError;
        setUserAchievements(userAchievementsData || []);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChestOpenProgress = async () => {
    if (!address) return;

    try {
      // Get or create chest opening achievements progress
      const chestAchievements = achievements.filter(a => a.requirement_type === 'chest_opens');
      
      for (const achievement of chestAchievements) {
        const { data: existing, error: fetchError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('wallet_address', address)
          .eq('achievement_key', achievement.achievement_key)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existing && !existing.is_completed) {
          const newProgress = existing.progress + 1;
          const isCompleted = newProgress >= achievement.requirement_value;

          const { error: updateError } = await supabase
            .from('user_achievements')
            .update({
              progress: newProgress,
              is_completed: isCompleted,
              completed_at: isCompleted ? new Date().toISOString() : null
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;

          if (isCompleted) {
            // Award achievement rewards
            await awardAchievementReward(achievement);
            toast({
              title: "🏆 Achievement Unlocked!",
              description: `${achievement.title}: ${achievement.description}`,
            });
          }
        } else if (!existing) {
          const isCompleted = 1 >= achievement.requirement_value;

          const { error: insertError } = await supabase
            .from('user_achievements')
            .insert({
              wallet_address: address,
              achievement_key: achievement.achievement_key,
              progress: 1,
              is_completed: isCompleted,
              completed_at: isCompleted ? new Date().toISOString() : null
            });

          if (insertError) throw insertError;

          if (isCompleted) {
            await awardAchievementReward(achievement);
            toast({
              title: "🏆 Achievement Unlocked!",
              description: `${achievement.title}: ${achievement.description}`,
            });
          }
        }
      }

      await loadAchievements();
    } catch (error) {
      console.error('Error updating chest open progress:', error);
    }
  };

  const checkCollectionCompletion = async (ownedContracts: string[]) => {
    if (!address) return;

    const REQUIRED_CONTRACTS = [
      '0xA63EfDE7Cb14DD537b7e61a3087aE9B8A7849eE2',
      '0xe364d16731579078afa1195630e4035657ef9d1a',
      '0x97386b7fae8bc384afa1af14b6dd96d9123f762f',
      '0x9c92b882ac7aeff58414d874de60d30381991bad',
      '0xbd24e412d8eb0bca223ad87869374d97cede3424'
    ];

    const hasAllContracts = REQUIRED_CONTRACTS.every(contract => 
      ownedContracts.some(owned => owned.toLowerCase() === contract.toLowerCase())
    );

    if (hasAllContracts) {
      try {
        // Check if collection completion already recorded
        const { data: existing, error: fetchError } = await supabase
          .from('collection_completions')
          .select('*')
          .eq('wallet_address', address)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!existing) {
          // Record collection completion
          const { error: insertError } = await supabase
            .from('collection_completions')
            .upsert({
              wallet_address: address,
              first_completion_at: new Date().toISOString()
            });

          if (insertError) throw insertError;

          // Update collection master achievement
          const collectionAchievement = achievements.find(a => a.achievement_key === 'collection_master');
          if (collectionAchievement) {
            const { error: achievementError } = await supabase
              .from('user_achievements')
              .upsert({
                wallet_address: address,
                achievement_key: 'collection_master',
                progress: 5,
                is_completed: true,
                completed_at: new Date().toISOString()
              });

            if (achievementError) throw achievementError;

            await awardAchievementReward(collectionAchievement);
            toast({
              title: "🎯 COLLECTION MASTER!",
              description: "You've collected all 5 Actrule NFTs! Massive rewards unlocked!",
            });
          }
        }
      } catch (error) {
        console.error('Error checking collection completion:', error);
      }
    }
  };

  const awardAchievementReward = async (achievement: Achievement) => {
    if (!address) return;

    try {
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('wallet_address', address)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (profile) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            total_spores: profile.total_spores + achievement.reward_spores,
            total_hroom: profile.total_hroom + achievement.reward_hroom
          })
          .eq('wallet_address', address);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error awarding achievement reward:', error);
    }
  };

  const getAchievementProgress = (achievementKey: string) => {
    const userAchievement = userAchievements.find(ua => ua.achievement_key === achievementKey);
    const achievement = achievements.find(a => a.achievement_key === achievementKey);
    
    if (!achievement) return null;
    
    return {
      progress: userAchievement?.progress || 0,
      required: achievement.requirement_value,
      isCompleted: userAchievement?.is_completed || false,
      achievement
    };
  };

  useEffect(() => {
    loadAchievements();
  }, [address]);

  return {
    achievements,
    userAchievements,
    isLoading,
    updateChestOpenProgress,
    checkCollectionCompletion,
    getAchievementProgress,
    reloadAchievements: loadAchievements
  };
};