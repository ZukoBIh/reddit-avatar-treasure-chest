import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLevelUpRewards } from '@/hooks/useLevelUpRewards';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

interface NewReward {
  rewardType: 'hroom' | 'spore' | 'both';
  hroomAmount: number;
  sporeAmount: number;
  weight: number;
  minLevel: number;
  maxLevel: number;
}

const RewardPoolPanel: React.FC = () => {
  const { rewardsPool } = useLevelUpRewards();
  const [editingRewards, setEditingRewards] = useState<Record<string, any>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReward, setNewReward] = useState<NewReward>({
    rewardType: 'hroom',
    hroomAmount: 100,
    sporeAmount: 0,
    weight: 5,
    minLevel: 1,
    maxLevel: 100,
  });
  const [loading, setLoading] = useState(false);

  const handleEditReward = (rewardId: string, field: string, value: any) => {
    setEditingRewards(prev => ({
      ...prev,
      [rewardId]: {
        ...prev[rewardId],
        [field]: value,
      }
    }));
  };

  const handleSaveReward = async (rewardId: string) => {
    setLoading(true);
    try {
      const changes = editingRewards[rewardId];
      if (!changes) return;

      const { error } = await supabase
        .from('level_rewards_pool')
        .update({
          reward_type: changes.rewardType,
          hroom_amount: changes.hroomAmount,
          spore_amount: changes.sporeAmount,
          weight: changes.weight,
          min_level: changes.minLevel,
          max_level: changes.maxLevel,
          is_active: changes.isActive,
        })
        .eq('id', rewardId);

      if (error) throw error;

      setEditingRewards(prev => {
        const updated = { ...prev };
        delete updated[rewardId];
        return updated;
      });

      toast({
        title: "Reward Updated",
        description: "Changes have been saved successfully",
      });
    } catch (error) {
      console.error('Error updating reward:', error);
      toast({
        title: "Error",
        description: "Failed to update reward",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReward = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('level_rewards_pool')
        .insert({
          reward_type: newReward.rewardType,
          hroom_amount: newReward.hroomAmount,
          spore_amount: newReward.sporeAmount,
          weight: newReward.weight,
          min_level: newReward.minLevel,
          max_level: newReward.maxLevel,
        });

      if (error) throw error;

      setShowAddForm(false);
      setNewReward({
        rewardType: 'hroom',
        hroomAmount: 100,
        sporeAmount: 0,
        weight: 5,
        minLevel: 1,
        maxLevel: 100,
      });

      toast({
        title: "Reward Added",
        description: "New reward has been added to the pool",
      });
    } catch (error) {
      console.error('Error adding reward:', error);
      toast({
        title: "Error",
        description: "Failed to add reward",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('level_rewards_pool')
        .delete()
        .eq('id', rewardId);

      if (error) throw error;

      toast({
        title: "Reward Deleted",
        description: "Reward has been removed from the pool",
      });
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast({
        title: "Error",
        description: "Failed to delete reward",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRewardValue = (reward: any, field: string) => {
    return editingRewards[reward.id]?.[field] ?? reward[field];
  };

  return (
    <Card className="p-6 bg-purple-900/20 backdrop-blur-sm border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <h3 className="text-xl font-bold text-white">Level Up Reward Pool</h3>
          <Badge className="bg-purple-500 text-white">Admin Only</Badge>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reward
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-4 mb-4 bg-black/20 border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-3">Add New Reward</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="space-y-2">
              <Label className="text-white">Type</Label>
              <Select
                value={newReward.rewardType}
                onValueChange={(value: 'hroom' | 'spore' | 'both') => 
                  setNewReward(prev => ({ ...prev, rewardType: value }))
                }
              >
                <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hroom">HROOM</SelectItem>
                  <SelectItem value="spore">SPORE</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">HROOM</Label>
              <Input
                type="number"
                value={newReward.hroomAmount}
                onChange={(e) => setNewReward(prev => ({ 
                  ...prev, 
                  hroomAmount: parseInt(e.target.value) || 0 
                }))}
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">SPORE</Label>
              <Input
                type="number"
                value={newReward.sporeAmount}
                onChange={(e) => setNewReward(prev => ({ 
                  ...prev, 
                  sporeAmount: parseInt(e.target.value) || 0 
                }))}
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Weight</Label>
              <Input
                type="number"
                value={newReward.weight}
                onChange={(e) => setNewReward(prev => ({ 
                  ...prev, 
                  weight: parseInt(e.target.value) || 1 
                }))}
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Min Level</Label>
              <Input
                type="number"
                value={newReward.minLevel}
                onChange={(e) => setNewReward(prev => ({ 
                  ...prev, 
                  minLevel: parseInt(e.target.value) || 1 
                }))}
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Max Level</Label>
              <Input
                type="number"
                value={newReward.maxLevel}
                onChange={(e) => setNewReward(prev => ({ 
                  ...prev, 
                  maxLevel: parseInt(e.target.value) || 100 
                }))}
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddReward} disabled={loading}>
              {loading ? 'Adding...' : 'Add Reward'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAddForm(false)}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {rewardsPool.map((reward) => {
          const hasChanges = editingRewards[reward.id];
          return (
            <div key={reward.id} className="p-4 bg-black/20 rounded-lg border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
                <div className="space-y-2">
                  <Label className="text-white text-xs">Type</Label>
                  <Select
                    value={getRewardValue(reward, 'rewardType')}
                    onValueChange={(value) => handleEditReward(reward.id, 'rewardType', value)}
                  >
                    <SelectTrigger className="bg-black/20 border-gray-600 text-white h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hroom">HROOM</SelectItem>
                      <SelectItem value="spore">SPORE</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-xs">HROOM</Label>
                  <Input
                    type="number"
                    value={getRewardValue(reward, 'hroomAmount')}
                    onChange={(e) => handleEditReward(reward.id, 'hroomAmount', parseInt(e.target.value) || 0)}
                    className="bg-black/20 border-gray-600 text-white h-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-xs">SPORE</Label>
                  <Input
                    type="number"
                    value={getRewardValue(reward, 'sporeAmount')}
                    onChange={(e) => handleEditReward(reward.id, 'sporeAmount', parseInt(e.target.value) || 0)}
                    className="bg-black/20 border-gray-600 text-white h-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-xs">Weight</Label>
                  <Input
                    type="number"
                    value={getRewardValue(reward, 'weight')}
                    onChange={(e) => handleEditReward(reward.id, 'weight', parseInt(e.target.value) || 1)}
                    className="bg-black/20 border-gray-600 text-white h-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-xs">Min Level</Label>
                  <Input
                    type="number"
                    value={getRewardValue(reward, 'minLevel')}
                    onChange={(e) => handleEditReward(reward.id, 'minLevel', parseInt(e.target.value) || 1)}
                    className="bg-black/20 border-gray-600 text-white h-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-xs">Max Level</Label>
                  <Input
                    type="number"
                    value={getRewardValue(reward, 'maxLevel')}
                    onChange={(e) => handleEditReward(reward.id, 'maxLevel', parseInt(e.target.value) || 100)}
                    className="bg-black/20 border-gray-600 text-white h-8"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={getRewardValue(reward, 'isActive')}
                      onCheckedChange={(checked) => handleEditReward(reward.id, 'isActive', checked)}
                    />
                    <Label className="text-white text-xs">Active</Label>
                  </div>
                  
                  <div className="flex gap-1">
                    {hasChanges && (
                      <Button 
                        onClick={() => handleSaveReward(reward.id)}
                        disabled={loading}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-8 px-2"
                      >
                        Save
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteReward(reward.id)}
                      disabled={loading}
                      size="sm"
                      variant="destructive"
                      className="h-8 px-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RewardPoolPanel;