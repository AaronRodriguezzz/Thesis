import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";

export default function Navigation({ otherPage }) {
  const navigate = useNavigate();

  const navClicked = (id) => {
    navigate("/"); // navigate to home first
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  return (
    <div className="w-full sticky top-0 z-50 shadow-sm bg-white py-3 px-5 flex justify-between items-center">
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
              to="/branches"
              className="hover:underline transition duration-200 ease-in-out"
            >
              Branches
            </Link>
          </li>
        </ul>
      </nav>

      {/* Icons */}
      <div className="flex flex-row gap-x-2">
        <FiUser size={30} onClick={() => navigate('/profile')} className="text-gray-500" />
      </div>
    </div>
  );
}
