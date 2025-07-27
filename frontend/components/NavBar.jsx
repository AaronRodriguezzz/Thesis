import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { motion } from "motion/react"

export default function Navigation() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('Home');

  const navClicked = (id, route) => {
    setIsActive(id);
    navigate(route ? route : '/');   
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .8, ease: "easeInOut" }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full sticky top-0 z-50 shadow-sm bg-white py-3 px-5 flex justify-between items-center"
    >
      {/* Logo */}
      <div className="flex flex-col items-center">
        <p className="text-md tracking-[5px] font-extralight">TOTO TUMBS</p>
        <p className="text-[30px] tracking-[8px]">BARBERSHOP</p>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="flex space-x-6 text-md tracking-wider">
          {["Home", "About Us", "Services", "Products"].map((text) => (
            <li
              key={text}
              onClick={() => navClicked(text)}
              className="hover:underline hover:font-extrabold  transition duration-200 ease-in-out cursor-pointer"
              style={{  fontWeight: isActive === text ? 600 : 400  }}
            >
              {text}
            </li>
          ))}
          <li 
            onClick={() => navClicked('Faq', '/faq')}
            className="hover:underline transition duration-200 ease-in-out"
            style={{  fontWeight: isActive === 'Faq' ? 600 : 400  }}
          >
            FAQ's
          </li>
          <li 
            onClick={() => navClicked('Branches', '/branches')}
            className="hover:underline transition duration-200 ease-in-out"
            style={{  fontWeight: isActive === 'Branches' ? 600 : 400  }}
          >
            Branches
          </li>
        </ul>
      </nav>

      {/* Icons */}
      <div className="flex flex-row gap-x-2">
        <FiUser size={30} onClick={() => navigate('/profile')} className="text-gray-500" />
      </div>
    </motion.div>
  );
}
