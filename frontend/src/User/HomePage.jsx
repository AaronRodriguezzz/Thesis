import React, { useEffect, useState, useRef} from "react";
import { FaChevronLeft,  FaChevronRight} from 'react-icons/fa';
import { Link, useNavigate, Navigate} from "react-router-dom";
import Rating from "@mui/material/Rating";
import { get_data } from "../../services/GetMethod";
import { post_data } from "../../services/PostMethod";
import { motion } from "motion/react"
import { SlideTxt } from "../../components/animations/TextAnimation";
import { useSectionViews } from "../../hooks/HomeRef";
import { useUserProtection } from "../../hooks/useUser";
import { useIsMobile } from "../../hooks/useIsInMobile";

const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';
const images = ["/lower_bicutan.png", "/toto_studio.JPG", "/totobg.JPG"];

export default function MainPage() {
  useUserProtection();

  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 3 : 5;  

  const navigate = useNavigate();
  const { sectionRefs, inViews } = useSectionViews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [services, setServices] = useState(null);
  const [products, setProducts] = useState(null);
  const [productIndex, setProductIndex] = useState(0);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const feedbacks = [
    {
      customerName: "James Cruz",
      feedback: "The barber was skilled and friendly. Loved the clean fade I got!",
      rating: 5,
    },
    {
      customerName: "Miguel Santos",
      feedback: "Great service and chill atmosphere, but the wait time was a bit long.",
      rating: 3,
    },
    {
      customerName: "Elijah Reyes",
      feedback: "Affordable and stylish cuts. Definitely coming back.",
      rating: 4,
    },
  ];

  const handlePrev = () => {
    setProductIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    setProductIndex((prev) =>
      Math.min(prev + itemsPerPage, products.length - itemsPerPage)
    );
  };

  const visibleProducts = products && products.slice(productIndex, productIndex + itemsPerPage);

  const handle_subscribed_email = async (e) => {
    e.preventDefault();

    try{
        const response = await post_data( { email: subscribedEmail }, '/subscribe');

        if(response){
          setSubscribedEmail('');
        }
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    const initialize_homePage = async () => {

      const [serviceResponse, productResponse] = await Promise.all([
        await get_data("/get_data/service"), 
        await get_data("/get_data/product")
      ]); 

      if (serviceResponse && productResponse) {
        setServices(serviceResponse);
        setProducts(productResponse)
      }
    };

    initialize_homePage();
  }, []);

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
 
  }, []);

  useEffect(() => {
    products && console.log(products)
  },[products])

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

      {/* Products */}
      <div id="Products" ref={sectionRefs.products} className="w-full flex flex-col items-center bg-gray-800 py-20 md:px-4">
        <motion.h1 
          initial={isMobile ? { opacity: 0, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 1, ease: "easeInOut"}}
          animate={isMobile || inViews.products ? { opacity: 1, x: 0, y: 0 } : {}}
          className="text-white text-center font-extralight tracking-widest text-3xl md:text-5xl mb-10"
        > 
          PRODUCT CATALOG
        </motion.h1>
    
        <div className="relative w-full flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 translate-y-1/2 left-0 md:static flex items-center justify-center md:p-2 hover:bg-gray-500 rounded-full"
          >
            <FaChevronLeft className="text-white" size={isMobile ? 20 : 40} />
          </button>

          {/* Product Cards Container */}
          <div className="w-full flex flex-wrap justify-center gap-6">
            {visibleProducts?.map((product, index) => (
              <motion.div
                key={product._id}
                initial={isMobile ? { opacity: 0, x: 0 } : { opacity: 0, y: -20 }}
                animate={isMobile || inViews.products ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.3, ease: "easeInOut", delay: index * 0.2 }}
                className="bg-gray-700 h-[500px] w-[85%] sm:w-[45%] md:w-[30%] lg:w-[250px] p-4 hover:scale-105 transition-transform rounded-lg shadow-md"
              >
                <img
                  src={`${baseUrl}/${product.imagePath}`}
                  alt={product.name}
                  className="w-full h-[60%] md:h-[40%] lg:h-[60%] object-cover rounded-md mb-4 shadow"
                />
                <div className="text-white tracking-tight space-y-1">
                  <h2 className="text-md md:text-lg font-bold">{product.name}</h2>
                  <p className="text-base font-semibold">₱{product.price}</p>
                  <p className="text-md">{product.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 translate-y-1/2 right-0 md:static flex items-center justify-center md:p-2 hover:bg-gray-500 rounded-full"
          >
            <FaChevronRight className="text-white" size={isMobile ? 20 : 40} />
          </button>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 100}}
          animate={inViews.products ? { opacity: 1, y:0} : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
          onClick={() => navigate('/products')}
          className="mt-10 bg-white text-gray-800 py-3 px-8 rounded-sm hover:bg-green-500 tracking-tight transition-colors"
        >
          BRANCH AVAILABILITY
        </motion.button>
      </div>



      {/* Services */}


      <div ref={sectionRefs.services} className="w-full bg-white flex flex-col px-4 md:px-10 gap-y-4 my-10">
        <SlideTxt
          text="SERVICES WE OFFER"
          enable={inViews.services ? true : false}
          speed={5}
          className="text-center my-10 font-extralight tracking-widest text-4xl md:text-5xl" 
          id="Services"
        />

        {services &&
          services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -100 }}
              animate={inViews.services ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: .5, ease: "easeInOut", delay: index * .1 }}
              className={`w-full shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
            >
              <div className="flex-1">  
                <h1 className="font-semibold text-xl">{service?.name}</h1>
                <p className="tracking-tighter text-base">{service?.description}</p>
              </div>
              <p className="text-base font-medium">₱{service?.price}.00 PHP</p>
            </motion.div>
          ))}
      </div>

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

      {/* Reviews */}
      <div className="px-4 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="my-6 font-extralight tracking-widest text-3xl md:text-4xl">REVIEWS</h1>
          <Link to="/" className="text-center underline hover:scale-110 transition">
            VIEW MORE
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center" ref={sectionRefs.feedback}>
          {feedbacks.map((feeds, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -200 }}
              animate={inViews.feedback ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .5, ease: "easeInOut", delay: index * .2 }}
              className="w-full sm:w-[300px] h-[300px] flex flex-col gap-y-4 justify-center items-center shadow p-4"
            >
              <Rating name="read-only" value={feeds.rating} readOnly />
              <p className="tracking-tighter text-center">"{feeds.feedback}"</p>
              <h2>-{feeds.customerName}</h2>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <form 
        className="w-full flex flex-col justify-center items-center gap-y-4 bg-gray-800 py-12 px-4 mt-10 text-center text-white"
        onSubmit={handle_subscribed_email}
      >
        <h1 className="text-2xl md:text-4xl font-light">
          Do you want to be always updated?
        </h1>
        <p className="text-sm md:text-base font-semibold max-w-2xl">
          Be the first to know about new collections and exclusive offers by subscribing to our emails for free
        </p>
        <input
          type="email"
          className="w-full max-w-md px-4 py-3 border border-white rounded-md outline-none shadow-inside text-white"
          placeholder="Enter your email"
          value={subscribedEmail}
          onChange={(e) => setSubscribedEmail(e.target.value)}
        />
        <button 
          className="bg-white text-black rounded-full py-3 px-6 text-sm md:text-base hover:bg-green-500 transition"
          type="submit"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}