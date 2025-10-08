import React from 'react'
import { BsScissors } from "react-icons/bs";  // Bootstrap scissors
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import useScrollDetect from '../hooks/useScrollDetect';

const HaircutSuggestionBtn = () => {
    
    const navigate = useNavigate();
    const scrollIsMax = useScrollDetect();

    return (
        <motion.button
            initial={{ opacity: 0, x: 0 }}
            animate={{
                y: scrollIsMax ? -70 : 0, // shift up when at bottom
                opacity: 1
            }}
            transition={{ duration: .5, ease: "easeInOut" }}
            onClick={() => navigate('/haircut-form')}
            className="fixed right-2 bottom-20 md:bottom-22 bg-gray-600 text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition"
        >
            <BsScissors className='w-7 h-7 md:w-10 md:h-10' />
        </motion.button>
    )
}

export default HaircutSuggestionBtn