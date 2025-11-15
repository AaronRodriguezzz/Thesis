import React from 'react'
import { BsScissors } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useIsMobile } from '../hooks/useIsInMobile';
import useScrollDetect from '../hooks/useScrollDetect';

const HaircutSuggestionBtn = () => {
    const scrollIsMax = useScrollDetect();
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    return (
        <motion.button
            animate={{
                y: scrollIsMax ? -75 : 0,
                opacity: 1
            }}
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate('/haircut-form')}
            className="
                fixed 
                right-3 bottom-[70px]      /* mobile */
                sm:right-5 sm:bottom-5
                md:right-8 md:bottom-[125px]
                lg:right-5 lg:bottom-[105px]

                bg-black/40 border border-white/30 
                text-white rounded-full 
                p-2 sm:p-3 md:p-4
                shadow-lg shadow-white/20 
                hover:bg-white/10 
                backdrop-blur-md 
                transition z-[60]
            "
        >
            <BsScissors className="w-7 h-7 sm:w-8 sm:h-8 md:w-11 md:h-11" />
        </motion.button>
    )
}

export default HaircutSuggestionBtn;
