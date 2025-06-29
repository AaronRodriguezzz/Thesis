import React, { useEffect, useState } from "react";
import { FaChevronLeft,  FaChevronRight} from 'react-icons/fa';
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import { get_data } from "../../services/GetMethod";

export default function MainPage() {
  const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [services, setServices] = useState(null);
  const [products, setProducts] = useState(null);
  const [productIndex, setProductIndex] = useState(0);
  const itemsPerPage = 5;  
  const images = ["/lower_bicutan.png", "/toto_studio.JPG", "/totobg.JPG"];

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


  useEffect(() => {
    const get_services = async () => {
      const service = await get_data("/get_data/service");
      const product = await get_data("/get_data/product")

      if (service && product) {
        setServices(service);
        setProducts(product)
      }
    };
    get_services();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <div
        id="Home"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
        className="h-[90vh] w-full flex flex-col justify-center text-white px-4 md:px-20 bg-cover bg-center z-10 space-y-2 transition ease-in-out"
      >
        <h1 className="font-bold text-2xl md:text-4xl lg:text-6xl leading-tighter">
          Where Tradition Meets Precision
        </h1>
        <p className="text-sm md:text-lg lg:text-2xl font-extralight leading-tighter mt-[-4px]">
          Book an appointment now
        </p>
        <Link
          to="/appointment"
          className="inline-block w-[150px] lg:w-[200px] bg-white text-md lg:text-xl text-gray-900 px-4 py-2 shadow-md hover:bg-gray-900 hover:text-white transition-colors text-center"
        >
          BOOK
        </Link>
      </div>

      {/* About Us */}
      <div id="About Us" className="w-full bg-white flex flex-col md:flex-row items-center justify-center px-4 md:px-10 py-10 gap-6">
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <h1 className="text-center font-extralight tracking-widest text-3xl md:text-5xl mb-4">ABOUT US</h1>
          <p className="text-justify text-sm md:text-lg tracking-tight">
            Three years ago, we began as The Hauz Barbers—a neighborhood shop with a mission to deliver high-quality grooming with a personal touch. Founded by a seasoned barber who once styled celebrities at Bruno’s Barbers, our journey has evolved into Toto Tumbs: a brand that represents class, elegance, and refined barbering. The shift from The Hauz to Toto Tumbs wasn’t just a name change, but a transformation in style, ambiance, and service, blending traditional techniques with modern flair. Now with six Toto Tumbs branches—alongside the original Hauz Barbers still in operation—we continue to offer premium grooming experiences for clients who value craftsmanship and class.
          </p>
        </div>
        <img
          src="/about2.png"
          alt="About us"
          className="w-full max-w-xs md:max-w-sm lg:max-w-xl h-auto rounded-lg "
        />
      </div>

      {/* Products */}
      <div id="Products" className="w-full flex flex-col justify-center items-center bg-gray-800 py-15">
          <h1 className="text-white text-center my-10 font-extralight tracking-widest text-4xl md:text-5xl" id="Services">
              PRODUCT CATALOG
          </h1>
          <div className="w-full flex flex-row justify-around items-center">
            <button onClick={handlePrev} className="text-2xl font-semibold rounded-full p-2 hover:bg-gray-400 transition ease-in-out">
              <FaChevronLeft className="text-white" size={40}/>
            </button>

            <div className="w-full px-4 md:px-10 gap-5 flex flex-wrap items-center justify-center">
              {visibleProducts && visibleProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-700 block h-[450px] w-[90%] sm:w-[250px] md:w-[300px] p-5 hover:scale-105 hover:shadow-lg transition delay-100 ease-in shadow-inside rounded-lg"
                >
                  <img
                    src={`${baseUrl}/${product.imagePath}`}
                    alt=""
                    className="w-full h-[60%] mb-4 object-cover shadow-lg shadow-gray-700 rounded-md"
                  />
                  <div className="p-2 text-white tracking-tighter">
                    <h1 className="text-lg md:text-xl font-bold">{product.name}</h1>
                    <p className="text-lg font-semibold">₱{product.price}</p>
                    <p>{product.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleNext} className="text-2xl font-semibold rounded-full p-2 hover:bg-gray-400 transition ease-in-out">
              <FaChevronRight className="text-white" size={40} />
            </button>
          </div>
        
        <Link
          to="/"
          className="mt-10 bg-white text-gray-800 py-3 px-8 rounded-sm hover:bg-green-500 tracking-tight transition-colors"
        >
          VIEW ALL
        </Link>
      </div>

      {/* Services */}


      <div className="w-full bg-white flex flex-col px-4 md:px-10 gap-y-4 my-10">
        <h1 className="text-center my-10 font-extralight tracking-widest text-4xl md:text-5xl" id="Services">
            SERVICES WE OFFER
        </h1>
        {services &&
          services.map((service, index) => (
            <div
              key={index}
              className={`w-full shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
            >
              <div className="flex-1">
                <h1 className="font-semibold text-xl">{service?.name}</h1>
                <p className="tracking-tighter text-base">{service?.description}</p>
              </div>
              <p className="text-base font-medium">₱{service?.price}.00 PHP</p>
            </div>
          ))}
      </div>

      {/* Feedback Prompt */}
      <div className="w-full bg-white flex items-center justify-center py-10 px-4">
        <div className="w-full md:w-2/3 lg:w-1/2 bg-gray-200 rounded-lg flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-2xl md:text-4xl font-semibold">Give us your feedback!</h1>
          <p className="text-lg">Help us to find what we could improve!</p>
          <button className="py-3 px-6 my-3 bg-gray-800 text-white hover:bg-black transition-colors">Feedback Form</button>
        </div>
      </div>

      {/* Reviews */}
      <div className="px-4 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="my-6 font-extralight tracking-widest text-3xl md:text-4xl">REVIEWS</h1>
          <Link to="/" className="text-center underline hover:scale-110 transition">
            VIEW MORE
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {feedbacks.map((feeds, index) => (
            <div
              key={index}
              className="w-full sm:w-[300px] h-[300px] flex flex-col gap-y-4 justify-center items-center shadow p-4"
            >
              <Rating name="read-only" value={feeds.rating} readOnly />
              <p className="tracking-tighter text-center">"{feeds.feedback}"</p>
              <h2>-{feeds.customerName}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="w-full flex flex-col justify-center items-center gap-y-4 bg-gray-800 py-10 px-4 mt-10 text-center text-white">
        <h1 className="text-2xl md:text-4xl font-light">Do you want to be always updated?</h1>
        <p className="text-base font-semibold max-w-2xl">
          Be the first to know about new collections and exclusive offers by subscribing to our emails for free
        </p>
        <input type="email" className="w-[400px] px-4 py-4 border border-white rounded-md outline-none shadow-inside" placeholder="Email" />
        <button className="bg-green-700 text-white rounded-full py-3 px-8 hover:bg-green-500 transition ease-in-out">Subscribe</button>
      </div>
    </div>
  );
}