
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useChestCooldown } from '@/hooks/useChestCooldown';
import { useRewardConfig } from '@/hooks/useRewardConfig';
import { useRarityRewards } from '@/hooks/useRarityRewards';
import { useAchievements } from '@/hooks/useAchievements';
import { LootBoxHeader } from './loot-box/LootBoxHeader';
import { UnOpenedState } from './loot-box/UnOpenedState';
import { OpeningState } from './loot-box/OpeningState';
import { RewardDisplay } from './loot-box/RewardDisplay';

interface Reward {
  type: 'token' | 'xp';
  name: string;
  amount: number;
  rarity: 'Common' | 'Rare' | 'Legendary';
  icon: string;
}

interface LootBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatar: any;
}

const XP_MULTIPLIERS = {
  Common: 1,
  Rare: 2,
  Legendary: 3
};

const LootBoxModal: React.FC<LootBoxModalProps> = ({ isOpen, onClose, avatar }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [levelUpInfo, setLevelUpInfo] = useState<{leveledUp: boolean, newLevel: number} | null>(null);
  
  const { addXP } = useUserProfile();
  const { updateCooldown, getCooldownStatus } = useChestCooldown();
  const { config } = useRewardConfig();
  const { rewards } = useRarityRewards();
  const { updateChestOpenProgress } = useAchievements();

  const resetState = () => {
    setIsOpening(false);
    setReward(null);
    setShowReward(false);
    setXpGained(0);
    setLevelUpInfo(null);
  };

  const openChest = async () => {
    if (!avatar || !config) return;

    // Check cooldown status
    const { canOpen } = getCooldownStatus(avatar.id, avatar.rarity);
    if (!canOpen) {
      toast({
        title: "Chest on Cooldown",
        description: "This chest is still on cooldown. Please wait before opening again.",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting chest opening...');
    setIsOpening(true);
    
    try {
      // Simulate chest opening delay
      console.log('Waiting for chest animation...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get rarity-specific config or fallback to default
      const rarityConfig = rewards[avatar.rarity] || {
        baseXpMin: config.baseXpMin,
        baseXpMax: config.baseXpMax,
        tokenDropChance: config.tokenDropChance,
        tokenAmountMin: config.tokenAmountMin,
        tokenAmountMax: config.tokenAmountMax,
        levelUpHroom: config.levelUpHroom,
        levelUpSpore: config.levelUpSpore,
      };
      
      // Calculate XP based on rarity-specific config
      const baseXP = Math.floor(Math.random() * (rarityConfig.baseXpMax - rarityConfig.baseXpMin + 1)) + rarityConfig.baseXpMin;
      const multiplier = XP_MULTIPLIERS[avatar.rarity];
      const finalXP = baseXP * multiplier;
      setXpGained(finalXP);
      
      // Check for token drop using rarity-specific chance
      const tokenDrop = Math.random() < rarityConfig.tokenDropChance;
      let tokenReward: Reward | null = null;
      
      if (tokenDrop) {
        const tokenAmount = Math.floor(Math.random() * (rarityConfig.tokenAmountMax - rarityConfig.tokenAmountMin + 1)) + rarityConfig.tokenAmountMin;
        const isHroom = Math.random() < 0.5;
        tokenReward = {
          type: 'token',
          name: isHroom ? '$HROOM' : '$SPORE',
          amount: tokenAmount,
          rarity: avatar.rarity,
          icon: isHroom ? '🍄' : '🌱'
        };
      }
      
      console.log('Adding XP...');
      // Add XP and check for level up
      const levelResult = await addXP(finalXP);
      setLevelUpInfo(levelResult);
      console.log('XP added successfully');
      
      console.log('Updating cooldown...');
      // Update cooldown
      await updateCooldown(avatar.id);
      console.log('Cooldown updated successfully');
      
      console.log('Updating achievement progress...');
      // Update achievement progress for chest opening
      await updateChestOpenProgress();
      console.log('Achievement progress updated successfully');
      
      // Refresh profile bar
      if ((window as any).refreshProfile) {
        (window as any).refreshProfile();
      }
      
      // Set reward (XP always, token sometimes)
      const mainReward: Reward = {
        type: 'xp',
        name: 'Experience Points',
        amount: finalXP,
        rarity: avatar.rarity,
        icon: '⭐'
      };
      
      setReward(tokenReward || mainReward);
      setIsOpening(false);
      setShowReward(true);
      
      // Show toast notification
      let description = `+${finalXP} XP gained (${avatar.rarity} ${multiplier}x bonus)!`;
      if (tokenReward) {
        description += ` + ${tokenReward.amount} ${tokenReward.name}!`;
      }
      
      if (levelResult.leveledUp) {
        description += ` Level ${levelResult.newLevel} reached! +${rarityConfig.levelUpHroom} HROOM & +${rarityConfig.levelUpSpore} SPORE!`;
        toast({
          title: "Level Up! 🎉",
          description,
        });
      } else {
        toast({
          title: tokenReward ? "Rare Drop! 📦✨" : "Chest Opened! 📦",
          description,
        });
      }
      
      console.log('Chest opening completed successfully');
    } catch (error) {
      console.error('Error during chest opening:', error);
      setIsOpening(false);
      toast({
        title: "Error Opening Chest",
        description: "Something went wrong while opening the chest. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleOpenAnother = () => {
    resetState(); // Use full reset to go back to unopened state
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  if (!avatar) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-black/90 backdrop-blur-sm border-green-500/30 text-white">
        <DialogTitle className="sr-only">Treasure Chest</DialogTitle>
        <DialogDescription className="sr-only">Open your treasure chest to discover rewards</DialogDescription>
        
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🍄</div>
          
          <LootBoxHeader avatar={avatar} xpMultipliers={XP_MULTIPLIERS} />
          
          <AnimatePresence mode="wait">
            {!isOpening && !showReward && (
              <UnOpenedState onOpenChest={openChest} />
            )}
            
            {isOpening && <OpeningState />}
            
            {showReward && reward && (
              <RewardDisplay 
                reward={reward}
                xpGained={xpGained}
                avatar={avatar}
                levelUpInfo={levelUpInfo}
                xpMultipliers={XP_MULTIPLIERS}
                onClose={handleClose}
                onOpenAnother={handleOpenAnother}
                config={config}
              />
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LootBoxModal;
