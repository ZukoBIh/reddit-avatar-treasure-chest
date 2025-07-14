
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { fetchActruleNFTs } from '@/utils/nftUtils';
import { useChestCooldown } from '@/hooks/useChestCooldown';
import { useNftRarities } from '@/hooks/useNftRarities';
import { useAchievements } from '@/hooks/useAchievements';
import AdminPanel from './AdminPanel';

interface Avatar {
  id: string;
  name: string;
  collection: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  image: string;
  traits: string[];
  lootBoxesAvailable: number;
  contractAddress?: string;
  tokenId?: string;
  totalOwned?: number;
}

interface AvatarGridProps {
  onAvatarSelect: (avatar: Avatar) => void;
  onContractsLoaded?: (contracts: string[]) => void;
}

const mockAvatars: Avatar[] = [
  {
    id: '1',
    name: 'Mystic Mushroom #15',
    collection: 'Genesis',
    rarity: 'Legendary',
    image: '🍄‍🟫',
    traits: ['Glowing Cap', 'Ancient Spores'],
    lootBoxesAvailable: 1,
    totalOwned: 3
  },
  {
    id: '2',
    name: 'Forest Sage #22',
    collection: 'Mystics',
    rarity: 'Rare',
    image: '🧙‍♂️',
    traits: ['Nature Magic', 'Woodland Wisdom'],
    lootBoxesAvailable: 1,
    totalOwned: 2
  },
  {
    id: '3',
    name: 'Spore Keeper #8',
    collection: 'Commons',
    rarity: 'Common',
    image: '🌱',
    traits: ['Growth Power', 'Life Energy'],
    lootBoxesAvailable: 1,
    totalOwned: 1
  }
];

const rarityColors = {
  Common: 'bg-gray-500',
  Rare: 'bg-blue-500',
  Legendary: 'bg-yellow-500'
};

const AvatarGrid: React.FC<AvatarGridProps> = ({ onAvatarSelect, onContractsLoaded }) => {
  const { address, isConnected } = useAccount();
  const { getCooldownStatus } = useChestCooldown();
  const { rarities: avatarRarities, saveAllRarities } = useNftRarities();
  const { checkCollectionCompletion } = useAchievements();
  const [pendingRarities, setPendingRarities] = useState<Record<string, 'Common' | 'Rare' | 'Legendary'>>({});

  const { data: nfts, isLoading, error } = useQuery({
    queryKey: ['actrule-nfts', address],
    queryFn: () => fetchActruleNFTs(address as string),
    enabled: !!address && isConnected,
    refetchOnWindowFocus: false,
  });

  // Handle NFT data changes for collection tracking
  useEffect(() => {
    if (nfts && nfts.length > 0) {
      // Extract contract addresses and notify parent
      const contracts = nfts.map(nft => nft.contractAddress).filter(Boolean);
      onContractsLoaded?.(contracts);
      
      // Check collection completion for achievements
      checkCollectionCompletion(contracts);
    }
  }, [nfts, onContractsLoaded, checkCollectionCompletion]);

  // Use real NFTs if available, otherwise fall back to mock data
  const baseAvatars = nfts && nfts.length > 0 ? nfts : mockAvatars;
  
  // Apply admin rarity overrides
  const avatarsToShow = baseAvatars.map(avatar => ({
    ...avatar,
    rarity: pendingRarities[avatar.id] || avatarRarities[avatar.id] || avatar.rarity,
    lootBoxesAvailable: 1 // Always 1 chest per NFT regardless of rarity
  }));

  const handleRarityChange = (avatarId: string, newRarity: 'Common' | 'Rare' | 'Legendary') => {
    setPendingRarities(prev => ({ ...prev, [avatarId]: newRarity }));
  };

  const handleSaveRarities = async (pendingChanges: Record<string, 'Common' | 'Rare' | 'Legendary'>) => {
    try {
      await saveAllRarities({ ...avatarRarities, ...pendingChanges });
      setPendingRarities({});
    } catch (error) {
      throw error;
    }
  };

  const handleAvatarClick = (avatar: Avatar) => {
    const { canOpen, remainingTime } = getCooldownStatus(avatar.id, avatar.rarity);
    
    if (!canOpen) {
      return; // Don't open if on cooldown - button will be disabled
    }
    
    onAvatarSelect(avatar);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          🍄
        </motion.div>
        <p className="text-green-200 text-xl">Loading your collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <p className="text-red-400 text-xl">Failed to load your collection</p>
        <p className="text-green-200 text-sm mt-2">Showing demo collection instead</p>
      </div>
    );
  }

  if (nfts && nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          className="text-8xl mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🔍
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4">No NFTs Found</h3>
        <p className="text-green-200 mb-6">
          We couldn't find any NFTs in your wallet. 
        </p>
        <p className="text-green-300 text-sm">
          Showing demo collection so you can explore the chest experience!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPanel 
        avatars={avatarsToShow} 
        onRarityChange={handleRarityChange}
        onSaveRarities={handleSaveRarities}
        pendingRarities={pendingRarities}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avatarsToShow.map((avatar, index) => {
          const { canOpen, remainingTime } = getCooldownStatus(avatar.id, avatar.rarity);
          
          return (
            <motion.div
              key={avatar.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={canOpen ? { scale: 1.05, rotateY: 5 } : {}}
              whileTap={canOpen ? { scale: 0.95 } : {}}
              onClick={canOpen ? () => handleAvatarClick(avatar) : undefined}
              className={`${canOpen ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            >
              <Card className={`p-6 bg-black/30 backdrop-blur-sm border-green-500/30 hover:border-green-400/60 transition-all duration-300 ${!canOpen ? 'border-red-500/30' : ''}`}>
                <div className="text-center">
                  <motion.div
                    className="mb-4 flex justify-center items-center h-20 relative"
                    animate={canOpen ? { 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {avatar.image.startsWith('http') ? (
                      <img 
                        src={avatar.image} 
                        alt={avatar.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="50">🍄</text></svg>';
                        }}
                      />
                    ) : (
                      <span className="text-6xl">{avatar.image}</span>
                    )}
                    
                    {!canOpen && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                        <span className="text-red-400 text-2xl">🔒</span>
                      </div>
                    )}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{avatar.name}</h3>
                  
                   {avatar.totalOwned && avatar.totalOwned > 1 && (
                     <p className="text-green-300 text-sm mb-2">
                       Lowest of {avatar.totalOwned} owned
                     </p>
                   )}
                  
                  <div className="flex justify-center mb-3">
                    <Badge className={`${rarityColors[avatar.rarity]} text-white`}>
                      {avatar.rarity}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs text-green-300 mb-1">Traits:</p>
                    <div className="flex flex-wrap gap-1 justify-center max-h-20 overflow-y-auto">
                      {avatar.traits.slice(0, 3).map((trait, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-green-400 text-green-200">
                          {trait.length > 15 ? trait.substring(0, 15) + '...' : trait}
                        </Badge>
                      ))}
                      {avatar.traits.length > 3 && (
                        <Badge variant="outline" className="text-xs border-green-400 text-green-200">
                          +{avatar.traits.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {canOpen ? (
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg font-semibold"
                      animate={{ 
                        boxShadow: [
                          '0 0 10px rgba(34, 197, 94, 0.5)',
                          '0 0 20px rgba(34, 197, 94, 0.8)',
                          '0 0 10px rgba(34, 197, 94, 0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📦 {avatar.lootBoxesAvailable} Chest{avatar.lootBoxesAvailable !== 1 ? 's' : ''} Available
                    </motion.div>
                  ) : (
                    <div className="bg-red-500/50 text-white px-3 py-2 rounded-lg font-semibold">
                      ⏰ {remainingTime}h remaining
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarGrid;
