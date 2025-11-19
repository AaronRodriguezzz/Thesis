import { useSectionViews } from "../../hooks/HomeRef";
import { motion } from "motion/react"
import HeroSection from "./HomeSections/HeroSection";
import ServiceSection from "./HomeSections/ServiceSection";
import ProductSection from "./HomeSections/ProductSection";
import FeedbackSection from "./HomeSections/FeedbackSection";
import SubscribeSection from "./HomeSections/SubscribeSection";
import ReviewFormSection from "./HomeSections/ReviewFormSection";

export default function MainPage() {
  const container = "w-full max-w-7xl mx-auto px-4 md:px-6";  
  const { sectionRefs } = useSectionViews();
  
  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      {/* About Us */}
      

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