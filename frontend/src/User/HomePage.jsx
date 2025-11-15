import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSectionViews } from "../../hooks/HomeRef";
import { useIsMobile } from "../../hooks/useIsInMobile";
import { motion } from "motion/react"
import { SlideTxt } from "../../components/animations/TextAnimation";
import ServiceSection from "./HomeSections/ServiceSection";
import ProductSection from "./HomeSections/ProductSection";
import FeedbackSection from "./HomeSections/FeedbackSection";
import SubscribeSection from "./HomeSections/SubscribeSection";
import ReviewFormSection from "./HomeSections/ReviewFormSection";

export default function MainPage({ announcementExist }) {
  const container = "w-full max-w-7xl mx-auto px-4 md:px-6";
  const branchImages = ["./lower_bicutan.png", "./toto_studio.JPG", "./totobg.JPG"];
  
  const { sectionRefs, inViews } = useSectionViews();
  const isMobile = useIsMobile(); 
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % branchImages.length);
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
        whileInView={{ opacity: 1, y: 0 }}
        className={`relative h-screen w-full flex flex-col justify-center items-center text-white px-4 ${announcementExist ? 'md:pt-25': 'md:pt-20'} bg-cover bg-center transition ease-in-out`}
      >
        <div className={`relative text-center space-y-2 mb-5 z-20 ${container}`}>
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
          src={branchImages[currentIndex]}
          alt={'Branch Image'}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-7xl h-[600px] rounded-lg ${isMobile ? 'hidden' : 'block'}`}
        />
          
      </motion.div>


      {/* About Us */}
      <div id="About Us" ref={sectionRefs.about} className={`relative min-h-[90vh] ${container} flex flex-col md:flex-row items-center justify-center py-10 gap-6`}>
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

      <div className={container}>
        <ProductSection/>
      </div>

      <div className={container}>
        <ServiceSection/>
      </div>

      <ReviewFormSection/>
      <FeedbackSection/>
      <SubscribeSection/>
    </div>
  );
}