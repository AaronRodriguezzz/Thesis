import React from 'react'
import { BsScissors } from "react-icons/bs";  // Bootstrap scissors
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const HaircutSuggestionBtn = () => {
    
    const navigate = useNavigate();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate('/haircut-form')}
            className="fixed right-4 bottom-23 bg-black/40 border border-white/30 text-white rounded-full p-3 shadow-lg shadow-white/20 hover:bg-white/10 backdrop-blur-md transition"
        >
            <BsScissors className='w-7 h-7 md:w-10 md:h-10' />
        </motion.button>
    )
}

export default HaircutSuggestionBtn