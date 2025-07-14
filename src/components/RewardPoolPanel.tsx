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
import { Trash2, Plus, Edit3, Save, X } from 'lucide-react';

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

  const startEditing = (reward: any) => {
    setEditingRewards(prev => ({
      ...prev,
      [reward.id]: {
        rewardType: reward.rewardType,
        hroomAmount: reward.hroomAmount,
        sporeAmount: reward.sporeAmount,
        weight: reward.weight,
        minLevel: reward.minLevel,
        maxLevel: reward.maxLevel,
        isActive: reward.isActive,
      }
    }));
  };

  const cancelEditing = (rewardId: string) => {
    setEditingRewards(prev => {
      const updated = { ...prev };
      delete updated[rewardId];
      return updated;
    });
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

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case 'hroom': return 'bg-orange-500';
      case 'spore': return 'bg-green-500';
      case 'both': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatRewardDescription = (reward: any) => {
    const type = getRewardValue(reward, 'rewardType');
    const hroom = getRewardValue(reward, 'hroomAmount');
    const spore = getRewardValue(reward, 'sporeAmount');
    
    if (type === 'both') {
      return `${hroom} HROOM + ${spore} SPORE`;
    } else if (type === 'hroom') {
      return `${hroom} HROOM`;
    } else {
      return `${spore} SPORE`;
    }
  };

  return (
    <Card className="p-6 bg-purple-900/20 backdrop-blur-sm border-purple-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <h3 className="text-xl font-bold text-white">Level Up Reward Pool</h3>
            <p className="text-sm text-gray-400">Manage rewards given when players level up</p>
          </div>
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
        <Card className="p-6 mb-6 bg-black/30 border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Reward
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-white font-medium">Reward Type</Label>
              <Select
                value={newReward.rewardType}
                onValueChange={(value: 'hroom' | 'spore' | 'both') => 
                  setNewReward(prev => ({ ...prev, rewardType: value }))
                }
              >
                <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="hroom">HROOM Only</SelectItem>
                  <SelectItem value="spore">SPORE Only</SelectItem>
                  <SelectItem value="both">Both HROOM & SPORE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-white font-medium">HROOM Amount</Label>
              <Input
                type="number"
                value={newReward.hroomAmount}
                onChange={(e) => setNewReward(prev => ({ 
                  ...prev, 
                  hroomAmount: parseInt(e.target.value) || 0 
                }))}
                className="bg-black/20 border-gray-600 text-white"
                placeholder="100"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-white font-medium">SPORE Amount</Label>
              <Input
                type="number"
                value={newReward.sporeAmount}
                onChange={(e) => setNewReward(prev => ({ 
                  ...prev, 
                  sporeAmount: parseInt(e.target.value) || 0 
                }))}
                className="bg-black/20 border-gray-600 text-white"
                placeholder="25"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-white font-medium">Weight</Label>
              <Input
                type="number"
                value={newReward.weight}
                onChange={(e) => setNewReward(prev => ({ 
                  ...prev, 
                  weight: parseInt(e.target.value) || 1 
                }))}
                className="bg-black/20 border-gray-600 text-white"
                placeholder="5"
              />
              <p className="text-xs text-gray-400">Higher weight = more likely to be selected</p>
            </div>

            <div className="space-y-3">
              <Label className="text-white font-medium">Level Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={newReward.minLevel}
                  onChange={(e) => setNewReward(prev => ({ 
                    ...prev, 
                    minLevel: parseInt(e.target.value) || 1 
                  }))}
                  className="bg-black/20 border-gray-600 text-white"
                  placeholder="Min"
                />
                <Input
                  type="number"
                  value={newReward.maxLevel}
                  onChange={(e) => setNewReward(prev => ({ 
                    ...prev, 
                    maxLevel: parseInt(e.target.value) || 100 
                  }))}
                  className="bg-black/20 border-gray-600 text-white"
                  placeholder="Max"
                />
              </div>
              <p className="text-xs text-gray-400">Levels {newReward.minLevel}-{newReward.maxLevel}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button onClick={handleAddReward} disabled={loading} className="bg-green-600 hover:bg-green-700">
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

      <div className="space-y-4">
        {rewardsPool.map((reward) => {
          const isEditing = editingRewards[reward.id];
          const isActive = getRewardValue(reward, 'isActive');
          
          return (
            <Card key={reward.id} className={`p-5 transition-all duration-200 ${
              isActive ? 'bg-black/20 border-gray-600' : 'bg-black/10 border-gray-700 opacity-60'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge className={`${getRewardTypeColor(getRewardValue(reward, 'rewardType'))} text-white px-3 py-1`}>
                    {getRewardValue(reward, 'rewardType').toUpperCase()}
                  </Badge>
                  <div>
                    <p className="text-white font-medium text-lg">
                      {formatRewardDescription(reward)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Levels {getRewardValue(reward, 'minLevel')}-{getRewardValue(reward, 'maxLevel')} • 
                      Weight: {getRewardValue(reward, 'weight')} • 
                      {isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => {
                        if (!isEditing) startEditing(reward);
                        handleEditReward(reward.id, 'isActive', checked);
                      }}
                    />
                    <Label className="text-white text-sm">Active</Label>
                  </div>
                  
                  {!isEditing ? (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => startEditing(reward)}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800 h-8 px-3"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteReward(reward.id)}
                        disabled={loading}
                        size="sm"
                        variant="destructive"
                        className="h-8 px-3"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <Button 
                        onClick={() => handleSaveReward(reward.id)}
                        disabled={loading}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-8 px-3"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => cancelEditing(reward.id)}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800 h-8 px-3"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-600">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Type</Label>
                    <Select
                      value={getRewardValue(reward, 'rewardType')}
                      onValueChange={(value) => handleEditReward(reward.id, 'rewardType', value)}
                    >
                      <SelectTrigger className="bg-black/20 border-gray-600 text-white h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="hroom">HROOM</SelectItem>
                        <SelectItem value="spore">SPORE</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">HROOM Amount</Label>
                    <Input
                      type="number"
                      value={getRewardValue(reward, 'hroomAmount')}
                      onChange={(e) => handleEditReward(reward.id, 'hroomAmount', parseInt(e.target.value) || 0)}
                      className="bg-black/20 border-gray-600 text-white h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">SPORE Amount</Label>
                    <Input
                      type="number"
                      value={getRewardValue(reward, 'sporeAmount')}
                      onChange={(e) => handleEditReward(reward.id, 'sporeAmount', parseInt(e.target.value) || 0)}
                      className="bg-black/20 border-gray-600 text-white h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Weight</Label>
                    <Input
                      type="number"
                      value={getRewardValue(reward, 'weight')}
                      onChange={(e) => handleEditReward(reward.id, 'weight', parseInt(e.target.value) || 1)}
                      className="bg-black/20 border-gray-600 text-white h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Min Level</Label>
                    <Input
                      type="number"
                      value={getRewardValue(reward, 'minLevel')}
                      onChange={(e) => handleEditReward(reward.id, 'minLevel', parseInt(e.target.value) || 1)}
                      className="bg-black/20 border-gray-600 text-white h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Max Level</Label>
                    <Input
                      type="number"
                      value={getRewardValue(reward, 'maxLevel')}
                      onChange={(e) => handleEditReward(reward.id, 'maxLevel', parseInt(e.target.value) || 100)}
                      className="bg-black/20 border-gray-600 text-white h-9"
                    />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
        
        {rewardsPool.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No rewards in the pool yet</p>
            <p className="text-gray-500 text-sm mt-2">Add your first reward to get started</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RewardPoolPanel;