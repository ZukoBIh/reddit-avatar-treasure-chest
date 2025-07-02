
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useChestCooldown } from '@/hooks/useChestCooldown';

interface Reward {
  type: 'token' | 'nft' | 'xp' | 'badge';
  name: string;
  amount?: number;
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

  const resetState = () => {
    setIsOpening(false);
    setReward(null);
    setShowReward(false);
    setXpGained(0);
    setLevelUpInfo(null);
  };

  const openChest = async () => {
    if (!avatar) return;

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
    
    // Calculate XP based on rarity
    const baseXP = Math.floor(Math.random() * 21) + 10; // 10-30 base XP
    const multiplier = XP_MULTIPLIERS[avatar.rarity];
    const finalXP = baseXP * multiplier;
    setXpGained(finalXP);
    
    // Add XP and check for level up
    const levelResult = await addXP(finalXP);
    setLevelUpInfo(levelResult);
    
    // Update cooldown
    await updateCooldown(avatar.id);
    
    // Randomly select a reward
    const randomReward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
    setReward(randomReward);
    setIsOpening(false);
    setShowReward(true);
    
    // Show toast notification
    if (levelResult.leveledUp) {
      toast({
        title: "Level Up! 🎉",
        description: `Level ${levelResult.newLevel} reached! +${finalXP} XP (${avatar.rarity} bonus)!`,
      });
    } else {
      toast({
        title: "Chest Opened! 📦",
        description: `+${finalXP} XP gained (${avatar.rarity} bonus)!`,
      });
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
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
          <motion.div
            className="text-4xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🍄
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">
            {typeof avatar.name === 'string' ? avatar.name : 'Mushroom Chest'}
          </h2>
          
          <Badge className={`mb-4 ${
            avatar.rarity === 'Common' ? 'bg-gray-500' :
            avatar.rarity === 'Rare' ? 'bg-blue-500' : 'bg-yellow-500'
          }`}>
            {avatar.rarity} - {XP_MULTIPLIERS[avatar.rarity]}x XP
          </Badge>
          
          <AnimatePresence mode="wait">
            {!isOpening && !showReward && (
              <motion.div
                key="unopened"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="text-8xl mb-6 relative"
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    rotateY: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🍄
                  <motion.div
                    className="absolute -top-2 -right-2 text-2xl"
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-2 -left-2 text-2xl"
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  >
                    🌱
                  </motion.div>
                </motion.div>
                <Button
                  onClick={openChest}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl text-lg"
                >
                  Open Chest!
                </Button>
              </motion.div>
            )}
            
            {isOpening && (
              <motion.div
                key="opening"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8"
              >
                <motion.div
                  className="text-8xl mb-6 relative"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  🍄
                  <motion.div
                    className="absolute inset-0 text-6xl"
                    animate={{ 
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                </motion.div>
                <p className="text-xl text-green-400 font-semibold">
                  Opening...
                </p>
              </motion.div>
            )}
            
            {showReward && reward && (
              <motion.div
                key="reward"
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="text-8xl mb-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 0.8 }}
                >
                  {reward.icon}
                </motion.div>
                
                <div className="bg-gradient-to-r from-green-600/50 to-emerald-600/50 p-6 rounded-xl border border-green-400/30 w-full">
                  {levelUpInfo?.leveledUp && (
                    <div className="mb-4 text-center">
                      <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                        🎉 Level Up! 🎉
                      </h3>
                      <p className="text-xl text-yellow-200">
                        Level {levelUpInfo.newLevel}!
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-4 text-center">
                    <p className="text-lg text-blue-300">+{xpGained} XP</p>
                    <p className="text-sm text-green-300">({avatar.rarity} {XP_MULTIPLIERS[avatar.rarity]}x bonus)</p>
                    <p className="text-lg">{reward.name}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={handleClose}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      Collect Reward
                    </Button>
                    <Button
                      onClick={() => {
                        setShowReward(false);
                        setReward(null);
                        setXpGained(0);
                        setLevelUpInfo(null);
                      }}
                      variant="outline"
                      className="w-full border-green-400 text-green-300 hover:bg-green-500/20"
                    >
                      Open Another Chest
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LootBoxModal;
