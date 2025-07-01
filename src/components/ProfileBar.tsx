
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUserProfile } from '@/hooks/useUserProfile';

const ProfileBar: React.FC = () => {
  const { profile, getXPForCurrentLevel, getShortAddress, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <Card className="p-4 bg-black/20 backdrop-blur-sm border-green-500/30">
          <div className="text-center text-green-200">Loading profile...</div>
        </Card>
      </motion.div>
    );
  }

  if (!profile) return null;

  const { current, needed } = getXPForCurrentLevel();
  const progressPercentage = (current / needed) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6"
    >
      <Card className="p-4 bg-black/20 backdrop-blur-sm border-green-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🍄
            </motion.div>
            <div>
              <p className="text-green-200 text-sm">Wallet</p>
              <p className="text-white font-mono text-sm">
                {getShortAddress(profile.walletAddress)}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex gap-3">
              <Badge className="bg-yellow-500 text-black">
                Level {profile.level}
              </Badge>
              <Badge variant="outline" className="border-green-400 text-green-200">
                🍄 {profile.totalHroom} $HROOM
              </Badge>
              <Badge variant="outline" className="border-blue-400 text-blue-200">
                🌱 {profile.totalSpores} $SPORE
              </Badge>
            </div>

            <div className="min-w-[200px]">
              <div className="flex justify-between text-xs text-green-200 mb-1">
                <span>XP: {current}/{needed}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-green-900/50"
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfileBar;
