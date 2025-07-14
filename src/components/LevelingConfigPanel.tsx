import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLevelingSystem } from '@/hooks/useLevelingSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const LevelingConfigPanel: React.FC = () => {
  const { config } = useLevelingSystem();
  const [formData, setFormData] = useState({
    baseXpRequirement: config?.baseXpRequirement || 100,
    xpScalingFactor: config?.xpScalingFactor || 1.15,
    maxLevel: config?.maxLevel || 100,
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (config) {
      setFormData({
        baseXpRequirement: config.baseXpRequirement,
        xpScalingFactor: config.xpScalingFactor,
        maxLevel: config.maxLevel,
      });
    }
  }, [config]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update the first (and only) leveling config row
      const { error } = await supabase
        .from('leveling_config')
        .update({
          base_xp_requirement: formData.baseXpRequirement,
          xp_scaling_factor: formData.xpScalingFactor,
          max_level: formData.maxLevel,
        })
        .limit(1);

      if (error) throw error;

      toast({
        title: "Leveling Config Updated",
        description: "Changes have been saved successfully",
      });
    } catch (error) {
      console.error('Error updating leveling config:', error);
      toast({
        title: "Error",
        description: "Failed to update leveling configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = config && (
    formData.baseXpRequirement !== config.baseXpRequirement ||
    formData.xpScalingFactor !== config.xpScalingFactor ||
    formData.maxLevel !== config.maxLevel
  );

  return (
    <Card className="p-6 bg-blue-900/20 backdrop-blur-sm border-blue-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📈</span>
          <h3 className="text-xl font-bold text-white">Leveling Configuration</h3>
          <Badge className="bg-blue-500 text-white">Admin Only</Badge>
        </div>
        {hasChanges && (
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baseXp" className="text-white">Base XP Requirement</Label>
          <Input
            id="baseXp"
            type="number"
            value={formData.baseXpRequirement}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              baseXpRequirement: parseInt(e.target.value) || 0 
            }))}
            className="bg-black/20 border-gray-600 text-white"
          />
          <p className="text-xs text-gray-400">XP needed for level 2</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scalingFactor" className="text-white">XP Scaling Factor</Label>
          <Input
            id="scalingFactor"
            type="number"
            step="0.01"
            value={formData.xpScalingFactor}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              xpScalingFactor: parseFloat(e.target.value) || 1 
            }))}
            className="bg-black/20 border-gray-600 text-white"
          />
          <p className="text-xs text-gray-400">Multiplier per level (e.g., 1.15 = 15% increase)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxLevel" className="text-white">Maximum Level</Label>
          <Input
            id="maxLevel"
            type="number"
            value={formData.maxLevel}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              maxLevel: parseInt(e.target.value) || 1 
            }))}
            className="bg-black/20 border-gray-600 text-white"
          />
          <p className="text-xs text-gray-400">Highest achievable level</p>
        </div>
      </div>

      {config && (
        <div className="mt-4 p-3 bg-black/20 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong>Preview:</strong> Level 2 requires {formData.baseXpRequirement} XP, 
            Level 3 requires {Math.floor(formData.baseXpRequirement * formData.xpScalingFactor)} XP, 
            Level 4 requires {Math.floor(formData.baseXpRequirement * Math.pow(formData.xpScalingFactor, 2))} XP
          </p>
        </div>
      )}
    </Card>
  );
};

export default LevelingConfigPanel;