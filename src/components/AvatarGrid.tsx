
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccount } from 'wagmi';

interface Avatar {
  id: string;
  name: string;
  collection: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  image: string;
  traits: string[];
  lootBoxesAvailable: number;
}

interface AvatarGridProps {
  onAvatarSelect: (avatar: Avatar) => void;
}

const mockAvatars: Avatar[] = [
  {
    id: '1',
    name: 'Mystic Mushroom',
    collection: 'Actrule Genesis',
    rarity: 'Legendary',
    image: '🍄‍🟫',
    traits: ['Glowing Cap', 'Ancient Spores'],
    lootBoxesAvailable: 3
  },
  {
    id: '2',
    name: 'Forest Sage',
    collection: 'Actrule Mystics',
    rarity: 'Rare',
    image: '🧙‍♂️',
    traits: ['Nature Magic', 'Woodland Wisdom'],
    lootBoxesAvailable: 2
  },
  {
    id: '3',
    name: 'Spore Keeper',
    collection: 'Actrule Commons',
    rarity: 'Common',
    image: '🌱',
    traits: ['Growth Power', 'Life Energy'],
    lootBoxesAvailable: 1
  },
  {
    id: '4',
    name: 'Crystal Mushroom',
    collection: 'Actrule Elementals',
    rarity: 'Rare',
    image: '💎',
    traits: ['Crystalline Structure', 'Light Refraction'],
    lootBoxesAvailable: 2
  },
  {
    id: '5',
    name: 'Shadow Spore',
    collection: 'Actrule Dark',
    rarity: 'Legendary',
    image: '🖤',
    traits: ['Shadow Form', 'Dark Energy'],
    lootBoxesAvailable: 3
  },
  {
    id: '6',
    name: 'Golden Truffle',
    collection: 'Actrule Rare',
    rarity: 'Rare',
    image: '🏆',
    traits: ['Golden Sheen', 'Rare Find'],
    lootBoxesAvailable: 2
  }
];

const rarityColors = {
  Common: 'bg-gray-500',
  Rare: 'bg-blue-500',
  Legendary: 'bg-yellow-500'
};

const AvatarGrid: React.FC<AvatarGridProps> = ({ onAvatarSelect }) => {
  const { address, isConnected } = useAccount();

  // TODO: Replace with actual NFT fetching logic
  // const { data: nfts } = useQuery({
  //   queryKey: ['actrule-nfts', address],
  //   queryFn: () => fetchActruleNFTs(address),
  //   enabled: !!address && isConnected,
  // });

  console.log('Connected wallet address:', address);
  console.log('Is connected:', isConnected);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {mockAvatars.map((avatar, index) => (
        <motion.div
          key={avatar.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAvatarSelect(avatar)}
          className="cursor-pointer"
        >
          <Card className="p-6 bg-black/30 backdrop-blur-sm border-green-500/30 hover:border-green-400/60 transition-all duration-300">
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {avatar.image}
              </motion.div>
              
              <h3 className="text-xl font-bold text-white mb-2">{avatar.name}</h3>
              <p className="text-green-200 text-sm mb-3">{avatar.collection}</p>
              
              <div className="flex justify-center mb-3">
                <Badge className={`${rarityColors[avatar.rarity]} text-white`}>
                  {avatar.rarity}
                </Badge>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-green-300 mb-1">Traits:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {avatar.traits.map((trait, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs border-green-400 text-green-200">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
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
                🧺 {avatar.lootBoxesAvailable} Chest{avatar.lootBoxesAvailable !== 1 ? 's' : ''} Available
              </motion.div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AvatarGrid;
