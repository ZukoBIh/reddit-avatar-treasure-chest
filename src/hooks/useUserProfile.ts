
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';
import { useLevelingSystem } from './useLevelingSystem';
import { useLevelUpRewards } from './useLevelUpRewards';

interface UserProfile {
  id: string;
  walletAddress: string;
  level: number;
  currentXP: number;
  totalHroom: number;
  totalSpores: number;
  isAdmin: boolean;
}



export const useUserProfile = () => {
  const { address } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getLevelFromXp, getXpProgress } = useLevelingSystem();
  const { getLevelUpRewards } = useLevelUpRewards();

  const createProfile = async (walletAddress: string): Promise<UserProfile> => {
    const newProfile = {
      wallet_address: walletAddress,
      level: 1,
      current_xp: 0,
      total_hroom: 0,
      total_spores: 0,
      is_admin: false,
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      walletAddress: data.wallet_address,
      level: data.level,
      currentXP: data.current_xp,
      totalHroom: data.total_hroom,
      totalSpores: data.total_spores,
      isAdmin: data.is_admin,
    };
  };

  const updateProfile = async (updatedProfile: UserProfile) => {
    console.log('updateProfile called with:', updatedProfile);
    
    const updateData = {
      level: updatedProfile.level,
      current_xp: updatedProfile.currentXP,
      total_hroom: updatedProfile.totalHroom,
      total_spores: updatedProfile.totalSpores,
      is_admin: updatedProfile.isAdmin,
    };
    
    console.log('Updating database with:', updateData);
    console.log('Wallet address filter:', updatedProfile.walletAddress);
    
    try {
      console.log('About to call supabase update...');
      const result = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('wallet_address', updatedProfile.walletAddress);

      console.log('Supabase update completed, result:', result);
      
      if (result.error) {
        console.error('Database update failed:', result.error);
        throw result.error;
      }
      
      console.log('Setting profile state to:', updatedProfile);
      setProfile(updatedProfile);
      console.log('Profile state updated successfully');
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  };

  const addXP = async (xpGained: number) => {
    console.log('addXP called with:', xpGained);
    if (!profile) {
      console.log('No profile found, returning early');
      return { leveledUp: false, newLevel: 1 };
    }

    console.log('Current profile:', profile);
    const newXP = profile.currentXP + xpGained;
    const newLevel = getLevelFromXp(newXP);
    const leveledUp = newLevel > profile.level;
    
    console.log('XP calculation:', { newXP, newLevel, leveledUp });
    
    // Calculate level-up rewards using pooled system
    const levelsGained = leveledUp ? newLevel - profile.level : 0;
    console.log('Levels gained:', levelsGained);
    
    const { hroom: hroomReward, spores: sporeReward } = levelsGained > 0 
      ? getLevelUpRewards(newLevel, levelsGained) 
      : { hroom: 0, spores: 0 };
    
    console.log('Rewards calculated:', { hroomReward, sporeReward });
    
    const updatedProfile = {
      ...profile,
      currentXP: newXP,
      level: newLevel,
      totalHroom: profile.totalHroom + hroomReward,
      totalSpores: profile.totalSpores + sporeReward,
    };

    console.log('About to update profile with:', updatedProfile);
    
    try {
      await updateProfile(updatedProfile);
      console.log('Profile updated successfully');
      return { leveledUp, newLevel };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const getXPForCurrentLevel = () => {
    if (!profile) return { current: 0, needed: 100 };
    const progress = getXpProgress(profile.currentXP);
    return { current: progress.current, needed: progress.needed };
  };

  const getShortAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!address) {
        setProfile(null);
        return;
      }

      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('wallet_address', address)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile({
            id: data.id,
            walletAddress: data.wallet_address,
            level: data.level,
            currentXP: data.current_xp,
            totalHroom: data.total_hroom,
            totalSpores: data.total_spores,
            isAdmin: data.is_admin,
          });
        } else {
          const newProfile = await createProfile(address);
          setProfile(newProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [address]);

  return {
    profile,
    isLoading,
    addXP,
    getXPForCurrentLevel,
    getShortAddress,
  };
};
