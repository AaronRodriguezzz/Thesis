import React from 'react';
import { motion } from 'motion/react';

export const SlideTxt = ({ text, enable, speed, className, id }) => {
  const animationDuration = `${speed}s`;

  return (
    <motion.h1 
        id={id}
        initial={{ x: -100, opacity: -10 }}
        transition={{ duration: 1, ease: "easeInOut"}}
        animate={enable ? { opacity: 1, x: 0 } :  {}}
        className={className}
    > 
        {text}
    </motion.h1>
  );
};
