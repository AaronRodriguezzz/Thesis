import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react"
import { SlideTxt } from "../../components/animations/TextAnimation";
import { useSectionViews } from "../../hooks/HomeRef";
import { useIsMobile } from "../../hooks/useIsInMobile";
import ServiceSection from "./HomeSections/ServiceSection";
import ProductSection from "./HomeSections/ProductSection";
import FeedbackSection from "./HomeSections/FeedbackSection";
import SubscribeSection from "./HomeSections/SubscribeSection";

const images = ["/lower_bicutan.png", "/toto_studio.JPG", "/totobg.JPG"];

export default function MainPage() {
  const { sectionRefs, inViews } = useSectionViews();
  const isMobile = useIsMobile(); 
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        id="Home"
        ref={sectionRefs.home}
        initial={{ opacity: 0 }}
        transition={{ type: "spring", duration: 2, ease: "easeInOut" }}
        animate={inViews.home ? { opacity: 1, y: 0 } : {}}
        style={{
          backgroundImage: isMobile ? "none" : `url(${images[currentIndex]})`,
        }}
        className="relative h-screen w-full flex flex-col justify-center text-white px-4 md:px-20 bg-cover bg-center gap-y-2 transition ease-in-out"
      >
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

        {/* Text content */}
        <div className="relative space-y-2 z-20">
          <SlideTxt
            text="Where Tradition Meets Precision"
            enable={inViews.home}
            speed={5}
            className="font-bold text-2xl md:text-4xl lg:text-6xl leading-tighter"
          />
          <SlideTxt
            text="Book an appointment now and experience the art of grooming"
            enable={inViews.home}
            speed={5}
            className="text-sm md:text-lg lg:text-2xl font-extralight leading-tighter mt-[-4px]"
          />
          <motion.button
            initial={{ opacity: 0, x: -100 }}
            animate={inViews.home ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeInOut" }}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/appointment")}
            className="inline-block w-[100px] md:w-[150px] lg:w-[200px] bg-white text-sm md:text-md lg:text-xl text-gray-900 px-4 py-2 shadow-md hover:bg-gray-900 hover:text-white transition-colors text-center"
          >
            BOOK
          </motion.button>
        </div>
      </motion.div>


      {/* About Us */}
      <div id="About Us" ref={sectionRefs.about} className="h-[90vh] w-full bg-white flex flex-col md:flex-row items-center justify-center px-4 md:px-10 py-10 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 1, ease: "easeInOut"}}
          animate={inViews.about ? { opacity: 1, x: 0 } : {}}
          className="w-full md:w-1/2 flex flex-col items-start"
        >
          <h1 className="text-center font-extralight tracking-widest text-3xl md:text-5xl mb-4">ABOUT US</h1>
          <p className="text-justify text-sm md:text-lg tracking-tight">
            Three years ago, we began as The Hauz Barbers—a neighborhood shop with a mission to deliver high-quality grooming with a personal touch. Founded by a seasoned barber who once styled celebrities at Bruno’s Barbers, our journey has evolved into Toto Tumbs: a brand that represents class, elegance, and refined barbering. The shift from The Hauz to Toto Tumbs wasn’t just a name change, but a transformation in style, ambiance, and service, blending traditional techniques with modern flair. Now with six Toto Tumbs branches—alongside the original Hauz Barbers still in operation—we continue to offer premium grooming experiences for clients who value craftsmanship and class.
          </p>
        </motion.div>
        <motion.img
          src="/about2.png"
          alt="About us"
          initial={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut"}}
          animate={inViews.about  ? { opacity: 1 } : {}}
          className="w-full max-w-xs md:max-w-sm lg:max-w-xl h-auto rounded-lg "
        />
      </div>

      <ProductSection/>
      <ServiceSection/>

      {/* Feedback Prompt */}
      <motion.div   
        ref={sectionRefs.feedback}
        initial={{ opacity: 0, x: -200 }}
        animate={inViews.feedback ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: .7, ease: "easeInOut" }}
        className="w-full bg-white flex items-center justify-center py-20 px-4"
      >
        <div className="w-full md:w-2/3 lg:w-1/2 bg-gray-800 rounded-xl flex flex-col justify-center items-center text-center p-10 text-white">
          <h1 className="text-3xl md:text-5xl font-semibold">Give us your feedback!</h1>
          <p className="text-md md:text-lg">Help us to find what we could improve!</p>
          <button 
            className="py-2 md:py-3 px-3 md:px-6 my-3 bg-white text-black text-sm md:text-md hover:bg-green-500 transition-colors"
            onClick={() => navigate('/feedback')}
          >
            Feedback Form
          </button>
        </div>
      </motion.div>

      <FeedbackSection/>
      <SubscribeSection/>
    </div>
  );
}