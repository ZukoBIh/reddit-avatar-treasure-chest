import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAchievements } from '@/hooks/useAchievements';

export const AchievementsPanel: React.FC = () => {
  const { achievements, getAchievementProgress, isLoading } = useAchievements();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🏆 Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading achievements...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 Achievements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => {
          const progress = getAchievementProgress(achievement.achievement_key);
          
          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border transition-all ${
                progress?.isCompleted 
                  ? 'border-success bg-success/10' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {progress?.isCompleted && (
                    <Badge variant="secondary" className="bg-success text-success-foreground">
                      ✓ Complete
                    </Badge>
                  )}
                  <div className="text-right text-xs text-muted-foreground">
                    <div>+{achievement.reward_spores} 🍄</div>
                    <div>+{achievement.reward_hroom} 🏠</div>
                  </div>
                </div>
              </div>
              
              {progress && !progress.isCompleted && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{progress.progress}/{progress.required}</span>
                  </div>
                  <Progress 
                    value={(progress.progress / progress.required) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};