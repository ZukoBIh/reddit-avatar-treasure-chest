
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WalletConnection from '../components/WalletConnection';
import AvatarGrid from '../components/AvatarGrid';
import LootBoxModal from '../components/LootBoxModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isLootBoxOpen, setIsLootBoxOpen] = useState(false);

  const handleAvatarSelect = (avatar: any) => {
    setSelectedAvatar(avatar);
    setIsLootBoxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          className="p-6 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="text-6xl mr-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏴‍☠️
            </motion.div>
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Reddit Avatar Treasure Chest
            </h1>
            <motion.div
              className="text-6xl ml-4"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              💎
            </motion.div>
          </div>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Connect your wallet and unlock exclusive rewards based on your Reddit Collectible Avatars!
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {!isWalletConnected ? (
            <motion.div
              className="max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-8 bg-black/20 backdrop-blur-sm border-purple-500/30">
                <div className="text-center">
                  <motion.div
                    className="text-8xl mb-6"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)', 'hue-rotate(0deg)']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🏆
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Ready to Discover Your Treasures?
                  </h2>
                  <p className="text-purple-200 mb-6">
                    Connect your wallet to see which Reddit Avatars you own and unlock their exclusive loot boxes!
                  </p>
                  <WalletConnection onConnect={() => setIsWalletConnected(true)} />
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Your Avatar Collection
                </h2>
                <p className="text-purple-200">
                  Click on any avatar to open its treasure chest!
                </p>
              </div>
              <AvatarGrid onAvatarSelect={handleAvatarSelect} />
            </motion.div>
          )}
        </div>

        {/* Loot Box Modal */}
        <LootBoxModal
          isOpen={isLootBoxOpen}
          onClose={() => setIsLootBoxOpen(false)}
          avatar={selectedAvatar}
        />
      </div>
    </div>
  );
};

export default Index;
