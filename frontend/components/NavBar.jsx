import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion } from "motion/react";

export default function Navigation() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("Home");
  const [navVisible, setNavVisible] = useState(false);

  const navClicked = (id, route) => {
    setIsActive(id);
    navigate(route || "/");

    setNavVisible(false); // hide sidebar on click (mobile)

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  const toggleNav = () => {
    setNavVisible(prev => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      exit={{ opacity: 0, y: -20 }}
      className="w-screen fixed top-0 z-50 shadow-sm bg-black/90 py-3 px-5 overflow-hidden p-4 text-white"
    >
      <div className="flex items-center justify-between w-full">
        {/* Left: Burger icon (mobile only) */}
        <div className="lg:hidden">
          <button onClick={toggleNav} className="text-black">
            {navVisible ? <FiX size={30} /> : <FiMenu size={30} />}
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex flex-col items-center ml-10 md:ml-20 lg:ml-0">
          <p className="text-sm md:text-md tracking-wider md:tracking-[5px] font-extralight">TOTO TUMBS</p>
          <p className="text-[20px] md:text-[30px] tracking-wider md:tracking-[8px]">BARBERSHOP</p>
        </div>

      <nav>
        <ul
          className={`
            ${navVisible ? "flex" : "hidden"}
            fixed top-[70px] left-0 h-[calc(100vh-70px)]
            flex-col items-center bg-white p-16 space-y-4 text-md tracking-wider
            shadow-2xl transition-all duration-300 ease-in-out
            z-40
            lg:flex lg:static lg:h-auto lg:flex-row lg:items-center lg:justify-center lg:space-y-0 lg:space-x-6 lg:p-0 lg:bg-transparent lg:shadow-none
          `}
        >
          {["Home", "About Us", "Services", "Products"].map(text => (
            <li
              key={text}
              onClick={() => navClicked(text)}
              className="cursor-pointer hover:underline transition"
              style={{ fontWeight: isActive === text ? 600 : 400 }}
            >
              {text}
            </li>
          ))}
          <li
            onClick={() => navClicked("Queueing", "/queueing")}
            className="cursor-pointer hover:underline transition"
            style={{ fontWeight: isActive === "Queueing" ? 600 : 400 }}
          >
            Queueing
          </li>
          <li
            onClick={() => navClicked("Faq", "/faq")}
            className="cursor-pointer hover:underline transition"
            style={{ fontWeight: isActive === "Faq" ? 600 : 400 }}
          >
            FAQ's
          </li>
          <li
            onClick={() => navClicked("Branches", "/branches")}
            className="cursor-pointer hover:underline transition"
            style={{ fontWeight: isActive === "Branches" ? 600 : 400 }}
          >
            Branches
          </li>
        </ul>
      </nav>
      
        {/* Right: Profile icon */}
        <div className="flex gap-x-2">
          <FiUser
            size={30}
            onClick={() => navClicked("Profile", "/profile")}
            className="text-white cursor-pointer"
          />
        </div>
      </div>
    </motion.div>
  );
}
