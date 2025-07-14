
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Reward {
  type: 'token' | 'xp';
  name: string;
  amount: number;
  rarity: 'Common' | 'Rare' | 'Legendary';
  icon: string;
}

interface RewardDisplayProps {
  reward: Reward;
  xpGained: number;
  avatar: any;
  levelUpInfo: {leveledUp: boolean, newLevel: number} | null;
  xpMultipliers: Record<string, number>;
  onClose: () => void;
  onOpenAnother: () => void;
  config: any;
}

export const RewardDisplay: React.FC<RewardDisplayProps> = ({ 
  reward, 
  xpGained, 
  avatar, 
  levelUpInfo, 
  xpMultipliers,
  onClose, 
  onOpenAnother,
  config
}) => {
  const isTokenReward = reward.type === 'token';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 10, stiffness: 100 }}
      className="flex flex-col items-center"
    >
      <motion.div
        className="text-8xl mb-4"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: isTokenReward ? [0, 360] : [0, 0],
        }}
        transition={{ duration: isTokenReward ? 0.8 : 0.5 }}
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
            <p className="text-sm text-orange-300 mt-2">
              Random reward from level-up pool!
            </p>
          </div>
        )}
        
        <div className="mb-4 text-center">
          <p className="text-lg text-blue-300">+{xpGained} XP</p>
          <p className="text-sm text-green-300">
            ({avatar.rarity} {xpMultipliers[avatar.rarity]}x bonus)
          </p>
          
          {isTokenReward && (
            <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
              <p className="text-lg font-bold text-yellow-300">
                Bonus Drop! 🎉
              </p>
              <p className="text-xl text-yellow-100">
                +{reward.amount} {reward.name}
              </p>
              <p className="text-xs text-yellow-200">
                ({((config?.tokenDropChance || 0.05) * 100).toFixed(1)}% chance)
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            Collect Reward
          </Button>
          <Button
            onClick={onOpenAnother}
            variant="outline"
            className="w-full border-green-400 text-green-300 hover:bg-green-500/20"
          >
            Open Another Chest
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
