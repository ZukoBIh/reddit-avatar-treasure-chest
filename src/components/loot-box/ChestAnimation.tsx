
import React from 'react';
import { motion } from 'framer-motion';

interface ChestAnimationProps {
  isOpening: boolean;
}

export const ChestAnimation: React.FC<ChestAnimationProps> = ({ isOpening }) => {
  if (isOpening) {
    return (
      <motion.div
        className="text-8xl mb-6 relative"
        animate={{ 
          scale: [1, 1.2, 1, 1.2, 1],
          rotate: [0, 180, 360, 180, 0],
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        🍄
        <motion.div
          className="absolute inset-0 text-6xl"
          animate={{ 
            scale: [0, 1.5, 0, 1.5, 0],
            opacity: [0, 1, 0, 1, 0],
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="text-8xl mb-6 relative"
      whileHover={{ scale: 1.1 }}
      animate={{ 
        rotateY: [0, 10, -10, 0],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      🍄
      <motion.div
        className="absolute -top-2 -right-2 text-2xl"
        animate={{ 
          rotate: [0, 15, -15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute -bottom-2 -left-2 text-2xl"
        animate={{ 
          rotate: [0, -10, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
      >
        🌱
      </motion.div>
    </motion.div>
  );
};
