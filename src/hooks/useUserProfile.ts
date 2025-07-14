
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
    const { error } = await supabase
      .from('user_profiles')
      .update({
        level: updatedProfile.level,
        current_xp: updatedProfile.currentXP,
        total_hroom: updatedProfile.totalHroom,
        total_spores: updatedProfile.totalSpores,
        is_admin: updatedProfile.isAdmin,
      })
      .eq('wallet_address', updatedProfile.walletAddress);

    if (error) throw error;
    setProfile(updatedProfile);
  };

  const addXP = async (xpGained: number) => {
    if (!profile) return { leveledUp: false, newLevel: 1 };

    const newXP = profile.currentXP + xpGained;
    const newLevel = getLevelFromXp(newXP);
    const leveledUp = newLevel > profile.level;
    
    // Calculate level-up rewards using pooled system
    const levelsGained = leveledUp ? newLevel - profile.level : 0;
    const { hroom: hroomReward, spores: sporeReward } = levelsGained > 0 
      ? getLevelUpRewards(newLevel, levelsGained) 
      : { hroom: 0, spores: 0 };
    
    const updatedProfile = {
      ...profile,
      currentXP: newXP,
      level: newLevel,
      totalHroom: profile.totalHroom + hroomReward,
      totalSpores: profile.totalSpores + sporeReward,
    };

    await updateProfile(updatedProfile);
    
    return { leveledUp, newLevel };
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
