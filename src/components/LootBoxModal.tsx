
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useChestCooldown } from '@/hooks/useChestCooldown';
import { useRewardConfig } from '@/hooks/useRewardConfig';
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

const possibleRewards: Reward[] = [
  { type: 'token', name: '$HROOM', amount: 100, rarity: 'Common', icon: '🍄' },
  { type: 'token', name: '$SPORE', amount: 50, rarity: 'Rare', icon: '🌱' },
  { type: 'nft', name: 'Golden Mushroom', rarity: 'Legendary', icon: '🍄‍🟫' },
  { type: 'xp', name: 'Foraging XP', amount: 250, rarity: 'Common', icon: '⭐' },
  { type: 'badge', name: 'Master Forager', rarity: 'Rare', icon: '🏆' },
  { type: 'nft', name: 'Mystical Spore', rarity: 'Rare', icon: '✨' },
  { type: 'token', name: '$HROOM', amount: 500, rarity: 'Legendary', icon: '🍄' },
];

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

    setIsOpening(true);
    
    // Simulate chest opening delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate XP based on rarity and config
    const baseXP = Math.floor(Math.random() * (config.baseXpMax - config.baseXpMin + 1)) + config.baseXpMin;
    const multiplier = XP_MULTIPLIERS[avatar.rarity];
    const finalXP = baseXP * multiplier;
    setXpGained(finalXP);
    
    // Check for token drop (very small chance)
    const tokenDrop = Math.random() < config.tokenDropChance;
    let tokenReward: Reward | null = null;
    
    if (tokenDrop) {
      const tokenAmount = Math.floor(Math.random() * (config.tokenAmountMax - config.tokenAmountMin + 1)) + config.tokenAmountMin;
      const isHroom = Math.random() < 0.5;
      tokenReward = {
        type: 'token',
        name: isHroom ? '$HROOM' : '$SPORE',
        amount: tokenAmount,
        rarity: avatar.rarity,
        icon: isHroom ? '🍄' : '🌱'
      };
    }
    
    // Add XP and check for level up
    const levelResult = await addXP(finalXP);
    setLevelUpInfo(levelResult);
    
    // Update cooldown
    await updateCooldown(avatar.id);
    
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
      description += ` Level ${levelResult.newLevel} reached! +${config.levelUpHroom} HROOM & +${config.levelUpSpore} SPORE!`;
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
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleOpenAnother = () => {
    setShowReward(false);
    setReward(null);
    setXpGained(0);
    setLevelUpInfo(null);
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
