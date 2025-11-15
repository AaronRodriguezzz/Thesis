// src/components/Announcement.jsx
import React from 'react'
import { useFetch } from '../../hooks/useFetch';
import { motion } from 'motion/react';

const Announcement = () => {
  const { data, loading } = useFetch('active-announcement');

  if (!data || loading) return null;

  return (
    <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-18 left-0 w-full h-12 bg-white/70 text-black flex items-center justify-center z-50"
    >
      <p className="w-full font-semibold text-center">ANNOUNCEMENT: {data.message.toUpperCase()}</p>
    </motion.div>
  );
}

export default Announcement;
