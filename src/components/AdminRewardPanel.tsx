
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRewardConfig } from '@/hooks/useRewardConfig';
import { toast } from '@/hooks/use-toast';

const AdminRewardPanel: React.FC = () => {
  const { config, updateConfig, isLoading } = useRewardConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    baseXpMin: 10,
    baseXpMax: 30,
    tokenDropChance: 0.05,
    tokenAmountMin: 10,
    tokenAmountMax: 50,
    levelUpHroom: 100,
    levelUpSpore: 25,
  });

  React.useEffect(() => {
    if (config) {
      setFormData({
        baseXpMin: config.baseXpMin,
        baseXpMax: config.baseXpMax,
        tokenDropChance: config.tokenDropChance,
        tokenAmountMin: config.tokenAmountMin,
        tokenAmountMax: config.tokenAmountMax,
        levelUpHroom: config.levelUpHroom,
        levelUpSpore: config.levelUpSpore,
      });
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig(formData);
      setIsEditing(false);
      toast({
        title: "Rewards Updated",
        description: "Reward configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reward configuration.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (config) {
      setFormData({
        baseXpMin: config.baseXpMin,
        baseXpMax: config.baseXpMax,
        tokenDropChance: config.tokenDropChance,
        tokenAmountMin: config.tokenAmountMin,
        tokenAmountMax: config.tokenAmountMax,
        levelUpHroom: config.levelUpHroom,
        levelUpSpore: config.levelUpSpore,
      });
    }
    setIsEditing(false);
  };

  if (isLoading || !config) {
    return (
      <Card className="p-4 bg-purple-900/20 backdrop-blur-sm border-purple-500/30 mb-4">
        <div className="text-center text-purple-200">Loading reward config...</div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className="p-6 bg-purple-900/20 backdrop-blur-sm border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-xl font-bold text-white">Reward Configuration</h2>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm" className="bg-purple-600 hover:bg-purple-700">
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
                value={formData.baseXpMin}
                onChange={(e) => setFormData({ ...formData, baseXpMin: Number(e.target.value) })}
                disabled={!isEditing}
                className="h-8 text-xs"
                placeholder="Min"
              />
              <Input
                type="number"
                value={formData.baseXpMax}
                onChange={(e) => setFormData({ ...formData, baseXpMax: Number(e.target.value) })}
                disabled={!isEditing}
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
              value={formData.tokenDropChance}
              onChange={(e) => setFormData({ ...formData, tokenDropChance: Number(e.target.value) })}
              disabled={!isEditing}
              className="h-8 text-xs"
              placeholder="0.05 = 5%"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-yellow-200 text-sm">Token Amount Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={formData.tokenAmountMin}
                onChange={(e) => setFormData({ ...formData, tokenAmountMin: Number(e.target.value) })}
                disabled={!isEditing}
                className="h-8 text-xs"
                placeholder="Min"
              />
              <Input
                type="number"
                value={formData.tokenAmountMax}
                onChange={(e) => setFormData({ ...formData, tokenAmountMax: Number(e.target.value) })}
                disabled={!isEditing}
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
                value={formData.levelUpHroom}
                onChange={(e) => setFormData({ ...formData, levelUpHroom: Number(e.target.value) })}
                disabled={!isEditing}
                className="h-8 text-xs"
                placeholder="HROOM"
              />
              <Input
                type="number"
                value={formData.levelUpSpore}
                onChange={(e) => setFormData({ ...formData, levelUpSpore: Number(e.target.value) })}
                disabled={!isEditing}
                className="h-8 text-xs"
                placeholder="SPORE"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400 grid grid-cols-2 gap-4">
          <div>
            <p><strong>Current Settings:</strong></p>
            <p>• Chest XP: {config.baseXpMin}-{config.baseXpMax} per open</p>
            <p>• Token drop: {(config.tokenDropChance * 100).toFixed(1)}% chance</p>
          </div>
          <div>
            <p><strong>Level Up Rewards:</strong></p>
            <p>• {config.levelUpHroom} $HROOM + {config.levelUpSpore} $SPORE</p>
            <p>• Token amounts: {config.tokenAmountMin}-{config.tokenAmountMax}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AdminRewardPanel;
