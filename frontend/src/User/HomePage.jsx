import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../components/NavBar";
import Footer from "../../components/Footer";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import { get_data } from "../../services/GetMethod";

export default function MainPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [services, setServices] = useState(null);
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

  useEffect(() => {
    const get_services = async () => {
      const response = await get_data("/get_data/service");

      console.log(response);
      if (response) {
        setServices(response);
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
    <div className="w-screen h-screen overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <div
        id="Home"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
        className={`h-5/6 w-full flex flex-col justify-center text-white pl-20 bg-cover bg-center z-10 space-y-1 transition ease-in-out`}
      >
        <div className="leading-ti">
          <h1 className="font-bold text-[55px] leading-tight">
            Where Tradition Meets Precision
          </h1>
          <p className="text-[25px] font-extralight leading-tight">
            Book an appointment now
          </p>
        </div>

        <Link
          to="/appointment"
          className="inline-block w-[200px] bg-white text-xl text-gray-900 px-4 py-2 my-2 tracking-wider shadow-md hover:bg-gray-900 hover:text-white transition-colors ease-in-out text-center"
        >
          BOOK
        </Link>
      </div>

      {/* About Us */}
      <div
        id="About Us"
        className="h-3/4 w-full bg-gray-100 flex flex-col items-center justify-center p-5"
      >
        <div className="flex flex-row justify-around items-center">
          <div className="flex flex-col w-[50%] items-start">
            <h1 className="text-center font-semibold text-[50px] ">ABOUT US</h1>
            <p className="text-justify tracking-tight text-md">
              Three years ago, we began as The Hauz Barbers—a neighborhood shop
              with a mission to deliver high-quality grooming with a personal
              touch. Founded by a seasoned barber who once styled celebrities at
              Bruno’s Barbers, our journey has evolved into Toto Tumbs: a brand
              that represents class, elegance, and refined barbering. The shift
              from The Hauz to Toto Tumbs wasn’t just a name change, but a
              transformation in style, ambiance, and service, blending
              traditional techniques with modern flair. Now with six Toto Tumbs
              branches—alongside the original Hauz Barbers still in
              operation—we continue to offer premium grooming experiences for
              clients who value craftsmanship and class.
            </p>
          </div>

          <img
            src="/about2.png"
            alt="About us"
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Products */}
      <div
        id="Products"
        className="min-h-3/4 h-auto w-full flex flex-col justify-center items-center bg-white"
      >
        <div className="w-full gap-5 flex flex-wrap items-center justify-center">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="block h-[450px] w-[350px] hover:scale-105 hover:shadow-lg transition delay-100 ease-in"
              >
                <img
                  src="/product.png"
                  alt="Pomade"
                  className="w-[100%] h-[70%]"
                />
                <div className="p-2">
                  <h1 className="text-[20px] font-semibold">
                    TOTO TUMBS HAIR WAX
                  </h1>
                  <p className="text-[18px]">₱189.00 PHP</p>
                </div>
              </div>
            ))}
        </div>

        <Link
          to="/"
          className="mt-10 bg-gray-800 text-white py-3 px-8 rounded-sm hover:bg-black transition-colors ease-in-out"
        >
          VIEW ALL
        </Link>
      </div>

      {/* Services */}
      <h1 className="text-center my-6 font-extralight tracking-tighter text-[60px] bg-white" id="Services">
        SERVICES WE OFFER
      </h1>

      <div className="w-full h-auto flex flex-col px-10 gap-y-2 my-4">
        {services &&
          services.map((service, index) => (
            <div
              key={index}
              className={`w-full shadow-sm flex flex-row justify-between items-center p-2 ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="block gap-y-2">
                <h1 className="font-semibold text-[22px]">{service?.name}</h1>
                <p className="tracking-tighter text-lg">
                  {service?.description}
                </p>
              </div>

              <p className="tracking-tighter text-lg">
                ₱{service?.price}.00 PHP
              </p>
            </div>
          ))}
      </div>

      {/* Feedback Prompt */}
      <div className="w-full h-1/2 bg-white flex items-center justify-center">
        <div className="w-1/2 h-2/3 bg-gray-200 rounded-lg flex flex-col justify-center items-center">
          <h1 className="text-[45px] font-semibold tracking-tight">
            Give us your feedback!
          </h1>
          <p className="text-lg tracking-tight">
            Help us to find what are we could improve!
          </p>
          <button className="py-3 px-6 my-3 bg-gray-800 text-white hover:bg-black transition-colors ease-in-out">
            Feedback Form
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="px-10 md:px-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="my-6 font-extralight tracking-tighter text-[40px] bg-white">
            REVIEWS
          </h1>
          <Link
            to="/"
            className="h-8 text-center underline hover:scale-110 transition ease-in-out"
          >
            VIEW MORE
          </Link>
        </div>

        <div>
          <div className="flex flex-row items-center justify-center gap-x-4">
            {feedbacks.map((feeds, index) => (
              <div
                key={index}
                className="w-[30%] min-w-[300px] h-[300px] flex flex-col gap-y-4 justify-center items-center shadow p-2"
              >
                <Rating name="read-only" value={feeds.rating} readOnly />
                <p className="tracking-tighter text-lg text-center">
                  "{feeds.feedback}"
                </p>
                <h2>-{feeds.customerName}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="h-1/2 w-full flex flex-col justify-center items-center gap-y-3 bg-gray-100 py-10 mt-10">
        <h1 className="text-center text-[40px] tracking-tight font-extralight ">
          Do you want to be always updated?
        </h1>
        <p className="tracking-tighter text-lg text-center font-semibold">
          Be the first to know about new collections and exclusive offers by
          subscribing to our emails for free
        </p>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          sx={{ width: "350px" }}
        />
        <button className="bg-gray-800 text-white rounded-full py-3 px-8 hover:bg-black">
          Subscribe
        </button>
      </div>

      <Footer />
    </div>
  );
}
