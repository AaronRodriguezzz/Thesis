import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";

export default function Navigation({ otherPage }) {
  const navigate = useNavigate();

  const navClicked = (id) => {
    if (otherPage) {
      navigate("/"); // navigate to home first
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-screen h-25 sticky top-0 left-0 shadow-sm flex flex-row justify-between items-center py-3 px-5 z-50 bg-white">
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
              className="hover:underline transition duration-200 ease-in-out cursor-pointer"
            >
              {text}
            </li>
          ))}
          <li>
            <Link
              to="/faq"
              className="hover:underline transition duration-200 ease-in-out"
            >
              FAQ's
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:underline transition duration-200 ease-in-out"
            >
              Branches
            </Link>
          </li>
        </ul>
      </nav>

      {/* Icons */}
      <div className="flex flex-row gap-x-2">
        <FiSearch size={30} className="text-gray-500" />
        <FiUser size={30} className="text-gray-500" />
      </div>
    </div>
  );
}
