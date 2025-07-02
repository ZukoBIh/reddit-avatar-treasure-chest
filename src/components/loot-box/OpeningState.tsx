
import React from 'react';
import { motion } from 'framer-motion';
import { ChestAnimation } from './ChestAnimation';

export const OpeningState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center py-8"
    >
      <ChestAnimation isOpening={true} />
      <p className="text-xl text-green-400 font-semibold">
        Opening...
      </p>
    </motion.div>
  );
};
