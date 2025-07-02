
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LootBoxHeaderProps {
  avatar: any;
  xpMultipliers: Record<string, number>;
}

export const LootBoxHeader: React.FC<LootBoxHeaderProps> = ({ avatar, xpMultipliers }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">
        {typeof avatar.name === 'string' ? avatar.name : 'Mushroom Chest'}
      </h2>
      
      <Badge className={`mb-4 ${
        avatar.rarity === 'Common' ? 'bg-gray-500' :
        avatar.rarity === 'Rare' ? 'bg-blue-500' : 'bg-yellow-500'
      }`}>
        {avatar.rarity} - {xpMultipliers[avatar.rarity]}x XP
      </Badge>
    </>
  );
};
