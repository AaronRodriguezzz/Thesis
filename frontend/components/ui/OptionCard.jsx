// src/components/ui/OptionCard.jsx
import React from "react";
import { motion } from "framer-motion";

const OptionCard = ({ field, value, label, description, selected, handleSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={` text-white  p-4 border rounded-xl shadow-md cursor-pointer transition  
        ${selected 
          ? "border-2 border-green-600 bg-green-100 shadow-lg shadow-green-200" 
          : " bg-black/40 hover:border-green-400"
        }`}
      onClick={() => handleSelect(field, value)}
    >
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-sm">{description}</p>
      {selected && (
        <p className="mt-2 text-blue-600 font-medium">✔ Selected</p>
      )}
    </motion.div>
  );
};

export default OptionCard;
