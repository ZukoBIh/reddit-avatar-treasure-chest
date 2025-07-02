
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChestAnimation } from './ChestAnimation';

interface UnOpenedStateProps {
  onOpenChest: () => void;
}

export const UnOpenedState: React.FC<UnOpenedStateProps> = ({ onOpenChest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center"
    >
      <ChestAnimation isOpening={false} />
      <Button
        onClick={onOpenChest}
        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl text-lg"
      >
        Open Chest!
      </Button>
    </motion.div>
  );
};
