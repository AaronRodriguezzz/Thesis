import React from 'react'
import { useSectionViews } from '../../../hooks/HomeRef';

const AboutSection = () => {
    const { sectionRefs } = useSectionViews();
    return (
        <div id="About Us" ref={sectionRefs.about} className={`relative min-h-[90vh] w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-center py-10 gap-6`}>
            <motion.div 
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 1, ease: "easeInOut"}}
            whileInView={{ opacity: 1, x: 0 }}
            className="w-full flex flex-col items-start px-4 xl:px-0"
            >
            <h1 className="text-center text-white font-extralight tracking-widest text-3xl md:text-5xl mb-4">ABOUT US</h1>
            <p className="text-justify text-sm text-white md:text-lg tracking-tight">
                Three years ago, we began as The Hauz Barbers—a neighborhood shop with a mission to deliver high-quality grooming with a personal touch. Founded by a seasoned barber who once styled celebrities at Bruno’s Barbers, our journey has evolved into Toto Tumbs: a brand that represents class, elegance, and refined barbering. The shift from The Hauz to Toto Tumbs wasn’t just a name change, but a transformation in style, ambiance, and service, blending traditional techniques with modern flair. Now with six Toto Tumbs branches—alongside the original Hauz Barbers still in operation—we continue to offer premium grooming experiences for clients who value craftsmanship and class.
            </p>
            </motion.div>
            <motion.img
            src="/about-image.png"
            alt="About us"
            initial={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut"}}
            whileInView={{ opacity: 1 }}
            className="w-full max-w-md h-auto rounded-lg"
            />
        </div>
    )
}

export default AboutSection