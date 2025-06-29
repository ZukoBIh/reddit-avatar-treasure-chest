
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

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
  { type: 'nft', name: 'Golden Treasure', rarity: 'Legendary', icon: '🏆' },
  { type: 'xp', name: 'Experience Points', amount: 250, rarity: 'Common', icon: '⭐' },
  { type: 'badge', name: 'Treasure Hunter', rarity: 'Rare', icon: '🏴‍☠️' },
  { type: 'nft', name: 'Crystal Shard', rarity: 'Rare', icon: '💎' },
  { type: 'token', name: '$HROOM', amount: 500, rarity: 'Legendary', icon: '🍄' },
];

const LootBoxModal: React.FC<LootBoxModalProps> = ({ isOpen, onClose, avatar }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [showReward, setShowReward] = useState(false);

  const resetState = () => {
    setIsOpening(false);
    setReward(null);
    setShowReward(false);
  };

  const openLootBox = async () => {
    setIsOpening(true);
    
    // Simulate loot box opening delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Randomly select a reward (with rarity weighting)
    const randomReward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
    setReward(randomReward);
    setIsOpening(false);
    setShowReward(true);
    
    toast({
      title: "Treasure Found! 🎉",
      description: `You received ${randomReward.name}${randomReward.amount ? ` x${randomReward.amount}` : ''}!`,
    });
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
      <DialogContent className="max-w-md bg-black/90 backdrop-blur-sm border-purple-500/30 text-white">
        <div className="text-center p-6">
          <motion.div
            className="text-4xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {avatar.image}
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">{avatar.name}</h2>
          <p className="text-purple-200 mb-6">Ready to unlock your treasure?</p>
          
          <AnimatePresence mode="wait">
            {!isOpening && !showReward && (
              <motion.div
                key="unopened"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.div
                  className="text-8xl mb-6"
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    rotateY: [0, 10, -10, 0],
                    filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)', 'hue-rotate(0deg)']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  📦
                </motion.div>
                <Button
                  onClick={openLootBox}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl text-lg"
                >
                  Open Treasure Chest!
                </Button>
              </motion.div>
            )}
            
            {isOpening && (
              <motion.div
                key="opening"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8"
              >
                <motion.div
                  className="text-8xl mb-6"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                    filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  📦
                </motion.div>
                <p className="text-xl text-yellow-400 font-semibold">
                  Opening your treasure chest...
                </p>
                <motion.div
                  className="mt-4 text-6xl"
                  animate({ 
                    rotate: 360,
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              </motion.div>
            )}
            
            {showReward && reward && (
              <motion.div
                key="reward"
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
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
                
                <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 p-6 rounded-xl border border-purple-400/30">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                    Congratulations!
                  </h3>
                  <p className="text-xl mb-3">
                    {reward.name} {reward.amount && `x${reward.amount}`}
                  </p>
                  <Badge className={`mb-4 ${
                    reward.rarity === 'Legendary' ? 'bg-purple-500' :
                    reward.rarity === 'Rare' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {reward.rarity}
                  </Badge>
                  
                  <div className="space-y-3 mt-4">
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
                      }}
                      variant="outline"
                      className="w-full border-purple-400 text-purple-300 hover:bg-purple-500/20"
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
