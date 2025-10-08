// src/components/ui/OptionCard.jsx
import React from "react";
import { motion } from "framer-motion";

const OptionCard = ({ field, value, label, description, selected, handleSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`p-4 border rounded-xl shadow-md cursor-pointer transition 
        ${selected 
          ? "border-2 border-blue-600 bg-blue-100 shadow-lg shadow-blue-200" 
          : "border border-gray-300 bg-white hover:border-blue-400"
        }`}
      onClick={() => handleSelect(field, value)}
    >
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      {selected && (
        <p className="mt-2 text-blue-600 font-medium">✔ Selected</p>
      )}
    </motion.div>
  );
};

export default OptionCard;
