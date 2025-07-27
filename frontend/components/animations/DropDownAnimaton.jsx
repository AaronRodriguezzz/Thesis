import React from 'react';
import { motion } from 'motion/react';

export const AnimatedDropDown = ({ label, id, delay, value, onChange, className, disabled, children }) => {

  return (
    <>
        <motion.label 
            htmlFor={id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: delay }}
            >
            {label}
        </motion.label>

        <motion.select
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay }}
            name={id}
            id={id}
            value={value}
            onChange={onChange}
            className={className}
            disabled={disabled}
            >
            {children}
        </motion.select>
    </>
  );
};
