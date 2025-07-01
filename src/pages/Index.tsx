
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-800">
      {/* Animated spore particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-70"
            animate={{
              y: [0, -120, 0],
              x: [0, Math.random() * 80 - 40, 0],
              opacity: [0.7, 1, 0.7],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
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
              transition={{ duration: 3, repeat: Infinity }}
            >
              🍄
            </motion.div>
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Mushroom Forage Chests
            </h1>
            <motion.div
              className="text-6xl ml-4"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              🌱
            </motion.div>
          </div>
          <p className="text-xl text-green-200 max-w-2xl mx-auto">
            Connect your wallet and discover magical rewards hidden in your Actrule NFT collection!
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
              <Card className="p-8 bg-black/20 backdrop-blur-sm border-green-500/30">
                <div className="text-center">
                  <motion.div
                    className="text-8xl mb-6"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)']
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    🍄
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Ready to Forage for Treasures?
                  </h2>
                  <p className="text-green-200 mb-6">
                    Connect your wallet to discover which Actrule NFTs you own and unlock their magical forage chests!
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
                  Your NFT Collection
                </h2>
                <p className="text-green-200">
                  Click on any NFT to open its forage chest!
                </p>
              </div>
              <AvatarGrid onAvatarSelect={handleAvatarSelect} />
            </motion.div>
          )}
        </div>

        {/* Forage Box Modal */}
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
