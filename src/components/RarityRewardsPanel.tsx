import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRarityRewards } from '@/hooks/useRarityRewards';
import { toast } from '@/hooks/use-toast';

const RarityRewardsPanel: React.FC = () => {
  const { rewards, updateReward, isLoading } = useRarityRewards();
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});

  React.useEffect(() => {
    if (Object.keys(rewards).length > 0) {
      setFormData(rewards);
    }
  }, [rewards]);

  const handleEdit = (rarity: string) => {
    setIsEditing(prev => ({ ...prev, [rarity]: true }));
  };

  const handleSave = async (rarity: 'Common' | 'Rare' | 'Legendary') => {
    try {
      await updateReward(rarity, formData[rarity]);
      setIsEditing(prev => ({ ...prev, [rarity]: false }));
      toast({
        title: "Rewards Updated",
        description: `${rarity} rewards have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reward configuration.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = (rarity: string) => {
    setFormData(prev => ({ ...prev, [rarity]: rewards[rarity] }));
    setIsEditing(prev => ({ ...prev, [rarity]: false }));
  };

  const updateFormField = (rarity: string, field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [rarity]: { ...prev[rarity], [field]: value }
    }));
  };

  if (isLoading || Object.keys(rewards).length === 0) {
    return (
      <Card className="p-4 bg-indigo-900/20 backdrop-blur-sm border-indigo-500/30 mb-4">
        <div className="text-center text-indigo-200">Loading rarity rewards...</div>
      </Card>
    );
  }

  const rarityColors = {
    Common: { bg: 'bg-gray-500', border: 'border-gray-400', text: 'text-gray-200' },
    Rare: { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-200' },
    Legendary: { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-200' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className="p-6 bg-indigo-900/20 backdrop-blur-sm border-indigo-500/30">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💎</span>
          <h2 className="text-xl font-bold text-white">Rarity-Specific Rewards</h2>
        </div>

        <Tabs defaultValue="Common" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {(['Common', 'Rare', 'Legendary'] as const).map((rarity) => (
              <TabsTrigger key={rarity} value={rarity} className="flex items-center gap-2">
                <Badge className={`${rarityColors[rarity].bg} text-white text-xs`}>
                  {rarity}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {(['Common', 'Rare', 'Legendary'] as const).map((rarity) => {
            const data = formData[rarity] || rewards[rarity];
            const editing = isEditing[rarity];
            
            return (
              <TabsContent key={rarity} value={rarity} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-semibold ${rarityColors[rarity].text}`}>
                    {rarity} Chest Rewards
                  </h3>
                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <Button onClick={() => handleSave(rarity)} size="sm" className="bg-green-600 hover:bg-green-700">
                          Save
                        </Button>
                        <Button onClick={() => handleCancel(rarity)} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => handleEdit(rarity)} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-green-200 text-sm">Chest XP Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={data?.baseXpMin || 0}
                        onChange={(e) => updateFormField(rarity, 'baseXpMin', Number(e.target.value))}
                        disabled={!editing}
                        className="h-8 text-xs"
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={data?.baseXpMax || 0}
                        onChange={(e) => updateFormField(rarity, 'baseXpMax', Number(e.target.value))}
                        disabled={!editing}
                        className="h-8 text-xs"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-200 text-sm">Token Drop Chance</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={data?.tokenDropChance || 0}
                      onChange={(e) => updateFormField(rarity, 'tokenDropChance', Number(e.target.value))}
                      disabled={!editing}
                      className="h-8 text-xs"
                      placeholder="0.05 = 5%"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-yellow-200 text-sm">Token Amount Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={data?.tokenAmountMin || 0}
                        onChange={(e) => updateFormField(rarity, 'tokenAmountMin', Number(e.target.value))}
                        disabled={!editing}
                        className="h-8 text-xs"
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={data?.tokenAmountMax || 0}
                        onChange={(e) => updateFormField(rarity, 'tokenAmountMax', Number(e.target.value))}
                        disabled={!editing}
                        className="h-8 text-xs"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-orange-200 text-sm">Level Up Rewards</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={data?.levelUpHroom || 0}
                        onChange={(e) => updateFormField(rarity, 'levelUpHroom', Number(e.target.value))}
                        disabled={!editing}
                        className="h-8 text-xs"
                        placeholder="HROOM"
                      />
                      <Input
                        type="number"
                        value={data?.levelUpSpore || 0}
                        onChange={(e) => updateFormField(rarity, 'levelUpSpore', Number(e.target.value))}
                        disabled={!editing}
                        className="h-8 text-xs"
                        placeholder="SPORE"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-black/20 rounded-lg">
                  <p className="text-xs text-gray-400 mb-2"><strong>Current {rarity} Settings:</strong></p>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-300">
                    <div>
                      <p>• Chest XP: {data?.baseXpMin}-{data?.baseXpMax} per open</p>
                      <p>• Token drop: {((data?.tokenDropChance || 0) * 100).toFixed(1)}% chance</p>
                    </div>
                    <div>
                      <p>• Level Up: {data?.levelUpHroom} $HROOM + {data?.levelUpSpore} $SPORE</p>
                      <p>• Token amounts: {data?.tokenAmountMin}-{data?.tokenAmountMax}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default RarityRewardsPanel;