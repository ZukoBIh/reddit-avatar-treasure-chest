
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface WalletConnectionProps {
  onConnect: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection (in real app, use wagmi/rainbowkit)
    try {
      // Mock connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Wallet Connected! 🎉",
        description: "Successfully connected to your wallet. Loading your avatars...",
      });
      
      setTimeout(() => {
        onConnect();
      }, 1000);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again or check your wallet.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
        >
          {isConnecting ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Connecting...</span>
            </motion.div>
          ) : (
            <span className="flex items-center space-x-2">
              <span>🦊</span>
              <span>Connect MetaMask</span>
            </span>
          )}
        </Button>
      </motion.div>
      
      <div className="text-center">
        <p className="text-sm text-purple-300">
          Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline">Download here</a>
        </p>
      </div>
    </div>
  );
};

export default WalletConnection;
