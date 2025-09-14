// src/components/Announcement.jsx
import React from 'react'
import { useFetch } from '../../hooks/useFetch';
import { motion } from 'motion/react';

const Announcement = () => {
  const { data, loading, error } = useFetch('/active-announcement');
  
  if (error) {
    return <div className="w-full h-10 bg-red-600 text-white flex items-center justify-center">{error}</div>;
  }

  if (!data || loading) return null;

  console.log(data.message);

  return (
    <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-18 left-0 w-full h-12 bg-black text-white flex items-center justify-center z-50"
    >
      <p className="font-semibold">{data.message}</p>
    </motion.div>
  );
}

export default Announcement;
