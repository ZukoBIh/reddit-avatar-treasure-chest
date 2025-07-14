import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CollectionProgressProps {
  ownedContracts: string[];
}

const REQUIRED_CONTRACTS = [
  { 
    address: '0xA63EfDE7Cb14DD537b7e61a3087aE9B8A7849eE2', 
    name: 'Actrule Alpha' 
  },
  { 
    address: '0xe364d16731579078afa1195630e4035657ef9d1a', 
    name: 'Actrule Beta' 
  },
  { 
    address: '0x97386b7fae8bc384afa1af14b6dd96d9123f762f', 
    name: 'Actrule Gamma' 
  },
  { 
    address: '0x9c92b882ac7aeff58414d874de60d30381991bad', 
    name: 'Actrule Delta' 
  },
  { 
    address: '0xbd24e412d8eb0bca223ad87869374d97cede3424', 
    name: 'Actrule Epsilon' 
  }
];

export const CollectionProgress: React.FC<CollectionProgressProps> = ({ ownedContracts }) => {
  const ownedCount = REQUIRED_CONTRACTS.filter(contract => 
    ownedContracts.some(owned => owned.toLowerCase() === contract.address.toLowerCase())
  ).length;

  const isComplete = ownedCount === REQUIRED_CONTRACTS.length;
  const progressPercentage = (ownedCount / REQUIRED_CONTRACTS.length) * 100;

  return (
    <Card className={`${isComplete ? 'border-success bg-success/5' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🎯 Collection Progress</span>
          {isComplete && (
            <Badge variant="secondary" className="bg-success text-success-foreground">
              Master Collector!
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Actrule NFTs Collected</span>
            <span className="font-semibold">{ownedCount}/{REQUIRED_CONTRACTS.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        <div className="grid grid-cols-1 gap-2">
          {REQUIRED_CONTRACTS.map((contract) => {
            const isOwned = ownedContracts.some(owned => 
              owned.toLowerCase() === contract.address.toLowerCase()
            );
            
            return (
              <div
                key={contract.address}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isOwned 
                    ? 'border-success bg-success/10 text-success-foreground' 
                    : 'border-border bg-muted/30'
                }`}
              >
                <span className="font-medium text-sm">{contract.name}</span>
                <div className="flex items-center gap-2">
                  {isOwned ? (
                    <>
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        ✓ Owned
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Not Owned
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isComplete && (
          <div className="mt-4 p-4 bg-success/10 border border-success rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-success-foreground mb-1">
                🏆 Collection Master Achieved!
              </div>
              <div className="text-sm text-muted-foreground">
                You've collected all 5 Actrule NFTs and earned massive rewards!
              </div>
              <div className="mt-2 text-xs">
                <span className="text-success font-semibold">+1000 🍄 +5000 🏠</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};