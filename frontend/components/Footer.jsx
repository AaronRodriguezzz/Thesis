import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaCut } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="w-full h-20 shadow flex items-center justify-between px-2 md:px-6 z-50 bg-gray-50">

      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <FaCut size={28} className="text-black" />
        <div className="flex flex-col leading-4">
          <p className="text-sm tracking-widest font-light">TOTO TUMBS</p>
          <p className="text-xl font-semibold tracking-widest">BARBERSHOP</p>
        </div>
      </div>

      {/* Center: Terms & Conditions */}
      <div className="text-center hidden md:block">
        <Link
          to="/terms-and-conditions"
          className="text-sm px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
        >
          Terms & Conditions
        </Link>
      </div>

      {/* Right: Social Icons */}
      <div className="flex items-center gap-2 md:gap-4 text-gray-600">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF size={20} className="hover:text-black transition" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={20} className="hover:text-black transition" />
        </a>  
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={20} className="hover:text-black transition" />
        </a>
      </div>
    </div>
  );
}
