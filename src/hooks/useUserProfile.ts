
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  walletAddress: string;
  level: number;
  currentXP: number;
  totalHroom: number;
  totalSpores: number;
}

const XP_PER_LEVEL = 100;

export const useUserProfile = () => {
  const { address } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createProfile = async (walletAddress: string): Promise<UserProfile> => {
    const newProfile = {
      wallet_address: walletAddress,
      level: 1,
      current_xp: 0,
      total_hroom: 0,
      total_spores: 0,
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
      })
      .eq('wallet_address', updatedProfile.walletAddress);

    if (error) throw error;
    setProfile(updatedProfile);
  };

  const addXP = async (xpGained: number) => {
    if (!profile) return { leveledUp: false, newLevel: 1 };

    const newXP = profile.currentXP + xpGained;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > profile.level;
    
    const updatedProfile = {
      ...profile,
      currentXP: newXP,
      level: newLevel,
      totalHroom: leveledUp ? profile.totalHroom + 1 : profile.totalHroom,
      totalSpores: profile.totalSpores + Math.floor(xpGained / 5), // Earn spores based on XP
    };

    await updateProfile(updatedProfile);
    
    return { leveledUp, newLevel };
  };

  const getXPForCurrentLevel = () => {
    if (!profile) return { current: 0, needed: 100 };
    const currentLevelXP = profile.currentXP % XP_PER_LEVEL;
    return { current: currentLevelXP, needed: XP_PER_LEVEL };
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
