import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from '@/hooks/use-toast';
import AdminRewardPanel from './AdminRewardPanel';

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
}

interface AdminPanelProps {
  avatars: Avatar[];
  onRarityChange: (avatarId: string, newRarity: 'Common' | 'Rare' | 'Legendary') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ avatars, onRarityChange }) => {
  const { profile } = useUserProfile();
  const [selectedRarities, setSelectedRarities] = useState<Record<string, 'Common' | 'Rare' | 'Legendary'>>({});
  const [pendingChanges, setPendingChanges] = useState<Record<string, 'Common' | 'Rare' | 'Legendary'>>({});

  if (!profile?.isAdmin) return null;

  const handleRaritySelect = (avatarId: string, newRarity: 'Common' | 'Rare' | 'Legendary') => {
    setSelectedRarities(prev => ({ ...prev, [avatarId]: newRarity }));
    setPendingChanges(prev => ({ ...prev, [avatarId]: newRarity }));
  };

  const saveChanges = () => {
    Object.entries(pendingChanges).forEach(([avatarId, newRarity]) => {
      onRarityChange(avatarId, newRarity);
    });
    setPendingChanges({});
    toast({
      title: "Changes Saved",
      description: `${Object.keys(pendingChanges).length} rarity changes applied`,
    });
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 space-y-4"
    >
      <AdminRewardPanel />
      
      <Card className="p-6 bg-red-900/20 backdrop-blur-sm border-red-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-xl font-bold text-white">NFT Rarity Control</h2>
            <Badge className="bg-red-500 text-white">Admin Only</Badge>
          </div>
          {hasPendingChanges && (
            <Button onClick={saveChanges} className="bg-green-600 hover:bg-green-700">
              Save Changes ({Object.keys(pendingChanges).length})
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {avatars.map((avatar) => (
            <div key={avatar.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {avatar.image.startsWith('http') ? '🍄' : avatar.image}
                </span>
                <div>
                  <p className="text-white font-medium text-sm">{avatar.name}</p>
                  <Badge className={`text-xs ${
                    avatar.rarity === 'Common' ? 'bg-gray-500' :
                    avatar.rarity === 'Rare' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}>
                    {avatar.rarity}
                  </Badge>
                </div>
              </div>
              
              <Select
                value={selectedRarities[avatar.id] || avatar.rarity}
                onValueChange={(value: 'Common' | 'Rare' | 'Legendary') => 
                  handleRaritySelect(avatar.id, value)
                }
              >
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Common">Common</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default AdminPanel;
