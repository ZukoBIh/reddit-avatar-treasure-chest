
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface UserProfile {
  walletAddress: string;
  level: number;
  currentXP: number;
  totalHroom: number;
  totalSpores: number;
}

const STORAGE_KEY = 'mushroom_forage_profiles';
const XP_PER_LEVEL = 100;

export const useUserProfile = () => {
  const { address } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const getStoredProfiles = (): Record<string, UserProfile> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const saveProfile = (updatedProfile: UserProfile) => {
    const profiles = getStoredProfiles();
    profiles[updatedProfile.walletAddress] = updatedProfile;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    setProfile(updatedProfile);
  };

  const initializeProfile = (walletAddress: string): UserProfile => {
    return {
      walletAddress,
      level: 1,
      currentXP: 0,
      totalHroom: 0,
      totalSpores: 0,
    };
  };

  const addXP = (xpGained: number) => {
    if (!profile) return { leveledUp: false, newLevel: 1 };

    const newXP = profile.currentXP + xpGained;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > profile.level;
    
    const updatedProfile = {
      ...profile,
      currentXP: newXP,
      level: newLevel,
      totalHroom: leveledUp ? profile.totalHroom + 1 : profile.totalHroom,
    };

    saveProfile(updatedProfile);
    
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
    if (address) {
      const profiles = getStoredProfiles();
      const existingProfile = profiles[address];
      
      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        const newProfile = initializeProfile(address);
        saveProfile(newProfile);
      }
    } else {
      setProfile(null);
    }
  }, [address]);

  return {
    profile,
    addXP,
    getXPForCurrentLevel,
    getShortAddress,
  };
};
