import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdCalendarToday,
  MdPeople,
  MdOutlineLogout,
  MdShoppingCart,
  MdInventory,
  MdDirectionsWalk
} from "react-icons/md";

const FrontDeskSideBar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/front-desk/dashboard" },
    { name: "Appointments", icon: <MdCalendarToday />, path: "/front-desk/appointments" },
    { name: "Barbers", icon: <MdPeople />, path: "/front-desk/barbers" },
    { name: "Customers", icon: <MdPeople />, path: "/front-desk/customers" },
    { name: "Products", icon: <MdInventory />, path: "/front-desk/products" },
    { name: "Sales", icon: <MdShoppingCart />, path: "/front-desk/sales" },
  ];
  
  const handleLogout = () => {
    // Clear token or session logic here
    navigate("/"); // Redirect to login or landing
  };

  return (
    <div className="w-48 h-screen bg-gray-900 text-white flex flex-col justify-between fixed">
      <div>
        <h2 className="text-2xl font-extralight p-4 border-b border-gray-700 tracking-tighter">TOTO TUMBS BARBERSHOP</h2>
        <ul className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 hover:bg-gray-700 tracking-tighter transition ${
                    isActive ? "bg-gray-800" : ""
                  }`
                }
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          <MdOutlineLogout className="text-xl mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default FrontDeskSideBar;
