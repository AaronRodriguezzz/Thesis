import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { SlideTxt } from "../../../components/animations/TextAnimation";
import { useSectionViews } from "../../../hooks/HomeRef";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../hooks/useIsInMobile";

const HeroSection = () => {

    const branchImages = ["lower_bicutan_bdkbfq", "totobg_hnaxbv", "toto_studio_xk2mji"];
    
    const { sectionRefs, inViews } = useSectionViews();
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    
   useEffect(() => {
        branchImages.forEach((src) => {
            const img = new Image();
            img.src = `https://res.cloudinary.com/dk3bbinj9/image/upload/${src}`;
        });
    }, []);

    useEffect(() => {
        if (!inViews.home) return;

        const timer = setTimeout(() => {
            setCurrentIndex((i) => (i + 1) % branchImages.length);
        }, 2000);

        return () => clearTimeout(timer);
    }, [inViews.home, currentIndex]);

    return (
        <motion.div
            id="Home"
            ref={sectionRefs.home}  
            initial={{ opacity: 0 }}
            transition={{ type: "spring", duration: 2, ease: "easeInOut" }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`relative min-h-screen w-full flex flex-col justify-center items-center text-white px-4 bg-cover bg-center transition ease-in-out`}
        >
            <div className='relative text-center space-y-2 mb-5 z-20 w-full max-w-7xl mx-auto px-4 md:px-6'>
            <SlideTxt
                text="Where Tradition Meets Precision"
                enable={inViews.home}
                speed={5}
                className="font-bold text-3xl md:text-4xl lg:text-5xl"
            />
            
            <SlideTxt
                text="Book an appointment now and experience the art of grooming"
                enable={inViews.home}
                speed={5}
                className="w-full text-sm md:text-md lg:text-lg font-extralight mt-[-4px]"
            />
            <motion.button
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/appointment")}
                className="inline-block w-[100px] md:w-[150px] lg:w-[170px] border border-white px-4 py-2 shadow-md rounded-full
                hover:bg-white hover:text-black transition-colors text-center"
            >
                BOOK
            </motion.button>
            </div>

            {/* Mobile video */}
            <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                src="/barbering.mp4"
                autoPlay
                loop
                muted
                playsInline
                poster="/fallback.jpg"
                className="absolute top-0 left-0 block md:hidden w-full h-full object-cover z-0"
            />

            <motion.img
                key={branchImages[currentIndex]} 
                src={`https://res.cloudinary.com/dk3bbinj9/image/upload/${branchImages[currentIndex]}`}
                alt={'Branch Image'}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`max-w-7xl h-[600px] rounded-lg ${isMobile ? 'hidden' : 'block'}`}
            />
            
        </motion.div>
    )
}

export default HeroSection